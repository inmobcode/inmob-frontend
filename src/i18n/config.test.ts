import { describe, expect, it } from "vitest";

import { countryOf, detectLocale } from "./config";

const req = (headers: Record<string, string>) => new Headers(headers);

describe("detectLocale", () => {
  it("follows the country from the IP", () => {
    expect(detectLocale(req({ "x-vercel-ip-country": "BR" }))).toBe("pt");
    expect(detectLocale(req({ "cf-ipcountry": "de" }))).toBe("de");
    expect(detectLocale(req({ "x-vercel-ip-country": "HR" }))).toBe("hr");
  });

  it("puts the country before the browser language", () => {
    expect(detectLocale(req({ "x-vercel-ip-country": "FR", "accept-language": "es-AR,es;q=0.9" }))).toBe("fr");
  });

  it("asks the browser where the country has no single language", () => {
    expect(detectLocale(req({ "x-vercel-ip-country": "CH", "accept-language": "de-CH,de;q=0.9" }))).toBe("de");
  });

  it("falls back to English for a known country with nothing of ours", () => {
    expect(detectLocale(req({ "x-vercel-ip-country": "JP", "accept-language": "ja" }))).toBe("en");
  });

  it("falls back to Spanish with no country and no matching browser", () => {
    expect(detectLocale(req({}))).toBe("es");
    expect(detectLocale(req({ "accept-language": "ja" }))).toBe("es");
    expect(detectLocale(req({ "accept-language": "en-US,en;q=0.9" }))).toBe("en");
  });

  it("ignores placeholder countries", () => {
    expect(countryOf(req({ "cf-ipcountry": "XX" }))).toBeNull();
    expect(countryOf(req({ "cf-ipcountry": "T1" }))).toBeNull();
  });
});
