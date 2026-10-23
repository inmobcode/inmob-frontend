import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { LegalDocument } from "@/components/legal/legal-document";
import { legalContent } from "@/content/legal";
import { isLocale, type Locale } from "@/i18n/config";
import { localizedAlternates } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

async function load(params: Params) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  return { locale, content: legalContent("terms", locale) };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, content } = await load(params);
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: localizedAlternates("/terms", locale),
  };
}

export default async function TermsPage({ params }: { params: Params }) {
  const { locale, content } = await load(params);
  setRequestLocale(locale);
  return <LegalDocument {...content} />;
}
