import { Button } from "@/components/ui/button";
import type { OfferPropertyItem } from "@/lib/api/offers";
import { LISTING_TYPE_LABELS } from "@/lib/properties-labels";

export function OfferPropertyCard({
  item,
  currency,
}: {
  item: OfferPropertyItem;
  currency: string;
}) {
  const property = item.property;
  const cover = property.photos.find((p) => p.isCover) ?? property.photos[0];

  return (
    <div className="overflow-hidden rounded-lg border bg-white dark:bg-zinc-950">
      <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.url} alt={property.title} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase text-zinc-500">
          {LISTING_TYPE_LABELS[property.listingType]} · {property.category}
        </p>
        <h3 className="font-medium">{property.title}</h3>
        <p className="text-sm text-zinc-500">
          {[property.area, property.region, property.country].filter(Boolean).join(", ")}
        </p>

        <div className="pt-1">
          {item.displayPrice != null ? (
            <>
              {item.initialPrice != null && (
                <p className="text-sm text-zinc-400 line-through">
                  {currency} {item.initialPrice.toLocaleString()}
                </p>
              )}
              <p className="font-semibold">
                {currency} {item.displayPrice.toLocaleString()}
              </p>
            </>
          ) : (
            <p className="font-semibold">Consultar precio</p>
          )}
        </div>

        {item.securityDeposit != null && (
          <p className="text-xs text-zinc-500">
            Depósito de seguridad: {currency} {item.securityDeposit.toLocaleString()}
          </p>
        )}

        {item.bottomText && <p className="text-xs text-zinc-500">{item.bottomText}</p>}

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
