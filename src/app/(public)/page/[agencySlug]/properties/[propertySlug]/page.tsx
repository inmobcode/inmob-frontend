import { Check, ChevronLeft, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { InquiryForm } from "@/components/public/inquiry-form";
import { PropertyGallery } from "@/components/public/property-gallery";
import {
  PublicPropertyCard,
  coverPhoto,
  formatPrice,
  priceUnit,
  placeOf,
} from "@/components/public/property-card";
import {
  SITE_WRAP,
  SiteFooter,
  SiteHeader,
  SiteRoot,
} from "@/components/public/site-chrome";
import type { Property } from "@/lib/api/properties";
import {
  INDOOR_AMENITY_LABELS,
  LISTING_TYPE_LABELS,
  LOCATION_FEATURE_LABELS,
  OUTDOOR_AMENITY_LABELS,
  VIEW_LABELS,
  categoryLabel,
} from "@/lib/properties-labels";
import { resolveSite, whatsappLink } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

import { loadAgency, loadProperties, loadProperty } from "../../data";

type Params = Promise<{ agencySlug: string; propertySlug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { agencySlug, propertySlug } = await params;
  const [agency, property] = await Promise.all([
    loadAgency(agencySlug),
    loadProperty(agencySlug, propertySlug),
  ]);
  const cover = coverPhoto(property);
  return {
    title: `${property.title} · ${agency.name}`,
    description:
      property.content?.summary ??
      `${categoryLabel(property.category)} en ${LISTING_TYPE_LABELS[property.listingType].toLowerCase()}.`,
    openGraph: cover ? { images: [cover.url] } : undefined,
  };
}

/** The key figures, only the ones the agency filled in. */
function facts(property: Property) {
  const number = (value: number) => value.toLocaleString("es-AR");
  return [
    property.bedrooms != null && {
      label: "Dormitorios",
      value: number(property.bedrooms),
    },
    property.bathrooms != null && {
      label: "Baños",
      value: number(property.bathrooms),
    },
    property.areaSqm != null && {
      label: "Superficie",
      value: `${number(property.areaSqm)} m²`,
    },
    property.plotArea != null && {
      label: "Terreno",
      value: `${number(property.plotArea)} m²`,
    },
    property.guests && { label: "Huéspedes", value: property.guests },
    property.constructionYear != null && {
      label: "Año",
      value: String(property.constructionYear),
    },
  ].filter(Boolean) as { label: string; value: string }[];
}

const AMENITY_LABELS = { ...OUTDOOR_AMENITY_LABELS, ...INDOOR_AMENITY_LABELS };

function featureGroups(property: Property) {
  const label = (map: Record<string, string>) => (code: string) =>
    map[code] ?? code;
  return [
    {
      title: "Comodidades",
      items: [
        ...new Set([
          ...property.amenities,
          ...property.outdoorAmenities,
          ...property.indoorAmenities,
        ]),
      ].map(label(AMENITY_LABELS)),
    },
    { title: "Vistas", items: property.view.map(label(VIEW_LABELS)) },
    {
      title: "Ubicación",
      items: property.locationFeatures.map(label(LOCATION_FEATURE_LABELS)),
    },
  ].filter((group) => group.items.length > 0);
}

export default async function PublicPropertyPage({
  params,
}: {
  params: Params;
}) {
  const { agencySlug, propertySlug } = await params;
  const [agency, property, all] = await Promise.all([
    loadAgency(agencySlug),
    loadProperty(agencySlug, propertySlug),
    loadProperties(agencySlug),
  ]);
  const site = resolveSite(agency.site);
  const price = formatPrice(property);
  const unit = priceUnit(property);
  const place = placeOf(property);
  const location = [property.address, place].filter(Boolean).join(" · ");
  const keyFacts = facts(property);
  const groups = featureGroups(property);
  const others = all.filter((other) => other.id !== property.id).slice(0, 3);
  const whatsappMessage = `Hola, me interesa "${property.title}". ¿Sigue disponible?`;

  return (
    // Bottom padding on phones leaves room for the fixed price bar.
    <SiteRoot site={site} className="pb-[4.25rem] lg:pb-0">
      <SiteHeader agency={agency} site={site} slug={agencySlug} />

      <main className="flex-1">
        <div className={cn(SITE_WRAP, "flex flex-col gap-6 pt-6 lg:pt-8")}>
          <Link
            href={`/page/${agencySlug}#propiedades`}
            className="-ml-1 inline-flex w-fit items-center gap-1 rounded-sm text-sm text-site-quiet outline-none hover:text-site-ink focus-visible:ring-2 focus-visible:ring-site-accent"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Todas las propiedades
          </Link>
          <PropertyGallery photos={property.photos} title={property.title} />
        </div>

        <div
          className={cn(
            SITE_WRAP,
            "grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16 lg:py-14",
          )}
        >
          <article className="flex min-w-0 flex-col gap-10">
            <header className="flex flex-col gap-3">
              <p className="text-sm text-site-quiet">
                {LISTING_TYPE_LABELS[property.listingType]} ·{" "}
                {categoryLabel(property.category)}
              </p>
              <h1 className="s-heading text-[clamp(2rem,4vw,3rem)] leading-[1.05] text-balance">
                {property.title}
              </h1>
              {location && (
                <p className="flex items-start gap-2 text-site-quiet">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {location}
                </p>
              )}
            </header>

            {keyFacts.length > 0 && (
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-site-line bg-site-line sm:grid-cols-3">
                {keyFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex flex-col gap-1 bg-site-bg px-5 py-4"
                  >
                    <dt className="text-sm text-site-quiet">{fact.label}</dt>
                    <dd className="s-heading text-2xl tabular-nums">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {(property.content?.summary || property.content?.description) && (
              <section
                aria-label="Descripción"
                className="flex max-w-prose flex-col gap-4"
              >
                {property.content?.summary && (
                  <p className="text-xl leading-relaxed text-pretty">
                    {property.content.summary}
                  </p>
                )}
                {property.content?.description && (
                  <p className="leading-relaxed text-pretty whitespace-pre-line text-site-ink/85">
                    {property.content.description}
                  </p>
                )}
              </section>
            )}

            {groups.map((group) => (
              <section
                key={group.title}
                aria-labelledby={`grupo-${group.title}`}
                className="flex flex-col gap-4"
              >
                <h2 id={`grupo-${group.title}`} className="s-heading text-xl">
                  {group.title}
                </h2>
                <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check
                        className="mt-1 size-4 shrink-0 text-site-accent"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {property.googleMapUrl && (
              <a
                href={property.googleMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-fit items-center gap-2 rounded-lg border border-site-line px-4 text-sm font-medium outline-none hover:border-site-quiet focus-visible:ring-2 focus-visible:ring-site-accent"
              >
                <MapPin className="size-4" aria-hidden />
                Ver en el mapa
              </a>
            )}
          </article>

          <aside
            id="consulta"
            className="scroll-mt-6 lg:sticky lg:top-6 lg:self-start"
          >
            <div className="flex flex-col gap-6 rounded-xl border border-site-line p-6">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-site-quiet">
                  {LISTING_TYPE_LABELS[property.listingType]}
                </p>
                <p className="s-heading text-3xl tabular-nums">
                  {price ?? "Precio a consultar"}
                  {price && unit && (
                    <span className="font-sans text-base font-normal tracking-normal text-site-quiet">
                      {unit}
                    </span>
                  )}
                </p>
              </div>
              {site.whatsapp && (
                <a
                  href={whatsappLink(site.whatsapp, whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-site-line font-medium outline-none hover:border-site-quiet focus-visible:ring-2 focus-visible:ring-site-accent"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Consultar por WhatsApp
                </a>
              )}
              <div className="flex flex-col gap-4 border-t border-site-line pt-6">
                <h2 className="s-heading text-lg">
                  Consultá por esta propiedad
                </h2>
                <InquiryForm
                  agencySlug={agencySlug}
                  propertyId={property.id}
                  defaultMessage="Hola, me interesa esta propiedad. ¿Sigue disponible?"
                />
              </div>
            </div>
          </aside>
        </div>

        {others.length > 0 && (
          <section aria-labelledby="otras" className="border-t border-site-line">
            <div
              className={cn(SITE_WRAP, "flex flex-col gap-8 py-14 lg:py-20")}
            >
              <h2 id="otras" className="s-heading text-3xl leading-tight">
                Otras propiedades de {agency.name}
              </h2>
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((other) => (
                  <PublicPropertyCard
                    key={other.id}
                    property={other}
                    agencySlug={agencySlug}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* On phones the form sits far below; this bar keeps the price and the way to ask in reach. */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-site-line bg-site-bg/95 px-5 py-3 backdrop-blur lg:hidden">
        <p className="s-heading truncate text-lg tabular-nums">
          {price ?? "Precio a consultar"}
          {price && unit && (
            <span className="font-sans text-sm font-normal tracking-normal text-site-quiet">
              {unit}
            </span>
          )}
        </p>
        <a
          href="#consulta"
          className="inline-flex h-11 shrink-0 items-center rounded-lg bg-site-accent px-5 font-medium text-site-accent-ink outline-none focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2"
        >
          Consultar
        </a>
      </div>

      <SiteFooter agency={agency} site={site} />
    </SiteRoot>
  );
}
