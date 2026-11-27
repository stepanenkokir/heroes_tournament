import Link from "next/link";
import { notFound } from "next/navigation";
import { DomainBadge } from "@/components/DomainBadge";
import { HeroEmblem } from "@/components/HeroEmblem";
import { formatShortRussianDate } from "@/db/dates";
import { getHeroProfileView, getStageRussianLabel } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function HeroProfilePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getHeroProfileView(slug);

  if (!data) {
    notFound();
  }

  const { hero, rank, dominants, appeals, ledger, activeDisputes } = data;

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <Link href="/ratings" className="btn-secondary">
            ← Ко всем героям и рейтингу
          </Link>
          <span className="page-hero__kicker">
            #{rank} в рейтинге Эло · {hero.origin}
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
            <HeroEmblem
              emblemKey={hero.emblemKey}
              accentHex={hero.accentHex}
              name={hero.name}
              size="lg"
            />
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
              <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>Рейтинг Эло</div>
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
              <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>Диспуты</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{hero.matchesPlayed}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>В · Н · П</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {hero.wins} · {hero.draws} · {hero.losses}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>Кубки</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{hero.trophiesCount}</div>
            </div>
          </div>
        </div>

        {activeDisputes.length > 0 ? (
          <div className="active-cup-notice">
            Сегодня герой участвует в анонсированном диспуте:{" "}
            <Link
              href={`/disputes/${encodeURIComponent(activeDisputes[0]!.id)}`}
              style={{ fontWeight: 700, textDecoration: "underline" }}
            >
              открыть карточку сегодняшнего анонса →
            </Link>
          </div>
        ) : null}
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">Арсенал диспутанта: 5 доминант и 5 апелляций</h2>
            <p className="section-subtitle">
              Перед каждым состязанием жребий выбирает 2 открытых навыка каждого рода и 1
              запечатанный на случай овертайма в плей-офф.
            </p>
          </div>
        </div>

        <div className="cards-grid-2">
          <div className="group-card">
            <div className="group-card__header">
              <h3 className="group-card__title" style={{ color: "var(--cinnabar)" }}>
                5 Доминант (чем давит в споре)
              </h3>
              <span className="group-card__caption" style={{ color: "var(--cinnabar)" }}>
                Острота и Глубина
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
                    <span>Острота: {skill.primaryStat}</span>
                    <span>Глубина: {skill.secondaryStat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="group-card">
            <div className="group-card__header">
              <h3 className="group-card__title" style={{ color: "var(--turquoise)" }}>
                5 Апелляций (к чему взывает в ответ)
              </h3>
              <span className="group-card__caption">Твёрдость и Находчивость</span>
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
                    <span>Твёрдость: {skill.primaryStat}</span>
                    <span>Находчивость: {skill.secondaryStat}</span>
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
            <h2 className="section-title">
              Пруфы рейтинга: полный журнал ({ledger.length} завершённых диспутов)
            </h2>
            <p className="section-subtitle">
              Каждая запись хранит рейтинг до начала встречи, математическое ожидание E, коэффициент
              стадии K, дельту и прямую ссылку на протокол.
            </p>
          </div>
        </div>

        <div className="group-card">
          <div className="table-scroll">
            <table className="standings-table tabular-nums">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Дата</th>
                  <th style={{ textAlign: "left" }}>Турнир и стадия</th>
                  <th style={{ textAlign: "left" }}>Оппонент</th>
                  <th>Счёт признания</th>
                  <th>Рейтинг до</th>
                  <th>Ожидание E</th>
                  <th>K</th>
                  <th>Дельта</th>
                  <th>Рейтинг после</th>
                  <th>Протокол</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map(({ event, opponent, tournament, dispute }) => {
                  const isSideA = dispute.heroAId === hero.id;
                  const myAcclaim = isSideA ? dispute.acclaimA : dispute.acclaimB;
                  const oppAcclaim = isSideA ? dispute.acclaimB : dispute.acclaimA;
                  const outcomeBadge =
                    event.actualScore === 1
                      ? "Победа"
                      : event.actualScore === 0
                        ? "Поражение"
                        : "Ничья";

                  return (
                    <tr key={event.id}>
                      <td>{event.sequence}</td>
                      <td>{formatShortRussianDate(event.scheduledDate)}</td>
                      <td style={{ textAlign: "left" }}>
                        <Link
                          href={
                            tournament.status === "active"
                              ? "/tournament"
                              : `/tournaments/${tournament.slug}`
                          }
                          style={{ fontWeight: 600 }}
                        >
                          {tournament.editionNumber}-й кубок
                        </Link>{" "}
                        · {getStageRussianLabel(event.stage, dispute.groupCode)}
                      </td>
                      <td style={{ textAlign: "left" }}>
                        <Link
                          href={`/heroes/${opponent.slug}`}
                          className="standings-table__hero-link"
                        >
                          {opponent.name}
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
                          Пруф →
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
