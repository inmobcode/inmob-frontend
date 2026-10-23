"use client";

import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter as useAppRouter } from "next/navigation";
import { useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALES, type Locale } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Remembers the choice: the proxy reads it to send "/" to the right language next time. */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

function LanguageMenu({
  className,
  align,
  compact,
  pending,
  onChoose,
}: {
  className?: string;
  align: "start" | "end";
  compact: boolean;
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
    </DropdownMenu>
  );
}

/**
 * The language menu of the app host's own screens (sign-in, sign-up): their
 * URLs carry no language, so the choice is kept in the cookie and the page
 * renders again in it.
 */
export function AppLanguageSwitcher({ className, align = "start" }: { className?: string; align?: "start" | "end" }) {
  const router = useAppRouter();
  const [pending, startTransition] = useTransition();
  return (
    <LanguageMenu
      className={className}
      align={align}
      compact={false}
      pending={pending}
      onChoose={(next) => {
        rememberLocale(next);
        startTransition(() => router.refresh());
      }}
    />
  );
}

/**
 * The public site's language menu (landing, legal pages, agency sites): moves
 * to the same page in the chosen language, keeping the query string.
 */
export function LanguageSwitcher({
  className,
  align = "end",
  compact = false,
}: {
  className?: string;
  align?: "start" | "end";
  /** Only the language code next to the globe. */
  compact?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    rememberLocale(next);
    const search = window.location.search;
    startTransition(() => {
      router.replace(`${pathname}${search}`, { locale: next, scroll: false });
    });
  }

  return <LanguageMenu className={className} align={align} compact={compact} pending={pending} onChoose={choose} />;
}
