import type { Metadata } from "next";

import { ContactForm } from "@/components/help/contact-form";
import { HelpCenter } from "@/components/help/help-center";
import { LegalLink } from "@/components/legal/legal-document";
import { JsonLd } from "@/components/seo/json-ld";
import { HELP_TOPICS } from "@/lib/help-content";
import { LEGAL_ENTITY } from "@/lib/legal";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ayuda y contacto",
  description:
    "Respuestas sobre propiedades, ofertas, reservas, disponibilidad y tu sitio web. Si no encontrás lo que buscás, escribinos.",
  alternates: { canonical: absoluteUrl("/help") },
};

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const initialQuery = (Array.isArray(q) ? q[0] : q)?.slice(0, 80) ?? "";
  return (
    <main className="flex-1">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: HELP_TOPICS.flatMap((topic) => topic.questions).map(
            (item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            }),
          ),
        }}
      />

      <HelpCenter initialQuery={initialQuery} />

      <section
        id="contacto"
        aria-labelledby="contacto-titulo"
        className="scroll-mt-16 border-t border-line bg-mist"
      >
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <h2
              id="contacto-titulo"
              className="font-logo text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance"
            >
              ¿No encontraste lo que buscabas?{" "}
              <span className="text-quiet">Escribinos.</span>
            </h2>
            <p className="max-w-md text-lg text-pretty text-quiet">
              Contanos tu duda, un problema o una idea. Te respondemos por
              email.
            </p>
            <dl className="mt-2 border-t border-line">
              <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr]">
                <dt className="text-quiet">Por email</dt>
                <dd>
                  <LegalLink href={`mailto:${LEGAL_ENTITY.contactEmail}`}>
                    {LEGAL_ENTITY.contactEmail}
                  </LegalLink>
                </dd>
              </div>
              <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr]">
                <dt className="text-quiet">Datos personales</dt>
                <dd>
                  <LegalLink href={`mailto:${LEGAL_ENTITY.privacyEmail}`}>
                    {LEGAL_ENTITY.privacyEmail}
                  </LegalLink>
                </dd>
              </div>
              <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr]">
                <dt className="text-quiet">Reglas</dt>
                <dd className="flex flex-wrap gap-x-4">
                  <LegalLink href="/terms">Términos</LegalLink>
                  <LegalLink href="/privacy">Privacidad</LegalLink>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
