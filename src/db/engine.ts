import { and, asc, eq } from "drizzle-orm";
import {
  buildGroupRoundRobinSchedule,
  buildProtocolCommentary,
  calculateEloUpdate,
  computeGroupStandings,
  computeVoteSnapshot,
  drawAnnouncement,
  drawGroupsByPots,
  getGroupCodes,
  HERO_BY_ID,
  HERO_ROSTER,
  INITIAL_ELO_RATING,
  PLAYOFF_BLUEPRINT,
  resolvePlayoffPairings,
  selectTournamentField,
  simulateDispute,
  verifyRatingLedger,
  type CompletedGroupMatchRecord,
  type DisputeAnnouncement,
  type DisputeSide,
  type DisputeStage,
  type GroupAssignment,
  type GroupCode,
  type PlayoffSlotCode,
  type SkillDrawOrder,
  type SkillStatKind,
  type SkillStatModifier,
  type TournamentFieldKind,
  type TournamentThemeId,
  type VoteWeight
} from "../domain/index";
import { localizeHero, localizeSkill } from "../i18n/present";
import type { AppDbBundle } from "./client";
import { addDaysIso, getMoscowTodayIso } from "./dates";
import {
  disputeAnnouncementsTable,
  disputeCommentariesTable,
  disputeExchangesTable,
  disputesTable,
  disputeVoteSnapshotsTable,
  disputeVotesTable,
  heroesTable,
  heroSubmissionsTable,
  oauthAccountsTable,
  ratingEventsTable,
  skillsTable,
  tournamentGroupsTable,
  tournamentParticipantsTable,
  tournamentsTable,
  userAchievementsTable,
  usersTable
} from "./schema";

export const REPUTATION_PROPOSAL_THRESHOLD = 3;

export interface TournamentEditionSpec {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  editionNumber: number;
  fieldKind?: TournamentFieldKind;
  themeId?: TournamentThemeId | null;
  seed: string;
  startDate: string; // YYYY-MM-DD
}

