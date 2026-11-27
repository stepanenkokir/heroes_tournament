import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Турнир Героев · Интеллектуальный диспут шести доменов",
  description:
    "Спектаторский портал интеллектуального состязания литературных и былинных героев: доминанты, апелляции, групповой этап, плей-офф и рейтинг Эло с пруфами."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <header className="site-header">
          <div className="site-header__inner">
            <Link href="/" className="brand-link">
              <span className="brand-seal">ТГ</span>
              <span>
                <span className="brand-title">Турнир Героев</span>
                <span className="brand-subtitle">Академия риторического диспута</span>
              </span>
            </Link>

            <nav className="site-nav" aria-label="Основная навигация">
              <Link href="/" className="site-nav__link">
                Анонс дня
              </Link>
              <Link href="/tournament" className="site-nav__link site-nav__link--accent">
                Текущий кубок
              </Link>
              <Link href="/tournaments" className="site-nav__link">
                Архив кубков
              </Link>
              <Link href="/ratings" className="site-nav__link">
                Рейтинг и пруфы
              </Link>
              <Link href="/rules" className="site-nav__link">
                Правила и формула
              </Link>
            </nav>
          </div>
        </header>

        <main className="site-main">{children}</main>

        <footer className="site-footer">
          <div className="site-footer__inner">
            <div>
              <strong>Турнир Героев</strong> · Спектаторский портал интеллектуальных состязаний (16
              героев, 6 доменов, чистая формула обмена).
            </div>
            <div>Часовой пояс расписания и закрытия дня: Europe/Moscow</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
