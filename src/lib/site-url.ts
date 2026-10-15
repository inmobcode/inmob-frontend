/** Public origin of the site, for sitemaps and canonical URLs. Set NEXT_PUBLIC_SITE_URL per environment. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tivvo.app").replace(/\/$/, "");
