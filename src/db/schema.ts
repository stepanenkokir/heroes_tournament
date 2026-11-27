import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const heroesTable = sqliteTable("heroes", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  origin: text("origin").notNull(),
  epithet: text("epithet").notNull(),
  emblemKey: text("emblem_key").notNull(),
  accentHex: text("accent_hex").notNull(),
  currentRating: integer("current_rating").notNull(),
  matchesPlayed: integer("matches_played").notNull(),
  wins: integer("wins").notNull(),
  draws: integer("draws").notNull(),
  losses: integer("losses").notNull(),
  trophiesCount: integer("trophies_count").notNull()
});

export const skillsTable = sqliteTable("skills", {
  id: text("id").primaryKey(),
  heroId: text("hero_id").notNull(),
  kind: text("kind").notNull(), // "dominant" | "appeal"
  slot: integer("slot").notNull(), // 1..5
  title: text("title").notNull(),
  description: text("description").notNull(),
  domain: text("domain").notNull(),
  primaryStat: integer("primary_stat").notNull(),
  secondaryStat: integer("secondary_stat").notNull()
});

export const tournamentsTable = sqliteTable("tournaments", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  editionNumber: integer("edition_number").notNull(),
  fieldKind: text("field_kind").notNull(), // "open" | "theme"
  themeId: text("theme_id"), // "myth_bylina" | "road_sea" | "tricksters" | "direct_argument" | null
  seed: text("seed").notNull(),
  status: text("status").notNull(), // "active" | "completed"
  startDate: text("start_date").notNull(), // YYYY-MM-DD
  endDate: text("end_date").notNull(), // YYYY-MM-DD
  championHeroId: text("champion_hero_id"),
  runnerUpHeroId: text("runner_up_hero_id")
});

export const tournamentGroupsTable = sqliteTable("tournament_groups", {
  id: text("id").primaryKey(),
  tournamentId: text("tournament_id").notNull(),
  groupCode: text("group_code").notNull(),
  title: text("title").notNull()
});

export const tournamentParticipantsTable = sqliteTable("tournament_participants", {
  id: text("id").primaryKey(),
  tournamentId: text("tournament_id").notNull(),
  groupCode: text("group_code").notNull(),
  heroId: text("hero_id").notNull(),
  potNumber: integer("pot_number").notNull(),
  entryRating: integer("entry_rating").notNull(),
  seedRank: integer("seed_rank").notNull()
});

export const disputesTable = sqliteTable("disputes", {
  id: text("id").primaryKey(),
  tournamentId: text("tournament_id").notNull(),
  stage: text("stage").notNull(), // "group" | "qf" | "sf" | "final"
  groupCode: text("group_code"),
  playoffSlot: text("playoff_slot"), // "QF1".."FINAL"
  dayOffset: integer("day_offset").notNull(),
  scheduledDate: text("scheduled_date").notNull(), // YYYY-MM-DD
  matchOrder: integer("match_order").notNull(),
  seed: text("seed").notNull(),
  status: text("status").notNull(), // "scheduled" | "announced" | "completed"
  heroAId: text("hero_a_id"),
  heroBId: text("hero_b_id"),
  sourceLabelA: text("source_label_a"),
  sourceLabelB: text("source_label_b"),
  acclaimA: integer("acclaim_a"),
  acclaimB: integer("acclaim_b"),
  retentionA: integer("retention_a"),
  retentionB: integer("retention_b"),
  sealedUsed: integer("sealed_used", { mode: "boolean" }).notNull(),
  decisiveUsed: integer("decisive_used", { mode: "boolean" }).notNull(),
  decisiveScoreA: integer("decisive_score_a").notNull(),
  decisiveScoreB: integer("decisive_score_b").notNull(),
  gloryLotUsed: integer("glory_lot_used", { mode: "boolean" }).notNull(),
  gloryLotWinner: text("glory_lot_winner"),
  resolution: text("resolution"),
  winnerSide: text("winner_side"),
  winnerHeroId: text("winner_hero_id")
});

export const disputeAnnouncementsTable = sqliteTable("dispute_announcements", {
  id: text("id").primaryKey(),
  disputeId: text("dispute_id").notNull(),
  side: text("side").notNull(), // "A" | "B"
  slotIndex: integer("slot_index").notNull(), // 0..4
  dominantSkillId: text("dominant_skill_id").notNull(),
  appealSkillId: text("appeal_skill_id").notNull(),
  isSealed: integer("is_sealed", { mode: "boolean" }).notNull()
});

