import type { DisputeSide, DisputeStage } from "./types";

export const INITIAL_ELO_RATING = 1500;

export function getStageKFactor(stage: DisputeStage): number {
  switch (stage) {
    case "group":
      return 20;
    case "qf":
    case "sf":
      return 28;
    case "final":
      return 36;
  }
}

export function expectedEloScore(ratingHero: number, ratingOpponent: number): number {
  return 1 / (1 + Math.pow(10, (ratingOpponent - ratingHero) / 400));
}

export interface EloMatchInput {
  ratingA: number;
  ratingB: number;
  winnerSide: DisputeSide | null;
  stage: DisputeStage;
}

export interface EloSideDelta {
  ratingBefore: number;
  expectedScore: number;
  actualScore: 1 | 0.5 | 0;
  kFactor: number;
  delta: number;
  ratingAfter: number;
}

export interface EloMatchUpdate {
  sideA: EloSideDelta;
  sideB: EloSideDelta;
}

export function calculateEloUpdate(input: EloMatchInput): EloMatchUpdate {
  const { ratingA, ratingB, winnerSide, stage } = input;
  const kFactor = getStageKFactor(stage);

  const actualA: 1 | 0.5 | 0 = winnerSide === "A" ? 1 : winnerSide === "B" ? 0 : 0.5;
  const actualB: 1 | 0.5 | 0 = winnerSide === "B" ? 1 : winnerSide === "A" ? 0 : 0.5;

  const expectedA = expectedEloScore(ratingA, ratingB);
  const expectedB = expectedEloScore(ratingB, ratingA);

  const deltaA = Math.round(kFactor * (actualA - expectedA));
  const deltaB = Math.round(kFactor * (actualB - expectedB));

  return {
    sideA: {
      ratingBefore: ratingA,
      expectedScore: Number(expectedA.toFixed(4)),
      actualScore: actualA,
      kFactor,
      delta: deltaA,
      ratingAfter: ratingA + deltaA
    },
    sideB: {
      ratingBefore: ratingB,
      expectedScore: Number(expectedB.toFixed(4)),
      actualScore: actualB,
      kFactor,
      delta: deltaB,
      ratingAfter: ratingB + deltaB
    }
  };
}

export interface RatingLedgerEvent {
  heroId: string;
  disputeId: string;
  ratingBefore: number;
  delta: number;
  ratingAfter: number;
}

export interface LedgerVerificationResult {
  valid: boolean;
  replayedRatings: Map<string, number>;
  mismatches: string[];
}

export function verifyRatingLedger(
  heroIds: readonly string[],
  eventsInChronologicalOrder: readonly RatingLedgerEvent[],
  storedRatings: ReadonlyMap<string, number>,
  initialRating: number = INITIAL_ELO_RATING
): LedgerVerificationResult {
  const replayed = new Map<string, number>();
  for (const id of heroIds) {
    replayed.set(id, initialRating);
  }

  const mismatches: string[] = [];

  for (const ev of eventsInChronologicalOrder) {
    const current = replayed.get(ev.heroId) ?? initialRating;
    if (current !== ev.ratingBefore) {
      mismatches.push(
        `Hero ${ev.heroId} at dispute ${ev.disputeId}: expected ratingBefore ${current}, got ${ev.ratingBefore}`
      );
    }
    const next = current + ev.delta;
    if (next !== ev.ratingAfter) {
      mismatches.push(
        `Hero ${ev.heroId} at dispute ${ev.disputeId}: expected ratingAfter ${next}, got ${ev.ratingAfter}`
      );
    }
    replayed.set(ev.heroId, next);
  }

  for (const id of heroIds) {
    const calc = replayed.get(id) ?? initialRating;
    const stored = storedRatings.get(id);
    if (stored !== calc) {
      mismatches.push(`Hero ${id}: stored rating ${stored} !== replayed rating ${calc}`);
    }
  }

  return {
    valid: mismatches.length === 0,
    replayedRatings: replayed,
    mismatches
  };
}
