"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { TrashView } from "@/components/trash/trash-view";
import { deleteServiceForever, listTrashedServices, restoreService } from "@/lib/api/services";

export default function ServicesTrashPage() {
  const t = useTranslations("trash.pages.services");
  const { agencySlug } = useParams<{ agencySlug: string }>();
  return (
    <TrashView
      title={t("title")}
      restoredText={t("restored")}
      backHref={`/${agencySlug}/services`}
      backLabel={t("back")}
      queryKey={["services", "trash"]}
      listKey={["services"]}
      list={listTrashedServices}
      restore={restoreService}
      deleteForever={deleteServiceForever}
      toItem={(service) => ({
        id: service.id,
        title: service.name,
        subtitle: service.provider,
        imageUrl: service.imageUrl,
        deletedAt: service.deletedAt ?? service.updatedAt,
      })}
    />
  );
}
