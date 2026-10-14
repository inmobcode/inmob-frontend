import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { OfferPropertyItem } from "@/lib/api/offers";
import { categoryLabel, LISTING_TYPE_LABELS } from "@/lib/properties-labels";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

// A fixed locale: the page renders on the server and in the browser, and both must print the same.
const money = (value: number) => value.toLocaleString("es-AR", { maximumFractionDigits: 0 });

export function OfferPropertyCard({
  item,
  currency,
  offerToken,
}: {
  item: OfferPropertyItem;
  currency: string;
  offerToken: string;
}) {
  const href = `/offer/${offerToken}/properties/${item.propertyId}`;
  const property = item.property;
  const cover = property.photos.find((p) => p.isCover) ?? property.photos[0];
  const perNight = property.listingType === "RENT" ? " /noche" : "";

  return (
    <div className="overflow-hidden rounded-lg border bg-white dark:bg-zinc-950">
      {/* Image and title link to the property; the brochure/site buttons below stay separate links. */}
      <Link href={href} tabIndex={-1} aria-hidden className="block aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sizedImage(cover.url, IMAGE_WIDTH.card)} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
        )}
      </Link>
      <div className="space-y-1 p-4">
        <p className="text-xs text-zinc-500">
          {LISTING_TYPE_LABELS[property.listingType]} · {categoryLabel(property.category)}
        </p>
        <h3 className="font-medium break-words">
          <Link href={href} className="underline-offset-4 hover:underline">
            {property.title}
          </Link>
        </h3>
        <p className="text-sm text-zinc-500">
          {[property.area, property.region, property.country].filter(Boolean).join(", ")}
        </p>

        <div className="pt-1">
          {item.displayPrice != null ? (
            <>
              {item.initialPrice != null && (
                <p className="text-sm text-zinc-400 line-through">
                  {currency} {money(item.initialPrice)}
                </p>
              )}
              <p className="font-semibold">
                {currency} {money(item.displayPrice)}
                {perNight && <span className="text-sm font-normal text-zinc-500">{perNight}</span>}
              </p>
            </>
          ) : (
            <p className="font-semibold">Consultar precio</p>
          )}
        </div>

        {item.securityDeposit != null && (
          <p className="text-xs text-zinc-500">
            Depósito de seguridad: {currency} {money(item.securityDeposit)}
          </p>
        )}

        {item.bottomText && <p className="text-xs break-words text-zinc-500">{item.bottomText}</p>}

        <Link href={href} className="inline-block pt-1 text-sm font-medium underline-offset-4 hover:underline">
          Ver propiedad
        </Link>

        {(property.brochureUrl || property.websiteUrl) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {property.brochureUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={property.brochureUrl} target="_blank" rel="noopener noreferrer">
                  Ver folleto
                </a>
              </Button>
            )}
            {property.websiteUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={property.websiteUrl} target="_blank" rel="noopener noreferrer">
                  Ver sitio
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