export function clearAllTables(bundle: AppDbBundle): void {
  bundle.sqlite.exec(`
    DELETE FROM dispute_commentaries;
    DELETE FROM hero_submissions;
    DELETE FROM user_achievements;
    DELETE FROM dispute_vote_snapshots;
    DELETE FROM dispute_votes;
    DELETE FROM oauth_accounts;
    DELETE FROM users;
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
  const fieldKind: TournamentFieldKind = spec.fieldKind ?? "open";
  const themeId: TournamentThemeId | null = spec.themeId ?? null;

  const allEntrants = heroRows.map((h) => ({
    heroId: h.id,
    entryRating: h.currentRating
  }));

  const selectedEntrants = selectTournamentField(allEntrants, HERO_BY_ID, {
    fieldKind,
    themeId,
    seed: spec.seed,
    fieldSize: 16
  });

  const groupAssignments = drawGroupsByPots(selectedEntrants, spec.seed, 4);
  const endDate = addDaysIso(spec.startDate, 12);

  db.insert(tournamentsTable)
    .values({
      id: spec.id,
      slug: spec.slug,
      title: spec.title,
      subtitle: spec.subtitle,
      editionNumber: spec.editionNumber,
      fieldKind,
      themeId,
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

function ensureAchievement(
  bundle: AppDbBundle,
  userId: string,
  code: string,
  earnedAt: string
): void {
  const id = `${userId}:ach:${code}`;
  const existing = bundle.db
    .select()
    .from(userAchievementsTable)
    .where(eq(userAchievementsTable.id, id))
    .get();
  if (!existing) {
    bundle.db
      .insert(userAchievementsTable)
      .values({ id, userId, code, earnedAt })
      .run();
  }
}

export function upsertOAuthUser(
  bundle: AppDbBundle,
  input: {
    provider: "telegram" | "google" | "vk";
    providerAccountId: string;
    handle: string;
    displayName: string;
    userId?: string;
    nowIso?: string;
  }
): typeof usersTable.$inferSelect {
  const { db } = bundle;
  const nowIso = input.nowIso ?? getMoscowTodayIso();
  const accountId = `${input.provider}:${input.providerAccountId}`;

  const existingAccount = db
    .select()
    .from(oauthAccountsTable)
    .where(eq(oauthAccountsTable.id, accountId))
    .get();

  if (existingAccount) {
    const user = db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, existingAccount.userId))
      .get();
    if (user) {
      return user;
    }
  }

  let userId = input.userId ?? `user:${input.provider}:${input.providerAccountId}`;
  let user = db.select().from(usersTable).where(eq(usersTable.id, userId)).get();

  if (!user) {
    const avatarText = input.displayName.trim().slice(0, 2).toUpperCase() || "УЧ";
    db.insert(usersTable)
      .values({
        id: userId,
        displayName: input.displayName.trim() || input.handle,
        avatarText,
        reputationPoints: 0,
        winsCount: 0,
        votesCount: 0,
        currentStreak: 0,
        bestStreak: 0,
        createdAt: nowIso
      })
      .run();
    user = db.select().from(usersTable).where(eq(usersTable.id, userId)).get()!;
  }

  if (existingAccount) {
    db.update(oauthAccountsTable)
      .set({
        userId: user.id,
        handle: input.handle,
        linkedAt: nowIso
      })
      .where(eq(oauthAccountsTable.id, accountId))
      .run();
  } else {
    db.insert(oauthAccountsTable)
      .values({
        id: accountId,
        userId: user.id,
        provider: input.provider,
        providerAccountId: input.providerAccountId,
        handle: input.handle,
        linkedAt: nowIso
      })
      .run();
  }

  return user;
}

export function castDisputeBallot(
  bundle: AppDbBundle,
  input: {
    disputeId: string;
    userId: string;
    heroId: string;
    skillId: string;
    stat: SkillStatKind;
    weight?: VoteWeight;
    nowIso?: string;
  }
): typeof disputeVotesTable.$inferSelect {
  const { db } = bundle;
  const nowIso = input.nowIso ?? getMoscowTodayIso();
  const weight: VoteWeight = input.weight === 2 ? 2 : 1;

  const user = db.select().from(usersTable).where(eq(usersTable.id, input.userId)).get();
  if (!user) {
    throw new Error("Registered user not found");
  }

  const dispute = db
    .select()
    .from(disputesTable)
    .where(eq(disputesTable.id, input.disputeId))
    .get();
  if (!dispute) {
    throw new Error(`Dispute ${input.disputeId} not found`);
  }
  if (!dispute.heroAId || !dispute.heroBId) {
    throw new Error("Pair is not yet determined for this dispute");
  }
  if (dispute.status !== "scheduled") {
    throw new Error("Voting window is already closed for this dispute");
  }
  if (input.heroId !== dispute.heroAId && input.heroId !== dispute.heroBId) {
    throw new Error("Selected hero is not part of this dispute");
  }

  const heroDef = HERO_BY_ID.get(input.heroId);
  const allHeroSkills = heroDef ? [...heroDef.dominants, ...heroDef.appeals] : [];
  if (!allHeroSkills.some((s) => s.id === input.skillId)) {
    throw new Error("Selected skill does not belong to the chosen hero");
  }

  const ballotId = `${input.disputeId}:vote:${input.userId}`;
  const existing = db
    .select()
    .from(disputeVotesTable)
    .where(eq(disputeVotesTable.id, ballotId))
    .get();

  if (existing) {
    db.update(disputeVotesTable)
      .set({
        heroId: input.heroId,
        skillId: input.skillId,
        stat: input.stat,
        weight,
        updatedAt: nowIso
      })
      .where(eq(disputeVotesTable.id, ballotId))
      .run();
  } else {
    db.insert(disputeVotesTable)
      .values({
        id: ballotId,
        disputeId: input.disputeId,
        userId: input.userId,
        heroId: input.heroId,
        skillId: input.skillId,
        stat: input.stat,
        weight,
        reputationAwarded: false,
        createdAt: nowIso,
        updatedAt: nowIso
      })
      .run();

    const user = db.select().from(usersTable).where(eq(usersTable.id, input.userId)).get();
    if (user) {
      db.update(usersTable)
        .set({ votesCount: user.votesCount + 1 })
        .where(eq(usersTable.id, user.id))
        .run();
      ensureAchievement(bundle, user.id, "first_ballot", nowIso);
    }
  }

  return db
    .select()
    .from(disputeVotesTable)
    .where(eq(disputeVotesTable.id, ballotId))
    .get()!;
}

export function freezeDisputeVoteSnapshot(
  bundle: AppDbBundle,
  disputeId: string,
  frozenAt: string = getMoscowTodayIso()
): SkillStatModifier[] {
  const { db } = bundle;
  const existing = db
    .select()
    .from(disputeVoteSnapshotsTable)
    .where(eq(disputeVoteSnapshotsTable.disputeId, disputeId))
    .all();

  if (existing.length > 0) {
    return existing.map((row) => ({
      skillId: row.skillId,
      stat: row.stat as SkillStatKind,
      appliedBonus: row.appliedBonus
    }));
  }

  const ballots = db
    .select()
    .from(disputeVotesTable)
    .where(eq(disputeVotesTable.disputeId, disputeId))
    .all();

  if (ballots.length === 0) {
    return [];
  }

  const computed = computeVoteSnapshot(
    ballots.map((b) => ({
      userId: b.userId,
      heroId: b.heroId,
      skillId: b.skillId,
      stat: b.stat as SkillStatKind,
      weight: (b.weight === 2 ? 2 : 1) as VoteWeight
    }))
  );

  for (const adj of computed.adjustments) {
    db.insert(disputeVoteSnapshotsTable)
      .values({
        id: `${disputeId}:snap:${adj.skillId}:${adj.stat}`,
        disputeId,
        heroId: adj.heroId,
        skillId: adj.skillId,
        stat: adj.stat,
        totalWeight: adj.totalWeight,
        share: adj.share,
        rawBonus: adj.rawBonus,
        appliedBonus: adj.appliedBonus,
        frozenAt
      })
      .run();
  }

  return computed.adjustments.map((adj) => ({
    skillId: adj.skillId,
    stat: adj.stat,
    appliedBonus: adj.appliedBonus
  }));
}

export function submitUserProposal(
  bundle: AppDbBundle,
  input: {
    userId: string;
    kind: "hero" | "skill";
    targetHeroId?: string | null;
    proposedName: string;
    originOrDomain: string;
    description: string;
    publicDomainAttested: boolean;
    licenseGranted: boolean;
    nowIso?: string;
  }
): typeof heroSubmissionsTable.$inferSelect {
  const { db } = bundle;
  const nowIso = input.nowIso ?? getMoscowTodayIso();

  if (!input.publicDomainAttested || !input.licenseGranted) {
    throw new Error("Both public domain attestation and license grant are required");
  }
  if (input.kind === "skill" && (!input.targetHeroId || !HERO_BY_ID.has(input.targetHeroId))) {
    throw new Error("Valid target hero is required for skill proposal");
  }

  const user = db.select().from(usersTable).where(eq(usersTable.id, input.userId)).get();
  if (!user) {
    throw new Error("User not found");
  }
  if (user.reputationPoints < REPUTATION_PROPOSAL_THRESHOLD) {
    throw new Error(
      `Reputation threshold not reached (${user.reputationPoints}/${REPUTATION_PROPOSAL_THRESHOLD})`
    );
  }

  const tournaments = db
    .select()
    .from(tournamentsTable)
    .orderBy(asc(tournamentsTable.editionNumber))
    .all();
  const activeEdition =
    tournaments.find((t) => t.status === "active")?.editionNumber ??
    tournaments[tournaments.length - 1]?.editionNumber ??
    1;

  const existingThisSeason = db
    .select()
    .from(heroSubmissionsTable)
    .where(
      and(
        eq(heroSubmissionsTable.userId, input.userId),
        eq(heroSubmissionsTable.seasonEdition, activeEdition)
      )
    )
    .get();

  if (existingThisSeason) {
    throw new Error("Season proposal quota is already used");
  }

  const id = `sub:${activeEdition}:${input.userId}`;
  db.insert(heroSubmissionsTable)
    .values({
      id,
      userId: input.userId,
      seasonEdition: activeEdition,
      kind: input.kind,
      targetHeroId: input.kind === "skill" ? (input.targetHeroId ?? null) : null,
      proposedName: input.proposedName.trim(),
      originOrDomain: input.originOrDomain.trim(),
      description: input.description.trim(),
      publicDomainAttested: true,
      licenseGranted: true,
      status: "pending_moderation",
      createdAt: nowIso
    })
    .run();

  ensureAchievement(bundle, user.id, "patron_proposer", nowIso);

  return db.select().from(heroSubmissionsTable).where(eq(heroSubmissionsTable.id, id)).get()!;
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

  freezeDisputeVoteSnapshot(bundle, disputeRow.id, disputeRow.scheduledDate);

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

function settleBallotReputation(
  bundle: AppDbBundle,
  disputeId: string,
  winnerHeroId: string | null,
  settledDateIso: string
): void {
  const { db } = bundle;
  const ballots = db
    .select()
    .from(disputeVotesTable)
    .where(eq(disputeVotesTable.disputeId, disputeId))
    .all();

  for (const ballot of ballots) {
    if (ballot.reputationAwarded) {
      continue;
    }

    const user = db.select().from(usersTable).where(eq(usersTable.id, ballot.userId)).get();
    if (user) {
      const won = winnerHeroId !== null && ballot.heroId === winnerHeroId;
      if (won) {
        const nextRep = user.reputationPoints + 1;
        const nextWins = user.winsCount + 1;
        const nextStreak = user.currentStreak + 1;
        const nextBest = Math.max(user.bestStreak, nextStreak);

        db.update(usersTable)
          .set({
            reputationPoints: nextRep,
            winsCount: nextWins,
            currentStreak: nextStreak,
            bestStreak: nextBest
          })
          .where(eq(usersTable.id, user.id))
          .run();

        ensureAchievement(bundle, user.id, "first_victory", settledDateIso);
        if (nextStreak >= 3) {
          ensureAchievement(bundle, user.id, "streak_3", settledDateIso);
        }
        if (nextWins >= 5) {
          ensureAchievement(bundle, user.id, "oracle_5", settledDateIso);
        }
      } else {
        db.update(usersTable)
          .set({ currentStreak: 0 })
          .where(eq(usersTable.id, user.id))
          .run();
      }
    }

    db.update(disputeVotesTable)
      .set({ reputationAwarded: true })
      .where(eq(disputeVotesTable.id, ballot.id))
      .run();
  }
}

function recordDisputeCommentaries(
  bundle: AppDbBundle,
  disputeId: string,
  heroAId: string,
  heroBId: string,
  sim: ReturnType<typeof simulateDispute>
): void {
  const { db } = bundle;
  const heroA = HERO_BY_ID.get(heroAId)!;
  const heroB = HERO_BY_ID.get(heroBId)!;
  const skillById = new Map(
    [...heroA.dominants, ...heroA.appeals, ...heroB.dominants, ...heroB.appeals].map((s) => [
      s.id,
      s
    ])
  );

  for (const locale of ["ru", "en", "es"] as const) {
    const locA = localizeHero(heroA, locale);
    const locB = localizeHero(heroB, locale);
    const winnerName =
      sim.winnerSide === "A" ? locA.name : sim.winnerSide === "B" ? locB.name : null;

    const exchanges = sim.exchanges.map((ex) => {
      const dom = localizeSkill(skillById.get(ex.dominantSkillId)!, locale);
      const app = localizeSkill(skillById.get(ex.appealSkillId)!, locale);
      return {
        step: ex.step,
        phase: ex.phase,
        attackerName: ex.attackerSide === "A" ? locA.name : locB.name,
        defenderName: ex.defenderSide === "A" ? locA.name : locB.name,
        dominantTitle: dom.title,
        appealTitle: app.title,
        dominantDomain: ex.dominantDomain,
        appealDomain: ex.appealDomain,
        affinity: ex.affinity,
        acclaim: ex.acclaim,
        retention: ex.retention
      };
    });

    const built = buildProtocolCommentary({
      locale,
      heroAName: locA.name,
      heroBName: locB.name,
      acclaimA: sim.acclaimA,
      acclaimB: sim.acclaimB,
      retentionA: sim.retentionA,
      retentionB: sim.retentionB,
      winnerName,
      resolution: sim.resolution,
      exchanges
    });

    db.insert(disputeCommentariesTable)
      .values({
        id: `${disputeId}:comm:${locale}`,
        disputeId,
        locale,
        headline: built.headline,
        summary: built.summary,
        keyTurn: built.keyTurn,
        modelTag: "protocol-analyst-v1"
      })
      .onConflictDoNothing()
      .run();
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

  const modifiers = freezeDisputeVoteSnapshot(bundle, disputeRow.id, disputeRow.scheduledDate);

  const heroA = HERO_BY_ID.get(disputeRow.heroAId)!;
  const heroB = HERO_BY_ID.get(disputeRow.heroBId)!;

  const sim = simulateDispute({
    heroA,
    heroB,
    stage: disputeRow.stage as DisputeStage,
    seed: disputeRow.seed,
    announcement,
    modifiers
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

  settleBallotReputation(bundle, disputeRow.id, winnerHeroId, disputeRow.scheduledDate);
  recordDisputeCommentaries(bundle, disputeRow.id, disputeRow.heroAId, disputeRow.heroBId, sim);

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
 * 2) Все диспуты на asOfDateIso получают открытые навыки (announced) без счёта, а окно голосования закрывается.
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
      subtitle: "Открытый жребий: шестнадцать героев из пула пятидесяти в дебютном созыве",
      editionNumber: 1,
      fieldKind: "open",
      themeId: null,
      seed: "ht-pool50-cup-01-open-2026",
      startDate: addDaysIso(todayIso, -182)
    },
    {
      id: "cup-2",
      slug: "cup-2-ancient-epic-circle",
      title: "II Кубок: Круг Мифа и Былины",
      subtitle: "Тематический созыв: Эллада, Север, славянский эпос и рыцари Круглого стола",
      editionNumber: 2,
      fieldKind: "theme",
      themeId: "myth_bylina",
      seed: "ht-pool50-cup-02-myth-2026",
      startDate: addDaysIso(todayIso, -164)
    },
    {
      id: "cup-3",
      slug: "cup-3-seven-winds-compass",
      title: "III Кубок: Роза Дороги и Моря",
      subtitle: "Тематический созыв: мореходы, странники и искатели дальних берегов",
      editionNumber: 3,
      fieldKind: "theme",
      themeId: "road_sea",
      seed: "ht-pool50-cup-03-voyage-2026",
      startDate: addDaysIso(todayIso, -146)
    },
    {
      id: "cup-4",
      slug: "cup-4-spring-amphora",
      title: "IV Кубок: Весенняя Амфора Риторики",
      subtitle: "Открытый жребий с посевом корзин по накопленному рейтингу Эло",
      editionNumber: 4,
      fieldKind: "open",
      themeId: null,
      seed: "ht-pool50-cup-04-open-2026",
      startDate: addDaysIso(todayIso, -128)
    },
    {
      id: "cup-5",
      slug: "cup-5-carnival-of-riddles",
      title: "V Кубок: Карнавал Плутов и Загадок",
      subtitle: "Тематический созыв: мастера инверсии, притчи и неожиданного хода",
      editionNumber: 5,
      fieldKind: "theme",
      themeId: "tricksters",
      seed: "ht-pool50-cup-05-tricksters-2026",
      startDate: addDaysIso(todayIso, -110)
    },
    {
      id: "cup-6",
      slug: "cup-6-chamber-of-direct-proof",
      title: "VI Кубок: Палата Прямого Довода",
      subtitle: "Тематический созыв: диспутанты строгого разума, слова и чести",
      editionNumber: 6,
      fieldKind: "theme",
      themeId: "direct_argument",
      seed: "ht-pool50-cup-06-reason-2026",
      startDate: addDaysIso(todayIso, -92)
    },
    {
      id: "cup-7",
      slug: "cup-7-summer-solstice-convocation",
      title: "VII Кубок: Созыв Солнцеворота",
      subtitle: "Открытый жребий всех корпусов и мотивов в середине сезона",
      editionNumber: 7,
      fieldKind: "open",
      themeId: null,
      seed: "ht-pool50-cup-07-open-2026",
      startDate: addDaysIso(todayIso, -74)
    },
    {
      id: "cup-8",
      slug: "cup-8-northern-and-bylina-shield",
      title: "VIII Кубок: Щит Саг и Былин",
      subtitle: "Второй тематический созыв мифологических, северных и былинных героев",
      editionNumber: 8,
      fieldKind: "theme",
      themeId: "myth_bylina",
      seed: "ht-pool50-cup-08-myth-2026",
      startDate: addDaysIso(todayIso, -56)
    },
    {
      id: "cup-9",
      slug: "cup-9-autumn-meridian",
      title: "IX Кубок: Осенний Меридиан Мореходов",
      subtitle: "Тематический созыв дороги и моря: дальние маршруты и проверенные кормчие",
      editionNumber: 9,
      fieldKind: "theme",
      themeId: "road_sea",
      seed: "ht-pool50-cup-09-voyage-2026",
      startDate: addDaysIso(todayIso, -38)
    },
    {
      id: "cup-10",
      slug: "cup-10-lantern-of-paradoxes",
      title: "X Кубок: Фонарь Парадоксов",
      subtitle: "Тематический созыв плутов и рассказчиков перед большим открытым турниром",
      editionNumber: 10,
      fieldKind: "theme",
      themeId: "tricksters",
      seed: "ht-pool50-cup-10-tricksters-2026",
      startDate: addDaysIso(todayIso, -20)
    },
    {
      id: "cup-11",
      slug: "cup-11-current-grand-dispute",
      title: "XI Кубок: Большой Диспут Наследия",
      subtitle: "Текущий открытый турнир: ежедневные анонсы, голосование за статы и борьба в группах",
      editionNumber: 11,
      fieldKind: "open",
      themeId: null,
      seed: "ht-pool50-cup-11-open-2026",
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
    throw new Error(`Rating ledger verification failed: ${verification.mismatches.join("; ")}`);
  }
}
