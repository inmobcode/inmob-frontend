import type { LooseTranslator } from "@/i18n/loose";

/**
 * The help center's questions, grouped by what the person is trying to do
 * (not by screen). One list, three readers: the page, its search, and the
 * FAQPage structured data, which Google only accepts for answers a visitor can
 * read on the page.
 */

export interface HelpQuestion {
  q: string;
  a: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  summary: string;
  questions: HelpQuestion[];
}

/** Each topic and how many questions it has; the words are in the "help.topics" messages. */
const TOPICS = [
  ["primeros-pasos", 4],
  ["propiedades", 3],
  ["clientes-consultas", 3],
  ["ofertas", 2],
  ["reservas-cobros", 3],
  ["disponibilidad", 3],
  ["sitio-portales", 3],
  ["cuenta-datos", 3],
] as const;

/** The help topics in a language; `t` is scoped to "help.topics". */
export function helpTopicsIn(t: LooseTranslator): HelpTopic[] {
  return TOPICS.map(([id, count]) => ({
    id,
    title: t(`${id}.title`),
    summary: t(`${id}.summary`),
    questions: Array.from({ length: count }, (_, index) => ({
      q: t(`${id}.questions.q${index + 1}.q`),
      a: t(`${id}.questions.q${index + 1}.a`),
    })),
  }));
}

/** How many popular searches "help.popular" lists, shown before anything is typed. */
export const POPULAR_SEARCH_COUNT = 6;

/** Lowercase and strip accents, so "reserva" finds "Reservá" and vice versa. */
export function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
