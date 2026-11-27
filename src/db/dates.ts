export const TOURNAMENT_TIMEZONE = "Europe/Moscow";

/**
 * Возвращает текущую дату YYYY-MM-DD в часовом поясе Europe/Moscow.
 */
export function getMoscowTodayIso(now: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TOURNAMENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(now);
}

/**
 * Прибавляет deltaDays к дате YYYY-MM-DD (UTC календарная арифметика без смещения).
 */
export function addDaysIso(isoDate: string, deltaDays: number): string {
  const [y, m, d] = isoDate.split("-").map(Number) as [number, number, number];
  const utc = new Date(Date.UTC(y, m - 1, d + deltaDays));
  const year = utc.getUTCFullYear();
  const month = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря"
] as const;

export function formatLocaleDate(
  isoDate: string,
  locale: "en" | "es" | "ru",
  style: "long" | "short"
): string {
  const [y, m, d] = isoDate.split("-").map(Number) as [number, number, number];
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    ...(style === "long" ? { year: "numeric" as const } : {})
  }).format(date);
}

export function formatRussianDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number) as [number, number, number];
  const monthName = MONTHS_RU[(m - 1) % 12] ?? "";
  return `${d} ${monthName} ${y}`;
}

export function formatShortRussianDate(isoDate: string): string {
  const [, m, d] = isoDate.split("-").map(Number) as [number, number, number];
  const monthName = MONTHS_RU[(m - 1) % 12] ?? "";
  return `${d} ${monthName}`;
}
