import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DASHBOARD_PREFIXES = [
  "/properties",
  "/offers",
  "/clients",
  "/inquiries",
  "/bookings",
  "/team",
  "/portal",
  "/settings",
  "/profile",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboardRoute = DASHBOARD_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (!isDashboardRoute) return NextResponse.next();

  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/properties/:path*",
    "/offers/:path*",
    "/clients/:path*",
    "/inquiries/:path*",
    "/bookings/:path*",
    "/team/:path*",
    "/portal/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};
