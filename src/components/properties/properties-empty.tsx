"use client";

import { Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { HelpHint } from "@/components/docs/help-link";

const STEPS = ["basics", "media", "publish"] as const;

/**
 * Propiedades before the first listing: what to do now (the actions), and the
 * three steps that follow so publishing doesn't feel like a big unknown.
 */
export function PropertiesEmpty({ actions }: { actions: React.ReactNode }) {
  const t = useTranslations("properties.page.empty");

  return (
    <div className="flex flex-col items-center gap-8 rounded-3xl bg-card px-6 py-14 text-center ring-1 ring-foreground/5 sm:py-16">
      <div className="flex max-w-md flex-col items-center gap-5">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
          <Building2 className="size-7" aria-hidden />
        </span>
        <div className="flex flex-col gap-2">
          <p className="font-display text-3xl leading-tight tracking-tight">{t("title")}</p>
          <p className="text-pretty text-muted-foreground">{t("body")}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">{actions}</div>
      </div>

      <ol className="grid w-full max-w-3xl gap-3 text-left sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-3 rounded-2xl bg-muted/50 p-4">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-primary tabular-nums">
              {index + 1}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{t(`steps.${step}.title`)}</span>
              <span className="text-xs text-muted-foreground">{t(`steps.${step}.text`)}</span>
            </span>
          </li>
        ))}
      </ol>

      <HelpHint section="propiedades">{t("help")}</HelpHint>
    </div>
  );
}
