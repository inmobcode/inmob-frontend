import { apiFetch } from "./client";

export type ListingType = "SALE" | "RENT";
export type PropertyCategory = string; // see ACCOMMODATION_TYPES / REAL_ESTATE_TYPES in property-catalogs.ts
export type PropertyStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type PhotoSection =
  | "GENERAL"
  | "BEDROOMS"
  | "INDOOR_LIVING"
  | "POOL"
  | "OUTDOOR"
  | "ADDED_FACILITIES"
  | "VIEWS";

export interface PropertyOwner {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
}

export interface PropertyPhoto {
  id: string;
  url: string;
  position: number;
  isCover: boolean;
  section: PhotoSection;
  sectionDetail?: string | null;
}

export interface VideoUrl {
  url: string;
  videoId?: string;
  thumbnail?: string;
}

export interface LayoutAndLivingSpaces {
  kitchens?: { count?: number; description?: string };
  livingRooms?: { count?: number; description?: string };
  guestWC?: { count?: number; description?: string };
  staffQuarters?: { count?: number; description?: string };
  garden?: { available?: boolean; description?: string };
  storage?: { available?: boolean; description?: string };
}

export interface Classification {
  floorNumbers: number[];
  parkingSpaces?: number | null;
  storageSpaces?: number | null;
  staffRoom?: number | null;
  locationCategory?: string | null;
  layoutAndLivingSpaces?: LayoutAndLivingSpaces | null;
  masterBedroomQty?: number | null;
  doubleBedroomQty?: number | null;
  twinBedroomQty?: number | null;
  singleBedroomQty?: number | null;
  bedroomWithBunkBedsQty?: number | null;
  guestBedroomQty?: number | null;
  managementName?: string | null;
  managementEmail?: string | null;
  managementPhone?: string | null;
  managementCompany?: string | null;
  vendorPropertyName?: string | null;
  website?: string | null;
  commission?: string | null;
  license?: string | null;
  thirdPartyPermission?: boolean | null;
}

export interface TheVilla {
  groups: { title: string; items: string[] }[];
  featuredExperienceIds: string[];
  hideNearbyExperiences: boolean;
}

export interface PropertyDescription {
  /** Short teaser/header blurb, same purpose for both SALE and RENT. */
  summary?: string | null;
  /** Full detailed body copy. */
  description?: string | null;
  extraInfo?: string | null;
  includedServices: string[];
  /** Free-form notes that don't fit elsewhere. */
  additionalNotes?: string | null;
  ourNote?: string | null;
  outdoorTitle?: string | null;
  outdoorDescription?: string | null;
  outdoorImageUrl?: string | null;
  theVilla?: TheVilla | null;
}

export interface Property {
  id: string;
  agencyId: string;
  agencySlug?: string | null;
  ownerId?: string | null;
  parentPropertyId?: string | null;
  title: string;
  slug: string;
  listingType: ListingType;
  category: PropertyCategory;
  status: PropertyStatus;
  price?: number | null;
  currency: string;
  country?: string | null;
  region?: string | null;
  area?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  googleMapUrl?: string | null;
  brochureUrl?: string | null;
  websiteUrl?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqm?: number | null;
  plotArea?: number | null;
  constructionYear?: number | null;
  renovationYear?: number | null;
  energyCertificate?: string | null;
  amenities: string[];
  outdoorAmenities: string[];
  indoorAmenities: string[];
  customFacilities: string[];
  locationFeatures: string[];
  view: string[];
  propertyStatus: string[];
  enjoy?: string | null;
  outdoorShower?: number | null;
  agentFriendlyName?: string | null;
  visibleLocation?: string | null;
  guests?: string | null;
  stars?: number | null;
  watermarkPhotos: boolean;
  videoUrls: VideoUrl[];
  icalImportUrl?: string | null;
  owner?: PropertyOwner | null;
  photos: PropertyPhoto[];
  classification?: Classification | null;
  content?: PropertyDescription | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyPayload {
  title: string;
  listingType: ListingType;
  category: PropertyCategory;
  country?: string;
  region?: string;
  area?: string;
}

export type UpdatePropertyPayload = Partial<
  Omit<
    Property,
    | "id"
    | "agencyId"
    | "slug"
    | "status"
    | "owner"
    | "photos"
    | "createdAt"
    | "updatedAt"
    | "classification"
    | "content"
  >
> & {
  classification?: Partial<Classification>;
  content?: Partial<PropertyDescription>;
};

export function listProperties(
  token: string,
  filters: { status?: PropertyStatus; listingType?: ListingType } = {},
) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.listingType) params.set("listingType", filters.listingType);
  const query = params.toString();
  return apiFetch<Property[]>(`/api/properties/${query ? `?${query}` : ""}`, { token });
}

