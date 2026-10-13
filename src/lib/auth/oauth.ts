import { API_URL } from "@/lib/api/client";

export type OAuthProvider = "google" | "apple";

const NEXT_KEY = "auth-next";
const DEFAULT_NEXT = "/properties";

/** Only same-site paths: anything else (`//evil.com`, `https://…`) falls back to the dashboard. */
export function safeNext(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//"))
    return DEFAULT_NEXT;
  return value;
}

/** Where to go after signing in: the page the proxy bounced the person from, if any. */
export function readNext() {
  return safeNext(new URLSearchParams(window.location.search).get("next"));
}

/**
 * Social sign-in is a full redirect: the API talks to Google or Apple and sends
 * the person back to `/auth/callback`, with the session in the URL fragment.
 * (The endpoints `/api/auth/oauth/{provider}` are pending on the backend.)
 */
export function startOAuth(provider: OAuthProvider) {
  try {
    window.sessionStorage.setItem(NEXT_KEY, readNext());
  } catch {}
  // External URL (the API), so a full navigation is intended.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = `${API_URL}/api/auth/oauth/${provider}`;
}

export function consumeNext() {
  try {
    const value = window.sessionStorage.getItem(NEXT_KEY);
    window.sessionStorage.removeItem(NEXT_KEY);
    return safeNext(value);
  } catch {
    return DEFAULT_NEXT;
  }
}
