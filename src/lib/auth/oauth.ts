import { API_URL } from "@/lib/api/client";

export type OAuthProvider = "google" | "apple";

const NEXT_KEY = "auth-next";

/**
 * Only same-site paths: anything else (`//evil.com`, `https://…`) falls back
 * to that agency's dashboard. `fallbackSlug` comes from whoever just signed
 * in, since there's no agency to default into otherwise.
 */
export function safeNext(value: string | null | undefined, fallbackSlug: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//"))
    return `/${fallbackSlug}/properties`;
  return value;
}

/** Where to go after signing in: the page the proxy bounced the person from, if any. */
export function readNext(fallbackSlug: string) {
  return safeNext(new URLSearchParams(window.location.search).get("next"), fallbackSlug);
}

/**
 * Social sign-in is a full redirect: the API talks to Google or Apple and sends
 * the person back to `/auth/callback`, with the session in the URL fragment.
 * (The endpoints `/api/auth/oauth/{provider}` are pending on the backend.)
 */
export function startOAuth(provider: OAuthProvider) {
  // There's no logged-in agency yet to resolve a same-site fallback against,
  // so this only preserves a real `?next=` if the proxy bounced the person
  // here; consumeNext() resolves the final destination once we know who
  // they are.
  try {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next) window.sessionStorage.setItem(NEXT_KEY, next);
  } catch {}
  // External URL (the API), so a full navigation is intended.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = `${API_URL}/api/auth/oauth/${provider}`;
}

export function consumeNext(fallbackSlug: string) {
  try {
    const value = window.sessionStorage.getItem(NEXT_KEY);
    window.sessionStorage.removeItem(NEXT_KEY);
    return safeNext(value, fallbackSlug);
  } catch {
    return `/${fallbackSlug}/properties`;
  }
}
