import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AgencyPortal } from "@/components/public/agency-portal";
import { ApiError } from "@/lib/api/client";
import { getPublicAgency } from "@/lib/api/agency";

export default async function AgencyPortalPage({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;

  let agency;
  try {
    agency = await getPublicAgency(agencySlug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <Suspense fallback={null}>
      <AgencyPortal agencySlug={agencySlug} agency={agency} />
    </Suspense>
  );
}
