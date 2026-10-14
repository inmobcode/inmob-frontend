"use client";

import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Bath,
  BedDouble,
  Building2,
  Camera,
  MapPin,
  Ruler,
} from "lucide-react";
import Link from "next/link";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { useParams, useRouter } from "next/navigation";

import { coverOf, initials } from "@/components/properties/property-card";
import { StatusPill } from "@/components/properties/status-pill";
import {
  ControlsZone,
  PropertyMenu,
  ViewOnSiteButton,
  SelectToggle,
  type PropertyActions,
} from "@/components/properties/property-controls";
import type { Property } from "@/lib/api/properties";
import { categoryLabel, LISTING_TYPE_LABELS } from "@/lib/properties-labels";
import { parseApiDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

const number = (value: number) => value.toLocaleString("es-AR");

function Price({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  return property.price ? (
    <span className={cn("tabular-nums", className)}>
      <span className="mr-1 text-xs font-medium text-muted-foreground">
        {property.currency}
      </span>
      <span className="font-semibold">{number(property.price)}</span>
    </span>
  ) : (
    <span className={cn("text-muted-foreground", className)}>A consultar</span>
  );
}

function Thumb({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const cover = coverOf(property);
  const archived = property.status === "ARCHIVED";
  return (
    <div className={cn("relative overflow-hidden bg-secondary", className)}>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover.url}
          alt=""
          loading="lazy"
          className={cn(
            "size-full object-cover",
            archived && "opacity-80 grayscale",
          )}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-primary/30">
          <Building2 className="size-1/3" strokeWidth={1.25} />
        </div>
      )}
    </div>
  );
}

const ROW_CLASS =
  "property-card group flex flex-col gap-4 rounded-2xl bg-card p-3 shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 outline-none transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0.3_0.05_160/0.06),0_24px_44px_-12px_oklch(0.3_0.05_160/0.26)] focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-row";

