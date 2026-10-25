"use client";

import { Inbox } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { TrashView } from "@/components/trash/trash-view";
import { deleteInquiryForever, listTrashedInquiries, restoreInquiry } from "@/lib/api/inquiries";

export default function InquiriesTrashPage() {
  const t = useTranslations("trash.pages.inquiries");
  const { agencySlug } = useParams<{ agencySlug: string }>();
  return (
    <TrashView
      title={t("title")}
      restoredText={t("restored")}
      backHref={`/${agencySlug}/inquiries`}
      backLabel={t("back")}
      queryKey={["inquiries", "trash"]}
      listKey={["inquiries"]}
      list={listTrashedInquiries}
      restore={restoreInquiry}
      deleteForever={deleteInquiryForever}
      icon={Inbox}
      toItem={(inquiry) => ({
        id: inquiry.id,
        title: inquiry.name,
        subtitle: inquiry.property?.title ?? inquiry.offer?.title ?? inquiry.email,
        deletedAt: inquiry.deletedAt ?? inquiry.createdAt,
      })}
    />
  );
}
