"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { coverPhoto, placeOf } from "@/components/public/property-card";
import { TrashView } from "@/components/trash/trash-view";
import { deletePropertyForever, listTrashedProperties, restoreProperty } from "@/lib/api/properties";

export default function PropertiesTrashPage() {
  const t = useTranslations("trash.pages.properties");
  const { agencySlug } = useParams<{ agencySlug: string }>();
  return (
    <TrashView
      title={t("title")}
      restoredText={t("restored")}
      backHref={`/${agencySlug}/properties`}
      backLabel={t("back")}
      queryKey={["properties", "trash"]}
      listKey={["properties"]}
      list={listTrashedProperties}
      restore={restoreProperty}
      deleteForever={deletePropertyForever}
      toItem={(property) => ({
        id: property.id,
        title: property.title,
        subtitle: placeOf(property),
        imageUrl: coverPhoto(property)?.url,
        deletedAt: property.deletedAt ?? property.updatedAt,
      })}
    />
  );
}
