import type { MetadataRoute } from "next";

import { getSitemapUrls } from "@/lib/api/sitemap";
import { absoluteUrl, agencyPath, propertyPath } from "@/lib/seo";

// Listings change through the day, but not by the minute: an hour-old sitemap
// is fine and keeps crawls off the API.
export const revalidate = 3600;

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
  { url: absoluteUrl("/help"), changeFrequency: "monthly", priority: 0.5 },
  { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A sitemap that 500s is worse than one with only the pages we know by
  // heart: if the API is down, still hand the crawler the landing and legals.
  const urls = await getSitemapUrls().catch(() => null);
  if (!urls) return STATIC_PAGES;

  return [
    ...STATIC_PAGES,
    ...urls.agencies.map((agency) => ({
      url: absoluteUrl(agencyPath(agency.slug)),
      lastModified: new Date(agency.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...urls.properties.map((property) => ({
      url: absoluteUrl(propertyPath(property.agencySlug, property.slug)),
      lastModified: new Date(property.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
