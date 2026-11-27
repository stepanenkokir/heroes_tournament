import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, negotiateLocale, type Locale } from "./locale";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const headerList = await headers();
  return negotiateLocale({
    cookie: jar.get(LOCALE_COOKIE)?.value,
    acceptLanguage: headerList.get("accept-language")
  });
}

export async function getRequestPath(): Promise<string> {
  const headerList = await headers();
  const path = headerList.get("x-ht-path");
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return "/";
  }
  return path;
}
