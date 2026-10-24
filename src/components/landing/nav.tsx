"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoIcon } from "@/components/logo-icon";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#flujo", key: "how" },
  { href: "#sitio", key: "site" },
  { href: "#portales", key: "portals" },
  { href: "#migracion", key: "migration" },
  { href: "#planes", key: "plans" },
] as const;

export function LandingNav() {
  // Over the green blocks (hero, demo, footer) the bar is see-through green with
  // light text; over paper sections it turns into a paper bar with a hairline.
  const t = useTranslations("landing.nav");
  const locale = useLocale();
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    function onScroll() {
      const barHeight = 64;
      const dark = Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav-dark]"),
      ).some((block) => {
        const rect = block.getBoundingClientRect();
        return rect.top <= barHeight / 2 && rect.bottom >= barHeight / 2;
      });
      setOnDark(dark);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-300",
        onDark
          ? "border-paper/10 bg-forest/80 text-paper"
          : "border-line bg-paper/90 text-ink",
      )}
    >
      <nav
        aria-label={t("label")}
        className="mx-auto flex h-16 max-w-[1440px] items-center gap-8 px-5 sm:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm font-logo text-xl leading-none font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-lime"
        >
          <LogoIcon className="h-[0.95em] text-lime" />
          Tivvu
        </Link>
        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "rounded-sm text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-lime",
                  onDark
                    ? "text-paper/70 hover:text-paper"
                    : "text-quiet hover:text-ink",
                )}
              >
                {t(link.key)}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/help"
              className={cn(
                "rounded-sm text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-lime",
                onDark ? "text-paper/70 hover:text-paper" : "text-quiet hover:text-ink",
              )}
            >
              {t("help")}
            </Link>
          </li>
        </ul>
        <div className="ml-auto flex items-center gap-2">
          {/* The panel lives on the app host: ?lang carries the language over.
              A plain <a>, since a client-side RSC fetch across hosts fails its CORS preflight. */}
          <a
            href={`/login?lang=${locale}`}
            className={cn(
              "hidden h-10 items-center rounded-lg px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-lime sm:inline-flex",
              onDark ? "hover:bg-paper/10" : "hover:bg-mist",
            )}
          >
            {t("login")}
          </a>
          <a
            href="#demo"
            className="inline-flex h-10 items-center rounded-lg bg-lime px-4 text-sm font-semibold text-forest-deep outline-none transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
          >
            {t("demo")}
          </a>
          <LanguageSwitcher
            compact
            variant="landing"
            className={cn(
              "rounded-lg",
              onDark ? "hover:bg-paper/10" : "hover:bg-mist",
            )}
          />
        </div>
      </nav>
    </header>
  );
}
