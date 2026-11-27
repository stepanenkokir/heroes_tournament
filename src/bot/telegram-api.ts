export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface InlineKeyboardButton {
  text: string;
  callback_data: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

export interface ReplyKeyboardButton {
  text: string;
}

export interface ReplyKeyboardMarkup {
  keyboard: ReplyKeyboardButton[][];
  resize_keyboard?: boolean;
  is_persistent?: boolean;
}

export type ReplyMarkup = InlineKeyboardMarkup | ReplyKeyboardMarkup;

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

export class TelegramApiClient {
  private readonly baseUrl: string;

  constructor(botToken: string) {
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  private async call<T>(method: string, payload?: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined
    });

    const data = (await response.json()) as TelegramApiResponse<T>;
    if (!data.ok || data.result === undefined) {
      throw new Error(
        `Telegram API ${method} failed (${data.error_code ?? response.status}): ${data.description ?? "Unknown error"}`
      );
    }
    return data.result;
  }

  async deleteWebhook(): Promise<boolean> {
    return this.call<boolean>("deleteWebhook", { drop_pending_updates: false });
  }

  async setMyCommands(
    commands: Array<{ command: string; description: string }>
  ): Promise<boolean> {
    return this.call<boolean>("setMyCommands", { commands });
  }

  async getUpdates(offset: number, timeoutSec: number): Promise<TelegramUpdate[]> {
    return this.call<TelegramUpdate[]>("getUpdates", {
      offset,
      timeout: timeoutSec,
      allowed_updates: ["message", "callback_query"]
    });
  }

  async sendMessage(params: {
    chatId: number | string;
    text: string;
    replyMarkup?: ReplyMarkup;
  }): Promise<TelegramMessage> {
    return this.call<TelegramMessage>("sendMessage", {
      chat_id: params.chatId,
      text: params.text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(params.replyMarkup ? { reply_markup: params.replyMarkup } : {})
    });
  }

  async editMessageText(params: {
    chatId: number | string;
    messageId: number;
    text: string;
    replyMarkup?: InlineKeyboardMarkup;
  }): Promise<TelegramMessage | boolean> {
    return this.call<TelegramMessage | boolean>("editMessageText", {
      chat_id: params.chatId,
      message_id: params.messageId,
      text: params.text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(params.replyMarkup ? { reply_markup: params.replyMarkup } : {})
    });
  }

  async answerCallbackQuery(params: {
    callbackQueryId: string;
    text?: string;
    showAlert?: boolean;
  }): Promise<boolean> {
    return this.call<boolean>("answerCallbackQuery", {
      callback_query_id: params.callbackQueryId,
      ...(params.text ? { text: params.text } : {}),
      ...(params.showAlert !== undefined ? { show_alert: params.showAlert } : {})
    });
  }
}
