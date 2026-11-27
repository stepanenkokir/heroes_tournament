import Link from "next/link";
import { notFound } from "next/navigation";
import { DomainBadge } from "@/components/DomainBadge";
import { HeroEmblem } from "@/components/HeroEmblem";
import { formatRussianDate } from "@/db/dates";
import { getDisputeProtocolView, getStageRussianLabel } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function DisputeProtocolPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const data = getDisputeProtocolView(decodedId);

  if (!data) {
    notFound();
  }

  const { card, exchanges, eloA, eloB } = data;
  const { dispute, tournament, heroA, heroB, announcedA, announcedB } = card;
  const stageLabel = getStageRussianLabel(dispute.stage, dispute.groupCode);
  const tournamentHref =
    tournament.status === "active" ? "/tournament" : `/tournaments/${tournament.slug}`;

  const mainExchanges = exchanges.filter((e) => e.row.phase === "main");
  const sealedExchanges = exchanges.filter((e) => e.row.phase === "sealed_extra");
  const decisiveExchanges = exchanges.filter((e) => e.row.phase === "decisive");

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link href={tournamentHref} className="btn-secondary">
              ← {tournament.title}
            </Link>
            <span className="page-hero__kicker">
              {stageLabel} · День {dispute.dayOffset + 1} ({formatRussianDate(dispute.scheduledDate)})
            </span>
          </div>
          <span className={`status-pill status-pill--${dispute.status}`}>
            {dispute.status === "completed"
              ? "Протокол закрыт и заверен"
              : dispute.status === "announced"
                ? "Анонс дня · Итог откроется завтра"
                : "Запланированный диспут"}
          </span>
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
                <HeroEmblem
                  emblemKey={heroA.emblemKey}
                  accentHex={heroA.accentHex}
                  name={heroA.name}
                  size="lg"
                />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ink-muted)", fontWeight: 700 }}>
                    СТОРОНА A · {heroA.origin}
                  </div>
                  <Link
                    href={`/heroes/${heroA.slug}`}
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.65rem",
                      fontWeight: 700
                    }}
                  >
                    {heroA.name}
                  </Link>
                  <div style={{ fontSize: "0.88rem", color: "var(--ink-soft)" }}>
                    {heroA.epithet}
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div style={{ fontSize: "0.76rem", color: "var(--gold-seal)", fontWeight: 700 }}>
                  ОЖИДАНИЕ СОПЕРНИКА (A)
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem" }}>
                  {dispute.sourceLabelA ?? "Победитель пары"}
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
                <div className="dispute-card__score-caption">сумма признания</div>
                <div className="dispute-card__retention tabular-nums" style={{ fontSize: "0.82rem" }}>
                  Удержание: {dispute.retentionA} — {dispute.retentionB}
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
                  {dispute.status === "announced" ? "итог завтра" : "в расписании"}
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
                    СТОРОНА B · {heroB.origin}
                  </div>
                  <Link
                    href={`/heroes/${heroB.slug}`}
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.65rem",
                      fontWeight: 700
                    }}
                  >
                    {heroB.name}
                  </Link>
                  <div style={{ fontSize: "0.88rem", color: "var(--ink-soft)" }}>
                    {heroB.epithet}
                  </div>
                </div>
                <HeroEmblem
                  emblemKey={heroB.emblemKey}
                  accentHex={heroB.accentHex}
                  name={heroB.name}
                  size="lg"
                />
              </>
            ) : (
              <div>
                <div style={{ fontSize: "0.76rem", color: "var(--gold-seal)", fontWeight: 700 }}>
                  ОЖИДАНИЕ СОПЕРНИКА (B)
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem" }}>
                  {dispute.sourceLabelB ?? "Победитель пары"}
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
          <span style={{ fontFamily: "var(--font-mono)" }}>seed протокола: {dispute.seed}</span>
          <span>
            {dispute.status === "completed"
              ? dispute.winnerSide === "A"
                ? `Победа в диспуте: ${heroA?.name}`
                : dispute.winnerSide === "B"
                  ? `Победа в диспуте: ${heroB?.name}`
                  : "Равенство признания · Ничья в группе"
              : "Итог откроется завтра (00:00 Europe/Moscow)"}
          </span>
        </div>
      </section>

      {/* Анонсированные навыки */}
      {announcedA.length > 0 && announcedB.length > 0 ? (
        <section className="section-block">
          <div className="section-header">
            <div>
              <h2 className="section-title">Вытянутые навыки на диспут (2 открытых + 1 запечатанный)</h2>
              <p className="section-subtitle">
                Слоты 1 и 2 участвуют в четырёх основных обменах. Слот 3 запечатан и вскрывается
                только при ничьей в плей-офф.
              </p>
            </div>
          </div>

          <div className="cards-grid-2">
            {[
              { side: "A" as const, hero: heroA, list: announcedA },
              { side: "B" as const, hero: heroB, list: announcedB }
            ].map(({ side, hero, list }) => (
              <div key={side} className="group-card">
                <div className="group-card__header">
                  <h3 className="group-card__title">
                    Набор стороны {side} · {hero?.name}
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {list.map((pair, idx) => {
                    const hideSealedDetails =
                      pair.isSealed &&
                      dispute.status !== "completed" &&
                      !dispute.sealedUsed;

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
                              ? `Слот ${side}3 · Сургучная печать вскрыта (овертайм плей-офф)`
                              : `Слот ${side}3 · Запечатанный резерв плей-офф`
                            : `Открытый слот ${side}${idx + 1}`}
                        </div>

                        {hideSealedDetails ? (
                          <div style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                            Навык вытянут детерминированным жребием и хранится под печатью на случай
                            равенства после четырёх обменов.
                          </div>
                        ) : (
                          <div className="announced-pair" style={{ marginBottom: 0 }}>
                            <div className="announced-skill announced-skill--dominant">
                              <span className="announced-skill__tag">Доминанта</span>
                              <strong>{pair.dominant.title}</strong>
                              <DomainBadge domain={pair.dominant.domain} compact />
                              <span className="announced-skill__stats tabular-nums">
                                Острота {pair.dominant.primaryStat} · Глубина{" "}
                                {pair.dominant.secondaryStat}
                              </span>
                            </div>
                            <div className="announced-skill announced-skill--appeal">
                              <span className="announced-skill__tag">Апелляция</span>
                              <strong>{pair.appeal.title}</strong>
                              <DomainBadge domain={pair.appeal.domain} compact />
                              <span className="announced-skill__stats tabular-nums">
                                Твёрдость {pair.appeal.primaryStat} · Находчивость{" "}
                                {pair.appeal.secondaryStat}
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

      {/* Если диспут в статусе announced или scheduled */}
      {dispute.status !== "completed" ? (
        <section className="section-block">
          <div className="rule-card">
            <h3>
              {dispute.status === "announced"
                ? "Диспут открыт: итог откроется завтра"
                : "Диспут ожидает своей очереди в календаре"}
            </h3>
            <p style={{ color: "var(--ink-soft)" }}>
              {dispute.status === "announced"
                ? "Навыки сегодняшнего состязания уже объявлены и доступны для анализа. По регламенту турнира расчёт четырёх обменов и пересчёт рейтинга Эло происходят при смене суток (Europe/Moscow)."
                : `Этот диспут назначен на ${formatRussianDate(dispute.scheduledDate)}. В день встречи портал откроет две пары навыков каждого участника.`}
            </p>
          </div>
        </section>
      ) : null}

      {/* Пошаговый протокол для завершённого диспута */}
      {dispute.status === "completed" ? (
        <>
          <section className="section-block">
            <div className="section-header">
              <div>
                <h2 className="section-title">Основная серия: четыре обмена</h2>
                <p className="section-subtitle">
                  1) Доминанта A1 — Апелляция B1 · 2) Доминанта B1 — Апелляция A1 · 3) Доминанта A2 —
                  Апелляция B2 · 4) Доминанта B2 — Апелляция A2
                </p>
              </div>
            </div>

            <div className="exchange-list">
              {mainExchanges.map((ex) => {
                const attackerHero = ex.row.attackerSide === "A" ? heroA : heroB;
                const defenderHero = ex.row.defenderSide === "A" ? heroA : heroB;
                const affinityLabel =
                  ex.row.affinity > 1
                    ? "Домен одолевает (×1.2)"
                    : ex.row.affinity < 1
                      ? "Домен уступает (×0.8)"
                      : "Нейтральные домены (×1.0)";

                return (
                  <article key={ex.row.step} className="exchange-step">
                    <div className="exchange-step__header">
                      <span className="exchange-step__badge">
                        Обмен #{ex.row.step} · Доминанта {ex.row.attackerSide} → Апелляция{" "}
                        {ex.row.defenderSide}
                      </span>
                      <span className="exchange-step__formula-meta tabular-nums">
                        {affinityLabel} · j = {ex.row.jitter.toFixed(4)} · press·j ={" "}
                        {ex.row.effectivePress.toFixed(1)} против hold = {ex.row.rawHold.toFixed(1)}
                      </span>
                    </div>

                    <div className="exchange-step__body">
                      <div className="skill-box skill-box--dominant">
                        <span className="skill-box__role">
                          Доминанта ({attackerHero?.name})
                        </span>
                        <div className="skill-box__title">{ex.dominantSkill.title}</div>
                        <p className="skill-box__desc">{ex.dominantSkill.description}</p>
                        <div className="skill-box__footer tabular-nums">
                          <DomainBadge domain={ex.dominantSkill.domain} compact />
                          <span>
                            Острота {ex.dominantSkill.primaryStat} · Глубина{" "}
                            {ex.dominantSkill.secondaryStat}
                          </span>
                        </div>
                      </div>

                      <div className="exchange-outcome-box tabular-nums">
                        <div className="outcome-metric">
                          <span>Признание ({attackerHero?.name}):</span>
                          <span className="outcome-metric__val--acclaim">+{ex.row.acclaim}</span>
                        </div>
                        <div className="outcome-metric">
                          <span>Удержание ({defenderHero?.name}):</span>
                          <span className="outcome-metric__val--retention">{ex.row.retention}</span>
                        </div>
                      </div>

                      <div className="skill-box skill-box--appeal">
                        <span className="skill-box__role">
                          Апелляция ({defenderHero?.name})
                        </span>
                        <div className="skill-box__title">{ex.appealSkill.title}</div>
                        <p className="skill-box__desc">{ex.appealSkill.description}</p>
                        <div className="skill-box__footer tabular-nums">
                          <DomainBadge domain={ex.appealSkill.domain} compact />
                          <span>
                            Твёрдость {ex.appealSkill.primaryStat} · Находчивость{" "}
                            {ex.appealSkill.secondaryStat}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Путь через ничью в плей-офф, если он понадобился */}
          {sealedExchanges.length > 0 ? (
            <section className="section-block">
              <div className="section-header">
                <div>
                  <h2 className="section-title">
                    Снятие печати: третья пара навыков (овертайм плей-офф)
                  </h2>
                  <p className="section-subtitle">
                    После четырёх обменов счёт признания был равным. Вскрыты запечатанные слоты A3 и
                    B3.
                  </p>
                </div>
              </div>

              <div className="exchange-list">
                {sealedExchanges.map((ex) => {
                  const attackerHero = ex.row.attackerSide === "A" ? heroA : heroB;
                  const defenderHero = ex.row.defenderSide === "A" ? heroA : heroB;
                  return (
                    <article key={ex.row.step} className="exchange-step exchange-step--sealed">
                      <div className="exchange-step__header">
                        <span className="exchange-step__badge">
                          Доп. обмен #{ex.row.step} (Запечатанная пара) · {attackerHero?.name} →{" "}
                          {defenderHero?.name}
                        </span>
                        <span className="exchange-step__formula-meta tabular-nums">
                          affinity ×{ex.row.affinity} · j = {ex.row.jitter.toFixed(4)} · press·j ={" "}
                          {ex.row.effectivePress.toFixed(1)} · hold = {ex.row.rawHold.toFixed(1)}
                        </span>
                      </div>

                      <div className="exchange-step__body">
                        <div className="skill-box skill-box--dominant">
                          <span className="skill-box__role">Доминанта ({attackerHero?.name})</span>
                          <div className="skill-box__title">{ex.dominantSkill.title}</div>
                          <p className="skill-box__desc">{ex.dominantSkill.description}</p>
                          <div className="skill-box__footer tabular-nums">
                            <DomainBadge domain={ex.dominantSkill.domain} compact />
                            <span>
                              Остр. {ex.dominantSkill.primaryStat} · Глуб.{" "}
                              {ex.dominantSkill.secondaryStat}
                            </span>
                          </div>
                        </div>

                        <div className="exchange-outcome-box tabular-nums">
                          <div className="outcome-metric">
                            <span>Признание:</span>
                            <span className="outcome-metric__val--acclaim">+{ex.row.acclaim}</span>
                          </div>
                          <div className="outcome-metric">
                            <span>Удержание:</span>
                            <span className="outcome-metric__val--retention">
                              {ex.row.retention}
                            </span>
                          </div>
                        </div>

                        <div className="skill-box skill-box--appeal">
                          <span className="skill-box__role">Апелляция ({defenderHero?.name})</span>
                          <div className="skill-box__title">{ex.appealSkill.title}</div>
                          <p className="skill-box__desc">{ex.appealSkill.description}</p>
                          <div className="skill-box__footer tabular-nums">
                            <DomainBadge domain={ex.appealSkill.domain} compact />
                            <span>
                              Твёрд. {ex.appealSkill.primaryStat} · Находч.{" "}
                              {ex.appealSkill.secondaryStat}
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
                    Серия решающих доводов ({dispute.decisiveScoreA} : {dispute.decisiveScoreB})
                  </h2>
                  <p className="section-subtitle">
                    Признание ≥ 12 означает, что довод принят судейской коллегией; иначе апелляция
                    удержала рубеж.
                  </p>
                </div>
              </div>

              <div className="exchange-list">
                {decisiveExchanges.map((ex) => {
                  const attackerHero = ex.row.attackerSide === "A" ? heroA : heroB;
                  const defenderHero = ex.row.defenderSide === "A" ? heroA : heroB;
                  return (
                    <article key={ex.row.step} className="exchange-step exchange-step--decisive">
                      <div className="exchange-step__header">
                        <span className="exchange-step__badge">
                          Решающий довод #{ex.row.step - 6} · {attackerHero?.name} против{" "}
                          {defenderHero?.name}
                        </span>
                        <span className="exchange-step__formula-meta tabular-nums">
                          Признание {ex.row.acclaim} (порог 12) →{" "}
                          {ex.row.decisiveAccepted ? "ДОВОД ПРИНЯТ" : "УДЕРЖАНО"}
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
                  <div className="champion-banner__label">Жребий славы (Seeded Coin)</div>
                  <div className="champion-banner__name">
                    После полного равенства серии победу по честному жребию сида одержала сторона{" "}
                    {dispute.gloryLotWinner} (
                    {dispute.gloryLotWinner === "A" ? heroA?.name : heroB?.name}).
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {/* Пруф пересчёта рейтинга Эло */}
          {eloA && eloB ? (
            <section className="section-block">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Пруф пересчёта рейтинга Эло по итогам диспута</h2>
                  <p className="section-subtitle">
                    Коэффициент стадии K = {eloA.kFactor}. Ожидание E вычислено по классической
                    формуле Эло до начала обмена.
                  </p>
                </div>
              </div>

              <div className="elo-proof-grid">
                {[
                  { side: "A", hero: heroA!, ev: eloA },
                  { side: "B", hero: heroB!, ev: eloB }
                ].map(({ side, hero, ev }) => (
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
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "1.2rem",
                          fontWeight: 700
                        }}
                      >
                        {hero.name}
                      </Link>
                      <span
                        className={
                          ev.delta > 0
                            ? "delta-positive"
                            : ev.delta < 0
                              ? "delta-negative"
                              : "delta-neutral"
                        }
                        style={{ fontSize: "1.15rem" }}
                      >
                        {ev.delta > 0 ? `+${ev.delta}` : ev.delta} Эло
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
                        <div style={{ color: "var(--ink-muted)", fontSize: "0.72rem" }}>Рейтинг до</div>
                        <strong>{ev.ratingBefore}</strong>
                      </div>
                      <div>
                        <div style={{ color: "var(--ink-muted)", fontSize: "0.72rem" }}>
                          Ожидание E
                        </div>
                        <strong>{ev.expectedScore.toFixed(3)}</strong>
                      </div>
                      <div>
                        <div style={{ color: "var(--ink-muted)", fontSize: "0.72rem" }}>Исход S</div>
                        <strong>{ev.actualScore}</strong>
                      </div>
                      <div>
                        <div style={{ color: "var(--ink-muted)", fontSize: "0.72rem" }}>
                          Рейтинг после
                        </div>
                        <strong>{ev.ratingAfter}</strong>
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
