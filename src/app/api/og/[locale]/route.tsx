import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/config";
import { ogCard, ogFonts } from "@/lib/og-card";

/** The share card in one language: /api/og/en. Unknown languages get the Spanish one. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("ogTitle");
  const subtitle = t("ogSubtitle");
  return ogCard({ title, subtitle, fonts: await ogFonts(locale, `${title} ${subtitle} tivvo.app`) });
}
