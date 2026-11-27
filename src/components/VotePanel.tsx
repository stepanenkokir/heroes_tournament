"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DisputeCardView } from "@/db/queries";
import { getMessages } from "@/i18n/dictionaries";
import { useLocale } from "@/i18n/locale-context";
import { localizeHero, localizeSkill } from "@/i18n/present";

interface VotePanelProps {
  card: DisputeCardView;
  isSignedIn: boolean;
}

export function VotePanel({ card, isSignedIn }: VotePanelProps) {
  const locale = useLocale();
  const messages = getMessages(locale);
  const router = useRouter();
  const { dispute, voteSnapshots, skillsA, skillsB } = card;
  const heroA = card.heroA ? localizeHero(card.heroA, locale) : null;
  const heroB = card.heroB ? localizeHero(card.heroB, locale) : null;

  const [selectedSide, setSelectedSide] = useState<"A" | "B">("A");
  const activeSkills = (selectedSide === "A" ? skillsA : skillsB).map((s) =>
    localizeSkill(s, locale)
  );
  const [selectedSkillId, setSelectedSkillId] = useState<string>(
    skillsA[0]?.id ?? skillsB[0]?.id ?? ""
  );
  const effectiveSkillId = activeSkills.some((s) => s.id === selectedSkillId)
    ? selectedSkillId
    : (activeSkills[0]?.id ?? "");
  const [selectedStat, setSelectedStat] = useState<"primary" | "secondary">("primary");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canVote = dispute.status === "scheduled" && Boolean(heroA && heroB);

  const handleSideChange = (side: "A" | "B") => {
    setSelectedSide(side);
    const list = side === "A" ? skillsA : skillsB;
    if (list[0]) {
      setSelectedSkillId(list[0].id);
    }
  };

  const handleCastBallot = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetHero = selectedSide === "A" ? heroA : heroB;
    if (!targetHero || !effectiveSkillId) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disputeId: dispute.id,
          heroId: targetHero.id,
          skillId: effectiveSkillId,
          stat: selectedStat
        })
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setFeedback(data.error ?? "Ошибка");
      } else {
        setFeedback(messages.voting.savedNotice);
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const allSkillsMap = new Map(
    [...skillsA, ...skillsB].map((s) => [s.id, localizeSkill(s, locale)])
  );

  return (
    <section className="section-block">
      <div className="group-card">
        <div className="group-card__header">
          <h3 className="group-card__title">
            {canVote ? messages.voting.sectionTitle : messages.voting.crowdShifted}
          </h3>
          <span className="status-pill status-pill--scheduled">
            {canVote
              ? `${card.liveBallotsCount} · ${messages.voting.openWindowBadge}`
              : messages.voting.frozenBadge}
          </span>
        </div>

        <p style={{ color: "var(--ink-soft)", fontSize: "0.88rem", marginBottom: "0.9rem" }}>
          {canVote ? messages.voting.sectionSubtitle : messages.voting.budgetFormula}
        </p>

        {canVote ? (
          isSignedIn ? (
            <form
              onSubmit={handleCastBallot}
              style={{
                display: "grid",
                gap: "0.75rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                alignItems: "end"
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  1. {heroA?.name} / {heroB?.name}
                </label>
                <select
                  value={selectedSide}
                  onChange={(e) => handleSideChange(e.target.value as "A" | "B")}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border-warm)",
                    background: "var(--parchment-bright)",
                    color: "var(--ink)"
                  }}
                >
                  {heroA ? <option value="A">{heroA.name}</option> : null}
                  {heroB ? <option value="B">{heroB.name}</option> : null}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  2. {messages.voting.chooseSkill}
                </label>
                <select
                  value={effectiveSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border-warm)",
                    background: "var(--parchment-bright)",
                    color: "var(--ink)"
                  }}
                >
                  {activeSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      [{skill.kind === "dominant" ? messages.common.dominant : messages.common.appeal}]{" "}
                      {skill.title} ({skill.primaryStat}/{skill.secondaryStat})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  3. {messages.voting.chooseStat}
                </label>
                <select
                  value={selectedStat}
                  onChange={(e) => setSelectedStat(e.target.value as "primary" | "secondary")}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border-warm)",
                    background: "var(--parchment-bright)",
                    color: "var(--ink)"
                  }}
                >
                  <option value="primary">{messages.voting.statPrimary}</option>
                  <option value="secondary">{messages.voting.statSecondary}</option>
                </select>
              </div>

              <div>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {messages.voting.submitVote}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap" }}>
              <span style={{ color: "var(--ink-soft)", fontSize: "0.88rem" }}>
                {messages.voting.signInPrompt}
              </span>
              <Link href="/cabinet" className="btn-secondary">
                {messages.nav.cabinet}
              </Link>
            </div>
          )
        ) : null}

        {feedback ? (
          <div style={{ marginTop: "0.65rem", fontSize: "0.84rem", fontWeight: 700, color: "var(--cinnabar)" }}>
            {feedback}
          </div>
        ) : null}

        {voteSnapshots.length > 0 ? (
          <div style={{ marginTop: "0.95rem", display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
            {voteSnapshots.map((snap) => {
              const skill = localizeSkill(snap.skill, locale);
              const heroName =
                snap.heroId === heroA?.id ? heroA?.name : snap.heroId === heroB?.id ? heroB?.name : snap.heroId;
              return (
                <span
                  key={`${snap.skill.id}-${snap.stat}`}
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.32rem 0.65rem",
                    borderRadius: "6px",
                    background: "var(--gold-soft)",
                    border: "1px solid var(--border-warm)"
                  }}
                  className="tabular-nums"
                >
                  <strong>{heroName}</strong> · {skill.title} (
                  {snap.stat === "primary" ? "I" : "II"}){" "}
                  <strong style={{ color: "var(--cinnabar)" }}>+{snap.appliedBonus}</strong> (W={snap.totalWeight})
                </span>
              );
            })}
          </div>
        ) : !canVote ? (
          <div style={{ fontSize: "0.83rem", color: "var(--ink-muted)" }}>{messages.voting.noShiftsYet}</div>
        ) : null}
      </div>
    </section>
  );
}
