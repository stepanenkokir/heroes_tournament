"use client";

import Link from "next/link";
import { useState } from "react";
import { formatLocaleDate } from "@/db/dates";
import type { TournamentFullView } from "@/db/queries";
import { getMessages } from "@/i18n/dictionaries";
import { useLocale } from "@/i18n/locale-context";
import { fill, formatEdition } from "@/i18n/locale";
import { dayStageLabel, localizeHero, localizeTieBreak, localizeTournament } from "@/i18n/present";
import { DisputeCard } from "./DisputeCard";
import { HeroEmblem } from "./HeroEmblem";

const STANDING_SHORT = {
  en: {
    pot: "Pot",
    played: "P",
    wins: "W",
    draws: "D",
    losses: "L",
    acclaim: "Acc.",
    diff: "±",
    retention: "Ret.",
    points: "Pts"
  },
  es: {
    pot: "Bom.",
    played: "J",
    wins: "G",
    draws: "E",
    losses: "P",
    acclaim: "Rec.",
    diff: "±",
    retention: "Ret.",
    points: "Pts"
  },
  ru: {
    pot: "Корз.",
    played: "И",
    wins: "В",
    draws: "Н",
    losses: "П",
    acclaim: "Призн.",
    diff: "±",
    retention: "Удерж.",
    points: "Очки"
  }
} as const;

interface TournamentViewProps {
  data: TournamentFullView;
  allTournaments: Array<{
    slug: string;
    title: string;
    subtitle: string;
    editionNumber: number;
    status: string;
  }>;
}

