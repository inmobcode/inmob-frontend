"use client";

import { ArrowUpRight, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useId, useMemo, useState } from "react";

import { LegalIndex } from "@/components/legal/legal-index";
import type { LooseTranslator } from "@/i18n/loose";
import { helpTopicsIn, normalize, POPULAR_SEARCH_COUNT, type HelpTopic } from "@/lib/help-content";
import { cn } from "@/lib/utils";

const CONTACT_LINK =
  "rounded-sm font-medium text-ink underline decoration-line underline-offset-4 outline-none transition-colors hover:decoration-ink focus-visible:ring-2 focus-visible:ring-forest";

/** Topics narrowed to the questions that mention every word typed. */
function filterTopics(all: HelpTopic[], query: string): HelpTopic[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return all;
  return all.map((topic) => ({
    ...topic,
    questions: topic.questions.filter((item) => {
      const haystack = normalize(`${topic.title} ${item.q} ${item.a}`);
      return words.every((word) => haystack.includes(word));
    }),
  })).filter((topic) => topic.questions.length > 0);
}

/**
 * The help hub: a search that narrows the questions as you type, the topics
 * as an index that follows the reading, and the answers as ruled rows.
 * Nothing here is a card; the structure is lines, like the rest of the site.
 */
export function HelpCenter({ initialQuery = "" }: { initialQuery?: string }) {
  const t = useTranslations("help");
  const tTopics = useTranslations("help.topics");
  const all = useMemo(() => helpTopicsIn(tTopics as unknown as LooseTranslator), [tTopics]);
  const popular = Array.from({ length: POPULAR_SEARCH_COUNT }, (_, index) => t(`popular.p${index + 1}` as never));
  const [query, setQuery] = useState(initialQuery);
  const inputId = useId();
  const topics = useMemo(() => filterTopics(all, query), [all, query]);
  const searching = query.trim().length > 0;
  const total = topics.reduce((sum, topic) => sum + topic.questions.length, 0);

  return (
    <>
      <section aria-labelledby="ayuda-titulo" className="bg-forest text-paper">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-10 px-5 pt-14 pb-14 sm:px-8 md:pt-20 md:pb-20">
          <h1
            id="ayuda-titulo"
            className="text-center font-logo text-[clamp(1.75rem,5.2vw,4.5rem)] leading-[1.05] font-semibold tracking-[-0.035em]"
          >
            <span className="block sm:whitespace-nowrap">{t("title")}</span>
            <span className="block text-balance text-paper/45">{t("titleTail")}</span>
          </h1>

          <div className="flex w-full max-w-3xl flex-col gap-4">
            <label htmlFor={inputId} className="sr-only">
              {t("searchLabel")}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-quiet"
                aria-hidden
              />
              <input
                id={inputId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                autoComplete="off"
                className="h-14 w-full rounded-xl bg-paper pr-12 pl-13 text-base text-ink outline-none placeholder:text-quiet focus-visible:ring-2 focus-visible:ring-lime sm:text-lg [&::-webkit-search-cancel-button]:hidden"
              />
              {searching && (
                <button
                  type="button"
                  aria-label={t("clearSearch")}
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-quiet outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-forest"
                >
                  <X className="size-4" aria-hidden />
                </button>
              )}
            </div>
            <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm text-paper/60">
              <span>{t("popularLabel")}</span>
              {popular.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-sm text-paper underline decoration-paper/35 underline-offset-4 outline-none transition-colors hover:decoration-paper focus-visible:ring-2 focus-visible:ring-lime"
                >
                  {term}
                </button>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section aria-label={t("faqLabel")}>
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-12 lg:gap-8">
          <aside className="lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
            {topics.length > 0 ? (
              <LegalIndex
                items={topics.map(({ id, title }) => ({ id, title }))}
              />
            ) : null}
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            <p
              role="status"
              aria-live="polite"
              className={cn("text-sm text-quiet", !searching && "sr-only")}
            >
              {total === 0 ? t("noResults") : t("results", { count: total, query: query.trim() })}
            </p>

            {topics.length === 0 ? (
              <div className="flex flex-col items-start gap-4 border-t border-line py-10">
                <p className="font-logo text-2xl font-semibold">
                  {t("nothingFor", { query: query.trim() })}
                </p>
                <p className="max-w-md text-lg text-pretty text-quiet">{t("tryAnother")}</p>
                <a href="#contacto" className={CONTACT_LINK}>
                  {t("toContact")}
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-14">
                {topics.map((topic, index) => (
                  <section
                    key={topic.id}
                    id={topic.id}
                    aria-labelledby={`${topic.id}-titulo`}
                    className="scroll-mt-24"
                  >
                    <header className="grid gap-1 pb-6 sm:grid-cols-[3rem_1fr]">
                      <span
                        aria-hidden
                        className="font-logo text-sm font-semibold text-forest tabular-nums sm:pt-2"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h2
                          id={`${topic.id}-titulo`}
                          className="font-logo text-3xl leading-tight font-semibold tracking-tight"
                        >
                          {topic.title}
                        </h2>
                        <p className="mt-1 text-lg text-quiet">
                          {topic.summary}
                        </p>
                      </div>
                    </header>
                    <ul>
                      {topic.questions.map((item) => (
                        <li
                          key={item.q}
                          className="border-t border-line last:border-b"
                        >
                          <details className="group" open={searching}>
                            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left text-lg font-medium outline-none focus-visible:bg-mist sm:pl-12 [&::-webkit-details-marker]:hidden">
                              {item.q}
                              <span
                                aria-hidden
                                className="mt-1 text-quiet transition-transform duration-300 group-open:rotate-45"
                              >
                                +
                              </span>
                            </summary>
                            <p className="max-w-2xl pb-6 text-lg leading-relaxed text-pretty text-quiet sm:pl-12">
                              {item.a}
                            </p>
                          </details>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}

            <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 text-lg sm:flex-row sm:items-center sm:justify-between">
              <p className="text-pretty text-quiet">
                {t("docsLead")}
              </p>
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 rounded-sm font-medium text-ink underline decoration-line underline-offset-4 outline-none hover:decoration-ink focus-visible:ring-2 focus-visible:ring-forest"
              >
                {t("docs")}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
