import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return {
    title: t("authCallback"),
    // A redirect bounce, never a real destination.
    robots: { index: false, follow: false },
  };
}

export default function AuthCallbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
