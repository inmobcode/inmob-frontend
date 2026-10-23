import type { MetadataRoute } from "next";

import { LOCALES, localePath } from "@/i18n/config";
import { getSitemapUrls } from "@/lib/api/sitemap";
import { absoluteUrl, agencyPath, propertyPath } from "@/lib/seo";

// Listings change through the day, but not by the minute: an hour-old sitemap
// is fine and keeps crawls off the API.
export const revalidate = 3600;

/** Every language's URL for a public path, so search engines show each person their own (hreflang). */
function alternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(LOCALES.map((locale) => [locale, absoluteUrl(localePath(locale, path))])),
      "x-default": absoluteUrl(path),
    },
  };
}

const STATIC: { path: string; changeFrequency: "monthly" | "yearly"; priority: number }[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/help", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

const STATIC_PAGES: MetadataRoute.Sitemap = STATIC.flatMap(({ path, changeFrequency, priority }) =>
  LOCALES.map((locale) => ({
    url: absoluteUrl(localePath(locale, path)),
    changeFrequency,
    priority,
    alternates: alternates(path),
  })),
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A sitemap that 500s is worse than one with only the pages we know by
  // heart: if the API is down, still hand the crawler the landing and legals.
  const urls = await getSitemapUrls().catch(() => null);
  if (!urls) return STATIC_PAGES;

  // Agency sites are listed once, at their unprefixed URL, with the other
  // languages as alternates: the language versions of thousands of listings
  // would multiply the sitemap without adding pages anyone searches for.
  return [
    ...STATIC_PAGES,
    ...urls.agencies.map((agency) => ({
      url: absoluteUrl(agencyPath(agency.slug)),
      lastModified: new Date(agency.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
      alternates: alternates(agencyPath(agency.slug)),
    })),
    ...urls.properties.map((property) => ({
      url: absoluteUrl(propertyPath(property.agencySlug, property.slug)),
      lastModified: new Date(property.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: alternates(propertyPath(property.agencySlug, property.slug)),
    })),
  ];
}
