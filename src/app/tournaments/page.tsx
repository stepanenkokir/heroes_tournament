import Link from "next/link";
import { HeroEmblem } from "@/components/HeroEmblem";
import { formatLocaleDate } from "@/db/dates";
import { getAllTournamentsSummary } from "@/db/queries";
import { getMessages } from "@/i18n/dictionaries";
import { fill } from "@/i18n/locale";
import { localizeHero, localizeTournament } from "@/i18n/present";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function AllTournamentsArchivePage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const summaries = getAllTournamentsSummary().sort(
    (a, b) => b.tournament.editionNumber - a.tournament.editionNumber
  );

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <span className="page-hero__kicker">{messages.archive.kicker}</span>
          <span className="page-hero__dates">
            {fill(messages.archive.dates, { count: summaries.length })}
          </span>
        </div>
        <h1 className="page-hero__title">{messages.archive.title}</h1>
        <p className="page-hero__subtitle">{messages.archive.subtitle}</p>
      </section>

      <div className="cards-grid-2">
        {summaries.map(({ tournament, champion, runnerUp }) => {
          const cup = localizeTournament(tournament, locale);
          const winner = champion ? localizeHero(champion, locale) : null;
          const finalist = runnerUp ? localizeHero(runnerUp, locale) : null;
          const href = cup.status === "active" ? "/tournament" : `/tournaments/${cup.slug}`;
          return (
            <article key={cup.id} className="group-card">
              <div className="group-card__header">
                <span
                  className={`status-pill ${
                    cup.status === "active" ? "status-pill--announced" : "status-pill--completed"
                  }`}
                >
                  {cup.status === "active" ? messages.status.currentDraw : messages.status.archivedCup}
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>
                  {formatLocaleDate(cup.startDate, locale, "long")} —{" "}
                  {formatLocaleDate(cup.endDate, locale, "long")}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.4rem",
                  marginBottom: "0.4rem"
                }}
              >
                {cup.title}
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", marginBottom: "1rem" }}>
                {cup.subtitle}
              </p>

              {winner && finalist ? (
                <div className="champion-banner" style={{ marginTop: 0, marginBottom: "1rem" }}>
                  <div className="champion-banner__item">
                    <HeroEmblem
                      emblemKey={winner.emblemKey}
                      accentHex={winner.accentHex}
                      name={winner.name}
                      size="sm"
                    />
                    <div>
                      <div className="champion-banner__label">{messages.archive.champion}</div>
                      <Link href={`/heroes/${winner.slug}`} className="champion-banner__name">
                        {winner.name}
                      </Link>
                    </div>
                  </div>
                  <div className="champion-banner__item">
                    <HeroEmblem
                      emblemKey={finalist.emblemKey}
                      accentHex={finalist.accentHex}
                      name={finalist.name}
                      size="sm"
                    />
                    <div>
                      <div className="champion-banner__label">{messages.archive.finalist}</div>
                      <Link href={`/heroes/${finalist.slug}`} className="champion-banner__name">
                        {finalist.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="active-cup-notice" style={{ marginTop: 0, marginBottom: "1rem" }}>
                  {messages.archive.inProgress}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.5rem",
                  borderTop: "1px dashed var(--border-warm)",
                  fontSize: "0.82rem"
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink-muted)" }}>
                  seed: {cup.seed}
                </span>
                <Link href={href} className="btn-primary">
                  {messages.archive.open}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
