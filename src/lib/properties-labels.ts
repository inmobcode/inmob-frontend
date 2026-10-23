import type { BookingStatus, PaymentType } from "@/lib/api/bookings";
import type { ClientSource, ClientStage } from "@/lib/api/clients";
import type { DiscountType, OfferOperation, OfferStatus } from "@/lib/api/offers";
import type { ListingType, PropertyStatus } from "@/lib/api/properties";
import type { ServiceType, ServiceUnit } from "@/lib/api/services";

// The values the API stores, in the order the UI lists them. Their words live
// in the "labels" messages (src/messages/<locale>/labels.json): see useLabels().
export const LISTING_TYPES: ListingType[] = ["SALE", "RENT"];
export const PROPERTY_STATUSES: PropertyStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
export const OFFER_OPERATIONS: OfferOperation[] = ["SALE", "RENT", "BOTH"];
export const OFFER_STATUSES: OfferStatus[] = ["DRAFT", "SENT", "VIEWED", "EXPIRED"];
export const DISCOUNT_TYPES: DiscountType[] = ["NONE", "PERCENT", "FIXED"];
export const CLIENT_STAGES: ClientStage[] = ["LEAD", "CONTACTED", "NEGOTIATING", "CLIENT", "LOST"];
export const BOOKING_STATUSES_ORDER: BookingStatus[] = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
export const PAYMENT_TYPES: PaymentType[] = ["DEPOSIT", "BALANCE", "COMMISSION"];

/** What makeLabels needs from a next-intl translator scoped to "labels". */
export interface LabelTranslator {
  (key: string, values?: Record<string, string | number>): string;
  has(key: string): boolean;
}

/** "SEMI_DETACHED_VILLA" → "Semi detached villa", for a code no language names yet. */
function readable(code: string) {
  const text = code.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * The words for every catalog value, in the current language. Values the
 * messages don't know (a custom photo section, an amenity typed by hand) are
 * shown as they were written.
 */
export function makeLabels(t: LabelTranslator) {
  const known = (group: string, value: string, fallback = value) =>
    t.has(`${group}.${value}`) ? t(`${group}.${value}`) : fallback;
  return {
    listingType: (value: ListingType) => t(`listingType.${value}`),
    propertyStatus: (value: PropertyStatus) => t(`propertyStatus.${value}`),
    offerOperation: (value: OfferOperation) => t(`offerOperation.${value}`),
    offerStatus: (value: OfferStatus) => t(`offerStatus.${value}`),
    discountType: (value: DiscountType) => t(`discountType.${value}`),
    clientStage: (value: ClientStage) => t(`clientStage.${value}`),
    clientSource: (value: ClientSource) => t(`clientSource.${value}`),
    bookingStatus: (value: BookingStatus) => t(`bookingStatus.${value}`),
    paymentType: (value: PaymentType) => t(`paymentType.${value}`),
    category: (code: string) => known("category", code, readable(code)),
    locationCategory: (code: string) => known("locationCategory", code, readable(code)),
    locationFeature: (value: string) => known("locationFeature", value),
    view: (value: string) => known("view", value),
    outdoorAmenity: (value: string) => known("outdoorAmenity", value),
    indoorAmenity: (value: string) => known("indoorAmenity", value),
    /** An amenity from either catalog, or as typed. */
    amenity: (value: string) => known("outdoorAmenity", value, known("indoorAmenity", value)),
    propertyCondition: (value: string) => known("propertyCondition", value),
    includedService: (value: string) => known("includedService", value),
    photoSection: (value: string) => known("photoSection", value),
    poolType: (value: string) => known("poolType", value),
    jacuzziType: (value: string) => known("jacuzziType", value),
    energyCertificate: (value: string) => known("energyCertificate", value),
    serviceType: (value: ServiceType) => t(`serviceType.${value}`),
    serviceUnit: (value: ServiceUnit) => t(`serviceUnit.${value}`),
    /** "por día", or "" for a one-off price. */
    serviceUnitPer: (value: ServiceUnit) => known("serviceUnitPer", value, ""),
    /** "3 días", "2 personas", "1 vez". */
    serviceUnitCount: (value: ServiceUnit, count: number) => t(`serviceUnitCount.${value}`, { count }),
  };
}

export type Labels = ReturnType<typeof makeLabels>;
