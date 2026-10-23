import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoIcon } from "@/components/logo-icon";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const WRAP = "mx-auto w-full max-w-[1440px] px-5 sm:px-8";

// Section links point at "/#…" so they also work from the legal pages, which
// share this footer. `app` links go to the dashboard host, which has no
// language prefix: ?lang carries the language over.
const FOOTER_LINKS = [
  {
    key: "product",
    links: [
      { key: "how", href: "/#flujo" },
      { key: "team", href: "/#equipo" },
      { key: "migration", href: "/#migracion" },
    ],
  },
  {
    key: "portals",
    links: [
      { key: "site", href: "/#portales" },
      { key: "owner", href: "/#portales" },
    ],
  },
  {
    key: "start",
    links: [
      { key: "demo", href: "/#demo" },
      { key: "plans", href: "/#planes" },
      { key: "faq", href: "/#preguntas" },
    ],
  },
  {
    key: "account",
    links: [
      { key: "login", href: "/login", app: true },
      { key: "register", href: "/register", app: true },
    ],
  },
] as const;

const LEGAL_LINKS = [
  { key: "help", href: "/help" },
  { key: "terms", href: "/terms" },
  { key: "privacy", href: "/privacy" },
] as const;

const FOOTER_LINK =
  "rounded-sm text-paper/75 outline-none transition-colors hover:text-paper focus-visible:ring-2 focus-visible:ring-lime";

export function LandingFooter() {
  const t = useTranslations("landing.footer");
  const locale = useLocale();
  return (
    <footer data-nav-dark className="overflow-hidden bg-forest-deep text-paper">
      <div
        className={cn(
          WRAP,
          "grid gap-12 pt-16 pb-14 md:pt-20 lg:grid-cols-12 lg:gap-8",
        )}
      >
        <div className="flex flex-col items-start gap-4 lg:col-span-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm font-logo text-xl leading-none font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-lime"
          >
            <LogoIcon className="h-[0.95em] text-lime" />
            Tivvu
          </Link>
          <p className="max-w-xs text-pretty text-paper/60">
            {t("tagline")}
          </p>
        </div>

        <nav
          aria-label={t("label")}
          className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-8"
        >
          {FOOTER_LINKS.map((group) => (
            <div key={group.key} className="flex flex-col gap-4">
              <h3 className="text-sm text-paper/45">{t(`groups.${group.key}.title`)}</h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.key}>
                    {"app" in link ? (
                      <NextLink href={`${link.href}?lang=${locale}`} className={FOOTER_LINK}>
                        {t(`groups.${group.key}.${link.key}` as never)}
                      </NextLink>
                    ) : (
                      <Link href={link.href} className={FOOTER_LINK}>
                        {t(`groups.${group.key}.${link.key}` as never)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={WRAP}>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-paper/10 py-6 text-sm text-paper/45">
          <p>© {new Date().getFullYear()} Tivvu</p>
          <ul aria-label={t("legalLabel")} className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={cn(FOOTER_LINK, "text-paper/60")}>
                  {t(`legal.${link.key}`)}
                </Link>
              </li>
            ))}
            <li>
              {/* "#top" scrolls to the start of the document without needing an element with that id. */}
              <a href="#top" className={cn(FOOTER_LINK, "text-paper/60")}>
                {t("top")}
              </a>
            </li>
            <li>
              <LanguageSwitcher align="end" className="-ml-2.5 text-paper/60 hover:bg-paper/10 hover:text-paper" />
            </li>
          </ul>
        </div>
      </div>

      {/* The wordmark sits on the bottom edge like a house on the ground line: its foot is cropped by the page end.
          Its font size is the content width divided by the wordmark's width in em, so it always spans edge to edge. */}
      <div aria-hidden className={cn(WRAP, "pointer-events-none select-none")}>
        <p className="-mb-[0.14em] flex items-end gap-[0.06em] font-logo text-[calc((100vw-2.5rem)/3.44)] sm:text-[min(calc((100vw-4rem)/3.44),25rem)] leading-[0.8] font-semibold tracking-[-0.05em] text-forest">
          <LogoIcon className="mb-[0.02em] h-[0.72em] text-forest" />
          Tivvu
        </p>
      </div>
    </footer>
  );
}
