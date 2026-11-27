import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALE_COOKIE, parseLocale } from "./i18n/locale";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const requested = parseLocale(url.searchParams.get("lang"));
  if (requested) {
    url.searchParams.delete("lang");
    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(LOCALE_COOKIE, requested, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax"
    });
    return redirect;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-ht-path", `${url.pathname}${url.search}`);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"]
};
