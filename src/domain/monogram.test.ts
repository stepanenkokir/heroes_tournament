import { describe, expect, it } from "vitest";
import { HERO_COPY } from "../i18n/content/catalog";
import { HERO_ROSTER } from "./roster";
import { heroMonogram } from "./monogram";

describe("heroMonogram", () => {
  it("берёт инициалы из имени на языке интерфейса", () => {
    expect(heroMonogram("Одиссей")).toBe("ОД");
    expect(heroMonogram("Шерлок Холмс")).toBe("ШХ");
    expect(heroMonogram("Геракл")).toBe("ГР");
    expect(heroMonogram("д'Артаньян")).toBe("ДА");
    expect(heroMonogram("Odysseus")).toBe("OD");
    expect(heroMonogram("Sherlock Holmes")).toBe("SH");
    expect(heroMonogram("Vasilisa the Wise")).toBe("VW");
    expect(heroMonogram("d'Artagnan")).toBe("DA");
    expect(heroMonogram("Vasilisa la Sabia")).toBe("VS");
    expect(heroMonogram("Capitán Nemo")).toBe("CN");
    expect(heroMonogram("Simbad")).toBe("SM");
  });

  it("для английских и испанских имён даёт латиницу, для русских — кириллицу", () => {
    for (const hero of HERO_ROSTER) {
      expect(heroMonogram(hero.name)).toMatch(/^[\p{Script=Cyrillic}]{2}$/u);
      for (const locale of ["en", "es"] as const) {
        const name = HERO_COPY[hero.id]?.[locale]?.name;
        expect(name, hero.id).toBeTruthy();
        expect(heroMonogram(name!)).toMatch(/^[\p{Script=Latin}]{2}$/u);
      }
    }
  });
});
