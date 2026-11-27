import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { USER_COOKIE } from "@/auth-cookie";
import { getGlobalDbBundle } from "@/db/client";
import { upsertOAuthUser } from "@/db/engine";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    action?: "login" | "logout";
    provider?: "telegram" | "google" | "vk";
    handle?: string;
    displayName?: string;
  };

  const cookieStore = await cookies();

  if (body.action === "logout") {
    cookieStore.delete(USER_COOKIE);
    return NextResponse.json({ ok: true, user: null });
  }

  const provider =
    body.provider === "google" || body.provider === "vk" ? body.provider : "telegram";
  const currentUserId = cookieStore.get(USER_COOKIE)?.value;
  const cleanHandle = (body.handle ?? "").trim() || `${provider}_reader`;
  const cleanName = (body.displayName ?? "").trim() || cleanHandle;
  const providerAccountId = cleanHandle.toLowerCase().replace(/[^a-z0-9_@.-]/gi, "_");

  const bundle = getGlobalDbBundle();
  const user = upsertOAuthUser(bundle, {
    provider,
    providerAccountId,
    handle: cleanHandle,
    displayName: cleanName,
    userId: currentUserId
  });

  cookieStore.set(USER_COOKIE, user.id, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180
  });

  return NextResponse.json({ ok: true, user });
}
