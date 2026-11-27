import type {
  HeroDefinition,
  HeroSkill,
  SkillStatKind,
  SkillStatModifier,
  VoteWeight
} from "./types";

export const VOTE_MATCH_BUDGET = 6;
export const VOTE_PRIOR_WEIGHT = 24;
export const VOTE_STAT_CAP = 3;
export const SKILL_STAT_MIN = 30;
export const SKILL_STAT_MAX = 90;

export interface RawDisputeBallot {
  userId: string;
  heroId: string;
  skillId: string;
  stat: SkillStatKind;
  weight: VoteWeight;
}

export interface ComputedStatSnapshot extends SkillStatModifier {
  heroId: string;
  totalWeight: number;
  share: number;
  rawBonus: number;
}

export interface DisputeVoteSnapshotResult {
  totalMatchWeight: number;
  adjustments: ComputedStatSnapshot[];
}

export function clampSkillStat(value: number): number {
  return Math.min(SKILL_STAT_MAX, Math.max(SKILL_STAT_MIN, Math.round(value)));
}

/**
 * Пересчитывает голоса сторон в долю общего бюджета матча:
 * share = W / (W_match + PRIOR)
 * raw = BUDGET * share
 * applied = min(3, round(raw))
 */
export function computeVoteSnapshot(
  ballots: readonly RawDisputeBallot[]
): DisputeVoteSnapshotResult {
  const totalMatchWeight = ballots.reduce((sum, b) => sum + b.weight, 0);
  if (totalMatchWeight <= 0) {
    return { totalMatchWeight: 0, adjustments: [] };
  }

  const buckets = new Map<
    string,
    { heroId: string; skillId: string; stat: SkillStatKind; totalWeight: number }
  >();

  for (const ballot of ballots) {
    const key = `${ballot.skillId}::${ballot.stat}`;
    const existing = buckets.get(key);
    if (existing) {
      existing.totalWeight += ballot.weight;
    } else {
      buckets.set(key, {
        heroId: ballot.heroId,
        skillId: ballot.skillId,
        stat: ballot.stat,
        totalWeight: ballot.weight
      });
    }
  }

  const denominator = totalMatchWeight + VOTE_PRIOR_WEIGHT;
  const adjustments: ComputedStatSnapshot[] = [...buckets.values()]
    .sort((a, b) => a.skillId.localeCompare(b.skillId) || a.stat.localeCompare(b.stat))
    .map((bucket) => {
      const share = bucket.totalWeight / denominator;
      const rawBonus = VOTE_MATCH_BUDGET * share;
      const appliedBonus = Math.min(VOTE_STAT_CAP, Math.max(0, Math.round(rawBonus)));

      return {
        heroId: bucket.heroId,
        skillId: bucket.skillId,
        stat: bucket.stat,
        totalWeight: bucket.totalWeight,
        share: Number(share.toFixed(4)),
        rawBonus: Number(rawBonus.toFixed(3)),
        appliedBonus
      };
    });

  return {
    totalMatchWeight,
    adjustments
  };
}

function applyModifiersToSkill(
  skill: HeroSkill,
  modifiers: readonly SkillStatModifier[]
): HeroSkill {
  let primaryDelta = 0;
  let secondaryDelta = 0;

  for (const mod of modifiers) {
    if (mod.skillId !== skill.id || mod.appliedBonus === 0) {
      continue;
    }
    if (mod.stat === "primary") {
      primaryDelta += mod.appliedBonus;
    } else {
      secondaryDelta += mod.appliedBonus;
    }
  }

  if (primaryDelta === 0 && secondaryDelta === 0) {
    return skill;
  }

  return {
    ...skill,
    primaryStat: clampSkillStat(skill.primaryStat + primaryDelta),
    secondaryStat: clampSkillStat(skill.secondaryStat + secondaryDelta)
  };
}

export function applyVoteModifiersToHero(
  hero: HeroDefinition,
  modifiers: readonly SkillStatModifier[]
): HeroDefinition {
  if (modifiers.length === 0) {
    return hero;
  }
  return {
    ...hero,
    dominants: hero.dominants.map((s) => applyModifiersToSkill(s, modifiers)),
    appeals: hero.appeals.map((s) => applyModifiersToSkill(s, modifiers))
  };
}
