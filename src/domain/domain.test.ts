import { describe, expect, it } from "vitest";
import {
  calculateEloUpdate,
  computeGroupStandings,
  drawGroupsByPots,
  EMBLEM_DESCRIPTORS,
  evaluateExchange,
  getDomainAffinity,
  HERO_ROSTER,
  INITIAL_ELO_RATING,
  resolvePlayoffPairings,
  simulateDispute,
  verifyRatingLedger,
  type GroupAssignment,
  type HeroDefinition,
  type HeroSkill
} from "./index.js";

function makeHero(
  id: string,
  domain: HeroSkill["domain"],
  primary: number,
  secondary: number
): HeroDefinition {
  const dominants: HeroSkill[] = Array.from({ length: 5 }, (_, i) => ({
    id: `${id}-dom-${i + 1}`,
    heroId: id,
    kind: "dominant",
    slot: i + 1,
    title: `Доминанта ${i + 1}`,
    description: `Довод ${i + 1}`,
    domain,
    primaryStat: primary,
    secondaryStat: secondary
  }));

  const appeals: HeroSkill[] = Array.from({ length: 5 }, (_, i) => ({
    id: `${id}-app-${i + 1}`,
    heroId: id,
    kind: "appeal",
    slot: i + 1,
    title: `Апелляция ${i + 1}`,
    description: `Ответ ${i + 1}`,
    domain,
    primaryStat: primary,
    secondaryStat: secondary
  }));

  return {
    id,
    slug: id,
    name: id,
    origin: "Тест",
    epithet: "Испытатель",
    emblemKey: "owl",
    accentHex: "#b8442a",
    dominants,
    appeals
  };
}

describe("Формула диспута и домены", () => {
  it("соблюдает кольцо доменов: каждый одолевает следующий и уступает предыдущему", () => {
    expect(getDomainAffinity("reason", "word")).toBe(1.2);
    expect(getDomainAffinity("word", "reason")).toBe(0.8);
    expect(getDomainAffinity("honor", "reason")).toBe(1.2);
    expect(getDomainAffinity("reason", "honor")).toBe(0.8);
    expect(getDomainAffinity("reason", "will")).toBe(1);
  });

  it("соблюдает границы формулы: признание >= 0, удержание не превышает давление и защиту", () => {
    const heroWeak = makeHero("weak", "word", 30, 30);
    const heroStrong = makeHero("strong", "reason", 90, 90);

    // Слабая доминанта против сильной апелляции: признание не уходит в минус
    const heldOff = evaluateExchange({
      step: 1,
      phase: "main",
      attackerSide: "A",
      dominant: heroWeak.dominants[0]!,
      appeal: heroStrong.appeals[0]!,
      seed: "boundary-1"
    });
    expect(heldOff.acclaim).toBe(0);
    expect(heldOff.retention).toBeLessThanOrEqual(Math.round(heldOff.effectivePress));
    expect(heldOff.retention).toBeLessThanOrEqual(Math.round(heldOff.rawHold));

    // Сильная доминанта против слабой апелляции
    const breakthrough = evaluateExchange({
      step: 2,
      phase: "main",
      attackerSide: "B",
      dominant: heroStrong.dominants[0]!,
      appeal: heroWeak.appeals[0]!,
      seed: "boundary-2"
    });
    expect(breakthrough.acclaim).toBeGreaterThan(0);
    expect(breakthrough.retention).toBeLessThanOrEqual(Math.round(breakthrough.effectivePress));
    expect(breakthrough.retention).toBeLessThanOrEqual(Math.round(breakthrough.rawHold));
  });

  it("гарантирует полный детерминизм сида", () => {
    const heroA = makeHero("odysseus", "reason", 78, 84);
    const heroB = makeHero("sherlock", "word", 76, 82);

    const run1 = simulateDispute({
      heroA,
      heroB,
      stage: "qf",
      seed: "cup-1-qf-1"
    });
    const run2 = simulateDispute({
      heroA,
      heroB,
      stage: "qf",
      seed: "cup-1-qf-1"
    });

    expect(run1).toEqual(run2);
  });

  it("допускает ничью в группе, когда апелляции полностью сдерживают доминанты", () => {
    const wallA = makeHero("wall-a", "will", 30, 30);
    wallA.appeals.forEach((a) => {
      a.primaryStat = 90;
      a.secondaryStat = 90;
    });
    const wallB = makeHero("wall-b", "will", 30, 30);
    wallB.appeals.forEach((a) => {
      a.primaryStat = 90;
      a.secondaryStat = 90;
    });

    const groupMatch = simulateDispute({
      heroA: wallA,
      heroB: wallB,
      stage: "group",
      seed: "group-draw-seed"
    });

    expect(groupMatch.acclaimA).toBe(0);
    expect(groupMatch.acclaimB).toBe(0);
    expect(groupMatch.winnerSide).toBeNull();
    expect(groupMatch.exchanges).toHaveLength(4);
  });

  it("в плей-офф всегда называет победителя даже при полном равенстве обменов", () => {
    const wallA = makeHero("wall-a", "will", 30, 30);
    wallA.appeals.forEach((a) => {
      a.primaryStat = 90;
      a.secondaryStat = 90;
    });
    const wallB = makeHero("wall-b", "will", 30, 30);
    wallB.appeals.forEach((a) => {
      a.primaryStat = 90;
      a.secondaryStat = 90;
    });

    const playoffMatch = simulateDispute({
      heroA: wallA,
      heroB: wallB,
      stage: "sf",
      seed: "playoff-never-ties"
    });

    expect(playoffMatch.sealedUsed).toBe(true);
    expect(playoffMatch.decisiveUsed).toBe(true);
    expect(playoffMatch.gloryLotUsed).toBe(true);
    expect(playoffMatch.winnerSide).not.toBeNull();
    expect(playoffMatch.resolution).toBe("glory_lot");
  });
});

