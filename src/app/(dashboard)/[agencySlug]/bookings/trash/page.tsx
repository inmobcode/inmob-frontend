"use client";

import { useParams } from "next/navigation";

import { TrashView } from "@/components/trash/trash-view";
import { deleteBookingForever, listTrashedBookings, restoreBooking } from "@/lib/api/bookings";

export default function BookingsTrashPage() {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  return (
    <TrashView
      title="Papelera de reservas"
      noun="la reserva"
      backHref={`/${agencySlug}/bookings`}
      backLabel="Reservas"
      queryKey={["bookings", "trash"]}
      listKey={["bookings"]}
      list={listTrashedBookings}
      restore={restoreBooking}
      deleteForever={deleteBookingForever}
      toItem={(booking) => ({
        id: booking.id,
        title: booking.propertyTitle ?? "Reserva",
        subtitle: booking.clientName,
        deletedAt: booking.deletedAt ?? booking.updatedAt,
      })}
    />
  );
}
