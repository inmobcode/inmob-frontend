import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return {
    title: t("resetPassword"),
    // Only ever opened from a one-time emailed link.
    robots: { index: false, follow: false },
  };
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
