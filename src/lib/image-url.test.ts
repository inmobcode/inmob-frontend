import { afterEach, describe, expect, it, vi } from "vitest";

import { sizedImage } from "./image-url";

describe("sizedImage", () => {
  const object = "https://x.supabase.co/storage/v1/object/public/photos/a.jpg";

  afterEach(() => vi.unstubAllEnvs());

  it("asks Supabase for a resized copy when image transformations are enabled", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_TRANSFORMS", "true");
    expect(sizedImage(object, 400)).toBe("https://x.supabase.co/storage/v1/render/image/public/photos/a.jpg?width=400&quality=75");
  });
  it("serves the original when they are not enabled (the default)", () => {
    expect(sizedImage(object, 400)).toBe(object);
  });
  it("leaves other urls and empty values alone", () => {
    vi.stubEnv("NEXT_PUBLIC_IMAGE_TRANSFORMS", "true");
    expect(sizedImage("https://images.unsplash.com/photo-1", 400)).toBe("https://images.unsplash.com/photo-1");
    expect(sizedImage(`${object}?v=1`, 400)).toBe(`${object}?v=1`);
    expect(sizedImage(null, 400)).toBeUndefined();
  });
});
