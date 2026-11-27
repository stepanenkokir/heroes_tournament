import Link from "next/link";
import { notFound } from "next/navigation";
import { DomainBadge } from "@/components/DomainBadge";
import { HeroEmblem } from "@/components/HeroEmblem";
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

  if (!data) {
    notFound();
  }

  const { exchanges, eloA, eloB } = data;
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

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "1.5rem",
            alignItems: "center",
            marginTop: "1.2rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {heroA ? (
              <>
                <HeroEmblem emblemKey={heroA.emblemKey} accentHex={heroA.accentHex} name={heroA.name} size="lg" />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)", fontWeight: 700 }}>
                    {fill(messages.dispute.sideA, { origin: heroA.origin })}
                  </div>
                  <Link
                    href={`/heroes/${heroA.slug}`}
                    style={{ fontFamily: "var(--font-serif)", fontSize: "1.65rem", fontWeight: 700 }}
                  >
                    {heroA.name}
                  </Link>
                  <div style={{ fontSize: "0.88rem", color: "var(--ink-soft)" }}>{heroA.epithet}</div>
                </div>
              </>
            ) : (
              <div>
                <div style={{ fontSize: "0.76rem", color: "var(--gold-seal)", fontWeight: 700 }}>
                  {messages.dispute.waitingA}
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem" }}>
                  {localizeSourceLabel(dispute.sourceLabelA, locale, messages)}
                </div>
              </div>
            )}
          </div>

          <div className="dispute-card__score-box" style={{ minWidth: "150px", padding: "0.75rem 1.25rem" }}>
            {dispute.status === "completed" ? (
              <>
                <div className="dispute-card__score tabular-nums" style={{ fontSize: "2rem" }}>
                  <span>{dispute.acclaimA}</span>
                  <span className="dispute-card__score-colon">:</span>
                  <span>{dispute.acclaimB}</span>
                </div>
                <div className="dispute-card__score-caption">{messages.dispute.acclaimSum}</div>
                <div className="dispute-card__retention tabular-nums" style={{ fontSize: "0.82rem" }}>
                  {fill(messages.dispute.retention, {
                  a: dispute.retentionA ?? 0,
                  b: dispute.retentionB ?? 0
                })}
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "var(--cinnabar)"
                  }}
                >
                  — : —
                </div>
                <div className="dispute-card__score-caption">
                  {dispute.status === "announced" ? messages.dispute.resultTomorrow : messages.dispute.onSchedule}
                </div>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "1rem",
              textAlign: "right"
            }}
          >
            {heroB ? (
              <>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)", fontWeight: 700 }}>
                    {fill(messages.dispute.sideB, { origin: heroB.origin })}
                  </div>
                  <Link
                    href={`/heroes/${heroB.slug}`}
                    style={{ fontFamily: "var(--font-serif)", fontSize: "1.65rem", fontWeight: 700 }}
                  >
                    {heroB.name}
                  </Link>
                  <div style={{ fontSize: "0.88rem", color: "var(--ink-soft)" }}>{heroB.epithet}</div>
                </div>
                <HeroEmblem emblemKey={heroB.emblemKey} accentHex={heroB.accentHex} name={heroB.name} size="lg" />
              </>
            ) : (
              <div>
                <div style={{ fontSize: "0.76rem", color: "var(--gold-seal)", fontWeight: 700 }}>
                  {messages.dispute.waitingB}
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem" }}>
                  {localizeSourceLabel(dispute.sourceLabelB, locale, messages)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: "1rem",
            paddingTop: "0.75rem",
            borderTop: "1px dashed var(--border-warm)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            fontSize: "0.82rem",
            color: "var(--ink-muted)"
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)" }}>
            {fill(messages.common.protocolSeed, { seed: dispute.seed })}
          </span>
          <span>
            {dispute.status === "completed"
              ? dispute.winnerSide === "A"
                ? fill(messages.dispute.winner, { name: heroA?.name ?? "" })
                : dispute.winnerSide === "B"
                  ? fill(messages.dispute.winner, { name: heroB?.name ?? "" })
                  : messages.dispute.draw
              : messages.dispute.opensTomorrow}
          </span>
        </div>
      </section>

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
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {list.map((pair, idx) => {
                    const hideSealedDetails =
                      pair.isSealed && dispute.status !== "completed" && !dispute.sealedUsed;
                    const dominant = localizeSkill(pair.dominant, locale);
                    const appeal = localizeSkill(pair.appeal, locale);
                    return (
                      <div
                        key={pair.slotIndex}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "8px",
                          background: pair.isSealed ? "var(--gold-soft)" : "var(--parchment-bright)",
                          border: "1px solid var(--border-warm)"
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            color: pair.isSealed ? "var(--gold-seal)" : "var(--ink-muted)",
                            marginBottom: "0.45rem"
                          }}
                        >
                          {pair.isSealed
                            ? dispute.sealedUsed
                              ? fill(messages.dispute.sealOpened, { side })
                              : fill(messages.dispute.sealClosed, { side })
                            : fill(messages.dispute.openSlot, { side, n: idx + 1 })}
                        </div>
                        {hideSealedDetails ? (
                          <div style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                            {messages.dispute.sealedBody}
                          </div>
                        ) : (
                          <div className="announced-pair" style={{ marginBottom: 0 }}>
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
            <p style={{ color: "var(--ink-soft)" }}>
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.75rem"
                      }}
                    >
                      <Link
                        href={`/heroes/${hero.slug}`}
                        style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 700 }}
                      >
                        {hero.name}
                      </Link>
                      <span
                        className={
                          event.delta > 0 ? "delta-positive" : event.delta < 0 ? "delta-negative" : "delta-neutral"
                        }
                        style={{ fontSize: "1.15rem" }}
                      >
                        {fill(messages.dispute.eloDelta, {
                          delta: event.delta > 0 ? `+${event.delta}` : event.delta
                        })}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "0.5rem",
                        fontSize: "0.82rem",
                        background: "var(--parchment-bright)",
                        padding: "0.65rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border-warm)"
                      }}
                    >
                      <div>
                        <div style={{ color: "var(--ink-muted)", fontSize: "0.72rem" }}>
                          {messages.dispute.ratingBefore}
                        </div>
                        <strong>{event.ratingBefore}</strong>
                      </div>
                      <div>
                        <div style={{ color: "var(--ink-muted)", fontSize: "0.72rem" }}>
                          {messages.dispute.expected}
                        </div>
                        <strong>{event.expectedScore.toFixed(3)}</strong>
                      </div>
                      <div>
                        <div style={{ color: "var(--ink-muted)", fontSize: "0.72rem" }}>
                          {messages.dispute.outcome}
                        </div>
                        <strong>{event.actualScore}</strong>
                      </div>
                      <div>
                        <div style={{ color: "var(--ink-muted)", fontSize: "0.72rem" }}>
                          {messages.dispute.ratingAfter}
                        </div>
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
