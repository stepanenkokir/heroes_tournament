import Link from "next/link";
import { HeroEmblem } from "@/components/HeroEmblem";
import { getRatingsLeaderboardView } from "@/db/queries";
import { getMessages } from "@/i18n/dictionaries";
import { fill } from "@/i18n/locale";
import { localizeHero } from "@/i18n/present";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function RatingsLeaderboardPage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const { rows, verification } = getRatingsLeaderboardView();

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <span className="page-hero__kicker">{messages.ratings.kicker}</span>
          <span className="page-hero__dates">
            {fill(messages.ratings.dates, {
              initial: verification.initialRating,
              count: verification.totalEvents
            })}
          </span>
        </div>
        <h1 className="page-hero__title">{messages.ratings.title}</h1>
        <p className="page-hero__subtitle">{messages.ratings.subtitle}</p>
      </section>

      <div className="verification-banner">
        <div>
          <strong>{messages.ratings.verifyLabel}</strong>{" "}
          {verification.valid
            ? fill(messages.ratings.verifyOk, {
                heroes: rows.length,
                events: verification.totalEvents,
                initial: verification.initialRating
              })
            : messages.ratings.verifyBad}
        </div>
        <Link href="/rules" className="btn-secondary">
          {messages.ratings.howElo}
        </Link>
      </div>

      <div className="group-card">
        <div className="table-scroll">
          <table className="standings-table tabular-nums">
            <thead>
              <tr>
                <th>{messages.ratings.place}</th>
                <th style={{ textAlign: "left" }}>{messages.ratings.hero}</th>
                <th>{messages.ratings.current}</th>
                <th>{messages.ratings.from1500}</th>
                <th>{messages.ratings.peak}</th>
                <th>{messages.ratings.cups}</th>
                <th>{messages.ratings.disputes}</th>
                <th>{messages.ratings.wdl}</th>
                <th>{messages.ratings.lastFive}</th>
                <th>{messages.ratings.journal}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const hero = localizeHero(row.hero, locale);
                return (
                  <tr key={hero.id}>
                    <td className="standings-table__rank">#{row.rank}</td>
                    <td className="standings-table__hero-cell">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <HeroEmblem
                          emblemKey={hero.emblemKey}
                          accentHex={hero.accentHex}
                          name={hero.name}
                          size="sm"
                        />
                        <div>
                          <Link
                            href={`/heroes/${hero.slug}`}
                            className="standings-table__hero-link"
                            style={{ fontSize: "1.02rem" }}
                          >
                            {hero.name}
                          </Link>
                          <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>
                            {hero.origin} · {hero.epithet}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "var(--ink)"
                      }}
                    >
                      {hero.currentRating}
                    </td>
                    <td>
                      <span
                        className={
                          row.netDelta > 0
                            ? "delta-positive"
                            : row.netDelta < 0
                              ? "delta-negative"
                              : "delta-neutral"
                        }
                      >
                        {row.netDelta > 0 ? `+${row.netDelta}` : row.netDelta}
                      </span>
                    </td>
                    <td>{row.peakRating}</td>
                    <td>
                      {hero.trophiesCount > 0 ? (
                        <span
                          style={{
                            background: "var(--gold-soft)",
                            color: "var(--gold-seal)",
                            padding: "0.18rem 0.5rem",
                            borderRadius: "999px",
                            fontWeight: 700,
                            fontSize: "0.78rem"
                          }}
                        >
                          {fill(messages.ratings.trophy, { count: hero.trophiesCount })}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{hero.matchesPlayed}</td>
                    <td>
                      {hero.wins} · {hero.draws} · {hero.losses}
                    </td>
                    <td>
                      <div className="proof-chips">
                        {row.lastFive.map(({ event, opponent }) => {
                          const rival = localizeHero(opponent, locale);
                          return (
                            <Link
                              key={event.id}
                              href={`/disputes/${encodeURIComponent(event.disputeId)}`}
                              className={`proof-chip ${
                                event.delta > 0
                                  ? "delta-positive"
                                  : event.delta < 0
                                    ? "delta-negative"
                                    : "delta-neutral"
                              }`}
                              title={fill(messages.ratings.proofTitle, {
                                date: event.scheduledDate,
                                name: rival.name,
                                before: event.ratingBefore,
                                after: event.ratingAfter
                              })}
                            >
                              {event.delta > 0 ? `+${event.delta}` : event.delta}
                            </Link>
                          );
                        })}
                      </div>
                    </td>
                    <td>
                      <Link href={`/heroes/${hero.slug}`} className="dispute-card__link">
                        {fill(messages.ratings.allProofs, { count: row.totalEventsCount })}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
