import { createSeededRng, fnv1aHash } from "./rng";
import type {
  DisputeSide,
  HeroDefinition,
  TournamentFieldKind,
  TournamentThemeId
} from "./types";

export type GroupCode = string; // "A" | "B" | "C" | "D" ...

export const TOURNAMENT_THEME_IDS: readonly TournamentThemeId[] = [
  "myth_bylina",
  "road_sea",
  "tricksters",
  "direct_argument"
] as const;

export function matchesTournamentTheme(
  hero: HeroDefinition,
  themeId: TournamentThemeId
): boolean {
  switch (themeId) {
    case "myth_bylina":
      return hero.corpora.some(
        (c) => c === "hellenic" || c === "norse" || c === "slavic" || c === "chivalry"
      );
    case "road_sea":
      return hero.motifs.includes("voyage");
    case "tricksters":
      return hero.motifs.includes("trickster");
    case "direct_argument":
      return (
        (hero.motifs.includes("reason") || hero.motifs.includes("honor")) &&
        !hero.motifs.includes("trickster")
      );
  }
}

export function getEligibleHeroesForTheme(
  roster: readonly HeroDefinition[],
  fieldKind: TournamentFieldKind,
  themeId: TournamentThemeId | null = null
): HeroDefinition[] {
  if (fieldKind === "open" || !themeId) {
    return [...roster];
  }
  return roster.filter((hero) => matchesTournamentTheme(hero, themeId));
}

export function selectTournamentField(
  entrants: readonly TournamentEntrant[],
  heroById: ReadonlyMap<string, HeroDefinition>,
  options: {
    fieldKind: TournamentFieldKind;
    themeId?: TournamentThemeId | null;
    seed: string;
    fieldSize?: number;
  }
): TournamentEntrant[] {
  const { fieldKind, themeId = null, seed, fieldSize = 16 } = options;
  const eligible = entrants
    .filter((entrant) => {
      if (fieldKind === "open" || !themeId) {
        return true;
      }
      const hero = heroById.get(entrant.heroId);
      return hero ? matchesTournamentTheme(hero, themeId) : false;
    })
    .sort((a, b) => a.heroId.localeCompare(b.heroId));

  if (eligible.length < fieldSize) {
    throw new Error(
      `Theme ${themeId ?? "open"} has only ${eligible.length} eligible heroes (need at least ${fieldSize})`
    );
  }

  const rng = createSeededRng(`${seed}:field:${fieldKind}:${themeId ?? "open"}`);
  return rng.shuffle(eligible).slice(0, fieldSize);
}

export interface TournamentEntrant {
  heroId: string;
  entryRating: number;
}

export interface GroupAssignment {
  groupCode: GroupCode;
  heroId: string;
  potNumber: number; // 1..4
  entryRating: number;
  seedRank: number;
}

export function getGroupCodes(groupCount: number): GroupCode[] {
  return Array.from({ length: groupCount }, (_, i) => String.fromCharCode(65 + i));
}

/**
 * Жеребьёвка корзинами по текущему рейтингу (как на ЧМ):
 * по одному герою из каждой корзины в каждую группу.
 */
export function drawGroupsByPots(
  entrants: readonly TournamentEntrant[],
  seed: string,
  groupCount: number = 4
): GroupAssignment[] {
  if (entrants.length % groupCount !== 0) {
    throw new Error(
      `Entrant count (${entrants.length}) must be divisible by groupCount (${groupCount})`
    );
  }
  const groupCodes = getGroupCodes(groupCount);

  // Сортируем по стартовому рейтингу (при равенстве — детерминированный хеш от сида)
  const sorted = [...entrants].sort((a, b) => {
    if (b.entryRating !== a.entryRating) {
      return b.entryRating - a.entryRating;
    }
    return fnv1aHash(`${seed}:pot-tie:${a.heroId}`) - fnv1aHash(`${seed}:pot-tie:${b.heroId}`);
  });

  const assignments: GroupAssignment[] = [];
  const potsCount = sorted.length / groupCount;

  for (let potIndex = 0; potIndex < potsCount; potIndex += 1) {
    const potNumber = potIndex + 1;
    const potSlice = sorted.slice(potIndex * groupCount, (potIndex + 1) * groupCount);
    const rng = createSeededRng(`${seed}:pot:${potNumber}`);
    const shuffledPot = rng.shuffle(potSlice);

    shuffledPot.forEach((entrant, groupIdx) => {
      assignments.push({
        groupCode: groupCodes[groupIdx]!,
        heroId: entrant.heroId,
        potNumber,
        entryRating: entrant.entryRating,
        seedRank: fnv1aHash(`${seed}:group-seed-lot:${entrant.heroId}`)
      });
    });
  }

  return assignments;
}

