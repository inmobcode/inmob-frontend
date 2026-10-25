import { apiFetch } from "./client";

export type HistoryEntity = "properties" | "offers" | "bookings";
export type HistoryAction = "CREATED" | "UPDATED" | "TRASHED" | "RESTORED" | "DELETED";

/**
 * One change: who (null when nobody was signed in, e.g. the client on a public
 * link), when, and per field its old and new value. A field that only says
 * `changed` is free text, a contact detail, or a list (photos, payments…).
 */
export interface HistoryEvent {
  id: string;
  action: HistoryAction;
  changes: Record<string, { from?: unknown; to?: unknown; changed?: boolean }>;
  userName: string | null;
  byUser: boolean;
  at: string;
}

export function getHistory(token: string, entity: HistoryEntity, id: string) {
  return apiFetch<HistoryEvent[]>(`/api/${entity}/${id}/history`, { token });
}
