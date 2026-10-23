import type { Locale } from "@/i18n/config";

import { DOC_SECTIONS as de } from "./de";
import { DOC_SECTIONS as el } from "./el";
import { DOC_SECTIONS as en } from "./en";
import { DOC_SECTIONS as es } from "./es";
import { DOC_SECTIONS as fr } from "./fr";
import { DOC_SECTIONS as hr } from "./hr";
import { DOC_SECTIONS as it } from "./it";
import { DOC_SECTIONS as pt } from "./pt";
import type { DocEntry } from "./types";

/**
 * The dashboard's guide, one module per language (like the legal documents):
 * a long text with steps, figures and tips reads and translates better whole.
 */
const GUIDES: Record<Locale, DocEntry[]> = { es, en, pt, fr, de, it, el, hr };

export function docSections(locale: Locale): DocEntry[] {
  return GUIDES[locale];
}

export type { DocEntry };
