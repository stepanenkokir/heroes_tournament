import { asc, desc, eq } from "drizzle-orm";
import {
  computeGroupStandings,
  getGroupCodes,
  INITIAL_ELO_RATING,
  PLAYOFF_BLUEPRINT,
  verifyRatingLedger,
  type CompletedGroupMatchRecord,
  type DisputeSide,
  type GroupAssignment,
  type GroupStandingRow
} from "../domain/index";
import { getGlobalDbBundle, type AppDbBundle } from "./client";
import {
  disputeAnnouncementsTable,
  disputeExchangesTable,
  disputesTable,
  heroesTable,
  ratingEventsTable,
  skillsTable,
  tournamentParticipantsTable,
  tournamentsTable
} from "./schema";

export type HeroRow = typeof heroesTable.$inferSelect;
export type SkillRow = typeof skillsTable.$inferSelect;
export type TournamentRow = typeof tournamentsTable.$inferSelect;
export type DisputeRow = typeof disputesTable.$inferSelect;
export type ExchangeRow = typeof disputeExchangesTable.$inferSelect;
export type RatingEventRow = typeof ratingEventsTable.$inferSelect;

export interface AnnouncedSkillPairView {
  slotIndex: number;
  isSealed: boolean;
  dominant: SkillRow;
  appeal: SkillRow;
}

export interface DisputeCardView {
  dispute: DisputeRow;
  tournament: TournamentRow;
  heroA: HeroRow | null;
  heroB: HeroRow | null;
  announcedA: AnnouncedSkillPairView[];
  announcedB: AnnouncedSkillPairView[];
}

export interface GroupTableView {
  groupCode: string;
  standings: Array<
    GroupStandingRow & {
      hero: HeroRow;
      potNumber: number;
    }
  >;
  disputes: DisputeCardView[];
}

export interface TournamentFullView {
  tournament: TournamentRow;
  champion: HeroRow | null;
  runnerUp: HeroRow | null;
  groups: GroupTableView[];
  playoffs: Array<{
    card: DisputeCardView;
  }>;
  days: Array<{
    dayOffset: number;
    dayNumber: number;
    scheduledDate: string;
    isToday: boolean;
    disputes: DisputeCardView[];
  }>;
}

function getReadyDb(): AppDbBundle {
  return getGlobalDbBundle();
}

function buildMaps(bundle = getReadyDb()) {
  const { db } = bundle;
  const heroes = db.select().from(heroesTable).all();
  const skills = db.select().from(skillsTable).all();
  const tournaments = db
    .select()
    .from(tournamentsTable)
    .orderBy(asc(tournamentsTable.editionNumber))
    .all();

  const heroMap = new Map(heroes.map((h) => [h.id, h]));
  const skillMap = new Map(skills.map((s) => [s.id, s]));
  const tournamentMap = new Map(tournaments.map((t) => [t.id, t]));

  return { bundle, db, heroes, skills, tournaments, heroMap, skillMap, tournamentMap };
}

function hydrateDisputeCard(
  dispute: DisputeRow,
  announcementRows: Array<typeof disputeAnnouncementsTable.$inferSelect>,
  heroMap: ReadonlyMap<string, HeroRow>,
  skillMap: ReadonlyMap<string, SkillRow>,
  tournamentMap: ReadonlyMap<string, TournamentRow>
): DisputeCardView {
  const forDispute = announcementRows
    .filter((a) => a.disputeId === dispute.id && a.slotIndex <= 2)
    .sort((a, b) => a.slotIndex - b.slotIndex);

  const mapSide = (side: "A" | "B"): AnnouncedSkillPairView[] =>
    forDispute
      .filter((r) => r.side === side)
      .map((r) => ({
        slotIndex: r.slotIndex,
        isSealed: r.isSealed,
        dominant: skillMap.get(r.dominantSkillId)!,
        appeal: skillMap.get(r.appealSkillId)!
      }));

  return {
    dispute,
    tournament: tournamentMap.get(dispute.tournamentId)!,
    heroA: dispute.heroAId ? (heroMap.get(dispute.heroAId) ?? null) : null,
    heroB: dispute.heroBId ? (heroMap.get(dispute.heroBId) ?? null) : null,
    announcedA: mapSide("A"),
    announcedB: mapSide("B")
  };
}

