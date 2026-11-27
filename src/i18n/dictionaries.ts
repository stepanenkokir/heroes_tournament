import { en } from "./en";
import { es } from "./es";
import type { Locale } from "./locale";
import type { Messages } from "./messages";
import { ru } from "./ru";

export const DICTIONARIES: Record<Locale, Messages> = { en, es, ru };

export function getMessages(locale: Locale): Messages {
  return DICTIONARIES[locale];
}