export interface ScheduledGroupFixture {
  groupCode: GroupCode;
  dayOffset: number; // 0..5 (6 дней группового этапа, 1 матч на группу в день)
  roundNumber: number; // 1..3
  matchIndexInGroup: number; // 1..6
  heroAId: string;
  heroBId: string;
}

/**
 * Круговой турнир для группы из 4 героев: 6 матчей, растянутых на 6 дней
 * (по 1 диспуту на группу в день).
 */
export function buildGroupRoundRobinSchedule(
  groupCode: GroupCode,
  heroIdsInPotOrder: readonly string[]
): ScheduledGroupFixture[] {
  if (heroIdsInPotOrder.length !== 4) {
    throw new Error(`Expected 4 heroes in group ${groupCode}, got ${heroIdsInPotOrder.length}`);
  }
  const [h1, h2, h3, h4] = heroIdsInPotOrder as [string, string, string, string];

  const pairings: Array<{ round: number; a: string; b: string }> = [
    { round: 1, a: h1, b: h2 },
    { round: 1, a: h3, b: h4 },
    { round: 2, a: h1, b: h3 },
    { round: 2, a: h2, b: h4 },
    { round: 3, a: h4, b: h1 },
    { round: 3, a: h2, b: h3 }
  ];

  return pairings.map((pair, idx) => ({
    groupCode,
    dayOffset: idx,
    roundNumber: pair.round,
    matchIndexInGroup: idx + 1,
    heroAId: pair.a,
    heroBId: pair.b
  }));
}

export interface CompletedGroupMatchRecord {
  heroAId: string;
  heroBId: string;
  acclaimA: number;
  acclaimB: number;
  retentionA: number;
  retentionB: number;
  winnerSide: DisputeSide | null;
}

export type TieBreakKey =
  | "h2hPoints"
  | "h2hDiff"
  | "acclaimDiff"
  | "acclaimFor"
  | "retention"
  | "rating"
  | "seed";

export interface GroupStandingRow {
  rank: number;
  heroId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  acclaimFor: number;
  acclaimAgainst: number;
  acclaimDiff: number;
  retentionFor: number;
  entryRating: number;
  seedRank: number;
  qualified: boolean;
  tieBreakNote: TieBreakKey | null;
}

interface HeadToHeadStat {
  points: number;
  acclaimDiff: number;
}

function computeHeadToHeadAmong(
  subsetIds: ReadonlySet<string>,
  matches: readonly CompletedGroupMatchRecord[]
): Map<string, HeadToHeadStat> {
  const map = new Map<string, HeadToHeadStat>();
  for (const id of subsetIds) {
    map.set(id, { points: 0, acclaimDiff: 0 });
  }

  for (const m of matches) {
    if (!subsetIds.has(m.heroAId) || !subsetIds.has(m.heroBId)) {
      continue;
    }
    const statA = map.get(m.heroAId)!;
    const statB = map.get(m.heroBId)!;

    statA.acclaimDiff += m.acclaimA - m.acclaimB;
    statB.acclaimDiff += m.acclaimB - m.acclaimA;

    if (m.winnerSide === "A") {
      statA.points += 3;
    } else if (m.winnerSide === "B") {
      statB.points += 3;
    } else {
      statA.points += 1;
      statB.points += 1;
    }
  }

  return map;
}

/**
 * Вычисляет таблицу группы по 7 критериям:
 * 1. очки
 * 2. личные встречи среди равенства (очки, затем разница признания)
 * 3. общая разница признания
 * 4. сумма признания
 * 5. сумма удержания
 * 6. рейтинг на старте турнира
 * 7. жребий сида
 */
