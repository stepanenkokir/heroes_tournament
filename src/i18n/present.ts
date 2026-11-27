import type { DomainId, TieBreakKey } from "@/domain";
import { HERO_COPY, TOURNAMENT_COPY, type NamedCopy, type SkillText, type TitledCopy } from "./content/catalog";
import { SKILL_COPY } from "./content/skills";
import { getMessages } from "./dictionaries";
import { fill, ordinalPlace, type Locale } from "./locale";
import type { Messages } from "./messages";

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

export function localizeTieBreak(
  note: TieBreakKey | string | null,
  messages: Messages
): string | null {
  if (!note) {
    return null;
  }
  if (note in messages.tie) {
    return messages.tie[note as TieBreakKey];
  }
  return note;
}

export function localizeSourceLabel(
  label: string | null | undefined,
  locale: Locale,
  messages: Messages
): string {
  if (!label) {
    return messages.common.pairWinner;
  }
  const [kind, first = "", second = ""] = label.split(":");
  if (kind === "groupPlace" && first && second) {
    return fill(messages.source.groupPlace, {
      place: ordinalPlace(Number(first), locale),
      group: second
    });
  }
  if (kind === "pairWinner" && first) {
    return fill(messages.source.pairWinner, { pair: first });
  }
  if (kind === "semiWinner" && first) {
    return fill(messages.source.semiWinner, { n: first });
  }
  if (kind === "group" && first) {
    return fill(messages.common.group, { code: first });
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
