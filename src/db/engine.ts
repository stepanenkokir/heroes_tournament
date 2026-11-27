import { asc, eq } from "drizzle-orm";
import {
  buildGroupRoundRobinSchedule,
  calculateEloUpdate,
  computeGroupStandings,
  drawAnnouncement,
  drawGroupsByPots,
  getGroupCodes,
  HERO_BY_ID,
  HERO_ROSTER,
  INITIAL_ELO_RATING,
  PLAYOFF_BLUEPRINT,
  resolvePlayoffPairings,
  simulateDispute,
  verifyRatingLedger,
  type CompletedGroupMatchRecord,
  type DisputeAnnouncement,
  type DisputeSide,
  type DisputeStage,
  type GroupAssignment,
  type GroupCode,
  type PlayoffSlotCode,
  type SkillDrawOrder
} from "../domain/index";
import type { AppDbBundle } from "./client";
import { addDaysIso, getMoscowTodayIso } from "./dates";
import {
  disputeAnnouncementsTable,
  disputeExchangesTable,
  disputesTable,
  heroesTable,
  ratingEventsTable,
  skillsTable,
  tournamentGroupsTable,
  tournamentParticipantsTable,
  tournamentsTable
} from "./schema";

export interface TournamentEditionSpec {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  editionNumber: number;
  seed: string;
  startDate: string; // YYYY-MM-DD
}

export function clearAllTables(bundle: AppDbBundle): void {
  bundle.sqlite.exec(`
    DELETE FROM rating_events;
    DELETE FROM dispute_exchanges;
    DELETE FROM dispute_announcements;
    DELETE FROM disputes;
    DELETE FROM tournament_participants;
    DELETE FROM tournament_groups;
    DELETE FROM tournaments;
    DELETE FROM skills;
    DELETE FROM heroes;
  `);
}

export function seedRosterIntoDb(bundle: AppDbBundle): void {
  const { db } = bundle;

  for (const hero of HERO_ROSTER) {
    db.insert(heroesTable)
      .values({
        id: hero.id,
        slug: hero.slug,
        name: hero.name,
        origin: hero.origin,
        epithet: hero.epithet,
        emblemKey: hero.emblemKey,
        accentHex: hero.accentHex,
        currentRating: INITIAL_ELO_RATING,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        trophiesCount: 0
      })
      .run();

    for (const skill of [...hero.dominants, ...hero.appeals]) {
      db.insert(skillsTable)
        .values({
          id: skill.id,
          heroId: skill.heroId,
          kind: skill.kind,
          slot: skill.slot,
          title: skill.title,
          description: skill.description,
          domain: skill.domain,
          primaryStat: skill.primaryStat,
          secondaryStat: skill.secondaryStat
        })
        .run();
    }
  }
}

