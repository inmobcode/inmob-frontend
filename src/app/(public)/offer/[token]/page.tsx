import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { SharedOfferView } from "@/components/offers/shared-offer-view";
import { ApiError } from "@/lib/api/client";
import { getPublicOffer } from "@/lib/api/offers";

type Params = Promise<{ token: string }>;

const loadOffer = cache(async (token: string) => {
  try {
    return await getPublicOffer(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
});

/** The first cover photo among the offer's properties, in display order. */
function coverOf(offer: Awaited<ReturnType<typeof loadOffer>>) {
  for (const section of offer.sections) {
    for (const item of section.properties) {
      const photos = [...item.property.photos].sort(
        (a, b) => Number(b.isCover) - Number(a.isCover) || a.position - b.position,
      );
      if (photos[0]) return photos[0].url;
    }
  }
  return undefined;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { token } = await params;
  const offer = await loadOffer(token);
  const cover = coverOf(offer);
  return {
    // Absolute: this is the agency's own offer link, not a Tivvo surface.
    title: { absolute: offer.title },
    // A private link: keep it out of search engines.
    robots: { index: false, follow: false },
    openGraph: cover ? { images: [cover] } : undefined,
  };
}

export default async function SharedOfferPage({ params }: { params: Params }) {
  const { token } = await params;
  const offer = await loadOffer(token);
  return <SharedOfferView initialOffer={offer} />;
}
