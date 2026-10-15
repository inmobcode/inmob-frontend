import { notFound, redirect } from "next/navigation";

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
  redirect(`/${agencySlug}/properties`);
}
