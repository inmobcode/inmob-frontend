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
export function setSession(auth: AuthResponse) {
  setCookie(ACCESS_COOKIE, auth.accessToken, 1);
  setCookie(REFRESH_COOKIE, auth.refreshToken, 30);
  setCookie(USER_COOKIE, JSON.stringify(auth.user), 30);
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
