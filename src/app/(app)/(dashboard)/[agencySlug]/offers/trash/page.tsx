"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { coversOf } from "@/components/offers/offer-card";
import { TrashView } from "@/components/trash/trash-view";
import { deleteOfferForever, listTrashedOffers, restoreOffer } from "@/lib/api/offers";

export default function OffersTrashPage() {
  const t = useTranslations("trash.pages.offers");
  const { agencySlug } = useParams<{ agencySlug: string }>();
  return (
    <TrashView
      title={t("title")}
      restoredText={t("restored")}
      backHref={`/${agencySlug}/offers`}
      backLabel={t("back")}
      queryKey={["offers", "trash"]}
      listKey={["offers"]}
      list={listTrashedOffers}
      restore={restoreOffer}
      deleteForever={deleteOfferForever}
      toItem={(offer) => ({
        id: offer.id,
        title: offer.title,
        subtitle: offer.clientName,
        imageUrl: coversOf(offer)[0],
        deletedAt: offer.deletedAt ?? offer.updatedAt,
      })}
    />
  );
}
