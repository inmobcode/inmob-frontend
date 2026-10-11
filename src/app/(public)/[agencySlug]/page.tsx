import { notFound } from "next/navigation";

import { PublicPropertyCard } from "@/components/public/property-card";
import { ApiError } from "@/lib/api/client";
import { listPublicProperties } from "@/lib/api/properties";

export default async function AgencyPortalPage({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;

  let properties;
  try {
    properties = await listPublicProperties(agencySlug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Propiedades</h1>
      <p className="mt-2 text-sm text-zinc-500">
        {properties.length} propiedad{properties.length === 1 ? "" : "es"} publicada
        {properties.length === 1 ? "" : "s"}.
      </p>
      {properties.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500">
          Esta agencia todavía no publicó propiedades.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PublicPropertyCard
              key={property.id}
              property={property}
              agencySlug={agencySlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
