import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import NextLink from "next/link";

import { LogoIcon } from "@/components/logo-icon";
import { Link } from "@/i18n/navigation";
import type { MarketplaceFacets } from "@/lib/api/marketplace";
import { useLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

const PATH = "/landing-test";
const WRAP = "mx-auto w-full max-w-7xl px-5 sm:px-8";

/** A link into the results with a ready-made search; real hrefs, so they work without JS and can be crawled. */
function searchHref(params: Record<string, string>) {
  return `${PATH}?${new URLSearchParams(params).toString()}#resultados`;
}

const LINK = "text-paper/70 underline-offset-4 transition-colors hover:text-paper hover:underline";

/** The end of the landing: the ways around (rent, buy, for agencies) and the legal line. */
export function SiteFooter({ facets }: { facets: MarketplaceFacets }) {
  const t = useTranslations("marketplace.footer");
  const labels = useLabels();
  const types = facets.categories.slice(0, 6);

  // `app` links go to the dashboard host, which has no language prefix.
  const columns: { title: string; links: { label: string; href: string; app?: boolean }[] }[] = [
    {
      title: t("rent.title"),
      links: [
        { label: t("rent.all"), href: searchHref({ op: "RENT" }) },
        ...facets.zones
          .slice(0, 3)
          .map((zone) => ({ label: t("rent.in", { zone: zone.name }), href: searchHref({ op: "RENT", zone: zone.name }) })),
      ],
    },
    {
      title: t("buy.title"),
      links: [
        { label: t("buy.all"), href: searchHref({ op: "SALE" }) },
        ...types.slice(0, 4).map((type) => ({
          label: labels.category(type.value),
          href: searchHref({ op: "SALE", type: type.value }),
        })),
      ],
    },
    {
      title: t("agencies.title"),
      links: [
        { label: t("agencies.about"), href: "/" },
        { label: t("agencies.register"), href: "/register", app: true },
        { label: t("agencies.login"), href: "/login", app: true },
      ],
    },
    {
      title: "Tivvu",
      links: [
        { label: t("tivvu.how"), href: `${PATH}#como-funciona` },
        { label: t("tivvu.all"), href: `${PATH}#resultados` },
      ],
    },
  ];

  return (
    <footer id="pie" className="bg-forest-deep text-paper">
      <div className={cn(WRAP, "grid gap-12 pt-16 pb-14 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:pt-20")}>
        <div className="flex flex-col items-start gap-5">
          <Link href={PATH} className="inline-flex items-center gap-2 font-display text-2xl tracking-tight">
            <LogoIcon className="text-lime" />
            Tivvu
          </Link>
          <p className="max-w-sm text-paper/70">
            {t("blurb")}
          </p>
          <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-paper/10 p-5">
            <p className="font-display text-lg leading-snug">{t("pitch.title")}</p>
            <p className="text-sm text-paper/65">{t("pitch.body")}</p>
            <Link
              href="/"
              className="inline-flex h-11 w-fit items-center gap-2 rounded-full bg-lime px-5 text-sm font-medium text-forest-deep transition-[filter] hover:brightness-95"
            >
              {t("pitch.cta")}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        <nav aria-label={t("label")} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-paper">{column.title}</h3>
              <ul className="flex flex-col gap-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.app ? (
                      <NextLink href={link.href} className={LINK}>
                        {link.label}
                      </NextLink>
                    ) : (
                      <Link href={link.href} className={LINK}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-paper/10">
        <div className={cn(WRAP, "flex flex-col gap-2 py-6 text-sm text-paper/55 sm:flex-row sm:items-center sm:justify-between")}>
          <span>© {new Date().getFullYear()} Tivvu</span>
          <span>{t("legal")}</span>
        </div>
      </div>
    </footer>
  );
}
