"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DisputeCardView, getCabinetView } from "@/db/queries";
import { getMessages } from "@/i18n/dictionaries";
import { fill } from "@/i18n/locale";
import { useLocale } from "@/i18n/locale-context";
import { localizeHero, localizeSkill } from "@/i18n/present";

type CabinetViewData = ReturnType<typeof getCabinetView>;

interface CabinetClientProps {
  cabinet: CabinetViewData;
  openDisputes: DisputeCardView[];
}

export function CabinetClient({ cabinet, openDisputes }: CabinetClientProps) {
  const locale = useLocale();
  const messages = getMessages(locale);
  const router = useRouter();

  const [handleInput, setHandleInput] = useState("reader_polemic");
  const [displayNameInput, setDisplayNameInput] = useState("Секундант Трибунала");
  const [authLoading, setAuthLoading] = useState(false);

  const [proposalKind, setProposalKind] = useState<"hero" | "skill">("hero");
  const [targetHeroId, setTargetHeroId] = useState<string>(
    cabinet.allHeroes[0]?.id ?? "odysseus"
  );
  const [proposedName, setProposedName] = useState("");
  const [originOrDomain, setOriginOrDomain] = useState("");
  const [description, setDescription] = useState("");
  const [pdChecked, setPdChecked] = useState(false);
  const [licChecked, setLicChecked] = useState(false);
  const [proposalMsg, setProposalMsg] = useState<string | null>(null);

  const handleOAuth = async (provider: "telegram" | "google" | "vk") => {
    setAuthLoading(true);
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          provider,
          handle: handleInput,
          displayName: displayNameInput
        })
      });
      router.refresh();
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" })
      });
      router.refresh();
    } finally {
      setAuthLoading(false);
    }
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProposalMsg(null);
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: proposalKind,
        targetHeroId: proposalKind === "skill" ? targetHeroId : null,
        proposedName,
        originOrDomain,
        description,
        publicDomainAttested: pdChecked,
        licenseGranted: licChecked
      })
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    if (!data.ok) {
      setProposalMsg(data.error ?? "Ошибка отправки");
    } else {
      setProposalMsg(messages.cabinet.proposalPendingBadge);
      setProposedName("");
      setOriginOrDomain("");
      setDescription("");
      router.refresh();
    }
  };

  const achievementLabels: Record<string, string> = {
    first_ballot: messages.cabinet.achFirstBallot,
    first_victory: messages.cabinet.achFirstVictory,
    streak_3: messages.cabinet.achStreak3,
    oracle_5: messages.cabinet.achOracle5,
    patron_proposer: messages.cabinet.achPatronProposer
  };

  const user = cabinet.currentUser;
  const allBallots = [...cabinet.openBallots, ...cabinet.closedBallots];
  const canSubmitProposal = Boolean(
    user && user.reputationPoints >= cabinet.reputationThreshold
  );

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <span className="page-hero__kicker">{messages.cabinet.kicker}</span>
          {user ? (
            <button onClick={handleLogout} className="btn-secondary" disabled={authLoading}>
              {messages.cabinet.logout} ({user.displayName})
            </button>
          ) : null}
        </div>
        <h1 className="page-hero__title">{messages.cabinet.title}</h1>
        <p className="page-hero__subtitle">{messages.cabinet.subtitle}</p>
      </section>

      <section className="section-block">
        <div className="group-card">
          <div className="group-card__header">
            <h2 className="group-card__title">{messages.cabinet.oauthTitle}</h2>
            {cabinet.linkedAccounts.length > 0 ? (
              <span className="status-pill status-pill--completed">
                {messages.cabinet.linkedProviders}:{" "}
                {cabinet.linkedAccounts.map((acc) => `${acc.provider}:${acc.handle}`).join(" · ")}
              </span>
            ) : null}
          </div>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.88rem", marginBottom: "0.9rem" }}>
            {messages.cabinet.oauthLead}
          </p>

          <div
            style={{
              display: "grid",
              gap: "0.75rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              marginBottom: "0.9rem"
            }}
          >
            <input
              type="text"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              placeholder="@handle / email"
              style={{
                padding: "0.5rem 0.7rem",
                borderRadius: "6px",
                border: "1px solid var(--border-warm)",
                background: "var(--parchment-bright)",
                color: "var(--ink)"
              }}
            />
            <input
              type="text"
              value={displayNameInput}
              onChange={(e) => setDisplayNameInput(e.target.value)}
              placeholder="Имя секунданта"
              style={{
                padding: "0.5rem 0.7rem",
                borderRadius: "6px",
                border: "1px solid var(--border-warm)",
                background: "var(--parchment-bright)",
                color: "var(--ink)"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn-primary"
              disabled={authLoading}
              onClick={() => handleOAuth("telegram")}
            >
              {messages.cabinet.connectTelegram}
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={authLoading}
              onClick={() => handleOAuth("google")}
            >
              {messages.cabinet.connectGoogle}
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={authLoading}
              onClick={() => handleOAuth("vk")}
            >
              {messages.cabinet.connectVk}
            </button>
          </div>
        </div>
      </section>

      {user ? (
        <>
          <section className="section-block">
            <div className="elo-proof-grid">
              <div className="elo-proof-card tabular-nums">
                <div className="elo-proof-stats__label">{messages.cabinet.statsReputation}</div>
                <strong style={{ fontSize: "1.8rem", color: "var(--cinnabar)" }}>
                  {user.reputationPoints}
                </strong>
              </div>
              <div className="elo-proof-card tabular-nums">
                <div className="elo-proof-stats__label">{messages.cabinet.statsWins}</div>
                <strong style={{ fontSize: "1.8rem" }}>{user.winsCount}</strong>
              </div>
              <div className="elo-proof-card tabular-nums">
                <div className="elo-proof-stats__label">{messages.cabinet.statsVotes}</div>
                <strong style={{ fontSize: "1.8rem" }}>{user.votesCount}</strong>
              </div>
              <div className="elo-proof-card tabular-nums">
                <div className="elo-proof-stats__label">{messages.cabinet.statsStreak}</div>
                <strong style={{ fontSize: "1.8rem" }}>
                  {user.currentStreak} / {user.bestStreak}
                </strong>
              </div>
            </div>
          </section>

          <section className="section-block">
            <div className="cards-grid-2">
              <div className="group-card">
                <div className="group-card__header">
                  <h3 className="group-card__title">{messages.cabinet.achievementsTitle}</h3>
                </div>
                {cabinet.achievements.length === 0 ? (
                  <p style={{ fontSize: "0.86rem", color: "var(--ink-muted)" }}>
                    {messages.cabinet.noAchievements}
                  </p>
                ) : (
                  <ul style={{ paddingLeft: "1.2rem", color: "var(--ink-soft)" }}>
                    {cabinet.achievements.map((ach) => (
                      <li key={ach.code} style={{ marginBottom: "0.35rem" }}>
                        <strong>{achievementLabels[ach.code] ?? ach.code}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="group-card">
                <div className="group-card__header">
                  <h3 className="group-card__title">{messages.cabinet.ballotsOpenTitle}</h3>
                </div>
                {allBallots.length === 0 ? (
                  <p style={{ fontSize: "0.86rem", color: "var(--ink-muted)" }}>
                    {messages.cabinet.noBallots}
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                    {allBallots.slice(0, 8).map(({ ballot, dispute, hero, skill, won }) => {
                      const locHero = localizeHero(hero, locale);
                      const locSkill = localizeSkill(skill, locale);
                      return (
                        <div
                          key={ballot.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.45rem 0.65rem",
                            borderRadius: "6px",
                            background: "var(--parchment-bright)",
                            fontSize: "0.83rem"
                          }}
                        >
                          <div>
                            <Link
                              href={`/disputes/${encodeURIComponent(ballot.disputeId)}`}
                              style={{ fontWeight: 700 }}
                            >
                              {locHero.name}
                            </Link>{" "}
                            · {locSkill.title} ({ballot.stat})
                          </div>
                          <span className="tabular-nums" style={{ fontWeight: 700 }}>
                            {dispute.status === "completed"
                              ? won
                                ? messages.cabinet.wonPoint
                                : messages.cabinet.noPoint
                              : dispute.scheduledDate}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="section-block">
            <div className="group-card">
              <div className="group-card__header">
                <h3 className="group-card__title">{messages.cabinet.proposalTitle}</h3>
                <span className="status-pill status-pill--announced">
                  {user.reputationPoints} / {cabinet.reputationThreshold} rep
                </span>
              </div>
              <p style={{ color: "var(--ink-soft)", fontSize: "0.88rem", marginBottom: "0.9rem" }}>
                {messages.cabinet.proposalLead}
              </p>

              {!canSubmitProposal ? (
                <div style={{ fontSize: "0.86rem", color: "var(--ink-muted)" }}>
                  {fill(messages.cabinet.proposalLocked, {
                    threshold: cabinet.reputationThreshold
                  })}
                </div>
              ) : (
                <form
                  onSubmit={handleProposalSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
                >
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <select
                      value={proposalKind}
                      onChange={(e) => setProposalKind(e.target.value as "hero" | "skill")}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid var(--border-warm)",
                        background: "var(--parchment-bright)"
                      }}
                    >
                      <option value="hero">{messages.cabinet.proposalKindHero}</option>
                      <option value="skill">{messages.cabinet.proposalKindSkill}</option>
                    </select>
                    {proposalKind === "skill" ? (
                      <select
                        value={targetHeroId}
                        onChange={(e) => setTargetHeroId(e.target.value)}
                        style={{
                          padding: "0.5rem",
                          borderRadius: "6px",
                          border: "1px solid var(--border-warm)",
                          background: "var(--parchment-bright)"
                        }}
                      >
                        {cabinet.allHeroes.map((h) => {
                          const locH = localizeHero(h, locale);
                          return (
                            <option key={h.id} value={h.id}>
                              {locH.name}
                            </option>
                          );
                        })}
                      </select>
                    ) : null}
                    <input
                      type="text"
                      value={proposedName}
                      onChange={(e) => setProposedName(e.target.value)}
                      placeholder={messages.cabinet.proposalNameLabel}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid var(--border-warm)",
                        background: "var(--parchment-bright)"
                      }}
                    />
                    <input
                      type="text"
                      value={originOrDomain}
                      onChange={(e) => setOriginOrDomain(e.target.value)}
                      placeholder={messages.cabinet.proposalOriginLabel}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid var(--border-warm)",
                        background: "var(--parchment-bright)"
                      }}
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={messages.cabinet.proposalDescLabel}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border: "1px solid var(--border-warm)",
                      background: "var(--parchment-bright)"
                    }}
                  />
                  <label style={{ fontSize: "0.83rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={pdChecked}
                      onChange={(e) => setPdChecked(e.target.checked)}
                    />
                    {messages.cabinet.proposalAttestPd}
                  </label>
                  <label style={{ fontSize: "0.83rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={licChecked}
                      onChange={(e) => setLicChecked(e.target.checked)}
                    />
                    {messages.cabinet.proposalGrantLicense}
                  </label>
                  <div>
                    <button type="submit" className="btn-primary">
                      {messages.cabinet.proposalSubmit}
                    </button>
                  </div>
                </form>
              )}

              {proposalMsg ? (
                <div style={{ marginTop: "0.65rem", fontWeight: 700, color: "var(--cinnabar)" }}>
                  {proposalMsg}
                </div>
              ) : null}
            </div>
          </section>
        </>
      ) : null}

      {openDisputes.length > 0 ? (
        <section className="section-block">
          <div className="section-header">
            <div>
              <h2 className="section-title">{messages.voting.sectionTitle}</h2>
              <p className="section-subtitle">{messages.voting.sectionSubtitle}</p>
            </div>
          </div>
          <div className="cards-grid-2">
            {openDisputes.map((card) => {
              const hA = card.heroA ? localizeHero(card.heroA, locale) : null;
              const hB = card.heroB ? localizeHero(card.heroB, locale) : null;
              return (
                <div key={card.dispute.id} className="group-card">
                  <div className="group-card__header">
                    <strong>
                      {hA?.name} vs {hB?.name}
                    </strong>
                    <span className="status-pill status-pill--scheduled">
                      {card.dispute.scheduledDate}
                    </span>
                  </div>
                  <Link
                    href={`/disputes/${encodeURIComponent(card.dispute.id)}`}
                    className="dispute-card__link"
                  >
                    {messages.voting.submitVote} →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
