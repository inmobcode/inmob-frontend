import { apiFetch } from "./client";
import type { Property } from "./properties";
import type { ServiceType, ServiceUnit } from "./services";

export type OfferStatus = "DRAFT" | "SENT" | "VIEWED" | "EXPIRED";
/** Which properties the offer holds: only for sale, only for rent, or both. */
export type OfferOperation = "SALE" | "RENT" | "BOTH";
export type DiscountType = "NONE" | "PERCENT" | "FIXED";

export type PublicProperty = Omit<
  Property,
  "agencyId" | "status" | "owner" | "ownerId" | "createdAt" | "updatedAt"
>;

export interface OfferPropertyItem {
  id: string;
  propertyId: string;
  priceOverride: number | null;
  position: number;
  discountType: DiscountType;
  discountValue: number;
  securityDeposit: number | null;
  bottomText: string | null;
  displayPrice: number | null;
  initialPrice: number | null;
  property: Property | PublicProperty;
}

export interface OfferSection {
  id: string | null;
  title: string | null;
  text: string | null;
  position: number;
  properties: OfferPropertyItem[];
}

export interface Offer {
  id: string;
  agencyId?: string;
  clientId?: string | null;
  token: string;
  title: string;
  /** The agency's own tracking code, free text and optional. */
  referenceCode: string | null;
  operation: OfferOperation;
  currency: string;
  showPrice: boolean;
  branded: boolean;
  status: OfferStatus;
  expiresAt: string | null;
  welcomeTitle: string | null;
  welcomeDateLabel: string | null;
  welcomeContent: string | null;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  sections: OfferSection[];
  total: number | null;
  /** Services and experiences added to the offer, each with its own copy of the details. */
  services: OfferServiceItem[];
  /** What the priced services add up to; null when none is priced or prices are hidden. */
  servicesTotal: number | null;
  createdAt: string;
  updatedAt: string;
  /** Set while it's in the trash. */
  deletedAt?: string | null;
}

export interface OfferServiceItem {
  id: string;
  /** The library entry it came from; null if it was deleted. Not sent publicly. */
  serviceId?: string | null;
  name: string;
  type: ServiceType;
  description: string | null;
  imageUrl: string | null;
  unit: ServiceUnit;
  quantity: number;
  /** yyyy-MM-dd */
  date: string | null;
  note: string | null;
  /** Null: "a consultar" (or hidden on the public page). */
  unitPrice: number | null;
  total: number | null;
}

export interface OfferServiceInput {
  serviceId?: string | null;
  name: string;
  type: ServiceType;
  description?: string | null;
  imageUrl?: string | null;
  unit: ServiceUnit;
  unitPrice?: number | null;
  quantity: number;
  date?: string | null;
  note?: string | null;
}

export interface OfferPropertyInput {
  propertyId: string;
  priceOverride?: number | null;
  discountType?: DiscountType;
  discountValue?: number;
  securityDeposit?: number | null;
  bottomText?: string | null;
}

export interface OfferSectionInput {
  title?: string | null;
  text?: string | null;
  properties: OfferPropertyInput[];
}

export interface SaveOfferPayload {
  title: string;
  referenceCode?: string | null;
  operation?: OfferOperation;
  currency?: string;
  showPrice?: boolean;
  branded?: boolean;
  expiresAt?: string | null;
  welcomeTitle?: string | null;
  welcomeDateLabel?: string | null;
  welcomeContent?: string | null;
  /** A CRM client: the offer copies its contact details and "send" emails it the link. */
  clientId?: string | null;
  clientName?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  sections?: OfferSectionInput[];
  services?: OfferServiceInput[];
}

export function listOffers(token: string) {
  return apiFetch<Offer[]>("/api/offers/", { token });
}

export function createOffer(token: string, payload: SaveOfferPayload) {
  return apiFetch<Offer>("/api/offers/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getOffer(token: string, id: string) {
  return apiFetch<Offer>(`/api/offers/${id}`, { token });
}

export function updateOffer(
  token: string,
  id: string,
  payload: Partial<SaveOfferPayload>,
) {
  return apiFetch<Offer>(`/api/offers/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

/** Moves it to the trash (see listTrashedOffers). */
export function deleteOffer(token: string, id: string) {
  return apiFetch<void>(`/api/offers/${id}`, { method: "DELETE", token });
}

/** What's in the trash, latest first. The backend deletes for good what's older than 30 days. */
export function listTrashedOffers(token: string) {
  return apiFetch<Offer[]>("/api/offers/trash", { token });
}

export function restoreOffer(token: string, id: string) {
  return apiFetch<Offer>(`/api/offers/${id}/restore`, { method: "POST", token });
}

export function deleteOfferForever(token: string, id: string) {
  return apiFetch<void>(`/api/offers/${id}/permanent`, { method: "DELETE", token });
}

export function sendOffer(token: string, id: string) {
  return apiFetch<Offer>(`/api/offers/${id}/send`, { method: "POST", token });
}

export function getPublicOffer(offerToken: string) {
  return apiFetch<Offer>(`/api/public/offers/${offerToken}`);
}

export function submitOfferInquiry(
  offerToken: string,
  payload: { name: string; email: string; phone?: string; message?: string },
) {
  return apiFetch<Offer>(`/api/public/offers/${offerToken}/inquiries`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
