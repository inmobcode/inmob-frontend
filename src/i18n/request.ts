import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

import { detectLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { loadMessages } from "./messages";

/**
 * The public site gets its language from the URL (app/intl/[locale]); the
 * dashboard, which has no prefix, from the person's choice, else their country (IP) or browser.
 */
async function preferredLocale(): Promise<Locale> {
  const chosen = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;
  return detectLocale(await headers());
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : await preferredLocale();
  return {
    locale,
    messages: await loadMessages(locale),
  };
});