export function getHomePortalData(bundle = getReadyDb()) {
  const { db, tournaments, heroMap, skillMap, tournamentMap } = buildMaps(bundle);

  const activeTournament =
    tournaments.find((t) => t.status === "active") ?? tournaments[tournaments.length - 1] ?? null;
  const completedTournaments = tournaments
    .filter((t) => t.status === "completed")
    .sort((a, b) => b.editionNumber - a.editionNumber);

  const allActiveDisputes = activeTournament
    ? db
        .select()
        .from(disputesTable)
        .where(eq(disputesTable.tournamentId, activeTournament.id))
        .orderBy(asc(disputesTable.matchOrder))
        .all()
    : [];

  const announcementRows = db.select().from(disputeAnnouncementsTable).all();

  const todayIso =
    allActiveDisputes.find((d) => d.status === "announced")?.scheduledDate ?? null;

  const todayDisputes = todayIso
    ? allActiveDisputes
        .filter((d) => d.status === "announced" && d.scheduledDate === todayIso)
        .map((d) => hydrateDisputeCard(d, announcementRows, heroMap, skillMap, tournamentMap))
    : [];

  const recentDisputes = allActiveDisputes
    .filter((d) => d.status === "completed")
    .slice(-4)
    .reverse()
    .map((d) => hydrateDisputeCard(d, announcementRows, heroMap, skillMap, tournamentMap));

  const topHeroes = [...heroMap.values()]
    .sort((a, b) => b.currentRating - a.currentRating || b.wins - a.wins)
    .slice(0, 6);

  return {
    todayIso,
    activeTournament,
    todayDisputes,
    recentDisputes,
    completedTournaments: completedTournaments.map((t) => ({
      tournament: t,
      champion: t.championHeroId ? (heroMap.get(t.championHeroId) ?? null) : null,
      runnerUp: t.runnerUpHeroId ? (heroMap.get(t.runnerUpHeroId) ?? null) : null
    })),
    topHeroes
  };
}

export function getAllTournamentsSummary(bundle = getReadyDb()) {
  const { tournaments, heroMap } = buildMaps(bundle);
  return tournaments.map((t) => ({
    tournament: t,
    champion: t.championHeroId ? (heroMap.get(t.championHeroId) ?? null) : null,
    runnerUp: t.runnerUpHeroId ? (heroMap.get(t.runnerUpHeroId) ?? null) : null
  }));
}

