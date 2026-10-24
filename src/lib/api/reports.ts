import { apiFetch } from "./client";
import type { InquiryType } from "./inquiries";

/** One month of money in one currency (see app/services/report_service.py for what each figure counts). */
export interface MoneyMonth {
  /** yyyy-MM */
  month: string;
  /** Total price of the confirmed or completed bookings checking in that month (a sale: created). */
  booked: number;
  /** Client payments (not the commission) marked paid that month. */
  collected: number;
  commission: number;
  bookings: number;
}

export interface OccupancyRow {
  propertyId: string;
  title: string;
  /** Nights in the period. */
  nights: number;
  /** Taken by bookings made in Tivvu. */
  booked: number;
  /** Taken by blocks synced by iCal (other channels). */
  external: number;
  /** Blocked by hand: out of the market, not counted as available. */
  blocked: number;
  /** (booked + external) / (nights − blocked); null when nothing was available. */
  rate: number | null;
}

export interface Conversion {
  inquiries: number;
  /** People behind those inquiries. */
  clients: number;
  /** Of them, sent an offer after writing in. */
  offered: number;
  /** Of them, booked (anything but cancelled) after writing in. */
  booked: number;
  rate: number | null;
  /** Inquiries answered from the dashboard, and the median wait in hours. */
  replied: number;
  medianReplyHours: number | null;
  byType: { type: InquiryType; clients: number; booked: number }[];
}

export interface TeamRow {
  userId: string;
  name: string;
  role: "OWNER" | "ADMIN" | "AGENT";
  active: boolean;
  clients: number;
  offers: number;
  bookings: number;
  /** Per currency. */
  booked: Record<string, number>;
  commission: Record<string, number>;
}

export interface Report {
  /** yyyy-MM-dd, whole months. */
  from: string;
  to: string;
  /** Per currency, one row per month of the period. */
  money: Record<string, MoneyMonth[]>;
  occupancy: OccupancyRow[];
  conversion: Conversion;
  team: TeamRow[];
}

/** For owners and admins. `from` and `to` are yyyy-MM-dd; the API widens them to whole months. */
export function getReport(token: string, from: string, to: string) {
  return apiFetch<Report>(`/api/reports/?from=${from}&to=${to}`, { token });
}