export function createScheduledTournament(
  bundle: AppDbBundle,
  spec: TournamentEditionSpec
): void {
  const { db } = bundle;
  const heroRows = db.select().from(heroesTable).all();

  const entrants = heroRows.map((h) => ({
    heroId: h.id,
    entryRating: h.currentRating
  }));

  const groupAssignments = drawGroupsByPots(entrants, spec.seed, 4);
  const endDate = addDaysIso(spec.startDate, 12);

  db.insert(tournamentsTable)
    .values({
      id: spec.id,
      slug: spec.slug,
      title: spec.title,
      subtitle: spec.subtitle,
      editionNumber: spec.editionNumber,
      seed: spec.seed,
      status: "active",
      startDate: spec.startDate,
      endDate,
      championHeroId: null,
      runnerUpHeroId: null
    })
    .run();

  const groupCodes = getGroupCodes(4);
  for (const code of groupCodes) {
    db.insert(tournamentGroupsTable)
      .values({
        id: `${spec.id}:group:${code}`,
        tournamentId: spec.id,
        groupCode: code,
        title: `Группа ${code}`
      })
      .run();
  }

  for (const ga of groupAssignments) {
    db.insert(tournamentParticipantsTable)
      .values({
        id: `${spec.id}:part:${ga.heroId}`,
        tournamentId: spec.id,
        groupCode: ga.groupCode,
        heroId: ga.heroId,
        potNumber: ga.potNumber,
        entryRating: ga.entryRating,
        seedRank: ga.seedRank
      })
      .run();
  }

  // Строим расписание группового этапа: 6 дней, по 1 диспуту на каждую из 4 групп в день
  const fixturesByGroup = new Map<GroupCode, ReturnType<typeof buildGroupRoundRobinSchedule>>();
  for (const code of groupCodes) {
    const membersInPotOrder = groupAssignments
      .filter((a) => a.groupCode === code)
      .sort((a, b) => a.potNumber - b.potNumber)
      .map((a) => a.heroId);
    fixturesByGroup.set(code, buildGroupRoundRobinSchedule(code, membersInPotOrder));
  }

  let matchOrder = 1;
  for (let dayOffset = 0; dayOffset < 6; dayOffset += 1) {
    const scheduledDate = addDaysIso(spec.startDate, dayOffset);
    for (const code of groupCodes) {
      const fx = fixturesByGroup.get(code)![dayOffset]!;
      const disputeId = `${spec.id}:g:${code}:${fx.matchIndexInGroup}`;
      db.insert(disputesTable)
        .values({
          id: disputeId,
          tournamentId: spec.id,
          stage: "group",
          groupCode: code,
          playoffSlot: null,
          dayOffset,
          scheduledDate,
          matchOrder,
          seed: `${spec.seed}:dispute:${disputeId}`,
          status: "scheduled",
          heroAId: fx.heroAId,
          heroBId: fx.heroBId,
          sourceLabelA: `group:${code}`,
          sourceLabelB: `group:${code}`,
          acclaimA: null,
          acclaimB: null,
          retentionA: null,
          retentionB: null,
          sealedUsed: false,
          decisiveUsed: false,
          decisiveScoreA: 0,
          decisiveScoreB: 0,
          gloryLotUsed: false,
          gloryLotWinner: null,
          resolution: null,
          winnerSide: null,
          winnerHeroId: null
        })
        .run();
      matchOrder += 1;
    }
  }

  // Строим 7 слотов плей-офф (дни 7..13 турнира -> dayOffset 6..12)
  for (const bp of PLAYOFF_BLUEPRINT) {
    const disputeId = `${spec.id}:p:${bp.slotCode.toLowerCase()}`;
    const scheduledDate = addDaysIso(spec.startDate, bp.dayOffset);
    db.insert(disputesTable)
      .values({
        id: disputeId,
        tournamentId: spec.id,
        stage: bp.stage,
        groupCode: null,
        playoffSlot: bp.slotCode,
        dayOffset: bp.dayOffset,
        scheduledDate,
        matchOrder,
        seed: `${spec.seed}:dispute:${disputeId}`,
        status: "scheduled",
        heroAId: null,
        heroBId: null,
        sourceLabelA: bp.sourceLabelA,
        sourceLabelB: bp.sourceLabelB,
        acclaimA: null,
        acclaimB: null,
        retentionA: null,
        retentionB: null,
        sealedUsed: false,
        decisiveUsed: false,
        decisiveScoreA: 0,
        decisiveScoreB: 0,
        gloryLotUsed: false,
        gloryLotWinner: null,
        resolution: null,
        winnerSide: null,
        winnerHeroId: null
      })
      .run();
    matchOrder += 1;
  }
}

function loadAnnouncementFromDb(
  bundle: AppDbBundle,
  disputeId: string,
  seed: string
): DisputeAnnouncement | null {
  const rows = bundle.db
    .select()
    .from(disputeAnnouncementsTable)
    .where(eq(disputeAnnouncementsTable.disputeId, disputeId))
    .orderBy(asc(disputeAnnouncementsTable.slotIndex))
    .all();

  if (rows.length < 10) {
    return null;
  }

  const rowsA = rows.filter((r) => r.side === "A").sort((a, b) => a.slotIndex - b.slotIndex);
  const rowsB = rows.filter((r) => r.side === "B").sort((a, b) => a.slotIndex - b.slotIndex);

  const sideA: SkillDrawOrder = {
    dominantIds: rowsA.map((r) => r.dominantSkillId) as [string, string, string, string, string],
    appealIds: rowsA.map((r) => r.appealSkillId) as [string, string, string, string, string]
  };
  const sideB: SkillDrawOrder = {
    dominantIds: rowsB.map((r) => r.dominantSkillId) as [string, string, string, string, string],
    appealIds: rowsB.map((r) => r.appealSkillId) as [string, string, string, string, string]
  };

  return { seed, sideA, sideB };
}

