import { apiFetch } from "./client";

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
  createdAt: string;
}

export interface Booking {
  id: string;
  agencyId: string;
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
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
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

export function confirmBooking(token: string, id: string) {
  return apiFetch<Booking>(`/api/bookings/${id}/confirm`, { method: "POST", token });
}

export function cancelBooking(token: string, id: string) {
  return apiFetch<Booking>(`/api/bookings/${id}/cancel`, { method: "POST", token });
}

export function completeBooking(token: string, id: string) {
  return apiFetch<Booking>(`/api/bookings/${id}/complete`, { method: "POST", token });
}

export function addPayment(
  token: string,
  bookingId: string,
  payload: { amount: number; type: PaymentType; currency?: string; method?: string },
) {
  return apiFetch<Payment>(`/api/bookings/${bookingId}/payments`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function markPaymentPaid(token: string, bookingId: string, paymentId: string) {
  return apiFetch<Payment>(`/api/bookings/${bookingId}/payments/${paymentId}/mark-paid`, {
    method: "POST",
    token,
  });
}
