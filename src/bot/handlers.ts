import { asc, eq } from "drizzle-orm";
import type { SkillStatKind } from "../domain/types";
import type { AppDbBundle } from "../db/client";
import { castDisputeBallot } from "../db/engine";
import {
  type DisputeCardView,
  getDisputeProtocolView,
  getHeroProfileView,
  getHomePortalData,
  getRatingsLeaderboardView,
  getTournamentFullView
} from "../db/queries";
import { disputeVotesTable, heroesTable } from "../db/schema";
import { stageLabel } from "../i18n/present";
import { ru } from "../i18n/ru";
import {
  buildTablesInlineKeyboard,
  domainTitleRu,
  escapeHtml,
  formatBillboard,
  formatGroupTable,
  formatHeroDetail,
  formatHeroesPage,
  formatPlayoffBracket,
  formatRatingsLeaderboard,
  formatWelcomeMessage,
  MAIN_REPLY_KEYBOARD,
  MENU_BUTTONS
} from "./formatters";
import {
  ensureTelegramSubscriber,
  toggleSubscriberNotifications
} from "./notifier";
import type {
  InlineKeyboardMarkup,
  TelegramApiClient,
  TelegramCallbackQuery,
  TelegramMessage,
  TelegramUpdate,
  TelegramUser
} from "./telegram-api";

interface VoteDraftSession {
  disputeId: string;
  side?: "A" | "B";
  skillId?: string;
}

const voteSessions = new Map<string, VoteDraftSession>();

function getSortedHeroes(bundle: AppDbBundle) {
  return bundle.db
    .select()
    .from(heroesTable)
    .all()
    .sort((a, b) => b.currentRating - a.currentRating || a.id.localeCompare(b.id));
}

function getOpenVotingCards(bundle: AppDbBundle): DisputeCardView[] {
  const fullView = getTournamentFullView("active", bundle);
  if (!fullView) {
    return [];
  }
  const allCards: DisputeCardView[] = [];
  for (const day of fullView.days) {
    for (const c of day.disputes) {
      if (c.dispute.status === "scheduled" && c.heroA && c.heroB) {
        allCards.push(c);
      }
    }
  }
  return allCards.sort(
    (a, b) =>
      a.dispute.scheduledDate.localeCompare(b.dispute.scheduledDate) ||
      a.dispute.matchOrder - b.dispute.matchOrder
  );
}

function buildVoteDisputeListView(
  bundle: AppDbBundle,
  userId?: string
): { text: string; replyMarkup: InlineKeyboardMarkup } {
  const home = getHomePortalData(bundle);
  const openCards = getOpenVotingCards(bundle).slice(0, 8);
  const userVotes = userId
    ? bundle.db
        .select()
        .from(disputeVotesTable)
        .where(eq(disputeVotesTable.userId, userId))
        .all()
    : [];
  const voteByDispute = new Map(userVotes.map((v) => [v.disputeId, v]));

  const lines: string[] = [
    `<b>🗳 Голосование секундантов · ${escapeHtml(home.activeTournament?.title ?? "Текущий кубок")}</b>`,
    `Выберите открытый диспут, чтобы поддержать характеристику навыка одного из героев (бюджет матча +6, потолок +3 к стате).`
  ];

  if (home.todayDisputes.length > 0) {
    lines.push(
      ``,
      `<i>Сегодняшние объявленные битвы (${home.todayIso}) уже зафиксировали снимок голосов.</i>`
    );
  }

  if (openCards.length === 0) {
    lines.push(``, `Сейчас нет открытых пар со статусом «В расписании».`);
    return {
      text: lines.join("\n"),
      replyMarkup: {
        inline_keyboard: [[{ text: "📣 К афише дня", callback_data: "v:billboard" }]]
      }
    };
  }

  lines.push(``, `<b>Доступные пары для бюллетеня:</b>`);
  const buttons: InlineKeyboardMarkup["inline_keyboard"] = [];

  openCards.forEach((card, idx) => {
    const stage = stageLabel(card.dispute.stage, card.dispute.groupCode, ru);
    const nameA = card.heroA!.name;
    const nameB = card.heroB!.name;
    const existingVote = voteByDispute.get(card.dispute.id);
    const votedBadge = existingVote ? " ✅ ваш голос учтён" : "";

    lines.push(
      `${idx + 1}. ${card.dispute.scheduledDate} · ${escapeHtml(stage)}: <b>${escapeHtml(nameA)} — ${escapeHtml(nameB)}</b> (голосов: ${card.liveBallotsCount})${votedBadge}`
    );

    buttons.push([
      {
        text: `${existingVote ? "✅ " : ""}${idx + 1}. ${nameA} vs ${nameB} (${card.dispute.scheduledDate})`,
        callback_data: `v:d:${idx}`
      }
    ]);
  });

  return {
    text: lines.join("\n"),
    replyMarkup: { inline_keyboard: buttons }
  };
}

