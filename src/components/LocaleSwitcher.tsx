import { LOCALES, type Locale } from "@/i18n/locale";
import { getMessages } from "@/i18n/dictionaries";

export function LocaleSwitcher({ locale, nextPath }: { locale: Locale; nextPath: string }) {
  const messages = getMessages(locale);

  return (
    <form className="locale-switcher" action="/api/locale" method="post">
      <input type="hidden" name="next" value={nextPath} />
      <div className="locale-switcher__group" role="group" aria-label={messages.locale.label}>
        {LOCALES.map((code) => (
          <button
            key={code}
            type="submit"
            name="locale"
            value={code}
            className={`locale-switcher__btn ${code === locale ? "locale-switcher__btn--active" : ""}`}
            aria-pressed={code === locale}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
    </form>
  );
}
