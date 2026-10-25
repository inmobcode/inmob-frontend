import type { Booking, BookingStatus } from "@/lib/api/bookings";
import type { Property } from "@/lib/api/properties";
import { placeKey } from "@/lib/places";

/** Where a booking stands on money: paid in full, partly paid, or nothing collected yet. */
export type PaymentState = "PAID" | "PARTIAL" | "UNPAID";
export const PAYMENT_STATES: PaymentState[] = ["UNPAID", "PARTIAL", "PAID"];

/**
 * Against the booking's total, or, without one, against the payments it plans.
 * The agency's commission is its own income, not the client's: it doesn't count.
 */
export function paymentStateOf(booking: Pick<Booking, "totalPrice" | "payments">): PaymentState {
  const payments = (booking.payments ?? []).filter((payment) => payment.type !== "COMMISSION");
  const paid = payments.filter((payment) => payment.status === "PAID").reduce((sum, payment) => sum + payment.amount, 0);
  const due = booking.totalPrice ?? payments.reduce((sum, payment) => sum + payment.amount, 0);
  if (paid <= 0) return "UNPAID";
  return due > 0 && paid < due ? "PARTIAL" : "PAID";
}

/**
 * Whether the stay touches the days from `from` to `to` (yyyy-MM-dd, both
 * included). A booking without dates (a sale) never does.
 */
export function staysWithin(booking: Pick<Booking, "startDate" | "endDate">, from: string, to: string) {
  if (!booking.startDate || !booking.endDate) return false;
  // Check-out day is free again: a stay that ends on `from` doesn't overlap.
  return booking.startDate <= to && booking.endDate > from;
}


/** Everything the bookings list filters by, besides the search box. Empty means no filter. */
export interface BookingFilters {
  status: BookingStatus[];
  payment: PaymentState[];
  /** One property, or "ALL". */
  propertyId: string;
  /** Free text: any part of the property's area, region, country or address. */
  location: string;
  /** A stay that touches these days, both included (yyyy-MM-dd, "" while not filtering). */
  from: string;
  to: string;
}

export const NO_BOOKING_FILTERS: BookingFilters = {
  status: [],
  payment: [],
  propertyId: "ALL",
  location: "",
  from: "",
  to: "",
};

/** How many filters are in use, for the badge on the filters button. */
export function countBookingFilters(filters: BookingFilters) {
  return (
    filters.status.length +
    filters.payment.length +
    (filters.propertyId !== "ALL" ? 1 : 0) +
    (filters.location.trim() ? 1 : 0) +
    (filters.from && filters.to ? 1 : 0)
  );
}

type Place = Pick<Property, "area" | "region" | "country" | "address">;

/**
 * Whether the typed text is part of where the property is, ignoring case and
 * accents: "balear" finds "Islas Baleares", "palma" finds "Palma de Mallorca".
 */
export function placeContains(place: Place | undefined, text: string) {
  const term = placeKey(text);
  if (!term) return true;
  if (!place) return false;
  return [place.area, place.region, place.country, place.address].some(
    (value) => !!value && placeKey(value).includes(term),
  );
}

export function applyBookingFilters<B extends Pick<Booking, "status" | "propertyId" | "totalPrice" | "payments" | "startDate" | "endDate">>(
  bookings: B[],
  filters: BookingFilters,
  placeOf: (propertyId: string) => Place | undefined,
) {
  return bookings.filter((booking) => {
    if (filters.status.length > 0 && !filters.status.includes(booking.status)) return false;
    if (filters.payment.length > 0 && !filters.payment.includes(paymentStateOf(booking))) return false;
    if (filters.propertyId !== "ALL" && booking.propertyId !== filters.propertyId) return false;
    if (filters.location.trim() && !placeContains(placeOf(booking.propertyId), filters.location)) return false;
    if (filters.from && filters.to && !staysWithin(booking, filters.from, filters.to)) return false;
    return true;
  });
}
