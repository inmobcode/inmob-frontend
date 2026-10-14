import { Check, ChevronLeft, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { OfferInquiryForm } from "@/components/offers/offer-inquiry-form";
import { placeOf } from "@/components/public/property-card";
import { PropertyGallery } from "@/components/public/property-gallery";
import { SITE_WRAP, SiteRoot } from "@/components/public/site-chrome";
import { ApiError } from "@/lib/api/client";
import { getPublicOffer } from "@/lib/api/offers";
import { categoryLabel, LISTING_TYPE_LABELS } from "@/lib/properties-labels";
import { propertyFacts, propertyFeatureGroups } from "@/lib/property-details";
import { richTextHtml } from "@/lib/rich-text";
import { resolveSite } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

type Params = Promise<{ token: string; propertyId: string }>;

// The property as part of the offer: only properties the offer holds, with the offer's price.
const loadItem = cache(async (token: string, propertyId: string) => {
  let offer;
  try {
    offer = await getPublicOffer(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  const item = offer.sections.flatMap((section) => section.properties).find((entry) => entry.propertyId === propertyId);
  if (!item) notFound();
  return { offer, item };
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { token, propertyId } = await params;
  const { offer, item } = await loadItem(token, propertyId);
  return {
    // Absolute: this is the agency's own offer link, not a Tivvo surface.
    title: { absolute: `${item.property.title} · ${offer.title}` },
    robots: { index: false },
  };
}

// A fixed locale: the page renders on the server and in the browser, and both must print the same.
const money = (value: number) => value.toLocaleString("es-AR", { maximumFractionDigits: 0 });

export default async function OfferPropertyPage({ params }: { params: Params }) {
  const { token, propertyId } = await params;
  const { offer, item } = await loadItem(token, propertyId);
  const property = item.property;
  const location = [property.address, placeOf(property)].filter(Boolean).join(" · ");
  const keyFacts = propertyFacts(property);
  const groups = propertyFeatureGroups(property);
  const perNight = property.listingType === "RENT" ? " /noche" : "";
  const backHref = `/offer/${token}`;
  const canAsk = offer.branded && offer.status !== "EXPIRED";

  return (
    <SiteRoot site={resolveSite(null)}>
      <main className="flex-1">
        <div className={cn(SITE_WRAP, "flex flex-col gap-6 pt-6 lg:pt-8")}>
          <Link
            href={backHref}
            className="-ml-1 inline-flex w-fit items-center gap-1 rounded-sm text-sm text-site-quiet outline-none hover:text-site-ink focus-visible:ring-2 focus-visible:ring-site-accent"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Volver a la propuesta
          </Link>
          <PropertyGallery photos={property.photos} title={property.title} />
        </div>

        <div className={cn(SITE_WRAP, "grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16 lg:py-14")}>
          <article className="flex min-w-0 flex-col gap-10">
            <header className="flex flex-col gap-3">
              <p className="text-sm text-site-quiet">
                {LISTING_TYPE_LABELS[property.listingType]} · {categoryLabel(property.category)}
              </p>
              <h1 className="s-heading text-[clamp(2rem,4vw,3rem)] leading-[1.05] text-balance break-words">
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
                  <div key={fact.label} className="flex flex-col gap-1 bg-site-bg px-5 py-4">
                    <dt className="text-sm text-site-quiet">{fact.label}</dt>
                    <dd className="s-heading text-2xl tabular-nums">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {(property.content?.summary || property.content?.description) && (
              <section aria-label="Descripción" className="flex max-w-prose flex-col gap-4">
                {property.content?.summary && (
                  <p className="text-xl leading-relaxed text-pretty">{property.content.summary}</p>
                )}
                {property.content?.description && (
                  // Cleaned by the backend (app/utils/rich_text.py): only the editor's tags.
                  <div
                    className="rich-text leading-relaxed text-pretty text-site-ink/85"
                    dangerouslySetInnerHTML={{ __html: richTextHtml(property.content.description) }}
                  />
                )}
              </section>
            )}

            {groups.map((group) => (
              <section key={group.title} aria-labelledby={`grupo-${group.title}`} className="flex flex-col gap-4">
                <h2 id={`grupo-${group.title}`} className="s-heading text-xl">
                  {group.title}
                </h2>
                <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {group.items.map((entry) => (
                    <li key={entry} className="flex items-start gap-2.5">
                      <Check className="mt-1 size-4 shrink-0 text-site-accent" aria-hidden />
                      {entry}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </article>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-col gap-6 rounded-xl border border-site-line p-6">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-site-quiet">Precio en esta propuesta</p>
                {item.displayPrice != null ? (
                  <>
                    {item.initialPrice != null && (
                      <p className="text-sm text-site-quiet tabular-nums line-through">
                        {offer.currency} {money(item.initialPrice)}
                      </p>
                    )}
                    <p className="s-heading text-3xl tabular-nums">
                      {offer.currency} {money(item.displayPrice)}
                      {perNight && (
                        <span className="font-sans text-base font-normal tracking-normal text-site-quiet">
                          {perNight}
                        </span>
                      )}
                    </p>
                  </>
                ) : (
                  <p className="s-heading text-3xl">Precio a consultar</p>
                )}
                {item.securityDeposit != null && (
                  <p className="text-sm text-site-quiet">
                    Depósito de seguridad: {offer.currency} {money(item.securityDeposit)}
                  </p>
                )}
                {item.bottomText && <p className="text-sm break-words text-site-quiet">{item.bottomText}</p>}
              </div>
              {canAsk && (
                <div className="flex flex-col gap-4 border-t border-site-line pt-6">
                  <h2 className="s-heading text-lg">Consultá por esta propiedad</h2>
                  <OfferInquiryForm
                    offerToken={token}
                    framed={false}
                    defaultMessage={`Hola, me interesa «${property.title}» de la propuesta.`}
                  />
                </div>
              )}
              <Link
                href={backHref}
                className="inline-flex h-11 items-center justify-center gap-1 rounded-lg border border-site-line font-medium outline-none hover:border-site-quiet focus-visible:ring-2 focus-visible:ring-site-accent"
              >
                <ChevronLeft className="size-4" aria-hidden />
                Volver a la propuesta
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </SiteRoot>
  );
}
