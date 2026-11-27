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
  const pathname = nextPath.split("?")[0] ?? "/";
  const messages = getMessages(locale);
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  const navItems = [
    { href: "/", label: messages.nav.today, current: pathname === "/" },
    {
      href: "/tournament",
      label: messages.nav.current,
      current: pathname === "/tournament",
      accent: true
    },
    {
      href: "/tournaments",
      label: messages.nav.archive,
      current: pathname === "/tournaments" || pathname.startsWith("/tournaments/")
    },
    {
      href: "/ratings",
      label: messages.nav.ratings,
      current: pathname === "/ratings" || pathname.startsWith("/heroes/")
    },
    {
      href: "/cabinet",
      label: messages.nav.cabinet,
      current: pathname === "/cabinet"
    },
    { href: "/rules", label: messages.nav.rules, current: pathname === "/rules" }
  ];

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
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={`site-nav__link${item.accent ? " site-nav__link--accent" : ""}${
                        item.current ? " site-nav__link--current" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
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
