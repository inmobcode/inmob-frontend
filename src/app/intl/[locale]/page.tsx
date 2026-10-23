import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LandingFooter } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Availability } from "@/components/landing/availability";
import { More } from "@/components/landing/more";
import { SiteEditor } from "@/components/landing/site-editor";
import { LandingNav } from "@/components/landing/nav";
import { faqIn, plansIn } from "@/components/landing/plans-faq-data";
import {
  DemoForm,
  Flow,
  Migration,
  PlansAndFaq,
  Portals,
  Problem,
  TeamSection,
} from "@/components/landing/sections";
import { JsonLd, compact } from "@/components/seo/json-ld";
import { isLocale, LOCALE_TAGS, localePath, OG_LOCALES, type Locale } from "@/i18n/config";
import type { LooseTranslator } from "@/i18n/loose";
import { SITE_NAME, SITE_URL, absoluteUrl, localizedAlternates } from "@/lib/seo";

import { ogImages } from "../../root-metadata";

type Params = Promise<{ locale: string }>;

async function landingCopy(params: Params) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const t = await getTranslations({ locale, namespace: "landing" });
  return { locale, t };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, t } = await landingCopy(params);
  const title = t("meta.title");
  return {
    // Absolute: the home page reads better without "· Tivvo" tacked on twice.
    title: { absolute: title },
    description: t("meta.description"),
    alternates: localizedAlternates("/", locale),
    keywords: t("meta.keywords").split(", "),
    openGraph: {
      type: "website",
      title,
      description: t("meta.description"),
      url: absoluteUrl(localePath(locale, "/")),
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      images: await ogImages(locale),
    },
  };
}

export default async function Home({ params }: { params: Params }) {
  const { locale, t } = await landingCopy(params);
  setRequestLocale(locale);
  const DESCRIPTION = t("meta.description");
  const home = absoluteUrl(localePath(locale, "/"));
  const loose = t as unknown as LooseTranslator;
  return (
    <div className="landing flex flex-1 flex-col">
      {/* Who publishes this and what it is, so the brand can be understood as a product and a company. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: SITE_NAME,
              url: SITE_URL,
              description: DESCRIPTION,
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: SITE_NAME,
              inLanguage: LOCALE_TAGS[locale],
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@type": "SoftwareApplication",
              name: SITE_NAME,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: home,
              description: DESCRIPTION,
              publisher: { "@id": `${SITE_URL}/#organization` },
              // Only the plans with a number; "Hablemos" is not a price.
              offers: plansIn(loose).filter((plan) => plan.amount).map((plan) =>
                compact({
                  "@type": "Offer",
                  name: plan.name,
                  price: plan.amount!.value,
                  priceCurrency: plan.amount!.currency,
                  description: plan.tagline,
                  url: plan.href.startsWith("/") ? absoluteUrl(plan.href) : `${home}${plan.href}`,
                }),
              ),
            },
            {
              "@type": "FAQPage",
              "@id": `${home}#faq`,
              mainEntity: faqIn(loose).map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ],
        }}
      />
      <LandingNav />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Flow />
        <SiteEditor />
        <Availability />
        <TeamSection />
        <Portals />
        <More />
        <Migration />
        <Problem />
        <PlansAndFaq />
        <DemoForm />
      </main>
      <LandingFooter />
    </div>
  );
}
