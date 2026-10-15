import { describe, expect, it } from "vitest";

import { agencySlugFromToken } from "./token-claims";

const jwt = (payload: object) => `h.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.s`;

describe("agencySlugFromToken", () => {
  it("reads the agency_slug claim", () => {
    expect(agencySlugFromToken(jwt({ agency_slug: "acme" }))).toBe("acme");
  });
  it("returns null for missing claims or garbage", () => {
    expect(agencySlugFromToken(jwt({}))).toBeNull();
    expect(agencySlugFromToken("nope")).toBeNull();
  });
});
