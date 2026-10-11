"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OfferInquiryForm } from "@/components/offers/offer-inquiry-form";
import { OfferPropertyCard } from "@/components/offers/offer-property-card";
import type { Offer } from "@/lib/api/offers";
import { OFFER_STATUS_LABELS } from "@/lib/properties-labels";

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{offer.title}</h1>
          <Badge>{OFFER_STATUS_LABELS[offer.status]}</Badge>
        </div>

        {(offer.welcomeTitle || offer.welcomeDateLabel || offer.welcomeContent) && (
          <div className="mt-6 space-y-1 border-b pb-6">
            {offer.welcomeTitle && <h2 className="text-xl font-medium">{offer.welcomeTitle}</h2>}
            {offer.welcomeDateLabel && (
              <p className="text-sm text-zinc-500">{offer.welcomeDateLabel}</p>
            )}
            {offer.welcomeContent && (
              <p className="whitespace-pre-line text-sm text-zinc-700 dark:text-zinc-300">
                {offer.welcomeContent}
              </p>
            )}
          </div>
        )}

        {offer.total != null && offer.showPrice && (
          <p className="mt-6 text-xl font-semibold">
            Total: {offer.currency} {offer.total.toLocaleString()}
          </p>
        )}

        <div className="mt-8 space-y-10">
          {offer.sections.map((section) => (
            <div key={section.id ?? "ungrouped"}>
              {section.title && <h2 className="text-lg font-medium">{section.title}</h2>}
              {section.text && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{section.text}</p>
              )}
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {section.properties.map((item) => (
                  <OfferPropertyCard key={item.id} item={item} currency={offer.currency} />
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
