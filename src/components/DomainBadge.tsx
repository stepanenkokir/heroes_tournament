"use client";

import { DOMAIN_META, type DomainId } from "@/domain";
import { getMessages } from "@/i18n/dictionaries";
import { useLocale } from "@/i18n/locale-context";
import { fill } from "@/i18n/locale";

interface DomainBadgeProps {
  domain: DomainId | string;
  compact?: boolean;
}

export function DomainBadge({ domain, compact = false }: DomainBadgeProps) {
  const messages = getMessages(useLocale());
  const meta = DOMAIN_META[domain as DomainId] ?? DOMAIN_META.reason;
  const copy = messages.domains[meta.id];
  const beats = messages.domains[meta.beats];

  return (
    <span
      className={`domain-badge domain-badge--${meta.id} ${compact ? "domain-badge--compact" : ""}`}
      title={`${copy.title}: ${copy.rule} (${fill(messages.domainBeats, { name: beats.title })})`}
    >
      <span className="domain-badge__dot" />
      <span>{copy.title}</span>
    </span>
  );
}
