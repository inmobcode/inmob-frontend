"use client";

import { Check, ImagePlus, LoaderCircle, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { uploadSiteImage } from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import type { Property } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { compressToWebp } from "@/lib/image-compression";
import { cn } from "@/lib/utils";

const SLOTS = 4;

/** Every photo of the agency's listings, covers first, without repeats. */
function listingPhotos(properties: Property[]) {
  const urls: { url: string; title: string }[] = [];
  const seen = new Set<string>();
  for (const property of properties) {
    const photos = [...property.photos].sort(
      (a, b) => Number(b.isCover) - Number(a.isCover) || a.position - b.position,
    );
    for (const photo of photos) {
      if (seen.has(photo.url)) continue;
      seen.add(photo.url);
      urls.push({ url: photo.url, title: property.title });
    }
  }
  return urls;
}

/**
 * The four photos of the `mosaico` collage, laid out like the collage itself
 * (the first one large). Each slot takes a photo from the listings or an
 * uploaded image.
 */
export function MosaicPicker({
  value: picked,
  onChange,
  properties,
}: {
  value: string[] | undefined;
  onChange: (urls: string[]) => void;
  properties: Property[];
}) {
  const [slot, setSlot] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const photos = listingPhotos(properties);
  // Sites saved before the collage could be picked have no list yet.
  const value = picked ?? [];

  function put(index: number, url: string) {
    const next = [...value];
    // A slot past the filled ones goes right after them, so there are no gaps.
    next[Math.min(index, next.length)] = url;
    onChange(next.slice(0, SLOTS));
    setSlot(null);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  async function upload(file: File) {
    const token = getAccessToken();
    if (!token || slot == null) return;
    setUploading(true);
    try {
      const compressed = await compressToWebp(file, { maxSide: 2000 });
      const { url } = await uploadSiteImage(token, compressed);
      put(slot, url);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="grid aspect-[16/10] grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-2">
        {Array.from({ length: SLOTS }, (_, index) => {
          const url = value[index];
          return (
            <div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-lg bg-foreground/[0.05]",
                index === 0 && "row-span-2",
                index === 3 && "col-span-2",
              )}
            >
              <button
                type="button"
                onClick={() => setSlot(index)}
                aria-label={url ? `Cambiar la foto ${index + 1}` : `Elegir la foto ${index + 1}`}
                className="flex size-full items-center justify-center text-muted-foreground outline-none hover:bg-foreground/[0.04] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
              >
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="size-full object-cover" />
                ) : (
                  <Plus className="size-5" />
                )}
              </button>
              {url && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Quitar la foto ${index + 1}`}
                  className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={slot != null} onOpenChange={(open) => !open && setSlot(null)}>
        <DialogContent className="max-h-[85svh] gap-5 overflow-y-auto rounded-3xl sm:max-w-2xl" showCloseButton>
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="font-display text-2xl">
              Foto {slot != null ? slot + 1 : ""} del mosaico
            </DialogTitle>
            <DialogDescription>Elegí una foto de tus propiedades o subí una imagen.</DialogDescription>
          </div>

          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-full bg-foreground/[0.06] px-4 text-sm font-medium outline-none hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
          >
            {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {uploading ? "Subiendo…" : "Subir una imagen"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload(file);
              event.target.value = "";
            }}
          />

          {photos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tus propiedades todavía no tienen fotos.</p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {photos.map((photo) => {
                const used = value.includes(photo.url);
                return (
                  <li key={photo.url}>
                    <button
                      type="button"
                      onClick={() => slot != null && put(slot, photo.url)}
                      title={photo.title}
                      aria-label={`${photo.title}${used ? " (ya está en el mosaico)" : ""}`}
                      className={cn(
                        "relative block aspect-[4/3] w-full overflow-hidden rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        used && "ring-2 ring-primary",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt="" loading="lazy" className="size-full object-cover" />
                      {used && (
                        <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3" />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