export function TournamentView({ data, allTournaments }: TournamentViewProps) {
  const locale = useLocale();
  const messages = getMessages(locale);
  const tournament = localizeTournament(data.tournament, locale);
  const champion = data.champion ? localizeHero(data.champion, locale) : null;
  const runnerUp = data.runnerUp ? localizeHero(data.runnerUp, locale) : null;
  const { groups, playoffs, days } = data;
  const [groupSliceMode, setGroupSliceMode] = useState<"current" | "day1_empty">("current");
  const todayDay = days.find((day) => day.isToday);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number | "all">(
    todayDay ? todayDay.dayOffset : "all"
  );

  const visibleDays =
    selectedDayOffset === "all" ? days : days.filter((day) => day.dayOffset === selectedDayOffset);
  const editions = allTournaments.map((item) => localizeTournament(item, locale));
  const themeKey =
    data.tournament.fieldKind === "theme" && data.tournament.themeId
      ? (data.tournament.themeId as keyof typeof messages.themes)
      : "open";
  const themeLabel = messages.themes[themeKey] ?? messages.themes.open;

  return (
    <div className="tournament-view">
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <div className="edition-switcher">
            {editions.map((item) => {
              const isCurrent = item.slug === tournament.slug;
              const href = item.status === "active" ? "/tournament" : `/tournaments/${item.slug}`;
              return (
                <Link
                  key={item.slug}
                  href={href}
                  className={`edition-pill ${isCurrent ? "edition-pill--active" : ""}`}
                >
                  <span>{formatEdition(item.editionNumber, locale)}</span>
                  <span className="edition-pill__status">
                    {item.status === "active" ? messages.status.active : messages.status.archive}
                  </span>
                </Link>
              );
            })}
          </div>
          <span className="page-hero__dates">
            {themeLabel} · {formatLocaleDate(tournament.startDate, locale, "long")} —{" "}
            {formatLocaleDate(tournament.endDate, locale, "long")}
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
                <div className="champion-banner__label">{messages.cup.champion}</div>
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
                <div className="champion-banner__label">{messages.cup.runnerUp}</div>
                <Link href={`/heroes/${runnerUp.slug}`} className="champion-banner__name">
                  {runnerUp.name}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="active-cup-notice">
            <strong>{messages.cup.dayNotice}</strong>
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">{messages.cup.groupsTitle}</h2>
            <p className="section-subtitle">{messages.cup.groupsSubtitle}</p>
          </div>
          <div className="segmented-control" role="group" aria-label={messages.cup.sliceAria}>
            <button
              type="button"
              className={`segmented-control__btn ${
                groupSliceMode === "current" ? "segmented-control__btn--active" : ""
              }`}
              onClick={() => setGroupSliceMode("current")}
            >
              {messages.cup.tableCurrent}
            </button>
            <button
              type="button"
              className={`segmented-control__btn ${
                groupSliceMode === "day1_empty" ? "segmented-control__btn--active" : ""
              }`}
              onClick={() => setGroupSliceMode("day1_empty")}
            >
              {messages.cup.tableStart}
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
                      qualified: false,
                      tieBreakNote: null
                    }))
                : group.standings;

            return (
              <div key={group.groupCode} className="group-card">
                <div className="group-card__header">
                  <h3 className="group-card__title">
                    {fill(messages.common.group, { code: group.groupCode })}
                  </h3>
                  <span className="group-card__caption">
                    {groupSliceMode === "day1_empty" ? messages.cup.afterDraw : messages.cup.qualify}
                  </span>
                </div>

                <div className="table-scroll">
                  <table className="standings-table tabular-nums">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{messages.cup.hero}</th>
                        {(
                          [
                            ["pot", messages.cup.colPot],
                            ["played", messages.cup.colPlayed],
                            ["wins", messages.cup.colWins],
                            ["draws", messages.cup.colDraws],
                            ["losses", messages.cup.colLosses],
                            ["acclaim", messages.cup.colAcclaim],
                            ["diff", messages.cup.colDiff],
                            ["retention", messages.cup.colRetention],
                            ["points", messages.cup.colPoints]
                          ] as const
                        ).map(([key, title]) => (
                          <th key={key} title={title}>
                            {STANDING_SHORT[locale][key]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayRows.map((row) => {
                        const hero = localizeHero(row.hero, locale);
                        const note = localizeTieBreak(row.tieBreakNote, messages);
                        return (
                          <tr
                            key={row.heroId}
                            className={row.qualified ? "standings-table__row--qualified" : ""}
                          >
                            <td className="standings-table__rank">{row.rank}</td>
                            <td className="standings-table__hero-cell">
                              <div className="standings-table__hero-wrap">
                                <Link
                                  href={`/heroes/${hero.slug}`}
                                  className="standings-table__hero-link"
                                >
                                  {hero.name}
                                </Link>
                                {note ? <span className="standings-table__tiebreak">{note}</span> : null}
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <details className="group-card__matches-drawer">
                  <summary>{fill(messages.cup.matches, { code: group.groupCode })}</summary>
                  <div className="group-card__mini-list">
                    {group.disputes.map((card) => {
                      const sideA = card.heroA ? localizeHero(card.heroA, locale) : null;
                      const sideB = card.heroB ? localizeHero(card.heroB, locale) : null;
                      return (
                        <Link
                          key={card.dispute.id}
                          href={`/disputes/${encodeURIComponent(card.dispute.id)}`}
                          className="group-mini-match"
                        >
                          <span className="group-mini-match__date">
                            {fill(messages.common.dayShort, { n: card.dispute.dayOffset + 1 })} ·{" "}
                            {formatLocaleDate(card.dispute.scheduledDate, locale, "short")}
                          </span>
                          <span className="group-mini-match__names">
                            {sideA?.name} — {sideB?.name}
                          </span>
                          <span className="group-mini-match__score tabular-nums">
                            {card.dispute.status === "completed"
                              ? `${card.dispute.acclaimA}:${card.dispute.acclaimB}`
                              : card.dispute.status === "announced"
                                ? messages.cup.announced
                                : messages.cup.scheduled}
                          </span>
                        </Link>
                      );
                    })}
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
            <h2 className="section-title">{messages.cup.bracketTitle}</h2>
            <p className="section-subtitle">{messages.cup.bracketSubtitle}</p>
          </div>
        </div>

        <div className="bracket-columns">
          {(
            [
              ["qf", messages.stage.qfDays],
              ["sf", messages.stage.sfDays],
              ["final", messages.stage.finalDay]
            ] as const
          ).map(([stage, title]) => (
            <div key={stage} className="bracket-column">
              <h3 className="bracket-column__title">{title}</h3>
              {playoffs
                .filter((item) => item.card.dispute.stage === stage)
                .map((item) => (
                  <DisputeCard key={item.card.dispute.id} card={item.card} />
                ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">{messages.cup.calendarTitle}</h2>
            <p className="section-subtitle">{messages.cup.calendarSubtitle}</p>
          </div>
        </div>

        <div className="day-selector">
          <button
            type="button"
            className={`day-chip ${selectedDayOffset === "all" ? "day-chip--active" : ""}`}
            onClick={() => setSelectedDayOffset("all")}
          >
            {messages.cup.allDays}
          </button>
          {days.map((day) => (
            <button
              key={day.dayOffset}
              type="button"
              className={`day-chip ${
                selectedDayOffset === day.dayOffset ? "day-chip--active" : ""
              } ${day.isToday ? "day-chip--today" : ""}`}
              onClick={() => setSelectedDayOffset(day.dayOffset)}
            >
              <span>{fill(messages.common.day, { n: day.dayNumber })}</span>
              <small>{formatLocaleDate(day.scheduledDate, locale, "short")}</small>
            </button>
          ))}
        </div>

        <div className="days-stack">
          {visibleDays.map((day) => (
            <div key={day.dayOffset} className="day-panel">
              <div className="day-panel__header">
                <div>
                  <span className="day-panel__number">
                    {fill(messages.common.day, { n: day.dayNumber })}
                  </span>
                  <strong className="day-panel__stage">{dayStageLabel(day.dayOffset, messages)}</strong>
                </div>
                <div className="day-panel__date">
                  {day.isToday ? <span className="today-badge">{messages.cup.todayBadge}</span> : null}
                  <span>{formatLocaleDate(day.scheduledDate, locale, "long")}</span>
                </div>
              </div>
              <div className="day-panel__cards">
                {day.disputes.map((card) => (
                  <DisputeCard key={card.dispute.id} card={card} expandedAnnouncement={day.isToday} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
