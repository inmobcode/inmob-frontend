import { apiFetch } from "./client";
import type { ClientStage } from "./clients";

export interface DashboardSummary {
  counts: {
    unreadInquiries: number;
    offersSent: number;
    offersViewed: number;
    offersDraft: number;
    upcomingCheckIns: number;
    pendingBookings: number;
    pendingPayments: number;
    openTasks: number;
    overdueTasks: number;
  };
  /** Money still to collect, by currency. */
  pendingPaymentTotals: Record<string, number>;
  funnel: Record<ClientStage, number>;
  upcomingBookings: {
    id: string;
    propertyTitle: string | null;
    clientName: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string;
  }[];
  tasks: {
    id: string;
    title: string;
    dueDate: string | null;
    overdue: boolean;
    client: { id: string; name: string } | null;
  }[];
  recentInquiries: {
    id: string;
    name: string;
    message: string | null;
    createdAt: string;
    read: boolean;
  }[];
}

export function getDashboardSummary(token: string) {
  return apiFetch<DashboardSummary>("/api/dashboard/summary", { token });
}
