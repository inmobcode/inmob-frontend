import type { Metadata } from "next";
import { Suspense } from "react";

import { AgencyPortal } from "@/components/public/agency-portal";
import { resolveSite } from "@/lib/site-theme";

import { loadAgency, loadProperties } from "./data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}): Promise<Metadata> {
  const { agencySlug } = await params;
  const agency = await loadAgency(agencySlug);
  const site = resolveSite(agency.site);
  return {
    title: agency.name,
    description:
      site.heroSubtitle ?? `Propiedades en venta y alquiler de ${agency.name}.`,
    openGraph: site.coverUrl ? { images: [site.coverUrl] } : undefined,
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

  return (
    // The filters live in the address bar, which needs a Suspense boundary to read on the client.
    <Suspense fallback={null}>
      <AgencyPortal
        agencySlug={agencySlug}
        agency={agency}
        site={resolveSite(agency.site)}
        initialProperties={properties}
      />
    </Suspense>
  );
}
