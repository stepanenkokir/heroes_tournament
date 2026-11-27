import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { USER_COOKIE } from "@/auth-cookie";
import { DomainBadge } from "@/components/DomainBadge";
import { HeroEmblem } from "@/components/HeroEmblem";
import { VotePanel } from "@/components/VotePanel";
import { formatLocaleDate } from "@/db/dates";
import { getDisputeProtocolView } from "@/db/queries";
import { getMessages } from "@/i18n/dictionaries";
import { fill } from "@/i18n/locale";
import { localizeHero, localizeSkill, localizeSourceLabel, localizeTournament, stageLabel } from "@/i18n/present";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function DisputeProtocolPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const { id } = await params;
  const data = getDisputeProtocolView(decodeURIComponent(id));
  const isSignedIn = Boolean((await cookies()).get(USER_COOKIE)?.value);

  if (!data) {
    notFound();
  }

  const { exchanges, eloA, eloB, commentaries } = data;
  const localeCommentary =
    commentaries.find((c) => c.locale === locale) ?? commentaries[0] ?? null;
  const dispute = data.card.dispute;
  const tournament = localizeTournament(data.card.tournament, locale);
  const heroA = data.card.heroA ? localizeHero(data.card.heroA, locale) : null;
  const heroB = data.card.heroB ? localizeHero(data.card.heroB, locale) : null;
  const stageText = stageLabel(dispute.stage, dispute.groupCode, messages);
  const tournamentHref = tournament.status === "active" ? "/tournament" : `/tournaments/${tournament.slug}`;
  const mainExchanges = exchanges.filter((item) => item.row.phase === "main");
  const sealedExchanges = exchanges.filter((item) => item.row.phase === "sealed_extra");
  const decisiveExchanges = exchanges.filter((item) => item.row.phase === "decisive");

  const statusLabel =
    dispute.status === "completed"
      ? messages.dispute.closed
      : dispute.status === "announced"
        ? messages.dispute.announced
        : messages.dispute.scheduled;

  const resolutionReason =
    dispute.resolution === "sealed_extra"
      ? messages.common.resolutionSealed
      : dispute.resolution === "decisive"
        ? fill(messages.common.resolutionDecisive, {
            a: dispute.decisiveScoreA,
            b: dispute.decisiveScoreB
          })
        : dispute.resolution === "glory_lot"
          ? messages.common.resolutionGlory
          : messages.dispute.mainTitle;

  const outcomeVerdict =
    dispute.winnerSide === "A"
      ? fill(messages.dispute.winner, { name: heroA?.name ?? "" })
      : dispute.winnerSide === "B"
        ? fill(messages.dispute.winner, { name: heroB?.name ?? "" })
        : messages.dispute.draw;

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <div className="protocol-hero__nav">
            <Link href={tournamentHref} className="btn-secondary">
              ← {tournament.title}
            </Link>
            <span className="page-hero__kicker">
              {fill(messages.dispute.dayLine, {
                stage: stageText,
                day: dispute.dayOffset + 1,
                date: formatLocaleDate(dispute.scheduledDate, locale, "long")
              })}
            </span>
          </div>
          <span className={`status-pill status-pill--${dispute.status}`}>{statusLabel}</span>
        </div>

        <div className="protocol-matchup">
          <div className="protocol-side">
            {heroA ? (
              <>
                <HeroEmblem emblemKey={heroA.emblemKey} accentHex={heroA.accentHex} name={heroA.name} size="lg" />
                <div>
                  <div className="protocol-side__tag">
                    {fill(messages.dispute.sideA, { origin: heroA.origin })}
                  </div>
                  <Link href={`/heroes/${heroA.slug}`} className="protocol-side__name">
                    {heroA.name}
                  </Link>
                  <div className="protocol-side__epithet">{heroA.epithet}</div>
                </div>
              </>
            ) : (
              <div>
                <div className="protocol-side__waiting-tag">{messages.dispute.waitingA}</div>
                <div className="protocol-side__waiting-source">
                  {localizeSourceLabel(dispute.sourceLabelA, locale, messages)}
                </div>
              </div>
            )}
          </div>

          <div className="dispute-card__score-box protocol-score-box">
            {dispute.status === "completed" ? (
              <>
                <div className="dispute-card__score protocol-score tabular-nums">
                  <span>{dispute.acclaimA}</span>
                  <span className="dispute-card__score-colon">:</span>
                  <span>{dispute.acclaimB}</span>
                </div>
                <div className="dispute-card__score-caption">{messages.dispute.acclaimSum}</div>
                <div className="dispute-card__retention protocol-retention tabular-nums">
                  {fill(messages.dispute.retention, {
                    a: dispute.retentionA ?? 0,
                    b: dispute.retentionB ?? 0
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="protocol-score-pending">— : —</div>
                <div className="dispute-card__score-caption">
                  {dispute.status === "announced" ? messages.dispute.resultTomorrow : messages.dispute.onSchedule}
                </div>
              </>
            )}
          </div>

          <div className="protocol-side protocol-side--right">
            {heroB ? (
              <>
                <div>
                  <div className="protocol-side__tag">
                    {fill(messages.dispute.sideB, { origin: heroB.origin })}
                  </div>
                  <Link href={`/heroes/${heroB.slug}`} className="protocol-side__name">
                    {heroB.name}
                  </Link>
                  <div className="protocol-side__epithet">{heroB.epithet}</div>
                </div>
                <HeroEmblem emblemKey={heroB.emblemKey} accentHex={heroB.accentHex} name={heroB.name} size="lg" />
              </>
            ) : (
              <div>
                <div className="protocol-side__waiting-tag">{messages.dispute.waitingB}</div>
                <div className="protocol-side__waiting-source">
                  {localizeSourceLabel(dispute.sourceLabelB, locale, messages)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="protocol-meta-bar">
          <span className="protocol-seed">
            {fill(messages.common.protocolSeed, { seed: dispute.seed })}
          </span>
          <span>
            {dispute.status === "completed"
              ? `${outcomeVerdict} · ${resolutionReason}`
              : messages.dispute.opensTomorrow}
          </span>
          {heroA && heroB ? (
            <a
              href={`/api/channels/daily-card?disputeId=${encodeURIComponent(dispute.id)}`}
              target="_blank"
              rel="noreferrer"
              className="dispute-card__link"
            >
              {messages.channels.downloadSvgCard}
            </a>
          ) : null}
        </div>
      </section>

      {heroA && heroB ? <VotePanel card={data.card} isSignedIn={isSignedIn} /> : null}

      {dispute.status === "completed" && localeCommentary ? (
        <section className="section-block">
          <div className="rule-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.45rem" }}>
              <h3 style={{ margin: 0 }}>{localeCommentary.headline}</h3>
              <span className="status-pill status-pill--completed">
                {messages.channels.commentaryTitle}
              </span>
            </div>
            <p style={{ color: "var(--ink-soft)", marginBottom: "0.5rem" }}>
              {localeCommentary.summary}
            </p>
            <p style={{ color: "var(--ink-muted)", fontSize: "0.86rem", marginBottom: "0.45rem" }}>
              {localeCommentary.keyTurn}
            </p>
            <div style={{ fontSize: "0.76rem", color: "var(--ink-muted)" }}>
              {messages.channels.commentaryBadge}
            </div>
          </div>
        </section>
      ) : null}

      {data.card.announcedA.length > 0 && data.card.announcedB.length > 0 ? (
        <section className="section-block">
          <div className="section-header">
            <div>
              <h2 className="section-title">{messages.dispute.drawnTitle}</h2>
              <p className="section-subtitle">{messages.dispute.drawnSubtitle}</p>
            </div>
          </div>

          <div className="cards-grid-2">
            {(
              [
                ["A", heroA, data.card.announcedA],
                ["B", heroB, data.card.announcedB]
              ] as const
            ).map(([side, hero, list]) => (
              <div key={side} className="group-card">
                <div className="group-card__header">
                  <h3 className="group-card__title">
                    {fill(messages.dispute.sideKit, { side, name: hero?.name ?? "" })}
                  </h3>
                </div>
                <div className="protocol-kit-list">
                  {list.map((pair, idx) => {
                    const hideSealedDetails =
                      pair.isSealed && dispute.status !== "completed" && !dispute.sealedUsed;
                    const dominant = localizeSkill(pair.dominant, locale);
                    const appeal = localizeSkill(pair.appeal, locale);
                    return (
                      <div
                        key={pair.slotIndex}
                        className={`protocol-slot ${pair.isSealed ? "protocol-slot--sealed" : ""}`}
                      >
                        <div
                          className={`protocol-slot__title ${
                            pair.isSealed ? "protocol-slot__title--sealed" : ""
                          }`}
                        >
                          {pair.isSealed
                            ? dispute.sealedUsed
                              ? fill(messages.dispute.sealOpened, { side })
                              : fill(messages.dispute.sealClosed, { side })
                            : fill(messages.dispute.openSlot, { side, n: idx + 1 })}
                        </div>
                        {hideSealedDetails ? (
                          <div className="protocol-slot__sealed-body">
                            {messages.dispute.sealedBody}
                          </div>
                        ) : (
                          <div className="announced-pair announced-pair--flush">
                            <div className="announced-skill announced-skill--dominant">
                              <span className="announced-skill__tag">{messages.common.dominant}</span>
                              <strong>{dominant.title}</strong>
                              <DomainBadge domain={dominant.domain} compact />
                              <span className="announced-skill__stats tabular-nums">
                                {messages.common.sharpness} {dominant.primaryStat} · {messages.common.depth}{" "}
                                {dominant.secondaryStat}
                              </span>
                            </div>
                            <div className="announced-skill announced-skill--appeal">
                              <span className="announced-skill__tag">{messages.common.appeal}</span>
                              <strong>{appeal.title}</strong>
                              <DomainBadge domain={appeal.domain} compact />
                              <span className="announced-skill__stats tabular-nums">
                                {messages.common.firmness} {appeal.primaryStat} · {messages.common.wit}{" "}
                                {appeal.secondaryStat}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dispute.status !== "completed" ? (
        <section className="section-block">
          <div className="rule-card">
            <h3>
              {dispute.status === "announced"
                ? messages.dispute.openTomorrowTitle
                : messages.dispute.waitingTitle}
            </h3>
            <p className="rule-card__lead">
              {dispute.status === "announced"
                ? messages.dispute.openTomorrowBody
                : fill(messages.dispute.waitingBody, {
                    date: formatLocaleDate(dispute.scheduledDate, locale, "long")
                  })}
            </p>
          </div>
        </section>
      ) : null}

      {dispute.status === "completed" ? (
        <>
          <div className="protocol-outcome-bar">
            <strong>{outcomeVerdict}</strong>
            <span className="protocol-outcome-bar__reason">{resolutionReason}</span>
          </div>

          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">{messages.dispute.mainTitle}</h2>
                <p className="section-subtitle">{messages.dispute.mainSubtitle}</p>
              </div>
            </div>
            <div className="exchange-list">
              {mainExchanges.map((exchange) => {
                const attackerHero = exchange.row.attackerSide === "A" ? heroA : heroB;
                const defenderHero = exchange.row.defenderSide === "A" ? heroA : heroB;
                const dominant = localizeSkill(exchange.dominantSkill, locale);
                const appeal = localizeSkill(exchange.appealSkill, locale);
                const affinityLabel =
                  exchange.row.affinity > 1
                    ? messages.dispute.affinityWin
                    : exchange.row.affinity < 1
                      ? messages.dispute.affinityLose
                      : messages.dispute.affinityEven;
                return (
                  <article key={exchange.row.step} className="exchange-step">
                    <div className="exchange-step__header">
                      <span className="exchange-step__badge">
                        {fill(messages.dispute.exchange, {
                          step: exchange.row.step,
                          attack: exchange.row.attackerSide,
                          defend: exchange.row.defenderSide
                        })}
                      </span>
                      <span className="exchange-step__formula-meta tabular-nums">
                        {fill(messages.dispute.versusHold, {
                          affinity: affinityLabel,
                          jitter: exchange.row.jitter.toFixed(4),
                          press: exchange.row.effectivePress.toFixed(1),
                          hold: exchange.row.rawHold.toFixed(1)
                        })}
                      </span>
                    </div>
                    <div className="exchange-step__body">
                      <div className="skill-box skill-box--dominant">
                        <span className="skill-box__role">
                          {fill(messages.dispute.dominantOf, { name: attackerHero?.name ?? "" })}
                        </span>
                        <div className="skill-box__title">{dominant.title}</div>
                        <p className="skill-box__desc">{dominant.description}</p>
                        <div className="skill-box__footer tabular-nums">
                          <DomainBadge domain={dominant.domain} compact />
                          <span>
                            {messages.common.sharpness} {dominant.primaryStat} · {messages.common.depth}{" "}
                            {dominant.secondaryStat}
                          </span>
                        </div>
                      </div>
                      <div className="exchange-outcome-box tabular-nums">
                        <div className="outcome-metric">
                          <span>{fill(messages.dispute.acclaimOf, { name: attackerHero?.name ?? "" })}</span>
                          <span className="outcome-metric__val--acclaim">+{exchange.row.acclaim}</span>
                        </div>
                        <div className="outcome-metric">
                          <span>{fill(messages.dispute.retentionOf, { name: defenderHero?.name ?? "" })}</span>
                          <span className="outcome-metric__val--retention">{exchange.row.retention}</span>
                        </div>
                      </div>
                      <div className="skill-box skill-box--appeal">
                        <span className="skill-box__role">
                          {fill(messages.dispute.appealOf, { name: defenderHero?.name ?? "" })}
                        </span>
                        <div className="skill-box__title">{appeal.title}</div>
                        <p className="skill-box__desc">{appeal.description}</p>
                        <div className="skill-box__footer tabular-nums">
                          <DomainBadge domain={appeal.domain} compact />
                          <span>
                            {messages.common.firmness} {appeal.primaryStat} · {messages.common.wit}{" "}
                            {appeal.secondaryStat}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {sealedExchanges.length > 0 ? (
            <section className="section-block">
              <div className="section-header">
                <div>
                  <h2 className="section-title">{messages.dispute.sealedTitle}</h2>
                  <p className="section-subtitle">{messages.dispute.sealedSubtitle}</p>
                </div>
              </div>
              <div className="exchange-list">
                {sealedExchanges.map((exchange) => {
                  const attackerHero = exchange.row.attackerSide === "A" ? heroA : heroB;
                  const defenderHero = exchange.row.defenderSide === "A" ? heroA : heroB;
                  const dominant = localizeSkill(exchange.dominantSkill, locale);
                  const appeal = localizeSkill(exchange.appealSkill, locale);
                  return (
                    <article key={exchange.row.step} className="exchange-step exchange-step--sealed">
                      <div className="exchange-step__header">
                        <span className="exchange-step__badge">
                          {fill(messages.dispute.extraExchange, {
                            step: exchange.row.step,
                            attack: attackerHero?.name ?? "",
                            defend: defenderHero?.name ?? ""
                          })}
                        </span>
                        <span className="exchange-step__formula-meta tabular-nums">
                          affinity ×{exchange.row.affinity} · j = {exchange.row.jitter.toFixed(4)} · press·j ={" "}
                          {exchange.row.effectivePress.toFixed(1)} · hold = {exchange.row.rawHold.toFixed(1)}
                        </span>
                      </div>
                      <div className="exchange-step__body">
                        <div className="skill-box skill-box--dominant">
                          <span className="skill-box__role">
                            {fill(messages.dispute.dominantOf, { name: attackerHero?.name ?? "" })}
                          </span>
                          <div className="skill-box__title">{dominant.title}</div>
                          <p className="skill-box__desc">{dominant.description}</p>
                          <div className="skill-box__footer tabular-nums">
                            <DomainBadge domain={dominant.domain} compact />
                            <span>
                              {messages.common.sharpShort} {dominant.primaryStat} · {messages.common.depthShort}{" "}
                              {dominant.secondaryStat}
                            </span>
                          </div>
                        </div>
                        <div className="exchange-outcome-box tabular-nums">
                          <div className="outcome-metric">
                            <span>{messages.dispute.acclaim}</span>
                            <span className="outcome-metric__val--acclaim">+{exchange.row.acclaim}</span>
                          </div>
                          <div className="outcome-metric">
                            <span>{messages.dispute.retentionPlain}</span>
                            <span className="outcome-metric__val--retention">{exchange.row.retention}</span>
                          </div>
                        </div>
                        <div className="skill-box skill-box--appeal">
                          <span className="skill-box__role">
                            {fill(messages.dispute.appealOf, { name: defenderHero?.name ?? "" })}
                          </span>
                          <div className="skill-box__title">{appeal.title}</div>
                          <p className="skill-box__desc">{appeal.description}</p>
                          <div className="skill-box__footer tabular-nums">
                            <DomainBadge domain={appeal.domain} compact />
                            <span>
                              {messages.common.firmShort} {appeal.primaryStat} · {messages.common.witShort}{" "}
                              {appeal.secondaryStat}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {decisiveExchanges.length > 0 ? (
            <section className="section-block">
              <div className="section-header">
                <div>
                  <h2 className="section-title">
                    {fill(messages.dispute.decisiveTitle, {
                      a: dispute.decisiveScoreA,
                      b: dispute.decisiveScoreB
                    })}
                  </h2>
                  <p className="section-subtitle">{messages.dispute.decisiveSubtitle}</p>
                </div>
              </div>
              <div className="exchange-list">
                {decisiveExchanges.map((exchange) => {
                  const attackerHero = exchange.row.attackerSide === "A" ? heroA : heroB;
                  const defenderHero = exchange.row.defenderSide === "A" ? heroA : heroB;
                  return (
                    <article key={exchange.row.step} className="exchange-step exchange-step--decisive">
                      <div className="exchange-step__header">
                        <span className="exchange-step__badge">
                          {fill(messages.dispute.decisiveBadge, {
                            n: exchange.row.step - 6,
                            attack: attackerHero?.name ?? "",
                            defend: defenderHero?.name ?? ""
                          })}
                        </span>
                        <span className="exchange-step__formula-meta tabular-nums">
                          {messages.common.acclaim} {exchange.row.acclaim} (≥ 12) →{" "}
                          {exchange.row.decisiveAccepted ? messages.dispute.accepted : messages.dispute.held}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {dispute.gloryLotUsed ? (
            <section className="section-block">
              <div className="champion-banner">
                <div>
                  <div className="champion-banner__label">{messages.dispute.gloryLabel}</div>
                  <div className="champion-banner__name">
                    {fill(messages.dispute.gloryBody, {
                      side: dispute.gloryLotWinner ?? "",
                      name: dispute.gloryLotWinner === "A" ? (heroA?.name ?? "") : (heroB?.name ?? "")
                    })}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {eloA && eloB ? (
            <section className="section-block">
              <div className="section-header">
                <div>
                  <h2 className="section-title">{messages.dispute.eloTitle}</h2>
                  <p className="section-subtitle">{fill(messages.dispute.eloSubtitle, { k: eloA.kFactor })}</p>
                </div>
              </div>
              <div className="elo-proof-grid">
                {(
                  [
                    ["A", heroA!, eloA],
                    ["B", heroB!, eloB]
                  ] as const
                ).map(([side, hero, event]) => (
                  <div key={side} className="elo-proof-card tabular-nums">
                    <div className="elo-proof-card__header">
                      <Link href={`/heroes/${hero.slug}`} className="elo-proof-card__name">
                        {hero.name}
                      </Link>
                      <span
                        className={`elo-proof-card__delta ${
                          event.delta > 0 ? "delta-positive" : event.delta < 0 ? "delta-negative" : "delta-neutral"
                        }`}
                      >
                        {fill(messages.dispute.eloDelta, {
                          delta: event.delta > 0 ? `+${event.delta}` : event.delta
                        })}
                      </span>
                    </div>
                    <div className="elo-proof-stats">
                      <div>
                        <div className="elo-proof-stats__label">{messages.dispute.ratingBefore}</div>
                        <strong>{event.ratingBefore}</strong>
                      </div>
                      <div>
                        <div className="elo-proof-stats__label">{messages.dispute.expected}</div>
                        <strong>{event.expectedScore.toFixed(3)}</strong>
                      </div>
                      <div>
                        <div className="elo-proof-stats__label">{messages.dispute.outcome}</div>
                        <strong>{event.actualScore}</strong>
                      </div>
                      <div>
                        <div className="elo-proof-stats__label">{messages.dispute.ratingAfter}</div>
                        <strong>{event.ratingAfter}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
