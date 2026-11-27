import Link from "next/link";
import { DisputeCard } from "@/components/DisputeCard";
import { HeroEmblem } from "@/components/HeroEmblem";
import { formatRussianDate } from "@/db/dates";
import { getHomePortalData } from "@/db/queries";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const {
    todayIso,
    activeTournament,
    todayDisputes,
    recentDisputes,
    completedTournaments,
    topHeroes
  } = getHomePortalData();

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <span className="page-hero__kicker">
            Анонс дня · {formatRussianDate(todayIso)} · Europe/Moscow
          </span>
          <span className="page-hero__dates">
            {activeTournament.title} ({formatRussianDate(activeTournament.startDate)} —{" "}
            {formatRussianDate(activeTournament.endDate)})
          </span>
        </div>

        <h1 className="page-hero__title">
          Сегодняшние диспуты: навыки открыты, итог откроется завтра
        </h1>
        <p className="page-hero__subtitle">
          Каждое утро портал закрывает вчерашние протоколы и объявляет по две доминанты и две
          апелляции героев на сегодняшние встречи. Третья пара остаётся под сургучной печатью на
          случай равенства в плей-офф.
        </p>

        <div className="page-hero__actions">
          <Link href="/tournament" className="btn-primary">
            Открыть таблицу и расписание кубка →
          </Link>
          <Link href="/ratings" className="btn-secondary">
            Рейтинг Эло и пруфы всех 16 героев
          </Link>
          <Link href="/rules" className="btn-secondary">
            Формула признания и кольцо доменов
          </Link>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Афиша дня · {todayDisputes.length} диспута в группах A, B, C, D
            </h2>
            <p className="section-subtitle">
              Два открытых навыка нападения (доминанты) и два навыка ответа (апелляции) уже
              известны. Счёт появится в 00:00 по Москве.
            </p>
          </div>
          <Link href="/tournament" className="btn-secondary">
            Весь календарь (13 дней) →
          </Link>
        </div>

        <div className="cards-grid-2">
          {todayDisputes.map((card) => (
            <DisputeCard key={card.dispute.id} card={card} expandedAnnouncement />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">Только что закрытые протоколы текущего кубка</h2>
            <p className="section-subtitle">
              Итоги вчерашнего игрового дня с пошаговым расчётом признания, удержания и дельты Эло.
            </p>
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
            <h2 className="section-title">Лидеры сводного рейтинга Эло</h2>
            <p className="section-subtitle">
              Рейтинг ведётся непрерывно от 1500 пунктов через все архивные и текущие кубки.
            </p>
          </div>
          <Link href="/ratings" className="btn-secondary">
            Полная таблица и журнал пруфов →
          </Link>
        </div>

        <div className="elo-proof-grid">
          {topHeroes.map((hero, idx) => (
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
                    #{idx + 1} В ОБЩЕМ ЗАЧЁТЕ · {hero.origin}
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
                  <div style={{ fontSize: "0.82rem", color: "var(--ink-soft)" }}>
                    {hero.epithet}
                  </div>
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
                    {hero.wins}В · {hero.draws}Н · {hero.losses}П
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">Архив завершённых кубков</h2>
            <p className="section-subtitle">
              Три полностью сыгранных турнира (по 31 диспуту в каждом) с таблицами групп и сеткой
              плей-офф.
            </p>
          </div>
          <Link href="/tournaments" className="btn-secondary">
            Все турниры →
          </Link>
        </div>

        <div className="elo-proof-grid">
          {completedTournaments.map(({ tournament, champion, runnerUp }) => (
            <div key={tournament.id} className="group-card">
              <div className="group-card__header">
                <span className="status-pill status-pill--completed">
                  Завершён · {tournament.editionNumber}-й созыв
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--ink-muted)" }}>
                  {formatRussianDate(tournament.startDate)} — {formatRussianDate(tournament.endDate)}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.25rem",
                  marginBottom: "0.35rem"
                }}
              >
                {tournament.title}
              </h3>
              <p style={{ fontSize: "0.86rem", color: "var(--ink-soft)", marginBottom: "0.9rem" }}>
                {tournament.subtitle}
              </p>

              {champion ? (
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
                    emblemKey={champion.emblemKey}
                    accentHex={champion.accentHex}
                    name={champion.name}
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
                      Обладатель Кубка
                    </div>
                    <Link
                      href={`/heroes/${champion.slug}`}
                      style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
                    >
                      {champion.name}
                    </Link>
                    {runnerUp ? (
                      <div style={{ fontSize: "0.76rem", color: "var(--ink-soft)" }}>
                        Финал против: {runnerUp.name}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <Link href={`/tournaments/${tournament.slug}`} className="dispute-card__link">
                Открыть таблицы групп и все 31 протокол →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
