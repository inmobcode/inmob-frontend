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
  /** Set while it's archived: out of the inbox, still kept. */
  archivedAt: string | null;
  /** Set while it's in the trash. */
  deletedAt: string | null;
  /** The last answer sent from the dashboard, and who wrote it. */
  repliedAt: string | null;
  repliedBy: string | null;
  /** The client it created or matched; their owner is who handles the inquiry. */
  client: { id: string; name: string; stage: string; assignedAgentId: string | null } | null;
  property: { id: string; title: string; slug: string; coverUrl: string | null } | null;
  offer: { id: string; title: string } | null;
}

/** A ready-made answer; its text carries placeholders (see REPLY_PLACEHOLDERS). */
export interface ReplyTemplate {
  id: string;
  name: string;
  subject: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
}

/** Newest first; `new` keeps only the unread ones, `archived` lists the archived instead of the inbox. */
export function listInquiries(token: string, status: "all" | "new" | "archived" = "all") {
  return apiFetch<Inquiry[]>(
    `/api/inquiries/${status === "all" ? "" : `?status=${status}`}`,
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

export function archiveInquiry(token: string, id: string, archived: boolean) {
  return apiFetch<Inquiry>(`/api/inquiries/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ archived }),
  });
}

/** Moves it to the trash (see listTrashedInquiries). The client stays. */
export function deleteInquiry(token: string, id: string) {
  return apiFetch<void>(`/api/inquiries/${id}`, { method: "DELETE", token });
}

/** What's in the trash, latest first. The backend deletes for good what's older than 30 days. */
export function listTrashedInquiries(token: string) {
  return apiFetch<Inquiry[]>("/api/inquiries/trash", { token });
}

export function restoreInquiry(token: string, id: string) {
  return apiFetch<Inquiry>(`/api/inquiries/${id}/restore`, { method: "POST", token });
}

export function deleteInquiryForever(token: string, id: string) {
  return apiFetch<void>(`/api/inquiries/${id}/permanent`, { method: "DELETE", token });
}

/** Emails the answer from the agency's name and logs it in the client's history. */
export function replyToInquiry(token: string, id: string, payload: { subject: string; body: string }) {
  return apiFetch<Inquiry>(`/api/inquiries/${id}/reply`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function listReplyTemplates(token: string) {
  return apiFetch<ReplyTemplate[]>("/api/inquiries/templates", { token });
}

export type ReplyTemplateInput = Pick<ReplyTemplate, "name" | "subject" | "body">;

export function createReplyTemplate(token: string, payload: ReplyTemplateInput) {
  return apiFetch<ReplyTemplate>("/api/inquiries/templates", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateReplyTemplate(token: string, id: string, payload: ReplyTemplateInput) {
  return apiFetch<ReplyTemplate>(`/api/inquiries/templates/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteReplyTemplate(token: string, id: string) {
  return apiFetch<void>(`/api/inquiries/templates/${id}`, { method: "DELETE", token });
}

export function markAllInquiriesRead(token: string) {
  return apiFetch<{ updated: number }>("/api/inquiries/read-all", {
    method: "POST",
    token,
  });
}
