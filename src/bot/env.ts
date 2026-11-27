import fs from "node:fs";
import path from "node:path";

export interface BotEnvConfig {
  botToken: string;
  channelId: string | null;
  pollTimeoutSec: number;
  syncIntervalMs: number;
}

export function loadDotEnvFile(envPath = path.resolve(process.cwd(), ".env")): void {
  if (!fs.existsSync(envPath)) {
    return;
  }
  const content = fs.readFileSync(envPath, "utf-8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) {
      continue;
    }
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function loadBotEnv(): BotEnvConfig {
  loadDotEnvFile();
  const botToken = (process.env.TELEGRAM_BOT_KEY ?? "").trim();
  if (!botToken) {
    throw new Error("TELEGRAM_BOT_KEY не задан в .env или переменных окружения");
  }
  const rawChannel = (process.env.TELEGRAM_CHANNEL_ID ?? "").trim();
  return {
    botToken,
    channelId: rawChannel.length > 0 ? rawChannel : null,
    pollTimeoutSec: 25,
    syncIntervalMs: 60_000
  };
}
