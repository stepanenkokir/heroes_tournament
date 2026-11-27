"use client";

import Link from "next/link";
import { formatLocaleDate } from "@/db/dates";
import type { DisputeCardView } from "@/db/queries";
import { getMessages } from "@/i18n/dictionaries";
import { useLocale } from "@/i18n/locale-context";
import { fill } from "@/i18n/locale";
import {
  localizeHero,
  localizeSkill,
  localizeSourceLabel,
  localizeTournament,
  stageLabel
} from "@/i18n/present";
import { DomainBadge } from "./DomainBadge";
import { HeroEmblem } from "./HeroEmblem";

interface DisputeCardProps {
  card: DisputeCardView;
  showTournamentTitle?: boolean;
  expandedAnnouncement?: boolean;
}

export function DisputeCard({
  card,
  showTournamentTitle = false,
  expandedAnnouncement = false
}: DisputeCardProps) {
  const locale = useLocale();
  const messages = getMessages(locale);
  const { dispute, announcedA, announcedB } = card;
  const heroA = card.heroA ? localizeHero(card.heroA, locale) : null;
  const heroB = card.heroB ? localizeHero(card.heroB, locale) : null;
  const tournament = localizeTournament(card.tournament, locale);
  const stageText = stageLabel(dispute.stage, dispute.groupCode, messages);
  const openA = announcedA.filter((skill) => !skill.isSealed);
  const openB = announcedB.filter((skill) => !skill.isSealed);

  const resolutionNote =
    dispute.resolution === "sealed_extra"
      ? messages.common.resolutionSealed
      : dispute.resolution === "decisive"
        ? fill(messages.common.resolutionDecisive, {
            a: dispute.decisiveScoreA,
            b: dispute.decisiveScoreB
          })
        : dispute.resolution === "glory_lot"
          ? messages.common.resolutionGlory
          : null;

  const statusLabel =
    dispute.status === "announced"
      ? messages.common.statusAnnounced
      : dispute.status === "completed"
        ? messages.common.statusCompleted
        : messages.common.statusScheduled;

  return (
    <article className={`dispute-card dispute-card--${dispute.status}`}>
      <header className="dispute-card__header">
        <div className="dispute-card__meta">
          <span className="dispute-card__stage">{stageText}</span>
          <span className="dispute-card__date">
            {formatLocaleDate(dispute.scheduledDate, locale, "short")}
          </span>
          {showTournamentTitle ? (
            <Link href={`/tournaments/${tournament.slug}`} className="dispute-card__cup-link">
              {tournament.title}
            </Link>
          ) : null}
        </div>
        <span className={`status-pill status-pill--${dispute.status}`}>{statusLabel}</span>
      </header>

      <div className="dispute-card__matchup">
        <div
          className={`dispute-card__side ${
            dispute.winnerSide === "A" ? "dispute-card__side--winner" : ""
          }`}
        >
          {heroA ? (
            <div className="dispute-card__hero">
              <HeroEmblem
                emblemKey={heroA.emblemKey}
                accentHex={heroA.accentHex}
                name={heroA.name}
                size="sm"
              />
              <div>
                <Link href={`/heroes/${heroA.slug}`} className="dispute-card__hero-name">
                  {heroA.name}
                </Link>
                <div className="dispute-card__hero-origin">{heroA.origin}</div>
              </div>
            </div>
          ) : (
            <div className="dispute-card__placeholder">
              <span className="dispute-card__placeholder-badge">{messages.common.waiting}</span>
              <span>{localizeSourceLabel(dispute.sourceLabelA, locale, messages)}</span>
            </div>
          )}
        </div>

        <div className="dispute-card__center">
          {dispute.status === "completed" ? (
            <div className="dispute-card__score-box">
              <div className="dispute-card__score tabular-nums">
                <span>{dispute.acclaimA}</span>
                <span className="dispute-card__score-colon">:</span>
                <span>{dispute.acclaimB}</span>
              </div>
              <div className="dispute-card__score-caption">{messages.common.acclaim}</div>
              <div className="dispute-card__retention tabular-nums">
                {fill(messages.common.retentionLine, {
                  a: dispute.retentionA ?? 0,
                  b: dispute.retentionB ?? 0
                })}
              </div>
            </div>
          ) : dispute.status === "announced" ? (
            <div className="dispute-card__versus-box">
              <span className="dispute-card__versus-label">{messages.common.dispute}</span>
              <span className="dispute-card__versus-sub">{messages.common.exchanges4}</span>
            </div>
          ) : (
            <div className="dispute-card__versus-box dispute-card__versus-box--muted">
              <span className="dispute-card__versus-label">
                {fill(messages.common.day, { n: dispute.dayOffset + 1 }).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div
          className={`dispute-card__side dispute-card__side--right ${
            dispute.winnerSide === "B" ? "dispute-card__side--winner" : ""
          }`}
        >
          {heroB ? (
            <div className="dispute-card__hero dispute-card__hero--right">
              <div>
                <Link href={`/heroes/${heroB.slug}`} className="dispute-card__hero-name">
                  {heroB.name}
                </Link>
                <div className="dispute-card__hero-origin">{heroB.origin}</div>
              </div>
              <HeroEmblem
                emblemKey={heroB.emblemKey}
                accentHex={heroB.accentHex}
                name={heroB.name}
                size="sm"
              />
            </div>
          ) : (
            <div className="dispute-card__placeholder dispute-card__placeholder--right">
              <span className="dispute-card__placeholder-badge">{messages.common.waiting}</span>
              <span>{localizeSourceLabel(dispute.sourceLabelB, locale, messages)}</span>
            </div>
          )}
        </div>
      </div>

      {resolutionNote ? <div className="dispute-card__resolution-note">{resolutionNote}</div> : null}

      {expandedAnnouncement && (openA.length > 0 || openB.length > 0) ? (
        <div className="dispute-card__announced-grid">
          {(
            [
              ["A", heroA, openA],
              ["B", heroB, openB]
            ] as const
          ).map(([side, hero, pairs]) => (
            <div key={side} className="dispute-card__announced-col">
              <div className="dispute-card__announced-title">
                {fill(messages.common.openSkills, {
                  name: hero?.name ?? (side === "A" ? messages.common.sideA : messages.common.sideB)
                })}
              </div>
              {pairs.map((pair, idx) => {
                const dominant = localizeSkill(pair.dominant, locale);
                const appeal = localizeSkill(pair.appeal, locale);
                return (
                  <div key={pair.slotIndex} className="announced-pair">
                    <div className="announced-skill announced-skill--dominant">
                      <span className="announced-skill__tag">
                        {fill(messages.common.dominantTag, { side, n: idx + 1 })}
                      </span>
                      <strong>{dominant.title}</strong>
                      <DomainBadge domain={dominant.domain} compact />
                      <span className="announced-skill__stats tabular-nums">
                        {messages.common.sharpShort} {dominant.primaryStat} · {messages.common.depthShort}{" "}
                        {dominant.secondaryStat}
                      </span>
                    </div>
                    <div className="announced-skill announced-skill--appeal">
                      <span className="announced-skill__tag">
                        {fill(messages.common.appealTag, { side, n: idx + 1 })}
                      </span>
                      <strong>{appeal.title}</strong>
                      <DomainBadge domain={appeal.domain} compact />
                      <span className="announced-skill__stats tabular-nums">
                        {messages.common.firmShort} {appeal.primaryStat} · {messages.common.witShort}{" "}
                        {appeal.secondaryStat}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="sealed-slot-note">{messages.common.sealedNote}</div>
            </div>
          ))}
        </div>
      ) : null}

      <footer className="dispute-card__footer">
        <span className="dispute-card__exchange-order">{messages.common.exchangeOrder}</span>
        <Link href={`/disputes/${encodeURIComponent(dispute.id)}`} className="dispute-card__link">
          {dispute.status === "completed"
            ? messages.common.openProtocol
            : dispute.status === "announced"
              ? messages.common.openAnnouncement
              : messages.common.scheduleCard}
        </Link>
      </footer>
    </article>
  );
}
