import type { DomainId } from "../domain/types";
import type {
  CommentaryRow,
  DisputeCardView,
  HeroRow,
  RatingEventRow,
  SkillRow,
  TournamentFullView
} from "../db/queries";
import { localizeSourceLabel, stageLabel } from "../i18n/present";
import { ru } from "../i18n/ru";
import type { InlineKeyboardMarkup, ReplyKeyboardMarkup } from "./telegram-api";

export const MENU_BUTTONS = {
  tables: "🏆 Таблицы",
  billboard: "📣 Афиша",
  heroes: "🎭 Герои",
  ratings: "📊 Рейтинг",
  vote: "🗳 Голос",
  notify: "🔔 Оповещения"
} as const;

export const MAIN_REPLY_KEYBOARD: ReplyKeyboardMarkup = {
  keyboard: [
    [{ text: MENU_BUTTONS.tables }, { text: MENU_BUTTONS.billboard }],
    [{ text: MENU_BUTTONS.heroes }, { text: MENU_BUTTONS.ratings }],
    [{ text: MENU_BUTTONS.vote }, { text: MENU_BUTTONS.notify }]
  ],
  resize_keyboard: true,
  is_persistent: true
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function domainTitleRu(domain: string): string {
  const entry = ru.domains[domain as DomainId];
  return entry ? entry.title : domain;
}

export function buildTablesInlineKeyboard(activeTab: string): InlineKeyboardMarkup {
  const tabs = [
    { code: "A", label: "Группа A" },
    { code: "B", label: "Группа B" },
    { code: "C", label: "Группа C" },
    { code: "D", label: "Группа D" }
  ];

  return {
    inline_keyboard: [
      tabs.map((t) => ({
        text: activeTab === t.code ? `• ${t.label} •` : t.label,
        callback_data: `g:${t.code}`
      })),
      [
        {
          text: activeTab === "playoff" ? "• Сетка плей-офф •" : "Сетка плей-офф",
          callback_data: "g:playoff"
        }
      ]
    ]
  };
}

export function formatWelcomeMessage(displayName: string, notifyEnabled: boolean): string {
  const statusText = notifyEnabled ? "включены" : "выключены";
  return [
    `<b>Турнир Героев · Академия риторического диспута</b>`,
    ``,
    `Приветствуем, секундант <b>${escapeHtml(displayName)}</b>! Ваш профиль Telegram привязан к реестру турнира.`,
    ``,
    `Используйте кнопки меню внизу экрана или команды:`,
    `• <b>${MENU_BUTTONS.tables}</b> (/tables) — таблицы групп A–D и сетка плей-офф`,
    `• <b>${MENU_BUTTONS.billboard}</b> (/today) — сегодняшняя битва и расписание`,
    `• <b>${MENU_BUTTONS.heroes}</b> (/heroes) — описание всех 50 персонажей и их навыков`,
    `• <b>${MENU_BUTTONS.ratings}</b> (/ratings) — сводный рейтинг Эло`,
    `• <b>${MENU_BUTTONS.vote}</b> (/vote) — подать бюллетень за навык героя`,
    `• <b>${MENU_BUTTONS.notify}</b> (/notify) — личные оповещения (сейчас: <b>${statusText}</b>)`
  ].join("\n");
}

export function formatGroupTable(view: TournamentFullView, groupCode: string): string {
  const group = view.groups.find((g) => g.groupCode === groupCode) ?? view.groups[0];
  if (!group) {
    return "Данные групп не найдены.";
  }

  const lines: string[] = [
    `<b>${escapeHtml(view.tournament.title)}</b>`,
    `<i>${escapeHtml(view.tournament.subtitle)}</i>`,
    ``,
    `<b>Группа ${escapeHtml(group.groupCode)} · Турнирная таблица</b>`,
    `<code>#  Герой                 И В Н П  Очк  Призн.   Уд.</code>`
  ];

  for (const row of group.standings) {
    const mark = row.qualified ? "✦" : " ";
    const namePad = row.hero.name.slice(0, 18).padEnd(18, " ");
    const wdl = `${row.played} ${row.wins} ${row.draws} ${row.losses}`;
    const pts = String(row.points).padStart(2, " ");
    const diffSign = row.acclaimDiff > 0 ? `+${row.acclaimDiff}` : String(row.acclaimDiff);
    const acclaimStr = `${row.acclaimFor}:${row.acclaimAgainst}(${diffSign})`.padEnd(8, " ");
    lines.push(
      `<code>${row.rank}${mark} ${escapeHtml(namePad)} ${wdl}  ${pts}   ${acclaimStr} ${row.retentionFor}</code>`
    );
  }

  lines.push(``, `<b>Диспуты группы ${escapeHtml(group.groupCode)}:</b>`);
  for (const card of group.disputes) {
    const { dispute, heroA, heroB } = card;
    const nameA = escapeHtml(heroA?.name ?? "Сторона A");
    const nameB = escapeHtml(heroB?.name ?? "Сторона B");
    if (dispute.status === "completed") {
      lines.push(
        `• Д${dispute.dayOffset + 1} (${dispute.scheduledDate}): <b>${nameA} ${dispute.acclaimA}:${dispute.acclaimB} ${nameB}</b> (удерж. ${dispute.retentionA}·${dispute.retentionB})`
      );
    } else if (dispute.status === "announced") {
      lines.push(
        `• Д${dispute.dayOffset + 1} (${dispute.scheduledDate}): 📣 <b>${nameA} — ${nameB}</b> (анонс дня)`
      );
    } else {
      lines.push(`• Д${dispute.dayOffset + 1} (${dispute.scheduledDate}): ⏳ ${nameA} — ${nameB}`);
    }
  }

  lines.push(``, `<i>✦ — зона выхода в плей-офф (1–2 места)</i>`);
  return lines.join("\n");
}

export function formatPlayoffBracket(view: TournamentFullView): string {
  const lines: string[] = [
    `<b>${escapeHtml(view.tournament.title)}</b>`,
    `<b>Сетка плей-офф (Четвертьфиналы, Полуфиналы, Финал)</b>`,
    ``
  ];

  for (const item of view.playoffs) {
    const { dispute, heroA, heroB } = item.card;
    const stageTitle = stageLabel(dispute.stage, dispute.groupCode, ru);
    const nameA = escapeHtml(
      heroA?.name ?? localizeSourceLabel(dispute.sourceLabelA, "ru", ru)
    );
    const nameB = escapeHtml(
      heroB?.name ?? localizeSourceLabel(dispute.sourceLabelB, "ru", ru)
    );

    if (dispute.status === "completed") {
      const winnerName =
        dispute.winnerSide === "A"
          ? nameA
          : dispute.winnerSide === "B"
            ? nameB
            : "Ничья";
      const extraNote = formatResolutionBadge(dispute);
      lines.push(
        `• <b>[${escapeHtml(dispute.playoffSlot ?? stageTitle)}]</b> (${dispute.scheduledDate})\n  <b>${nameA} ${dispute.acclaimA}:${dispute.acclaimB} ${nameB}</b>${extraNote}\n  Победитель: <b>${winnerName}</b>`
      );
    } else if (dispute.status === "announced") {
      lines.push(
        `• <b>[${escapeHtml(dispute.playoffSlot ?? stageTitle)}]</b> (${dispute.scheduledDate})\n  📣 <b>${nameA} vs ${nameB}</b> — навыки открыты сегодня`
      );
    } else {
      lines.push(
        `• <b>[${escapeHtml(dispute.playoffSlot ?? stageTitle)}]</b> (${dispute.scheduledDate})\n  ⏳ ${nameA} vs ${nameB}`
      );
    }
  }

  if (view.champion) {
    lines.push(``, `🏆 <b>Обладатель Кубка:</b> ${escapeHtml(view.champion.name)}`);
  }

  return lines.join("\n");
}

function formatResolutionBadge(dispute: DisputeCardView["dispute"]): string {
  if (dispute.resolution === "sealed_extra") {
    return " · 3-я запечатанная пара";
  }
  if (dispute.resolution === "decisive") {
    return ` · решающие доводы (${dispute.decisiveScoreA}:${dispute.decisiveScoreB})`;
  }
  if (dispute.resolution === "glory_lot") {
    return " · Жребий славы";
  }
  return "";
}

export function formatBillboard(data: {
  todayIso: string | null;
  activeTournament: { title: string } | null;
  todayDisputes: DisputeCardView[];
  upcomingVotingDisputes: DisputeCardView[];
}): { text: string; replyMarkup: InlineKeyboardMarkup } {
  const lines: string[] = [
    `<b>Афиша турнира · ${escapeHtml(data.activeTournament?.title ?? "Текущий кубок")}</b>`,
    data.todayIso ? `Дата арены: <b>${escapeHtml(data.todayIso)}</b> (Europe/Moscow)` : "",
    ``
  ].filter(Boolean);

  if (data.todayDisputes.length > 0) {
    lines.push(`<b>📣 Сегодняшние битвы (навыки открыты):</b>`);
    for (const card of data.todayDisputes) {
      const stage = stageLabel(card.dispute.stage, card.dispute.groupCode, ru);
      const nameA = escapeHtml(card.heroA?.name ?? "Сторона A");
      const nameB = escapeHtml(card.heroB?.name ?? "Сторона B");
      lines.push(`\n<b>${escapeHtml(stage)}: ${nameA} vs ${nameB}</b>`);
      for (const pair of card.announcedA.filter((p) => !p.isSealed)) {
        lines.push(
          `  A${pair.slotIndex + 1}: ⚔️ ${escapeHtml(pair.dominant.title)} (${domainTitleRu(pair.dominant.domain)}) / 🛡 ${escapeHtml(pair.appeal.title)} (${domainTitleRu(pair.appeal.domain)})`
        );
      }
      for (const pair of card.announcedB.filter((p) => !p.isSealed)) {
        lines.push(
          `  B${pair.slotIndex + 1}: ⚔️ ${escapeHtml(pair.dominant.title)} (${domainTitleRu(pair.dominant.domain)}) / 🛡 ${escapeHtml(pair.appeal.title)} (${domainTitleRu(pair.appeal.domain)})`
        );
      }
    }
  } else {
    lines.push(`Сегодня нет открытых анонсов.`);
  }

  lines.push(``);
  if (data.upcomingVotingDisputes.length > 0) {
    lines.push(`<b>🗳 Открыто голосование секундантов (следующие битвы):</b>`);
    for (const card of data.upcomingVotingDisputes) {
      const stage = stageLabel(card.dispute.stage, card.dispute.groupCode, ru);
      const nameA = escapeHtml(card.heroA?.name ?? "Сторона A");
      const nameB = escapeHtml(card.heroB?.name ?? "Сторона B");
      lines.push(
        `• ${card.dispute.scheduledDate} · ${escapeHtml(stage)}: <b>${nameA} — ${nameB}</b> (голосов: ${card.liveBallotsCount})`
      );
    }
  } else {
    lines.push(`Нет открытых пар для голосования.`);
  }

  return {
    text: lines.join("\n"),
    replyMarkup: {
      inline_keyboard: [
        [
          { text: "🗳 Голосовать за статы", callback_data: "v:list" },
          { text: "🏆 Таблицы кубка", callback_data: "g:A" }
        ]
      ]
    }
  };
}

export function formatHeroesPage(
  heroes: HeroRow[],
  page: number,
  pageSize: number = 10
): { text: string; replyMarkup: InlineKeyboardMarkup } {
  const totalPages = Math.max(1, Math.ceil(heroes.length / pageSize));
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  const slice = heroes.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const lines: string[] = [
    `<b>🎭 Персонажи Турнира Героев (стр. ${safePage + 1} из ${totalPages})</b>`,
    `Выберите героя на кнопках ниже, чтобы открыть его полное описание, доминанты и апелляции:`,
    ``
  ];

  slice.forEach((hero, idx) => {
    const rank = safePage * pageSize + idx + 1;
    lines.push(
      `${rank}. <b>${escapeHtml(hero.name)}</b> (${hero.currentRating} Эло) — <i>${escapeHtml(hero.epithet)}</i>`
    );
  });

  const rows: InlineKeyboardMarkup["inline_keyboard"] = [];
  for (let i = 0; i < slice.length; i += 2) {
    const pair = slice.slice(i, i + 2);
    rows.push(
      pair.map((h) => ({
        text: `${h.name} (${h.currentRating})`,
        callback_data: `h:v:${h.id}:${safePage}`
      }))
    );
  }

  const navRow = [];
  if (safePage > 0) {
    navRow.push({ text: "← Назад", callback_data: `h:p:${safePage - 1}` });
  }
  if (safePage < totalPages - 1) {
    navRow.push({ text: "Вперёд →", callback_data: `h:p:${safePage + 1}` });
  }
  if (navRow.length > 0) {
    rows.push(navRow);
  }

  return {
    text: lines.join("\n"),
    replyMarkup: { inline_keyboard: rows }
  };
}

export function formatHeroDetail(
  hero: HeroRow,
  dominants: SkillRow[],
  appeals: SkillRow[],
  rank: number,
  returnPage: number
): { text: string; replyMarkup: InlineKeyboardMarkup } {
  const lines: string[] = [
    `<b>🎭 ${escapeHtml(hero.name)}</b>`,
    `<i>${escapeHtml(hero.origin)} · ${escapeHtml(hero.epithet)}</i>`,
    ``,
    `Рейтинг Эло: <b>${hero.currentRating}</b> (#${rank}) · Кубков: <b>${hero.trophiesCount}</b>`,
    `Диспутов: <b>${hero.matchesPlayed}</b> (${hero.wins}В · ${hero.draws}Н · ${hero.losses}П)`,
    ``,
    `<b>⚔️ 5 Доминант (Острота / Глубина):</b>`
  ];

  for (const s of dominants) {
    lines.push(
      `${s.slot}. <b>${escapeHtml(s.title)}</b> [${domainTitleRu(s.domain)} · ${s.primaryStat}/${s.secondaryStat}]\n   <i>${escapeHtml(s.description)}</i>`
    );
  }

  lines.push(``, `<b>🛡 5 Апелляций (Твёрдость / Находчивость):</b>`);
  for (const s of appeals) {
    lines.push(
      `${s.slot}. <b>${escapeHtml(s.title)}</b> [${domainTitleRu(s.domain)} · ${s.primaryStat}/${s.secondaryStat}]\n   <i>${escapeHtml(s.description)}</i>`
    );
  }

  return {
    text: lines.join("\n"),
    replyMarkup: {
      inline_keyboard: [[{ text: "← К списку героев", callback_data: `h:p:${returnPage}` }]]
    }
  };
}

export function formatRatingsLeaderboard(
  rows: Array<{
    rank: number;
    hero: HeroRow;
    netDelta: number;
    peakRating: number;
  }>,
  verification: { valid: boolean; totalEvents: number; initialRating: number }
): string {
  const top = rows.slice(0, 15);
  const lines: string[] = [
    `<b>📊 Лидеры сводного рейтинга Эло (Топ-15 из ${rows.length})</b>`,
    `Стартовый рейтинг: ${verification.initialRating} · Пруфов: ${verification.totalEvents} · Сверка: ${verification.valid ? "✅ OK" : "⚠️ Ошибка"}`,
    ``,
    `<code>#   Герой                 Эло   Δ     В-Н-П   Куб</code>`
  ];

  for (const r of top) {
    const rk = String(r.rank).padStart(2, " ");
    const name = r.hero.name.slice(0, 18).padEnd(18, " ");
    const elo = String(r.hero.currentRating).padStart(4, " ");
    const deltaStr = (r.netDelta >= 0 ? `+${r.netDelta}` : String(r.netDelta)).padStart(4, " ");
    const wdl = `${r.hero.wins}-${r.hero.draws}-${r.hero.losses}`.padEnd(7, " ");
    lines.push(
      `<code>${rk}. ${escapeHtml(name)} ${elo} ${deltaStr}  ${wdl} ${r.hero.trophiesCount}</code>`
    );
  }

  return lines.join("\n");
}

export function formatDisputeResultNotification(params: {
  card: DisputeCardView;
  eloA: RatingEventRow | null;
  eloB: RatingEventRow | null;
  commentaryRu: CommentaryRow | null;
}): string {
  const { card, eloA, eloB, commentaryRu } = params;
  const { dispute, tournament, heroA, heroB } = card;
  const stage = stageLabel(dispute.stage, dispute.groupCode, ru);
  const nameA = escapeHtml(heroA?.name ?? "Сторона A");
  const nameB = escapeHtml(heroB?.name ?? "Сторона B");

  const winnerLine =
    dispute.winnerSide === "A"
      ? `🏆 Победитель: <b>${nameA}</b>`
      : dispute.winnerSide === "B"
        ? `🏆 Победитель: <b>${nameB}</b>`
        : `🤝 Исход: <b>Равенство признания (ничья в группе)</b>`;

  const lines: string[] = [
    `⚔️ <b>Результат битвы · ${escapeHtml(tournament.title)}</b>`,
    `${escapeHtml(stage)} · ${dispute.scheduledDate}`,
    ``,
    `<b>${nameA}  ${dispute.acclaimA ?? 0} : ${dispute.acclaimB ?? 0}  ${nameB}</b>`,
    `Удержание: ${dispute.retentionA ?? 0} · ${dispute.retentionB ?? 0}${formatResolutionBadge(dispute)}`,
    winnerLine
  ];

  if (eloA && eloB) {
    const signA = eloA.delta >= 0 ? `+${eloA.delta}` : String(eloA.delta);
    const signB = eloB.delta >= 0 ? `+${eloB.delta}` : String(eloB.delta);
    lines.push(
      `Эло: ${nameA} ${eloA.ratingBefore}→<b>${eloA.ratingAfter}</b> (${signA}) · ${nameB} ${eloB.ratingBefore}→<b>${eloB.ratingAfter}</b> (${signB})`
    );
  }

  if (commentaryRu) {
    lines.push(
      ``,
      `📝 <b>${escapeHtml(commentaryRu.headline)}</b>`,
      `<i>${escapeHtml(commentaryRu.summary)}</i>`
    );
  }

  return lines.join("\n");
}

export function formatDisputeAnnounceNotification(card: DisputeCardView): string {
  const { dispute, tournament, heroA, heroB, announcedA, announcedB, voteSnapshots } = card;
  const stage = stageLabel(dispute.stage, dispute.groupCode, ru);
  const nameA = escapeHtml(heroA?.name ?? "Сторона A");
  const nameB = escapeHtml(heroB?.name ?? "Сторона B");

  const lines: string[] = [
    `📣 <b>Анонс битвы дня · ${escapeHtml(tournament.title)}</b>`,
    `${escapeHtml(stage)} · ${dispute.scheduledDate}`,
    ``,
    `<b>${nameA}</b> vs <b>${nameB}</b>`,
    ``,
    `<b>Открытые навыки — ${nameA}:</b>`
  ];

  for (const pair of announcedA.filter((p) => !p.isSealed)) {
    lines.push(
      `• Слот A${pair.slotIndex + 1}: ⚔️ <b>${escapeHtml(pair.dominant.title)}</b> (${domainTitleRu(pair.dominant.domain)}, ${pair.dominant.primaryStat}/${pair.dominant.secondaryStat}) · 🛡 <b>${escapeHtml(pair.appeal.title)}</b> (${domainTitleRu(pair.appeal.domain)}, ${pair.appeal.primaryStat}/${pair.appeal.secondaryStat})`
    );
  }

  lines.push(``, `<b>Открытые навыки — ${nameB}:</b>`);
  for (const pair of announcedB.filter((p) => !p.isSealed)) {
    lines.push(
      `• Слот B${pair.slotIndex + 1}: ⚔️ <b>${escapeHtml(pair.dominant.title)}</b> (${domainTitleRu(pair.dominant.domain)}, ${pair.dominant.primaryStat}/${pair.dominant.secondaryStat}) · 🛡 <b>${escapeHtml(pair.appeal.title)}</b> (${domainTitleRu(pair.appeal.domain)}, ${pair.appeal.primaryStat}/${pair.appeal.secondaryStat})`
    );
  }

  if (voteSnapshots.length > 0) {
    const shifts = voteSnapshots
      .filter((s) => s.appliedBonus > 0)
      .map(
        (s) =>
          `${escapeHtml(s.skill.title)} (${s.stat === "primary" ? "I" : "II"}) +${s.appliedBonus}`
      );
    if (shifts.length > 0) {
      lines.push(``, `🗳 Сдвиги секундантов: ${shifts.join(", ")}`);
    }
  }

  lines.push(``, `<i>Расчёт четырёх обменов и итог — при смене суток (Europe/Moscow).</i>`);
  return lines.join("\n");
}
