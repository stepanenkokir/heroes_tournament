import { asc } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createDbBundle } from "./client.js";
import { addDaysIso } from "./dates.js";
import { seedFullPortalDatabase, syncPortalTimeline } from "./engine.js";
import {
  disputeExchangesTable,
  disputesTable,
  heroesTable,
  ratingEventsTable,
  tournamentsTable
} from "./schema.js";

describe("Сидирование 3 архивных кубков, текущего кубка и ежедневный переход", () => {
  it("воспроизводит идентичные протоколы и рейтинги при повторном прогоне сида", () => {
    const fixedToday = "2026-11-26";

    const bundle1 = createDbBundle(":memory:");
    seedFullPortalDatabase(bundle1, fixedToday);

    const bundle2 = createDbBundle(":memory:");
    seedFullPortalDatabase(bundle2, fixedToday);

    const heroes1 = bundle1.db
      .select()
      .from(heroesTable)
      .orderBy(asc(heroesTable.id))
      .all();
    const heroes2 = bundle2.db
      .select()
      .from(heroesTable)
      .orderBy(asc(heroesTable.id))
      .all();
    expect(heroes1).toEqual(heroes2);

    const exchanges1 = bundle1.db
      .select()
      .from(disputeExchangesTable)
      .orderBy(asc(disputeExchangesTable.id))
      .all();
    const exchanges2 = bundle2.db
      .select()
      .from(disputeExchangesTable)
      .orderBy(asc(disputeExchangesTable.id))
      .all();
    expect(exchanges1).toEqual(exchanges2);

    const tournaments = bundle1.db
      .select()
      .from(tournamentsTable)
      .orderBy(asc(tournamentsTable.editionNumber))
      .all();

    expect(tournaments).toHaveLength(4);
    expect(tournaments.slice(0, 3).every((t) => t.status === "completed")).toBe(true);
    expect(tournaments.slice(0, 3).every((t) => t.championHeroId !== null)).toBe(true);
    expect(tournaments[3]?.status).toBe("active");

    // В текущем кубке (стартовал 2 дня назад):
    // 2 дня (8 диспутов) завершены, сегодняшний день (4 диспута) в статусе announced без счёта
    const currentDisputes = bundle1.db
      .select()
      .from(disputesTable)
      .all()
      .filter((d) => d.tournamentId === "cup-4");

    const completed = currentDisputes.filter((d) => d.status === "completed");
    const announced = currentDisputes.filter((d) => d.status === "announced");
    const scheduled = currentDisputes.filter((d) => d.status === "scheduled");

    expect(completed).toHaveLength(8);
    expect(announced).toHaveLength(4);
    expect(scheduled).toHaveLength(19);
    expect(announced.every((d) => d.acclaimA === null && d.acclaimB === null)).toBe(true);

    // При наступлении следующего дня сегодняшние 4 анонса закрываются, а следующие 4 открываются
    syncPortalTimeline(bundle1, addDaysIso(fixedToday, 1));
    const afterNextDay = bundle1.db
      .select()
      .from(disputesTable)
      .all()
      .filter((d) => d.tournamentId === "cup-4");

    expect(afterNextDay.filter((d) => d.status === "completed")).toHaveLength(12);
    expect(afterNextDay.filter((d) => d.status === "announced")).toHaveLength(4);

    // Пруфы рейтинга: по 2 записи на каждый завершённый диспут
    const totalCompletedDisputes = bundle1.db
      .select()
      .from(disputesTable)
      .all()
      .filter((d) => d.status === "completed").length;
    const totalRatingEvents = bundle1.db.select().from(ratingEventsTable).all().length;
    expect(totalRatingEvents).toBe(totalCompletedDisputes * 2);
  });
});
