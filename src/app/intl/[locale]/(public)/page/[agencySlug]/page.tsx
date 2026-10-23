import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AgencyPortal } from "@/components/public/agency-portal";
import { JsonLd, compact } from "@/components/seo/json-ld";
import { richTextPlain } from "@/lib/rich-text";
import { isLocale, localePath } from "@/i18n/config";
import { absoluteUrl, agencyPath, localizedAlternates } from "@/lib/seo";
import { instagramLink, resolveSite } from "@/lib/site-theme";

import { loadAgency, loadProperties } from "./data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; agencySlug: string }>;
}): Promise<Metadata> {
  const { locale: raw, agencySlug } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const t = await getTranslations({ locale, namespace: "site.portal" });
  const agency = await loadAgency(agencySlug);
  const site = resolveSite(agency.site);
  const description = site.heroSubtitle ?? t("metaDescription", { agency: agency.name });
  const url = absoluteUrl(localePath(locale, agencyPath(agencySlug)));

  return {
    // Absolute: this is the agency's own public site, not a Tivvo surface.
    title: { absolute: agency.name },
    description,
    // The site answers on the app host too; only this one should be indexed.
    alternates: localizedAlternates(agencyPath(agencySlug), locale),
    openGraph: {
      type: "website",
      title: agency.name,
      description,
      url,
      siteName: agency.name,
      images: site.coverUrl ? [{ url: site.coverUrl, alt: agency.name }] : undefined,
    },
    twitter: {
      card: site.coverUrl ? "summary_large_image" : "summary",
      title: agency.name,
      description,
      images: site.coverUrl ? [site.coverUrl] : undefined,
    },
  };
}

export default async function AgencyPortalPage({
  params,
}: {
  params: Promise<{ locale: string; agencySlug: string }>;
}) {
  const { locale: raw, agencySlug } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const [agency, properties] = await Promise.all([
    loadAgency(agencySlug),
    loadProperties(agencySlug),
  ]);
  const site = resolveSite(agency.site);
  const url = absoluteUrl(localePath(locale, agencyPath(agencySlug)));

  return (
    <>
      {/* The agency as a business, so its site can be understood as one rather than a page of listings. */}
      <JsonLd
        data={compact({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: agency.name,
          url,
          // `about` is rich text: structured data takes the words, not the markup.
          description: site.about ? richTextPlain(site.about) : (site.heroSubtitle ?? undefined),
          logo: agency.logoUrl ?? undefined,
          image: site.coverUrl ?? agency.logoUrl ?? undefined,
          email: agency.contactEmail ?? undefined,
          telephone: site.phone ?? site.whatsapp ?? undefined,
          address: site.address ? { "@type": "PostalAddress", streetAddress: site.address } : undefined,
          // `sameAs` wants a URL; the agency may have typed just a handle.
          sameAs: site.instagram ? [instagramLink(site.instagram)] : undefined,
        })}
      />
      {/* The filters live in the address bar, which needs a Suspense boundary to read on the client. */}
      <Suspense fallback={null}>
        <AgencyPortal
          agencySlug={agencySlug}
          agency={agency}
          site={site}
          initialProperties={properties}
        />
      </Suspense>
    </>
  );
}
