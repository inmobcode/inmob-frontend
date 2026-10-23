import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { DocumentShell } from "@/components/document-shell";
import { Plan404 } from "@/components/not-found/plan-404";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("metaTitle"), robots: { index: false } };
}

/**
 * The 404 for addresses no route matches. With two root layouts (the app and
 * the localized site) there's no single layout to hang a not-found on, so this
 * one brings its own document. Its language follows the person's choice.
 */
export default async function GlobalNotFound() {
  return (
    <DocumentShell lang={await getLocale()}>
      <NextIntlClientProvider>
        <Plan404 />
      </NextIntlClientProvider>
    </DocumentShell>
  );
}
