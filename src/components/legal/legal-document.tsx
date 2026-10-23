import { useTranslations } from "next-intl";

import { LegalIndex } from "@/components/legal/legal-index";
import { useFormat } from "@/i18n/format";
import { Link } from "@/i18n/navigation";
import { LEGAL_UPDATED_AT } from "@/lib/legal";

export interface LegalSection {
  id: string;
  title: string;
  /** One plain-language sentence shown above the full text ("En corto"). */
  brief?: string;
  content: React.ReactNode;
}

const LINK =
  "rounded-sm font-medium text-ink underline decoration-line underline-offset-4 outline-none transition-colors hover:decoration-ink focus-visible:ring-2 focus-visible:ring-forest";

/** One legal document in one language (src/content/legal). */
export interface LegalContent {
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: React.ReactNode;
  summary: string[];
  sections: LegalSection[];
  related: { href: string; label: string };
  action?: { href: string; label: string; hint: string };
}

/** Inline link styled for the legal body copy. */
export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  return external ? (
    <a
      href={href}
      className={LINK}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={LINK}>
      {children}
    </Link>
  );
}

/**
 * A legal page. A forest block opens it (title, plain-language summary as a
 * ruled ledger, when it took effect); below, a sticky index that follows the
 * reader sits beside the numbered sections, each with a one-line "En corto"
 * above the full text. Everything is divided by hairlines and prints cleanly.
 */
export function LegalDocument({
  title,
  intro,
  summary,
  sections,
  related,
  action,
}: {
  title: string;
  intro: React.ReactNode;
  summary: string[];
  sections: LegalSection[];
  related: { href: string; label: string };
  /** The one thing a reader may want to do right now (e.g. exercise a right). */
  action?: { href: string; label: string; hint: string };
}) {
  const t = useTranslations("legal");
  const { date } = useFormat();
  return (
    <main className="flex-1">
      <header className="bg-forest text-paper print:bg-transparent print:text-ink">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 pt-14 pb-14 sm:px-8 md:pt-20 md:pb-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h1 className="font-logo text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
              {title}
            </h1>
            <div className="mt-6 max-w-xl text-lg text-pretty text-paper/60 print:text-quiet">{intro}</div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-paper/15 pt-6 text-sm print:border-line">
              <div>
                <dt className="text-paper/55 print:text-quiet">{t("effective")}</dt>
                <dd className="mt-1 font-medium">{date(new Date(`${LEGAL_UPDATED_AT}T12:00:00`), "long")}</dd>
              </div>
              <div>
                <dt className="text-paper/55 print:text-quiet">{t("sections")}</dt>
                <dd className="mt-1 font-medium">{sections.length}</dd>
              </div>
              <div>
                <dt className="text-paper/55 print:text-quiet">{t("seeAlso")}</dt>
                <dd className="mt-1 font-medium">
                  <Link
                    href={related.href}
                    className="rounded-sm underline decoration-paper/40 underline-offset-4 outline-none transition-colors hover:decoration-paper focus-visible:ring-2 focus-visible:ring-lime print:decoration-line"
                  >
                    {related.label}
                  </Link>
                </dd>
              </div>
            </dl>
            {action && (
              <div className="mt-8 flex flex-col items-start gap-3 print:hidden">
                <a
                  href={action.href}
                  className="inline-flex h-12 items-center rounded-lg bg-lime px-6 text-base font-semibold text-forest-deep outline-none transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
                >
                  {action.label}
                </a>
                <p className="text-sm text-paper/55">{action.hint}</p>
              </div>
            )}
          </div>

          <section aria-labelledby="resumen" className="lg:col-span-5 lg:col-start-8">
            <h2 id="resumen" className="font-logo text-xl font-semibold tracking-tight">
              {t("summary")}
            </h2>
            <ol className="mt-5 flex flex-col border-t border-paper/15 print:border-line">
              {summary.map((item, index) => (
                <li
                  key={item}
                  className="grid grid-cols-[1.75rem_1fr] gap-3 border-b border-paper/15 py-4 text-pretty print:border-line"
                >
                  <span className="tabular-nums text-paper/45 print:text-quiet">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-paper/55 print:text-quiet">
              {t("summaryNote")}
            </p>
          </section>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 pt-10 pb-20 sm:px-8 md:pb-28 lg:grid-cols-12 lg:gap-8 lg:pt-14">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100svh-8rem)] lg:overflow-y-auto">
            <LegalIndex items={sections.map(({ id, title }) => ({ id, title }))} />
          </div>
        </div>

        <article className="flex max-w-[46rem] flex-col lg:col-span-8 lg:col-start-5">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="scroll-mt-24 border-b border-line py-10 first:pt-0 last:border-b-0 print:break-inside-avoid-page"
            >
              <h2
                id={`${section.id}-title`}
                className="flex gap-4 font-logo text-2xl font-semibold tracking-tight text-balance"
              >
                <span className="w-7 shrink-0 tabular-nums text-quiet/60">{index + 1}</span>
                {section.title}
              </h2>
              {section.brief && (
                <p className="mt-5 border-l-2 border-forest py-0.5 pl-4 text-pretty font-medium text-ink sm:ml-11">
                  <span className="text-quiet">{t("brief")} </span>
                  {section.brief}
                </p>
              )}
              <div className="mt-5 flex flex-col gap-4 leading-relaxed sm:pl-11 text-pretty text-ink/85 [&_h3]:mt-3 [&_h3]:font-semibold [&_h3]:text-ink [&_li]:pl-1 [&_ol]:flex [&_ol]:list-[lower-alpha] [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ul]:marker:text-quiet/60">
                {section.content}
              </div>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
