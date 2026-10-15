import { apiFetch } from "./client";

/** A follow-up on someone's plate, optionally about a client. */
export interface Task {
  id: string;
  title: string;
  notes: string | null;
  /** yyyy-MM-dd; null means no date. */
  dueDate: string | null;
  doneAt: string | null;
  overdue: boolean;
  assignedAgentId: string | null;
  createdBy: string | null;
  client: { id: string; name: string } | null;
  createdAt: string;
}

export interface TaskFilters {
  status?: "open" | "done" | "all";
  clientId?: string;
  /** "me" or a user id. */
  assignedTo?: string;
}

export function listTasks(token: string, filters: TaskFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.clientId) params.set("clientId", filters.clientId);
  if (filters.assignedTo) params.set("assignedTo", filters.assignedTo);
  const qs = params.toString();
  return apiFetch<Task[]>(`/api/tasks/${qs ? `?${qs}` : ""}`, { token });
}

export interface CreateTaskPayload {
  title: string;
  notes?: string | null;
  dueDate?: string | null;
  clientId?: string | null;
  assignedAgentId?: string | null;
}

export function createTask(token: string, payload: CreateTaskPayload) {
  return apiFetch<Task>("/api/tasks/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateTask(
  token: string,
  id: string,
  payload: Partial<Pick<Task, "title" | "notes" | "dueDate" | "assignedAgentId">> & { done?: boolean },
) {
  return apiFetch<Task>(`/api/tasks/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteTask(token: string, id: string) {
  return apiFetch<void>(`/api/tasks/${id}`, { method: "DELETE", token });
}
