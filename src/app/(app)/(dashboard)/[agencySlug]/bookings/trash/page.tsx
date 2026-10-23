"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { TrashView } from "@/components/trash/trash-view";
import { deleteBookingForever, listTrashedBookings, restoreBooking } from "@/lib/api/bookings";

export default function BookingsTrashPage() {
  const t = useTranslations("trash.pages.bookings");
  const { agencySlug } = useParams<{ agencySlug: string }>();
  return (
    <TrashView
      title={t("title")}
      restoredText={t("restored")}
      backHref={`/${agencySlug}/bookings`}
      backLabel={t("back")}
      queryKey={["bookings", "trash"]}
      listKey={["bookings"]}
      list={listTrashedBookings}
      restore={restoreBooking}
      deleteForever={deleteBookingForever}
      toItem={(booking) => ({
        id: booking.id,
        title: booking.propertyTitle ?? t("untitled"),
        subtitle: booking.clientName,
        deletedAt: booking.deletedAt ?? booking.updatedAt,
      })}
    />
  );
}
