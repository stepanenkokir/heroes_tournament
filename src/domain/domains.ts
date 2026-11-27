import type { DomainId, DomainMeta } from "./types";

export const DOMAIN_ORDER: readonly DomainId[] = [
  "reason",
  "word",
  "heart",
  "will",
  "luck",
  "honor"
] as const;

export const DOMAIN_META: Record<DomainId, DomainMeta> = {
  reason: {
    id: "reason",
    beats: "word",
    losesTo: "honor"
  },
  word: {
    id: "word",
    beats: "heart",
    losesTo: "reason"
  },
  heart: {
    id: "heart",
    beats: "will",
    losesTo: "word"
  },
  will: {
    id: "will",
    beats: "luck",
    losesTo: "heart"
  },
  luck: {
    id: "luck",
    beats: "honor",
    losesTo: "will"
  },
  honor: {
    id: "honor",
    beats: "reason",
    losesTo: "luck"
  }
};

export function getDomainAffinity(
  dominantDomain: DomainId,
  appealDomain: DomainId
): 1.2 | 1 | 0.8 {
  const meta = DOMAIN_META[dominantDomain];
  if (meta.beats === appealDomain) {
    return 1.2;
  }
  if (meta.losesTo === appealDomain) {
    return 0.8;
  }
  return 1;
}
