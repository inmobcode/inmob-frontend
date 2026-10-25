import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("reports") };
}

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
