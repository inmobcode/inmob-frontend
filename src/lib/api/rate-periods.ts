import { apiFetch } from "./client";

export interface RatePeriod {
  id: string;
  propertyId: string;
  label?: string | null;
  startDate: string;
  endDate: string;
  officialPricePerNight?: number | null;
  managementFeePct: number;
  agencyCommissionPct: number;
  netOwnerPerNight?: number | null;
  minStay?: number | null;
  includedServices?: string | null;
}

export type RatePeriodPayload = Omit<RatePeriod, "id" | "propertyId">;

export function listRatePeriods(token: string, propertyId: string) {
  return apiFetch<RatePeriod[]>(`/api/properties/${propertyId}/rates`, { token });
}

export function createRatePeriod(
  token: string,
  propertyId: string,
  payload: Partial<RatePeriodPayload>,
) {
  return apiFetch<RatePeriod>(`/api/properties/${propertyId}/rates`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateRatePeriod(
  token: string,
  propertyId: string,
  periodId: string,
  payload: Partial<RatePeriodPayload>,
) {
  return apiFetch<RatePeriod>(`/api/properties/${propertyId}/rates/${periodId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteRatePeriod(token: string, propertyId: string, periodId: string) {
  return apiFetch<void>(`/api/properties/${propertyId}/rates/${periodId}`, {
    method: "DELETE",
    token,
  });
}
