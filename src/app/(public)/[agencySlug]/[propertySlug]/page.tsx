import { notFound } from "next/navigation";

import { InquiryForm } from "@/components/public/inquiry-form";
import { ApiError } from "@/lib/api/client";
import { getPublicProperty } from "@/lib/api/properties";
import { LISTING_TYPE_LABELS } from "@/lib/properties-labels";

export default async function PublicPropertyPage({
  params,
}: {
  params: Promise<{ agencySlug: string; propertySlug: string }>;
}) {
  const { agencySlug, propertySlug } = await params;

  let property;
  try {
    property = await getPublicProperty(agencySlug, propertySlug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const cover = property.photos.find((p) => p.isCover) ?? property.photos[0];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover.url}
          alt={property.title}
          className="mb-6 aspect-[16/9] w-full rounded-lg object-cover"
        />
      )}
      <p className="text-xs uppercase text-zinc-500">
        {LISTING_TYPE_LABELS[property.listingType]} · {property.category}
      </p>
      <h1 className="mt-1 text-3xl font-semibold">{property.title}</h1>
      <p className="mt-1 text-zinc-500">
        {[property.address, property.area, property.region, property.country]
          .filter(Boolean)
          .join(", ")}
      </p>
      <p className="mt-4 text-2xl font-semibold">
        {property.price ? `${property.currency} ${property.price.toLocaleString()}` : "Consultar precio"}
      </p>

      <div className="mt-6 flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
        {property.bedrooms != null && <span>{property.bedrooms} dormitorios</span>}
        {property.bathrooms != null && <span>{property.bathrooms} baños</span>}
        {property.areaSqm != null && <span>{property.areaSqm} m²</span>}
      </div>

      {property.content?.summary && (
        <p className="mt-6 whitespace-pre-line text-lg text-zinc-700 dark:text-zinc-300">
          {property.content.summary}
        </p>
      )}
      {property.content?.description && (
        <p className="mt-4 whitespace-pre-line text-zinc-700 dark:text-zinc-300">
          {property.content.description}
        </p>
      )}

      {property.amenities.length > 0 && (
        <div className="mt-6">
          <h2 className="font-medium">Amenities</h2>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {property.amenities.map((amenity) => (
              <li key={amenity} className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {property.photos.length > 1 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {property.photos
            .filter((photo) => photo.id !== cover?.id)
            .map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.url}
                alt={property.title}
                className="aspect-square rounded-md object-cover"
              />
            ))}
        </div>
      )}

      <div className="mt-10">
        <InquiryForm agencySlug={agencySlug} propertyId={property.id} />
      </div>
    </div>
  );
}
