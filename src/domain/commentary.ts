import type { DomainId, DisputeResolution } from "./types";

export interface CommentaryExchangeDigest {
  step: number;
  phase: string;
  attackerName: string;
  defenderName: string;
  dominantTitle: string;
  appealTitle: string;
  dominantDomain: DomainId;
  appealDomain: DomainId;
  affinity: number;
  acclaim: number;
  retention: number;
}

export interface DisputeNarrativeInput {
  locale: "ru" | "en" | "es";
  heroAName: string;
  heroBName: string;
  acclaimA: number;
  acclaimB: number;
  retentionA: number;
  retentionB: number;
  winnerName: string | null;
  resolution: DisputeResolution | string | null;
  exchanges: readonly CommentaryExchangeDigest[];
}

const DOMAIN_LABELS: Record<"ru" | "en" | "es", Record<DomainId, string>> = {
  ru: {
    reason: "Разум",
    word: "Слово",
    heart: "Сердце",
    will: "Воля",
    luck: "Удача",
    honor: "Честь"
  },
  en: {
    reason: "Reason",
    word: "Word",
    heart: "Heart",
    will: "Will",
    luck: "Luck",
    honor: "Honor"
  },
  es: {
    reason: "Razón",
    word: "Palabra",
    heart: "Corazón",
    will: "Voluntad",
    luck: "Suerte",
    honor: "Honor"
  }
};

/**
 * Строит подробный аналитический пересказ закрытого протокола по числам обмена
 * (домены, признание, удержание и способ разрешения) без цитирования охраняемых текстов.
 */
export function buildProtocolCommentary(input: DisputeNarrativeInput): {
  headline: string;
  summary: string;
  keyTurn: string;
} {
  const {
    locale,
    heroAName,
    heroBName,
    acclaimA,
    acclaimB,
    retentionA,
    retentionB,
    winnerName,
    resolution,
    exchanges
  } = input;

  const peakExchange = [...exchanges].sort(
    (a, b) => b.acclaim - a.acclaim || b.retention - a.retention
  )[0];
  const wallExchange = [...exchanges].sort(
    (a, b) => b.retention - a.retention || a.acclaim - b.acclaim
  )[0];

  const domMap = DOMAIN_LABELS[locale];

  if (locale === "en") {
    const headline = winnerName
      ? `${winnerName} prevails in the rhetorical exchange (${acclaimA}:${acclaimB})`
      : `Balanced group exchange between ${heroAName} and ${heroBName} (${acclaimA}:${acclaimB})`;

    const resClause =
      resolution === "sealed_extra"
        ? "After level main exchanges, the wax-sealed third pair decided the outcome."
        : resolution === "decisive"
          ? "The contest required the series of decisive arguments before the bench."
          : resolution === "glory_lot"
            ? "Even the decisive series stayed level, leaving the verdict to the deterministic Lot of Glory."
            : "The verdict was settled within the four main exchanges.";

    const summary = `${heroAName} gathered ${acclaimA} acclaim with ${retentionA} retention, while ${heroBName} answered with ${acclaimB} acclaim and ${retentionB} retention. ${resClause}`;

    const keyTurn =
      peakExchange && wallExchange
        ? `Key pressure came in step #${peakExchange.step}: ${peakExchange.attackerName} pressed with “${peakExchange.dominantTitle}” (${domMap[peakExchange.dominantDomain]}, ×${peakExchange.affinity}) for +${peakExchange.acclaim} acclaim. Strongest defense stood in step #${wallExchange.step}, where ${wallExchange.defenderName} held ${wallExchange.retention} pressure via “${wallExchange.appealTitle}” (${domMap[wallExchange.appealDomain]}).`
        : "Protocol completed without extended exchanges.";

    return { headline, summary, keyTurn };
  }

  if (locale === "es") {
    const headline = winnerName
      ? `${winnerName} se impone en el intercambio retórico (${acclaimA}:${acclaimB})`
      : `Equilibrio de grupo entre ${heroAName} y ${heroBName} (${acclaimA}:${acclaimB})`;

    const resClause =
      resolution === "sealed_extra"
        ? "Tras igualarse la serie principal, el tercer par bajo lacre inclinó la balanza."
        : resolution === "decisive"
          ? "El encuentro exigió la serie de argumentos decisivos ante el tribunal."
          : resolution === "glory_lot"
            ? "Incluso la serie decisiva terminó igualada y decidió el Sorteo de la Gloria."
            : "El fallo quedó definido en los cuatro intercambios principales.";

    const summary = `${heroAName} sumó ${acclaimA} de reconocimiento y ${retentionA} de retención, frente a ${acclaimB} de reconocimiento y ${retentionB} de retención de ${heroBName}. ${resClause}`;

    const keyTurn =
      peakExchange && wallExchange
        ? `El mayor empuje llegó en el paso #${peakExchange.step}: ${peakExchange.attackerName} presionó con «${peakExchange.dominantTitle}» (${domMap[peakExchange.dominantDomain]}, ×${peakExchange.affinity}) logrando +${peakExchange.acclaim}. La defensa más firme ocurrió en el paso #${wallExchange.step}, donde ${wallExchange.defenderName} contuvo ${wallExchange.retention} con «${wallExchange.appealTitle}» (${domMap[wallExchange.appealDomain]}).`
        : "Protocolo cerrado según la fórmula estándar.";

    return { headline, summary, keyTurn };
  }

  const headline = winnerName
    ? `${winnerName} берёт верх в риторическом диспуте (${acclaimA}:${acclaimB})`
    : `Боевое равновесие ${heroAName} и ${heroBName} (${acclaimA}:${acclaimB})`;

  const resClause =
    resolution === "sealed_extra"
      ? "После равенства в основной серии исход решила вскрытая третья пара навыков под сургучной печатью."
      : resolution === "decisive"
        ? "Спор дошёл до серии решающих доводов с порогом признания не ниже 12."
        : resolution === "glory_lot"
          ? "Даже решающие доводы остались равны, и точку поставил детерминированный Жребий славы."
          : "Исход определился в рамках четырёх основных обменов.";

  const summary = `${heroAName} набирает ${acclaimA} признания при удержании ${retentionA}; ${heroBName} отвечает ${acclaimB} признания и ${retentionB} удержания. ${resClause}`;

  const keyTurn =
    peakExchange && wallExchange
      ? `Главный прорыв пришёлся на обмен #${peakExchange.step}: ${peakExchange.attackerName} проводит «${peakExchange.dominantTitle}» (домен «${domMap[peakExchange.dominantDomain]}», ×${peakExchange.affinity}) и берёт +${peakExchange.acclaim} признания. Самый плотный рубеж защиты — обмен #${wallExchange.step}, где ${wallExchange.defenderName} удерживает ${wallExchange.retention} напора апелляцией «${wallExchange.appealTitle}» (домен «${domMap[wallExchange.appealDomain]}»).`
      : "Протокол рассчитан по стандартной формуле обмена.";

  return { headline, summary, keyTurn };
}
