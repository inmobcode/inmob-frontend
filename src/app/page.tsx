import { LandingFooter } from "@/components/landing/footer";
import type { Metadata } from "next";

import { Hero } from "@/components/landing/hero";
import { LandingNav } from "@/components/landing/nav";
import { FAQ, PLANS } from "@/components/landing/plans-faq-data";
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
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

const DESCRIPTION =
  "Cargá propiedades, armá ofertas, seguí reservas y publicá el sitio de tu agencia desde un solo lugar. Para inmobiliarias de venta y alquiler temporario.";

export const metadata: Metadata = {
  // Absolute: the home page reads better without "· Tivvo" tacked on twice.
  title: { absolute: "Tivvo · Sistema de gestión para inmobiliarias" },
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL },
  keywords: [
    "software inmobiliario",
    "crm inmobiliario",
    "gestión de propiedades",
    "alquiler temporario",
    "sitio web para inmobiliarias",
  ],
  openGraph: {
    type: "website",
    title: "Tivvo · Sistema de gestión para inmobiliarias",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
  },
};

export default function Home() {
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
              inLanguage: "es",
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
            {
              "@type": "SoftwareApplication",
              name: SITE_NAME,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: SITE_URL,
              description: DESCRIPTION,
              publisher: { "@id": `${SITE_URL}/#organization` },
              // Only the plans with a number; "Hablemos" is not a price.
              offers: PLANS.filter((plan) => plan.amount).map((plan) =>
                compact({
                  "@type": "Offer",
                  name: plan.name,
                  price: plan.amount!.value,
                  priceCurrency: plan.amount!.currency,
                  description: plan.tagline,
                  url: plan.href.startsWith("/") ? absoluteUrl(plan.href) : `${SITE_URL}/${plan.href}`,
                }),
              ),
            },
            {
              "@type": "FAQPage",
              "@id": `${SITE_URL}/#faq`,
              mainEntity: FAQ.map((item) => ({
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
        <Problem />
        <Flow />
        <TeamSection />
        <Portals />
        <Migration />
        <PlansAndFaq />
        <DemoForm />
      </main>
      <LandingFooter />
    </div>
  );
}
