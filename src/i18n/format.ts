import { formatDistanceToNow } from "date-fns";
import { useLocale } from "next-intl";
import { useMemo } from "react";

import { LOCALE_TAGS, type Locale } from "./config";
import { DATE_LOCALES } from "./date-locales";

/** Date shapes used across Tivvu; each language orders and spells them its own way. */
const DATE_STYLES = {
  /** 5 de noviembre · 5 November */
  dayMonth: { day: "numeric", month: "long" },
  /** 5 nov · 5 Nov */
  dayMonthShort: { day: "numeric", month: "short" },
  /** jue, 5 de noviembre · Thu 5 November */
  weekdayDayMonth: { weekday: "short", day: "numeric", month: "long" },
  /** jue, 5 nov · Thu 5 Nov */
  weekdayDayMonthShort: { weekday: "short", day: "numeric", month: "short" },
  /** jueves, 5 de noviembre · Thursday 5 November */
  weekdayLong: { weekday: "long", day: "numeric", month: "long" },
  /** 5 de noviembre de 2026 · 5 November 2026 */
  long: { day: "numeric", month: "long", year: "numeric" },
  /** 5 nov 2026 · 5 Nov 2026 */
  medium: { day: "numeric", month: "short", year: "numeric" },
  /** 5 nov 2026, 14:30 */
  dateTime: { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" },
  /** 5 de noviembre, 14:30 */
  dayMonthTime: { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" },
  /** 14:30 */
  time: { hour: "2-digit", minute: "2-digit" },
  /** noviembre de 2026 · November 2026 */
  monthYear: { month: "long", year: "numeric" },
  /** jue · Thu */
  weekdayShort: { weekday: "short" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export type DateStyle = keyof typeof DATE_STYLES;

/**
 * Formatting in a language: numbers ("1.250.000" or "1,250,000"), money
 * ("EUR 650") and the date-fns locale for format() and friends. Plain function,
 * so Server Components can call it with useLocale() / getLocale().
 */
export function formatTools(locale: Locale) {
  const tag = LOCALE_TAGS[locale];
  const number = (value: number, options?: Intl.NumberFormatOptions) => value.toLocaleString(tag, options);
  return {
    locale,
    tag,
    dateLocale: DATE_LOCALES[locale],
    number,
    /** "hace 3 horas" · "3 hours ago". */
    ago: (value: Date | number) => formatDistanceToNow(value, { addSuffix: true, locale: DATE_LOCALES[locale] }),
    /** "hace 20 min", "hace 3 h", "ayer", "5 nov": short enough for a table cell. */
    shortAgo: (value: Date | number) => {
      const minutes = Math.max(0, Math.round((Date.now() - Number(value)) / 60_000));
      const relative = new Intl.RelativeTimeFormat(tag, { numeric: "auto", style: "short" });
      if (minutes < 60) return relative.format(-minutes, "minute");
      const hours = Math.round(minutes / 60);
      if (hours < 24) return relative.format(-hours, "hour");
      const days = Math.round(hours / 24);
      if (days < 7) return relative.format(-days, "day");
      return new Intl.DateTimeFormat(tag, DATE_STYLES.dayMonthShort).format(value);
    },
    /** A date in one of DATE_STYLES, e.g. date(d, "dayMonth") → "5 de noviembre". */
    date: (value: Date | number, style: DateStyle) => new Intl.DateTimeFormat(tag, DATE_STYLES[style]).format(value),
    /** "EUR 650": the code first, as everywhere in Tivvu. */
    money: (currency: string, value: number, options: Intl.NumberFormatOptions = { maximumFractionDigits: 0 }) =>
      `${currency} ${number(value, options)}`,
  };
}

/** formatTools() for the page's language, in Client Components. */
export function useFormat() {
  const locale = useLocale();
  return useMemo(() => formatTools(locale), [locale]);
}
