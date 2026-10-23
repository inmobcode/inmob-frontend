import type { Messages } from "next-intl";

import { DEFAULT_LOCALE, type Locale } from "./config";

type Tree = { [key: string]: string | Tree };

const loaders: Record<Locale, () => Promise<Tree>> = {
  es: () => import("@/messages/es").then((module) => module.default),
  en: () => import("@/messages/en").then((module) => module.default),
  pt: () => import("@/messages/pt").then((module) => module.default),
  fr: () => import("@/messages/fr").then((module) => module.default),
  de: () => import("@/messages/de").then((module) => module.default),
  it: () => import("@/messages/it").then((module) => module.default),
  el: () => import("@/messages/el").then((module) => module.default),
  hr: () => import("@/messages/hr").then((module) => module.default),
};

/** `base` with everything `over` translates laid on top. */
function merge(base: Tree, over: Tree): Tree {
  const result: Tree = { ...base };
  for (const [key, value] of Object.entries(over)) {
    const current = result[key];
    result[key] = typeof value === "object" && typeof current === "object" ? merge(current, value) : value;
  }
  return result;
}

/**
 * A language's messages. Anything it hasn't translated yet falls back to the
 * Spanish text, so a missing key shows Spanish instead of breaking the page.
 */
export async function loadMessages(locale: Locale): Promise<Messages> {
  const base = await loaders[DEFAULT_LOCALE]();
  if (locale === DEFAULT_LOCALE) return base as unknown as Messages;
  return merge(base, await loaders[locale]()) as unknown as Messages;
}

/** Only the namespaces a client tree needs, so the browser doesn't download every screen's text. */
export function pickMessages<const K extends keyof Messages>(messages: Messages, namespaces: readonly K[]) {
  return Object.fromEntries(namespaces.map((key) => [key, messages[key]])) as Pick<Messages, K>;
}
