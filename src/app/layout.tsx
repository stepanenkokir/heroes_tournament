import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { getMessages } from "@/i18n/dictionaries";
import { LocaleProvider } from "@/i18n/locale-context";
import { getLocale, getRequestPath } from "@/i18n/server";
import { THEME_COOKIE, parseTheme } from "@/theme";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const messages = getMessages(await getLocale());
  return {
    title: messages.meta.title,
    description: messages.meta.description
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const nextPath = await getRequestPath();
  const messages = getMessages(locale);
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <html lang={locale} data-theme={theme}>
      <body>
        <LocaleProvider locale={locale}>
          <header className="site-header">
            <div className="site-header__inner">
              <Link href="/" className="brand-link">
                <span className="brand-seal">{messages.brand.seal}</span>
                <span>
                  <span className="brand-title">{messages.brand.title}</span>
                  <span className="brand-subtitle">{messages.brand.subtitle}</span>
                </span>
              </Link>

              <div className="site-header__tools">
                <ThemeSwitcher
                  theme={theme}
                  label={messages.theme.label}
                  lightLabel={messages.theme.light}
                  darkLabel={messages.theme.dark}
                />
                <LocaleSwitcher locale={locale} nextPath={nextPath} />
                <nav className="site-nav" aria-label={messages.nav.aria}>
                  <Link href="/" className="site-nav__link">
                    {messages.nav.today}
                  </Link>
                  <Link href="/tournament" className="site-nav__link site-nav__link--accent">
                    {messages.nav.current}
                  </Link>
                  <Link href="/tournaments" className="site-nav__link">
                    {messages.nav.archive}
                  </Link>
                  <Link href="/ratings" className="site-nav__link">
                    {messages.nav.ratings}
                  </Link>
                  <Link href="/rules" className="site-nav__link">
                    {messages.nav.rules}
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          <main className="site-main">{children}</main>

          <footer className="site-footer">
            <div className="site-footer__inner">
              <div>
                <strong>{messages.brand.title}</strong> · {messages.footer.line}
              </div>
              <div>{messages.footer.timezone}</div>
            </div>
          </footer>
        </LocaleProvider>
      </body>
    </html>
  );
}
