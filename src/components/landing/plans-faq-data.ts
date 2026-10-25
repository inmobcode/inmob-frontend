import { localePath, type Locale } from "@/i18n/config";
import type { LooseTranslator } from "@/i18n/loose";

/**
 * The plans and FAQ of the landing. They live apart from the section that
 * paints them because the page also publishes them as structured data, and
 * Google only accepts an answer in schema.org that the visitor can read on the
 * page: one list, two readers. The words are in the "landing.plans" and
 * "landing.faq" messages.
 */

export interface Plan {
  id: string;
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
  /** What `price` means in numbers, for structured data. Left out when it's "Hablemos". */
  amount?: { value: number; currency: string };
}

// Where each plan's button leads: sign-up with the plan already chosen (the app
// remembers the language from ?lang=), and for Enterprise the contact form with
// the message half-written.
const PLAN_SHAPES = [
  { id: "trial", features: 4, amount: { value: 0, currency: "USD" } },
  { id: "pro", features: 5, highlight: true, amount: { value: 29.99, currency: "USD" }, period: true },
  { id: "enterprise", features: 4 },
] as const;

function planHref(id: (typeof PLAN_SHAPES)[number]["id"], locale: Locale): string {
  if (id === "enterprise") return `${localePath(locale, "/help")}?plan=enterprise#contacto`;
  return `/register?lang=${locale}&plan=${id}`;
}

const FAQ_IDS = ["both", "migration", "address", "privacy", "users", "site", "team", "owner"] as const;

/** The plans in a language; `t` is scoped to "landing". */
export function plansIn(t: LooseTranslator, locale: Locale): Plan[] {
  return PLAN_SHAPES.map((shape) => ({
    id: shape.id,
    name: t(`plans.${shape.id}.name`),
    price: t(`plans.${shape.id}.price`),
    period: "period" in shape ? t(`plans.${shape.id}.period`) : undefined,
    tagline: t(`plans.${shape.id}.tagline`),
    features: Array.from({ length: shape.features }, (_, index) => t(`plans.${shape.id}.features.f${index + 1}`)),
    cta: t(`plans.${shape.id}.cta`),
    href: planHref(shape.id, locale),
    highlight: "highlight" in shape ? shape.highlight : undefined,
    amount: "amount" in shape ? shape.amount : undefined,
  }));
}

/** The questions and answers in a language; `t` is scoped to "landing". */
export function faqIn(t: LooseTranslator) {
  return FAQ_IDS.map((id) => ({ q: t(`faq.${id}.q`), a: t(`faq.${id}.a`) }));
}
