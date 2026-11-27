import Database, { type Database as BetterSqliteDatabase } from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

export type AppDrizzleDb = BetterSQLite3Database<typeof schema>;

export interface AppDbBundle {
  sqlite: BetterSqliteDatabase;
  db: AppDrizzleDb;
}

const BOOTSTRAP_DDL = `
CREATE TABLE IF NOT EXISTS heroes (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  epithet TEXT NOT NULL,
  emblem_key TEXT NOT NULL,
  accent_hex TEXT NOT NULL,
  current_rating INTEGER NOT NULL,
  matches_played INTEGER NOT NULL,
  wins INTEGER NOT NULL,
  draws INTEGER NOT NULL,
  losses INTEGER NOT NULL,
  trophies_count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  hero_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  slot INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  primary_stat INTEGER NOT NULL,
  secondary_stat INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tournaments (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  edition_number INTEGER NOT NULL,
  field_kind TEXT NOT NULL DEFAULT 'open',
  theme_id TEXT,
  seed TEXT NOT NULL,
  status TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  champion_hero_id TEXT,
  runner_up_hero_id TEXT
);

CREATE TABLE IF NOT EXISTS tournament_groups (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  group_code TEXT NOT NULL,
  title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tournament_participants (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  group_code TEXT NOT NULL,
  hero_id TEXT NOT NULL,
  pot_number INTEGER NOT NULL,
  entry_rating INTEGER NOT NULL,
  seed_rank INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS disputes (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  group_code TEXT,
  playoff_slot TEXT,
  day_offset INTEGER NOT NULL,
  scheduled_date TEXT NOT NULL,
  match_order INTEGER NOT NULL,
  seed TEXT NOT NULL,
  status TEXT NOT NULL,
  hero_a_id TEXT,
  hero_b_id TEXT,
  source_label_a TEXT,
  source_label_b TEXT,
  acclaim_a INTEGER,
  acclaim_b INTEGER,
  retention_a INTEGER,
  retention_b INTEGER,
  sealed_used INTEGER NOT NULL,
  decisive_used INTEGER NOT NULL,
  decisive_score_a INTEGER NOT NULL,
  decisive_score_b INTEGER NOT NULL,
  glory_lot_used INTEGER NOT NULL,
  glory_lot_winner TEXT,
  resolution TEXT,
  winner_side TEXT,
  winner_hero_id TEXT
);

CREATE TABLE IF NOT EXISTS dispute_announcements (
  id TEXT PRIMARY KEY,
  dispute_id TEXT NOT NULL,
  side TEXT NOT NULL,
  slot_index INTEGER NOT NULL,
  dominant_skill_id TEXT NOT NULL,
  appeal_skill_id TEXT NOT NULL,
  is_sealed INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS dispute_exchanges (
  id TEXT PRIMARY KEY,
  dispute_id TEXT NOT NULL,
  step INTEGER NOT NULL,
  phase TEXT NOT NULL,
  attacker_side TEXT NOT NULL,
  defender_side TEXT NOT NULL,
  dominant_skill_id TEXT NOT NULL,
  appeal_skill_id TEXT NOT NULL,
  dominant_domain TEXT NOT NULL,
  appeal_domain TEXT NOT NULL,
  affinity REAL NOT NULL,
  jitter REAL NOT NULL,
  raw_press REAL NOT NULL,
  effective_press REAL NOT NULL,
  raw_hold REAL NOT NULL,
  acclaim INTEGER NOT NULL,
  retention INTEGER NOT NULL,
  decisive_accepted INTEGER
);

CREATE TABLE IF NOT EXISTS rating_events (
  id TEXT PRIMARY KEY,
  sequence INTEGER NOT NULL,
  tournament_id TEXT NOT NULL,
  dispute_id TEXT NOT NULL,
  hero_id TEXT NOT NULL,
  opponent_hero_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  rating_before INTEGER NOT NULL,
  expected_score REAL NOT NULL,
  actual_score REAL NOT NULL,
  k_factor INTEGER NOT NULL,
  delta INTEGER NOT NULL,
  rating_after INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  avatar_text TEXT NOT NULL,
  reputation_points INTEGER NOT NULL DEFAULT 0,
  wins_count INTEGER NOT NULL DEFAULT 0,
  votes_count INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  handle TEXT NOT NULL,
  linked_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dispute_votes (
  id TEXT PRIMARY KEY,
  dispute_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  hero_id TEXT NOT NULL,
  skill_id TEXT NOT NULL,
  stat TEXT NOT NULL,
  weight INTEGER NOT NULL DEFAULT 1,
  reputation_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dispute_vote_snapshots (
  id TEXT PRIMARY KEY,
  dispute_id TEXT NOT NULL,
  hero_id TEXT NOT NULL,
  skill_id TEXT NOT NULL,
  stat TEXT NOT NULL,
  total_weight INTEGER NOT NULL,
  share REAL NOT NULL,
  raw_bonus REAL NOT NULL,
  applied_bonus INTEGER NOT NULL,
  frozen_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code TEXT NOT NULL,
  earned_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hero_submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  season_edition INTEGER NOT NULL,
  kind TEXT NOT NULL,
  target_hero_id TEXT,
  proposed_name TEXT NOT NULL,
  origin_or_domain TEXT NOT NULL,
  description TEXT NOT NULL,
  public_domain_attested INTEGER NOT NULL,
  license_granted INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dispute_commentaries (
  id TEXT PRIMARY KEY,
  dispute_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_turn TEXT NOT NULL,
  model_tag TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS telegram_subscribers (
  chat_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT,
  display_name TEXT NOT NULL,
  notify_enabled INTEGER NOT NULL DEFAULT 1,
  linked_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS telegram_outbound (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  dispute_id TEXT NOT NULL,
  sent_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_disputes_tournament ON disputes(tournament_id, day_offset, match_order);
CREATE INDEX IF NOT EXISTS idx_rating_events_hero ON rating_events(hero_id, sequence);
CREATE INDEX IF NOT EXISTS idx_rating_events_dispute ON rating_events(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_votes_dispute ON dispute_votes(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_vote_snapshots_dispute ON dispute_vote_snapshots(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_commentaries_dispute ON dispute_commentaries(dispute_id, locale);
`;