function buildVoteHeroStepView(card: DisputeCardView): {
  text: string;
  replyMarkup: InlineKeyboardMarkup;
} {
  const stage = stageLabel(card.dispute.stage, card.dispute.groupCode, ru);
  const heroA = card.heroA!;
  const heroB = card.heroB!;

  const lines: string[] = [
    `<b>🗳 Шаг 1 из 3 · Выбор стороны спора</b>`,
    `${escapeHtml(stage)} · ${card.dispute.scheduledDate}`,
    ``,
    `Сторона A: <b>${escapeHtml(heroA.name)}</b> (${heroA.currentRating} Эло) — <i>${escapeHtml(heroA.epithet)}</i>`,
    `Сторона B: <b>${escapeHtml(heroB.name)}</b> (${heroB.currentRating} Эло) — <i>${escapeHtml(heroB.epithet)}</i>`,
    ``,
    `Выберите персонажа, чей навык хотите усилить:`
  ];

  return {
    text: lines.join("\n"),
    replyMarkup: {
      inline_keyboard: [
        [{ text: `Сторона A: ${heroA.name}`, callback_data: "v:h:A" }],
        [{ text: `Сторона B: ${heroB.name}`, callback_data: "v:h:B" }],
        [{ text: "← К списку пар", callback_data: "v:list" }]
      ]
    }
  };
}

function buildVoteSkillStepView(
  card: DisputeCardView,
  side: "A" | "B"
): { text: string; replyMarkup: InlineKeyboardMarkup } {
  const hero = side === "A" ? card.heroA! : card.heroB!;
  const skills = (side === "A" ? card.skillsA : card.skillsB)
    .slice()
    .sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind === "dominant" ? -1 : 1;
      }
      return a.slot - b.slot;
    });

  const lines: string[] = [
    `<b>🗳 Шаг 2 из 3 · Выбор навыка героя ${escapeHtml(hero.name)}</b>`,
    `Выберите одну из 5 доминант или 5 апелляций:`
  ];

  const rows: InlineKeyboardMarkup["inline_keyboard"] = [];

  skills.forEach((s, idx) => {
    const kindLabel = s.kind === "dominant" ? "⚔️ Дом." : "🛡 Апел.";
    lines.push(
      `${idx + 1}. ${kindLabel} <b>${escapeHtml(s.title)}</b> [${domainTitleRu(s.domain)} · ${s.primaryStat}/${s.secondaryStat}]`
    );
    rows.push([
      {
        text: `${kindLabel} ${s.title} (${s.primaryStat}/${s.secondaryStat})`,
        callback_data: `v:s:${idx}`
      }
    ]);
  });

  rows.push([{ text: "← Назад к выбору героя", callback_data: "v:back:hero" }]);

  return {
    text: lines.join("\n"),
    replyMarkup: { inline_keyboard: rows }
  };
}

