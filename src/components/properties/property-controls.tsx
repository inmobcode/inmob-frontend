"use client";

import { Archive, Check, EyeOff, Globe, Minus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
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
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Acciones de ${property.title}`}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-colors outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:bg-card",
            className,
          )}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5">
        <DropdownMenuItem className="rounded-xl py-2" onSelect={() => router.push(`/properties/${property.id}`)}>
          <Pencil />
          Editar
        </DropdownMenuItem>
        {property.status !== "PUBLISHED" && (
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => actions.publish([property.id])}>
            <Globe />
            {property.status === "ARCHIVED" ? "Volver a publicar" : "Publicar"}
          </DropdownMenuItem>
        )}
        {property.status === "PUBLISHED" && (
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => actions.unpublish([property.id])}>
            <EyeOff />
            Despublicar
          </DropdownMenuItem>
        )}
        {property.status !== "ARCHIVED" && (
          <DropdownMenuItem className="rounded-xl py-2" onSelect={() => actions.archive([property.id])}>
            <Archive />
            Archivar
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="rounded-xl py-2"
          onSelect={() => actions.requestDelete([property.id])}
        >
          <Trash2 />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
