import { apiFetch } from "./client";

export type NotificationType = "INQUIRY" | "OFFER_VIEWED" | "OFFER_REPLY" | "PAYMENT" | "TASK" | "BOOKING";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  /** Path inside the dashboard, without the agency slug (e.g. "/offers/abc"). */
  link: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationFeed {
  unread: number;
  items: AppNotification[];
}

export function listNotifications(token: string) {
  return apiFetch<NotificationFeed>("/api/notifications/", { token });
}

export function markNotification(token: string, id: string, read: boolean) {
  return apiFetch<AppNotification>(`/api/notifications/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ read }),
  });
}

export function markAllNotificationsRead(token: string) {
  return apiFetch<{ updated: number }>("/api/notifications/read-all", {
    method: "POST",
    token,
  });
}
