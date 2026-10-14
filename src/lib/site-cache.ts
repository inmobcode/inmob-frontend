// The agency's public site (/page/[agencySlug]) reads the agency, its listing
// and each property from the API. Those reads are cached by Next for a few
// minutes under one tag per agency, so visitors don't wait on the API; the
// dashboard expires the tag after every save (see query-provider.tsx and
// app/api/site-cache/route.ts), so agents still see their changes at once.

/** How long a cached read lives when nothing expires it first. */
export const SITE_CACHE_SECONDS = 300;

export function siteCacheTag(agencySlug: string) {
  return `site:${agencySlug}`;
}

/** The `next` fetch options for a read that belongs to an agency's public site. */
export function siteCache(agencySlug: string) {
  return { next: { revalidate: SITE_CACHE_SECONDS, tags: [siteCacheTag(agencySlug)] } };
}

/** Expires the signed-in agency's cached site. Fire-and-forget: a failure only means a few minutes of staleness. */
export function refreshSiteCache() {
  fetch("/api/site-cache", { method: "POST", keepalive: true }).catch(() => {});
}
