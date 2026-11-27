import Link from "next/link";
import { HeroEmblem } from "@/components/HeroEmblem";
import { getRatingsLeaderboardView } from "@/db/queries";

export const dynamic = "force-dynamic";

export default function RatingsLeaderboardPage() {
  const { rows, verification } = getRatingsLeaderboardView();

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <span className="page-hero__kicker">Непрерывный реестр Эло</span>
          <span className="page-hero__dates">
            Стартовый рейтинг: {verification.initialRating} · Пруфов в базе:{" "}
            {verification.totalEvents}
          </span>
        </div>
        <h1 className="page-hero__title">Таблица рейтинга всех героев с пруфами</h1>
        <p className="page-hero__subtitle">
          Каждое изменение рейтинга подкреплено ссылкой на протокол конкретного диспута. Кликните на
          героя, чтобы открыть полный хронологический журнал его выступлений от первого кубка до
          сегодняшнего дня.
        </p>
      </section>

      <div className="verification-banner">
        <div>
          <strong>Автоматическая сверка журнала:</strong>{" "}
          {verification.valid
            ? `Все ${rows.length} рейтингов героев точно сходятся при полном пересчёте ${verification.totalEvents} событий от стартовых ${verification.initialRating} пунктов.`
            : "Обнаружено расхождение в журнале рейтинга."}
        </div>
        <Link href="/rules" className="btn-secondary">
          Как устроена формула Эло (K = 20 / 28 / 36) →
        </Link>
      </div>

      <div className="group-card">
        <div className="table-scroll">
          <table className="standings-table tabular-nums">
            <thead>
              <tr>
                <th>Место</th>
                <th style={{ textAlign: "left" }}>Герой</th>
                <th>Текущий Эло</th>
                <th>От 1500</th>
                <th>Пик Эло</th>
                <th>Кубки</th>
                <th>Диспутов</th>
                <th>В · Н · П</th>
                <th>Последние 5 пруфов (клик → протокол)</th>
                <th>Журнал</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.hero.id}>
                  <td className="standings-table__rank">#{r.rank}</td>
                  <td className="standings-table__hero-cell">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <HeroEmblem
                        emblemKey={r.hero.emblemKey}
                        accentHex={r.hero.accentHex}
                        name={r.hero.name}
                        size="sm"
                      />
                      <div>
                        <Link
                          href={`/heroes/${r.hero.slug}`}
                          className="standings-table__hero-link"
                          style={{ fontSize: "1.02rem" }}
                        >
                          {r.hero.name}
                        </Link>
                        <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>
                          {r.hero.origin} · {r.hero.epithet}
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
                    {r.hero.currentRating}
                  </td>
                  <td>
                    <span
                      className={
                        r.netDelta > 0
                          ? "delta-positive"
                          : r.netDelta < 0
                            ? "delta-negative"
                            : "delta-neutral"
                      }
                    >
                      {r.netDelta > 0 ? `+${r.netDelta}` : r.netDelta}
                    </span>
                  </td>
                  <td>{r.peakRating}</td>
                  <td>
                    {r.hero.trophiesCount > 0 ? (
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
                        {r.hero.trophiesCount}× Кубок
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{r.hero.matchesPlayed}</td>
                  <td>
                    {r.hero.wins} · {r.hero.draws} · {r.hero.losses}
                  </td>
                  <td>
                    <div className="proof-chips">
                      {r.lastFive.map(({ event, opponent }) => (
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
                          title={`${event.scheduledDate}: против ${opponent.name} (${event.ratingBefore} → ${event.ratingAfter})`}
                        >
                          {event.delta > 0 ? `+${event.delta}` : event.delta}
                        </Link>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Link href={`/heroes/${r.hero.slug}`} className="dispute-card__link">
                      Все {r.totalEventsCount} пруфов →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