function ensureColumnsMigrated(sqlite: BetterSqliteDatabase): void {
  const columns = sqlite.pragma("table_info(tournaments)") as Array<{ name: string }>;
  const names = new Set(columns.map((c) => c.name));
  if (!names.has("field_kind")) {
    sqlite.exec("ALTER TABLE tournaments ADD COLUMN field_kind TEXT NOT NULL DEFAULT 'open';");
  }
  if (!names.has("theme_id")) {
    sqlite.exec("ALTER TABLE tournaments ADD COLUMN theme_id TEXT;");
  }
}

export function createDbBundle(dbPath: string): AppDbBundle {
  if (dbPath !== ":memory:") {
    const dir = path.dirname(dbPath);
    fs.mkdirSync(dir, { recursive: true });
  }
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(BOOTSTRAP_DDL);
  ensureColumnsMigrated(sqlite);

  const db = drizzle(sqlite, { schema });
  return { sqlite, db };
}

export function getDefaultDbPath(): string {
  return path.resolve(process.cwd(), "data", "heroes-tournament.db");
}

declare global {
  // eslint-disable-next-line no-var
  var __heroesTournamentDbBundle: AppDbBundle | undefined;
}

export function getGlobalDbBundle(): AppDbBundle {
  if (!globalThis.__heroesTournamentDbBundle) {
    globalThis.__heroesTournamentDbBundle = createDbBundle(getDefaultDbPath());
  }
  return globalThis.__heroesTournamentDbBundle;
}
