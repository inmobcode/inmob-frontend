// Lives outside the client sidebar module so server components can import
// the plain string (values exported from a "use client" file become
// client references on the server).
export const SIDEBAR_COOKIE = "sidebar_collapsed";
