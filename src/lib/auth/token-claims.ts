/**
 * Reads the `agency_slug` claim without verifying the signature — this is
 * only ever used to pick which agency a request is about (redirecting a stale
 * URL, refreshing that agency's cached site). The actual tenancy check
 * happens server-side in Flask against the verified JWT; a forged claim here
 * can't grant access to anything.
 */
export function agencySlugFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json).agency_slug ?? null;
  } catch {
    return null;
  }
}
