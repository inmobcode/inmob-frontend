import { notFound } from "next/navigation";

import { SharedOfferView } from "@/components/offers/shared-offer-view";
import { ApiError } from "@/lib/api/client";
import { getPublicOffer } from "@/lib/api/offers";

export default async function SharedOfferPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let offer;
  try {
    offer = await getPublicOffer(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return <SharedOfferView initialOffer={offer} />;
}
