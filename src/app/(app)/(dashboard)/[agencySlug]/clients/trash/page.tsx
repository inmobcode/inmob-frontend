"use client";

import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { TrashView } from "@/components/trash/trash-view";
import { deleteClientForever, listTrashedClients, restoreClient } from "@/lib/api/clients";

export default function ClientsTrashPage() {
  const t = useTranslations("trash.pages.clients");
  const { agencySlug } = useParams<{ agencySlug: string }>();
  return (
    <TrashView
      title={t("title")}
      restoredText={t("restored")}
      backHref={`/${agencySlug}/clients`}
      backLabel={t("back")}
      queryKey={["clients", "trash"]}
      listKey={["clients"]}
      list={listTrashedClients}
      restore={restoreClient}
      deleteForever={deleteClientForever}
      icon={UserRound}
      toItem={(client) => ({
        id: client.id,
        title: client.name,
        subtitle: client.email,
        deletedAt: client.deletedAt ?? client.updatedAt,
      })}
    />
  );
}
