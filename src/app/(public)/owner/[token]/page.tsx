import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OwnerPortalView } from "@/components/owners/owner-portal-view";
import { ApiError } from "@/lib/api/client";
import { getOwnerPortal } from "@/lib/api/owner-portal";

export const metadata: Metadata = {
  title: "Tus propiedades",
  // A private link: keep it out of search engines.
  robots: { index: false, follow: false },
};

export default async function OwnerPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let portal;
  try {
    portal = await getOwnerPortal(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return <OwnerPortalView portal={portal} />;
}
