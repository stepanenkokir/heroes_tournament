import type { DomainId } from "@/domain/types";
import { HERO_COPY, TOURNAMENT_COPY, type NamedCopy, type SkillText, type TitledCopy } from "./content/catalog";
import { SKILL_COPY } from "./content/skills";
import { getMessages } from "./dictionaries";
import { fill, ordinalPlace, type Locale } from "./locale";
import type { Messages } from "./messages";

const TIE_NOTES: Record<string, keyof Messages["tie"]> = {
  "Выше по очкам личной встречи": "h2hPoints",
  "Выше по разнице признания в личных встречах": "h2hDiff",
  "Выше по общей разнице признания": "acclaimDiff",
  "Выше по сумме признания": "acclaimFor",
  "Выше по сумме удержания": "retention",
  "Выше по стартовому рейтингу": "rating",
  "Выше по жребию посева": "seed"
};

const GROUP_PLACE = /^(\d)-е место группы ([A-D])$/;
const PAIR_WINNER = /^Победитель пары (.+)$/;
const SEMI_WINNER = /^Победитель полуфинала (\d+)$/;
const GROUP_LABEL = /^Группа ([A-D])$/;

export function localizeHero<T extends NamedCopy & { id: string }>(hero: T, locale: Locale): T {
  if (locale === "ru") {
    return hero;
  }
  const copy = HERO_COPY[hero.id]?.[locale];
  return copy ? { ...hero, ...copy } : hero;
}

export function localizeSkill<T extends SkillText & { id: string }>(skill: T, locale: Locale): T {
  if (locale === "ru") {
    return skill;
  }
  const copy = SKILL_COPY[skill.id]?.[locale];
  return copy ? { ...skill, ...copy } : skill;
}

export function localizeTournament<T extends TitledCopy & { slug: string }>(
  tournament: T,
  locale: Locale
): T {
  if (locale === "ru") {
    return tournament;
  }
  const copy = TOURNAMENT_COPY[tournament.slug]?.[locale];
  return copy ? { ...tournament, ...copy } : tournament;
}

export function localizeTieBreak(note: string | null, messages: Messages): string | null {
  if (!note) {
    return null;
  }
  const key = TIE_NOTES[note];
  return key ? messages.tie[key] : note;
}

export function localizeSourceLabel(
  label: string | null | undefined,
  locale: Locale,
  messages: Messages
): string {
  if (!label) {
    return messages.common.pairWinner;
  }
  const place = label.match(GROUP_PLACE);
  if (place) {
    return fill(messages.source.groupPlace, {
      place: ordinalPlace(Number(place[1]), locale),
      group: place[2] ?? ""
    });
  }
  const pair = label.match(PAIR_WINNER);
  if (pair) {
    return fill(messages.source.pairWinner, { pair: pair[1] ?? "" });
  }
  const semi = label.match(SEMI_WINNER);
  if (semi) {
    return fill(messages.source.semiWinner, { n: semi[1] ?? "" });
  }
  const group = label.match(GROUP_LABEL);
  if (group) {
    return fill(messages.common.group, { code: group[1] ?? "" });
  }
  return label;
}

export function stageLabel(
  stage: string,
  groupCode: string | null | undefined,
  messages: Messages
): string {
  if (stage === "group") {
    return groupCode ? fill(messages.common.group, { code: groupCode }) : messages.common.groupStage;
  }
  if (stage === "qf") {
    return messages.common.quarter;
  }
  if (stage === "sf") {
    return messages.common.semi;
  }
  if (stage === "final") {
    return messages.common.final;
  }
  return stage;
}

export function dayStageLabel(dayOffset: number, messages: Messages): string {
  if (dayOffset < 6) {
    return fill(messages.stage.groupDay, { day: dayOffset + 1 });
  }
  if (dayOffset < 10) {
    return `${messages.common.quarter} ${dayOffset - 5}`;
  }
  if (dayOffset < 12) {
    return `${messages.common.semi} ${dayOffset - 9}`;
  }
  return messages.common.final;
}

export function domainTitle(domain: DomainId, messages: Messages): string {
  return messages.domains[domain].title;
}

export function formatRecord(wins: number, draws: number, losses: number, messages: Messages): string {
  return fill(messages.common.letters, { w: wins, d: draws, l: losses });
}

export { getMessages };