export function getTournamentFullView(
  slugOrActive: string | "active",
  bundle = getReadyDb()
): TournamentFullView | null {
  const { db, tournaments, heroMap, skillMap, tournamentMap } = buildMaps(bundle);

  const tournament =
    slugOrActive === "active"
      ? (tournaments.find((t) => t.status === "active") ?? tournaments[tournaments.length - 1])
      : tournaments.find((t) => t.slug === slugOrActive || t.id === slugOrActive);

  if (!tournament) {
    return null;
  }

  const participants = db
    .select()
    .from(tournamentParticipantsTable)
    .where(eq(tournamentParticipantsTable.tournamentId, tournament.id))
    .all();

  const disputeRows = db
    .select()
    .from(disputesTable)
    .where(eq(disputesTable.tournamentId, tournament.id))
    .orderBy(asc(disputesTable.matchOrder))
    .all();

  const announcedDateIso =
    disputeRows.find((d) => d.status === "announced")?.scheduledDate ?? null;

  const announcementRows = db.select().from(disputeAnnouncementsTable).all();
  const cards = disputeRows.map((d) =>
    hydrateDisputeCard(d, announcementRows, heroMap, skillMap, tournamentMap)
  );

  const groups: GroupTableView[] = [];
  for (const code of getGroupCodes(4)) {
    const groupParticipants = participants.filter((p) => p.groupCode === code);
    const potByHero = new Map(groupParticipants.map((p) => [p.heroId, p.potNumber]));

    const members: GroupAssignment[] = groupParticipants.map((p) => ({
      groupCode: p.groupCode,
      heroId: p.heroId,
      potNumber: p.potNumber,
      entryRating: p.entryRating,
      seedRank: p.seedRank
    }));

    const groupCards = cards.filter(
      (c) => c.dispute.stage === "group" && c.dispute.groupCode === code
    );

    const completedRecords: CompletedGroupMatchRecord[] = groupCards
      .filter((c) => c.dispute.status === "completed")
      .map((c) => ({
        heroAId: c.dispute.heroAId!,
        heroBId: c.dispute.heroBId!,
        acclaimA: c.dispute.acclaimA ?? 0,
        acclaimB: c.dispute.acclaimB ?? 0,
        retentionA: c.dispute.retentionA ?? 0,
        retentionB: c.dispute.retentionB ?? 0,
        winnerSide: (c.dispute.winnerSide as DisputeSide | null) ?? null
      }));

    const rawStandings = computeGroupStandings(members, completedRecords);

    groups.push({
      groupCode: code,
      standings: rawStandings.map((row) => ({
        ...row,
        hero: heroMap.get(row.heroId)!,
        potNumber: potByHero.get(row.heroId) ?? 1
      })),
      disputes: groupCards
    });
  }

  const playoffs = PLAYOFF_BLUEPRINT.map((bp) => {
    const found = cards.find((c) => c.dispute.playoffSlot === bp.slotCode)!;
    return {
      card: found
    };
  });

  const days = Array.from({ length: 13 }, (_, dayOffset) => {
    const dayCards = cards.filter((c) => c.dispute.dayOffset === dayOffset);
    const scheduledDate = dayCards[0]?.dispute.scheduledDate ?? tournament.startDate;

    return {
      dayOffset,
      dayNumber: dayOffset + 1,
      scheduledDate,
      isToday: announcedDateIso !== null && scheduledDate === announcedDateIso,
      disputes: dayCards
    };
  });

  return {
    tournament,
    champion: tournament.championHeroId ? (heroMap.get(tournament.championHeroId) ?? null) : null,
    runnerUp: tournament.runnerUpHeroId ? (heroMap.get(tournament.runnerUpHeroId) ?? null) : null,
    groups,
    playoffs,
    days
  };
}

export function getDisputeProtocolView(disputeId: string) {
  const { db, heroMap, skillMap, tournamentMap } = buildMaps();

  const dispute = db.select().from(disputesTable).where(eq(disputesTable.id, disputeId)).get();
  if (!dispute) {
    return null;
  }

  const announcementRows = db
    .select()
    .from(disputeAnnouncementsTable)
    .where(eq(disputeAnnouncementsTable.disputeId, dispute.id))
    .orderBy(asc(disputeAnnouncementsTable.slotIndex))
    .all();

  const card = hydrateDisputeCard(dispute, announcementRows, heroMap, skillMap, tournamentMap);

  const exchangeRows = db
    .select()
    .from(disputeExchangesTable)
    .where(eq(disputeExchangesTable.disputeId, dispute.id))
    .orderBy(asc(disputeExchangesTable.step))
    .all();

  const exchanges = exchangeRows.map((ex) => ({
    row: ex,
    dominantSkill: skillMap.get(ex.dominantSkillId)!,
    appealSkill: skillMap.get(ex.appealSkillId)!
  }));

  const ratingEvents = db
    .select()
    .from(ratingEventsTable)
    .where(eq(ratingEventsTable.disputeId, dispute.id))
    .all();

  const eloA = dispute.heroAId
    ? (ratingEvents.find((e) => e.heroId === dispute.heroAId) ?? null)
    : null;
  const eloB = dispute.heroBId
    ? (ratingEvents.find((e) => e.heroId === dispute.heroBId) ?? null)
    : null;

  return {
    card,
    exchanges,
    eloA,
    eloB
  };
}

