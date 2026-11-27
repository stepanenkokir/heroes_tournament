import { DOMAIN_META, type DomainId } from "@/domain";

interface DomainBadgeProps {
  domain: DomainId | string;
  compact?: boolean;
}

export function DomainBadge({ domain, compact = false }: DomainBadgeProps) {
  const meta = DOMAIN_META[domain as DomainId] ?? DOMAIN_META.reason;
  const beatsMeta = DOMAIN_META[meta.beats];

  return (
    <span
      className={`domain-badge domain-badge--${meta.id} ${compact ? "domain-badge--compact" : ""}`}
      title={`${meta.title}: ${meta.ruleText} (одолевает домен «${beatsMeta.title}»)`}
    >
      <span className="domain-badge__dot" />
      <span>{meta.title}</span>
    </span>
  );
}
