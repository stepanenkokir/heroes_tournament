import { asc, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createDbBundle } from "./client.js";
import { addDaysIso } from "./dates.js";
import {
  castDisputeBallot,
  seedFullPortalDatabase,
  submitUserProposal,
  syncPortalTimeline,
  upsertOAuthUser
} from "./engine.js";
import { getHomePortalData, getTournamentFullView } from "./queries.js";
import {
  disputeExchangesTable,
  disputesTable,
  disputeVoteSnapshotsTable,
  heroesTable,
  ratingEventsTable,
  tournamentsTable,
  usersTable
} from "./schema.js";

describe("Сидирование 10 архивных кубков, текущего XI кубка, голосования и ежедневный переход", () => {
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
    expect(heroes1).toHaveLength(50);
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

    expect(tournaments).toHaveLength(11);
    expect(tournaments.slice(0, 10).every((t) => t.status === "completed")).toBe(true);
    expect(tournaments.slice(0, 10).every((t) => t.championHeroId !== null)).toBe(true);
    expect(tournaments[10]?.id).toBe("cup-11");
    expect(tournaments[10]?.status).toBe("active");

    // Чередование открытых и тематических кубков по плану
    expect(tournaments.map((t) => t.themeId ?? "open")).toEqual([
      "open",
      "myth_bylina",
      "road_sea",
      "open",
      "tricksters",
      "direct_argument",
      "open",
      "myth_bylina",
      "road_sea",
      "tricksters",
      "open"
    ]);

    // В текущем XI кубке (стартовал 2 дня назад):
    // 2 дня (8 диспутов) завершены, сегодняшний день (4 диспута) в статусе announced без счёта
    const currentDisputes = bundle1.db
      .select()
      .from(disputesTable)
      .all()
      .filter((d) => d.tournamentId === "cup-11");

    const completed = currentDisputes.filter((d) => d.status === "completed");
    const announced = currentDisputes.filter((d) => d.status === "announced");
    const scheduled = currentDisputes.filter((d) => d.status === "scheduled");

    expect(completed).toHaveLength(8);
    expect(announced).toHaveLength(4);
    expect(scheduled).toHaveLength(19);
    expect(announced.every((d) => d.acclaimA === null && d.acclaimB === null)).toBe(true);

    // При наступлении следующего дня сегодняшние 4 анонса закрываются, а следующие 4 открываются
    const nextDayIso = addDaysIso(fixedToday, 1);
    const stepSummary = syncPortalTimeline(bundle1, nextDayIso);
    expect(stepSummary).toEqual({ completedNow: 4, announcedNow: 4 });

    const afterNextDay = bundle1.db
      .select()
      .from(disputesTable)
      .all()
      .filter((d) => d.tournamentId === "cup-11");

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

    // Повторный запуск на ту же дату не меняет рейтинги и не дублирует события Эло
    const heroesBeforeRepeat = bundle1.db
      .select()
      .from(heroesTable)
      .orderBy(asc(heroesTable.id))
      .all();
    const repeatSummary = syncPortalTimeline(bundle1, nextDayIso);
    expect(repeatSummary).toEqual({ completedNow: 0, announcedNow: 0 });
    expect(bundle1.db.select().from(ratingEventsTable).all()).toHaveLength(totalRatingEvents);
    expect(
      bundle1.db.select().from(heroesTable).orderBy(asc(heroesTable.id)).all()
    ).toEqual(heroesBeforeRepeat);
  });

  it("читает текущий день из announced-диспутов и не сидирует пустую базу на чтении", () => {
    const emptyBundle = createDbBundle(":memory:");
    const emptyHome = getHomePortalData(emptyBundle);
    expect(emptyHome.todayIso).toBeNull();
    expect(emptyHome.todayDisputes).toHaveLength(0);
    expect(emptyBundle.db.select().from(heroesTable).all()).toHaveLength(0);

    const fixedSeedDay = "2020-05-10";
    const seededBundle = createDbBundle(":memory:");
    seedFullPortalDatabase(seededBundle, fixedSeedDay);

    const home = getHomePortalData(seededBundle);
    expect(home.todayIso).toBe(fixedSeedDay);
    expect(home.todayDisputes).toHaveLength(4);
    expect(home.todayDisputes.every((c) => c.dispute.scheduledDate === fixedSeedDay)).toBe(true);

    const activeView = getTournamentFullView("active", seededBundle);
    expect(activeView?.days.filter((d) => d.isToday).map((d) => d.scheduledDate)).toEqual([
      fixedSeedDay
    ]);

    const archiveView = getTournamentFullView("cup-1", seededBundle);
    expect(archiveView?.days.every((d) => !d.isToday)).toBe(true);
  });

  it("фиксирует снимок голосов до объявления и начисляет репутацию без умножения на платный вес", () => {
    const fixedToday = "2026-11-26";
    const bundle = createDbBundle(":memory:");
    seedFullPortalDatabase(bundle, fixedToday);

    const tomorrowIso = addDaysIso(fixedToday, 1);
    const tomorrowDisputes = bundle.db
      .select()
      .from(disputesTable)
      .all()
      .filter((d) => d.tournamentId === "cup-11" && d.scheduledDate === tomorrowIso);

    expect(tomorrowDisputes).toHaveLength(4);

    const userA = upsertOAuthUser(bundle, {
      provider: "telegram",
      providerAccountId: "tg-101",
      handle: "@reader_a",
      displayName: "Читатель А"
    });
    const userB = upsertOAuthUser(bundle, {
      provider: "google",
      providerAccountId: "gg-202",
      handle: "reader_b@example.com",
      displayName: "Читатель Б"
    });

    for (const d of tomorrowDisputes) {
      const heroAId = d.heroAId!;
      const heroBId = d.heroBId!;
      castDisputeBallot(bundle, {
        disputeId: d.id,
        userId: userA.id,
        heroId: heroAId,
        skillId: `${heroAId}:dom:1`,
        stat: "primary",
        weight: 2
      });
      castDisputeBallot(bundle, {
        disputeId: d.id,
        userId: userB.id,
        heroId: heroBId,
        skillId: `${heroBId}:app:1`,
        stat: "secondary",
        weight: 1
      });
    }

    // При наступлении завтрашнего дня окно закрывается и пишется снимок
    syncPortalTimeline(bundle, tomorrowIso);
    const firstSnapshot = bundle.db
      .select()
      .from(disputeVoteSnapshotsTable)
      .where(eq(disputeVoteSnapshotsTable.disputeId, tomorrowDisputes[0]!.id))
      .all();
    expect(firstSnapshot).toHaveLength(2);

    // После объявления голосовать уже нельзя
    expect(() =>
      castDisputeBallot(bundle, {
        disputeId: tomorrowDisputes[0]!.id,
        userId: userA.id,
        heroId: tomorrowDisputes[0]!.heroAId!,
        skillId: `${tomorrowDisputes[0]!.heroAId!}:dom:2`,
        stat: "secondary"
      })
    ).toThrow(/closed/);

    // На следующий день диспуты закрываются и начисляется репутация
    const dayAfterIso = addDaysIso(fixedToday, 2);
    syncPortalTimeline(bundle, dayAfterIso);

    const updatedA = bundle.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userA.id))
      .get()!;
    const updatedB = bundle.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userB.id))
      .get()!;

    // Платный вес 2 не умножает репутацию: за каждую победу стороны начисляется ровно 1 очко
    expect(updatedA.reputationPoints).toBe(updatedA.winsCount);
    expect(updatedB.reputationPoints).toBe(updatedB.winsCount);
  });
});
