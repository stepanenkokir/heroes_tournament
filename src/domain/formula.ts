import { getDomainAffinity } from "./domains";
import { createSeededRng, deterministicCoinFlip, getDeterministicJitter } from "./rng";
import type {
  DisputeAnnouncement,
  DisputeResolution,
  DisputeSide,
  DisputeSimulationResult,
  DisputeStage,
  ExchangePhase,
  ExchangeStepResult,
  HeroDefinition,
  HeroSkill,
  SkillDrawOrder
} from "./types";

export const DECISIVE_ACCEPTANCE_THRESHOLD = 12;

export interface RawExchangeInput {
  step: number;
  phase: ExchangePhase;
  attackerSide: DisputeSide;
  dominant: HeroSkill;
  appeal: HeroSkill;
  seed: string;
  jitterOverride?: number;
}

/**
 * Вычисляет один обмен диспута по формуле:
 * press = острота * (0.7 + 0.3 * глубина / 100) * affinity
 * hold  = твёрдость * (0.7 + 0.3 * находчивость / 100)
 * признание = max(0, round(press * j - hold))
 * удержание = round(min(press * j, hold))
 */
export function evaluateExchange(input: RawExchangeInput): ExchangeStepResult {
  const { step, phase, attackerSide, dominant, appeal, seed, jitterOverride } = input;
  const defenderSide: DisputeSide = attackerSide === "A" ? "B" : "A";
  const affinity = getDomainAffinity(dominant.domain, appeal.domain);
  const jitter = jitterOverride ?? getDeterministicJitter(seed, step);

  const rawPress =
    dominant.primaryStat * (0.7 + (0.3 * dominant.secondaryStat) / 100) * affinity;
  const effectivePress = rawPress * jitter;
  const rawHold = appeal.primaryStat * (0.7 + (0.3 * appeal.secondaryStat) / 100);

  const acclaim = Math.max(0, Math.round(effectivePress - rawHold));
  const retention = Math.round(Math.min(effectivePress, rawHold));

  return {
    step,
    phase,
    attackerSide,
    defenderSide,
    dominantSkillId: dominant.id,
    appealSkillId: appeal.id,
    dominantDomain: dominant.domain,
    appealDomain: appeal.domain,
    affinity,
    jitter,
    rawPress: Number(rawPress.toFixed(2)),
    effectivePress: Number(effectivePress.toFixed(2)),
    rawHold: Number(rawHold.toFixed(2)),
    acclaim,
    retention,
    decisiveAccepted: phase === "decisive" ? acclaim >= DECISIVE_ACCEPTANCE_THRESHOLD : null
  };
}

function drawHeroSkillOrder(hero: HeroDefinition, rngSeed: string): SkillDrawOrder {
  if (hero.dominants.length !== 5 || hero.appeals.length !== 5) {
    throw new Error(
      `Hero ${hero.id} must have exactly 5 dominants and 5 appeals (got ${hero.dominants.length}/${hero.appeals.length})`
    );
  }
  const domRng = createSeededRng(`${rngSeed}:dom:${hero.id}`);
  const appRng = createSeededRng(`${rngSeed}:app:${hero.id}`);

  const dominantIds = domRng.shuffle(hero.dominants.map((s) => s.id)) as [
    string,
    string,
    string,
    string,
    string
  ];
  const appealIds = appRng.shuffle(hero.appeals.map((s) => s.id)) as [
    string,
    string,
    string,
    string,
    string
  ];

  return { dominantIds, appealIds };
}

export function drawAnnouncement(
  heroA: HeroDefinition,
  heroB: HeroDefinition,
  seed: string
): DisputeAnnouncement {
  return {
    seed,
    sideA: drawHeroSkillOrder(heroA, `${seed}:A`),
    sideB: drawHeroSkillOrder(heroB, `${seed}:B`)
  };
}

function createSkillLookup(heroA: HeroDefinition, heroB: HeroDefinition): Map<string, HeroSkill> {
  const map = new Map<string, HeroSkill>();
  for (const skill of [...heroA.dominants, ...heroA.appeals, ...heroB.dominants, ...heroB.appeals]) {
    map.set(skill.id, skill);
  }
  return map;
}

export interface SimulateDisputeOptions {
  heroA: HeroDefinition;
  heroB: HeroDefinition;
  stage: DisputeStage;
  seed: string;
  announcement?: DisputeAnnouncement;
}

