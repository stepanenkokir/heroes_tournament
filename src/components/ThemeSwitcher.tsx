"use client";

import { useState } from "react";
import { THEME_COOKIE, type Theme } from "@/theme";

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.2 3.2l1.2 1.2M11.6 11.6l1.2 1.2M12.8 3.2l-1.2 1.2M4.4 11.6l-1.2 1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M10.6 1.8A6.2 6.2 0 1 0 14.2 9 4.8 4.8 0 0 1 10.6 1.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeSwitcher({
  theme,
  label,
  lightLabel,
  darkLabel
}: {
  theme: Theme;
  label: string;
  lightLabel: string;
  darkLabel: string;
}) {
  const [current, setCurrent] = useState(theme);

  function apply(next: Theme) {
    document.documentElement.dataset.theme = next;
    document.cookie = `${THEME_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setCurrent(next);
  }

  return (
    <div className="theme-switcher" role="group" aria-label={label}>
      <button
        type="button"
        className={`theme-switcher__btn ${current === "light" ? "theme-switcher__btn--active" : ""}`}
        aria-pressed={current === "light"}
        aria-label={lightLabel}
        title={lightLabel}
        onClick={() => apply("light")}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        className={`theme-switcher__btn ${current === "dark" ? "theme-switcher__btn--active" : ""}`}
        aria-pressed={current === "dark"}
        aria-label={darkLabel}
        title={darkLabel}
        onClick={() => apply("dark")}
      >
        <MoonIcon />
      </button>
    </div>
  );
}
