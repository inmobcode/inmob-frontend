import type { Metadata } from "next";
import { Suspense } from "react";

import { NewLanding } from "@/components/marketplace/new-landing";
import { getMarketplaceFacets, type MarketplaceFacets } from "@/lib/api/marketplace";

export const metadata: Metadata = {
  title: "Tivvo · Alquileres temporarios y propiedades en venta",
  description:
    "Casas, departamentos y villas de inmobiliarias reales. Elegí fechas, mirá qué está libre y consultá directo a quien la publica.",
};

const EMPTY: MarketplaceFacets = {
  total: 0,
  agencies: 0,
  operations: { SALE: 0, RENT: 0 },
  zones: [],
  categories: [],
};

export default async function Home() {
  // Places and types to browse come from the server, so the first paint already has them.
  const facets = await getMarketplaceFacets().catch(() => EMPTY);
  return (
    <Suspense>
      <NewLanding facets={facets} />
    </Suspense>
  );
}
