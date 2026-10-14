"use client";

import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarClock, Clock, FileText, Link2, MoreHorizontal, Pencil, Send, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { OfferStatusPill } from "@/components/offers/offer-status-pill";
import { ControlsZone } from "@/components/properties/property-controls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Offer } from "@/lib/api/offers";
import { getPublicOrigin } from "@/lib/public-origin";
import { OFFER_OPERATION_LABELS } from "@/lib/properties-labels";
import { cn } from "@/lib/utils";

export interface OfferActions {
  send: (id: string) => void;
  requestDelete: (id: string) => void;
}

export function propertiesOf(offer: Offer) {
  return offer.sections.flatMap((section) => section.properties);
}

/** Up to three different cover photos, in the order the properties appear. */
export function coversOf(offer: Offer) {
  const urls: string[] = [];
  for (const item of propertiesOf(offer)) {
    const photos = [...item.property.photos].sort((a, b) => a.position - b.position);
    const cover = photos.find((photo) => photo.isCover) ?? photos[0];
    if (cover && !urls.includes(cover.url)) urls.push(cover.url);
    if (urls.length === 3) break;
  }
  return urls;
}

export function Collage({ urls }: { urls: string[] }) {
  if (urls.length === 0) {
    return (
      <div className="flex size-full items-center justify-center text-primary/30">
        <FileText className="size-14" strokeWidth={1.25} />
      </div>
    );
  }
  if (urls.length === 1) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={urls[0]} alt="" loading="lazy" className="size-full object-cover" />;
  }
  return (
    <div className="grid size-full grid-cols-[2fr_1fr] grid-rows-2 gap-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urls[0]} alt="" loading="lazy" className="row-span-2 size-full object-cover" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urls[1]} alt="" loading="lazy" className="size-full object-cover" />
      {urls[2] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={urls[2]} alt="" loading="lazy" className="size-full object-cover" />
      ) : (
        <div className="bg-secondary" />
      )}
    </div>
  );
}

export function OfferMenu({ offer, actions, className }: { offer: Offer; actions: OfferActions; className?: string }) {
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${getPublicOrigin()}/offer/${offer.token}`);
      toast.success("Link copiado");
    } catch {
      toast.error("No se pudo copiar el link");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Acciones de ${offer.title}`}
          className={cn("flex size-8 shrink-0 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-colors outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-card", className)}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5">
        <DropdownMenuItem className="rounded-xl py-2" onSelect={() => router.push(`/${agencySlug}/offers/${offer.id}`)}>
          <Pencil />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl py-2" onSelect={copyLink}>
          <Link2 />
          Copiar link
        </DropdownMenuItem>
        {offer.status === "DRAFT" && (
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => actions.send(offer.id)}>
            <Send />
            Marcar como enviada
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="rounded-xl py-2" onSelect={() => actions.requestDelete(offer.id)}>
          <Trash2 />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const CARD_CLASS =
  "offer-card group flex flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_2px_oklch(0.3_0.05_160/0.04),0_12px_32px_-12px_oklch(0.3_0.05_160/0.14)] ring-1 ring-foreground/5 outline-none transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0.3_0.05_160/0.06),0_24px_44px_-12px_oklch(0.3_0.05_160/0.26)] focus-visible:ring-3 focus-visible:ring-ring/50";

export function OfferCard({ offer, actions }: { offer: Offer; actions: OfferActions }) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const items = propertiesOf(offer);
  const covers = coversOf(offer);
  const expired = offer.status === "EXPIRED";
  const updated = formatDistanceToNow(new Date(offer.updatedAt), { addSuffix: true, locale: es });
  const client = offer.clientName?.trim();

  return (
    <Link href={`/${agencySlug}/offers/${offer.id}`} className={CARD_CLASS}>
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <div className={cn("size-full transition-transform duration-700 ease-out group-hover:scale-105", expired && "opacity-70 grayscale")}>
          <Collage urls={covers} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
        <ControlsZone
          className="absolute top-3 right-3 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        >
          <OfferMenu offer={offer} actions={actions} />
        </ControlsZone>
        <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-foreground/55 px-2.5 py-1 text-xs font-medium text-background backdrop-blur">
          {items.length} {items.length === 1 ? "propiedad" : "propiedades"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-primary">{OFFER_OPERATION_LABELS[offer.operation]}</p>
          <h3 className="font-display text-xl leading-tight text-balance line-clamp-2" title={offer.title}>
            {offer.title}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <UserRound className="size-3.5 shrink-0" />
            <span className="truncate">{client || "Sin cliente asignado"}</span>
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <p className="flex h-8 items-baseline gap-1.5 tabular-nums">
            {offer.total ? (
              <>
                <span className="text-sm font-medium text-muted-foreground">{offer.currency}</span>
                <span className="text-2xl leading-none font-semibold tracking-tight">{offer.total.toLocaleString("es-AR")}</span>
              </>
            ) : (
              <span className="text-lg leading-none font-medium text-muted-foreground">Sin total</span>
            )}
          </p>

          {offer.expiresAt && (
            <p className={cn("flex items-center gap-1.5 text-sm", expired ? "text-destructive" : "text-muted-foreground")}>
              <CalendarClock className="size-4" />
              {expired ? "Venció" : "Vence"} el {format(new Date(offer.expiresAt), "d 'de' MMMM", { locale: es })}
            </p>
          )}

          <div className="mt-1 flex h-6 items-center gap-3 text-xs text-muted-foreground">
            <OfferStatusPill status={offer.status} />
            <span className="ml-auto inline-flex shrink-0 items-center gap-1" title={`Actualizada ${updated}`}>
              <Clock className="size-3" />
              {updated}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function OfferCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5">
      <div className="aspect-[16/10] bg-secondary" />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-4/5 rounded-full bg-muted" />
          <div className="h-4 w-1/2 rounded-full bg-muted" />
        </div>
        <div className="h-8 w-2/5 rounded-full bg-muted" />
        <div className="h-4 w-full rounded-full bg-muted" />
      </div>
    </div>
  );
}
