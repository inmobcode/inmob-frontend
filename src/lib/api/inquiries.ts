import { apiFetch } from "./client";

export type InquiryType = "PROPERTY" | "OFFER" | "GENERAL";

/** A question someone sent from the portal, a property page or an offer link. */
export interface Inquiry {
  id: string;
  type: InquiryType;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  createdAt: string;
  /** When someone on the team opened it; null means it's new. */
  readAt: string | null;
  client: { id: string; name: string; stage: string } | null;
  property: { id: string; title: string; slug: string } | null;
  offer: { id: string; title: string } | null;
}

/** Newest first; `new` keeps only the unread ones. */
export function listInquiries(token: string, status: "all" | "new" = "all") {
  return apiFetch<Inquiry[]>(
    `/api/inquiries/${status === "new" ? "?status=new" : ""}`,
    { token },
  );
}

export function getUnreadInquiries(token: string) {
  return apiFetch<{ count: number }>("/api/inquiries/unread-count", { token });
}

export function markInquiry(token: string, id: string, read: boolean) {
  return apiFetch<Inquiry>(`/api/inquiries/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ read }),
  });
}

export function markAllInquiriesRead(token: string) {
  return apiFetch<{ updated: number }>("/api/inquiries/read-all", {
    method: "POST",
    token,
  });
}
