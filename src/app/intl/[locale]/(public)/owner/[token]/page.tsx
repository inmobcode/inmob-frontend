import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { cache } from "react";

import { OwnerPortalView } from "@/components/owners/owner-portal-view";
import { ApiError } from "@/lib/api/client";
import { getOwnerPortal } from "@/lib/api/owner-portal";

type Params = Promise<{ token: string }>;

const loadPortal = cache(async (token: string) => {
  try {
    return await getOwnerPortal(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const t = await getTranslations("site.meta");
  const { token } = await params;
  const portal = await loadPortal(token);
  return {
    // Absolute: this is the agency's own branded link to its owner, not a Tivvu surface.
    title: { absolute: t("ownerTitle", { agency: portal.agencyName }) },
    // A private link: keep it out of search engines.
    robots: { index: false, follow: false },
  };
}

export default async function OwnerPortalPage({ params }: { params: Params }) {
  const { token } = await params;
  const portal = await loadPortal(token);
  return <OwnerPortalView portal={portal} />;
}
