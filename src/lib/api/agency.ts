import { siteCache } from "@/lib/site-cache";

import { apiFetch } from "./client";

export type SiteTemplate = "portada" | "editorial" | "compacto" | "dividido" | "mosaico";
export type SiteFonts =
  | "moderna"
  | "clasica"
  | "sobria"
  | "elegante"
  | "editorial"
  | "calida"
  | "urbana"
  | "arquitectonica";

export type SiteSectionType =
  "location" | "promo" | "featured" | "destinations" | "text" | "cta";

export type SectionLayout =
  | "split"
  | "banner"
  | "band"
  | "carousel"
  | "grid"
  | "tiles"
  | "image-left"
  | "image-right"
  | "centered"
  | "color"
  | "photo";

export type ButtonTarget = "contact" | "whatsapp" | "properties";

/** One place inside a `destinations` block. */
export interface Destination {
  id: string;
  name?: string | null;
  zone?: string | null;
  imageUrl?: string | null;
}

/**
 * A content block on the portal's home, in one of its layouts:
 * - `location`: a place with its photo, text and listings (by zone or chosen).
 * - `promo`: chosen listings under a label such as "15% OFF".
 * - `featured`: hand-picked listings.
 * - `destinations`: several places, each leading to its listings.
 * - `text`: free text with an image, for services or the agency's story.
 * - `cta`: a call to action with one button.
 */
export interface SiteSection {
  id: string;
  type: SiteSectionType;
  visible?: boolean;
  layout?: SectionLayout | null;
  title?: string | null;
  text?: string | null;
  imageUrl?: string | null;
  /** location: matched against each listing's area, region or country, unless listings are chosen. */
  zone?: string | null;
  /** promo: shown on the block and on every included listing. */
  badge?: string | null;
  propertyIds?: string[];
  /** promo: last day it applies, as YYYY-MM-DD. */
  endsAt?: string | null;
  destinations?: Destination[];
  buttonLabel?: string | null;
  buttonTarget?: ButtonTarget | null;
}

/** What an agency customized on its public site. Anything missing uses the defaults in `lib/site-theme.ts`. */
export interface SiteSettings {
  template?: SiteTemplate;
  /** The layout on phones; null or missing means the same as `template`. */
  templateMobile?: SiteTemplate | null;
  accent?: string;
  fonts?: SiteFonts;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  coverUrl?: string | null;
  /** The `mosaico` collage, in order (up to 4); empty uses the listings' cover photos. */
  mosaicPhotos?: string[];
  about?: string | null;
  showAbout?: boolean;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  instagram?: string | null;
  sections?: SiteSection[];
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  contactEmail: string | null;
  locale: string;
  currency: string;
  site: SiteSettings;
}

export type PublicAgency = Pick<
  Agency,
  "name" | "logoUrl" | "contactEmail" | "site"
>;

export interface UpdateAgencyPayload {
  name?: string;
  slug?: string;
  contactEmail?: string | null;
  locale?: string;
  currency?: string;
}

export function getAgency(token: string) {
  return apiFetch<Agency>("/api/agency/", { token });
}

export function updateAgency(token: string, payload: UpdateAgencyPayload) {
  return apiFetch<Agency>("/api/agency/", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function uploadAgencyLogo(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file, file.name);
  return apiFetch<Agency>("/api/agency/logo", {
    method: "POST",
    token,
    body: formData,
  });
}

/** Merges the given keys into the site settings; keys not sent stay as they were. */
export function updateSite(token: string, payload: SiteSettings) {
  return apiFetch<Agency>("/api/agency/site", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function uploadAgencyCover(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file, file.name);
  return apiFetch<Agency>("/api/agency/cover", {
    method: "POST",
    token,
    body: formData,
  });
}

/** Uploads an image for a content block; the block itself is saved with `updateSite`. */
export function uploadSiteImage(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file, file.name);
  return apiFetch<{ url: string }>("/api/agency/site-image", {
    method: "POST",
    token,
    body: formData,
  });
}

export function getPublicAgency(agencySlug: string) {
  return apiFetch<PublicAgency>(`/api/public/${agencySlug}`, siteCache(agencySlug));
}
