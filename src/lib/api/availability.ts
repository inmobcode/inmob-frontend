import { siteCache } from "@/lib/site-cache";

import { apiFetch } from "./client";

export type AvailabilitySource = "MANUAL" | "ICAL" | "BOOKING";

/** One row of the agency-wide availability calendar: a rental listing and its blocked dates. */
export interface AvailabilityCalendarProperty {
  id: string;
  title: string;
  slug: string;
  category: string;
  country: string | null;
  region: string | null;
  area: string | null;
  price: number | null;
  currency: string;
  coverUrl: string | null;
  /** ISO dates (YYYY-MM-DD) already booked or blocked within the window. */
  blockedDates: string[];
}

export interface AvailabilityCalendar {
  /** ISO dates bounding the window (inclusive). */
  from: string;
  to: string;
  properties: AvailabilityCalendarProperty[];
}

/** The dashboard's internal view: every rental listing, draft or published. */
export function getAvailabilityCalendar(token: string) {
  return apiFetch<AvailabilityCalendar>("/api/properties/calendar", { token });
}

/** The agency's shareable link: published rentals only. */
export function getPublicAvailabilityCalendar(agencySlug: string) {
  return apiFetch<AvailabilityCalendar>(
    `/api/public/${agencySlug}/availability`,
    siteCache(agencySlug),
  );
}

export interface AvailabilityBlock {
  id: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  source: AvailabilitySource;
  icalUid: string | null;
  note: string | null;
}

export function listAvailabilityBlocks(token: string, propertyId: string) {
  return apiFetch<AvailabilityBlock[]>(
    `/api/properties/${propertyId}/availability/`,
    { token },
  );
}

export function createAvailabilityBlock(
  token: string,
  propertyId: string,
  payload: { startDate: string; endDate: string; note?: string },
) {
  return apiFetch<AvailabilityBlock>(
    `/api/properties/${propertyId}/availability/`,
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    },
  );
}

export function deleteAvailabilityBlock(
  token: string,
  propertyId: string,
  blockId: string,
) {
  return apiFetch<void>(
    `/api/properties/${propertyId}/availability/${blockId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

export function syncIcal(token: string, propertyId: string, icalUrl: string) {
  return apiFetch<{ importedCount: number }>(
    `/api/properties/${propertyId}/availability/sync`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ icalUrl }),
    },
  );
}
