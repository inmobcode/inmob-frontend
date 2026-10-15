import type { Metadata } from "next";
import { Suspense } from "react";

import { AgencyPortal } from "@/components/public/agency-portal";
import { JsonLd, compact } from "@/components/seo/json-ld";
import { richTextPlain } from "@/lib/rich-text";
import { absoluteUrl, agencyPath } from "@/lib/seo";
import { instagramLink, resolveSite } from "@/lib/site-theme";

import { loadAgency, loadProperties } from "./data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}): Promise<Metadata> {
  const { agencySlug } = await params;
  const agency = await loadAgency(agencySlug);
  const site = resolveSite(agency.site);
  const description =
    site.heroSubtitle ?? `Propiedades en venta y alquiler de ${agency.name}.`;
  const url = absoluteUrl(agencyPath(agencySlug));

  return {
    // Absolute: this is the agency's own public site, not a Tivvo surface.
    title: { absolute: agency.name },
    description,
    // The site answers on the app host too; only this one should be indexed.
    alternates: { canonical: url },
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
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;
  const [agency, properties] = await Promise.all([
    loadAgency(agencySlug),
    loadProperties(agencySlug),
  ]);
  const site = resolveSite(agency.site);
  const url = absoluteUrl(agencyPath(agencySlug));

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
