import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

import { agencySlugFromToken } from "@/lib/auth/token-claims";
import { siteCacheTag } from "@/lib/site-cache";

/**
 * Expires the cached public site of the agency the caller is signed in to.
 * The slug comes from the session cookie, never from the request body, so a
 * caller can only refresh their own agency's site.
 */
export async function POST(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const agencySlug = token ? agencySlugFromToken(token) : null;
  if (agencySlug) {
    // expire: 0 — the next visitor gets fresh data, not the stale copy.
    revalidateTag(siteCacheTag(agencySlug), { expire: 0 });
  }
  return new Response(null, { status: 204 });
}
