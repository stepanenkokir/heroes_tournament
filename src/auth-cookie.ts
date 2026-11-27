import { createHmac, timingSafeEqual } from "node:crypto";

export const USER_COOKIE = "ht-user-id";

const SESSION_SECRET =
  process.env.HT_SESSION_SECRET ?? "heroes-tournament-local-hmac-secret-v1";

export function signUserSession(userId: string): string {
  const sig = createHmac("sha256", SESSION_SECRET).update(userId).digest("base64url");
  return `${userId}.${sig}`;
}

export function verifyUserSession(cookieValue: string | undefined | null): string | null {
  if (!cookieValue) {
    return null;
  }
  const dotIndex = cookieValue.lastIndexOf(".");
  if (dotIndex <= 0) {
    return null;
  }
  const userId = cookieValue.slice(0, dotIndex);
  const providedSig = cookieValue.slice(dotIndex + 1);
  const expectedSig = createHmac("sha256", SESSION_SECRET).update(userId).digest("base64url");

  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }
  return userId;
}