function ensureDisputeAnnounced(
  bundle: AppDbBundle,
  disputeRow: typeof disputesTable.$inferSelect
): DisputeAnnouncement | null {
  if (!disputeRow.heroAId || !disputeRow.heroBId) {
    return null;
  }

  const existing = loadAnnouncementFromDb(bundle, disputeRow.id, disputeRow.seed);
  if (existing) {
    if (disputeRow.status === "scheduled") {
      bundle.db
        .update(disputesTable)
        .set({ status: "announced" })
        .where(eq(disputesTable.id, disputeRow.id))
        .run();
    }
    return existing;
  }

  const heroA = HERO_BY_ID.get(disputeRow.heroAId);
  const heroB = HERO_BY_ID.get(disputeRow.heroBId);
  if (!heroA || !heroB) {
    throw new Error(`Missing hero definition for ${disputeRow.heroAId} or ${disputeRow.heroBId}`);
  }

  const announcement = drawAnnouncement(heroA, heroB, disputeRow.seed);

  for (let slotIndex = 0; slotIndex < 5; slotIndex += 1) {
    bundle.db
      .insert(disputeAnnouncementsTable)
      .values({
        id: `${disputeRow.id}:ann:A:${slotIndex}`,
        disputeId: disputeRow.id,
        side: "A",
        slotIndex,
        dominantSkillId: announcement.sideA.dominantIds[slotIndex]!,
        appealSkillId: announcement.sideA.appealIds[slotIndex]!,
        isSealed: slotIndex === 2
      })
      .run();

    bundle.db
      .insert(disputeAnnouncementsTable)
      .values({
        id: `${disputeRow.id}:ann:B:${slotIndex}`,
        disputeId: disputeRow.id,
        side: "B",
        slotIndex,
        dominantSkillId: announcement.sideB.dominantIds[slotIndex]!,
        appealSkillId: announcement.sideB.appealIds[slotIndex]!,
        isSealed: slotIndex === 2
      })
      .run();
  }

  bundle.db
    .update(disputesTable)
    .set({ status: "announced" })
    .where(eq(disputesTable.id, disputeRow.id))
    .run();

  return announcement;
}

function refreshPlayoffPairingsForTournament(
  bundle: AppDbBundle,
  tournamentId: string
): void {
  const { db } = bundle;
  const participants = db
    .select()
    .from(tournamentParticipantsTable)
    .where(eq(tournamentParticipantsTable.tournamentId, tournamentId))
    .all();

  const allDisputes = db
    .select()
    .from(disputesTable)
    .where(eq(disputesTable.tournamentId, tournamentId))
    .all();

  const groupCodes = getGroupCodes(4);
  const groupStandingsMap = new Map<
    GroupCode,
    { complete: boolean; rows: ReturnType<typeof computeGroupStandings> }
  >();

  for (const code of groupCodes) {
    const members: GroupAssignment[] = participants
      .filter((p) => p.groupCode === code)
      .map((p) => ({
        groupCode: p.groupCode,
        heroId: p.heroId,
        potNumber: p.potNumber,
        entryRating: p.entryRating,
        seedRank: p.seedRank
      }));

    const groupDisputes = allDisputes.filter((d) => d.stage === "group" && d.groupCode === code);
    const completedGroupDisputes = groupDisputes.filter((d) => d.status === "completed");

    const records: CompletedGroupMatchRecord[] = completedGroupDisputes.map((d) => ({
      heroAId: d.heroAId!,
      heroBId: d.heroBId!,
      acclaimA: d.acclaimA ?? 0,
      acclaimB: d.acclaimB ?? 0,
      retentionA: d.retentionA ?? 0,
      retentionB: d.retentionB ?? 0,
      winnerSide: (d.winnerSide as DisputeSide | null) ?? null
    }));

    groupStandingsMap.set(code, {
      complete: completedGroupDisputes.length === 6,
      rows: computeGroupStandings(members, records)
    });
  }

  const playoffWinners = new Map<PlayoffSlotCode, string>();
  for (const d of allDisputes) {
    if (d.playoffSlot && d.status === "completed" && d.winnerHeroId) {
      playoffWinners.set(d.playoffSlot as PlayoffSlotCode, d.winnerHeroId);
    }
  }

  const resolved = resolvePlayoffPairings(groupStandingsMap, playoffWinners);

  for (const d of allDisputes) {
    if (!d.playoffSlot || d.status === "completed") {
      continue;
    }
    const pair = resolved.get(d.playoffSlot as PlayoffSlotCode);
    if (!pair) {
      continue;
    }
    if (d.heroAId !== pair.heroAId || d.heroBId !== pair.heroBId) {
      db.update(disputesTable)
        .set({
          heroAId: pair.heroAId,
          heroBId: pair.heroBId
        })
        .where(eq(disputesTable.id, d.id))
        .run();
    }
  }
}

