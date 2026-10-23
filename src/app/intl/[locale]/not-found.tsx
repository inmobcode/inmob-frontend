import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Plan404 } from "@/components/not-found/plan-404";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("metaTitle"), robots: { index: false } };
}

export default function NotFound() {
  return <Plan404 />;
}
