import { apiFetch } from "./client";

/** Slugs and timestamps for sitemap.xml and llms.txt: every agency site and its published listings. */
export interface SitemapUrls {
  agencies: { slug: string; name: string; updatedAt: string }[];
  properties: { agencySlug: string; slug: string; updatedAt: string }[];
}

export function getSitemapUrls() {
  return apiFetch<SitemapUrls>("/api/public/sitemap");
}
