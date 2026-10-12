import Link from "next/link";

import { LISTING_TYPE_LABELS } from "@/lib/properties-labels";
import type { Property } from "@/lib/api/properties";

export function PublicPropertyCard({
  property,
  agencySlug,
}: {
  property: Property;
  agencySlug: string;
}) {
  const cover = property.photos.find((p) => p.isCover) ?? property.photos[0];

  return (
    <Link
      href={`/page/${agencySlug}/properties/${property.slug}`}
      className="block overflow-hidden rounded-lg border bg-white transition hover:shadow-md dark:bg-zinc-950"
    >
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
        <p className="font-semibold">
          {property.price ? `${property.currency} ${property.price.toLocaleString()}` : "Consultar precio"}
        </p>
      </div>
    </Link>
  );
}
