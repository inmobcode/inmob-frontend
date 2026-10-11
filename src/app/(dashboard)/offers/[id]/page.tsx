import { OfferEditor } from "@/components/offers/offer-editor";

export default async function OfferEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OfferEditor offerId={id} />;
}
