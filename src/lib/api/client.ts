// 127.0.0.1, not "localhost": on macOS, "localhost" can resolve to the IPv6
// loopback first, which AirPlay Receiver already owns on port 5000.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

let onSessionExpired: (() => void) | null = null;

/** Registered once from the app shell; see `SessionWatcher`. */
export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ApiFetchOptions extends RequestInit {
  token?: string | null;
}

/** The page's language, so the API answers errors in it and remembers the user's (see backend app/i18n). */
function pageLocale(): string | null {
  if (typeof document === "undefined") return null;
  return document.documentElement.lang?.slice(0, 2) || null;
}

export async function apiFetch<T>(
  path: string,
  { token, headers, ...rest }: ApiFetchOptions = {},
): Promise<T> {
  // FormData bodies (file uploads) need the browser to set its own
  // multipart boundary — forcing application/json would break them.
  const isFormData =
    typeof FormData !== "undefined" && rest.body instanceof FormData;

  const locale = pageLocale();
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...(locale ? { "X-Locale": locale } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    // Only an authenticated call expiring counts as a session timeout — a
    // bad-credentials 401 on /login itself never carries a token.
    if (res.status === 401 && token) onSessionExpired?.();
    throw new ApiError(body?.message ?? res.statusText, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