/** One property as a wide row: photo on the left, details in the middle, price and status on the right. */
export function PropertyRow({
  property,
  actions,
  selected,
  selecting,
  onToggle,
}: {
  property: Property;
  actions: PropertyActions;
  selected: boolean;
  selecting: boolean;
  onToggle: () => void;
}) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const location = [property.area, property.region, property.country]
    .filter(Boolean)
    .join(", ");
  const updated = formatDistanceToNow(parseApiDate(property.updatedAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <Link
      href={`/${agencySlug}/properties/${property.id}`}
      data-flip-id={property.id}
      className={cn(ROW_CLASS, selected && "ring-2 ring-primary")}
    >
      <div className="relative sm:w-56 sm:shrink-0">
        <Thumb property={property} className="aspect-[4/3] w-full rounded-xl" />
        {property.photos.length > 0 && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-foreground/55 px-2 py-0.5 text-xs font-medium text-background backdrop-blur">
            <Camera className="size-3" />
            {property.photos.length}
          </span>
        )}
        <ControlsZone
          className={cn(
            "absolute bottom-2 left-2 transition-opacity duration-200 [@media(hover:none)]:opacity-100",
            selecting || selected
              ? "opacity-100"
              : "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
          )}
        >
          <SelectToggle
            checked={selected}
            onToggle={onToggle}
            label={
              selected
                ? `Quitar ${property.title} de la selección`
                : `Seleccionar ${property.title}`
            }
          />
        </ControlsZone>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:py-1">
        <p className="text-xs font-medium text-primary">
          {LISTING_TYPE_LABELS[property.listingType]} ·{" "}
          {categoryLabel(property.category)}
        </p>
        <h3
          className="font-display text-xl leading-tight text-balance line-clamp-2"
          title={property.title}
        >
          {property.title}
        </h3>
        {location && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm tabular-nums">
          {property.bedrooms != null && (
            <span
              className="inline-flex items-center gap-1.5"
              title={`${number(property.bedrooms)} dormitorios`}
            >
              <BedDouble className="size-4 text-muted-foreground" />
              {number(property.bedrooms)}
            </span>
          )}
          {property.bathrooms != null && (
            <span
              className="inline-flex items-center gap-1.5"
              title={`${number(property.bathrooms)} baños`}
            >
              <Bath className="size-4 text-muted-foreground" />
              {number(property.bathrooms)}
            </span>
          )}
          {property.areaSqm != null && (
            <span
              className="inline-flex items-center gap-1.5"
              title="Superficie construida"
            >
              <Ruler className="size-4 text-muted-foreground" />
              {number(property.areaSqm)} m²
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:w-44 sm:flex-col sm:items-end sm:py-1 sm:text-right">
        <ControlsZone className="flex items-center gap-2">
          <StatusPill status={property.status} />
          <ViewOnSiteButton property={property} className="bg-foreground/[0.06] hover:bg-foreground/10" />
          <PropertyMenu
            property={property}
            actions={actions}
            className="bg-foreground/[0.06] hover:bg-foreground/10"
          />
        </ControlsZone>
        <div className="flex flex-col gap-1 sm:items-end">
          <Price property={property} className="text-xl" />
          <span className="truncate text-xs text-muted-foreground">
            {property.owner ? `${property.owner.name} · ${updated}` : updated}
          </span>
        </div>
      </div>
    </Link>
  );
}

const HEAD = "px-4 py-3 text-center text-xs font-medium text-muted-foreground";

/** Dense, sortable-looking table: one property per line. */
/**
 * A preview card on hover over a listing's name and location: the cover, the
 * full title and place (which the table cuts short), the price and the key
 * figures. Opens after a short pause so passing the pointer over rows doesn't
 * flash cards; opens on keyboard focus of the name too.
 */
function PropertyPeek({
  property,
  children,
}: {
  property: Property;
  children: React.ReactNode;
}) {
  const cover = coverOf(property);
  const place = [
    property.address,
    property.area,
    property.region,
    property.country,
  ]
    .filter(Boolean)
    .join(", ");
  const specs = [
    property.bedrooms != null && {
      icon: BedDouble,
      text: `${number(property.bedrooms)} dorm.`,
    },
    property.bathrooms != null && {
      icon: Bath,
      text: `${number(property.bathrooms)} baños`,
    },
    property.areaSqm != null && {
      icon: Ruler,
      text: `${number(property.areaSqm)} m²`,
    },
  ].filter(Boolean) as { icon: typeof Bath; text: string }[];

  return (
    <TooltipPrimitive.Root delayDuration={350}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={10}
          collisionPadding={16}
          className="z-50 w-80 origin-(--radix-tooltip-content-transform-origin) overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-[0_2px_6px_oklch(0.3_0.05_160/0.06),0_24px_48px_-16px_oklch(0.3_0.05_160/0.3)] ring-1 ring-foreground/10 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <div className="relative aspect-[16/9] bg-secondary">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover.url} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-primary/30">
                <Building2 className="size-10" strokeWidth={1.25} />
              </div>
            )}
            {property.photos.length > 1 && (
              <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-foreground/55 px-2 py-0.5 text-xs font-medium text-background backdrop-blur">
                <Camera className="size-3" />
                {property.photos.length}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-primary">
                {LISTING_TYPE_LABELS[property.listingType]} ·{" "}
                {categoryLabel(property.category)}
              </p>
              <p className="font-display text-lg leading-snug text-balance">
                {property.title}
              </p>
              {place && (
                <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-3.5 shrink-0" />
                  <span>{place}</span>
                </p>
              )}
              {specs.length > 0 && (
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground tabular-nums">
                  {specs.map((spec) => (
                    <span
                      key={spec.text}
                      className="inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      <spec.icon className="size-3.5" />
                      {spec.text}
                    </span>
                  ))}
                </p>
              )}
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-foreground/5 pt-3">
              <Price property={property} className="text-base" />
              <span className="text-xs whitespace-nowrap text-muted-foreground">
                Actualizada {shortAgo(property.updatedAt)}
              </span>
            </div>
          </div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

/** "hace 20 min", "hace 3 h", "ayer", "hace 4 días", "3 oct": short enough for a table cell. */
function shortAgo(iso: string) {
  const date = parseApiDate(iso);
  const minutes = Math.max(
    0,
    Math.round((Date.now() - date.getTime()) / 60_000),
  );
  if (minutes < 1) return "recién";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return "ayer";
  if (days < 7) return `hace ${days} días`;
  return format(date, "d MMM", { locale: es });
}

/*
 * Which columns show depends on the table's own width (a container query), not
 * the window's: the sidebar can be expanded or collapsed. Fixed widths keep
 * every column in place and give the rest to the property, so the table never
 * scrolls sideways. What doesn't fit moves under the title.
 */
const SHOW_STATUS_PRICE = "hidden @min-[600px]:table-cell";
const SHOW_SPECS = "hidden @min-[780px]:table-cell";
const SHOW_UPDATED = "hidden @min-[960px]:table-cell";
const SHOW_OWNER = "hidden @min-[1120px]:table-cell";

export function PropertiesTable({
  properties,
  actions,
  selectedIds,
  onToggle,
  onToggleAll,
}: {
  properties: Property[];
  actions: PropertyActions;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}) {
  const allSelected =
    properties.length > 0 &&
    properties.every((property) => selectedIds.has(property.id));
  const someSelected =
    !allSelected && properties.some((property) => selectedIds.has(property.id));
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();

  return (
    <div className="@container overflow-hidden rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            <th className={cn(HEAD, "w-12 pr-0")}>
              <SelectToggle
                checked={allSelected}
                indeterminate={someSelected}
                onToggle={onToggleAll}
                label={
                  allSelected
                    ? "Quitar la selección de todas"
                    : "Seleccionar todas"
                }
                className="size-5"
              />
            </th>
            <th className={cn(HEAD, "pl-3 text-left")}>Propiedad</th>
            <th className={cn(HEAD, "w-28", SHOW_STATUS_PRICE)}>Estado</th>
            <th className={cn(HEAD, "w-36", SHOW_STATUS_PRICE)}>Precio</th>
            <th className={cn(HEAD, "w-16 px-2", SHOW_SPECS)}>Dorm.</th>
            <th className={cn(HEAD, "w-16 px-2", SHOW_SPECS)}>Baños</th>
            <th className={cn(HEAD, "w-24 px-2", SHOW_SPECS)}>Superficie</th>
            <th className={cn(HEAD, "w-40 text-left", SHOW_OWNER)}>
              Propietario
            </th>
            <th className={cn(HEAD, "w-28", SHOW_UPDATED)}>Actualizada</th>
            <th className={cn(HEAD, "w-24")}>
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => {
            const location = [property.area, property.region]
              .filter(Boolean)
              .join(", ");
            const specs = [
              property.bedrooms != null && `${number(property.bedrooms)} dorm.`,
              property.bathrooms != null &&
                `${number(property.bathrooms)} baños`,
              property.areaSqm != null && `${number(property.areaSqm)} m²`,
            ].filter(Boolean);
            return (
              <tr
                key={property.id}
                data-flip-id={property.id}
                onClick={() =>
                  router.push(`/${agencySlug}/properties/${property.id}`)
                }
                className={cn(
                  "property-card cursor-pointer border-t border-foreground/5 transition-colors hover:bg-foreground/[0.03]",
                  selectedIds.has(property.id) &&
                    "bg-primary/[0.06] hover:bg-primary/[0.08]",
                )}
              >
                <td
                  className="w-12 py-3 pr-0 pl-4"
                  onClick={(event) => event.stopPropagation()}
                >
                  <SelectToggle
                    checked={selectedIds.has(property.id)}
                    onToggle={() => onToggle(property.id)}
                    label={`Seleccionar ${property.title}`}
                    className="size-5"
                  />
                </td>
                <td className="py-3 pr-4 pl-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Thumb
                      property={property}
                      className="size-12 shrink-0 rounded-lg"
                    />
                    <div className="flex min-w-0 flex-col">
                      <PropertyPeek property={property}>
                        <div className="flex min-w-0 flex-col">
                          <Link
                            href={`/${agencySlug}/properties/${property.id}`}
                            onClick={(event) => event.stopPropagation()}
                            className="truncate font-medium outline-none hover:underline focus-visible:underline"
                          >
                            {property.title}
                          </Link>
                          <span className="truncate text-xs text-muted-foreground">
                            {LISTING_TYPE_LABELS[property.listingType]} ·{" "}
                            {categoryLabel(property.category)}
                            {location && ` · ${location}`}
                          </span>
                        </div>
                      </PropertyPeek>
                      {/* What the hidden columns would say, when the table is too narrow for them. */}
                      {specs.length > 0 && (
                        <span className="truncate text-xs text-muted-foreground tabular-nums @min-[780px]:hidden">
                          {specs.join(" · ")}
                        </span>
                      )}
                      <span className="mt-1 flex items-center gap-2 @min-[600px]:hidden">
                        <StatusPill status={property.status} />
                        <Price property={property} className="text-xs" />
                      </span>
                    </div>
                  </div>
                </td>
                <td className={cn("px-2 py-3 text-center", SHOW_STATUS_PRICE)}>
                  <StatusPill status={property.status} />
                </td>
                <td
                  className={cn(
                    "truncate px-3 py-3 text-center",
                    SHOW_STATUS_PRICE,
                  )}
                >
                  <Price property={property} />
                </td>
                <td
                  className={cn(
                    "px-2 py-3 text-center tabular-nums",
                    SHOW_SPECS,
                  )}
                >
                  {property.bedrooms != null ? number(property.bedrooms) : "—"}
                </td>
                <td
                  className={cn(
                    "px-2 py-3 text-center tabular-nums",
                    SHOW_SPECS,
                  )}
                >
                  {property.bathrooms != null
                    ? number(property.bathrooms)
                    : "—"}
                </td>
                <td
                  className={cn(
                    "px-2 py-3 text-center whitespace-nowrap tabular-nums",
                    SHOW_SPECS,
                  )}
                >
                  {property.areaSqm != null
                    ? `${number(property.areaSqm)} m²`
                    : "—"}
                </td>
                <td className={cn("px-4 py-3", SHOW_OWNER)}>
                  {property.owner ? (
                    <span
                      className="flex min-w-0 items-center gap-2"
                      title={property.owner.name}
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.6rem] font-semibold text-secondary-foreground">
                        {initials(property.owner.name)}
                      </span>
                      <span className="truncate">{property.owner.name}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td
                  className={cn(
                    "px-2 py-3 text-center whitespace-nowrap text-muted-foreground",
                    SHOW_UPDATED,
                  )}
                  title={format(
                    parseApiDate(property.updatedAt),
                    "d 'de' MMMM, HH:mm",
                    { locale: es },
                  )}
                >
                  {shortAgo(property.updatedAt)}
                </td>
                <td
                  className="w-24 py-3 pr-4"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <ViewOnSiteButton property={property} className="bg-foreground/[0.06] hover:bg-foreground/10" />
                    <PropertyMenu
                      property={property}
                      actions={actions}
                      className="bg-foreground/[0.06] hover:bg-foreground/10"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
