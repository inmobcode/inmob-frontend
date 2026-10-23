import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AvailabilityCalendarView } from "@/components/availability/availability-calendar-view";
import { SiteFooter, SiteHeader, SiteRoot, SITE_WRAP } from "@/components/public/site-chrome";
import { getPublicAvailabilityCalendar } from "@/lib/api/availability";
import { isLocale, localePath } from "@/i18n/config";
import { absoluteUrl, availabilityPath, localizedAlternates, propertyPath } from "@/lib/seo";
import { resolveSite } from "@/lib/site-theme";

import { loadAgency } from "../data";

type Params = Promise<{ locale: string; agencySlug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, agencySlug } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const t = await getTranslations({ locale, namespace: "site.availability" });
  const [agency, calendar] = await Promise.all([
    loadAgency(agencySlug),
    getPublicAvailabilityCalendar(agencySlug),
  ]);
  const title = t("metaTitle", { agency: agency.name });
  const description = t("metaDescription", { agency: agency.name });
  const path = availabilityPath(agencySlug);
  const site = resolveSite(agency.site);
  const image = site.coverUrl ?? calendar.properties.find((p) => p.coverUrl)?.coverUrl;
  const images = image ? [{ url: image, alt: title }] : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: localizedAlternates(path, locale),
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(localePath(locale, path)),
      siteName: agency.name,
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images },
  };
}

export default async function PublicAvailabilityPage({ params }: { params: Params }) {
  const { locale: raw, agencySlug } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const t = await getTranslations("site.availability");
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
              {t("title")}
            </h1>
            <p className="max-w-prose text-site-quiet">{t("intro", { agency: agency.name })}</p>
          </header>

          {calendar.properties.length === 0 ? (
            <p className="text-site-quiet">{t("empty")}</p>
          ) : (
            <AvailabilityCalendarView
              from={calendar.from}
              to={calendar.to}
              properties={calendar.properties.map((property) => ({
                ...property,
                href: localePath(locale, propertyPath(agencySlug, property.slug)),
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
