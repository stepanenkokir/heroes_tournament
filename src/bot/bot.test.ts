import { describe, expect, it } from "vitest";
import { createDbBundle } from "../db/client";
import { addDaysIso } from "../db/dates";
import { seedFullPortalDatabase, syncPortalTimeline } from "../db/engine";
import {
  disputeVotesTable,
  telegramOutboundTable,
  telegramSubscribersTable
} from "../db/schema";
import { MENU_BUTTONS } from "./formatters";
import { handleTelegramUpdate } from "./handlers";
import { syncAndBroadcastDisputes } from "./notifier";
import type {
  InlineKeyboardMarkup,
  ReplyMarkup,
  TelegramApiClient,
  TelegramMessage
} from "./telegram-api";

class FakeTelegramApi {
  public sentMessages: Array<{
    chatId: number | string;
    text: string;
    replyMarkup?: ReplyMarkup;
  }> = [];

  public editedMessages: Array<{
    chatId: number | string;
    messageId: number;
    text: string;
    replyMarkup?: InlineKeyboardMarkup;
  }> = [];

  public answeredCallbacks: Array<{
    callbackQueryId: string;
    text?: string;
    showAlert?: boolean;
  }> = [];

  async sendMessage(params: {
    chatId: number | string;
    text: string;
    replyMarkup?: ReplyMarkup;
  }): Promise<TelegramMessage> {
    this.sentMessages.push(params);
    return {
      message_id: this.sentMessages.length,
      chat: { id: Number(params.chatId) || 1, type: "private" },
      date: Math.floor(Date.now() / 1000),
      text: params.text
    };
  }

  async editMessageText(params: {
    chatId: number | string;
    messageId: number;
    text: string;
    replyMarkup?: InlineKeyboardMarkup;
  }): Promise<boolean> {
    this.editedMessages.push(params);
    return true;
  }

  async answerCallbackQuery(params: {
    callbackQueryId: string;
    text?: string;
    showAlert?: boolean;
  }): Promise<boolean> {
    this.answeredCallbacks.push(params);
    return true;
  }
}

