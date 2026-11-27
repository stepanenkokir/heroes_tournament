import { asc } from "drizzle-orm";
import { createDbBundle, getDefaultDbPath } from "./client";
import { getMoscowTodayIso } from "./dates";
import { seedFullPortalDatabase } from "./engine";
import { disputesTable, heroesTable, ratingEventsTable, tournamentsTable } from "./schema";

const dbPath = getDefaultDbPath();
const bundle = createDbBundle(dbPath);
const todayIso = getMoscowTodayIso();

seedFullPortalDatabase(bundle, todayIso);

const tournaments = bundle.db
  .select()
  .from(tournamentsTable)
  .orderBy(asc(tournamentsTable.editionNumber))
  .all();
const heroes = bundle.db.select().from(heroesTable).all();
const disputes = bundle.db.select().from(disputesTable).all();
const events = bundle.db.select().from(ratingEventsTable).all();

const heroNameById = new Map(heroes.map((h) => [h.id, h.name]));

console.log(`База данных успешно заполнена (${dbPath}) на дату ${todayIso} (Europe/Moscow):`);
console.log(`- Героев: ${heroes.length}`);
console.log(`- Турниров: ${tournaments.length}`);
for (const t of tournaments) {
  const champ = t.championHeroId ? heroNameById.get(t.championHeroId) : "в розыгрыше";
  console.log(`  • ${t.title} [${t.status}] (${t.startDate} — ${t.endDate}) — Победитель: ${champ}`);
}
console.log(
  `- Диспутов всего: ${disputes.length} (completed: ${disputes.filter((d) => d.status === "completed").length}, announced: ${disputes.filter((d) => d.status === "announced").length}, scheduled: ${disputes.filter((d) => d.status === "scheduled").length})`
);
console.log(`- Событий журнала рейтинга (пруфов): ${events.length}`);