export const disputeExchangesTable = sqliteTable("dispute_exchanges", {
  id: text("id").primaryKey(),
  disputeId: text("dispute_id").notNull(),
  step: integer("step").notNull(),
  phase: text("phase").notNull(), // "main" | "sealed_extra" | "decisive"
  attackerSide: text("attacker_side").notNull(),
  defenderSide: text("defender_side").notNull(),
  dominantSkillId: text("dominant_skill_id").notNull(),
  appealSkillId: text("appeal_skill_id").notNull(),
  dominantDomain: text("dominant_domain").notNull(),
  appealDomain: text("appeal_domain").notNull(),
  affinity: real("affinity").notNull(),
  jitter: real("jitter").notNull(),
  rawPress: real("raw_press").notNull(),
  effectivePress: real("effective_press").notNull(),
  rawHold: real("raw_hold").notNull(),
  acclaim: integer("acclaim").notNull(),
  retention: integer("retention").notNull(),
  decisiveAccepted: integer("decisive_accepted", { mode: "boolean" })
});

export const ratingEventsTable = sqliteTable("rating_events", {
  id: text("id").primaryKey(),
  sequence: integer("sequence").notNull(),
  tournamentId: text("tournament_id").notNull(),
  disputeId: text("dispute_id").notNull(),
  heroId: text("hero_id").notNull(),
  opponentHeroId: text("opponent_hero_id").notNull(),
  stage: text("stage").notNull(),
  scheduledDate: text("scheduled_date").notNull(),
  ratingBefore: integer("rating_before").notNull(),
  expectedScore: real("expected_score").notNull(),
  actualScore: real("actual_score").notNull(),
  kFactor: integer("k_factor").notNull(),
  delta: integer("delta").notNull(),
  ratingAfter: integer("rating_after").notNull()
});

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  avatarText: text("avatar_text").notNull(),
  reputationPoints: integer("reputation_points").notNull(),
  winsCount: integer("wins_count").notNull(),
  votesCount: integer("votes_count").notNull(),
  currentStreak: integer("current_streak").notNull(),
  bestStreak: integer("best_streak").notNull(),
  createdAt: text("created_at").notNull()
});

export const oauthAccountsTable = sqliteTable("oauth_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  provider: text("provider").notNull(), // "telegram" | "google" | "vk"
  providerAccountId: text("provider_account_id").notNull(),
  handle: text("handle").notNull(),
  linkedAt: text("linked_at").notNull()
});

export const disputeVotesTable = sqliteTable("dispute_votes", {
  id: text("id").primaryKey(),
  disputeId: text("dispute_id").notNull(),
  userId: text("user_id").notNull(),
  heroId: text("hero_id").notNull(),
  skillId: text("skill_id").notNull(),
  stat: text("stat").notNull(), // "primary" | "secondary"
  weight: integer("weight").notNull(), // 1 | 2
  reputationAwarded: integer("reputation_awarded", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const disputeVoteSnapshotsTable = sqliteTable("dispute_vote_snapshots", {
  id: text("id").primaryKey(),
  disputeId: text("dispute_id").notNull(),
  heroId: text("hero_id").notNull(),
  skillId: text("skill_id").notNull(),
  stat: text("stat").notNull(), // "primary" | "secondary"
  totalWeight: integer("total_weight").notNull(),
  share: real("share").notNull(),
  rawBonus: real("raw_bonus").notNull(),
  appliedBonus: integer("applied_bonus").notNull(),
  frozenAt: text("frozen_at").notNull()
});

export const userAchievementsTable = sqliteTable("user_achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  code: text("code").notNull(),
  earnedAt: text("earned_at").notNull()
});

export const heroSubmissionsTable = sqliteTable("hero_submissions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  seasonEdition: integer("season_edition").notNull(),
  kind: text("kind").notNull(), // "hero" | "skill"
  targetHeroId: text("target_hero_id"),
  proposedName: text("proposed_name").notNull(),
  originOrDomain: text("origin_or_domain").notNull(),
  description: text("description").notNull(),
  publicDomainAttested: integer("public_domain_attested", { mode: "boolean" }).notNull(),
  licenseGranted: integer("license_granted", { mode: "boolean" }).notNull(),
  status: text("status").notNull(), // "pending_moderation" | "approved" | "rejected"
  createdAt: text("created_at").notNull()
});

export const disputeCommentariesTable = sqliteTable("dispute_commentaries", {
  id: text("id").primaryKey(),
  disputeId: text("dispute_id").notNull(),
  locale: text("locale").notNull(), // "ru" | "en" | "es"
  headline: text("headline").notNull(),
  summary: text("summary").notNull(),
  keyTurn: text("key_turn").notNull(),
  modelTag: text("model_tag").notNull()
});
