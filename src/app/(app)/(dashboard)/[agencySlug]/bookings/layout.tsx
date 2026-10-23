import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("bookings") };
}

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
