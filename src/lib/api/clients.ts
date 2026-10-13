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
  createdAt: string;
  updatedAt: string;
  interactions?: Interaction[];
}

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
    Pick<Client, "name" | "phone" | "stage" | "notes" | "assignedAgentId">
  >,
) {
  return apiFetch<Client>(`/api/clients/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
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
