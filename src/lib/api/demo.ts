import { apiFetch } from "./client";

export interface DemoRequestPayload {
  name: string;
  agency: string;
  email: string;
  teamSize: string;
}

// The landing's form posts here. The backend doesn't expose this endpoint yet:
// until it does, sending the form shows the error state.
export function requestDemo(payload: DemoRequestPayload) {
  return apiFetch<void>("/api/public/demo-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
