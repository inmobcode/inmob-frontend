import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DocumentShell } from "@/components/document-shell";
import { isLocale, LOCALES } from "@/i18n/config";

import { rootMetadata } from "../../root-metadata";
import "../../globals.css";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/intl/[locale]">) {
  const { locale } = await params;
  return isLocale(locale) ? rootMetadata(locale) : {};
}

/**
 * Root layout of the public site — the landing, legal pages and every agency's
 * site — in the language of the URL. /terms is Spanish, /en/terms English: the
 * proxy maps both onto this folder (src/proxy.ts).
 */
export default async function SiteRootLayout({ children, params }: LayoutProps<"/intl/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <DocumentShell lang={locale}>
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </DocumentShell>
  );
}
