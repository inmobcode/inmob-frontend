import type { ListingType, PropertyStatus } from "@/lib/api/properties";
import type { DiscountType, OfferStatus } from "@/lib/api/offers";
import type { ClientStage } from "@/lib/api/clients";
import type { BookingStatus, PaymentType } from "@/lib/api/bookings";

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  SALE: "Venta",
  RENT: "Alquiler",
};

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicada",
  ARCHIVED: "Archivada",
};

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  VIEWED: "Vista",
  EXPIRED: "Vencida",
};

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  NONE: "Sin descuento",
  PERCENT: "Porcentaje",
  FIXED: "Monto fijo",
};

export const CLIENT_STAGE_LABELS: Record<ClientStage, string> = {
  LEAD: "Lead",
  CONTACTED: "Contactado",
  NEGOTIATING: "Negociando",
  CLIENT: "Cliente",
  LOST: "Perdido",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
};

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  DEPOSIT: "Anticipo",
  BALANCE: "Saldo",
  COMMISSION: "Comisión",
};
