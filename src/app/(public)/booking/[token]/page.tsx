import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { BookingView } from "@/components/public/booking-view";
import { getPublicBooking } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";

type Params = Promise<{ token: string }>;

const loadBooking = cache(async (token: string) => {
  try {
    return await getPublicBooking(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { token } = await params;
  const booking = await loadBooking(token);
  return {
    title: `Tu reserva · ${booking.agency.name}`,
    // A private link: keep it out of search engines.
    robots: { index: false, follow: false },
  };
}

export default async function BookingPage({ params }: { params: Params }) {
  const { token } = await params;
  const booking = await loadBooking(token);
  return <BookingView booking={booking} />;
}
