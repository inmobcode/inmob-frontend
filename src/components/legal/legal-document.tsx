import Link from "next/link";

import { LEGAL_UPDATED_AT } from "@/lib/legal";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const LINK =
  "rounded-sm font-medium text-ink underline decoration-line underline-offset-4 outline-none transition-colors hover:decoration-ink focus-visible:ring-2 focus-visible:ring-forest";

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
 * A legal page: the title, a plain-language summary and the numbered sections,
 * with an index that stays in view on wide screens. Sections are divided by
 * hairlines, like the rest of the landing.
 */
export function LegalDocument({
  title,
  intro,
  summary,
  sections,
  related,
}: {
  title: string;
  intro: React.ReactNode;
  summary: string[];
  sections: LegalSection[];
  related: { href: string; label: string };
}) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-14 pb-20 sm:px-8 md:pt-20 md:pb-28">
        <header className="max-w-3xl border-b border-line pb-10">
          <p className="text-sm text-quiet">Vigente desde el {LEGAL_UPDATED_AT}</p>
          <h1 className="mt-4 font-logo text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
            {title}
          </h1>
          <div className="mt-6 max-w-2xl text-lg text-pretty text-quiet">{intro}</div>
        </header>

        <div className="grid gap-12 pt-10 lg:grid-cols-12 lg:gap-8">
          <nav aria-label="Índice" className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-sm text-quiet">Contenido</h2>
              <ol className="mt-4 flex flex-col gap-2 text-sm">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex gap-3 rounded-sm text-quiet outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-forest"
                    >
                      <span className="w-5 shrink-0 tabular-nums text-quiet/60">
                        {index + 1}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-8 border-t border-line pt-6 text-sm text-quiet">
                Ver también: <LegalLink href={related.href}>{related.label}</LegalLink>
              </p>
            </div>
          </nav>

          <article className="flex max-w-[44rem] flex-col lg:col-span-8 lg:col-start-5">
            <section aria-labelledby="resumen" className="pb-10">
              <h2 id="resumen" className="font-logo text-xl font-semibold tracking-tight">
                En pocas palabras
              </h2>
              <ul className="mt-5 flex flex-col border-t border-line">
                {summary.map((item) => (
                  <li key={item} className="border-b border-line py-3.5 text-pretty">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-quiet">
                Este resumen ayuda a leer el documento, pero no lo reemplaza: rige el texto completo.
              </p>
            </section>

            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-24 border-t border-line py-10"
              >
                <h2
                  id={`${section.id}-title`}
                  className="flex gap-4 font-logo text-xl font-semibold tracking-tight text-balance"
                >
                  <span className="w-7 shrink-0 tabular-nums text-quiet/60">{index + 1}</span>
                  {section.title}
                </h2>
                <div className="mt-5 flex flex-col gap-4 leading-relaxed sm:pl-11 text-pretty text-ink/85 [&_h3]:mt-3 [&_h3]:font-semibold [&_h3]:text-ink [&_li]:pl-1 [&_ol]:flex [&_ol]:list-[lower-alpha] [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ul]:marker:text-quiet/60">
                  {section.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