export function simulateDispute(options: SimulateDisputeOptions): DisputeSimulationResult {
  const { heroA, heroB, stage, seed } = options;
  const announcement = options.announcement ?? drawAnnouncement(heroA, heroB, seed);
  const skillMap = createSkillLookup(heroA, heroB);

  const getSkill = (id: string): HeroSkill => {
    const found = skillMap.get(id);
    if (!found) {
      throw new Error(`Unknown skill id: ${id}`);
    }
    return found;
  };

  const exchanges: ExchangeStepResult[] = [];

  const pushPair = (
    phase: ExchangePhase,
    slotIndex: number,
    baseStep: number
  ): [ExchangeStepResult, ExchangeStepResult] => {
    const exA = evaluateExchange({
      step: baseStep,
      phase,
      attackerSide: "A",
      dominant: getSkill(announcement.sideA.dominantIds[slotIndex]!),
      appeal: getSkill(announcement.sideB.appealIds[slotIndex]!),
      seed
    });
    const exB = evaluateExchange({
      step: baseStep + 1,
      phase,
      attackerSide: "B",
      dominant: getSkill(announcement.sideB.dominantIds[slotIndex]!),
      appeal: getSkill(announcement.sideA.appealIds[slotIndex]!),
      seed
    });
    exchanges.push(exA, exB);
    return [exA, exB];
  };

  // Основная серия из 4 обменов (слоты 0 и 1 — открытые в анонсе навыки)
  pushPair("main", 0, 1);
  pushPair("main", 1, 3);

  let acclaimA = exchanges
    .filter((e) => e.attackerSide === "A")
    .reduce((acc, e) => acc + e.acclaim, 0);
  let acclaimB = exchanges
    .filter((e) => e.attackerSide === "B")
    .reduce((acc, e) => acc + e.acclaim, 0);
  let retentionA = exchanges
    .filter((e) => e.defenderSide === "A")
    .reduce((acc, e) => acc + e.retention, 0);
  let retentionB = exchanges
    .filter((e) => e.defenderSide === "B")
    .reduce((acc, e) => acc + e.retention, 0);

  let sealedUsed = false;
  let decisiveUsed = false;
  let decisiveScoreA = 0;
  let decisiveScoreB = 0;
  let gloryLotUsed = false;
  let gloryLotWinner: DisputeSide | null = null;
  let resolution: DisputeResolution = "main";
  let winnerSide: DisputeSide | null =
    acclaimA > acclaimB ? "A" : acclaimB > acclaimA ? "B" : null;

  // В плей-офф ничья запрещена
  if (stage !== "group" && winnerSide === null) {
    sealedUsed = true;
    const [extraA, extraB] = pushPair("sealed_extra", 2, 5);
    acclaimA += extraA.acclaim;
    acclaimB += extraB.acclaim;
    retentionA += extraB.retention;
    retentionB += extraA.retention;

    if (acclaimA !== acclaimB) {
      winnerSide = acclaimA > acclaimB ? "A" : "B";
      resolution = "sealed_extra";
    } else {
      // Решающие доводы: серия из 5 пар обменов (начиная с оставшихся слотов 3 и 4, затем 0, 1, 2)
      decisiveUsed = true;
      const slotSequence = [3, 4, 0, 1, 2] as const;
      let nextStep = 7;

      for (const slotIdx of slotSequence) {
        const [decA, decB] = pushPair("decisive", slotIdx, nextStep);
        nextStep += 2;
        if (decA.decisiveAccepted) {
          decisiveScoreA += 1;
        }
        if (decB.decisiveAccepted) {
          decisiveScoreB += 1;
        }
      }

      if (decisiveScoreA !== decisiveScoreB) {
        winnerSide = decisiveScoreA > decisiveScoreB ? "A" : "B";
        resolution = "decisive";
      } else {
        // Жребий славы — честный seeded coin
        gloryLotUsed = true;
        gloryLotWinner = deterministicCoinFlip(seed, "glory-lot");
        winnerSide = gloryLotWinner;
        resolution = "glory_lot";
      }
    }
  }

  return {
    seed,
    stage,
    announcement,
    exchanges,
    acclaimA,
    acclaimB,
    retentionA,
    retentionB,
    sealedUsed,
    decisiveUsed,
    decisiveScoreA,
    decisiveScoreB,
    gloryLotUsed,
    gloryLotWinner,
    resolution,
    winnerSide
  };
}
