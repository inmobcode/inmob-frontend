import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Agency-scoped sections, reached as /:agencySlug/<section>/...
const DASHBOARD_SECTIONS = [
  "properties",
  "offers",
  "clients",
  "inquiries",
  "bookings",
  "team",
  "settings",
  "profile",
];

/**
 * Reads the `agency_slug` claim without verifying the signature — this is
 * only ever used to redirect a stale URL to the agency the token is
 * currently scoped to. The actual tenancy check happens server-side in
 * Flask against the verified JWT; a forged claim here can't grant access to
 * anything, it would just send the browser to a URL whose API calls then
 * 403 against the agency the (verified) token really carries.
 */
function agencySlugFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json).agency_slug ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The portal editor lives outside the agency-scoped tree (no slug segment),
  // so it only needs the plain "are you logged in" check, not slug-correction.
  if (pathname === "/portal" || pathname.startsWith("/portal/")) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const [, agencySlug, section] = pathname.split("/");
  const isDashboardRoute = DASHBOARD_SECTIONS.includes(section);
  if (!isDashboardRoute) return NextResponse.next();

  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const activeSlug = agencySlugFromToken(token);
  if (activeSlug && activeSlug !== agencySlug) {
    const corrected = new URL(request.url);
    corrected.pathname = pathname.replace(`/${agencySlug}/`, `/${activeSlug}/`);
    return NextResponse.redirect(corrected);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:agencySlug/(properties|offers|clients|inquiries|bookings|team|settings|profile)/:path*",
    "/portal/:path*",
  ],
};
