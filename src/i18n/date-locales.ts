import type { Locale as DateLocale } from "date-fns";
import { de, el, enGB, es, fr, hr, it, pt } from "date-fns/locale";

import type { Locale } from "./config";

/** The date-fns locale behind each language (month and weekday names, week start). */
export const DATE_LOCALES: Record<Locale, DateLocale> = { es, en: enGB, pt, fr, de, it, el, hr };
