import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { OG_LOCALES, type Locale } from "@/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

/** The share card in `locale` (app/api/og/[locale]), for any page whose openGraph doesn't bring its own photos. */
export async function ogImages(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "meta" });
  return [{ url: `/api/og/${locale}`, width: 1200, height: 630, alt: t("ogAlt") }];
}

/** What both root layouts declare: the title template, description and Open Graph defaults, in `locale`. */
export async function rootMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    // Every relative canonical and Open Graph image below resolves against this.
    metadataBase: new URL(SITE_URL),
    // Pages set their own short title ("Propiedades", "Ingresar", …) and get
    // this suffix for free; only the root page (no override) shows "Tivvu" bare.
    title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
    description: t("description"),
    applicationName: SITE_NAME,
    // Agency sites and listings override these with their own name and photos.
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      images: await ogImages(locale),
    },
    twitter: { card: "summary_large_image" },
  };
}
