import { describe, expect, it } from "vitest";

import { sizedImage } from "./image-url";

describe("sizedImage", () => {
  const object = "https://x.supabase.co/storage/v1/object/public/photos/a.jpg";

  it("asks Supabase for a resized copy", () => {
    expect(sizedImage(object, 400)).toBe("https://x.supabase.co/storage/v1/render/image/public/photos/a.jpg?width=400&quality=75");
  });
  it("leaves other urls and empty values alone", () => {
    expect(sizedImage("https://images.unsplash.com/photo-1", 400)).toBe("https://images.unsplash.com/photo-1");
    expect(sizedImage(`${object}?v=1`, 400)).toBe(`${object}?v=1`);
    expect(sizedImage(null, 400)).toBeUndefined();
  });
});