function completeDispute(
  bundle: AppDbBundle,
  disputeRow: typeof disputesTable.$inferSelect,
  nextSequenceGetter: () => number
): void {
  const { db } = bundle;
  if (!disputeRow.heroAId || !disputeRow.heroBId) {
    throw new Error(`Cannot complete dispute ${disputeRow.id} without both heroes assigned`);
  }

  const announcement = ensureDisputeAnnounced(bundle, disputeRow);
  if (!announcement) {
    throw new Error(`Failed to announce dispute ${disputeRow.id}`);
  }

  const heroA = HERO_BY_ID.get(disputeRow.heroAId)!;
  const heroB = HERO_BY_ID.get(disputeRow.heroBId)!;

  const sim = simulateDispute({
    heroA,
    heroB,
    stage: disputeRow.stage as DisputeStage,
    seed: disputeRow.seed,
    announcement
  });

  for (const ex of sim.exchanges) {
    db.insert(disputeExchangesTable)
      .values({
        id: `${disputeRow.id}:ex:${ex.step}`,
        disputeId: disputeRow.id,
        step: ex.step,
        phase: ex.phase,
        attackerSide: ex.attackerSide,
        defenderSide: ex.defenderSide,
        dominantSkillId: ex.dominantSkillId,
        appealSkillId: ex.appealSkillId,
        dominantDomain: ex.dominantDomain,
        appealDomain: ex.appealDomain,
        affinity: ex.affinity,
        jitter: ex.jitter,
        rawPress: ex.rawPress,
        effectivePress: ex.effectivePress,
        rawHold: ex.rawHold,
        acclaim: ex.acclaim,
        retention: ex.retention,
        decisiveAccepted: ex.decisiveAccepted
      })
      .run();
  }

  const winnerHeroId =
    sim.winnerSide === "A"
      ? disputeRow.heroAId
      : sim.winnerSide === "B"
        ? disputeRow.heroBId
        : null;

  db.update(disputesTable)
    .set({
      status: "completed",
      acclaimA: sim.acclaimA,
      acclaimB: sim.acclaimB,
      retentionA: sim.retentionA,
      retentionB: sim.retentionB,
      sealedUsed: sim.sealedUsed,
      decisiveUsed: sim.decisiveUsed,
      decisiveScoreA: sim.decisiveScoreA,
      decisiveScoreB: sim.decisiveScoreB,
      gloryLotUsed: sim.gloryLotUsed,
      gloryLotWinner: sim.gloryLotWinner,
      resolution: sim.resolution,
      winnerSide: sim.winnerSide,
      winnerHeroId
    })
    .where(eq(disputesTable.id, disputeRow.id))
    .run();

  // Обновляем рейтинг Эло и пишем пруфы в rating_events
  const heroARow = db
    .select()
    .from(heroesTable)
    .where(eq(heroesTable.id, disputeRow.heroAId))
    .get()!;
  const heroBRow = db
    .select()
    .from(heroesTable)
    .where(eq(heroesTable.id, disputeRow.heroBId))
    .get()!;

  const elo = calculateEloUpdate({
    ratingA: heroARow.currentRating,
    ratingB: heroBRow.currentRating,
    winnerSide: sim.winnerSide,
    stage: disputeRow.stage as DisputeStage
  });

  const seqA = nextSequenceGetter();
  db.insert(ratingEventsTable)
    .values({
      id: `${disputeRow.id}:elo:A`,
      sequence: seqA,
      tournamentId: disputeRow.tournamentId,
      disputeId: disputeRow.id,
      heroId: disputeRow.heroAId,
      opponentHeroId: disputeRow.heroBId,
      stage: disputeRow.stage,
      scheduledDate: disputeRow.scheduledDate,
      ratingBefore: elo.sideA.ratingBefore,
      expectedScore: elo.sideA.expectedScore,
      actualScore: elo.sideA.actualScore,
      kFactor: elo.sideA.kFactor,
      delta: elo.sideA.delta,
      ratingAfter: elo.sideA.ratingAfter
    })
    .run();

  const seqB = nextSequenceGetter();
  db.insert(ratingEventsTable)
    .values({
      id: `${disputeRow.id}:elo:B`,
      sequence: seqB,
      tournamentId: disputeRow.tournamentId,
      disputeId: disputeRow.id,
      heroId: disputeRow.heroBId,
      opponentHeroId: disputeRow.heroAId,
      stage: disputeRow.stage,
      scheduledDate: disputeRow.scheduledDate,
      ratingBefore: elo.sideB.ratingBefore,
      expectedScore: elo.sideB.expectedScore,
      actualScore: elo.sideB.actualScore,
      kFactor: elo.sideB.kFactor,
      delta: elo.sideB.delta,
      ratingAfter: elo.sideB.ratingAfter
    })
    .run();

  const isFinal = disputeRow.stage === "final";

  db.update(heroesTable)
    .set({
      currentRating: elo.sideA.ratingAfter,
      matchesPlayed: heroARow.matchesPlayed + 1,
      wins: heroARow.wins + (sim.winnerSide === "A" ? 1 : 0),
      draws: heroARow.draws + (sim.winnerSide === null ? 1 : 0),
      losses: heroARow.losses + (sim.winnerSide === "B" ? 1 : 0),
      trophiesCount: heroARow.trophiesCount + (isFinal && sim.winnerSide === "A" ? 1 : 0)
    })
    .where(eq(heroesTable.id, disputeRow.heroAId))
    .run();

  db.update(heroesTable)
    .set({
      currentRating: elo.sideB.ratingAfter,
      matchesPlayed: heroBRow.matchesPlayed + 1,
      wins: heroBRow.wins + (sim.winnerSide === "B" ? 1 : 0),
      draws: heroBRow.draws + (sim.winnerSide === null ? 1 : 0),
      losses: heroBRow.losses + (sim.winnerSide === "A" ? 1 : 0),
      trophiesCount: heroBRow.trophiesCount + (isFinal && sim.winnerSide === "B" ? 1 : 0)
    })
    .where(eq(heroesTable.id, disputeRow.heroBId))
    .run();

  if (isFinal && winnerHeroId) {
    const runnerUpHeroId =
      winnerHeroId === disputeRow.heroAId ? disputeRow.heroBId : disputeRow.heroAId;
    db.update(tournamentsTable)
      .set({
        status: "completed",
        championHeroId: winnerHeroId,
        runnerUpHeroId
      })
      .where(eq(tournamentsTable.id, disputeRow.tournamentId))
      .run();
  }
}

