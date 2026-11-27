import { DomainBadge } from "@/components/DomainBadge";
import { DOMAIN_ORDER } from "@/domain";
import { getMessages } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export default async function RulesPage() {
  const messages = getMessages(await getLocale());

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <span className="page-hero__kicker">{messages.rules.kicker}</span>
          <span className="page-hero__dates">{messages.rules.edition}</span>
        </div>
        <h1 className="page-hero__title">{messages.rules.title}</h1>
        <p className="page-hero__subtitle">{messages.rules.lead}</p>
      </section>

      <div className="rules-grid">
        <article className="rule-card">
          <h3>{messages.rules.s1Title}</h3>
          <p style={{ color: "var(--ink-soft)", marginBottom: "0.75rem" }}>{messages.rules.s1Lead}</p>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--ink-soft)" }}>
            <li>{messages.rules.s1Dom}</li>
            <li>{messages.rules.s1App}</li>
          </ul>
          <p style={{ color: "var(--ink-soft)", marginTop: "0.75rem" }}>{messages.rules.s1Day}</p>
        </article>

        <article className="rule-card">
          <h3>{messages.rules.s2Title}</h3>
          <p style={{ color: "var(--ink-soft)", marginBottom: "0.75rem" }}>{messages.rules.s2Lead}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {DOMAIN_ORDER.map((id) => (
              <div
                key={id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontSize: "0.85rem",
                  background: "var(--parchment-bright)",
                  padding: "0.35rem 0.6rem",
                  borderRadius: "6px"
                }}
              >
                <DomainBadge domain={id} compact />
                <span style={{ color: "var(--ink-soft)" }}>→ {messages.domains[id].rule}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rule-card">
          <h3>{messages.rules.s3Title}</h3>
          <p style={{ color: "var(--ink-soft)" }}>{messages.rules.s3Lead}</p>
          <pre className="formula-pre">{messages.rules.formula}</pre>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.88rem" }}>{messages.rules.s3Note}</p>
        </article>

        <article className="rule-card">
          <h3>{messages.rules.s4Title}</h3>
          <p style={{ color: "var(--ink-soft)", marginBottom: "0.65rem" }}>{messages.rules.s4Lead}</p>
          <ol style={{ paddingLeft: "1.25rem", color: "var(--ink-soft)", fontSize: "0.88rem" }}>
            <li>{messages.rules.s4b1}</li>
            <li>{messages.rules.s4b2}</li>
            <li>{messages.rules.s4b3}</li>
            <li>{messages.rules.s4b4}</li>
            <li>{messages.rules.s4b5}</li>
          </ol>
          <p style={{ color: "var(--ink-soft)", marginTop: "0.65rem", fontSize: "0.88rem" }}>
            {messages.rules.s4Playoff}
          </p>
        </article>

        <article className="rule-card">
          <h3>{messages.rules.s5Title}</h3>
          <p style={{ color: "var(--ink-soft)" }}>{messages.rules.s5Lead}</p>
          <pre className="formula-pre">{messages.rules.eloFormula}</pre>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.88rem" }}>{messages.rules.s5Note}</p>
        </article>

        <article className="rule-card">
          <h3>{messages.rules.s6Title}</h3>
          <p style={{ color: "var(--ink-soft)", marginBottom: "0.65rem" }}>{messages.rules.s6Lead}</p>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--ink-soft)", fontSize: "0.88rem" }}>
            <li style={{ marginBottom: "0.4rem" }}>{messages.rules.s6PublicDomain}</li>
            <li style={{ marginBottom: "0.4rem" }}>{messages.rules.s6Submissions}</li>
            <li>{messages.rules.s6NoBetting}</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
