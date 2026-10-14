import type {
  ButtonTarget,
  SectionLayout,
  SiteFonts,
  SiteSection,
  SiteSettings,
  SiteTemplate,
} from "@/lib/api/agency";

/**
 * The agency's public site is theirs, not Tivvo's: a neutral base the agency
 * personalizes with a layout, an accent color, a type pairing, a cover photo
 * and its own texts. Everything here has a sensible default so a brand-new
 * agency already gets a site that looks finished.
 */

export const SITE_TEMPLATES: {
  value: SiteTemplate;
  label: string;
  description: string;
}[] = [
  {
    value: "portada",
    label: "Portada",
    description: "Una foto grande de portada con el buscador encima.",
  },
  {
    value: "editorial",
    label: "Editorial",
    description:
      "Titular grande al lado de la foto y fichas más amplias, con descripción.",
  },
  {
    value: "compacto",
    label: "Compacto",
    description:
      "Sin foto de portada. Muestra muchas propiedades de un vistazo.",
  },
  {
    value: "dividido",
    label: "Dividido",
    description:
      "Mitad en tu color con el titular y el buscador, mitad con la foto de portada.",
  },
  {
    value: "mosaico",
    label: "Mosaico",
    description:
      "Un collage de fotos arriba, que elegís en Portada, y la primera propiedad destacada en grande.",
  },
];

export const ACCENT_PRESETS: { value: string; label: string }[] = [
  { value: "#22302A", label: "Carbón" },
  { value: "#1F5F4A", label: "Bosque" },
  { value: "#0F6E74", label: "Petróleo" },
  { value: "#1E4E8C", label: "Azul" },
  { value: "#3F3D8F", label: "Índigo" },
  { value: "#8C3B2E", label: "Ladrillo" },
  { value: "#A86A1D", label: "Ocre" },
  { value: "#6B5643", label: "Madera" },
];

/**
 * Type pairings for the agency's site. Each sets its own heading weight and
 * tracking: serif display faces read best at their regular weight and almost
 * untracked, geometric sans tighter and heavier. The fonts are loaded in the
 * root layout.
 */
export const FONT_PAIRS: {
  value: SiteFonts;
  label: string;
  description: string;
  heading: string;
  body: string;
  weight: number;
  tracking: string;
}[] = [
  {
    value: "moderna",
    label: "Moderna",
    description: "Títulos geométricos, limpios.",
    heading: "var(--font-sora)",
    body: "var(--font-dm-sans)",
    weight: 600,
    tracking: "-0.03em",
  },
  {
    value: "clasica",
    label: "Clásica",
    description: "Títulos con serif, elegante.",
    heading: "var(--font-dm-serif-display)",
    body: "var(--font-dm-sans)",
    weight: 400,
    tracking: "-0.01em",
  },
  {
    value: "sobria",
    label: "Sobria",
    description: "Una sola familia, discreta.",
    heading: "var(--font-dm-sans)",
    body: "var(--font-dm-sans)",
    weight: 600,
    tracking: "-0.03em",
  },
  {
    value: "elegante",
    label: "Elegante",
    description: "Serif fina, para propiedades de lujo.",
    heading: "var(--font-cormorant)",
    body: "var(--font-manrope)",
    weight: 600,
    tracking: "-0.01em",
  },
  {
    value: "editorial",
    label: "Editorial",
    description: "Serif con carácter, como una revista.",
    heading: "var(--font-fraunces)",
    body: "var(--font-source-sans)",
    weight: 500,
    tracking: "-0.02em",
  },
  {
    value: "calida",
    label: "Cálida",
    description: "Serif suave y texto redondeado.",
    heading: "var(--font-lora)",
    body: "var(--font-nunito-sans)",
    weight: 600,
    tracking: "-0.01em",
  },
  {
    value: "urbana",
    label: "Urbana",
    description: "Sans actual, clara y amigable.",
    heading: "var(--font-jakarta)",
    body: "var(--font-jakarta)",
    weight: 700,
    tracking: "-0.03em",
  },
  {
    value: "arquitectonica",
    label: "Arquitectónica",
    description: "Títulos anchos y con presencia.",
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
  heroTitle: string;
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

export const DEFAULT_HERO_TITLE = "Encontrá tu próxima propiedad";

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
    heroTitle: value(site?.heroTitle) ?? DEFAULT_HERO_TITLE,
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

export const SECTION_TYPES: {
  value: SiteSection["type"];
  label: string;
  description: string;
  layouts: { value: SectionLayout; label: string }[];
}[] = [
  {
    value: "location",
    label: "Ubicación",
    description:
      "Una zona con foto, texto y sus propiedades. Ideal para Ibiza, Grecia o tu barrio.",
    layouts: [
      { value: "split", label: "Destacado" },
      { value: "banner", label: "Banner" },
      { value: "carousel", label: "Carrusel" },
    ],
  },
  {
    value: "promo",
    label: "Promoción",
    description:
      "Propiedades con una etiqueta como “15% OFF” u “Oferta de temporada”.",
    layouts: [
      { value: "band", label: "Banda de color" },
      { value: "banner", label: "Banner con foto" },
      { value: "carousel", label: "Carrusel" },
    ],
  },
  {
    value: "featured",
    label: "Propiedades destacadas",
    description:
      "Una selección tuya: lo más nuevo, frente al mar, las más pedidas.",
    layouts: [
      { value: "grid", label: "Grilla" },
      { value: "carousel", label: "Carrusel" },
    ],
  },
  {
    value: "destinations",
    label: "Destinos",
    description:
      "Varias zonas a la vez, cada una con su foto. Al tocar una, se filtra el listado.",
    layouts: [
      { value: "tiles", label: "Mosaico" },
      { value: "carousel", label: "Carrusel" },
    ],
  },
  {
    value: "text",
    label: "Texto e imagen",
    description: "Contá algo propio: tus servicios, tasaciones, cómo trabajan.",
    layouts: [
      { value: "image-left", label: "Imagen a la izquierda" },
      { value: "image-right", label: "Imagen a la derecha" },
      { value: "centered", label: "Solo texto" },
    ],
  },
  {
    value: "cta",
    label: "Llamado a la acción",
    description:
      "Una invitación con un botón, como “¿Querés vender tu propiedad?”.",
    layouts: [
      { value: "color", label: "Color" },
      { value: "photo", label: "Con foto" },
    ],
  },
];

export const BUTTON_TARGETS: { value: ButtonTarget; label: string }[] = [
  { value: "contact", label: "Formulario de contacto" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "properties", label: "Listado de propiedades" },
];

/** The block's layout if it's one its type offers, its type's first layout otherwise. */
export function sectionLayout(section: SiteSection): SectionLayout {
  const layouts =
    SECTION_TYPES.find((type) => type.value === section.type)?.layouts ?? [];
  return (
    layouts.find((layout) => layout.value === section.layout)?.value ??
    layouts[0]?.value ??
    "split"
  );
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function newSection(type: SiteSection["type"]): SiteSection {
  const layout =
    SECTION_TYPES.find((option) => option.value === type)?.layouts[0]?.value ??
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

/** "31 de diciembre" from "2026-12-31", read as a local date. */
export function formatEndDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
  });
}
