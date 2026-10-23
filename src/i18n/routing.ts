import { defineRouting } from "next-intl/routing";

import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES } from "./config";

/**
 * The public site's routing: /terms in Spanish, /en/terms in English. The
 * rewriting itself happens in src/proxy.ts (it also decides which host serves
 * what); this only tells next-intl's Link and router how to build URLs.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  localeCookie: { name: LOCALE_COOKIE, sameSite: "lax", maxAge: 60 * 60 * 24 * 365 },
});