describe("Таблицы групп, тай-брейки и сетка плей-офф", () => {
  const members: GroupAssignment[] = [
    { groupCode: "A", heroId: "h1", potNumber: 1, entryRating: 1560, seedRank: 40 },
    { groupCode: "A", heroId: "h2", potNumber: 2, entryRating: 1520, seedRank: 30 },
    { groupCode: "A", heroId: "h3", potNumber: 3, entryRating: 1500, seedRank: 20 },
    { groupCode: "A", heroId: "h4", potNumber: 4, entryRating: 1480, seedRank: 10 }
  ];

  it("разрешает равенство очков по личной встрече, затем по разнице признания и удержанию", () => {
    // h1 и h2 набрали по 6 очков, но h2 победил h1 в личной встрече
    const standings = computeGroupStandings(members, [
      {
        heroAId: "h1",
        heroBId: "h2",
        acclaimA: 10,
        acclaimB: 18,
        retentionA: 50,
        retentionB: 55,
        winnerSide: "B"
      },
      {
        heroAId: "h1",
        heroBId: "h3",
        acclaimA: 30,
        acclaimB: 5,
        retentionA: 60,
        retentionB: 40,
        winnerSide: "A"
      },
      {
        heroAId: "h1",
        heroBId: "h4",
        acclaimA: 25,
        acclaimB: 8,
        retentionA: 60,
        retentionB: 40,
        winnerSide: "A"
      },
      {
        heroAId: "h2",
        heroBId: "h3",
        acclaimA: 20,
        acclaimB: 10,
        retentionA: 50,
        retentionB: 45,
        winnerSide: "A"
      },
      {
        heroAId: "h2",
        heroBId: "h4",
        acclaimA: 12,
        acclaimB: 22,
        retentionA: 45,
        retentionB: 52,
        winnerSide: "B"
      },
      {
        heroAId: "h3",
        heroBId: "h4",
        acclaimA: 14,
        acclaimB: 14,
        retentionA: 70,
        retentionB: 50,
        winnerSide: null
      }
    ]);

    expect(standings[0]?.heroId).toBe("h2");
    expect(standings[1]?.heroId).toBe("h1");
    expect(standings[0]?.qualified).toBe(true);
    expect(standings[1]?.qualified).toBe(true);
    expect(standings[0]?.tieBreakNote).toBe("h2hPoints");
  });

  it("выводит 1-е и 2-е места групп в четвертьфиналы 1A-2B, 1B-2A, 1C-2D, 1D-2C", () => {
    const makeGroupRows = (first: string, second: string) => ({
      complete: true,
      rows: [
        {
          rank: 1,
          heroId: first,
          played: 3,
          wins: 3,
          draws: 0,
          losses: 0,
          points: 9,
          acclaimFor: 60,
          acclaimAgainst: 30,
          acclaimDiff: 30,
          retentionFor: 120,
          entryRating: 1500,
          seedRank: 1,
          qualified: true,
          tieBreakNote: null
        },
        {
          rank: 2,
          heroId: second,
          played: 3,
          wins: 2,
          draws: 0,
          losses: 1,
          points: 6,
          acclaimFor: 45,
          acclaimAgainst: 35,
          acclaimDiff: 10,
          retentionFor: 110,
          entryRating: 1500,
          seedRank: 2,
          qualified: true,
          tieBreakNote: null
        }
      ]
    });

    const groups = new Map([
      ["A", makeGroupRows("A1", "A2")],
      ["B", makeGroupRows("B1", "B2")],
      ["C", makeGroupRows("C1", "C2")],
      ["D", makeGroupRows("D1", "D2")]
    ]);

    const resolved = resolvePlayoffPairings(groups, new Map());

    expect(resolved.get("QF1")).toMatchObject({ heroAId: "A1", heroBId: "B2" });
    expect(resolved.get("QF2")).toMatchObject({ heroAId: "B1", heroBId: "A2" });
    expect(resolved.get("QF3")).toMatchObject({ heroAId: "C1", heroBId: "D2" });
    expect(resolved.get("QF4")).toMatchObject({ heroAId: "D1", heroBId: "C2" });
    expect(resolved.get("SF1")).toMatchObject({ heroAId: null, heroBId: null });
  });

  it("раскладывает 16 героев по 4 корзинам в 4 группы", () => {
    const entrants = Array.from({ length: 16 }, (_, idx) => ({
      heroId: `hero-${idx + 1}`,
      entryRating: 1600 - idx * 10
    }));
    const drawn = drawGroupsByPots(entrants, "world-cup-seed", 4);
    expect(drawn).toHaveLength(16);

    for (const code of ["A", "B", "C", "D"]) {
      const inGroup = drawn.filter((d) => d.groupCode === code);
      expect(inGroup).toHaveLength(4);
      expect(inGroup.map((g) => g.potNumber).sort()).toEqual([1, 2, 3, 4]);
    }
  });
});

