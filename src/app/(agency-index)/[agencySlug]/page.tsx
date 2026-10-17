import { notFound, redirect } from "next/navigation";

import { getPublicAgency } from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";

// Agency slugs are lowercase words and dashes. Anything else (an encoded "/" or ".."
// that would turn this redirect into one to another site) is not an agency.
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default async function AgencyDashboardIndex({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;
  if (!SLUG.test(agencySlug)) notFound();

  // Any one-word address lands here as if it were an agency, and the proxy then
  // swaps a wrong slug for the signed-in one: a typo like /loquesea would end up
  // in the dashboard. So confirm the agency exists first. If the API can't be
  // reached we can't tell, and redirecting is the old behavior.
  try {
    await getPublicAgency(agencySlug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
  }

  redirect(`/${agencySlug}/properties`);
}
