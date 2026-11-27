import { NextResponse } from "next/server";
import { LOCALE_COOKIE, parseLocale } from "@/i18n/locale";

function safeNextPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") {
    return "/";
  }
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  return value;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const rawLocale = form.get("locale");
  const locale = parseLocale(typeof rawLocale === "string" ? rawLocale : null);
  const destination = new URL(safeNextPath(form.get("next")), request.url);
  const response = NextResponse.redirect(destination, 303);
  if (locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax"
    });
  }
  return response;
}
