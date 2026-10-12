"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PublicPropertyCard } from "@/components/public/property-card";
import type { PublicAgency } from "@/lib/api/agency";
import { listPublicProperties, type ListingType } from "@/lib/api/properties";
import { LISTING_TYPE_LABELS } from "@/lib/properties-labels";

interface Filters {
  listingType: string;
  category: string;
  country: string;
  region: string;
  area: string;
  minPrice: string;
  maxPrice: string;
  q: string;
}

function filtersFromParams(params: URLSearchParams): Filters {
  return {
    listingType: params.get("listingType") ?? "",
    category: params.get("category") ?? "",
    country: params.get("country") ?? "",
    region: params.get("region") ?? "",
    area: params.get("area") ?? "",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    q: params.get("q") ?? "",
  };
}

export function AgencyPortal({ agencySlug, agency }: { agencySlug: string; agency: PublicAgency }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => filtersFromParams(searchParams));

  const { data: properties, isLoading } = useQuery({
    queryKey: ["public-properties", agencySlug, filters],
    queryFn: () =>
      listPublicProperties(agencySlug, {
        listingType: (filters.listingType || undefined) as ListingType | undefined,
        category: filters.category || undefined,
        country: filters.country || undefined,
        region: filters.region || undefined,
        area: filters.area || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        q: filters.q || undefined,
      }),
  });

  function applyFilters(next: Filters) {
    setFilters(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function update<K extends keyof Filters>(key: K, value: string) {
    applyFilters({ ...filters, [key]: value });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {(agency.logoUrl || agency.name) && (
        <div className="mb-8 flex items-center gap-3 border-b pb-6">
          {agency.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={agency.logoUrl} alt={agency.name} className="h-12 w-auto object-contain" />
          )}
          <h1 className="text-xl font-semibold">{agency.name}</h1>
        </div>
      )}

      <h2 className="text-2xl font-semibold">Propiedades</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select value={filters.listingType || "ALL"} onValueChange={(v) => update("listingType", v === "ALL" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los tipos</SelectItem>
            {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Categoría"
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
        />
        <Input
          placeholder="País"
          value={filters.country}
          onChange={(e) => update("country", e.target.value)}
        />
        <Input
          placeholder="Región"
          value={filters.region}
          onChange={(e) => update("region", e.target.value)}
        />
        <Input
          placeholder="Área"
          value={filters.area}
          onChange={(e) => update("area", e.target.value)}
        />
        <Input
          placeholder="Precio mín."
          inputMode="decimal"
          value={filters.minPrice}
          onChange={(e) => update("minPrice", e.target.value)}
        />
        <Input
          placeholder="Precio máx."
          inputMode="decimal"
          value={filters.maxPrice}
          onChange={(e) => update("maxPrice", e.target.value)}
        />
        <Input
          className="col-span-2"
          placeholder="Buscar por título"
          value={filters.q}
          onChange={(e) => update("q", e.target.value)}
        />
      </div>

      {Object.values(filters).some(Boolean) && (
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              applyFilters({
                listingType: "",
                category: "",
                country: "",
                region: "",
                area: "",
                minPrice: "",
                maxPrice: "",
                q: "",
              })
            }
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {isLoading && <p className="mt-8 text-sm text-zinc-500">Cargando...</p>}

      {properties && (
        <>
          <p className="mt-6 text-sm text-zinc-500">
            {properties.length} propiedad{properties.length === 1 ? "" : "es"} encontrada
            {properties.length === 1 ? "" : "s"}.
          </p>
          {properties.length === 0 ? (
            <p className="mt-8 text-sm text-zinc-500">
              No se encontraron propiedades con esos filtros.
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
        </>
      )}
    </div>
  );
}