describe("Telegram bot handlers, voting and notifications", () => {
  it("links subscriber on /start, serves tables, hero cards, casts ballot, and broadcasts transitions", async () => {
    const bundle = createDbBundle(":memory:");
    const baseDate = "2026-03-10";
    seedFullPortalDatabase(bundle, baseDate);

    const fakeApi = new FakeTelegramApi();
    const api = fakeApi as unknown as TelegramApiClient;
    const chatId = 777001;
    const tgUser = {
      id: chatId,
      is_bot: false,
      first_name: "Иван",
      username: "ivan_sec"
    };

    // 1. /start registers subscriber and OAuth user
    await handleTelegramUpdate(bundle, api, {
      update_id: 1,
      message: {
        message_id: 10,
        from: tgUser,
        chat: { id: chatId, type: "private" },
        date: 1700000000,
        text: "/start"
      }
    });

    const subs = bundle.db.select().from(telegramSubscribersTable).all();
    expect(subs.length).toBe(1);
    expect(subs[0]?.chatId).toBe(String(chatId));
    expect(subs[0]?.notifyEnabled).toBe(true);
    expect(fakeApi.sentMessages.at(-1)?.text).toContain("Академия риторического диспута");

    // 2. Tournament tables menu & callback switch to Group B and Playoff
    await handleTelegramUpdate(bundle, api, {
      update_id: 2,
      message: {
        message_id: 11,
        from: tgUser,
        chat: { id: chatId, type: "private" },
        date: 1700000001,
        text: MENU_BUTTONS.tables
      }
    });
    expect(fakeApi.sentMessages.at(-1)?.text).toContain("Группа A · Турнирная таблица");

    await handleTelegramUpdate(bundle, api, {
      update_id: 3,
      callback_query: {
        id: "cb-1",
        from: tgUser,
        message: {
          message_id: 2,
          chat: { id: chatId, type: "private" },
          date: 1700000002
        },
        data: "g:playoff"
      }
    });
    expect(fakeApi.editedMessages.at(-1)?.text).toContain("Сетка плей-офф");

    // 3. Hero description by choice
    await handleTelegramUpdate(bundle, api, {
      update_id: 4,
      callback_query: {
        id: "cb-2",
        from: tgUser,
        message: {
          message_id: 3,
          chat: { id: chatId, type: "private" },
          date: 1700000003
        },
        data: "h:v:odysseus:0"
      }
    });
    expect(fakeApi.editedMessages.at(-1)?.text).toContain("Одиссей");
    expect(fakeApi.editedMessages.at(-1)?.text).toContain("5 Доминант");
    expect(fakeApi.editedMessages.at(-1)?.text).toContain("5 Апелляций");

    // 4. Step-by-step ballot casting in Telegram
    await handleTelegramUpdate(bundle, api, {
      update_id: 5,
      message: {
        message_id: 12,
        from: tgUser,
        chat: { id: chatId, type: "private" },
        date: 1700000004,
        text: MENU_BUTTONS.vote
      }
    });
    expect(fakeApi.sentMessages.at(-1)?.text).toContain("Доступные пары для бюллетеня");

    await handleTelegramUpdate(bundle, api, {
      update_id: 6,
      callback_query: {
        id: "cb-3",
        from: tgUser,
        message: {
          message_id: 4,
          chat: { id: chatId, type: "private" },
          date: 1700000005
        },
        data: "v:d:0"
      }
    });
    expect(fakeApi.editedMessages.at(-1)?.text).toContain("Шаг 1 из 3");

    await handleTelegramUpdate(bundle, api, {
      update_id: 7,
      callback_query: {
        id: "cb-4",
        from: tgUser,
        message: {
          message_id: 4,
          chat: { id: chatId, type: "private" },
          date: 1700000006
        },
        data: "v:h:A"
      }
    });
    expect(fakeApi.editedMessages.at(-1)?.text).toContain("Шаг 2 из 3");

    await handleTelegramUpdate(bundle, api, {
      update_id: 8,
      callback_query: {
        id: "cb-5",
        from: tgUser,
        message: {
          message_id: 4,
          chat: { id: chatId, type: "private" },
          date: 1700000007
        },
        data: "v:s:0"
      }
    });
    expect(fakeApi.editedMessages.at(-1)?.text).toContain("Шаг 3 из 3");

    await handleTelegramUpdate(bundle, api, {
      update_id: 9,
      callback_query: {
        id: "cb-6",
        from: tgUser,
        message: {
          message_id: 4,
          chat: { id: chatId, type: "private" },
          date: 1700000008
        },
        data: "v:c:primary"
      }
    });
    expect(fakeApi.editedMessages.at(-1)?.text).toContain("Бюллетень секунданта записан");

    const votes = bundle.db.select().from(disputeVotesTable).all();
    expect(votes.some((v) => v.userId === subs[0]?.userId)).toBe(true);

    // 5. Initial sync seeds outbound log and sends one-time digest
    const beforeBroadcastCount = fakeApi.sentMessages.length;
    const firstSync = await syncAndBroadcastDisputes(bundle, api, "@heroes_channel", baseDate);
    expect(firstSync.resultsSent).toBe(0);
    expect(firstSync.announcesSent).toBe(0);
    // Sent to channel + 1 subscriber
    expect(fakeApi.sentMessages.length - beforeBroadcastCount).toBe(2);

    const outboundAfterInit = bundle.db.select().from(telegramOutboundTable).all();
    expect(outboundAfterInit.length).toBeGreaterThan(10);

    // 6. Advancing timeline by 1 day completes 4 group disputes and announces 4 next disputes
    const nextDay = addDaysIso(baseDate, 1);
    const secondSync = await syncAndBroadcastDisputes(bundle, api, "@heroes_channel", nextDay);
    expect(secondSync.resultsSent).toBe(4);
    expect(secondSync.announcesSent).toBe(4);

    // 7. Re-running does not send duplicates
    const thirdSync = await syncAndBroadcastDisputes(bundle, api, "@heroes_channel", nextDay);
    expect(thirdSync.resultsSent).toBe(0);
    expect(thirdSync.announcesSent).toBe(0);
  });
});
