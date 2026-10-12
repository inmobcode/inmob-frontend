import { apiFetch } from "./client";

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  contactEmail: string | null;
  locale: string;
  currency: string;
}

export type PublicAgency = Pick<Agency, "name" | "logoUrl" | "contactEmail">;

export interface UpdateAgencyPayload {
  name?: string;
  slug?: string;
  contactEmail?: string | null;
  locale?: string;
  currency?: string;
}

export function getAgency(token: string) {
  return apiFetch<Agency>("/api/agency/", { token });
}

export function updateAgency(token: string, payload: UpdateAgencyPayload) {
  return apiFetch<Agency>("/api/agency/", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function uploadAgencyLogo(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file, file.name);
  return apiFetch<Agency>("/api/agency/logo", {
    method: "POST",
    token,
    body: formData,
  });
}

export function getPublicAgency(agencySlug: string) {
  return apiFetch<PublicAgency>(`/api/public/${agencySlug}`);
}
