import Link from "next/link";
import { notFound } from "next/navigation";
import { DomainBadge } from "@/components/DomainBadge";
import { HeroEmblem } from "@/components/HeroEmblem";
import { formatLocaleDate } from "@/db/dates";
import { getHeroProfileView } from "@/db/queries";
import { getMessages } from "@/i18n/dictionaries";
import { fill, formatCupEdition } from "@/i18n/locale";
import { localizeHero, localizeSkill, localizeTournament, stageLabel } from "@/i18n/present";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function HeroProfilePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const { slug } = await params;
  const data = getHeroProfileView(slug);

  if (!data) {
    notFound();
  }

  const hero = localizeHero(data.hero, locale);
  const { rank, ledger, activeDisputes } = data;
  const dominants = data.dominants.map((skill) => localizeSkill(skill, locale));
  const appeals = data.appeals.map((skill) => localizeSkill(skill, locale));

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <Link href="/ratings" className="btn-secondary">
            {messages.hero.back}
          </Link>
          <span className="page-hero__kicker">
            {fill(messages.hero.rank, { rank, origin: hero.origin })}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
            marginTop: "1rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <HeroEmblem emblemKey={hero.emblemKey} accentHex={hero.accentHex} name={hero.name} size="lg" />
            <div>
              <h1 className="page-hero__title" style={{ marginBottom: "0.25rem" }}>
                {hero.name}
              </h1>
              <p className="page-hero__subtitle">{hero.epithet}</p>
            </div>
          </div>

          <div
            className="tabular-nums"
            style={{
              display: "flex",
              gap: "1.25rem",
              background: "var(--parchment-bright)",
              padding: "0.9rem 1.35rem",
              borderRadius: "12px",
              border: "1px solid var(--border-strong)"
            }}
          >
            <div>
              <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>{messages.hero.elo}</div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.65rem",
                  fontWeight: 700,
                  color: "var(--cinnabar)"
                }}
              >
                {hero.currentRating}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>{messages.hero.disputes}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{hero.matchesPlayed}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>{messages.hero.wdl}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {hero.wins} · {hero.draws} · {hero.losses}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>{messages.hero.cups}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{hero.trophiesCount}</div>
            </div>
          </div>
        </div>

        {activeDisputes.length > 0 ? (
          <div className="active-cup-notice">
            {messages.hero.today}{" "}
            <Link
              href={`/disputes/${encodeURIComponent(activeDisputes[0]!.id)}`}
              style={{ fontWeight: 700, textDecoration: "underline" }}
            >
              {messages.hero.openToday}
            </Link>
          </div>
        ) : null}
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">{messages.hero.arsenalTitle}</h2>
            <p className="section-subtitle">{messages.hero.arsenalSubtitle}</p>
          </div>
        </div>

        <div className="cards-grid-2">
          <div className="group-card">
            <div className="group-card__header">
              <h3 className="group-card__title" style={{ color: "var(--cinnabar)" }}>
                {messages.hero.dominantsTitle}
              </h3>
              <span className="group-card__caption" style={{ color: "var(--cinnabar)" }}>
                {messages.hero.sharpDepth}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {dominants.map((skill) => (
                <div key={skill.id} className="skill-box skill-box--dominant">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <span className="skill-box__title">
                      {skill.slot}. {skill.title}
                    </span>
                    <DomainBadge domain={skill.domain} compact />
                  </div>
                  <p className="skill-box__desc">{skill.description}</p>
                  <div className="skill-box__footer tabular-nums">
                    <span>
                      {messages.common.sharpness}: {skill.primaryStat}
                    </span>
                    <span>
                      {messages.common.depth}: {skill.secondaryStat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="group-card">
            <div className="group-card__header">
              <h3 className="group-card__title" style={{ color: "var(--turquoise)" }}>
                {messages.hero.appealsTitle}
              </h3>
              <span className="group-card__caption">{messages.hero.firmWit}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {appeals.map((skill) => (
                <div key={skill.id} className="skill-box skill-box--appeal">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <span className="skill-box__title">
                      {skill.slot}. {skill.title}
                    </span>
                    <DomainBadge domain={skill.domain} compact />
                  </div>
                  <p className="skill-box__desc">{skill.description}</p>
                  <div className="skill-box__footer tabular-nums">
                    <span>
                      {messages.common.firmness}: {skill.primaryStat}
                    </span>
                    <span>
                      {messages.common.wit}: {skill.secondaryStat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">{fill(messages.hero.ledgerTitle, { count: ledger.length })}</h2>
            <p className="section-subtitle">{messages.hero.ledgerSubtitle}</p>
          </div>
        </div>

        <div className="group-card">
          <div className="table-scroll">
            <table className="standings-table tabular-nums">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{messages.hero.date}</th>
                  <th style={{ textAlign: "left" }}>{messages.hero.tournamentStage}</th>
                  <th style={{ textAlign: "left" }}>{messages.hero.opponent}</th>
                  <th>{messages.hero.score}</th>
                  <th>{messages.hero.ratingBefore}</th>
                  <th>{messages.hero.expected}</th>
                  <th>K</th>
                  <th>{messages.hero.delta}</th>
                  <th>{messages.hero.ratingAfter}</th>
                  <th>{messages.hero.protocol}</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map(({ event, opponent, tournament, dispute }) => {
                  const rival = localizeHero(opponent, locale);
                  const cup = localizeTournament(tournament, locale);
                  const isSideA = dispute.heroAId === hero.id;
                  const myAcclaim = isSideA ? dispute.acclaimA : dispute.acclaimB;
                  const oppAcclaim = isSideA ? dispute.acclaimB : dispute.acclaimA;
                  const outcomeBadge =
                    event.actualScore === 1
                      ? messages.hero.win
                      : event.actualScore === 0
                        ? messages.hero.loss
                        : messages.hero.draw;

                  return (
                    <tr key={event.id}>
                      <td>{event.sequence}</td>
                      <td>{formatLocaleDate(event.scheduledDate, locale, "short")}</td>
                      <td style={{ textAlign: "left" }}>
                        <Link
                          href={cup.status === "active" ? "/tournament" : `/tournaments/${cup.slug}`}
                          style={{ fontWeight: 600 }}
                        >
                          {formatCupEdition(cup.editionNumber, locale)}
                        </Link>{" "}
                        · {stageLabel(event.stage, dispute.groupCode, messages)}
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <Link href={`/heroes/${rival.slug}`} className="standings-table__hero-link">
                          {rival.name}
                        </Link>
                      </td>
                      <td>
                        <strong>
                          {myAcclaim}:{oppAcclaim}
                        </strong>{" "}
                        <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>
                          ({outcomeBadge})
                        </span>
                      </td>
                      <td>{event.ratingBefore}</td>
                      <td>{event.expectedScore.toFixed(3)}</td>
                      <td>{event.kFactor}</td>
                      <td>
                        <span
                          className={
                            event.delta > 0
                              ? "delta-positive"
                              : event.delta < 0
                                ? "delta-negative"
                                : "delta-neutral"
                          }
                        >
                          {event.delta > 0 ? `+${event.delta}` : event.delta}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{event.ratingAfter}</td>
                      <td>
                        <Link
                          href={`/disputes/${encodeURIComponent(dispute.id)}`}
                          className="dispute-card__link"
                        >
                          {messages.hero.proofLink}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
