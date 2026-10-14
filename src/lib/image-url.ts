// Photos are uploaded at up to 2048px (see image-compression.ts), which is
// 400–800 KB each: right for a gallery, wasteful for a card. Supabase Storage
// can serve a resized copy of any public object through its render endpoint,
// so cards ask for one at roughly twice their on-screen width (sharp on
// retina) instead of the original.

const OBJECT_PATH = "/storage/v1/object/public/";
const RENDER_PATH = "/storage/v1/render/image/public/";

/** Widths in CSS-pixel-doubled terms: thumbnails up to ~200px, cards up to ~400px, tiles up to ~600px. */
export const IMAGE_WIDTH = { thumb: 400, card: 800, tile: 1200 } as const;

/**
 * The same image at `width` pixels wide (height follows the aspect ratio).
 * Anything that isn't a public Supabase Storage URL (Unsplash, blob: previews
 * of a file not uploaded yet, YouTube thumbnails) comes back untouched.
 */
export function sizedImage(url: string, width: number): string;
export function sizedImage(url: string | null | undefined, width: number): string | undefined;
export function sizedImage(url: string | null | undefined, width: number) {
  if (!url) return url ?? undefined;
  if (!url.includes(OBJECT_PATH) || url.includes("?")) return url;
  return `${url.replace(OBJECT_PATH, RENDER_PATH)}?width=${width}&quality=75`;
}
