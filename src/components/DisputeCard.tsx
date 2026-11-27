import Link from "next/link";
import { formatShortRussianDate } from "@/db/dates";
import type { DisputeCardView } from "@/db/queries";
import { getStageRussianLabel } from "@/domain";
import { DomainBadge } from "./DomainBadge";
import { HeroEmblem } from "./HeroEmblem";

interface DisputeCardProps {
  card: DisputeCardView;
  showTournamentTitle?: boolean;
  expandedAnnouncement?: boolean;
}

function getResolutionBadgeText(
  resolution: string | null,
  decisiveA: number,
  decisiveB: number
): string | null {
  switch (resolution) {
    case "sealed_extra":
      return "Решено 3-й запечатанной парой";
    case "decisive":
      return `Решающие доводы (${decisiveA}:${decisiveB})`;
    case "glory_lot":
      return "Решено Жребием славы";
    default:
      return null;
  }
}

export function DisputeCard({
  card,
  showTournamentTitle = false,
  expandedAnnouncement = false
}: DisputeCardProps) {
  const { dispute, heroA, heroB, announcedA, announcedB, tournament } = card;
  const stageLabel = getStageRussianLabel(dispute.stage, dispute.groupCode);
  const openA = announcedA.filter((s) => !s.isSealed);
  const openB = announcedB.filter((s) => !s.isSealed);
  const resolutionNote = getResolutionBadgeText(
    dispute.resolution,
    dispute.decisiveScoreA,
    dispute.decisiveScoreB
  );

  const statusLabel =
    dispute.status === "announced"
      ? "Анонс дня · Итог откроется завтра"
      : dispute.status === "completed"
        ? "Протокол закрыт"
        : "В расписании";

  return (
    <article className={`dispute-card dispute-card--${dispute.status}`}>
      <header className="dispute-card__header">
        <div className="dispute-card__meta">
          <span className="dispute-card__stage">{stageLabel}</span>
          <span className="dispute-card__date">{formatShortRussianDate(dispute.scheduledDate)}</span>
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
              <span className="dispute-card__placeholder-badge">Ожидание</span>
              <span>{dispute.sourceLabelA ?? "Победитель пары"}</span>
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
              <div className="dispute-card__score-caption">признание</div>
              <div className="dispute-card__retention tabular-nums">
                удерж. {dispute.retentionA} · {dispute.retentionB}
              </div>
            </div>
          ) : dispute.status === "announced" ? (
            <div className="dispute-card__versus-box">
              <span className="dispute-card__versus-label">ДИСПУТ</span>
              <span className="dispute-card__versus-sub">4 обмена</span>
            </div>
          ) : (
            <div className="dispute-card__versus-box dispute-card__versus-box--muted">
              <span className="dispute-card__versus-label">ДЕНЬ {dispute.dayOffset + 1}</span>
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
              <span className="dispute-card__placeholder-badge">Ожидание</span>
              <span>{dispute.sourceLabelB ?? "Победитель пары"}</span>
            </div>
          )}
        </div>
      </div>

      {resolutionNote ? <div className="dispute-card__resolution-note">{resolutionNote}</div> : null}

      {expandedAnnouncement && (openA.length > 0 || openB.length > 0) ? (
        <div className="dispute-card__announced-grid">
          <div className="dispute-card__announced-col">
            <div className="dispute-card__announced-title">
              Открытые навыки · {heroA?.name ?? "Сторона A"}
            </div>
            {openA.map((pair, idx) => (
              <div key={pair.slotIndex} className="announced-pair">
                <div className="announced-skill announced-skill--dominant">
                  <span className="announced-skill__tag">A{idx + 1} Доминанта</span>
                  <strong>{pair.dominant.title}</strong>
                  <DomainBadge domain={pair.dominant.domain} compact />
                  <span className="announced-skill__stats tabular-nums">
                    Остр. {pair.dominant.primaryStat} · Глуб. {pair.dominant.secondaryStat}
                  </span>
                </div>
                <div className="announced-skill announced-skill--appeal">
                  <span className="announced-skill__tag">A{idx + 1} Апелляция</span>
                  <strong>{pair.appeal.title}</strong>
                  <DomainBadge domain={pair.appeal.domain} compact />
                  <span className="announced-skill__stats tabular-nums">
                    Твёрд. {pair.appeal.primaryStat} · Находч. {pair.appeal.secondaryStat}
                  </span>
                </div>
              </div>
            ))}
            <div className="sealed-slot-note">
              + 3-я пара навыков запечатана сургучом на случай ничьей в плей-офф
            </div>
          </div>

          <div className="dispute-card__announced-col">
            <div className="dispute-card__announced-title">
              Открытые навыки · {heroB?.name ?? "Сторона B"}
            </div>
            {openB.map((pair, idx) => (
              <div key={pair.slotIndex} className="announced-pair">
                <div className="announced-skill announced-skill--dominant">
                  <span className="announced-skill__tag">B{idx + 1} Доминанта</span>
                  <strong>{pair.dominant.title}</strong>
                  <DomainBadge domain={pair.dominant.domain} compact />
                  <span className="announced-skill__stats tabular-nums">
                    Остр. {pair.dominant.primaryStat} · Глуб. {pair.dominant.secondaryStat}
                  </span>
                </div>
                <div className="announced-skill announced-skill--appeal">
                  <span className="announced-skill__tag">B{idx + 1} Апелляция</span>
                  <strong>{pair.appeal.title}</strong>
                  <DomainBadge domain={pair.appeal.domain} compact />
                  <span className="announced-skill__stats tabular-nums">
                    Твёрд. {pair.appeal.primaryStat} · Находч. {pair.appeal.secondaryStat}
                  </span>
                </div>
              </div>
            ))}
            <div className="sealed-slot-note">
              + 3-я пара навыков запечатана сургучом на случай ничьей в плей-офф
            </div>
          </div>
        </div>
      ) : null}

      <footer className="dispute-card__footer">
        <span className="dispute-card__exchange-order">
          Порядок: A1→B1 · B1→A1 · A2→B2 · B2→A2
        </span>
        <Link href={`/disputes/${encodeURIComponent(dispute.id)}`} className="dispute-card__link">
          {dispute.status === "completed"
            ? "Открыть протокол диспута →"
            : dispute.status === "announced"
              ? "Смотреть карточку анонса →"
              : "Карточка расписания →"}
        </Link>
      </footer>
    </article>
  );
}