function buildVoteStatStepView(
  card: DisputeCardView,
  side: "A" | "B",
  skillIdx: number
): { text: string; replyMarkup: InlineKeyboardMarkup; skillId: string } | null {
  const hero = side === "A" ? card.heroA! : card.heroB!;
  const skills = (side === "A" ? card.skillsA : card.skillsB)
    .slice()
    .sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind === "dominant" ? -1 : 1;
      }
      return a.slot - b.slot;
    });
  const skill = skills[skillIdx];
  if (!skill) {
    return null;
  }

  const primaryLabel =
    skill.kind === "dominant"
      ? `Первичная: Острота (${skill.primaryStat})`
      : `Первичная: Твёрдость (${skill.primaryStat})`;
  const secondaryLabel =
    skill.kind === "dominant"
      ? `Вторичная: Глубина (${skill.secondaryStat})`
      : `Вторичная: Находчивость (${skill.secondaryStat})`;

  const lines: string[] = [
    `<b>🗳 Шаг 3 из 3 · Выбор характеристики</b>`,
    `Герой: <b>${escapeHtml(hero.name)}</b>`,
    `Навык: <b>${escapeHtml(skill.title)}</b> (${domainTitleRu(skill.domain)})`,
    `<i>${escapeHtml(skill.description)}</i>`,
    ``,
    `Какую характеристику направить в снимок голосов?`
  ];

  return {
    skillId: skill.id,
    text: lines.join("\n"),
    replyMarkup: {
      inline_keyboard: [
        [{ text: primaryLabel, callback_data: "v:c:primary" }],
        [{ text: secondaryLabel, callback_data: "v:c:secondary" }],
        [{ text: "← Назад к навыкам", callback_data: `v:h:${side}` }]
      ]
    }
  };
}

export async function handleTelegramUpdate(
  bundle: AppDbBundle,
  api: TelegramApiClient,
  update: TelegramUpdate
): Promise<void> {
  if (update.message) {
    await handleIncomingMessage(bundle, api, update.message);
  } else if (update.callback_query) {
    await handleCallbackQuery(bundle, api, update.callback_query);
  }
}

async function handleIncomingMessage(
  bundle: AppDbBundle,
  api: TelegramApiClient,
  message: TelegramMessage
): Promise<void> {
  if (message.chat.type !== "private" || !message.text) {
    return;
  }

  const chatId = message.chat.id;
  const tgUser: TelegramUser = message.from ?? {
    id: chatId,
    is_bot: false,
    first_name: "Секундант"
  };

  const { subscriber, user } = ensureTelegramSubscriber(bundle, chatId, tgUser);
  const text = message.text.trim();

  if (text === "/start" || text.startsWith("/start ") || text === "/help") {
    await api.sendMessage({
      chatId,
      text: formatWelcomeMessage(subscriber.displayName, subscriber.notifyEnabled),
      replyMarkup: MAIN_REPLY_KEYBOARD
    });
    return;
  }

  if (text === "/tables" || text === MENU_BUTTONS.tables) {
    const view = getTournamentFullView("active", bundle);
    if (!view) {
      await api.sendMessage({
        chatId,
        text: "Активный турнир не найден.",
        replyMarkup: MAIN_REPLY_KEYBOARD
      });
      return;
    }
    await api.sendMessage({
      chatId,
      text: formatGroupTable(view, "A"),
      replyMarkup: buildTablesInlineKeyboard("A")
    });
    return;
  }

  if (text === "/today" || text === MENU_BUTTONS.billboard) {
    const home = getHomePortalData(bundle);
    const formatted = formatBillboard(home);
    await api.sendMessage({
      chatId,
      text: formatted.text,
      replyMarkup: formatted.replyMarkup
    });
    return;
  }

  if (text === "/heroes" || text === MENU_BUTTONS.heroes || text.startsWith("/hero")) {
    const query = text.startsWith("/hero") ? text.replace(/^\/heroes?\s*/i, "").trim() : "";
    const heroes = getSortedHeroes(bundle);

    if (query.length > 0) {
      const lower = query.toLowerCase();
      const match = heroes.find(
        (h) =>
          h.id.toLowerCase() === lower ||
          h.slug.toLowerCase() === lower ||
          h.name.toLowerCase().includes(lower)
      );
      if (match) {
        const profile = getHeroProfileView(match.id, bundle);
        if (profile) {
          const detail = formatHeroDetail(
            profile.hero,
            profile.dominants,
            profile.appeals,
            profile.rank,
            0
          );
          await api.sendMessage({
            chatId,
            text: detail.text,
            replyMarkup: detail.replyMarkup
          });
          return;
        }
      }
    }

    const pageView = formatHeroesPage(heroes, 0);
    await api.sendMessage({
      chatId,
      text: pageView.text,
      replyMarkup: pageView.replyMarkup
    });
    return;
  }

  if (text === "/ratings" || text === MENU_BUTTONS.ratings) {
    const leaderboard = getRatingsLeaderboardView(bundle);
    await api.sendMessage({
      chatId,
      text: formatRatingsLeaderboard(leaderboard.rows, leaderboard.verification),
      replyMarkup: MAIN_REPLY_KEYBOARD
    });
    return;
  }

  if (text === "/vote" || text === MENU_BUTTONS.vote) {
    const view = buildVoteDisputeListView(bundle, user.id);
    await api.sendMessage({
      chatId,
      text: view.text,
      replyMarkup: view.replyMarkup
    });
    return;
  }

  if (text === "/notify" || text === MENU_BUTTONS.notify) {
    const nextState = toggleSubscriberNotifications(bundle, chatId);
    const statusLabel = nextState ? "включены 🔔" : "выключены 🔕";
    await api.sendMessage({
      chatId,
      text: `Личные оповещения о результатах и анонсах битв: <b>${statusLabel}</b>.`,
      replyMarkup: MAIN_REPLY_KEYBOARD
    });
    return;
  }

  await api.sendMessage({
    chatId,
    text: formatWelcomeMessage(subscriber.displayName, subscriber.notifyEnabled),
    replyMarkup: MAIN_REPLY_KEYBOARD
  });
}

