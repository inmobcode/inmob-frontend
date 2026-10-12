"use client";

import { Archive, Globe, Trash2, X } from "lucide-react";
import { useRef } from "react";

import type { PropertyActions } from "@/components/properties/property-controls";
import { Button } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media } from "@/lib/motion";

/** Floats at the bottom while something is selected. */
export function BulkBar({
  ids,
  total,
  actions,
  onSelectAll,
  onClear,
}: {
  ids: string[];
  total: number;
  actions: PropertyActions;
  onSelectAll: () => void;
  onClear: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from(ref.current, { y: distance.lg, opacity: 0, duration: duration.base, ease: ease.out });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const allSelected = ids.length === total;

  return (
    <div className="pointer-events-none sticky bottom-6 z-30 flex justify-center">
      <div
        ref={ref}
        role="toolbar"
        aria-label="Acciones sobre las propiedades seleccionadas"
        className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-full bg-primary p-2 pl-5 text-primary-foreground shadow-[0_20px_50px_-12px_oklch(0.2_0.04_160/0.55)]"
      >
        <span className="mr-2 text-sm font-medium tabular-nums">
          {ids.length} {ids.length === 1 ? "seleccionada" : "seleccionadas"}
        </span>
        {!allSelected && (
          <Button
            type="button"
            variant="ghost"
            className="h-9 px-3 text-primary-foreground hover:bg-sidebar/20 hover:text-sidebar focus-visible:bg-sidebar/20 focus-visible:text-sidebar"
            onClick={onSelectAll}
          >
            Seleccionar las {total}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-2 px-3 text-primary-foreground hover:bg-sidebar/20 hover:text-sidebar focus-visible:bg-sidebar/20 focus-visible:text-sidebar"
          onClick={() => actions.publish(ids)}
        >
          <Globe />
          Publicar
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-2 px-3 text-primary-foreground hover:bg-sidebar/20 hover:text-sidebar focus-visible:bg-sidebar/20 focus-visible:text-sidebar"
          onClick={() => actions.archive(ids)}
        >
          <Archive />
          Archivar
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-2 px-3 text-red-300 hover:bg-red-400/20 hover:text-red-200"
          onClick={() => actions.requestDelete(ids)}
        >
          <Trash2 />
          Eliminar
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Quitar la selección"
          className="size-9 text-primary-foreground hover:bg-sidebar/20 hover:text-sidebar focus-visible:bg-sidebar/20 focus-visible:text-sidebar"
          onClick={onClear}
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
