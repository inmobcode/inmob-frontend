"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { OfferInquiryForm } from "@/components/offers/offer-inquiry-form";
import { OfferPropertyCard } from "@/components/offers/offer-property-card";
import type { Offer } from "@/lib/api/offers";
import { richTextHtml } from "@/lib/rich-text";

export function SharedOfferView({ initialOffer: offer }: { initialOffer: Offer }) {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {offer.branded && (
        <header className="border-b px-6 py-4">
          <p className="text-sm font-medium text-zinc-500">Propuesta personalizada</p>
        </header>
      )}

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
        {offer.total != null && offer.showPrice && offer.operation !== "RENT" && (
          <p className="mt-6 text-xl font-semibold">
            Total: {offer.currency} {offer.total.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
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

        {offer.status === "EXPIRED" && (
          <p className="mt-10 text-sm text-zinc-500">Esta oferta venció.</p>
        )}

        {offer.branded && offer.status !== "EXPIRED" && (
          <div className="mt-12 border-t pt-8">
            {showContactForm ? (
              <OfferInquiryForm offerToken={offer.token} />
            ) : (
              <Button onClick={() => setShowContactForm(true)}>Contactanos</Button>
            )}
          </div>
        )}
      </div>

      {offer.branded && (
        <footer className="border-t px-6 py-6 text-center text-xs text-zinc-500">
          Esta propuesta fue generada especialmente para vos.
        </footer>
      )}
    </div>
  );
}
