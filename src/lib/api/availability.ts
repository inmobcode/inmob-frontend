import { apiFetch } from "./client";

export type AvailabilitySource = "MANUAL" | "ICAL" | "BOOKING";

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
