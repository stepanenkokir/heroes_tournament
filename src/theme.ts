export const THEME_COOKIE = "ht-theme";

export const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

export function parseTheme(value: string | null | undefined): Theme {
  return value === "dark" ? "dark" : "light";
}
