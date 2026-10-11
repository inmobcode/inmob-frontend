import { apiFetch } from "./client";

export type PoolEntityType = "POOL" | "JACUZZI";

export interface Pool {
  id: string;
  propertyId: string;
  type: PoolEntityType;
  quantity: number;
  poolType: string[];
}

export function listPools(token: string, propertyId: string) {
  return apiFetch<Pool[]>(`/api/properties/${propertyId}/pools`, { token });
}

export function createPool(
  token: string,
  propertyId: string,
  payload: { type: PoolEntityType; quantity?: number; poolType?: string[] },
) {
  return apiFetch<Pool>(`/api/properties/${propertyId}/pools`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updatePool(
  token: string,
  propertyId: string,
  poolId: string,
  payload: Partial<{ quantity: number; poolType: string[] }>,
) {
  return apiFetch<Pool>(`/api/properties/${propertyId}/pools/${poolId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deletePool(token: string, propertyId: string, poolId: string) {
  return apiFetch<void>(`/api/properties/${propertyId}/pools/${poolId}`, {
    method: "DELETE",
    token,
  });
}
