// The code typed in step 1 of the recovery travels to step 2 here, not in the
// URL: it stays out of history and referrers, and dies with the tab.
const KEY = "tivvu_reset_code";

export function saveResetCode(email: string, code: string) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ email, code }));
  } catch {
    // Storage blocked: step 2 will send the user back to ask for the code again.
  }
}

export function readResetCode(email: string): string | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { email?: string; code?: string };
    return saved.email === email && saved.code ? saved.code : null;
  } catch {
    return null;
  }
}

export function clearResetCode() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