export function getRatingsLeaderboardView() {
  const { db, heroes, heroMap, tournamentMap } = buildMaps();
  const allEvents = db
    .select()
    .from(ratingEventsTable)
    .orderBy(asc(ratingEventsTable.sequence))
    .all();

  const storedMap = new Map(heroes.map((h) => [h.id, h.currentRating]));
  const verification = verifyRatingLedger(
    heroes.map((h) => h.id),
    allEvents.map((e) => ({
      heroId: e.heroId,
      disputeId: e.disputeId,
      ratingBefore: e.ratingBefore,
      delta: e.delta,
      ratingAfter: e.ratingAfter
    })),
    storedMap,
    INITIAL_ELO_RATING
  );

  const sortedHeroes = [...heroes].sort(
    (a, b) =>
      b.currentRating - a.currentRating ||
      b.trophiesCount - a.trophiesCount ||
      b.wins - a.wins
  );

  const rows = sortedHeroes.map((hero, idx) => {
    const heroEvents = allEvents.filter((e) => e.heroId === hero.id);
    const lastFive = heroEvents.slice(-5).map((e) => ({
      event: e,
      opponent: heroMap.get(e.opponentHeroId)!,
      tournament: tournamentMap.get(e.tournamentId)!
    }));
    const netDelta = hero.currentRating - INITIAL_ELO_RATING;
    const peakRating = heroEvents.reduce(
      (max, e) => Math.max(max, e.ratingAfter),
      INITIAL_ELO_RATING
    );

    return {
      rank: idx + 1,
      hero,
      netDelta,
      peakRating,
      lastFive,
      totalEventsCount: heroEvents.length
    };
  });

  return {
    rows,
    verification: {
      valid: verification.valid,
      totalEvents: allEvents.length,
      initialRating: INITIAL_ELO_RATING
    }
  };
}

export function getHeroProfileView(slug: string) {
  const { db, heroes, skills, heroMap, tournamentMap } = buildMaps();
  const hero = heroes.find((h) => h.slug === slug || h.id === slug);
  if (!hero) {
    return null;
  }

  const sortedHeroes = [...heroes].sort(
    (a, b) => b.currentRating - a.currentRating || b.wins - a.wins
  );
  const rank = sortedHeroes.findIndex((h) => h.id === hero.id) + 1;

  const heroSkills = skills
    .filter((s) => s.heroId === hero.id)
    .sort((a, b) => a.slot - b.slot);

  const dominants = heroSkills.filter((s) => s.kind === "dominant");
  const appeals = heroSkills.filter((s) => s.kind === "appeal");

  const ledgerRows = db
    .select()
    .from(ratingEventsTable)
    .where(eq(ratingEventsTable.heroId, hero.id))
    .orderBy(desc(ratingEventsTable.sequence))
    .all();

  const disputes = db.select().from(disputesTable).all();
  const disputeMap = new Map(disputes.map((d) => [d.id, d]));

  const ledger = ledgerRows.map((ev) => ({
    event: ev,
    opponent: heroMap.get(ev.opponentHeroId)!,
    tournament: tournamentMap.get(ev.tournamentId)!,
    dispute: disputeMap.get(ev.disputeId)!
  }));

  // Анонсированный сегодняшний матч с участием героя, если есть
  const activeDisputes = disputes.filter(
    (d) => d.status === "announced" && (d.heroAId === hero.id || d.heroBId === hero.id)
  );

  return {
    hero,
    rank,
    dominants,
    appeals,
    ledger,
    activeDisputes
  };
}
