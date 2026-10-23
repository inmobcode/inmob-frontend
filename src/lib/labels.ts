import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { makeLabels, type LabelTranslator } from "@/lib/properties-labels";

/** The catalog words (categories, statuses, amenities…) in the page's language. */
export function useLabels() {
  const t = useTranslations("labels");
  return useMemo(() => makeLabels(t as unknown as LabelTranslator), [t]);
}
