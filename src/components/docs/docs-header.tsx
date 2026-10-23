"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { LogoIcon } from "@/components/logo-icon";
import { Button } from "@/components/ui/button";
import { useSessionUser } from "@/lib/auth/session";

/** The docs' own top bar: the brand and a way back to the dashboard, nothing else. */
export function DocsHeader() {
  const t = useTranslations("docs.header");
  const user = useSessionUser();
  const dashboard = user?.agencySlug ? `/${user.agencySlug}/properties` : "/login";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={dashboard}
          className="flex items-center gap-2 font-logo text-2xl font-semibold leading-none tracking-tight text-foreground"
        >
          <LogoIcon className="text-primary" />
          Tivvu
          <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">{t("docs")}</span>
        </Link>
        <Button variant="outline" asChild className="h-9 gap-1.5 rounded-full px-4">
          <Link href={dashboard}>
            <ArrowLeft />
            {t("back")}
          </Link>
        </Button>
      </div>
    </header>
  );
}
