import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("team") };
}

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