export function createProperty(token: string, payload: CreatePropertyPayload) {
  return apiFetch<Property>("/api/properties/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getProperty(token: string, id: string) {
  return apiFetch<Property>(`/api/properties/${id}`, { token });
}

export function updateProperty(token: string, id: string, payload: UpdatePropertyPayload) {
  return apiFetch<Property>(`/api/properties/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteProperty(token: string, id: string) {
  return apiFetch<void>(`/api/properties/${id}`, { method: "DELETE", token });
}

export function publishProperty(token: string, id: string) {
  return apiFetch<Property>(`/api/properties/${id}/publish`, { method: "POST", token });
}

export function archiveProperty(token: string, id: string) {
  return apiFetch<Property>(`/api/properties/${id}/archive`, { method: "POST", token });
}

export function createRoom(token: string, hotelPropertyId: string) {
  return apiFetch<Property>(`/api/properties/${hotelPropertyId}/rooms`, {
    method: "POST",
    token,
  });
}

/** Uploads an already-WebP-compressed file to the backend, which forwards it to the bucket. */
export function uploadPropertyPhoto(
  token: string,
  id: string,
  file: File,
  options: { isCover?: boolean; section?: PhotoSection; sectionDetail?: string } = {},
) {
  const formData = new FormData();
  formData.append("file", file, file.name);
  if (options.isCover) formData.append("isCover", "true");
  if (options.section) formData.append("section", options.section);
  if (options.sectionDetail) formData.append("sectionDetail", options.sectionDetail);

  return apiFetch<Property>(`/api/properties/${id}/photos`, {
    method: "POST",
    token,
    body: formData,
  });
}

export function addPropertyPhotoByUrl(
  token: string,
  id: string,
  payload: { url: string; isCover?: boolean },
) {
  return apiFetch<Property>(`/api/properties/${id}/photos`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function removePropertyPhoto(token: string, id: string, photoId: string) {
  return apiFetch<Property>(`/api/properties/${id}/photos/${photoId}`, {
    method: "DELETE",
    token,
  });
}

export function listOwners(token: string) {
  return apiFetch<PropertyOwner[]>("/api/properties/owners", { token });
}

export function createOwner(
  token: string,
  payload: { name: string; email?: string; phone?: string; notes?: string },
) {
  return apiFetch<PropertyOwner>("/api/properties/owners", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function listPublicProperties(
  agencySlug: string,
  filters: { listingType?: ListingType; category?: PropertyCategory } = {},
) {
  const params = new URLSearchParams();
  if (filters.listingType) params.set("listingType", filters.listingType);
  if (filters.category) params.set("category", filters.category);
  const query = params.toString();
  return apiFetch<Property[]>(
    `/api/public/${agencySlug}/properties${query ? `?${query}` : ""}`,
  );
}

export function getPublicProperty(agencySlug: string, propertySlug: string) {
  return apiFetch<Property>(`/api/public/${agencySlug}/properties/${propertySlug}`);
}

export function submitPropertyInquiry(
  agencySlug: string,
  payload: { name: string; email: string; phone?: string; message?: string; propertyId?: string },
) {
  return apiFetch<{ id: string }>(`/api/public/${agencySlug}/inquiries`, {
    method: "POST",
    body: JSON.stringify({ ...payload, inquiryType: "PROPERTY" }),
  });
}
