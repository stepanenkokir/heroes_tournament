import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getGlobalDbBundle } from "@/db/client";
import { submitUserProposal } from "@/db/engine";
import { USER_COOKIE, verifyUserSession } from "@/auth-cookie";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = verifyUserSession(cookieStore.get(USER_COOKIE)?.value);

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Требуется авторизация" },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    kind?: "hero" | "skill";
    targetHeroId?: string | null;
    proposedName?: string;
    originOrDomain?: string;
    description?: string;
    publicDomainAttested?: boolean;
    licenseGranted?: boolean;
  };

  if (!body.proposedName?.trim() || !body.originOrDomain?.trim() || !body.description?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Заполните все поля заявки" },
      { status: 400 }
    );
  }

  try {
    const bundle = getGlobalDbBundle();
    const submission = submitUserProposal(bundle, {
      userId,
      kind: body.kind === "skill" ? "skill" : "hero",
      targetHeroId: body.targetHeroId ?? null,
      proposedName: body.proposedName,
      originOrDomain: body.originOrDomain,
      description: body.description,
      publicDomainAttested: Boolean(body.publicDomainAttested),
      licenseGranted: Boolean(body.licenseGranted)
    });
    return NextResponse.json({ ok: true, submission });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ошибка отправки заявки";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
