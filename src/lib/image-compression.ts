// Client-side WebP compression, same approach as kennedys-loggia's utils/image.ts:
// decode via createImageBitmap (falling back to <img>), draw to a canvas at a
// capped size, re-encode as WebP. No WASM, no server round-trip.

export interface CompressOptions {
  /** Longest side is capped to this many px, preserving aspect ratio. Ignored if targetWidth/targetHeight are set. */
  maxSide?: number;
  /** 0–1. */
  quality?: number;
  /** Force an exact size (used for real-estate listings, like Kennedys' 2000x1500). */
  targetWidth?: number;
  targetHeight?: number;
}

const DEFAULT_MAX_SIDE = 2048;
const DEFAULT_QUALITY = 0.86;

function isHeicLike(file: File): boolean {
  return /\.(heic|heif)$/i.test(file.name) || file.type === "image/heic" || file.type === "image/heif";
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve(img);
      URL.revokeObjectURL(url);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

async function loadDecodedImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // Some formats/browsers can't decode via createImageBitmap — fall through.
    }
  }
  return loadImageElement(file);
}

function computeDimensions(
  sourceWidth: number,
  sourceHeight: number,
  options: CompressOptions,
): { width: number; height: number } {
  if (options.targetWidth && options.targetHeight) {
    return { width: options.targetWidth, height: options.targetHeight };
  }
  const maxSide = options.maxSide ?? DEFAULT_MAX_SIDE;
  const longest = Math.max(sourceWidth, sourceHeight);
  if (longest <= maxSide) return { width: sourceWidth, height: sourceHeight };
  const scale = maxSide / longest;
  return { width: Math.round(sourceWidth * scale), height: Math.round(sourceHeight * scale) };
}

function canvasToWebpBlob(
  canvas: OffscreenCanvas | HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  if (typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: "image/webp", quality });
  }
  return new Promise((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("canvas.toBlob returned null"))),
      "image/webp",
      quality,
    );
  });
}

export async function compressToWebp(file: File, options: CompressOptions = {}): Promise<File> {
  const quality = options.quality ?? DEFAULT_QUALITY;
  const decoded = await loadDecodedImage(file);
  const sourceWidth = "width" in decoded ? decoded.width : 0;
  const sourceHeight = "height" in decoded ? decoded.height : 0;
  const { width, height } = computeDimensions(sourceWidth, sourceHeight, options);

  const canvas: OffscreenCanvas | HTMLCanvasElement =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(width, height)
      : document.createElement("canvas");
  if (!(typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas)) {
    (canvas as HTMLCanvasElement).width = width;
    (canvas as HTMLCanvasElement).height = height;
  }

  const ctx = canvas.getContext("2d") as
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D
    | null;
  if (!ctx) throw new Error("Could not get a 2D canvas context");
  ctx.drawImage(decoded, 0, 0, width, height);

  const blob = await canvasToWebpBlob(canvas, quality);
  const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], newName, { type: "image/webp" });
}

/** Compresses a batch of images to WebP, running a few in parallel. HEIC/HEIF
 * files are passed through untouched (browsers can't decode them without a
 * WASM library we don't ship). A file that fails to compress falls back to
 * the original rather than dropping the upload. */
export async function compressManySmart(
  files: File[],
  options: CompressOptions = {},
): Promise<File[]> {
  const BATCH_SIZE = 2;
  const results: File[] = new Array(files.length);

  for (let start = 0; start < files.length; start += BATCH_SIZE) {
    const batch = files.slice(start, start + BATCH_SIZE);
    const compressed = await Promise.all(
      batch.map(async (file) => {
        if (isHeicLike(file)) return file;
        try {
          return await compressToWebp(file, options);
        } catch {
          return file;
        }
      }),
    );
    compressed.forEach((file, index) => {
      results[start + index] = file;
    });
  }

  return results;
}
