"use client";

import Link from "next/link";
import { useState } from "react";
import { formatRussianDate, formatShortRussianDate } from "@/db/dates";
import type { TournamentFullView } from "@/db/queries";
import { DisputeCard } from "./DisputeCard";
import { HeroEmblem } from "./HeroEmblem";

interface TournamentViewProps {
  data: TournamentFullView;
  allTournaments: Array<{
    slug: string;
    title: string;
    editionNumber: number;
    status: string;
  }>;
}

export function TournamentView({ data, allTournaments }: TournamentViewProps) {
  const { tournament, champion, runnerUp, groups, playoffs, days } = data;
  const [groupSliceMode, setGroupSliceMode] = useState<"current" | "day1_empty">("current");
  const todayDay = days.find((d) => d.isToday);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number | "all">(
    todayDay ? todayDay.dayOffset : "all"
  );

  const visibleDays =
    selectedDayOffset === "all"
      ? days
      : days.filter((d) => d.dayOffset === selectedDayOffset);

  return (
    <div className="tournament-view">
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <div className="edition-switcher">
            {allTournaments.map((t) => {
              const isCurrent = t.slug === tournament.slug;
              const href = t.status === "active" ? "/tournament" : `/tournaments/${t.slug}`;
              return (
                <Link
                  key={t.slug}
                  href={href}
                  className={`edition-pill ${isCurrent ? "edition-pill--active" : ""}`}
                >
                  <span>{t.editionNumber}-й созыв</span>
                  <span className="edition-pill__status">
                    {t.status === "active" ? "Идёт сейчас" : "Архив"}
                  </span>
                </Link>
              );
            })}
          </div>
          <span className="page-hero__dates">
            {formatRussianDate(tournament.startDate)} — {formatRussianDate(tournament.endDate)}
          </span>
        </div>

        <h1 className="page-hero__title">{tournament.title}</h1>
        <p className="page-hero__subtitle">{tournament.subtitle}</p>

        {champion && runnerUp ? (
          <div className="champion-banner">
            <div className="champion-banner__item">
              <HeroEmblem
                emblemKey={champion.emblemKey}
                accentHex={champion.accentHex}
                name={champion.name}
                size="md"
              />
              <div>
                <div className="champion-banner__label">Триумфатор Кубка</div>
                <Link href={`/heroes/${champion.slug}`} className="champion-banner__name">
                  {champion.name}
                </Link>
                <div className="champion-banner__meta">{champion.epithet}</div>
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
                <div className="champion-banner__label">Серебряный диспутант</div>
                <Link href={`/heroes/${runnerUp.slug}`} className="champion-banner__name">
                  {runnerUp.name}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="active-cup-notice">
            <strong>Регламент дня (Europe/Moscow):</strong> в групповом туре каждый день
            открывается по одному диспуту в каждой из четырёх групп. Анонсированные навыки открыты
            весь день, а итог засчитывается на следующие сутки.
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">Групповой этап · Четыре группы по четыре героя</h2>
            <p className="section-subtitle">
              Победа — 3 очка, ничья — 1, поражение — 0. В плей-офф выходят 1-е и 2-е места каждой
              группы.
            </p>
          </div>
          <div className="segmented-control" role="group" aria-label="Срез таблицы групп">
            <button
              type="button"
              className={`segmented-control__btn ${
                groupSliceMode === "current" ? "segmented-control__btn--active" : ""
              }`}
              onClick={() => setGroupSliceMode("current")}
            >
              Актуальная таблица
            </button>
            <button
              type="button"
              className={`segmented-control__btn ${
                groupSliceMode === "day1_empty" ? "segmented-control__btn--active" : ""
              }`}
              onClick={() => setGroupSliceMode("day1_empty")}
            >
              На старте (День 1 · 0 сыграно)
            </button>
          </div>
        </div>

        <div className="groups-grid">
          {groups.map((group) => {
            const displayRows =
              groupSliceMode === "day1_empty"
                ? [...group.standings]
                    .sort((a, b) => a.potNumber - b.potNumber)
                    .map((row, idx) => ({
                      ...row,
                      rank: idx + 1,
                      played: 0,
                      wins: 0,
                      draws: 0,
                      losses: 0,
                      points: 0,
                      acclaimFor: 0,
                      acclaimAgainst: 0,
                      acclaimDiff: 0,
                      retentionFor: 0,
                      qualified: idx < 2,
                      tieBreakNote: "Посев по корзинам жеребьёвки до начала игр"
                    }))
                : group.standings;

            return (
              <div key={group.groupCode} className="group-card">
                <div className="group-card__header">
                  <h3 className="group-card__title">{group.title}</h3>
                  <span className="group-card__caption">
                    {groupSliceMode === "day1_empty"
                      ? "Состояние после жеребьёвки корзин"
                      : "Квалификация: места 1–2"}
                  </span>
                </div>

                <div className="table-scroll">
                  <table className="standings-table tabular-nums">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Герой</th>
                        <th title="Корзина жеребьёвки">Корз.</th>
                        <th title="Сыграно диспутов">И</th>
                        <th title="Победы">В</th>
                        <th title="Ничьи">Н</th>
                        <th title="Поражения">П</th>
                        <th title="Признание (за — против)">Призн.</th>
                        <th title="Разница признания">±</th>
                        <th title="Сумма удержания">Удерж.</th>
                        <th title="Очки группы">Очки</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayRows.map((row) => (
                        <tr
                          key={row.heroId}
                          className={row.qualified ? "standings-table__row--qualified" : ""}
                        >
                          <td className="standings-table__rank">{row.rank}</td>
                          <td className="standings-table__hero-cell">
                            <div className="standings-table__hero-wrap">
                              <Link
                                href={`/heroes/${row.hero.slug}`}
                                className="standings-table__hero-link"
                              >
                                {row.hero.name}
                              </Link>
                              {row.tieBreakNote && groupSliceMode === "current" ? (
                                <span className="standings-table__tiebreak">{row.tieBreakNote}</span>
                              ) : null}
                            </div>
                          </td>
                          <td>{row.potNumber}</td>
                          <td>{row.played}</td>
                          <td>{row.wins}</td>
                          <td>{row.draws}</td>
                          <td>{row.losses}</td>
                          <td>
                            {row.acclaimFor}–{row.acclaimAgainst}
                          </td>
                          <td>{row.acclaimDiff > 0 ? `+${row.acclaimDiff}` : row.acclaimDiff}</td>
                          <td>{row.retentionFor}</td>
                          <td className="standings-table__points">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <details className="group-card__matches-drawer">
                  <summary>Матчи группы {group.groupCode} (6 диспутов)</summary>
                  <div className="group-card__mini-list">
                    {group.disputes.map((c) => (
                      <Link
                        key={c.dispute.id}
                        href={`/disputes/${encodeURIComponent(c.dispute.id)}`}
                        className="group-mini-match"
                      >
                        <span className="group-mini-match__date">
                          Д{c.dispute.dayOffset + 1} · {formatShortRussianDate(c.dispute.scheduledDate)}
                        </span>
                        <span className="group-mini-match__names">
                          {c.heroA?.name} — {c.heroB?.name}
                        </span>
                        <span className="group-mini-match__score tabular-nums">
                          {c.dispute.status === "completed"
                            ? `${c.dispute.acclaimA}:${c.dispute.acclaimB}`
                            : c.dispute.status === "announced"
                              ? "Анонс"
                              : "Расписание"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">Сетка плей-офф · Четвертьфиналы, полуфиналы и финал</h2>
            <p className="section-subtitle">
              Пары 1A–2B, 1B–2A, 1C–2D, 1D–2C. Ничья исключена: вскрывается 3-я запечатанная пара,
              затем решающие доводы (признание ≥ 12) и Жребий славы.
            </p>
          </div>
        </div>

        <div className="bracket-columns">
          <div className="bracket-column">
            <h3 className="bracket-column__title">Четвертьфиналы (Дни 7–10)</h3>
            {playoffs
              .filter((p) => p.card.dispute.stage === "qf")
              .map((p) => (
                <DisputeCard key={p.card.dispute.id} card={p.card} />
              ))}
          </div>

          <div className="bracket-column">
            <h3 className="bracket-column__title">Полуфиналы (Дни 11–12)</h3>
            {playoffs
              .filter((p) => p.card.dispute.stage === "sf")
              .map((p) => (
                <DisputeCard key={p.card.dispute.id} card={p.card} />
              ))}
          </div>

          <div className="bracket-column">
            <h3 className="bracket-column__title">Финал Кубка (День 13)</h3>
            {playoffs
              .filter((p) => p.card.dispute.stage === "final")
              .map((p) => (
                <DisputeCard key={p.card.dispute.id} card={p.card} />
              ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">Календарь кубка по дням (13 игровых дней)</h2>
            <p className="section-subtitle">
              Дни 1–6: по одному диспуту в каждой группе (4 в день). Дни 7–13: по одному диспуту
              плей-офф в день.
            </p>
          </div>
        </div>

        <div className="day-selector">
          <button
            type="button"
            className={`day-chip ${selectedDayOffset === "all" ? "day-chip--active" : ""}`}
            onClick={() => setSelectedDayOffset("all")}
          >
            Все 13 дней
          </button>
          {days.map((d) => (
            <button
              key={d.dayOffset}
              type="button"
              className={`day-chip ${
                selectedDayOffset === d.dayOffset ? "day-chip--active" : ""
              } ${d.isToday ? "day-chip--today" : ""}`}
              onClick={() => setSelectedDayOffset(d.dayOffset)}
            >
              <span>День {d.dayNumber}</span>
              <small>{formatShortRussianDate(d.scheduledDate)}</small>
            </button>
          ))}
        </div>

        <div className="days-stack">
          {visibleDays.map((day) => (
            <div key={day.dayOffset} className="day-panel">
              <div className="day-panel__header">
                <div>
                  <span className="day-panel__number">День {day.dayNumber}</span>
                  <strong className="day-panel__stage">{day.stageLabel}</strong>
                </div>
                <div className="day-panel__date">
                  {day.isToday ? <span className="today-badge">Сегодня на арене</span> : null}
                  <span>{formatRussianDate(day.scheduledDate)}</span>
                </div>
              </div>
              <div className="day-panel__cards">
                {day.disputes.map((card) => (
                  <DisputeCard
                    key={card.dispute.id}
                    card={card}
                    expandedAnnouncement={day.isToday}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
