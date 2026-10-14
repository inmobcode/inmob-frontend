import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { agencySlugFromToken } from "@/lib/auth/token-claims";

// Agency-scoped sections, reached as /:agencySlug/<section>/...
const DASHBOARD_SECTIONS = [
  "properties",
  "offers",
  "clients",
  "inquiries",
  "bookings",
  "services",
  "team",
  "settings",
  "profile",
];

// Route groups that must only be reached through the app subdomain: the auth
// flow, the dashboard itself (agency-scoped routes under "/[agencySlug]"),
// and the site editor. Everything else — the marketing landing page and the
// (public) group (agency sites, shared offer/booking/owner links) — stays on
// the apex domain.
const APP_ONLY_PREFIXES = ["/login", "/register", "/forgot-password", "/reset-password", "/auth", "/portal", "/inquiries"];

// The (public) and (legal) groups: reachable from either host, but these are
// the only paths allowed to stay on the apex domain unredirected.
const PUBLIC_ONLY_PREFIXES = ["/for-agencies", "/page", "/offer", "/booking", "/owner", "/terminos", "/privacidad"];

function isAppOnlyPath(pathname: string): boolean {
  if (pathname === "/") return false;
  if (APP_ONLY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }
  // Anything left over past the root is an agency-scoped dashboard route
  // (/[agencySlug]/properties, /[agencySlug]/settings, etc.)
  return !PUBLIC_ONLY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const bareHost = host.replace(/^www\./, "");
  const isAppHost = bareHost.startsWith("app.");

  // Dashboard-only paths requested on the apex domain go to the app
  // subdomain instead; cookies are host-only, so running the auth checks
  // below against the apex host would just bounce to /login needlessly.
  if (!isAppHost && isAppOnlyPath(pathname)) {
    const url = new URL(request.nextUrl);
    url.host = `app.${bareHost}`;
    return NextResponse.redirect(url, 308);
  }

  // The marketing landing page lives at "/" on the apex domain; the app
  // subdomain has nothing to show there, so send it to login (which itself
  // bounces to the dashboard if a session is already active).
  if (isAppHost && pathname === "/") {
    const url = new URL(request.nextUrl);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

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
  matcher: ["/((?!_next|api|favicon.ico|icon.svg|apple-icon.png).*)"],
};
