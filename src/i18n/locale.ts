export const LOCALES = ["en", "es", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_COOKIE = "ht-locale";

export const INTL_LOCALE: Record<Locale, string> = {
  en: "en",
  es: "es",
  ru: "ru"
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "es" || value === "ru";
}

export function parseLocale(value: string | null | undefined): Locale | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim().toLowerCase().split("-")[0] ?? "";
  return isLocale(normalized) ? normalized : null;
}

export function negotiateLocale(input: {
  cookie: string | null | undefined;
  acceptLanguage: string | null | undefined;
}): Locale {
  const fromCookie = parseLocale(input.cookie);
  if (fromCookie) {
    return fromCookie;
  }

  const header = input.acceptLanguage ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { locale: parseLocale(tag), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((item): item is { locale: Locale; q: number } => item.locale !== null)
    .sort((a, b) => b.q - a.q);

  return ranked[0]?.locale ?? DEFAULT_LOCALE;
}

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

export function formatEdition(edition: number, locale: Locale): string {
  if (locale === "en") {
    const mod100 = edition % 100;
    const mod10 = edition % 10;
    const suffix =
      mod100 >= 11 && mod100 <= 13
        ? "th"
        : mod10 === 1
          ? "st"
          : mod10 === 2
            ? "nd"
            : mod10 === 3
              ? "rd"
              : "th";
    return `${edition}${suffix} convocation`;
  }
  if (locale === "es") {
    return `${edition}.ª convocatoria`;
  }
  return `${edition}-й созыв`;
}

export function formatCupEdition(edition: number, locale: Locale): string {
  if (locale === "en") {
    return `Cup ${edition}`;
  }
  if (locale === "es") {
    return `${edition}.ª Copa`;
  }
  return `${edition}-й кубок`;
}

export function ordinalPlace(rank: number, locale: Locale): string {
  if (locale === "en") {
    const mod100 = rank % 100;
    const mod10 = rank % 10;
    const suffix =
      mod100 >= 11 && mod100 <= 13
        ? "th"
        : mod10 === 1
          ? "st"
          : mod10 === 2
            ? "nd"
            : mod10 === 3
              ? "rd"
              : "th";
    return `${rank}${suffix}`;
  }
  if (locale === "es") {
    return `${rank}.º`;
  }
  return `${rank}-е`;
}
