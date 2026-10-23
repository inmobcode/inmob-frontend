import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { NewLanding } from "@/components/marketplace/new-landing";
import { getMarketplaceFacets, type MarketplaceFacets } from "@/lib/api/marketplace";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("marketplace");
  return {
    // Absolute: reads better without "· Tivvu" tacked on twice.
    title: { absolute: t("metaTitle") },
    description: t("hero.lead"),
    // Not the public landing right now: kept reachable for testing, out of the index.
    robots: { index: false, follow: false },
  };
}

const EMPTY: MarketplaceFacets = {
  total: 0,
  agencies: 0,
  operations: { SALE: 0, RENT: 0 },
  zones: [],
  categories: [],
};

export default async function LandingTestPage() {
  // Places and types to browse come from the server, so the first paint already has them.
  const facets = await getMarketplaceFacets().catch(() => EMPTY);
  return (
    <Suspense>
      <NewLanding facets={facets} />
    </Suspense>
  );
}
