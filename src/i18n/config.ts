/**
 * The languages Tivvu speaks. Spanish is the base: its URLs carry no prefix
 * (/terms), every other language does (/en/terms). The dashboard never has a
 * prefix: it follows the person's choice, kept in LOCALE_COOKIE.
 */
export const LOCALES = ["es", "en", "pt", "fr", "de", "it", "el", "hr"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

/** Set when someone picks a language; read by the proxy and the dashboard. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Each language in its own words, for the language pickers. */
export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  el: "Ελληνικά",
  hr: "Hrvatski",
};

/** The BCP 47 tag used to format dates, numbers and money in each language. */
export const LOCALE_TAGS: Record<Locale, string> = {
  es: "es-AR",
  en: "en-GB",
  pt: "pt-PT",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  el: "el-GR",
  hr: "hr-HR",
};

/** Open Graph wants language_TERRITORY. */
export const OG_LOCALES: Record<Locale, string> = {
  es: "es_AR",
  en: "en_GB",
  pt: "pt_PT",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
  el: "el_GR",
  hr: "hr_HR",
};

/**
 * The folder the localized site lives in (app/intl/[locale]). Nobody sees it:
 * the proxy rewrites /en/terms to /intl/en/terms.
 */
export const INTL_SEGMENT = "intl";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** "/terms" in a language: unprefixed in Spanish, "/en/terms" otherwise. */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** The best supported language for an Accept-Language header, or null. */
export function matchAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((param) => param.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}

/**
 * Countries whose people read one of our languages. Switzerland and Belgium are
 * left out on purpose: several languages are spoken there, so the browser decides.
 */
const COUNTRY_LOCALES: Record<Locale, readonly string[]> = {
  es: ["AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "ES", "GT", "HN", "MX", "NI", "PA", "PE", "PR", "PY", "SV", "UY", "VE"],
  en: [],
  pt: ["AO", "BR", "CV", "MZ", "PT"],
  fr: ["FR", "LU", "MC"],
  de: ["AT", "DE", "LI"],
  it: ["IT", "SM", "VA"],
  el: ["CY", "GR"],
  hr: ["HR"],
};

const LOCALE_BY_COUNTRY = new Map<string, Locale>(
  (Object.entries(COUNTRY_LOCALES) as [Locale, readonly string[]][]).flatMap(([locale, countries]) =>
    countries.map((country) => [country, locale] as const),
  ),
);

/** Headers that hosts and CDNs fill with the visitor's country, from their IP. */
const COUNTRY_HEADERS = ["x-vercel-ip-country", "cf-ipcountry", "cloudfront-viewer-country", "x-country-code"];

/** The ISO country the request comes from, or null when the host doesn't say (local dev, unknown IPs). */
export function countryOf(headers: { get(name: string): string | null }): string | null {
  for (const name of COUNTRY_HEADERS) {
    const value = headers.get(name)?.trim().toUpperCase();
    // Cloudflare sends XX (unknown) and T1 (Tor) instead of a country.
    if (value && /^[A-Z]{2}$/.test(value) && value !== "XX" && value !== "T1") return value;
  }
  return null;
}

/**
 * The language to show someone who hasn't picked one: their country first
 * (from their IP), then their browser. A known country with no language of
 * ours gets English; with no country at all (local dev) it's Spanish.
 */
export function detectLocale(headers: { get(name: string): string | null }): Locale {
  const country = countryOf(headers);
  const fromCountry = country ? LOCALE_BY_COUNTRY.get(country) : undefined;
  if (fromCountry) return fromCountry;
  const fromBrowser = matchAcceptLanguage(headers.get("accept-language"));
  if (fromBrowser) return fromBrowser;
  return country ? "en" : DEFAULT_LOCALE;
}
