import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { makeLabels, type LabelTranslator } from "@/lib/properties-labels";

/** useLabels() for Server Components and metadata. */
export async function getLabels(locale?: Locale) {
  const t = locale ? await getTranslations({ locale, namespace: "labels" }) : await getTranslations("labels");
  return makeLabels(t as unknown as LabelTranslator);
}
