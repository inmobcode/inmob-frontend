"use client";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { PhotoPlaceholder } from "@/components/public/property-card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PropertyPhoto } from "@/lib/api/properties";
import { cn } from "@/lib/utils";

/**
 * The listing's photos: one large and up to four small on wide screens, and a
 * full-screen viewer with arrows and keyboard support for the rest.
 */
export function PropertyGallery({
  photos,
  title,
}: {
  photos: PropertyPhoto[];
  title: string;
}) {
  const sorted = [...photos].sort(
    (a, b) => Number(b.isCover) - Number(a.isCover) || a.position - b.position,
  );
  const [open, setOpen] = useState<number | null>(null);

  if (sorted.length === 0) {
    return (
      <div className="h-48 overflow-hidden rounded-2xl md:h-64">
        <PhotoPlaceholder label="Esta propiedad todavía no tiene fotos" />
      </div>
    );
  }

  const tiles = sorted.slice(0, 5);
  // The mosaic needs a full set of five; with fewer, one large photo opens the viewer.
  const mosaic = tiles.length >= 5;

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          mosaic
            ? "grid aspect-[16/10] grid-cols-4 grid-rows-2 gap-2 md:aspect-[21/9]"
            : "aspect-[16/9] md:aspect-[21/9]",
        )}
      >
        {(mosaic ? tiles : tiles.slice(0, 1)).map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setOpen(index)}
            aria-label={`Ver foto ${index + 1} de ${sorted.length}`}
            className={cn(
              "group relative overflow-hidden bg-site-surface outline-none focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-inset",
              mosaic && index === 0 && "col-span-4 row-span-2 md:col-span-2",
              mosaic && index > 0 && "hidden md:block",
              !mosaic && "size-full",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt=""
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </button>
        ))}
        {sorted.length > 1 && (
          <button
            type="button"
            onClick={() => setOpen(0)}
            className="absolute right-4 bottom-4 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-3.5 text-sm font-medium text-site-ink shadow-md outline-none hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-site-accent"
          >
            <Images className="size-4" aria-hidden />
            Ver las {sorted.length} fotos
          </button>
        )}
      </div>

      <Lightbox
        photos={sorted}
        title={title}
        index={open}
        onIndexChange={setOpen}
      />
    </>
  );
}

function Lightbox({
  photos,
  title,
  index,
  onIndexChange,
}: {
  photos: PropertyPhoto[];
  title: string;
  index: number | null;
  onIndexChange: (index: number | null) => void;
}) {
  const count = photos.length;
  const step = useCallback(
    (delta: number) =>
      onIndexChange(index === null ? null : (index + delta + count) % count),
    [count, index, onIndexChange],
  );

  useEffect(() => {
    if (index === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, step]);

  const photo = index === null ? null : photos[index];
  const arrow =
    "absolute top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white";

  return (
    <Dialog
      open={index !== null}
      onOpenChange={(next) => !next && onIndexChange(null)}
    >
      <DialogContent
        showCloseButton={false}
        className="flex h-[100svh] max-w-none! w-screen flex-col gap-0 rounded-none bg-black/95 p-0 text-white ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">Fotos de {title}</DialogTitle>
        <div className="flex h-14 items-center justify-between px-4 text-sm text-white/70">
          <span className="tabular-nums" aria-live="polite">
            {index !== null && `${index + 1} / ${count}`}
          </span>
          <DialogClose
            className="flex size-10 items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </DialogClose>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.id}
              src={photo.url}
              alt=""
              className="max-h-full max-w-full rounded-md object-contain"
            />
          )}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Foto anterior"
                className={cn(arrow, "left-4")}
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Foto siguiente"
                className={cn(arrow, "right-4")}
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
