import { notFound } from "next/navigation";
import { cache } from "react";

import { getPublicAgency } from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import { getPublicProperty, listPublicProperties } from "@/lib/api/properties";

// Cached per request: the layout, the page and generateMetadata all ask for the
// same agency, and it should reach the API once.

export const loadAgency = cache(async (agencySlug: string) => {
  try {
    return await getPublicAgency(agencySlug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
});

export const loadProperty = cache(
  async (agencySlug: string, propertySlug: string) => {
    try {
      return await getPublicProperty(agencySlug, propertySlug);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) notFound();
      throw err;
    }
  },
);

export const loadProperties = cache((agencySlug: string) =>
  listPublicProperties(agencySlug),
);
