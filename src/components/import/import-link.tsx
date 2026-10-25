"use client";

import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useSessionUser } from "@/lib/auth/session";
import { useBilling } from "@/lib/use-billing";

/** Entry to the property importer. Bulk import is OWNER/ADMIN only and not part of the free trial (the API enforces both). */
export function ImportLink() {
  const t = useTranslations("importer");
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const user = useSessionUser();
  const { data: billing } = useBilling();
  // Hidden until the plan is known, and for good during the free trial.
  if (!user?.role || user.role === "AGENT" || !billing?.features.import) return null;
  return (
    <Button asChild variant="outline" className="h-10 gap-2 rounded-full px-4">
      <Link href={`/${agencySlug}/properties/import`}>
        <Upload />
        {t("link")}
      </Link>
    </Button>
  );
}
