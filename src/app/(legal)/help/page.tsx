import type { Metadata } from "next";

import { ContactForm } from "@/components/help/contact-form";
import { LegalLink } from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contacto y ayuda",
  description: "Escribinos y te respondemos a la brevedad.",
  alternates: { canonical: absoluteUrl("/help") },
};

export default function HelpPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 pt-14 pb-20 sm:px-8 md:pt-20 md:pb-28 lg:grid-cols-12 lg:gap-8">
        <header className="max-w-xl lg:col-span-5">
          <h1 className="font-logo text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
            Contacto y ayuda
          </h1>
          <p className="mt-6 max-w-md text-lg text-pretty text-quiet">
            ¿Tenés una duda, un problema o algo para sugerirnos? Contanos y te respondemos por email.
          </p>
          <p className="mt-6 text-quiet">
            También podés escribirnos directamente a{" "}
            <LegalLink href={`mailto:${LEGAL_ENTITY.contactEmail}`}>{LEGAL_ENTITY.contactEmail}</LegalLink>.
          </p>
        </header>

        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
