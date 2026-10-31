import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("verifyEmail") };
}

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
