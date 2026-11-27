import { createDbBundle, getDefaultDbPath } from "../db/client";
import { getMoscowTodayIso } from "../db/dates";
import { seedFullPortalDatabase } from "../db/engine";
import { heroesTable } from "../db/schema";
import { loadBotEnv } from "./env";
import { handleTelegramUpdate } from "./handlers";
import { syncAndBroadcastDisputes } from "./notifier";
import { TelegramApiClient } from "./telegram-api";

const BOT_COMMANDS = [
  { command: "start", description: "Открыть главное меню и привязать профиль" },
  { command: "tables", description: "Турнирные таблицы групп A–D и сетка плей-офф" },
  { command: "today", description: "Афиша сегодняшней битвы и анонс следующих пар" },
  { command: "heroes", description: "Описание всех 50 персонажей и их навыков" },
  { command: "ratings", description: "Лидеры сводного рейтинга Эло" },
  { command: "vote", description: "Голосование за характеристику навыка героя" },
  { command: "notify", description: "Включить / выключить личные уведомления" }
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBot(): Promise<void> {
  const config = loadBotEnv();
  const dbPath = getDefaultDbPath();
  const bundle = createDbBundle(dbPath);

  const heroesCount = bundle.db.select().from(heroesTable).all().length;
  if (heroesCount === 0) {
    const todayIso = getMoscowTodayIso();
    console.log(`[bot] База пуста (${dbPath}), выполняем начальное заполнение на ${todayIso}...`);
    seedFullPortalDatabase(bundle, todayIso);
  }

  const api = new TelegramApiClient(config.botToken);
  await api.deleteWebhook();
  await api.setMyCommands(BOT_COMMANDS);

  console.log(
    `[bot] Telegram-бот запущен (БД: ${dbPath}, канал: ${config.channelId ?? "не задан, только личные чаты"}).`
  );

  let running = true;
  const stop = () => {
    running = false;
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  let offset = 0;
  let lastSyncAt = 0;

  while (running) {
    const now = Date.now();
    if (now - lastSyncAt >= config.syncIntervalMs) {
      lastSyncAt = now;
      try {
        const { resultsSent, announcesSent } = await syncAndBroadcastDisputes(
          bundle,
          api,
          config.channelId
        );
        if (resultsSent > 0 || announcesSent > 0) {
          console.log(
            `[bot] Разослано уведомлений — результатов: ${resultsSent}, анонсов: ${announcesSent}`
          );
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[bot] Ошибка синхронизации и рассылки: ${msg}`);
      }
    }

    try {
      const updates = await api.getUpdates(offset, config.pollTimeoutSec);
      for (const update of updates) {
        offset = update.update_id + 1;
        await handleTelegramUpdate(bundle, api, update);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[bot] Ошибка получения обновлений: ${msg}`);
      await sleep(3_000);
    }
  }

  bundle.sqlite.close();
  console.log("[bot] Остановлен.");
}

runBot().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[bot] Критическая ошибка: ${msg}`);
  process.exit(1);
});
