import { LOCALES, localePath, type Locale } from "@/i18n/config";

/**
 * Where the public site lives. Everything crawlable (the landing, the legal
 * pages, each agency's site and its listings) is served from the apex domain;
 * the dashboard runs on `app.` and is kept out of search engines.
 *
 * Canonical URLs, sitemap entries and Open Graph images all have to be
 * absolute, so they are built from here instead of the request's host: an
 * agency site answers on both hosts, and only one of them should be indexed.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tivvu.app").replace(/\/$/, "");

export const SITE_NAME = "Tivvu";

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** The public path of an agency's site. */
export function agencyPath(agencySlug: string) {
  return `/page/${agencySlug}`;
}

/** The public path of one of its listings. */
export function propertyPath(agencySlug: string, propertySlug: string) {
  return `/page/${agencySlug}/properties/${propertySlug}`;
}

/** The public path of its shareable availability calendar. */
export function availabilityPath(agencySlug: string) {
  return `/page/${agencySlug}/availability`;
}

/**
 * Canonical and hreflang links for a public page that exists in every language:
 * the canonical is this language's URL, and `languages` lists the others so
 * search engines show each person their own (x-default: the Spanish one).
 */
export function localizedAlternates(path: string, locale: Locale) {
  return {
    canonical: absoluteUrl(localePath(locale, path)),
    languages: {
      ...Object.fromEntries(LOCALES.map((other) => [other, absoluteUrl(localePath(other, path))])),
      "x-default": absoluteUrl(path),
    },
  };
}