export function computeGroupStandings(
  groupMembers: readonly GroupAssignment[],
  completedMatches: readonly CompletedGroupMatchRecord[]
): GroupStandingRow[] {
  const rowsById = new Map<string, GroupStandingRow>();

  for (const member of groupMembers) {
    rowsById.set(member.heroId, {
      rank: 0,
      heroId: member.heroId,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      acclaimFor: 0,
      acclaimAgainst: 0,
      acclaimDiff: 0,
      retentionFor: 0,
      entryRating: member.entryRating,
      seedRank: member.seedRank,
      qualified: false,
      tieBreakNote: null
    });
  }

  for (const m of completedMatches) {
    const rowA = rowsById.get(m.heroAId);
    const rowB = rowsById.get(m.heroBId);
    if (!rowA || !rowB) {
      continue;
    }

    rowA.played += 1;
    rowB.played += 1;

    rowA.acclaimFor += m.acclaimA;
    rowA.acclaimAgainst += m.acclaimB;
    rowA.acclaimDiff = rowA.acclaimFor - rowA.acclaimAgainst;
    rowA.retentionFor += m.retentionA;

    rowB.acclaimFor += m.acclaimB;
    rowB.acclaimAgainst += m.acclaimA;
    rowB.acclaimDiff = rowB.acclaimFor - rowB.acclaimAgainst;
    rowB.retentionFor += m.retentionB;

    if (m.winnerSide === "A") {
      rowA.wins += 1;
      rowA.points += 3;
      rowB.losses += 1;
    } else if (m.winnerSide === "B") {
      rowB.wins += 1;
      rowB.points += 3;
      rowA.losses += 1;
    } else {
      rowA.draws += 1;
      rowB.draws += 1;
      rowA.points += 1;
      rowB.points += 1;
    }
  }

  // Группируем по очкам, чтобы корректно считать личные встречи именно среди равенства очков
  const byPoints = new Map<number, GroupStandingRow[]>();
  for (const row of rowsById.values()) {
    const bucket = byPoints.get(row.points) ?? [];
    bucket.push(row);
    byPoints.set(row.points, bucket);
  }

  const pointValuesDesc = [...byPoints.keys()].sort((a, b) => b - a);
  const sortedRows: GroupStandingRow[] = [];

  for (const pts of pointValuesDesc) {
    const bucket = byPoints.get(pts)!;
    if (bucket.length === 1) {
      sortedRows.push(bucket[0]!);
      continue;
    }

    const subsetIds = new Set(bucket.map((r) => r.heroId));
    const h2h = computeHeadToHeadAmong(subsetIds, completedMatches);

    bucket.sort((a, b) => {
      const h2hA = h2h.get(a.heroId)!;
      const h2hB = h2h.get(b.heroId)!;

      if (h2hB.points !== h2hA.points) {
        return h2hB.points - h2hA.points;
      }
      if (h2hB.acclaimDiff !== h2hA.acclaimDiff) {
        return h2hB.acclaimDiff - h2hA.acclaimDiff;
      }
      if (b.acclaimDiff !== a.acclaimDiff) {
        return b.acclaimDiff - a.acclaimDiff;
      }
      if (b.acclaimFor !== a.acclaimFor) {
        return b.acclaimFor - a.acclaimFor;
      }
      if (b.retentionFor !== a.retentionFor) {
        return b.retentionFor - a.retentionFor;
      }
      if (b.entryRating !== a.entryRating) {
        return b.entryRating - a.entryRating;
      }
      return b.seedRank - a.seedRank;
    });

    // Подписываем причину тай-брейка при равенстве очков
    for (let i = 0; i < bucket.length - 1; i += 1) {
      const upper = bucket[i]!;
      const lower = bucket[i + 1]!;
      const hA = h2h.get(upper.heroId)!;
      const hB = h2h.get(lower.heroId)!;

      if (hA.points !== hB.points) {
        upper.tieBreakNote = "h2hPoints";
      } else if (hA.acclaimDiff !== hB.acclaimDiff) {
        upper.tieBreakNote = "h2hDiff";
      } else if (upper.acclaimDiff !== lower.acclaimDiff) {
        upper.tieBreakNote = "acclaimDiff";
      } else if (upper.acclaimFor !== lower.acclaimFor) {
        upper.tieBreakNote = "acclaimFor";
      } else if (upper.retentionFor !== lower.retentionFor) {
        upper.tieBreakNote = "retention";
      } else if (upper.entryRating !== lower.entryRating) {
        upper.tieBreakNote = "rating";
      } else {
        upper.tieBreakNote = "seed";
      }
    }

    sortedRows.push(...bucket);
  }

  sortedRows.forEach((row, idx) => {
    row.rank = idx + 1;
    row.qualified = idx < 2;
  });

  return sortedRows;
}

export type PlayoffSlotCode = "QF1" | "QF2" | "QF3" | "QF4" | "SF1" | "SF2" | "FINAL";

