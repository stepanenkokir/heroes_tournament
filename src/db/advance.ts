import { createDbBundle, getDefaultDbPath } from "./client";
import { getMoscowTodayIso } from "./dates";
import { syncPortalTimeline } from "./engine";
import { disputesTable, heroesTable } from "./schema";

const dbPath = getDefaultDbPath();
const bundle = createDbBundle(dbPath);
const heroesCount = bundle.db.select().from(heroesTable).all().length;

if (heroesCount === 0) {
  console.error(
    `База данных пуста (${dbPath}). Сначала выполните начальное заполнение: npm run seed`
  );
  process.exit(1);
}

const todayIso = getMoscowTodayIso();
const { completedNow, announcedNow } = syncPortalTimeline(bundle, todayIso);
const disputes = bundle.db.select().from(disputesTable).all();
const completedTotal = disputes.filter((d) => d.status === "completed").length;
const announcedTotal = disputes.filter((d) => d.status === "announced").length;
const scheduledTotal = disputes.filter((d) => d.status === "scheduled").length;

console.log(`Таймлайн синхронизирован (${dbPath}) на дату ${todayIso} (Europe/Moscow):`);
console.log(`- Переведено в completed: ${completedNow}, в announced: ${announcedNow}`);
console.log(
  `- Всего диспутов: ${disputes.length} (completed: ${completedTotal}, announced: ${announcedTotal}, scheduled: ${scheduledTotal})`
);
