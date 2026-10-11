import { BookingDetail } from "@/components/bookings/booking-detail";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookingDetail bookingId={id} />;
}
