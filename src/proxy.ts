import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEFAULT_LOCALE, detectLocale, INTL_SEGMENT, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { agencySlugFromToken } from "@/lib/auth/token-claims";

// Agency-scoped sections, reached as /:agencySlug/<section>/...
const DASHBOARD_SECTIONS = [
  "properties",
  "offers",
  "clients",
  "inquiries",
  "bookings",
  "services",
  "availability",
  "team",
  "settings",
  "profile",
  "portal",
  "welcome",
];

// Logged-in pages outside the agency-scoped tree (no slug segment): the dashboard docs.
const UNSCOPED_APP_PREFIXES = ["/docs"];

// Route groups that must only be reached through the app subdomain: the auth
// flow, the dashboard itself (agency-scoped routes under "/[agencySlug]",
// which now includes the site editor at "/[agencySlug]/portal") and the docs.
// Everything else — the marketing landing page and the (public) group (agency
// sites, shared offer/booking/owner links) — stays on the apex domain.
const APP_ONLY_PREFIXES = ["/login", "/register", "/forgot-password", "/reset-password", "/auth", "/docs", "/inquiries"];

// The (public) and (legal) groups: reachable from either host, but these are
// the only paths allowed to stay on the apex domain unredirected.
const PUBLIC_ONLY_PREFIXES = ["/landing-test", "/page", "/offer", "/booking", "/owner", "/terms", "/privacy", "/help"];

function isPublicPath(pathname: string): boolean {
  return pathname === "/" || PUBLIC_ONLY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isAppOnlyPath(pathname: string): boolean {
  if (pathname === "/") return false;
  if (APP_ONLY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }
  // Anything left over past the root is an agency-scoped dashboard route
  // (/[agencySlug]/properties, /[agencySlug]/settings, etc.)
  return !PUBLIC_ONLY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Passes the request through. On the `app.` host it also tells crawlers to
 * skip the response: the dashboard has nothing to index, and an agency site
 * answers on both hosts — only the apex copy should be in results.
 */
function pass(isAppHost: boolean) {
  const response = NextResponse.next();
  if (isAppHost) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

/**
 * Serves a public page (the landing, legal pages, an agency's site) from the
 * localized tree: /en/terms and /terms both land on app/intl/[locale]/terms.
 * The header lets next-intl know the language even where a page doesn't set it.
 */
function servePublic(request: NextRequest, locale: Locale, path: string, isAppHost: boolean) {
  const url = new URL(request.nextUrl);
  url.pathname = path === "/" ? `/${INTL_SEGMENT}/${locale}` : `/${INTL_SEGMENT}/${locale}${path}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("X-NEXT-INTL-LOCALE", locale);
  const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  if (isAppHost) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

/** The language someone reading "/" most likely wants: the one they picked before, else their country (from their IP), else their browser's. */
function preferredLocale(request: NextRequest): Locale {
  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;
  return detectLocale(request.headers);
}

/**
 * The language half of the proxy, for public pages only. Returns null when the
 * path isn't one (the dashboard, sign-in), so the rest of the proxy handles it.
 */
function localize(request: NextRequest, isAppHost: boolean): NextResponse | null {
  const { pathname } = request.nextUrl;
  const [, first = ""] = pathname.split("/");

  // The internal folder is never an address of its own.
  if (first === INTL_SEGMENT) {
    const url = new URL(request.nextUrl);
    const [, , locale, ...rest] = pathname.split("/");
    url.pathname = `${isLocale(locale) && locale !== DEFAULT_LOCALE ? `/${locale}` : ""}/${rest.join("/")}`.replace(/\/$/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) {
    const rest = pathname.slice(first.length + 1) || "/";
    // "/de/properties" can be an agency called "de": only claim the paths the
    // public site serves. A bare "/de" is the landing only on the apex domain.
    if (!isPublicPath(rest) || (rest === "/" && isAppHost)) return null;
    if (first === DEFAULT_LOCALE) {
      const url = new URL(request.nextUrl);
      url.pathname = rest;
      return NextResponse.redirect(url, 308);
    }
    return servePublic(request, first, rest, isAppHost);
  }

  if (!isPublicPath(pathname) || (pathname === "/" && isAppHost)) return null;

  // Only the landing guesses: someone arriving at "/" whose browser (or past
  // choice) is in another language goes to that version. Agency sites and
  // shared links keep the language they were sent in.
  if (pathname === "/") {
    const preferred = preferredLocale(request);
    if (preferred !== DEFAULT_LOCALE) {
      const url = new URL(request.nextUrl);
      url.pathname = `/${preferred}`;
      return NextResponse.redirect(url);
    }
  }
  return servePublic(request, DEFAULT_LOCALE, pathname, isAppHost);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const bareHost = host.replace(/^www\./, "");
  const isAppHost = bareHost.startsWith("app.");

  // Cookies don't cross from the apex to `app.`, so links from the public site
  // into the app carry ?lang=xx: remember it on this host and drop it.
  const lang = request.nextUrl.searchParams.get("lang");
  if (isLocale(lang)) {
    const url = new URL(request.nextUrl);
    url.searchParams.delete("lang");
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return response;
  }

  const localized = localize(request, isAppHost);
  if (localized) return localized;

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

  // These live outside the agency-scoped tree (no slug segment), so they
  // only need the plain "are you logged in" check, not slug-correction.
  if (UNSCOPED_APP_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return pass(isAppHost);
  }

  const [, agencySlug, section] = pathname.split("/");
  const isDashboardRoute = DASHBOARD_SECTIONS.includes(section);
  if (!isDashboardRoute) return pass(isAppHost);

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

  return pass(isAppHost);
}

export const config = {
  // docs-media: the docs' screenshots, fetched by the image optimizer without cookies.
  // robots/sitemap/llms/opengraph-image: generated files, not pages — without
  // this the catch-all below reads them as agency-scoped and sends them to
  // `app.`, where a crawler asking the apex domain for them would never follow.
  matcher: [
    "/((?!_next|api|docs-media|robots.txt|sitemap.xml|llms.txt|opengraph-image|favicon.ico|icon.svg|apple-icon.png).*)",
  ],
};
