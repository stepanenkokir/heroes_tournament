import { DomainBadge } from "@/components/DomainBadge";
import { DOMAIN_META, DOMAIN_ORDER } from "@/domain";

export default function RulesPage() {
  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__top-bar">
          <span className="page-hero__kicker">Кодекс и математика турнира</span>
          <span className="page-hero__dates">Редакция правил · 16 героев · 6 доменов</span>
        </div>
        <h1 className="page-hero__title">Правила интеллектуального диспута и формулы расчёта</h1>
        <p className="page-hero__subtitle">
          В «Турнире Героев» нет физического урона или драки: состязание проходит как публичный
          диспут, где участники выдвигают доминанты и удерживают позицию апелляциями.
        </p>
      </section>

      <div className="rules-grid">
        <article className="rule-card">
          <h3>1. Навыки героя: 5 доминант и 5 апелляций</h3>
          <p style={{ color: "var(--ink-soft)", marginBottom: "0.75rem" }}>
            У каждого из 16 героев ровно 10 авторских навыков:
          </p>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--ink-soft)" }}>
            <li>
              <strong>5 доминант</strong> — тезисы, которыми герой давит в споре. Характеристики:{" "}
              <em>Острота</em> (30–90) и <em>Глубина</em> (30–90).
            </li>
            <li>
              <strong>5 апелляций</strong> — ответы, к которым герой взывает, защищая позицию.
              Характеристики: <em>Твёрдость</em> (30–90) и <em>Находчивость</em> (30–90).
            </li>
          </ul>
          <p style={{ color: "var(--ink-soft)", marginTop: "0.75rem" }}>
            В день диспута открываются <strong>2 доминанты и 2 апелляции</strong> каждого героя.
            Третья пара вытягивается сразу, но остаётся запечатанной — она вскрывается только при
            равенстве признания в плей-офф.
          </p>
        </article>

        <article className="rule-card">
          <h3>2. Кольцо шести доменов</h3>
          <p style={{ color: "var(--ink-soft)", marginBottom: "0.75rem" }}>
            Домены замкнуты в кольцо: каждый одолевает следующий в цепочке (множитель{" "}
            <strong>×1.2</strong>) и уступает предыдущему (множитель <strong>×0.8</strong>). В
            остальных сочетаниях коэффициент равен <strong>×1.0</strong>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {DOMAIN_ORDER.map((id) => {
              const meta = DOMAIN_META[id];
              return (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontSize: "0.85rem",
                    background: "var(--parchment-bright)",
                    padding: "0.35rem 0.6rem",
                    borderRadius: "6px"
                  }}
                >
                  <DomainBadge domain={id} compact />
                  <span style={{ color: "var(--ink-soft)" }}>→ {meta.ruleText}</span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rule-card">
          <h3>3. Формула одного обмена</h3>
          <p style={{ color: "var(--ink-soft)" }}>
            Основная серия состоит из четырёх обменов: <code>A1→B1</code>, <code>B1→A1</code>,{" "}
            <code>A2→B2</code>, <code>B2→A2</code>. Оба героя проводят ровно по две доминанты,
            поэтому преимущества первого хода нет.
          </p>
          <pre className="formula-pre">{`press = острота * (0.7 + 0.3 * глубина / 100) * affinity
hold  = твёрдость * (0.7 + 0.3 * находчивость / 100)
признание = max(0, round(press * j - hold))
удержание = round(min(press * j, hold))`}</pre>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.88rem" }}>
            Множитель <code>j</code> лежит в диапазоне <code>0.95..1.05</code> и вычисляется
            детерминированно от сида диспута и номера обмена. Счёт диспута — сумма{" "}
            <strong>признания</strong> за свои обмены. <strong>Удержание</strong> показывает,
            сколько напора сдержала апелляция: второй раз из счёта оно не вычитается и служит
            показателем качества защиты и критерием тай-брейка в группе.
          </p>
        </article>

        <article className="rule-card">
          <h3>4. Групповой этап и плей-офф без ничьих</h3>
          <p style={{ color: "var(--ink-soft)", marginBottom: "0.65rem" }}>
            В группе победа приносит 3 очка, ничья — 1, поражение — 0. При равенстве очков места
            определяются последовательно:
          </p>
          <ol style={{ paddingLeft: "1.25rem", color: "var(--ink-soft)", fontSize: "0.88rem" }}>
            <li>Личные встречи среди спорящих (очки, затем разница признания)</li>
            <li>Общая разница признания в группе</li>
            <li>Сумма набранного признания</li>
            <li>Сумма удержания</li>
            <li>Рейтинг Эло на старте кубка, затем жребий сида</li>
          </ol>
          <p style={{ color: "var(--ink-soft)", marginTop: "0.65rem", fontSize: "0.88rem" }}>
            В плей-офф (сетка <code>1A–2B</code>, <code>1B–2A</code>, <code>1C–2D</code>,{" "}
            <code>1D–2C</code>) при равенстве вскрывается запечатанная 3-я пара навыков. Если снова
            ровно — назначается серия из 5 <strong>решающих доводов</strong> (признание ≥ 12 — довод
            принят), а при полном равенстве — честный детерминированный <strong>Жребий славы</strong>.
          </p>
        </article>

        <article className="rule-card">
          <h3>5. Рейтинг Эло и пруфы</h3>
          <p style={{ color: "var(--ink-soft)" }}>
            Все герои начинают историю с <strong>1500</strong> пунктов до первого кубка. Рейтинг не
            входит в формулу обмена (фаворит может уступить из-за неудачного расклада доменов), но
            определяет корзины жеребьёвки следующего турнира.
          </p>
          <pre className="formula-pre">{`E_A = 1 / (1 + 10 ^ ((R_B - R_A) / 400))
delta = round(K * (S - E))`}</pre>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.88rem" }}>
            Где <code>S</code> = 1 (победа), 0.5 (ничья в группе) или 0 (поражение). Коэффициент
            важности стадии: <strong>K = 20</strong> в группе, <strong>K = 28</strong> в 1/4 и 1/2
            финала, <strong>K = 36</strong> в финале кубка. Каждая дельта округляется до целого
            независимо, поэтому на отдельных нечётных порогах сумма двух дельт может отличаться от
            нуля на ±1 пункт — все события записаны в открытый журнал и сверяются с нуля.
          </p>
        </article>
      </div>
    </div>
  );
}
