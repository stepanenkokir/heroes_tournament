# Heroes Tournament

Spectator portal for a seeded contest of sixteen literary and legendary heroes. Each meeting is an intellectual dispute: attacking skills (dominants) press, answering skills (appeals) hold, and a deterministic formula turns the exchange into acclaim, retention, and an Elo proof. Nothing is random at read time — every protocol is replayable from its seed.

The UI is localized in English, Spanish, and Russian. The default locale is Russian (`Europe/Moscow` for the schedule). This document is English only; product copy lives in `src/i18n`.

## Stack

- Next.js 15 (App Router) and React 19
- SQLite via `better-sqlite3` and Drizzle ORM
- TypeScript, Vitest
- No external services. The database is a local file.

Node.js 20 or newer is required (`better-sqlite3` ships prebuilds for current Node versions).

## Quick start

```bash
npm install
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Seeding writes `data/heroes-tournament.db` (gitignored) for today's Moscow date: three finished cups and one cup in progress. Re-run `npm run seed` any day to rebuild the file from the roster and the edition seeds. The dev server reads that file; restart it after a reseed if a page still shows the previous day.

```bash
npm test
npm run build
npm start
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run seed` | Wipe and refill `data/heroes-tournament.db` as of today (Moscow) |
| `npm run advance` | Close past disputes and announce today's disputes in `data/heroes-tournament.db` (Moscow date) |
| `npm test` | Vitest (`src/**/*.test.ts`) |
| `npm run build` / `npm start` | Production build and server |

## Daily schedule (12:00 Europe/Moscow)

Page requests only read `data/heroes-tournament.db` and never advance the tournament timeline on their own. Run `npm run seed` once to create the initial database, then schedule `npm run advance` to run daily at 12:00 `Europe/Moscow`. Running `npm run advance` multiple times on the same date is a no-op; if a day was missed, one run catches up all elapsed days.

**Linux (cron):**

```cron
CRON_TZ=Europe/Moscow
0 12 * * * cd /path/to/HeroesTournament && npm run advance
```

**Windows (Task Scheduler):**

Create a daily task triggered at `12:00` in the `Russian Standard Time` (`Europe/Moscow`) time zone that runs `npm run advance` in the project directory:

```powershell
schtasks /Create /SC DAILY /TN "HeroesTournamentAdvance" /TR "cmd /c cd /d C:\Projects\games\HeroesTournament && npm run advance" /ST 12:00 /F
```

## Pages

| Route | Content |
| --- | --- |
| `/` | Today's card: announced skills, yesterday's closed protocols, Elo leaders, archive |
| `/tournament` | Current cup: groups, schedule, knockout bracket |
| `/tournaments` | Archive of completed cups |
| `/tournaments/[slug]` | One edition: tables and all 31 protocols |
| `/heroes/[slug]` | Hero, five dominants, five appeals, record |
| `/disputes/[id]` | Full protocol: exchanges, acclaim, retention, Elo delta |
| `/ratings` | Running Elo table and the proof ledger |
| `/rules` | Formula, domain ring, tournament format |

Locale is chosen from the `ht-locale` cookie, then `Accept-Language`, then Russian. The language switch posts to `POST /api/locale`.

## How a cup works

Sixteen heroes. Each has five dominants and five appeals. A skill belongs to one of six domains and carries two stats in the range 30–90:

- Dominant: sharpness (primary) and depth (secondary)
- Appeal: firmness (primary) and resourcefulness (secondary)

Domains form a ring. Each domain beats the next and loses to the previous:

`reason → word → heart → will → luck → honor → reason`

Affinity is `1.2` when the attacker's domain beats the defender's, `0.8` when it loses, and `1` otherwise.

A cup lasts 13 days in `Europe/Moscow`:

1. **Groups (days 1–6).** Four groups of four, drawn by pots from the current Elo (one hero from each pot per group). Round-robin inside the group.
2. **Knockout (days 7–13).** Quarterfinals, semifinals, final. Pairings come from group places.

Each day the portal closes yesterday's protocols at the date boundary and announces today's meetings. Two dominant/appeal pairs per side are public. A third pair stays sealed and is opened only if the open exchanges do not decide the dispute.

Resolution order:

1. **Main exchange.** Four steps: A1→B1, B1→A1, A2→B2, B2→A2. Higher total acclaim wins.
2. **Sealed extra.** The wax-sealed third pair, same shape, if acclaim is tied.
3. **Decisive.** A further exchange; a step counts only when acclaim is at least 12.
4. **Glory lot.** A deterministic coin flip from the dispute seed, if nothing else separates the sides.

One exchange:

```text
press = sharpness * (0.7 + 0.3 * depth / 100) * affinity
hold  = firmness  * (0.7 + 0.3 * resourcefulness / 100)
acclaim   = max(0, round(press * jitter - hold))
retention = round(min(press * jitter, hold))
```

`jitter` is a small deterministic factor from the dispute seed and the step index. Draws of skill order, group pots, and the glory lot use the same seeded RNG (`src/domain/rng.ts`). Given a seed, `simulateDispute` always returns the same protocol.

Elo starts at 1500 and continues across cups. K is 20 in groups, 28 in the quarterfinals and semifinals, and 36 in the final. Expected score is the standard logistic curve with divisor 400. Every update is stored as a rating event so the ledger can be recomputed and checked.

The default seed builds four editions relative to today (`src/db/engine.ts`, `buildDefaultTournamentSpecs`): three completed cups and the current cup, which is two days in. Edition seeds are fixed strings, so the same calendar date always rebuilds the same database.

## Layout

```text
src/domain/     roster, domains, exchange formula, Elo, bracket, seeded RNG
src/db/         SQLite schema, bootstrap, seed, queries
src/i18n/       en / es / ru dictionaries and hero-skill copy
src/app/        App Router pages and the locale route
src/components/ UI
src/theme.ts    light and dark theme
data/           heroes-tournament.db (created by seed, not committed)
```

Domain code does not import the database. `src/db/engine.ts` (`seed` and `advance`) is the only place that walks editions, writes rows, and advances Elo. Pages only read through `src/db/queries.ts`.

Hero names in the database stay in their canonical form. Translated epithets, origins, and skill text are applied at render time from `src/i18n`.

## Tests

`npm test` covers the exchange formula, domain ring, Elo ledger, tournament draw, monograms, seed invariants, and locale negotiation. The seed test builds an in-memory database and checks that completed disputes, announcements, and the rating ledger stay consistent.
