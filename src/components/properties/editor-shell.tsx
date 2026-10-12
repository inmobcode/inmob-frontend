"use client";

import { Building2, Camera, Check, ChevronDown, ExternalLink, MapPin } from "lucide-react";
import { NavigationMenu } from "radix-ui";
import Link from "next/link";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Property, PropertyStatus } from "@/lib/api/properties";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, stagger } from "@/lib/motion";
import { categoryLabel, LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

export interface SectionTab {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SectionGroup {
  label: string;
  tabs: SectionTab[];
}

const STATUS_DOT: Record<PropertyStatus, string> = {
  PUBLISHED: "bg-primary",
  DRAFT: "bg-amber-500",
  ARCHIVED: "bg-muted-foreground",
};

export function PropertyHeader({ property }: { property: Property }) {
  const ref = useRef<HTMLElement>(null);
  const photos = [...property.photos].sort((a, b) => a.position - b.position);
  const cover = photos.find((photo) => photo.isCover) ?? photos[0];
  const location = [property.area, property.region, property.country].filter(Boolean).join(", ");
  const price = property.price ? `${property.currency} ${property.price.toLocaleString("es-AR")}` : null;
  const publicHref =
    property.status === "PUBLISHED" && property.agencySlug
      ? `/${property.agencySlug}/${property.slug}`
      : null;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from(ref.current, { opacity: 0, y: distance.md, duration: duration.macro, ease: ease.out });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <header ref={ref} className="flex flex-wrap items-center gap-x-5 gap-y-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-secondary sm:size-24">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.url} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-primary/30">
            <Building2 className="size-8" strokeWidth={1.25} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 basis-64 flex-col gap-2">
        <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-primary uppercase">
          {LISTING_TYPE_LABELS[property.listingType]} · {categoryLabel(property.category)}
        </p>
        <h1 className="font-display text-3xl leading-tight text-balance sm:text-4xl">{property.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <span className={cn("size-2 rounded-full", STATUS_DOT[property.status])} />
            {STATUS_LABELS[property.status]}
          </span>
          {price && <span className="tabular-nums">{price}</span>}
          {location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <Camera className="size-3.5" />
            {property.photos.length} {property.photos.length === 1 ? "foto" : "fotos"}
          </span>
        </div>
      </div>

      {publicHref && (
        <Button asChild variant="outline" className="h-10 gap-2 px-5">
          <Link href={publicHref} target="_blank" rel="noreferrer">
            Ver ficha pública
            <ExternalLink />
          </Link>
        </Button>
      )}
    </header>
  );
}

const SHORT_DESCRIPTIONS: Record<string, string> = {
  basico: "Título, tipo y métricas",
  ubicacion: "Dirección, mapa y entorno",
  amenities: "Comodidades y distribución",
  content: "Textos para clientes",
  precios: "Precio y moneda",
  fotos: "Galería y videos",
  disponibilidad: "Bloqueos y calendario iCal",
  "villa-page": "Contenido destacado",
  experiences: "Cerca de la propiedad",
  rates: "Tarifas por temporada",
  essentials: "Management y licencia",
  recomendaciones: "Mejoras sugeridas",
  rooms: "Habitaciones del hotel",
  propietario: "Propietario asociado",
};

/**
 * The popover card for one group. It animates in on mount (it is only
 * mounted while open), and a soft highlight glides between the options as
 * the pointer moves over them.
 */
function GroupPanel({
  group,
  active,
  onChange,
}: {
  group: SectionGroup;
  active: string;
  onChange: (value: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const highlightShown = useRef(false);

  // Items cascade in when the menu opens from closed. When moving between
  // groups the viewport slides the panels instead, so skip it.
  useGSAP(
    () => {
      const switching = panelRef.current?.closest("[data-motion]") != null;
      if (switching) return;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from("[data-panel-item]", {
          opacity: 0,
          y: distance.sm,
          duration: duration.base,
          ease: ease.out,
          stagger: stagger.tight,
          delay: 0.06,
        });
      });
      return () => mm.revert();
    },
    { scope: panelRef },
  );

  function moveHighlight(item: HTMLElement) {
    const highlight = highlightRef.current;
    if (!highlight) return;
    const state = { y: item.offsetTop, height: item.offsetHeight, opacity: 1 };
    if (highlightShown.current && !window.matchMedia(media.reduceMotion).matches) {
      gsap.to(highlight, { ...state, duration: duration.micro + 0.06, ease: ease.out, overwrite: true });
    } else {
      gsap.set(highlight, state);
    }
    highlightShown.current = true;
  }

  function hideHighlight() {
    highlightShown.current = false;
    gsap.to(highlightRef.current, { opacity: 0, duration: duration.micro, overwrite: true });
  }

  return (
    <div ref={panelRef} className="p-2">
      <ul className="relative flex flex-col gap-[5px]" onPointerLeave={hideHighlight}>
        <span
          ref={highlightRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 rounded-xl bg-foreground/[0.06] opacity-0"
        />
        {group.tabs.map((tab) => {
          const isActive = tab.value === active;
          return (
            <li key={tab.value} data-panel-item className="relative">
              <NavigationMenu.Link asChild active={isActive}>
                <button
                  type="button"
                  onClick={() => onChange(tab.value)}
                  onPointerEnter={(event) => moveHighlight(event.currentTarget.parentElement as HTMLElement)}
                  onFocus={(event) => moveHighlight(event.currentTarget.parentElement as HTMLElement)}
                  className={cn(
                    "group/item flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive && "bg-secondary",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover/item:scale-105",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-primary",
                    )}
                  >
                    <tab.icon className="size-4" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className={cn("truncate text-sm", isActive ? "font-semibold" : "font-medium")}>
                      {tab.label}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {SHORT_DESCRIPTIONS[tab.value]}
                    </span>
                  </span>
                  {isActive && <Check className="size-4 shrink-0 text-primary" />}
                </button>
              </NavigationMenu.Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Section menu for the action bar: one pill per group; hovering (or tapping)
 * a pill opens a popover with that group's sections. All groups share one
 * viewport, so moving between pills slides the panels and morphs the card's
 * size and position instead of closing and reopening.
 */
export function SectionNavbar({
  groups,
  active,
  onChange,
}: {
  groups: SectionGroup[];
  active: string;
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const items = useRef<Record<string, HTMLLIElement | null>>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  // The shared card follows the pill that is currently open.
  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const item = value ? items.current[value] : null;
      if (!wrap || !item) {
        wasOpen.current = false;
        return;
      }
      const x = item.offsetLeft;
      if (wasOpen.current && !window.matchMedia(media.reduceMotion).matches) {
        gsap.to(wrap, { x, duration: duration.base, ease: ease.inOut, overwrite: true });
      } else {
        gsap.set(wrap, { x });
      }
      wasOpen.current = true;
    },
    { dependencies: [value] },
  );

  return (
    <NavigationMenu.Root
      value={value}
      onValueChange={setValue}
      delayDuration={60}
      skipDelayDuration={400}
      className="relative min-w-0"
    >
      <NavigationMenu.List className="flex flex-wrap items-center gap-1">
        {groups.map((group) => {
          const groupActive = group.tabs.some((tab) => tab.value === active);
          return (
            <NavigationMenu.Item
              key={group.label}
              value={group.label}
              ref={(node) => {
                items.current[group.label] = node;
              }}
              className="relative"
            >
              <NavigationMenu.Trigger
                className={cn(
                  "group/trigger inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  groupActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground",
                )}
              >
                {group.label}
                <ChevronDown className="size-3.5 transition-transform duration-300 ease-out group-data-[state=open]/trigger:rotate-180" />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content
                className={cn(
                  "w-72",
                  "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in-0 data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out-0",
                  "data-[motion=from-end]:slide-in-from-right-12 data-[motion=from-start]:slide-in-from-left-12",
                  "data-[motion=to-end]:slide-out-to-right-12 data-[motion=to-start]:slide-out-to-left-12",
                  "data-[motion^=from-]:duration-300 data-[motion^=to-]:duration-300",
                )}
              >
                <GroupPanel group={group} active={active} onChange={onChange} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      <div
        ref={wrapRef}
        className={cn("absolute top-full left-0 z-30 pt-[17px]", value ? "pointer-events-auto" : "pointer-events-none")}
      >
        <NavigationMenu.Viewport
          className={cn(
            "relative h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top-left overflow-hidden rounded-2xl bg-popover",
            "shadow-[0_24px_48px_-16px_oklch(0.3_0.05_160/0.35)] ring-1 ring-foreground/5",
            "transition-[width,height] duration-300 ease-out",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-1 data-[state=open]:duration-200",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150",
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
}