async function handleCallbackQuery(
  bundle: AppDbBundle,
  api: TelegramApiClient,
  query: TelegramCallbackQuery
): Promise<void> {
  const data = query.data ?? "";
  const message = query.message;
  if (!message) {
    await api.answerCallbackQuery({ callbackQueryId: query.id });
    return;
  }

  const chatId = message.chat.id;
  const messageId = message.message_id;
  const { user } = ensureTelegramSubscriber(bundle, chatId, query.from);

  try {
    if (data.startsWith("g:")) {
      const code = data.slice(2);
      const view = getTournamentFullView("active", bundle);
      if (!view) {
        await api.answerCallbackQuery({
          callbackQueryId: query.id,
          text: "Активный турнир не найден"
        });
        return;
      }
      const text =
        code === "playoff"
          ? formatPlayoffBracket(view)
          : formatGroupTable(view, code);
      await api.editMessageText({
        chatId,
        messageId,
        text,
        replyMarkup: buildTablesInlineKeyboard(code)
      });
      await api.answerCallbackQuery({ callbackQueryId: query.id });
      return;
    }

    if (data.startsWith("h:p:")) {
      const page = Number.parseInt(data.slice(4), 10) || 0;
      const heroes = getSortedHeroes(bundle);
      const pageView = formatHeroesPage(heroes, page);
      await api.editMessageText({
        chatId,
        messageId,
        text: pageView.text,
        replyMarkup: pageView.replyMarkup
      });
      await api.answerCallbackQuery({ callbackQueryId: query.id });
      return;
    }

    if (data.startsWith("h:v:")) {
      const parts = data.split(":");
      const heroId = parts[2] ?? "";
      const returnPage = Number.parseInt(parts[3] ?? "0", 10) || 0;
      const profile = getHeroProfileView(heroId, bundle);
      if (!profile) {
        await api.answerCallbackQuery({
          callbackQueryId: query.id,
          text: "Герой не найден",
          showAlert: true
        });
        return;
      }
      const detail = formatHeroDetail(
        profile.hero,
        profile.dominants,
        profile.appeals,
        profile.rank,
        returnPage
      );
      await api.editMessageText({
        chatId,
        messageId,
        text: detail.text,
        replyMarkup: detail.replyMarkup
      });
      await api.answerCallbackQuery({ callbackQueryId: query.id });
      return;
    }

    if (data === "v:billboard") {
      const home = getHomePortalData(bundle);
      const formatted = formatBillboard(home);
      await api.editMessageText({
        chatId,
        messageId,
        text: formatted.text,
        replyMarkup: formatted.replyMarkup
      });
      await api.answerCallbackQuery({ callbackQueryId: query.id });
      return;
    }

    if (data === "v:list") {
      const view = buildVoteDisputeListView(bundle, user.id);
      await api.editMessageText({
        chatId,
        messageId,
        text: view.text,
        replyMarkup: view.replyMarkup
      });
      await api.answerCallbackQuery({ callbackQueryId: query.id });
      return;
    }

    if (data.startsWith("v:d:")) {
      const idx = Number.parseInt(data.slice(4), 10);
      const openCards = getOpenVotingCards(bundle);
      const card = openCards[idx];
      if (!card || !card.heroA || !card.heroB) {
        await api.answerCallbackQuery({
          callbackQueryId: query.id,
          text: "Пара недоступна для голосования",
          showAlert: true
        });
        return;
      }
      voteSessions.set(String(chatId), { disputeId: card.dispute.id });
      const stepView = buildVoteHeroStepView(card);
      await api.editMessageText({
        chatId,
        messageId,
        text: stepView.text,
        replyMarkup: stepView.replyMarkup
      });
      await api.answerCallbackQuery({ callbackQueryId: query.id });
      return;
    }

    if (data === "v:back:hero") {
      const session = voteSessions.get(String(chatId));
      const protocol = session
        ? getDisputeProtocolView(session.disputeId, bundle)
        : null;
      if (!protocol || !protocol.card.heroA || !protocol.card.heroB) {
        const listView = buildVoteDisputeListView(bundle, user.id);
        await api.editMessageText({
          chatId,
          messageId,
          text: listView.text,
          replyMarkup: listView.replyMarkup
        });
        await api.answerCallbackQuery({ callbackQueryId: query.id });
        return;
      }
      const stepView = buildVoteHeroStepView(protocol.card);
      await api.editMessageText({
        chatId,
        messageId,
        text: stepView.text,
        replyMarkup: stepView.replyMarkup
      });
      await api.answerCallbackQuery({ callbackQueryId: query.id });
      return;
    }

    if (data === "v:h:A" || data === "v:h:B") {
      const side: "A" | "B" = data === "v:h:A" ? "A" : "B";
      const session = voteSessions.get(String(chatId));
      const protocol = session
        ? getDisputeProtocolView(session.disputeId, bundle)
        : null;
      if (!protocol || !protocol.card.heroA || !protocol.card.heroB) {
        await api.answerCallbackQuery({
          callbackQueryId: query.id,
          text: "Сначала выберите диспут",
          showAlert: true
        });
        return;
      }
      voteSessions.set(String(chatId), {
        disputeId: protocol.card.dispute.id,
        side
      });
      const stepView = buildVoteSkillStepView(protocol.card, side);
      await api.editMessageText({
        chatId,
        messageId,
        text: stepView.text,
        replyMarkup: stepView.replyMarkup
      });
      await api.answerCallbackQuery({ callbackQueryId: query.id });
      return;
    }

    if (data.startsWith("v:s:")) {
      const skillIdx = Number.parseInt(data.slice(4), 10);
      const session = voteSessions.get(String(chatId));
      const protocol =
        session && session.side
          ? getDisputeProtocolView(session.disputeId, bundle)
          : null;
      if (!protocol || !session?.side || !protocol.card.heroA || !protocol.card.heroB) {
        await api.answerCallbackQuery({
          callbackQueryId: query.id,
          text: "Сначала выберите сторону спора",
          showAlert: true
        });
        return;
      }
      const statStep = buildVoteStatStepView(protocol.card, session.side, skillIdx);
      if (!statStep) {
        await api.answerCallbackQuery({
          callbackQueryId: query.id,
          text: "Навык не найден",
          showAlert: true
        });
        return;
      }
      voteSessions.set(String(chatId), {
        disputeId: protocol.card.dispute.id,
        side: session.side,
        skillId: statStep.skillId
      });
      await api.editMessageText({
        chatId,
        messageId,
        text: statStep.text,
        replyMarkup: statStep.replyMarkup
      });
      await api.answerCallbackQuery({ callbackQueryId: query.id });
      return;
    }

    if (data === "v:c:primary" || data === "v:c:secondary") {
      const stat: SkillStatKind = data === "v:c:secondary" ? "secondary" : "primary";
      const session = voteSessions.get(String(chatId));
      const protocol =
        session?.disputeId && session.side && session.skillId
          ? getDisputeProtocolView(session.disputeId, bundle)
          : null;

      if (!protocol || !session?.side || !session.skillId) {
        await api.answerCallbackQuery({
          callbackQueryId: query.id,
          text: "Сессия голосования истекла, выберите пару заново",
          showAlert: true
        });
        return;
      }

      const targetHero =
        session.side === "A" ? protocol.card.heroA : protocol.card.heroB;
      if (!targetHero) {
        await api.answerCallbackQuery({
          callbackQueryId: query.id,
          text: "Герой пары ещё не определён",
          showAlert: true
        });
        return;
      }

      try {
        castDisputeBallot(bundle, {
          disputeId: session.disputeId,
          userId: user.id,
          heroId: targetHero.id,
          skillId: session.skillId,
          stat,
          weight: 1
        });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Ошибка записи бюллетеня";
        await api.answerCallbackQuery({
          callbackQueryId: query.id,
          text: errMsg,
          showAlert: true
        });
        return;
      }

      const updated = getDisputeProtocolView(session.disputeId, bundle)!;
      const chosenSkill = [
        ...updated.card.skillsA,
        ...updated.card.skillsB
      ].find((s) => s.id === session.skillId);
      const statTitle =
        stat === "primary"
          ? "Первичная (Острота / Твёрдость)"
          : "Вторичная (Глубина / Находчивость)";

      const shiftLines = updated.card.voteSnapshots.map((snap) => {
        const heroName =
          snap.heroId === updated.card.heroA?.id
            ? updated.card.heroA?.name
            : updated.card.heroB?.name;
        return `• ${escapeHtml(heroName ?? snap.heroId)} — ${escapeHtml(snap.skill.title)} (${snap.stat === "primary" ? "I" : "II"}): <b>+${snap.appliedBonus}</b> (W=${snap.totalWeight})`;
      });

      const confirmText = [
        `✅ <b>Бюллетень секунданта записан!</b>`,
        ``,
        `Диспут: <b>${escapeHtml(updated.card.heroA?.name ?? "")} vs ${escapeHtml(updated.card.heroB?.name ?? "")}</b> (${updated.card.dispute.scheduledDate})`,
        `Поддержан герой: <b>${escapeHtml(targetHero.name)}</b>`,
        `Навык: <b>${escapeHtml(chosenSkill?.title ?? session.skillId)}</b>`,
        `Характеристика: <b>${statTitle}</b>`,
        `Всего голосов в матче: <b>${updated.card.liveBallotsCount}</b>`,
        ...(shiftLines.length > 0
          ? [``, `<b>Текущий сдвиг характеристик толпой:</b>`, ...shiftLines]
          : [])
      ].join("\n");

      await api.editMessageText({
        chatId,
        messageId,
        text: confirmText,
        replyMarkup: {
          inline_keyboard: [
            [{ text: "🔄 Изменить выбор в этом матче", callback_data: "v:back:hero" }],
            [{ text: "🗳 К другим открытым матчам", callback_data: "v:list" }]
          ]
        }
      });
      await api.answerCallbackQuery({
        callbackQueryId: query.id,
        text: "Бюллетень учтён!"
      });
      return;
    }

    await api.answerCallbackQuery({ callbackQueryId: query.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes("message is not modified")) {
      console.warn(`[bot] Ошибка обработки callback (${data}): ${msg}`);
    }
    await api
      .answerCallbackQuery({ callbackQueryId: query.id })
      .catch(() => undefined);
  }
}
