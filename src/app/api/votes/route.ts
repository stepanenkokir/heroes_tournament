import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getGlobalDbBundle } from "@/db/client";
import { castDisputeBallot } from "@/db/engine";
import type { SkillStatKind } from "@/domain";
import { USER_COOKIE, verifyUserSession } from "@/auth-cookie";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = verifyUserSession(cookieStore.get(USER_COOKIE)?.value);

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Требуется вход через OAuth в Личном кабинете" },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    disputeId?: string;
    heroId?: string;
    skillId?: string;
    stat?: SkillStatKind;
  };

  if (!body.disputeId || !body.heroId || !body.skillId) {
    return NextResponse.json(
      { ok: false, error: "Не указан диспут, герой или навык" },
      { status: 400 }
    );
  }

  const stat: SkillStatKind = body.stat === "secondary" ? "secondary" : "primary";

  try {
    const bundle = getGlobalDbBundle();
    const ballot = castDisputeBallot(bundle, {
      disputeId: body.disputeId,
      userId,
      heroId: body.heroId,
      skillId: body.skillId,
      stat,
      weight: 1
    });
    return NextResponse.json({ ok: true, ballot });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка записи голоса";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
