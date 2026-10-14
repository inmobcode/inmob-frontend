import type { SiteSettings } from "@/lib/api/agency";
import { resolveSite } from "@/lib/site-theme";

/** Every setting the editor manages, with empty strings for "not set". */
export type Draft = Required<{
  [K in Exclude<keyof SiteSettings, "templateMobile">]: NonNullable<SiteSettings[K]>;
}> & {
  /** "" while phones use the same layout as desktop. */
  templateMobile: NonNullable<SiteSettings["templateMobile"]> | "";
};

export const HEX = /^#[0-9a-fA-F]{6}$/;

export function toDraft(site: SiteSettings | undefined): Draft {
  const resolved = resolveSite(site);
  return {
    template: resolved.template,
    templateMobile: site?.templateMobile ?? "",
    accent: resolved.accent,
    fonts: resolved.fonts,
    heroTitle: site?.heroTitle ?? "",
    heroSubtitle: site?.heroSubtitle ?? "",
    coverUrl: site?.coverUrl ?? "",
    mosaicPhotos: site?.mosaicPhotos ?? [],
    about: site?.about ?? "",
    showAbout: resolved.showAbout,
    phone: site?.phone ?? "",
    whatsapp: site?.whatsapp ?? "",
    address: site?.address ?? "",
    instagram: site?.instagram ?? "",
    sections: site?.sections ?? [],
  };
}

/** What gets saved: empty texts go back to "not set" so the defaults apply. */
export function toPayload(draft: Draft): SiteSettings {
  const text = (value: string) => (value.trim() ? value.trim() : null);
  return {
    template: draft.template,
    templateMobile: draft.templateMobile && draft.templateMobile !== draft.template ? draft.templateMobile : null,
    accent: draft.accent,
    fonts: draft.fonts,
    heroTitle: text(draft.heroTitle),
    heroSubtitle: text(draft.heroSubtitle),
    coverUrl: text(draft.coverUrl),
    mosaicPhotos: draft.mosaicPhotos,
    about: text(draft.about),
    showAbout: draft.showAbout,
    phone: text(draft.phone),
    whatsapp: text(draft.whatsapp),
    address: text(draft.address),
    instagram: text(draft.instagram),
    sections: draft.sections.map((section) => ({
      ...section,
      title: text(section.title ?? ""),
      text: text(section.text ?? ""),
      zone: text(section.zone ?? ""),
      badge: text(section.badge ?? ""),
      buttonLabel: text(section.buttonLabel ?? ""),
      destinations: (section.destinations ?? []).map((destination) => ({
        ...destination,
        name: text(destination.name ?? ""),
        zone: text(destination.zone ?? ""),
      })),
    })),
  };
}

export function sameDraft(a: Draft, b: Draft) {
  return JSON.stringify(toPayload(a)) === JSON.stringify(toPayload(b));
}

export type SetDraft = <K extends keyof Draft>(key: K, value: Draft[K]) => void;
