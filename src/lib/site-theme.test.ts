import { describe, expect, it } from "vitest";

import { instagramLink, resolveSite, whatsappLink } from "./site-theme";

describe("resolveSite", () => {
  it("falls back to defaults", () => {
    const site = resolveSite(null);
    expect(site.template).toBe("portada");
    expect(site.heroTitle).toBeNull();
    expect(site.sections).toEqual([]);
  });
  it("uses the desktop template on mobile unless told otherwise", () => {
    expect(resolveSite({ template: "editorial" }).templateMobile).toBe("editorial");
  });
  it("treats blank text as missing and hides invisible sections", () => {
    const site = resolveSite({
      heroTitle: "   ",
      sections: [
        { id: "a", type: "text", visible: false },
        { id: "b", type: "text" },
      ],
    } as never);
    expect(site.heroTitle).toBeNull();
    expect(site.sections.map((s) => s.id)).toEqual(["b"]);
  });
});

describe("links", () => {
  it("builds whatsapp links from messy numbers", () => {
    expect(whatsappLink("+54 9 11 1234-5678", "Hola mundo")).toBe("https://wa.me/5491112345678?text=Hola%20mundo");
  });
  it("accepts handles and full urls for instagram", () => {
    expect(instagramLink("@tivvu")).toBe("https://instagram.com/tivvu");
    expect(instagramLink("https://instagram.com/x")).toBe("https://instagram.com/x");
  });
});
