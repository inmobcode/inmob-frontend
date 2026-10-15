import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { HomeView } from "@/components/dashboard/home-view";
import { agencySlugFromToken } from "@/lib/auth/token-claims";

export const metadata: Metadata = { title: "Inicio" };

export default async function AgencyDashboardIndex({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;

  // The proxy only guards `/<slug>/<section>`; the bare agency root is checked here.
  const token = (await cookies()).get("access_token")?.value;
  if (!token) redirect(`/login?next=${encodeURIComponent(`/${agencySlug}`)}`);
  const activeSlug = agencySlugFromToken(token);
  if (activeSlug && activeSlug !== agencySlug) redirect(`/${activeSlug}`);

  return <HomeView />;
}
