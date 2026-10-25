"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useBilling } from "@/lib/use-billing";

/** The importer is not part of the free trial: whoever types its address gets the property list instead. */
export function ImportGate({ children }: { children: React.ReactNode }) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const router = useRouter();
  const { data: billing } = useBilling();
  const blocked = billing ? !billing.features.import : false;

  useEffect(() => {
    if (blocked) router.replace(`/${agencySlug}/properties`);
  }, [blocked, router, agencySlug]);

  if (!billing || blocked) return null;
  return children;
}
