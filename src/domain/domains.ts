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
    title: "Разум",
    shortTitle: "Разум",
    beats: "word",
    losesTo: "honor",
    ruleText: "Разум гасит Слово строгой проверкой посылок"
  },
  word: {
    id: "word",
    title: "Слово",
    shortTitle: "Слово",
    beats: "heart",
    losesTo: "reason",
    ruleText: "Слово перехватывает Сердце точным образом и интонацией"
  },
  heart: {
    id: "heart",
    title: "Сердце",
    shortTitle: "Сердце",
    beats: "will",
    losesTo: "word",
    ruleText: "Сердце смягчает Волю сочувствием и человеческой правдой"
  },
  will: {
    id: "will",
    title: "Воля",
    shortTitle: "Воля",
    beats: "luck",
    losesTo: "heart",
    ruleText: "Воля переживает Удачу выдержкой на длинной дистанции"
  },
  luck: {
    id: "luck",
    title: "Удача",
    shortTitle: "Удача",
    beats: "honor",
    losesTo: "will",
    ruleText: "Удача ломает слишком прямую Честь внезапным поворотом"
  },
  honor: {
    id: "honor",
    title: "Честь",
    shortTitle: "Честь",
    beats: "reason",
    losesTo: "luck",
    ruleText: "Честь не спорит с изворотливым Разумом — она ставит прямой вопрос долга"
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
