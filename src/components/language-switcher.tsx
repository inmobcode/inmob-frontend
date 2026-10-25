"use client";

import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter as useAppRouter } from "next/navigation";
import { useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALES, type Locale } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Remembers the choice: the proxy reads it to send "/" to the right language next time. */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

function useLocaleChange(scope: "public" | "app") {
  const pathname = usePathname();
  const router = useRouter();
  const appRouter = useAppRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    rememberLocale(next);
    if (scope === "app") {
      startTransition(() => appRouter.refresh());
      return;
    }
    const search = window.location.search;
    startTransition(() => {
      router.replace(`${pathname}${search}`, { locale: next, scroll: false });
    });
  }

  return { choose, pending };
}

function LanguageMenu({
  className,
  align,
  compact,
  variant,
  pending,
  onChoose,
}: {
  className?: string;
  align: "start" | "end";
  compact: boolean;
  variant: "default" | "landing";
  pending: boolean;
  onChoose: (locale: Locale) => void;
}) {
  const t = useTranslations("language");
  const locale = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("change")}
          disabled={pending}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-current/40 disabled:opacity-60",
            className,
          )}
        >
          <Globe className="size-4 shrink-0" aria-hidden />
          <span>{compact ? locale.toUpperCase() : LOCALE_NAMES[locale as Locale]}</span>
        </button>
      </DropdownMenuTrigger>
      {variant === "landing" ? (
        // The menu is portaled out of `.landing`, so it carries the scope itself.
        <DropdownMenuContent
          align={align}
          sideOffset={10}
          className="landing w-56 rounded-xl border border-line bg-paper p-1.5 text-ink shadow-[0_12px_32px_-8px_rgba(15,53,36,0.22)] ring-0"
        >
          <p className="px-2.5 pt-1.5 pb-2 text-[11px] font-medium tracking-wider text-quiet uppercase">
            {t("change")}
          </p>
          {LOCALES.map((option) => {
            const active = option === locale;
            return (
              <DropdownMenuItem
                key={option}
                lang={option}
                onSelect={() => !active && onChoose(option)}
                className={cn(
                  "h-10 gap-3 rounded-lg px-2.5 text-sm text-ink transition-colors focus:bg-mist focus:text-ink",
                  active && "bg-mist font-medium",
                )}
              >
                <span
                  className={cn(
                    "w-6 text-xs font-semibold tracking-wide",
                    active ? "text-forest" : "text-quiet",
                  )}
                >
                  {option.toUpperCase()}
                </span>
                {LOCALE_NAMES[option]}
                {active && <Check className="ml-auto text-forest" aria-hidden />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent align={align} className="w-48 rounded-2xl p-1.5">
          {LOCALES.map((option) => (
            <DropdownMenuItem
              key={option}
              lang={option}
              onSelect={() => option !== locale && onChoose(option)}
              className="rounded-xl py-2"
            >
              {LOCALE_NAMES[option]}
              {option === locale && <Check className="ml-auto" aria-hidden />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

/**
 * The one language button. `scope="public"` (landing, legal pages, agency
 * sites) moves to the same page in the chosen language, keeping the query
 * string; `scope="app"` (sign-in, dashboard) has no language in the URL, so the
 * choice is kept in the cookie and the page renders again in it.
 */
export function LanguageSwitcher({
  className,
  align = "end",
  compact = false,
  variant = "default",
  scope = "public",
}: {
  className?: string;
  align?: "start" | "end";
  /** Only the language code next to the globe. */
  compact?: boolean;
  /** The landing's own paper-and-forest look for the menu. */
  variant?: "default" | "landing";
  scope?: "public" | "app";
}) {
  const { choose, pending } = useLocaleChange(scope);
  return <LanguageMenu className={className} align={align} compact={compact} variant={variant} pending={pending} onChoose={choose} />;
}

/** The language entry of a dropdown menu (the dashboard's user menu): a submenu with the same choices. */
export function LanguageSubmenu({ label }: { label: string }) {
  const locale = useLocale();
  const { choose, pending } = useLocaleChange("app");
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="rounded-xl py-2" disabled={pending}>
        <Globe />
        {label}
        <span className="ml-auto text-xs text-muted-foreground">{LOCALE_NAMES[locale as Locale]}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-48 rounded-2xl p-1.5">
          {LOCALES.map((option) => (
            <DropdownMenuItem key={option} lang={option} className="gap-2 rounded-xl py-2" onSelect={() => option !== locale && choose(option)}>
              {option === locale ? <Check /> : <span className="size-4" />}
              {LOCALE_NAMES[option]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
