import { apiFetch } from "./client";

export type ServiceType =
  | "BUTLER"
  | "CHEF"
  | "YACHT"
  | "TRANSFER"
  | "CAR"
  | "EXCURSION"
  | "SPA"
  | "BABYSITTER"
  | "HOUSEKEEPING"
  | "EVENT"
  | "OTHER";

/** What the price is charged per. */
export type ServiceUnit = "SERVICE" | "PERSON" | "DAY" | "NIGHT" | "HOUR";

/** A service or experience in the agency's library. */
export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  description: string | null;
  imageUrl: string | null;
  /** Where it's offered; empty means anywhere. */
  zones: string[];
  /** For the agency only; never shown to clients. */
  provider: string | null;
  /** Null: "a consultar". */
  price: number | null;
  currency: string;
  unit: ServiceUnit;
  active: boolean;
  reservationPolicy: string | null;
  cancellationPolicy: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SaveServicePayload = Omit<Service, "id" | "createdAt" | "updatedAt">;

export function listServices(token: string) {
  return apiFetch<Service[]>("/api/services/", { token });
}

export function createService(token: string, payload: SaveServicePayload) {
  return apiFetch<Service>("/api/services/", { method: "POST", token, body: JSON.stringify(payload) });
}

export function updateService(token: string, id: string, payload: Partial<SaveServicePayload>) {
  return apiFetch<Service>(`/api/services/${id}`, { method: "PATCH", token, body: JSON.stringify(payload) });
}

export function deleteService(token: string, id: string) {
  return apiFetch<void>(`/api/services/${id}`, { method: "DELETE", token });
}

export function uploadServiceImage(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file, file.name);
  return apiFetch<{ url: string }>("/api/services/image", { method: "POST", token, body: formData });
}
