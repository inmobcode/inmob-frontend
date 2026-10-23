import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ContactForm } from "@/components/help/contact-form";
import { HelpCenter } from "@/components/help/help-center";
import { LegalLink } from "@/components/legal/legal-document";
import { JsonLd } from "@/components/seo/json-ld";
import { isLocale, type Locale } from "@/i18n/config";
import type { LooseTranslator } from "@/i18n/loose";
import { helpTopicsIn } from "@/lib/help-content";
import { LEGAL_ENTITY } from "@/lib/legal";
import { localizedAlternates } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

const localeOf = async (params: Params): Promise<Locale> => {
  const { locale } = await params;
  return isLocale(locale) ? locale : "es";
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "help.page" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternates("/help", locale),
  };
}

export default async function HelpPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "help.page" });
  const tTopics = await getTranslations({ locale, namespace: "help.topics" });
  const { q } = await searchParams;
  const initialQuery = (Array.isArray(q) ? q[0] : q)?.slice(0, 80) ?? "";
  return (
    <main className="flex-1">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: helpTopicsIn(tTopics as unknown as LooseTranslator).flatMap((topic) => topic.questions).map(
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
              {t("contactTitle")} <span className="text-quiet">{t("contactTitleTail")}</span>
            </h2>
            <p className="max-w-md text-lg text-pretty text-quiet">{t("contactLead")}</p>
            <dl className="mt-2 border-t border-line">
              <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr]">
                <dt className="text-quiet">{t("byEmail")}</dt>
                <dd>
                  <LegalLink href={`mailto:${LEGAL_ENTITY.contactEmail}`}>
                    {LEGAL_ENTITY.contactEmail}
                  </LegalLink>
                </dd>
              </div>
              <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr]">
                <dt className="text-quiet">{t("personalData")}</dt>
                <dd>
                  <LegalLink href={`mailto:${LEGAL_ENTITY.privacyEmail}`}>
                    {LEGAL_ENTITY.privacyEmail}
                  </LegalLink>
                </dd>
              </div>
              <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr]">
                <dt className="text-quiet">{t("rules")}</dt>
                <dd className="flex flex-wrap gap-x-4">
                  <LegalLink href="/terms">{t("terms")}</LegalLink>
                  <LegalLink href="/privacy">{t("privacy")}</LegalLink>
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