export interface TimelineSyncSummary {
  completedNow: number;
  announcedNow: number;
}

/**
 * В одной транзакции:
 * 1) Все диспуты с датой раньше asOfDateIso досчитываются и закрываются (completed).
 * 2) Все диспуты на asOfDateIso получают открытые навыки (announced) без счёта.
 */
export function syncPortalTimeline(
  bundle: AppDbBundle,
  asOfDateIso: string = getMoscowTodayIso()
): TimelineSyncSummary {
  const { sqlite, db } = bundle;
  let completedNow = 0;
  let announcedNow = 0;

  const tx = sqlite.transaction(() => {
    const existingEvents = db
      .select({ sequence: ratingEventsTable.sequence })
      .from(ratingEventsTable)
      .all();
    let maxSequence = existingEvents.reduce((max, r) => Math.max(max, r.sequence), 0);
    const nextSequence = (): number => {
      maxSequence += 1;
      return maxSequence;
    };

    const tournaments = db
      .select()
      .from(tournamentsTable)
      .orderBy(asc(tournamentsTable.editionNumber))
      .all();

    for (const tournament of tournaments) {
      for (let dayOffset = 0; dayOffset <= 12; dayOffset += 1) {
        if (dayOffset >= 6) {
          refreshPlayoffPairingsForTournament(bundle, tournament.id);
        }

        const dayDisputes = db
          .select()
          .from(disputesTable)
          .where(eq(disputesTable.tournamentId, tournament.id))
          .orderBy(asc(disputesTable.matchOrder))
          .all()
          .filter((d) => d.dayOffset === dayOffset);

        for (const dispute of dayDisputes) {
          if (dispute.scheduledDate < asOfDateIso && dispute.status !== "completed") {
            completeDispute(bundle, dispute, nextSequence);
            completedNow += 1;
          } else if (dispute.scheduledDate === asOfDateIso && dispute.status === "scheduled") {
            if (ensureDisputeAnnounced(bundle, dispute)) {
              announcedNow += 1;
            }
          }
        }
      }

      // Финальное обновление сетки плей-офф для отображения уже известных пар
      refreshPlayoffPairingsForTournament(bundle, tournament.id);
    }
  });

  tx();
  return { completedNow, announcedNow };
}

