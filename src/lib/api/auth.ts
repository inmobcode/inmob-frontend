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
    avatarUrl?: string | null;
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

// Password recovery follows the contract the forgot/reset screens need; the
// backend doesn't expose these endpoints yet.
export function requestPasswordReset(payload: { email: string }) {
  return apiFetch<void>("/api/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload: { token: string; password: string }) {
  return apiFetch<void>("/api/auth/password/reset", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type Profile = AuthResponse["user"];

export function getProfile(token: string) {
  return apiFetch<Profile>("/api/auth/me", { token });
}

// The three calls below follow the contract the profile screen needs; the
// backend only exposes GET /api/auth/me for now.
export function updateProfile(
  token: string,
  payload: { name?: string; email?: string },
) {
  return apiFetch<Profile>("/api/auth/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function changePassword(
  token: string,
  payload: { currentPassword: string; newPassword: string },
) {
  return apiFetch<void>("/api/auth/me/password", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function uploadAvatar(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file, file.name);
  return apiFetch<Profile>("/api/auth/me/avatar", {
    method: "POST",
    token,
    body: formData,
  });
}
