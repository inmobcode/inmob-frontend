import { describe, expect, it } from "vitest";

import type { Property } from "@/lib/api/properties";

import { DEFAULT_FILTERS, applyFilters, countActiveFilters } from "./property-filters";

const property = (over: Partial<Property>) =>
  ({ title: "Casa", status: "PUBLISHED", listingType: "SALE", price: 100, bedrooms: 2, ...over }) as Property;

const list = [
  property({ title: "Casa Centro", price: 100, bedrooms: 2 }),
  property({ title: "Depto Mar", price: 300, bedrooms: 1, listingType: "RENT" }),
  property({ title: "Quinta", price: null, bedrooms: 5 }),
];

describe("applyFilters", () => {
  it("returns everything by default", () => {
    expect(applyFilters(list, DEFAULT_FILTERS)).toHaveLength(3);
  });
  it("filters by text, type and price range", () => {
    expect(applyFilters(list, { ...DEFAULT_FILTERS, search: "mar" })).toHaveLength(1);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, type: "RENT" })).toHaveLength(1);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, minPrice: "150" }).map((p) => p.title)).toEqual(["Depto Mar"]);
  });
  it("accepts a decimal comma and ignores bad numbers", () => {
    expect(applyFilters(list, { ...DEFAULT_FILTERS, maxPrice: "100,5" }).map((p) => p.title)).toContain("Casa Centro");
    expect(applyFilters(list, { ...DEFAULT_FILTERS, minPrice: "abc" })).toHaveLength(3);
  });
});

describe("countActiveFilters", () => {
  it("counts price range once and skips the search", () => {
    expect(countActiveFilters({ ...DEFAULT_FILTERS, search: "x", minPrice: "1", maxPrice: "2" })).toBe(1);
  });
});
