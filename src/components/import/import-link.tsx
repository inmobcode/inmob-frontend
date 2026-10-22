"use client";

import { Upload } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useSessionUser } from "@/lib/auth/session";

/** Entry to the property importer. Bulk import is OWNER/ADMIN only (the API enforces it too). */
export function ImportLink() {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const user = useSessionUser();
  if (!user?.role || user.role === "AGENT") return null;
  return (
    <Button asChild variant="outline" className="h-10 gap-2 rounded-full px-4">
      <Link href={`/${agencySlug}/properties/import`}>
        <Upload />
        Importar
      </Link>
    </Button>
  );
}
