import Link from "next/link";
import { HeroEmblem } from "@/components/HeroEmblem";
import { formatRussianDate } from "@/db/dates";
import { getAllTournamentsSummary } from "@/db/queries";

export const dynamic = "force-dynamic";

export default function AllTournamentsArchivePage() {
  const summaries = getAllTournamentsSummary().sort(
    (a, b) => b.tournament.editionNumber - a.tournament.editionNumber
  );

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <span className="page-hero__kicker">Летопись состязаний</span>
          <span className="page-hero__dates">Всего розыгрышей в базе: {summaries.length}</span>
        </div>
        <h1 className="page-hero__title">Турнирные таблицы прошедших и текущих кубков</h1>
        <p className="page-hero__subtitle">
          Каждый кубок состоит из группового этапа (4 группы по 4 героя, 24 диспута) и плей-офф из 7
          диспутов на выбывание. Все протоколы сохранены с детерминированным сидом.
        </p>
      </section>

      <div className="cards-grid-2">
        {summaries.map(({ tournament, champion, runnerUp }) => {
          const href =
            tournament.status === "active" ? "/tournament" : `/tournaments/${tournament.slug}`;
          return (
            <article key={tournament.id} className="group-card">
              <div className="group-card__header">
                <span
                  className={`status-pill ${
                    tournament.status === "active"
                      ? "status-pill--announced"
                      : "status-pill--completed"
                  }`}
                >
                  {tournament.status === "active" ? "Текущий розыгрыш" : "Архивный кубок"}
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--ink-muted)" }}>
                  {formatRussianDate(tournament.startDate)} — {formatRussianDate(tournament.endDate)}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.4rem",
                  marginBottom: "0.4rem"
                }}
              >
                {tournament.title}
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", marginBottom: "1rem" }}>
                {tournament.subtitle}
              </p>

              {champion && runnerUp ? (
                <div className="champion-banner" style={{ marginTop: 0, marginBottom: "1rem" }}>
                  <div className="champion-banner__item">
                    <HeroEmblem
                      emblemKey={champion.emblemKey}
                      accentHex={champion.accentHex}
                      name={champion.name}
                      size="sm"
                    />
                    <div>
                      <div className="champion-banner__label">Триумфатор</div>
                      <Link href={`/heroes/${champion.slug}`} className="champion-banner__name">
                        {champion.name}
                      </Link>
                    </div>
                  </div>
                  <div className="champion-banner__item">
                    <HeroEmblem
                      emblemKey={runnerUp.emblemKey}
                      accentHex={runnerUp.accentHex}
                      name={runnerUp.name}
                      size="sm"
                    />
                    <div>
                      <div className="champion-banner__label">Финалист</div>
                      <Link href={`/heroes/${runnerUp.slug}`} className="champion-banner__name">
                        {runnerUp.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="active-cup-notice" style={{ marginTop: 0, marginBottom: "1rem" }}>
                  Идёт групповой этап · Ежедневные анонсы открыты на главной странице
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
                  seed: {tournament.seed}
                </span>
                <Link href={href} className="btn-primary">
                  Открыть таблицы и сетку →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
