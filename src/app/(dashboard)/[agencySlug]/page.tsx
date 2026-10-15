import { redirect } from "next/navigation";

export default async function AgencyDashboardIndex({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;
  redirect(`/${agencySlug}/properties`);
}