export interface PlayoffBracketBlueprint {
  slotCode: PlayoffSlotCode;
  stage: "qf" | "sf" | "final";
  dayOffset: number; // 6..12 (дни 7..13 турнира)
  sourceLabelA: string;
  sourceLabelB: string;
  dependsOnA: { type: "group"; groupCode: GroupCode; rank: 1 | 2 } | { type: "playoff"; slotCode: PlayoffSlotCode };
  dependsOnB: { type: "group"; groupCode: GroupCode; rank: 1 | 2 } | { type: "playoff"; slotCode: PlayoffSlotCode };
}

export const PLAYOFF_BLUEPRINT: readonly PlayoffBracketBlueprint[] = [
  {
    slotCode: "QF1",
    stage: "qf",
    dayOffset: 6,
    sourceLabelA: "groupPlace:1:A",
    sourceLabelB: "groupPlace:2:B",
    dependsOnA: { type: "group", groupCode: "A", rank: 1 },
    dependsOnB: { type: "group", groupCode: "B", rank: 2 }
  },
  {
    slotCode: "QF2",
    stage: "qf",
    dayOffset: 7,
    sourceLabelA: "groupPlace:1:B",
    sourceLabelB: "groupPlace:2:A",
    dependsOnA: { type: "group", groupCode: "B", rank: 1 },
    dependsOnB: { type: "group", groupCode: "A", rank: 2 }
  },
  {
    slotCode: "QF3",
    stage: "qf",
    dayOffset: 8,
    sourceLabelA: "groupPlace:1:C",
    sourceLabelB: "groupPlace:2:D",
    dependsOnA: { type: "group", groupCode: "C", rank: 1 },
    dependsOnB: { type: "group", groupCode: "D", rank: 2 }
  },
  {
    slotCode: "QF4",
    stage: "qf",
    dayOffset: 9,
    sourceLabelA: "groupPlace:1:D",
    sourceLabelB: "groupPlace:2:C",
    dependsOnA: { type: "group", groupCode: "D", rank: 1 },
    dependsOnB: { type: "group", groupCode: "C", rank: 2 }
  },
  {
    slotCode: "SF1",
    stage: "sf",
    dayOffset: 10,
    sourceLabelA: "pairWinner:1A–2B",
    sourceLabelB: "pairWinner:1C–2D",
    dependsOnA: { type: "playoff", slotCode: "QF1" },
    dependsOnB: { type: "playoff", slotCode: "QF3" }
  },
  {
    slotCode: "SF2",
    stage: "sf",
    dayOffset: 11,
    sourceLabelA: "pairWinner:1B–2A",
    sourceLabelB: "pairWinner:1D–2C",
    dependsOnA: { type: "playoff", slotCode: "QF2" },
    dependsOnB: { type: "playoff", slotCode: "QF4" }
  },
  {
    slotCode: "FINAL",
    stage: "final",
    dayOffset: 12,
    sourceLabelA: "semiWinner:1",
    sourceLabelB: "semiWinner:2",
    dependsOnA: { type: "playoff", slotCode: "SF1" },
    dependsOnB: { type: "playoff", slotCode: "SF2" }
  }
] as const;

export interface ResolvedPlayoffPairing {
  slotCode: PlayoffSlotCode;
  heroAId: string | null;
  heroBId: string | null;
  sourceLabelA: string;
  sourceLabelB: string;
}

export function resolvePlayoffPairings(
  groupStandings: ReadonlyMap<GroupCode, { complete: boolean; rows: readonly GroupStandingRow[] }>,
  playoffWinners: ReadonlyMap<PlayoffSlotCode, string>
): Map<PlayoffSlotCode, ResolvedPlayoffPairing> {
  const result = new Map<PlayoffSlotCode, ResolvedPlayoffPairing>();

  const resolveSide = (
    dep: PlayoffBracketBlueprint["dependsOnA"]
  ): string | null => {
    if (dep.type === "group") {
      const grp = groupStandings.get(dep.groupCode);
      if (!grp || !grp.complete) {
        return null;
      }
      const row = grp.rows.find((r) => r.rank === dep.rank);
      return row?.heroId ?? null;
    }
    return playoffWinners.get(dep.slotCode) ?? null;
  };

  for (const bp of PLAYOFF_BLUEPRINT) {
    result.set(bp.slotCode, {
      slotCode: bp.slotCode,
      heroAId: resolveSide(bp.dependsOnA),
      heroBId: resolveSide(bp.dependsOnB),
      sourceLabelA: bp.sourceLabelA,
      sourceLabelB: bp.sourceLabelB
    });
  }

  return result;
}
