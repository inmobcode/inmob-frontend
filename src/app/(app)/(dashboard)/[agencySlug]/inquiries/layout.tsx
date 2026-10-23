import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("inquiries") };
}

export default function InquiriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
