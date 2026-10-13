import { apiFetch } from "./client";

export type TeamRole = "OWNER" | "ADMIN" | "AGENT";

export interface TeamMember {
  id: string;
  agencyId: string;
  name: string;
  email: string;
  role: TeamRole;
  isActive: boolean;
  createdAt: string;
}

export interface CreateTeamMemberPayload {
  name: string;
  email: string;
  role: Exclude<TeamRole, "OWNER">;
}

export interface InviteResult extends TeamMember {
  linkedExisting: boolean;
}

export function listTeam(token: string) {
  return apiFetch<TeamMember[]>("/api/team/", { token });
}

export function createTeamMember(
  token: string,
  payload: CreateTeamMemberPayload,
) {
  return apiFetch<InviteResult>("/api/team/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateTeamMember(
  token: string,
  id: string,
  payload: Partial<Pick<TeamMember, "role" | "isActive">>,
) {
  return apiFetch<TeamMember>(`/api/team/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function removeTeamMember(token: string, id: string) {
  return apiFetch<void>(`/api/team/${id}`, {
    method: "DELETE",
    token,
  });
}
