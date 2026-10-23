import { Check, ChevronLeft, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { cache } from "react";

import { OfferInquiryForm } from "@/components/offers/offer-inquiry-form";
import { placeOf } from "@/components/public/property-card";
import { PropertyGallery } from "@/components/public/property-gallery";
import { SITE_WRAP, SiteRoot } from "@/components/public/site-chrome";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LOCALE_TAGS } from "@/i18n/config";
import type { LooseTranslator } from "@/i18n/loose";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { getPublicOffer } from "@/lib/api/offers";
import { getLabels } from "@/lib/labels-server";
import { listingDescription, listingImages } from "@/lib/listing-seo";
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
  const title = `${item.property.title} · ${offer.title}`;
  const locale = await getLocale();
  const seo = await getTranslations("site.seo");
  const description = listingDescription(item.property, seo as unknown as LooseTranslator, await getLabels(), LOCALE_TAGS[locale]);
  const images = listingImages(item.property);

  return {
    // Absolute: this is the agency's own offer link, not a Tivvo surface.
    title: { absolute: title },
    description,
    robots: { index: false },
    // Clients get this link by WhatsApp: the card carries the listing's own photo.
    openGraph: { type: "website", title, description, images },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images },
  };
}

export default async function OfferPropertyPage({ params }: { params: Params }) {
  const { token, propertyId } = await params;
  const { offer, item } = await loadItem(token, propertyId);
  const t = await getTranslations("site.offer");
  const facts = await getTranslations("site.facts");
  const labels = await getLabels();
  const tag = LOCALE_TAGS[await getLocale()];
  const money = (value: number) => value.toLocaleString(tag, { maximumFractionDigits: 0 });
  const property = item.property;
  const location = [property.address, placeOf(property)].filter(Boolean).join(" · ");
  const keyFacts = propertyFacts(property, facts as unknown as LooseTranslator, (value) => value.toLocaleString(tag));
  const groups = propertyFeatureGroups(property, facts as unknown as LooseTranslator, labels);
  const perNight = property.listingType === "RENT" ? ` ${t("perNight")}` : "";
  const backHref = `/offer/${token}`;
  const canAsk = offer.branded && offer.status !== "EXPIRED";

  return (
    <SiteRoot site={resolveSite(null)}>
      <main className="flex-1">
        <div className={cn(SITE_WRAP, "flex flex-col gap-6 pt-6 lg:pt-8")}>
          <div className="flex items-center justify-between gap-4">
            <Link
              href={backHref}
              className="-ml-1 inline-flex w-fit items-center gap-1 rounded-sm text-sm text-site-quiet outline-none hover:text-site-ink focus-visible:ring-2 focus-visible:ring-site-accent"
            >
              <ChevronLeft className="size-4" aria-hidden />
              {t("back")}
            </Link>
            <LanguageSwitcher compact className="text-site-quiet hover:text-site-ink" />
          </div>
          <PropertyGallery photos={property.photos} title={property.title} />
        </div>

        <div className={cn(SITE_WRAP, "grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16 lg:py-14")}>
          <article className="flex min-w-0 flex-col gap-10">
            <header className="flex flex-col gap-3">
              <p className="text-sm text-site-quiet">
                {labels.listingType(property.listingType)} · {labels.category(property.category)}
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
              <section aria-label={t("description")} className="flex max-w-prose flex-col gap-4">
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
                <p className="text-sm text-site-quiet">{t("priceHere")}</p>
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
                  <p className="s-heading text-3xl">{t("priceOnRequest")}</p>
                )}
                {item.securityDeposit != null && (
                  <p className="text-sm text-site-quiet">
                    {t("deposit", { amount: `${offer.currency} ${money(item.securityDeposit)}` })}
                  </p>
                )}
                {item.bottomText && <p className="text-sm break-words text-site-quiet">{item.bottomText}</p>}
              </div>
              {canAsk && (
                <div className="flex flex-col gap-4 border-t border-site-line pt-6">
                  <h2 className="s-heading text-lg">{t("askTitle")}</h2>
                  <OfferInquiryForm
                    offerToken={token}
                    framed={false}
                    defaultMessage={t("askMessage", { title: property.title })}
                  />
                </div>
              )}
              <Link
                href={backHref}
                className="inline-flex h-11 items-center justify-center gap-1 rounded-lg border border-site-line font-medium outline-none hover:border-site-quiet focus-visible:ring-2 focus-visible:ring-site-accent"
              >
                <ChevronLeft className="size-4" aria-hidden />
                {t("back")}
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </SiteRoot>
  );
}
