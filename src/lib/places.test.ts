import { describe, expect, it } from "vitest";

import { placeLabel, placeMatches, samePlace, uniquePlaces } from "./places";

describe("places", () => {
  it("compares places without caring about case, accents or spaces", () => {
    expect(samePlace("Islas Baleares", "  ISLAS   baleares ")).toBe(true);
    expect(samePlace("Cícladas", "Ciclada")).toBe(false);
    expect(samePlace("Cícladas", "cicladas")).toBe(true);
    expect(samePlace(null, "x")).toBe(false);
  });

  it("matches any of area, region or country", () => {
    const place = { area: "Mykonos", region: "Cícladas", country: "Grecia" };
    expect(placeMatches(place, "cicladas")).toBe(true);
    expect(placeMatches(place, "Italia")).toBe(false);
  });

  it("capitalizes shouting or lowercase names but leaves written ones alone", () => {
    expect(placeLabel("ISLAS BALEARES")).toBe("Islas Baleares");
    expect(placeLabel("islas baleares")).toBe("Islas Baleares");
    expect(placeLabel("río de la plata")).toBe("Río de la Plata");
    expect(placeLabel("São Paulo")).toBe("São Paulo");
    expect(placeLabel("Río de la Plata")).toBe("Río de la Plata");
  });

  it("lists each place once, sorted", () => {
    expect(uniquePlaces(["islas baleares", "Islas Baleares", "", null, "Buenos Aires", "ISLAS BALEARES"])).toEqual([
      "Buenos Aires",
      "Islas Baleares",
    ]);
  });
});
