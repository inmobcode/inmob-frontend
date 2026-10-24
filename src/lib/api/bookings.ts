import type { PublicAgency } from "./agency";
import { apiFetch } from "./client";
import type { Property } from "./properties";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentType = "DEPOSIT" | "BALANCE" | "COMMISSION";
export type PaymentStatus = "PENDING" | "PAID";

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  paidAt: string | null;
  method: string | null;
  /** For the team only, e.g. "transfer 0042". */
  note: string | null;
  createdAt: string;
}

export interface Booking {
  id: string;
  agencyId: string;
  /** Opens the client's page at /booking/<token>. */
  token: string;
  propertyId: string;
  propertyTitle: string | null;
  clientId: string | null;
  clientName: string | null;
  offerId: string | null;
  startDate: string | null;
  endDate: string | null;
  status: BookingStatus;
  totalPrice: number | null;
  currency: string;
  commissionAmount: number | null;
  guests: number | null;
  /** For the team only: never on the client's page or receipt. */
  notes: string | null;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
  /** Set while it's in the trash. */
  deletedAt?: string | null;
}

export interface CreateBookingPayload {
  propertyId: string;
  clientId?: string;
  offerId?: string;
  startDate?: string;
  endDate?: string;
  totalPrice?: number;
  currency?: string;
  commissionAmount?: number;
  guests?: number;
  notes?: string;
}

export function listBookings(token: string) {
  return apiFetch<Booking[]>("/api/bookings/", { token });
}

export function createBooking(token: string, payload: CreateBookingPayload) {
  return apiFetch<Booking>("/api/bookings/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getBooking(token: string, id: string) {
  return apiFetch<Booking>(`/api/bookings/${id}`, { token });
}

/** Moves it to the trash (see listTrashedBookings). */
export function deleteBooking(token: string, id: string) {
  return apiFetch<void>(`/api/bookings/${id}`, { method: "DELETE", token });
}

/** What's in the trash, latest first. The backend deletes for good what's older than 30 days. */
export function listTrashedBookings(token: string) {
  return apiFetch<Booking[]>("/api/bookings/trash", { token });
}

export function restoreBooking(token: string, id: string) {
  return apiFetch<Booking>(`/api/bookings/${id}/restore`, { method: "POST", token });
}

export function deleteBookingForever(token: string, id: string) {
  return apiFetch<void>(`/api/bookings/${id}/permanent`, { method: "DELETE", token });
}

export function confirmBooking(token: string, id: string) {
  return apiFetch<Booking>(`/api/bookings/${id}/confirm`, {
    method: "POST",
    token,
  });
}

export function cancelBooking(token: string, id: string) {
  return apiFetch<Booking>(`/api/bookings/${id}/cancel`, {
    method: "POST",
    token,
  });
}

export function completeBooking(token: string, id: string) {
  return apiFetch<Booking>(`/api/bookings/${id}/complete`, {
    method: "POST",
    token,
  });
}

export function updateBooking(
  token: string,
  id: string,
  payload: Partial<Pick<Booking, "guests" | "notes" | "clientId" | "totalPrice" | "commissionAmount">>,
) {
  return apiFetch<Booking>(`/api/bookings/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

/** What a payment form sends. `paidAt` only counts with status PAID (it defaults to now). */
export interface PaymentPayload {
  amount: number;
  type: PaymentType;
  status?: PaymentStatus;
  paidAt?: string | null;
  method?: string | null;
  note?: string | null;
}

export function addPayment(token: string, bookingId: string, payload: PaymentPayload & { currency?: string }) {
  return apiFetch<Payment>(`/api/bookings/${bookingId}/payments`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function markPaymentPaid(
  token: string,
  bookingId: string,
  paymentId: string,
) {
  return apiFetch<Payment>(
    `/api/bookings/${bookingId}/payments/${paymentId}/mark-paid`,
    {
      method: "POST",
      token,
    },
  );
}

export function updatePayment(token: string, bookingId: string, paymentId: string, payload: Partial<PaymentPayload>) {
  return apiFetch<Payment>(`/api/bookings/${bookingId}/payments/${paymentId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deletePayment(token: string, bookingId: string, paymentId: string) {
  return apiFetch<void>(`/api/bookings/${bookingId}/payments/${paymentId}`, { method: "DELETE", token });
}

/** What the client sees at /booking/<token>: no commission, no notes, only their own payments. */
export interface PublicBooking {
  /** Short code printed on the receipt. */
  reference: string;
  guests: number | null;
  status: BookingStatus;
  startDate: string | null;
  endDate: string | null;
  totalPrice: number | null;
  currency: string;
  clientName: string | null;
  createdAt: string;
  payments: Pick<Payment, "amount" | "currency" | "type" | "status" | "paidAt" | "method">[];
  property: Property & { published: boolean };
  agency: PublicAgency & { slug: string };
  /** What the guest wrote, once they did; null before. */
  review: { rating: number; text: string | null; status: "PENDING" | "PUBLISHED" | "HIDDEN" } | null;
  /** The stay is over and there's no review yet. */
  canReview: boolean;
}

export function submitGuestReview(token: string, payload: { rating: number; text?: string; authorName?: string }) {
  return apiFetch<PublicBooking>(`/api/public/bookings/${token}/review`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPublicBooking(token: string) {
  return apiFetch<PublicBooking>(`/api/public/bookings/${token}`);
}
