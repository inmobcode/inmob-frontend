import type { LegalContent } from "@/components/legal/legal-document";
import type { Locale } from "@/i18n/config";

import { content as privacyDe } from "./privacy.de";
import { content as privacyEl } from "./privacy.el";
import { content as privacyEn } from "./privacy.en";
import { content as privacyEs } from "./privacy.es";
import { content as privacyFr } from "./privacy.fr";
import { content as privacyHr } from "./privacy.hr";
import { content as privacyIt } from "./privacy.it";
import { content as privacyPt } from "./privacy.pt";
import { content as termsDe } from "./terms.de";
import { content as termsEl } from "./terms.el";
import { content as termsEn } from "./terms.en";
import { content as termsEs } from "./terms.es";
import { content as termsFr } from "./terms.fr";
import { content as termsHr } from "./terms.hr";
import { content as termsIt } from "./terms.it";
import { content as termsPt } from "./terms.pt";

/**
 * The legal documents, one module per language: long documents with lists,
 * tables and links read and translate better whole than as hundreds of loose
 * message keys. Every language has its own version; the Spanish one rules, and
 * each translation says so in its intro.
 */
const DOCUMENTS: Record<"terms" | "privacy", Record<Locale, LegalContent>> = {
  terms: { es: termsEs, en: termsEn, pt: termsPt, fr: termsFr, de: termsDe, it: termsIt, el: termsEl, hr: termsHr },
  privacy: { es: privacyEs, en: privacyEn, pt: privacyPt, fr: privacyFr, de: privacyDe, it: privacyIt, el: privacyEl, hr: privacyHr },
};

export function legalContent(document: "terms" | "privacy", locale: Locale): LegalContent {
  return DOCUMENTS[document][locale];
}