describe("Эло и журнал рейтинга", () => {
  it("обеспечивает симметрию Эло при ничьей", () => {
    const equalDraw = calculateEloUpdate({
      ratingA: 1500,
      ratingB: 1500,
      winnerSide: null,
      stage: "group"
    });
    expect(equalDraw.sideA.delta).toBe(0);
    expect(equalDraw.sideB.delta).toBe(0);

    const unequalDraw = calculateEloUpdate({
      ratingA: 1600,
      ratingB: 1400,
      winnerSide: null,
      stage: "group"
    });
    expect(unequalDraw.sideA.delta).toBe(-unequalDraw.sideB.delta);
    expect(unequalDraw.sideA.delta).toBeLessThan(0);
    expect(unequalDraw.sideB.delta).toBeGreaterThan(0);
  });

  it("сверяет пересчёт журнала рейтинга с нуля до хранимого значения", () => {
    const m1 = calculateEloUpdate({
      ratingA: INITIAL_ELO_RATING,
      ratingB: INITIAL_ELO_RATING,
      winnerSide: "A",
      stage: "group"
    });

    const m2 = calculateEloUpdate({
      ratingA: m1.sideA.ratingAfter,
      ratingB: INITIAL_ELO_RATING,
      winnerSide: "B",
      stage: "final"
    });

    const events = [
      {
        heroId: "hA",
        disputeId: "d1",
        ratingBefore: m1.sideA.ratingBefore,
        delta: m1.sideA.delta,
        ratingAfter: m1.sideA.ratingAfter
      },
      {
        heroId: "hB",
        disputeId: "d1",
        ratingBefore: m1.sideB.ratingBefore,
        delta: m1.sideB.delta,
        ratingAfter: m1.sideB.ratingAfter
      },
      {
        heroId: "hA",
        disputeId: "d2",
        ratingBefore: m2.sideA.ratingBefore,
        delta: m2.sideA.delta,
        ratingAfter: m2.sideA.ratingAfter
      },
      {
        heroId: "hC",
        disputeId: "d2",
        ratingBefore: m2.sideB.ratingBefore,
        delta: m2.sideB.delta,
        ratingAfter: m2.sideB.ratingAfter
      }
    ];

    const stored = new Map<string, number>([
      ["hA", m2.sideA.ratingAfter],
      ["hB", m1.sideB.ratingAfter],
      ["hC", m2.sideB.ratingAfter]
    ]);

    const check = verifyRatingLedger(["hA", "hB", "hC"], events, stored);
    expect(check.valid).toBe(true);
    expect(check.mismatches).toHaveLength(0);
  });

  it("содержит ровно 16 героев с 5 доминантами, 5 апелляциями, статами 30..90 и SVG-вензелями", () => {
    expect(HERO_ROSTER).toHaveLength(16);
    for (const hero of HERO_ROSTER) {
      expect(hero.dominants).toHaveLength(5);
      expect(hero.appeals).toHaveLength(5);
      expect(EMBLEM_DESCRIPTORS[hero.emblemKey]).toBeDefined();

      for (const skill of [...hero.dominants, ...hero.appeals]) {
        expect(skill.primaryStat).toBeGreaterThanOrEqual(30);
        expect(skill.primaryStat).toBeLessThanOrEqual(90);
        expect(skill.secondaryStat).toBeGreaterThanOrEqual(30);
        expect(skill.secondaryStat).toBeLessThanOrEqual(90);
      }
    }
  });
});
