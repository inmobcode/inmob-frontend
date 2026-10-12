import type { AuthResponse } from "@/lib/api/auth";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const USER_COOKIE = "inmobiliario_user";

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

export function getSessionUser(): SessionUser | null {
  const raw = getCookie(USER_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
