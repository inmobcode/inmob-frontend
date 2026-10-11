import { apiFetch } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterAgencyPayload {
  agencyName: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "OWNER" | "ADMIN" | "AGENT";
    agencyId: string;
  };
}

export function login(payload: LoginPayload) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerAgency(payload: RegisterAgencyPayload) {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
