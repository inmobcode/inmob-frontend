import { apiFetch } from "./client";

export interface ContactRequestPayload {
  name: string;
  email: string;
  message: string;
}

export function requestContact(payload: ContactRequestPayload) {
  return apiFetch<void>("/api/public/contact-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