export function buildDefaultTournamentSpecs(todayIso: string): TournamentEditionSpec[] {
  return [
    {
      id: "cup-1",
      slug: "cup-1-winter-cathedral",
      title: "I Кубок: Зимний Собор Идей",
      subtitle: "Первый большой розыгрыш шести доменов среди шестнадцати классических героев",
      editionNumber: 1,
      seed: "heroes-tournament-edition-1-seed-2026",
      startDate: addDaysIso(todayIso, -56)
    },
    {
      id: "cup-2",
      slug: "cup-2-spring-amphora",
      title: "II Кубок: Весенняя Амфора Риторики",
      subtitle: "Второй созыв с посевом по итогам дебютного рейтинга Эло",
      editionNumber: 2,
      seed: "heroes-tournament-edition-2-seed-2026",
      startDate: addDaysIso(todayIso, -38)
    },
    {
      id: "cup-3",
      slug: "cup-3-autumn-meridian",
      title: "III Кубок: Осенний Меридиан Мысли",
      subtitle: "Третий архивный кубок: смена лидеров корзин и новые противостояния в плей-офф",
      editionNumber: 3,
      seed: "heroes-tournament-edition-3-seed-2026",
      startDate: addDaysIso(todayIso, -20)
    },
    {
      id: "cup-4",
      slug: "cup-4-current-grand-dispute",
      title: "IV Кубок: Большой Диспут Наследия",
      subtitle: "Текущий турнир: ежедневные анонсы навыков и борьба за выход из групп",
      editionNumber: 4,
      seed: "heroes-tournament-edition-4-seed-2026",
      startDate: addDaysIso(todayIso, -2)
    }
  ];
}

export function seedFullPortalDatabase(
  bundle: AppDbBundle,
  todayIso: string = getMoscowTodayIso()
): void {
  const { sqlite, db } = bundle;

  const seedTx = sqlite.transaction(() => {
    clearAllTables(bundle);
    seedRosterIntoDb(bundle);

    const specs = buildDefaultTournamentSpecs(todayIso);
    for (const spec of specs) {
      createScheduledTournament(bundle, spec);
      // Прогоняем синхронизацию после каждого кубка, чтобы жеребьёвка следующего
      // кубка использовала актуальный пересчитанный рейтинг Эло героев!
      syncPortalTimeline(bundle, todayIso);
    }
  });

  seedTx();

  // Строгая сверка журнала Эло с хранимым рейтингом каждого героя
  const heroes = db.select().from(heroesTable).all();
  const events = db
    .select()
    .from(ratingEventsTable)
    .orderBy(asc(ratingEventsTable.sequence))
    .all();

  const storedMap = new Map(heroes.map((h) => [h.id, h.currentRating]));
  const verification = verifyRatingLedger(
    heroes.map((h) => h.id),
    events.map((e) => ({
      heroId: e.heroId,
      disputeId: e.disputeId,
      ratingBefore: e.ratingBefore,
      delta: e.delta,
      ratingAfter: e.ratingAfter
    })),
    storedMap,
    INITIAL_ELO_RATING
  );

  if (!verification.valid) {
    throw new Error(`Rating ledger verification failed:\n${verification.mismatches.join("\n")}`);
  }
}
