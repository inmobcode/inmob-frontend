"use client";

import { ArrowRight, FileSpreadsheet, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useSessionUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const CARD =
  "group/choice flex flex-col gap-6 rounded-3xl bg-card p-7 text-left ring-1 ring-foreground/5 outline-none motion-safe:transition-all motion-safe:hover:-translate-y-0.5 hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-ring";

const storageKey = (slug: string) => `tivvu:welcome:${slug}`;

function remember(slug: string, choice: "import" | "scratch" | "later") {
  try {
    localStorage.setItem(storageKey(slug), choice);
  } catch {
    // Private windows or blocked storage: the choice only tailors this visit.
  }
}

/**
 * First screen after sign-up: one question, two clear paths. Importing is
 * OWNER/ADMIN only (the API enforces it too), so an agent only sees "from scratch".
 */
export function WelcomeChoice() {
  const t = useTranslations("welcome");
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const user = useSessionUser();
  const canImport = user?.role === "OWNER" || user?.role === "ADMIN";
  const firstName = user?.name?.split(" ")[0];

  const options = [
    ...(canImport
      ? [
          {
            key: "import" as const,
            icon: FileSpreadsheet,
            href: `/${agencySlug}/properties/import`,
          },
        ]
      : []),
    { key: "scratch" as const, icon: Sparkles, href: `/${agencySlug}/properties?new=1` },
  ];

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 py-6 sm:py-12">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium text-primary">{t("eyebrow")}</p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          {firstName ? t("titleNamed", { name: firstName }) : t("title")}
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">{t("lead")}</p>
      </header>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium">{t("question")}</h2>
        <div className={cn("grid gap-4", options.length > 1 && "sm:grid-cols-2")}>
          {options.map(({ key, icon: Icon, href }) => (
            <Link key={key} href={href} onClick={() => remember(agencySlug, key)} className={CARD}>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="font-display text-2xl leading-tight">{t(`${key}.title`)}</span>
                <span className="text-sm text-muted-foreground">{t(`${key}.text`)}</span>
              </span>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {t(`${key}.cta`)}
                <ArrowRight
                  className="size-4 motion-safe:transition-transform group-hover/choice:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <p>{t("reassure")}</p>
        <Link
          href={`/${agencySlug}/properties`}
          onClick={() => remember(agencySlug, "later")}
          className="w-fit rounded-sm text-foreground underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("later")}
        </Link>
      </div>
    </section>
  );
}
