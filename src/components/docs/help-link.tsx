"use client";

import { ArrowUpRight, CircleQuestionMark } from "lucide-react";
import { useTranslations } from "next-intl";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { docsHref, type DocSectionId } from "@/components/docs/docs-sections";
import { cn } from "@/lib/utils";

// The guide opens in its own tab, so reading it never loses what you were doing.
const NEW_TAB = { target: "_blank", rel: "noreferrer" } as const;

/** Round "?" for a list's toolbar, next to the trash and the new-item button. */
export function HelpLink({
  section,
  label,
  className,
}: {
  section: DocSectionId;
  /** What the tooltip says; also the accessible name. */
  label?: string;
  className?: string;
}) {
  const t = useTranslations("dashboard.help");
  const text = label ?? t("label");
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={docsHref(section)}
          {...NEW_TAB}
          aria-label={t("newTab", { label: text })}
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-muted-foreground outline-none transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-foreground/10 dark:hover:bg-foreground/15",
            className,
          )}
        >
          <CircleQuestionMark className="size-4" />
        </a>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={10}>
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

/** The same link as a line of text, for the "nothing here yet" states. */
export function HelpHint({
  section,
  children,
}: {
  section: DocSectionId;
  children: React.ReactNode;
}) {
  return (
    <a
      href={docsHref(section)}
      {...NEW_TAB}
      className="inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground underline-offset-4 outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {children}
      <ArrowUpRight className="size-3.5 shrink-0" />
    </a>
  );
}
