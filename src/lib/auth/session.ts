import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { AuthResponse } from "@/lib/api/auth";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const USER_COOKIE = "tivvu_user";
// Renamed from the product's old name. Sessions stored before the rename
// still have their user info under this key — read it once and migrate it
// so people aren't silently logged out of just the name/avatar menu.
const LEGACY_USER_COOKIE = "inmobiliario_user";

export type SessionUser = AuthResponse["user"];

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

/**
 * Stores the JWT pair in plain (non-httpOnly) cookies so the Next.js proxy
 * (middleware) can read `access_token` on the server. Good enough for the
 * MVP since the frontend and API are decoupled (browser talks to Flask
 * directly); revisit with httpOnly cookies + a BFF refresh route if this
 * ships to real users.
 */
// Matches the backend's JWT_ACCESS_TOKEN_EXPIRES / JWT_REFRESH_TOKEN_EXPIRES
// (180 days) — no point in the cookie expiring before the token it holds does.
const SESSION_DAYS = 180;

export function setSession(auth: AuthResponse) {
  setCookie(ACCESS_COOKIE, auth.accessToken, SESSION_DAYS);
  setCookie(REFRESH_COOKIE, auth.refreshToken, SESSION_DAYS);
  setCookie(USER_COOKIE, JSON.stringify(auth.user), SESSION_DAYS);
}

export const SESSION_USER_EVENT = "session-user-changed";

/** Keeps the cookie in sync after the user edits their profile, and tells open menus to refresh. */
export function updateSessionUser(patch: Partial<SessionUser>) {
  const current = getSessionUser();
  if (!current) return;
  setCookie(USER_COOKIE, JSON.stringify({ ...current, ...patch }), 30);
  window.dispatchEvent(new Event(SESSION_USER_EVENT));
}

export function clearSession() {
  deleteCookie(ACCESS_COOKIE);
  deleteCookie(REFRESH_COOKIE);
  deleteCookie(USER_COOKIE);
}

export function getAccessToken(): string | null {
  return getCookie(ACCESS_COOKIE);
}

/** The agency slug the dashboard's URLs are currently scoped to. */
export function getAgencySlug(): string | null {
  return getSessionUser()?.agencySlug ?? null;
}

export function getSessionUser(): SessionUser | null {
  let raw = getCookie(USER_COOKIE);
  if (!raw) {
    raw = getCookie(LEGACY_USER_COOKIE);
    if (!raw) return null;
    setCookie(USER_COOKIE, raw, SESSION_DAYS);
    deleteCookie(LEGACY_USER_COOKIE);
  }
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

/**
 * The session user, re-read whenever `updateSessionUser` fires its event.
 * Starts `null` on both the server and the first client render (cookies
 * aren't readable during SSR), then fills in after mount — never a lazy
 * initializer, or the hydrated output would diverge from the server HTML.
 */
export function useSessionUser(): SessionUser | null {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    function read() {
      setUser(getSessionUser());
    }
    read();
    window.addEventListener(SESSION_USER_EVENT, read);
    return () => window.removeEventListener(SESSION_USER_EVENT, read);
  }, []);

  return user;
}

/**
 * Equipo, Configuración and the portal editor are OWNER/ADMIN territory (see
 * sidebar.tsx) — this is the matching guard for AGENT hitting the URL
 * directly. The real block is the backend's `@require_role`; this is just UX.
 */
export function useRequireNonAgent() {
  const user = useSessionUser();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === "AGENT") router.replace(`/${user.agencySlug}/properties`);
  }, [user, router]);
}
