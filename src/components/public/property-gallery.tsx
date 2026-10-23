"use client";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { PhotoPlaceholder } from "@/components/public/property-card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PhotoSection, PropertyPhoto } from "@/lib/api/properties";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

/**
 * What one photo shows: "Dormitorio 2", "Pileta". `singular` names a built-in
 * section in the singular ("site.gallery.singular"); a custom one keeps its name.
 */
function usePhotoLabel() {
  const t = useTranslations("site.gallery.singular");
  const labels = useLabels();
  return (photo: PropertyPhoto) => {
    const base = t.has(photo.section as never) ? t(photo.section as never) : labels.photoSection(photo.section);
    const detail = photo.sectionDetail?.trim();
    if (!detail) return base;
    // A number numbers the room ("Dormitorio 2"); any other text names it ("Suite principal").
    return /^\d+$/.test(detail) ? `${base} ${detail}` : detail;
  };
}

/**
 * Cover first, then the photos grouped by section in the order the sections
 * first appear, so the viewer walks the house one room at a time.
 */
function orderPhotos(photos: PropertyPhoto[]) {
  const sorted = [...photos].sort(
    (a, b) => Number(b.isCover) - Number(a.isCover) || a.position - b.position,
  );
  const sections = [...new Set(sorted.slice(1).map((photo) => photo.section))];
  return [
    ...sorted.slice(0, 1),
    ...sections.flatMap((section) =>
      sorted.slice(1).filter((photo) => photo.section === section),
    ),
  ];
}

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
  const t = useTranslations("site.gallery");
  const photoLabel = usePhotoLabel();
  const sorted = orderPhotos(photos);
  const [open, setOpen] = useState<number | null>(null);

  if (sorted.length === 0) {
    return (
      <div className="h-48 overflow-hidden rounded-2xl md:h-64">
        <PhotoPlaceholder label={t("noPhotos")} />
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
            aria-label={
              photo.section === "GENERAL"
                ? t("seePhoto", { index: index + 1, total: sorted.length })
                : t("seePhotoOf", { index: index + 1, total: sorted.length, label: photoLabel(photo) })
            }
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
            {t("seeAll", { count: sorted.length })}
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
  const t = useTranslations("site.gallery");
  const labels = useLabels();
  const photoLabel = usePhotoLabel();
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
  // One tab per section, pointing at its first photo. The cover counts as
  // "General" only when it really is a general shot.
  const tabs = photos.reduce<{ section: PhotoSection; first: number; count: number }[]>(
    (acc, item, i) => {
      const last = acc[acc.length - 1];
      if (last?.section === item.section) last.count += 1;
      else acc.push({ section: item.section, first: i, count: 1 });
      return acc;
    },
    [],
  );
  const activeTab = index === null ? -1 : tabs.findLastIndex((tab) => tab.first <= index);
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
        <DialogTitle className="sr-only">{t("dialogTitle", { title })}</DialogTitle>
        <div className="flex h-14 items-center justify-between gap-4 px-4 text-sm text-white/70">
          <p aria-live="polite" className="flex min-w-0 items-baseline gap-2.5">
            {photo && (
              <>
                <span className="truncate font-medium text-white">{photoLabel(photo)}</span>
                <span className="shrink-0 tabular-nums">
                  {index! + 1} / {count}
                </span>
              </>
            )}
          </p>
          <DialogClose
            className="flex size-10 items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            aria-label={t("close")}
          >
            <X className="size-5" />
          </DialogClose>
        </div>
        {tabs.length > 1 && (
          <nav
            aria-label={t("parts")}
            className="flex shrink-0 gap-1.5 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:justify-center"
          >
            {tabs.map((tab, i) => (
              <button
                key={`${tab.section}-${tab.first}`}
                type="button"
                onClick={() => onIndexChange(tab.first)}
                aria-current={i === activeTab ? "true" : undefined}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white",
                  i === activeTab
                    ? "bg-white font-medium text-black"
                    : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white",
                )}
              >
                {labels.photoSection(tab.section)}
                {tab.count > 1 && (
                  <span className={cn("tabular-nums", i === activeTab ? "text-black/50" : "text-white/45")}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        )}
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.id}
              src={photo.url}
              alt={`${title}: ${photoLabel(photo)}`}
              className="max-h-full max-w-full rounded-md object-contain"
            />
          )}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t("previous")}
                className={cn(arrow, "left-4")}
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t("next")}
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
