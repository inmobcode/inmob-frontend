"use client";

import { Archive, Check, ExternalLink, EyeOff, Globe, Minus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAgencySitePath } from "@/lib/agency-site";
import type { Property } from "@/lib/api/properties";
import { cn } from "@/lib/utils";

/** What the list can do with one or many properties. */
export interface PropertyActions {
  publish: (ids: string[]) => void;
  unpublish: (ids: string[]) => void;
  archive: (ids: string[]) => void;
  /** Asks for confirmation first; the page owns the dialog. */
  requestDelete: (ids: string[]) => void;
}

/** The property's page on the agency's public site (only published ones have one), in the site's language. */
function useOpenOnSite() {
  const sitePath = useAgencySitePath();
  return (property: Property, agencySlug: string) =>
    window.open(sitePath(`/page/${property.agencySlug ?? agencySlug}/properties/${property.slug}`), "_blank", "noopener");
}

/**
 * Opens the published property on the agency's site in a new tab, straight
 * from the list. A button rather than a link: it sits inside cards that are
 * links themselves, whose controls zone cancels link navigation.
 */
export function ViewOnSiteButton({ property, className }: { property: Property; className?: string }) {
  const t = useTranslations("properties.menu");
  const openOnSite = useOpenOnSite();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  if (property.status !== "PUBLISHED") return null;
  return (
    <button
      type="button"
      aria-label={t("viewOnSiteOf", { title: property.title })}
      title={t("viewOnSite")}
      onClick={() => openOnSite(property, agencySlug)}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-colors outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <ExternalLink className="size-4" />
    </button>
  );
}

/**
 * Wraps controls that live inside a card that is itself a link, so clicking
 * them (or anything portaled from them, like a menu) does not navigate.
 */
export function ControlsZone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function SelectToggle({
  checked,
  indeterminate = false,
  onToggle,
  label,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        checked || indeterminate
          ? "border-primary bg-primary text-primary-foreground"
          : "border-foreground/25 bg-card/90 text-transparent backdrop-blur hover:border-primary",
        className,
      )}
    >
      {indeterminate ? <Minus className="size-3.5" strokeWidth={3} /> : <Check className="size-3.5" strokeWidth={3} />}
    </button>
  );
}

export function PropertyMenu({
  property,
  actions,
  className,
}: {
  property: Property;
  actions: PropertyActions;
  className?: string;
}) {
  const t = useTranslations("properties.menu");
  const openOnSite = useOpenOnSite();
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("actionsOf", { title: property.title })}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-colors outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-card",
            className,
          )}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5">
        <DropdownMenuItem className="rounded-xl py-2" onSelect={() => router.push(`/${agencySlug}/properties/${property.id}`)}>
          <Pencil />
          {t("edit")}
        </DropdownMenuItem>
        {property.status === "PUBLISHED" && (
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => openOnSite(property, agencySlug)}>
            <ExternalLink />
            {t("viewOnSite")}
          </DropdownMenuItem>
        )}
        {property.status !== "PUBLISHED" && (
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => actions.publish([property.id])}>
            <Globe />
            {property.status === "ARCHIVED" ? t("republish") : t("publish")}
          </DropdownMenuItem>
        )}
        {property.status === "PUBLISHED" && (
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => actions.unpublish([property.id])}>
            <EyeOff />
            {t("unpublish")}
          </DropdownMenuItem>
        )}
        {property.status !== "ARCHIVED" && (
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => actions.archive([property.id])}>
            <Archive />
            {t("archive")}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="rounded-xl py-2"
          onSelect={() => actions.requestDelete([property.id])}
        >
          <Trash2 />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
