import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("site.offer");
  const offer = await loadOffer(token);
  const cover = coverOf(offer);
  const count = offer.sections.reduce((total, section) => total + section.properties.length, 0);
  // Sent by WhatsApp and email, so the card has to say what it is on its own.
  const description = offer.welcomeTitle?.trim()
    ? offer.welcomeTitle
    : t("metaDescription", { count });

  return {
    // Absolute: this is the agency's own offer link, not a Tivvo surface.
    title: { absolute: offer.title },
    description,
    // A private link: keep it out of search engines.
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      title: offer.title,
      description,
      images: cover ? [{ url: cover, alt: offer.title }] : undefined,
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title: offer.title,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function SharedOfferPage({ params }: { params: Params }) {
  const { token } = await params;
  const offer = await loadOffer(token);
  return <SharedOfferView initialOffer={offer} />;
}
