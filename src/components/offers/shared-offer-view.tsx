"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { OfferInquiryForm } from "@/components/offers/offer-inquiry-form";
import { OfferPropertyCard } from "@/components/offers/offer-property-card";
import { ServiceTypeIcon } from "@/components/services/service-type-icon";
import { useFormat } from "@/i18n/format";
import type { Offer } from "@/lib/api/offers";
import { useLabels } from "@/lib/labels";
import { richTextHtml } from "@/lib/rich-text";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

export function SharedOfferView({ initialOffer: offer }: { initialOffer: Offer }) {
  const t = useTranslations("site.offer");
  const labels = useLabels();
  const { money: formatMoney, date } = useFormat();
  // Dates come as yyyy-MM-dd: read them as a calendar day, not a UTC instant.
  const longDate = (iso: string) => date(new Date(`${iso}T12:00:00`), "weekdayLong");
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className={offer.branded ? "flex items-center justify-between gap-4 border-b px-6 py-4" : "flex justify-end px-6 pt-4"}>
        {offer.branded && <p className="text-sm font-medium text-zinc-500">{t("personalized")}</p>}
        <LanguageSwitcher compact className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100" />
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-semibold break-words">{offer.title}</h1>

        {(offer.welcomeTitle || offer.welcomeDateLabel || offer.welcomeContent) && (
          <div className="mt-6 space-y-1 border-b pb-6">
            {offer.welcomeTitle && <h2 className="text-xl font-medium break-words">{offer.welcomeTitle}</h2>}
            {offer.welcomeDateLabel && (
              <p className="text-sm text-zinc-500">{offer.welcomeDateLabel}</p>
            )}
            {offer.welcomeContent && (
              // Cleaned by the backend on save (app/utils/rich_text.py): only the editor's tags.
              <div
                className="rich-text pt-2 text-sm text-zinc-700 dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: richTextHtml(offer.welcomeContent) }}
              />
            )}
          </div>
        )}

        {/* Rentals are options priced per night, as in the editor: adding them up says nothing. */}
        {offer.showPrice && offer.operation !== "RENT" && (offer.total != null || offer.servicesTotal != null) && (
          <p className="mt-6 text-xl font-semibold">
            {t("total", { amount: formatMoney(offer.currency, (offer.total ?? 0) + (offer.servicesTotal ?? 0)) })}
          </p>
        )}

        <div className="mt-8 space-y-10">
          {offer.sections.map((section) => (
            <div key={section.id ?? "ungrouped"}>
              {section.title && <h2 className="text-lg font-medium break-words">{section.title}</h2>}
              {section.text && (
                <div
                  className="rich-text mt-1 text-sm text-zinc-600 dark:text-zinc-400"
                  dangerouslySetInnerHTML={{ __html: richTextHtml(section.text) }}
                />
              )}
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {section.properties.map((item) => (
                  <OfferPropertyCard key={item.id} item={item} currency={offer.currency} offerToken={offer.token} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {(offer.services ?? []).length > 0 && (
          <section className="mt-12 border-t pt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-medium">{t("servicesTitle")}</h2>
                <p className="mt-1 text-sm text-zinc-500">{t("servicesBody")}</p>
              </div>
              {offer.servicesTotal != null && (
                <p className="text-sm text-zinc-500">
                  {t("subtotal")}{" "}
                  <span className="font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">
                    {formatMoney(offer.currency, offer.servicesTotal)}
                  </span>
                </p>
              )}
            </div>
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {offer.services.map((item) => {
                const per = labels.serviceUnitPer(item.unit);
                return (
                  <li key={item.id} className="flex gap-4 overflow-hidden rounded-lg border p-3">
                    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-100 text-zinc-400 dark:bg-zinc-900">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={sizedImage(item.imageUrl, IMAGE_WIDTH.thumb)} alt="" className="size-full object-cover" />
                      ) : (
                        <ServiceTypeIcon type={item.type} className="size-7" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <ServiceTypeIcon type={item.type} className="size-3.5" />
                        {labels.serviceType(item.type)}
                      </p>
                      <h3 className="font-medium break-words">{item.name}</h3>
                      {item.description && <p className="text-sm break-words text-zinc-600 dark:text-zinc-400">{item.description}</p>}
                      {item.date && <p className="text-xs text-zinc-500 first-letter:uppercase">{longDate(item.date)}</p>}
                      {item.note && <p className="text-xs break-words text-zinc-500">{item.note}</p>}
                      <p className="mt-auto pt-1 text-sm tabular-nums">
                        {item.total != null && item.unitPrice != null ? (
                          <>
                            <span className="font-semibold">{formatMoney(offer.currency, item.total)}</span>
                            {(item.quantity > 1 || per) && (
                              <span className="text-zinc-500">
                                {" "}
                                · {labels.serviceUnitCount(item.unit, item.quantity)}
                                {per && ` ${t("unitPrice", { price: formatMoney(offer.currency, item.unitPrice), per })}`}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-zinc-500">
                            {offer.showPrice ? t("priceOnRequest") : labels.serviceUnitCount(item.unit, item.quantity)}
                          </span>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {offer.status === "EXPIRED" && (
          <p className="mt-10 text-sm text-zinc-500">{t("expired")}</p>
        )}

        {offer.branded && offer.status !== "EXPIRED" && (
          <div className="mt-12 border-t pt-8">
            {showContactForm ? (
              <OfferInquiryForm offerToken={offer.token} />
            ) : (
              <Button onClick={() => setShowContactForm(true)}>{t("contact")}</Button>
            )}
          </div>
        )}
      </div>

      {offer.branded && (
        <footer className="border-t px-6 py-6 text-center text-xs text-zinc-500">
          {t("footer")}
        </footer>
      )}
    </div>
  );
}
