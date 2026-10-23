"use client";

import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRef } from "react";

import { LogoIcon } from "@/components/logo-icon";
import { localePath } from "@/i18n/config";
import { LEGAL_ENTITY } from "@/lib/legal";

// Words in "notFound.links.<key>"; the help and home pages exist in every language.
const LINKS = [
  { key: "home", href: "/", localized: true },
  { key: "help", href: "/help", localized: true },
  { key: "login", href: "/login", localized: false },
] as const;

/**
 * The 404, "Plano": the lost page as a spot missing from a floor plan. Paper
 * background, a drafting grid, the code drawn in outline and a crosshair that
 * follows the pointer with its coordinates (the only motion, and it is the
 * visitor's). The way out is a search that hands the words to the help center.
 */
export function Plan404() {
  const t = useTranslations("notFound");
  const locale = useLocale();
  const stage = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  function track(event: React.PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.round(event.clientX - box.left);
    const y = Math.round(event.clientY - box.top);
    stage.current?.style.setProperty("--x", `${x}px`);
    stage.current?.style.setProperty("--y", `${y}px`);
    if (readout.current) readout.current.textContent = `x ${x} · y ${y}`;
  }

  return (
    <div className="landing flex min-h-svh flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <Link
            href={localePath(locale, "/")}
            className="flex items-center gap-2 rounded-sm font-logo text-xl leading-none font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-forest"
          >
            <LogoIcon className="h-[0.95em] text-forest" />
            Tivvu
          </Link>
          <span className="text-sm text-quiet">{t("code")}</span>
        </div>
      </header>

      <main
        ref={stage}
        onPointerMove={track}
        className="relative flex flex-1 flex-col overflow-hidden"
        style={{ "--x": "50%", "--y": "42%" } as React.CSSProperties}
      >
        {/* Drafting grid: fine squares with a heavier line every fifth. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_40%,#000_30%,transparent_75%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(20 40 31 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(20 40 31 / 0.07) 1px, transparent 1px), linear-gradient(to right, rgb(20 40 31 / 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgb(20 40 31 / 0.12) 1px, transparent 1px)",
            backgroundSize: "24px 24px, 24px 24px, 120px 120px, 120px 120px",
          }}
        />
        {/* Crosshair that follows the pointer. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-forest/25 max-sm:hidden"
          style={{ left: "var(--x)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px bg-forest/25 max-sm:hidden"
          style={{ top: "var(--y)" }}
        />
        <span
          aria-hidden
          ref={readout}
          className="pointer-events-none absolute -translate-y-6 translate-x-2 text-[11px] text-forest/70 tabular-nums max-sm:hidden"
          style={{ left: "var(--x)", top: "var(--y)" }}
        ></span>

        <div className="relative mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-center gap-8 px-5 py-14 text-center sm:px-8">
          <p
            aria-hidden
            className="flex items-center justify-center gap-[0.04em] font-logo text-[clamp(6rem,min(24vw,30svh),18rem)] leading-none font-semibold tracking-tighter text-transparent select-none"
            style={{ WebkitTextStroke: "2px var(--l-forest)" }}
          >
            <span>4</span>
            <span className="relative inline-flex h-[0.72em] w-[0.72em] items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full"
                fill="none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="43"
                  stroke="var(--l-forest)"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
              </svg>
              <span className="relative flex w-[0.3em] justify-center">
                <LogoIcon className="w-full text-forest" />
              </span>
            </span>
            <span>4</span>
          </p>

          <h1 className="max-w-2xl font-logo text-2xl leading-snug font-medium tracking-tight sm:text-3xl">
            <span className="sr-only">{t("code")}. </span>
            {t("title")}{" "}
            <span className="text-quiet">{t("tail")}</span>
          </h1>

          <form
            action={localePath(locale, "/help")}
            method="get"
            role="search"
            className="flex w-full max-w-lg flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="plan-q" className="sr-only">
              {t("searchLabel")}
            </label>
            <input
              id="plan-q"
              name="q"
              type="search"
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              className="h-12 flex-1 rounded-lg border border-line bg-white px-4 text-base outline-none placeholder:text-quiet focus-visible:ring-2 focus-visible:ring-forest"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-lime px-6 text-base font-semibold text-forest-deep outline-none transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
            >
              {t("search")}
            </button>
          </form>
        </div>

        <nav
          aria-label={t("otherPlaces")}
          className="relative border-t border-line bg-paper"
        >
          <ul className="mx-auto grid max-w-[1440px] sm:grid-cols-3 sm:divide-x sm:divide-line">
            {LINKS.map((link) => (
              <li
                key={link.key}
                className="border-b border-line last:border-b-0 sm:border-b-0"
              >
                <Link
                  href={link.localized ? localePath(locale, link.href) : `${link.href}?lang=${locale}`}
                  className="group flex items-center justify-between gap-4 px-5 py-5 outline-none transition-colors hover:bg-mist focus-visible:bg-mist sm:px-8"
                >
                  <span className="flex flex-col gap-0.5 text-left">
                    <span className="font-medium">{t(`links.${link.key}.label`)}</span>
                    <span className="text-sm text-quiet">{t(`links.${link.key}.hint`)}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-5 shrink-0 text-quiet transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-5 py-3 text-center text-xs text-quiet sm:px-8">
            {t("stillLost")}{" "}
            <a
              className="underline underline-offset-4"
              href={`mailto:${LEGAL_ENTITY.contactEmail}`}
            >
              {LEGAL_ENTITY.contactEmail}
            </a>
          </p>
        </nav>
      </main>
    </div>
  );
}
