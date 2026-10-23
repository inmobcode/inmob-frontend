import type {
  ButtonTarget,
  SectionLayout,
  SiteFonts,
  SiteSection,
  SiteSettings,
  SiteTemplate,
} from "@/lib/api/agency";

/**
 * The agency's public site is theirs, not Tivvu's: a neutral base the agency
 * personalizes with a layout, an accent color, a type pairing, a cover photo
 * and its own texts. Everything here has a sensible default so a brand-new
 * agency already gets a site that looks finished.
 */

// Their names and descriptions: "portalEditor.templates" in the messages.
export const SITE_TEMPLATES: SiteTemplate[] = ["portada", "editorial", "compacto", "dividido", "mosaico"];

/** `name` is its key in "portalEditor.accents". */
type AccentName = "charcoal" | "forest" | "petrol" | "blue" | "indigo" | "brick" | "ochre" | "wood";

export const ACCENT_PRESETS: { value: string; name: AccentName }[] = [
  { value: "#22302A", name: "charcoal" },
  { value: "#1F5F4A", name: "forest" },
  { value: "#0F6E74", name: "petrol" },
  { value: "#1E4E8C", name: "blue" },
  { value: "#3F3D8F", name: "indigo" },
  { value: "#8C3B2E", name: "brick" },
  { value: "#A86A1D", name: "ochre" },
  { value: "#6B5643", name: "wood" },
];

/**
 * Type pairings for the agency's site. Each sets its own heading weight and
 * tracking: serif display faces read best at their regular weight and almost
 * untracked, geometric sans tighter and heavier. The fonts are loaded in the
 * root layout.
 */
// Names and descriptions: "portalEditor.fonts" in the messages.
export const FONT_PAIRS: {
  value: SiteFonts;
  heading: string;
  body: string;
  weight: number;
  tracking: string;
}[] = [
  {
    value: "moderna",
    heading: "var(--font-sora)",
    body: "var(--font-dm-sans)",
    weight: 600,
    tracking: "-0.03em",
  },
  {
    value: "clasica",
    heading: "var(--font-dm-serif-display)",
    body: "var(--font-dm-sans)",
    weight: 400,
    tracking: "-0.01em",
  },
  {
    value: "sobria",
    heading: "var(--font-dm-sans)",
    body: "var(--font-dm-sans)",
    weight: 600,
    tracking: "-0.03em",
  },
  {
    value: "elegante",
    heading: "var(--font-cormorant)",
    body: "var(--font-manrope)",
    weight: 600,
    tracking: "-0.01em",
  },
  {
    value: "editorial",
    heading: "var(--font-fraunces)",
    body: "var(--font-source-sans)",
    weight: 500,
    tracking: "-0.02em",
  },
  {
    value: "calida",
    heading: "var(--font-lora)",
    body: "var(--font-nunito-sans)",
    weight: 600,
    tracking: "-0.01em",
  },
  {
    value: "urbana",
    heading: "var(--font-jakarta)",
    body: "var(--font-jakarta)",
    weight: 700,
    tracking: "-0.03em",
  },
  {
    value: "arquitectonica",
    heading: "var(--font-syne)",
    body: "var(--font-inter)",
    weight: 700,
    tracking: "-0.02em",
  },
];

export interface ResolvedSite {
  template: SiteTemplate;
  /** On phones; the same as `template` unless the agency picked another. */
  templateMobile: SiteTemplate;
  accent: string;
  fonts: SiteFonts;
  /** Null when the agency left it empty: the page shows a default in its own language. */
  heroTitle: string | null;
  heroSubtitle: string | null;
  coverUrl: string | null;
  mosaicPhotos: string[];
  about: string | null;
  showAbout: boolean;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  instagram: string | null;
  /** Only the blocks the agency left visible, in their order. */
  sections: SiteSection[];
}

