import Link from "next/link";
import { DisputeCard } from "@/components/DisputeCard";
import { HeroEmblem } from "@/components/HeroEmblem";
import { formatLocaleDate } from "@/db/dates";
import { getHomePortalData } from "@/db/queries";
import { getMessages } from "@/i18n/dictionaries";
import { fill, formatEdition } from "@/i18n/locale";
import { formatRecord, localizeHero, localizeTournament } from "@/i18n/present";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const {
    todayIso,
    activeTournament,
    todayDisputes,
    upcomingVotingDisputes,
    recentDisputes,
    completedTournaments,
    topHeroes
  } = getHomePortalData();
  const cup = activeTournament ? localizeTournament(activeTournament, locale) : null;

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          {todayIso ? (
            <span className="page-hero__kicker">
              {fill(messages.home.kicker, { date: formatLocaleDate(todayIso, locale, "long") })}
            </span>
          ) : null}
          {cup ? (
            <span className="page-hero__dates">
              {cup.title} ({formatLocaleDate(cup.startDate, locale, "long")} —{" "}
              {formatLocaleDate(cup.endDate, locale, "long")})
            </span>
          ) : null}
        </div>

        <h1 className="page-hero__title">{messages.home.title}</h1>
        <p className="page-hero__subtitle">{messages.home.subtitle}</p>

        <div className="page-hero__actions">
          <Link href="/tournament" className="btn-primary">
            {messages.home.openCup}
          </Link>
          <Link href="/ratings" className="btn-secondary">
            {messages.home.openRatings}
          </Link>
          <Link href="/rules" className="btn-secondary">
            {messages.home.openRules}
          </Link>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {fill(messages.home.billboardTitle, { count: todayDisputes.length })}
            </h2>
            <p className="section-subtitle">{messages.home.billboardSubtitle}</p>
          </div>
          <Link href="/tournament" className="btn-secondary">
            {messages.home.fullCalendar}
          </Link>
        </div>

        <div className="cards-grid-2">
          {todayDisputes.map((card) => (
            <DisputeCard key={card.dispute.id} card={card} expandedAnnouncement />
          ))}
        </div>
      </section>

      {upcomingVotingDisputes.length > 0 ? (
        <section className="section-block">
          <div className="section-header">
            <div>
              <h2 className="section-title">{messages.voting.sectionTitle}</h2>
              <p className="section-subtitle">{messages.voting.sectionSubtitle}</p>
            </div>
            <Link href="/cabinet" className="btn-secondary">
              {messages.nav.cabinet}
            </Link>
          </div>
          <div className="cards-grid-2">
            {upcomingVotingDisputes.map((card) => (
              <DisputeCard key={card.dispute.id} card={card} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section-block">
        <div className="group-card">
          <div className="group-card__header">
            <h3 className="group-card__title">{messages.channels.dailyCardTitle}</h3>
            <a
              href="/api/channels/daily-card"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              {messages.channels.downloadSvgCard}
            </a>
          </div>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.88rem", margin: 0 }}>
            {messages.channels.dailyCardLead}
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">{messages.home.recentTitle}</h2>
            <p className="section-subtitle">{messages.home.recentSubtitle}</p>
          </div>
        </div>

        <div className="cards-grid-2">
          {recentDisputes.map((card) => (
            <DisputeCard key={card.dispute.id} card={card} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">{messages.home.leadersTitle}</h2>
            <p className="section-subtitle">{messages.home.leadersSubtitle}</p>
          </div>
          <Link href="/ratings" className="btn-secondary">
            {messages.home.fullTable}
          </Link>
        </div>

        <div className="elo-proof-grid">
          {topHeroes.map((row, idx) => {
            const hero = localizeHero(row, locale);
            return (
              <Link key={hero.id} href={`/heroes/${hero.slug}`} className="elo-proof-card">
                <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                  <HeroEmblem
                    emblemKey={hero.emblemKey}
                    accentHex={hero.accentHex}
                    name={hero.name}
                    size="md"
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)", fontWeight: 700 }}>
                      #{idx + 1} {messages.home.overall} · {hero.origin}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.18rem",
                        fontWeight: 700
                      }}
                    >
                      {hero.name}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--ink-soft)" }}>{hero.epithet}</div>
                  </div>
                  <div style={{ textAlign: "right" }} className="tabular-nums">
                    <div
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.45rem",
                        fontWeight: 700,
                        color: "var(--cinnabar)"
                      }}
                    >
                      {hero.currentRating}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>
                      {formatRecord(hero.wins, hero.draws, hero.losses, messages)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">{messages.home.archiveTitle}</h2>
            <p className="section-subtitle">{messages.home.archiveSubtitle}</p>
          </div>
          <Link href="/tournaments" className="btn-secondary">
            {messages.home.allTournaments}
          </Link>
        </div>

        <div className="elo-proof-grid">
          {completedTournaments.map(({ tournament, champion, runnerUp }) => {
            const cupItem = localizeTournament(tournament, locale);
            const winner = champion ? localizeHero(champion, locale) : null;
            const finalist = runnerUp ? localizeHero(runnerUp, locale) : null;
            return (
              <div key={cupItem.id} className="group-card">
                <div className="group-card__header">
                  <span className="status-pill status-pill--completed">
                    {fill(messages.home.completed, {
                      edition: formatEdition(cupItem.editionNumber, locale)
                    })}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>
                    {formatLocaleDate(cupItem.startDate, locale, "long")} —{" "}
                    {formatLocaleDate(cupItem.endDate, locale, "long")}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.25rem",
                    marginBottom: "0.35rem"
                  }}
                >
                  {cupItem.title}
                </h3>
                <p style={{ fontSize: "0.86rem", color: "var(--ink-soft)", marginBottom: "0.9rem" }}>
                  {cupItem.subtitle}
                </p>

                {winner ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 0.8rem",
                      background: "var(--gold-soft)",
                      borderRadius: "8px",
                      marginBottom: "0.85rem"
                    }}
                  >
                    <HeroEmblem
                      emblemKey={winner.emblemKey}
                      accentHex={winner.accentHex}
                      name={winner.name}
                      size="sm"
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: "var(--gold-seal)"
                        }}
                      >
                        {messages.home.champion}
                      </div>
                      <Link
                        href={`/heroes/${winner.slug}`}
                        style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
                      >
                        {winner.name}
                      </Link>
                      {finalist ? (
                        <div style={{ fontSize: "0.76rem", color: "var(--ink-soft)" }}>
                          {fill(messages.home.finalAgainst, { name: finalist.name })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <Link href={`/tournaments/${cupItem.slug}`} className="dispute-card__link">
                  {messages.home.openProtocols}
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
