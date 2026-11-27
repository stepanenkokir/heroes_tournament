export type DomainId = "reason" | "word" | "heart" | "will" | "luck" | "honor";

export type SkillKind = "dominant" | "appeal";

export type DisputeStage = "group" | "qf" | "sf" | "final";

export type DisputeStatus = "scheduled" | "announced" | "completed";

export type DisputeSide = "A" | "B";

export type DisputeResolution = "main" | "sealed_extra" | "decisive" | "glory_lot";

export interface DomainMeta {
  id: DomainId;
  beats: DomainId;
  losesTo: DomainId;
}

export interface HeroSkill {
  id: string;
  heroId: string;
  kind: SkillKind;
  slot: number; // 1..5
  title: string;
  description: string;
  domain: DomainId;
  primaryStat: number; // 30..90: острота (dominant) | твёрдость (appeal)
  secondaryStat: number; // 30..90: глубина (dominant) | находчивость (appeal)
}

export interface HeroDefinition {
  id: string;
  slug: string;
  name: string;
  origin: string;
  epithet: string;
  emblemKey: string;
  accentHex: string;
  dominants: HeroSkill[];
  appeals: HeroSkill[];
}

export interface SkillDrawOrder {
  dominantIds: [string, string, string, string, string];
  appealIds: [string, string, string, string, string];
}

export interface DisputeAnnouncement {
  seed: string;
  sideA: SkillDrawOrder;
  sideB: SkillDrawOrder;
}

export type ExchangePhase = "main" | "sealed_extra" | "decisive";

export interface ExchangeStepResult {
  step: number;
  phase: ExchangePhase;
  attackerSide: DisputeSide;
  defenderSide: DisputeSide;
  dominantSkillId: string;
  appealSkillId: string;
  dominantDomain: DomainId;
  appealDomain: DomainId;
  affinity: 1.2 | 1 | 0.8;
  jitter: number;
  rawPress: number;
  effectivePress: number;
  rawHold: number;
  acclaim: number;
  retention: number;
  decisiveAccepted: boolean | null;
}

export interface DisputeSimulationResult {
  seed: string;
  stage: DisputeStage;
  announcement: DisputeAnnouncement;
  exchanges: ExchangeStepResult[];
  acclaimA: number;
  acclaimB: number;
  retentionA: number;
  retentionB: number;
  sealedUsed: boolean;
  decisiveUsed: boolean;
  decisiveScoreA: number;
  decisiveScoreB: number;
  gloryLotUsed: boolean;
  gloryLotWinner: DisputeSide | null;
  resolution: DisputeResolution;
  winnerSide: DisputeSide | null;
}