/** Fills in every setting the agency hasn't chosen yet. */
export function resolveSite(
  site: SiteSettings | null | undefined,
): ResolvedSite {
  const value = (text: string | null | undefined) =>
    text && text.trim() ? text.trim() : null;
  return {
    template: site?.template ?? "portada",
    templateMobile: site?.templateMobile ?? site?.template ?? "portada",
    accent: site?.accent ?? ACCENT_PRESETS[0].value,
    fonts: site?.fonts ?? "moderna",
    heroTitle: value(site?.heroTitle),
    heroSubtitle: value(site?.heroSubtitle),
    coverUrl: value(site?.coverUrl),
    mosaicPhotos: site?.mosaicPhotos ?? [],
    about: value(site?.about),
    showAbout: site?.showAbout ?? true,
    phone: value(site?.phone),
    whatsapp: value(site?.whatsapp),
    address: value(site?.address),
    instagram: value(site?.instagram),
    sections: (site?.sections ?? []).filter(
      (section) => section.visible !== false,
    ),
  };
}

function luminance(hex: string) {
  const channels = [1, 3, 5].map(
    (start) => parseInt(hex.slice(start, start + 2), 16) / 255,
  );
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** White or near-black, whichever reads better on the accent color. */
export function accentInk(hex: string) {
  const l = luminance(hex);
  const contrastWhite = 1.05 / (l + 0.05);
  const contrastDark = (l + 0.05) / 0.05;
  return contrastWhite >= contrastDark ? "#ffffff" : "#16191a";
}

/** CSS variables the `.site` scope reads; set on the site's root element. */
export function siteThemeStyle(site: ResolvedSite): React.CSSProperties {
  const fonts =
    FONT_PAIRS.find((pair) => pair.value === site.fonts) ?? FONT_PAIRS[0];
  return {
    "--s-accent": site.accent,
    "--s-accent-ink": accentInk(site.accent),
    "--s-heading": fonts.heading,
    "--s-body": fonts.body,
    "--s-heading-tracking": fonts.tracking,
    "--s-heading-weight": String(fonts.weight),
  } as React.CSSProperties;
}

/** A `wa.me` link from whatever format the agency typed the number in. */
export function whatsappLink(number: string, message?: string) {
  const digits = number.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function instagramLink(handle: string) {
  if (/^https?:\/\//.test(handle)) return handle;
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

/** Their names, descriptions and layout names: "portalEditor.sections" in the messages. */
export const SECTION_TYPES: { value: SiteSection["type"]; layouts: SectionLayout[] }[] = [
  { value: "location", layouts: ["split", "banner", "carousel"] },
  { value: "promo", layouts: ["band", "banner", "carousel"] },
  { value: "featured", layouts: ["grid", "carousel"] },
  { value: "destinations", layouts: ["tiles", "carousel"] },
  { value: "text", layouts: ["image-left", "image-right", "centered"] },
  { value: "cta", layouts: ["color", "photo"] },
];

export const BUTTON_TARGETS: ButtonTarget[] = ["contact", "whatsapp", "properties"];

/** The block's layout if it's one its type offers, its type's first layout otherwise. */
export function sectionLayout(section: SiteSection): SectionLayout {
  const layouts =
    SECTION_TYPES.find((type) => type.value === section.type)?.layouts ?? [];
  return (
    layouts.find((layout) => layout === section.layout) ??
    layouts[0] ??
    "split"
  );
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function newSection(type: SiteSection["type"]): SiteSection {
  const layout =
    SECTION_TYPES.find((option) => option.value === type)?.layouts[0] ??
    null;
  return {
    id: newId(),
    type,
    visible: true,
    layout,
    title: "",
    text: "",
    imageUrl: null,
    zone: null,
    badge: type === "promo" ? "" : null,
    propertyIds: [],
    endsAt: null,
    destinations:
      type === "destinations"
        ? [{ id: newId(), name: "", zone: "", imageUrl: null }]
        : [],
    buttonLabel: type === "cta" ? "Escribinos" : null,
    buttonTarget: type === "cta" ? "contact" : null,
  };
}

/** "31 de diciembre" from "2026-12-31", read as a local date, in the language of `tag` (BCP 47). */
export function formatEndDate(iso: string, tag: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(tag, {
    day: "numeric",
    month: "long",
  });
}
