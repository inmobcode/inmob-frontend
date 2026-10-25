import { apiFetch } from "./client";

export type ClientStage =
  "LEAD" | "CONTACTED" | "NEGOTIATING" | "CLIENT" | "LOST";
export type ClientSource = "WEBSITE" | "MANUAL" | "OFFER";
export type InteractionType = "NOTE" | "CALL" | "EMAIL" | "MEETING";

export interface Interaction {
  id: string;
  type: InteractionType;
  content: string;
  createdBy: string | null;
  createdAt: string;
}

export interface Client {
  id: string;
  agencyId: string;
  assignedAgentId: string | null;
  name: string;
  email: string;
  phone: string | null;
  source: ClientSource;
  stage: ClientStage;
  notes: string | null;
  /** The agency's own labels, to filter and export by. */
  tags: string[];
  /** What they're looking for; the budget is in the agency's currency. Dates are "yyyy-MM-dd". */
  budgetMin: number | null;
  budgetMax: number | null;
  guests: number | null;
  zones: string | null;
  desiredFrom: string | null;
  desiredTo: string | null;
  createdAt: string;
  updatedAt: string;
  /** Set while it's in the trash. */
  deletedAt?: string | null;
  interactions?: Interaction[];
}

/** The fields the client's page edits besides contact and stage. */
export type ClientPreferences = Pick<
  Client,
  "tags" | "budgetMin" | "budgetMax" | "guests" | "zones" | "desiredFrom" | "desiredTo"
>;

export function listClients(token: string) {
  return apiFetch<Client[]>("/api/clients/", { token });
}

export function createClient(
  token: string,
  payload: { name: string; email: string; phone?: string; notes?: string },
) {
  return apiFetch<Client>("/api/clients/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getClient(token: string, id: string) {
  return apiFetch<Client>(`/api/clients/${id}`, { token });
}

export function updateClient(
  token: string,
  id: string,
  payload: Partial<
    Pick<Client, "name" | "phone" | "stage" | "notes" | "assignedAgentId"> & ClientPreferences
  >,
) {
  return apiFetch<Client>(`/api/clients/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

/** Moves it to the trash (see listTrashedClients). */
export function deleteClient(token: string, id: string) {
  return apiFetch<void>(`/api/clients/${id}`, { method: "DELETE", token });
}

/** What's in the trash, latest first. The backend deletes for good what's older than 30 days. */
export function listTrashedClients(token: string) {
  return apiFetch<Client[]>("/api/clients/trash", { token });
}

export function restoreClient(token: string, id: string) {
  return apiFetch<Client>(`/api/clients/${id}/restore`, { method: "POST", token });
}

/** Refused (409) while the client has bookings: they stay in the trash. */
export function deleteClientForever(token: string, id: string) {
  return apiFetch<void>(`/api/clients/${id}/permanent`, { method: "DELETE", token });
}

export function addInteraction(
  token: string,
  clientId: string,
  payload: { type: InteractionType; content: string },
) {
  return apiFetch<Interaction>(`/api/clients/${clientId}/interactions`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}
