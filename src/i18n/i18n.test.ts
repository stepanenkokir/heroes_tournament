import { describe, expect, it } from "vitest";
import { HERO_ROSTER } from "../domain/roster";
import { DICTIONARIES } from "./dictionaries";
import {
  fill,
  formatCupEdition,
  formatEdition,
  negotiateLocale,
  ordinalPlace,
  parseLocale
} from "./locale";
import {
  localizeHero,
  localizeSkill,
  localizeSourceLabel,
  localizeTieBreak,
  localizeTournament,
  stageLabel
} from "./present";
import { SKILL_COPY } from "./content/skills";
import { HERO_COPY, TOURNAMENT_COPY } from "./content/catalog";
import { formatLocaleDate } from "../db/dates";

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") {
    return [prefix];
  }
  if (!value || typeof value !== "object") {
    return [];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key)
  );
}

function leafValue(root: unknown, path: string): string {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }
    return (current as Record<string, unknown>)[key];
  }, root) as string;
}

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? "").sort();
}

describe("локали En, Es, Ru", () => {
  it("распознаёт код языка и договаривается о языке по cookie и Accept-Language", () => {
    expect(parseLocale("EN")).toBe("en");
    expect(parseLocale("es-MX")).toBe("es");
    expect(parseLocale("de")).toBeNull();
    expect(negotiateLocale({ cookie: "ru", acceptLanguage: "en-US,en;q=0.8" })).toBe("ru");
    expect(negotiateLocale({ cookie: null, acceptLanguage: "fr,es-MX;q=0.9,en;q=0.4" })).toBe("es");
    expect(negotiateLocale({ cookie: "nope", acceptLanguage: "" })).toBe("ru");
  });

  it("держит одинаковые ключи и плейсхолдеры во всех словарях", () => {
    const russianPaths = leafPaths(DICTIONARIES.ru).sort();
    expect(leafPaths(DICTIONARIES.en).sort()).toEqual(russianPaths);
    expect(leafPaths(DICTIONARIES.es).sort()).toEqual(russianPaths);

    for (const path of russianPaths) {
      for (const locale of ["en", "es", "ru"] as const) {
        const text = leafValue(DICTIONARIES[locale], path);
        expect(text.trim().length, `${locale}:${path}`).toBeGreaterThan(0);
        expect(placeholders(text), `${locale}:${path}`).toEqual(
          placeholders(leafValue(DICTIONARIES.ru, path))
        );
      }
    }
  });

  it("переводит героев, навыки и кубки и оставляет русский текст каноническим", () => {
    expect(Object.keys(SKILL_COPY)).toHaveLength(160);
    expect(Object.keys(HERO_COPY)).toHaveLength(HERO_ROSTER.length);
    expect(Object.keys(TOURNAMENT_COPY)).toHaveLength(4);

    for (const hero of HERO_ROSTER) {
      expect(localizeHero(hero, "ru").name).toBe(hero.name);
      const english = localizeHero(hero, "en");
      const spanish = localizeHero(hero, "es");
      expect(english.name.length).toBeGreaterThan(0);
      expect(spanish.epithet.length).toBeGreaterThan(0);
      expect(english.name).not.toMatch(/[А-Яа-яЁё]/);
      expect(spanish.origin).not.toMatch(/[А-Яа-яЁё]/);

      for (const skill of [...hero.dominants, ...hero.appeals]) {
        expect(localizeSkill(skill, "ru").title).toBe(skill.title);
        const translated = localizeSkill(skill, "en");
        expect(translated.title).not.toBe(skill.title);
        expect(translated.description.length).toBeGreaterThan(12);
        expect(localizeSkill(skill, "es").title).not.toMatch(/[А-Яа-яЁё]/);
      }
    }

    const cup = localizeTournament(
      {
        slug: "cup-4-current-grand-dispute",
        title: "IV Кубок: Большой Диспут Наследия",
        subtitle: "исходный"
      },
      "es"
    );
    expect(cup.title).toContain("Copa IV");
    expect(cup.subtitle).not.toBe("исходный");
  });

  it("переводит подписи стадий, источники пар и тай-брейки", () => {
    expect(stageLabel("group", "C", DICTIONARIES.en)).toBe("Group C");
    expect(stageLabel("final", null, DICTIONARIES.es)).toBe("Final de la Copa");
    expect(localizeSourceLabel("1-е место группы A", "en", DICTIONARIES.en)).toBe("1st in group A");
    expect(localizeSourceLabel("2-е место группы B", "es", DICTIONARIES.es)).toBe("2.º del grupo B");
    expect(localizeSourceLabel("Победитель пары 1A–2B", "en", DICTIONARIES.en)).toBe(
      "Winner of pairing 1A–2B"
    );
    expect(localizeSourceLabel("Победитель полуфинала 2", "ru", DICTIONARIES.ru)).toBe(
      "Победитель полуфинала 2"
    );
    expect(localizeTieBreak("Выше по очкам личной встречи", DICTIONARIES.en)).toBe(
      "Ahead on head-to-head points"
    );
    expect(localizeTieBreak("Выше по жребию посева", DICTIONARIES.ru)).toContain("жребию");
    expect(localizeTieBreak(null, DICTIONARIES.en)).toBeNull();
  });

  it("форматирует даты, порядковые номера и подстановки", () => {
    expect(formatLocaleDate("2026-03-05", "en", "long")).toMatch(/March/);
    expect(formatLocaleDate("2026-03-05", "en", "long")).toMatch(/2026/);
    expect(formatLocaleDate("2026-03-05", "es", "long")).toMatch(/marzo/i);
    expect(formatLocaleDate("2026-03-05", "ru", "long")).toMatch(/марта/);
    expect(formatLocaleDate("2026-03-05", "en", "short")).not.toMatch(/2026/);
    expect(formatEdition(1, "en")).toBe("1st convocation");
    expect(formatEdition(2, "ru")).toBe("2-й созыв");
    expect(formatCupEdition(4, "es")).toBe("4.ª Copa");
    expect(ordinalPlace(3, "en")).toBe("3rd");
    expect(fill("День {n}", { n: 7 })).toBe("День 7");
  });
});
