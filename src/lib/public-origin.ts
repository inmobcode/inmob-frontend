/**
 * The dashboard runs under the `app.` subdomain, but links meant to be
 * shared outside it (offers, bookings, owner portals, agency sites) must
 * point at the apex domain — so they can't just reuse `window.location.origin`
 * from inside the dashboard anymore.
 */
export function getPublicOrigin(): string {
  if (typeof window === "undefined") return "";
  const { protocol, host } = window.location;
  return `${protocol}//${host.replace(/^app\./, "")}`;
}
