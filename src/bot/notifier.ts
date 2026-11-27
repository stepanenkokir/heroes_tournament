import { asc, eq } from "drizzle-orm";
import type { AppDbBundle } from "../db/client";
import { getMoscowTodayIso } from "../db/dates";
import { syncPortalTimeline, upsertOAuthUser } from "../db/engine";
import {
  getDisputeProtocolView,
  getHomePortalData
} from "../db/queries";
import {
  disputesTable,
  telegramOutboundTable,
  telegramSubscribersTable,
  type usersTable
} from "../db/schema";
import {
  formatBillboard,
  formatDisputeAnnounceNotification,
  formatDisputeResultNotification
} from "./formatters";
import type { TelegramApiClient, TelegramUser } from "./telegram-api";

export interface SubscriberRecord {
  subscriber: typeof telegramSubscribersTable.$inferSelect;
  user: typeof usersTable.$inferSelect;
}

export function ensureTelegramSubscriber(
  bundle: AppDbBundle,
  chatId: number | string,
  tgUser: TelegramUser
): SubscriberRecord {
  const { db } = bundle;
  const chatIdStr = String(chatId);
  const nowIso = getMoscowTodayIso();
  const providerAccountId = String(tgUser.id);
  const handle = tgUser.username ? `@${tgUser.username}` : `tg_${tgUser.id}`;
  const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ").trim();
  const displayName = fullName || handle;

  const user = upsertOAuthUser(bundle, {
    provider: "telegram",
    providerAccountId,
    handle,
    displayName,
    nowIso
  });

  const existing = db
    .select()
    .from(telegramSubscribersTable)
    .where(eq(telegramSubscribersTable.chatId, chatIdStr))
    .get();

  if (existing) {
    db.update(telegramSubscribersTable)
      .set({
        userId: user.id,
        username: tgUser.username ?? null,
        displayName
      })
      .where(eq(telegramSubscribersTable.chatId, chatIdStr))
      .run();
  } else {
    db.insert(telegramSubscribersTable)
      .values({
        chatId: chatIdStr,
        userId: user.id,
        username: tgUser.username ?? null,
        displayName,
        notifyEnabled: true,
        linkedAt: nowIso
      })
      .run();
  }

  const subscriber = db
    .select()
    .from(telegramSubscribersTable)
    .where(eq(telegramSubscribersTable.chatId, chatIdStr))
    .get()!;

  return { subscriber, user };
}

export function toggleSubscriberNotifications(
  bundle: AppDbBundle,
  chatId: number | string
): boolean | null {
  const { db } = bundle;
  const chatIdStr = String(chatId);
  const existing = db
    .select()
    .from(telegramSubscribersTable)
    .where(eq(telegramSubscribersTable.chatId, chatIdStr))
    .get();

  if (!existing) {
    return null;
  }

  const nextValue = !existing.notifyEnabled;
  db.update(telegramSubscribersTable)
    .set({ notifyEnabled: nextValue })
    .where(eq(telegramSubscribersTable.chatId, chatIdStr))
    .run();
  return nextValue;
}

function hasOutboundRecord(bundle: AppDbBundle, id: string): boolean {
  const row = bundle.db
    .select()
    .from(telegramOutboundTable)
    .where(eq(telegramOutboundTable.id, id))
    .get();
  return Boolean(row);
}

function recordOutbound(
  bundle: AppDbBundle,
  id: string,
  kind: "result" | "announce" | "digest",
  disputeId: string,
  sentAt: string
): void {
  bundle.db
    .insert(telegramOutboundTable)
    .values({ id, kind, disputeId, sentAt })
    .onConflictDoNothing()
    .run();
}

async function broadcastMessage(
  bundle: AppDbBundle,
  api: TelegramApiClient,
  channelId: string | null,
  text: string
): Promise<void> {
  const targets: string[] = [];
  if (channelId) {
    targets.push(channelId);
  }

  const subscribers = bundle.db
    .select()
    .from(telegramSubscribersTable)
    .all()
    .filter((s) => s.notifyEnabled);

  for (const sub of subscribers) {
    if (!targets.includes(sub.chatId)) {
      targets.push(sub.chatId);
    }
  }

  for (const targetChatId of targets) {
    try {
      await api.sendMessage({ chatId: targetChatId, text });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[bot] Не удалось отправить сообщение в чат ${targetChatId}: ${msg}`);
    }
  }
}

/**
 * Синхронизирует таймлайн турнира (completed / announced) и рассылает новые итоги и анонсы.
 * При первом запуске фиксирует уже существующие в БД диспуты без массовой рассылки архива
 * и один раз публикует дайджест текущей афиши.
 */
export async function syncAndBroadcastDisputes(
  bundle: AppDbBundle,
  api: TelegramApiClient,
  channelId: string | null,
  asOfDateIso: string = getMoscowTodayIso()
): Promise<{ resultsSent: number; announcesSent: number }> {
  const todayIso = asOfDateIso;
  syncPortalTimeline(bundle, todayIso);

  const existingOutboundCount = bundle.db.select().from(telegramOutboundTable).all().length;
  const allDisputes = bundle.db
    .select()
    .from(disputesTable)
    .orderBy(asc(disputesTable.scheduledDate), asc(disputesTable.matchOrder))
    .all();

  if (existingOutboundCount === 0) {
    const tx = bundle.sqlite.transaction(() => {
      for (const d of allDisputes) {
        if (d.status === "completed") {
          recordOutbound(bundle, `result:${d.id}`, "result", d.id, todayIso);
          recordOutbound(bundle, `announce:${d.id}`, "announce", d.id, todayIso);
        } else if (d.status === "announced") {
          recordOutbound(bundle, `announce:${d.id}`, "announce", d.id, todayIso);
        }
      }
      recordOutbound(bundle, `digest:${todayIso}`, "digest", todayIso, todayIso);
    });
    tx();

    const home = getHomePortalData(bundle);
    const { text } = formatBillboard(home);
    await broadcastMessage(bundle, api, channelId, text);
    return { resultsSent: 0, announcesSent: 0 };
  }

  let resultsSent = 0;
  let announcesSent = 0;

  for (const dispute of allDisputes) {
    if (dispute.status === "completed") {
      const outId = `result:${dispute.id}`;
      if (!hasOutboundRecord(bundle, outId)) {
        const protocol = getDisputeProtocolView(dispute.id, bundle);
        if (protocol && protocol.card.heroA && protocol.card.heroB) {
          const commentaryRu =
            protocol.commentaries.find((c) => c.locale === "ru") ?? null;
          const text = formatDisputeResultNotification({
            card: protocol.card,
            eloA: protocol.eloA,
            eloB: protocol.eloB,
            commentaryRu
          });
          await broadcastMessage(bundle, api, channelId, text);
          resultsSent += 1;
        }
        recordOutbound(bundle, outId, "result", dispute.id, todayIso);
      }
    } else if (dispute.status === "announced") {
      const outId = `announce:${dispute.id}`;
      if (!hasOutboundRecord(bundle, outId)) {
        const protocol = getDisputeProtocolView(dispute.id, bundle);
        if (protocol && protocol.card.heroA && protocol.card.heroB) {
          const text = formatDisputeAnnounceNotification(protocol.card);
          await broadcastMessage(bundle, api, channelId, text);
          announcesSent += 1;
        }
        recordOutbound(bundle, outId, "announce", dispute.id, todayIso);
      }
    }
  }

  return { resultsSent, announcesSent };
}
