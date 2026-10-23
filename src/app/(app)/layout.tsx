import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { DocumentShell } from "@/components/document-shell";

import { rootMetadata } from "../root-metadata";
import "../globals.css";

export async function generateMetadata() {
  return rootMetadata(await getLocale());
}

/**
 * Root layout of the app: sign-in, the dashboard, the site editor and the docs.
 * No language in the URL here: it follows the person's choice (LOCALE_COOKIE)
 * or their browser. See src/i18n/request.ts.
 */
export default async function AppRootLayout({ children }: LayoutProps<"/">) {
  return (
    <DocumentShell lang={await getLocale()}>
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </DocumentShell>
  );
}
