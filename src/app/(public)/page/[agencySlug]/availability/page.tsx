import type { Metadata } from "next";

import { AvailabilityCalendarView } from "@/components/availability/availability-calendar-view";
import { SiteFooter, SiteHeader, SiteRoot, SITE_WRAP } from "@/components/public/site-chrome";
import { getPublicAvailabilityCalendar } from "@/lib/api/availability";
import { absoluteUrl, availabilityPath, propertyPath } from "@/lib/seo";
import { resolveSite } from "@/lib/site-theme";

import { loadAgency } from "../data";

type Params = Promise<{ agencySlug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { agencySlug } = await params;
  const [agency, calendar] = await Promise.all([
    loadAgency(agencySlug),
    getPublicAvailabilityCalendar(agencySlug),
  ]);
  const title = `Disponibilidad — ${agency.name}`;
  const description = `Calendario de disponibilidad en vivo de ${agency.name}: los próximos 90 días de sus propiedades en alquiler, actualizado en tiempo real.`;
  const path = availabilityPath(agencySlug);
  const site = resolveSite(agency.site);
  const image = site.coverUrl ?? calendar.properties.find((p) => p.coverUrl)?.coverUrl;
  const images = image ? [{ url: image, alt: title }] : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(path),
      siteName: agency.name,
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images },
  };
}

export default async function PublicAvailabilityPage({ params }: { params: Params }) {
  const { agencySlug } = await params;
  const [agency, calendar] = await Promise.all([
    loadAgency(agencySlug),
    getPublicAvailabilityCalendar(agencySlug),
  ]);
  const site = resolveSite(agency.site);

  return (
    <SiteRoot site={site}>
      <SiteHeader agency={agency} site={site} slug={agencySlug} />
      <main className="flex-1">
        <div className={`${SITE_WRAP} flex flex-col gap-6 py-10 lg:py-14`}>
          <header className="flex flex-col gap-2">
            <h1 className="s-heading text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.05]">
              Disponibilidad
            </h1>
            <p className="max-w-prose text-site-quiet">
              Los próximos 90 días de las propiedades en alquiler de {agency.name}, actualizados en
              tiempo real.
            </p>
          </header>

          {calendar.properties.length === 0 ? (
            <p className="text-site-quiet">Por el momento no hay propiedades en alquiler.</p>
          ) : (
            <AvailabilityCalendarView
              from={calendar.from}
              to={calendar.to}
              properties={calendar.properties.map((property) => ({
                ...property,
                href: propertyPath(agencySlug, property.slug),
              }))}
              openLinksInNewTab
            />
          )}
        </div>
      </main>
      <SiteFooter agency={agency} site={site} />
    </SiteRoot>
  );
}
