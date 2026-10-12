import { apiFetch } from "./client";
import type { BookingStatus, PaymentType } from "./bookings";
import type { PublicProperty } from "./offers";

export interface OwnerPortalPayment {
  amount: number;
  currency: string;
  type: PaymentType;
  status: "PENDING" | "PAID";
  paidAt: string | null;
}

export interface OwnerPortalBooking {
  startDate: string | null;
  endDate: string | null;
  status: BookingStatus;
  totalPrice: number | null;
  currency: string;
  payments: OwnerPortalPayment[];
}

export interface OwnerPortalProperty extends PublicProperty {
  bookings: OwnerPortalBooking[];
}

export interface OwnerPortal {
  ownerName: string;
  agencyName: string;
  properties: OwnerPortalProperty[];
}

export function getOwnerPortal(ownerToken: string) {
  return apiFetch<OwnerPortal>(`/api/public/owners/${ownerToken}`);
}
