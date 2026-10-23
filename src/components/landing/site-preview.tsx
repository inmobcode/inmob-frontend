import { MapPin, Menu, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { PropertyPhoto } from "@/components/landing/fragments";
import { useFormat } from "@/i18n/format";
import type { FONT_PAIRS } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

type FontPair = (typeof FONT_PAIRS)[number];

export interface PreviewState {
  /** Index into SITE_TEMPLATES: portada, editorial, compacto, dividido, mosaico. */
  template: number;
  accent: string;
  pair: FontPair;
  promo: boolean;
  location: boolean;
  featured: boolean;
}

const LISTINGS = [
  { photo: "laBarra", key: "beach", place: "La Barra, Maldonado", price: 485000, kind: "sale" },
  { photo: "palermo", key: "view", place: "Palermo, Buenos Aires", price: 1250, kind: "rent" },
  { photo: "olivos", key: "garden", place: "Olivos, Buenos Aires", price: 320000, kind: "sale" },
] as const;

const NAV = ["properties", "about", "contact"] as const;
const TRANSITION = "transition-colors duration-300";

/**
 * The agency's public site, drawn at preview scale. It sizes itself with
 * container queries, so narrowing the frame (the phone view) stacks it the
 * same way the real site stacks on a small screen.
 */
export function SitePreview({ state }: { state: PreviewState }) {
  const t = useTranslations("landing.preview");
  const { number } = useFormat();
  const { template, accent, pair, promo, location, featured } = state;
  const title = {
    fontFamily: pair.heading,
    fontWeight: pair.weight,
    letterSpacing: pair.tracking,
  };
  const button = { backgroundColor: accent };

  const searchBar = (
    <div className="flex w-full max-w-lg flex-col gap-2 rounded-xl bg-white p-2 text-ink shadow-sm @md:flex-row @md:items-center">
      <span className="flex h-9 flex-1 items-center gap-2 px-2 text-xs text-quiet">
        <Search className="size-3.5 shrink-0" aria-hidden />
        {t("searchLong")}
      </span>
      <span
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold text-white",
          TRANSITION,
        )}
        style={button}
      >
        {t("search")}
      </span>
    </div>
  );

  const intro = (
    <>
      <p
        className="text-[1.65rem] leading-[1.05] text-balance @2xl:text-4xl"
        style={title}
      >
        {t("title")}
      </p>
      <p className="max-w-sm text-xs leading-relaxed opacity-80 @md:text-sm">
        {t("subtitle")}
      </p>
    </>
  );

  return (
    <div
      className="@container bg-white text-ink"
      style={{ fontFamily: pair.body }}
    >
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 @2xl:px-6">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn(
              "flex size-7 items-center justify-center rounded-md text-xs font-semibold text-white",
              TRANSITION,
            )}
            style={{ ...button, ...title }}
          >
            C
          </span>
          <p className="text-sm" style={title}>
            Cabrera Propiedades
          </p>
        </div>
        <nav
          aria-hidden
          className="hidden items-center gap-6 text-xs text-quiet @2xl:flex"
        >
          {NAV.map((item) => (
            <span key={item}>{t(`nav.${item}`)}</span>
          ))}
        </nav>
        <span
          className={cn(
            "hidden h-8 items-center rounded-lg px-3 text-xs font-semibold text-white @2xl:inline-flex",
            TRANSITION,
          )}
          style={button}
        >
          {t("contact")}
        </span>
        <Menu className="size-5 text-quiet @2xl:hidden" aria-hidden />
      </header>

      {template === 0 && (
        <div className="relative flex flex-col items-start gap-3 px-4 pt-14 pb-6 text-white @2xl:px-6 @2xl:pt-20 @2xl:pb-8">
          <PropertyPhoto
            photo="coast"
            sizes="900px"
            className="absolute! inset-0"
          />
          <span aria-hidden className="absolute inset-0 bg-black/40" />
          <div className="relative flex flex-col gap-2">{intro}</div>
          <div className="relative w-full">{searchBar}</div>
        </div>
      )}

      {template === 1 && (
        <div className="grid @2xl:grid-cols-2">
          <div className="flex flex-col items-start justify-center gap-3 px-4 py-8 @2xl:px-6 @2xl:py-12">
            {intro}
            <div className="mt-1 w-full">
              <div className="flex w-full max-w-lg flex-col gap-2 rounded-xl border border-line p-2 @md:flex-row @md:items-center">
                <span className="flex h-9 flex-1 items-center gap-2 px-2 text-xs text-quiet">
                  <Search className="size-3.5 shrink-0" aria-hidden />
                  {t("searchShort")}
                </span>
                <span
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold text-white",
                    TRANSITION,
                  )}
                  style={button}
                >
                  {t("search")}
                </span>
              </div>
            </div>
          </div>
          <PropertyPhoto
            photo="coast"
            sizes="450px"
            className="aspect-[16/9] @2xl:aspect-auto @2xl:min-h-64"
          />
        </div>
      )}

      {template === 2 && (
        <div className="flex flex-col gap-3 border-b border-line px-4 py-5 @2xl:px-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-lg" style={title}>
              {t("nav.properties")}
            </p>
            <p className="text-xs text-quiet">{t("results", { count: 24 })}</p>
          </div>
          <div className="flex w-full max-w-xl flex-col gap-2 rounded-xl border border-line p-2 @md:flex-row @md:items-center">
            <span className="flex h-9 flex-1 items-center gap-2 px-2 text-xs text-quiet">
              <Search className="size-3.5 shrink-0" aria-hidden />
              {t("searchShort")}
            </span>
            <span
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold text-white",
                TRANSITION,
              )}
              style={button}
            >
              {t("search")}
            </span>
          </div>
        </div>
      )}

      {template === 3 && (
        <div className="grid @2xl:grid-cols-2">
          <div
            className={cn(
              "flex flex-col items-start justify-center gap-3 px-4 py-8 text-white @2xl:px-6 @2xl:py-12",
              TRANSITION,
            )}
            style={button}
          >
            {intro}
            <div className="mt-1 w-full">{searchBar}</div>
          </div>
          <PropertyPhoto
            photo="coast"
            sizes="450px"
            className="aspect-[16/9] @2xl:aspect-auto @2xl:min-h-64"
          />
        </div>
      )}

      {template === 4 && (
        <div className="flex flex-col gap-4 px-4 py-5 @2xl:px-6">
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            <PropertyPhoto
              photo="coast"
              sizes="450px"
              className="col-span-2 row-span-2 aspect-[4/3] rounded-lg"
            />
            <PropertyPhoto
              photo="laBarra"
              sizes="200px"
              className="rounded-lg"
            />
            <PropertyPhoto
              photo="belgrano"
              sizes="200px"
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">{intro}</div>
          <div className="w-full">
            <div className="flex w-full max-w-lg flex-col gap-2 rounded-xl border border-line p-2 @md:flex-row @md:items-center">
              <span className="flex h-9 flex-1 items-center gap-2 px-2 text-xs text-quiet">
                <Search className="size-3.5 shrink-0" aria-hidden />
                {t("searchShort")}
              </span>
              <span
                className={cn(
                  "inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold text-white",
                  TRANSITION,
                )}
                style={button}
              >
                {t("search")}
              </span>
            </div>
          </div>
        </div>
      )}

      {promo && (
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-xs font-medium text-white @md:text-sm",
            TRANSITION,
          )}
          style={button}
        >
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-semibold">
            15% OFF
          </span>
          {t("promo")}
        </div>
      )}

      {location && (
        <div className="grid items-center gap-4 border-b border-line p-4 @2xl:grid-cols-[1fr_1.2fr] @2xl:gap-8 @2xl:p-6">
          <div className="flex flex-col items-start gap-2">
            <span
              className={cn("text-xs font-semibold", TRANSITION)}
              style={{ color: accent }}
            >
              {t("destination")}
            </span>
            <p className="text-xl leading-tight" style={title}>
              La Barra
            </p>
            <p className="text-xs leading-relaxed text-quiet @md:text-sm">
              {t("destinationText")}
            </p>
            <span
              className={cn(
                "mt-1 inline-flex h-8 items-center rounded-lg border px-3 text-xs font-semibold",
                TRANSITION,
              )}
              style={{ borderColor: accent, color: accent }}
            >
              {t("destinationCta")}
            </span>
          </div>
          <PropertyPhoto
            photo="vicenteLopez"
            sizes="500px"
            className="aspect-[16/9] rounded-lg @2xl:aspect-[16/8]"
          />
        </div>
      )}

      {featured && (
        <div className="flex flex-col gap-4 p-4 @2xl:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-base @md:text-lg" style={title}>
              {t("featured")}
            </p>
            <span
              className={cn("text-xs font-semibold", TRANSITION)}
              style={{ color: accent }}
            >
              {t("viewAll")}
            </span>
          </div>
          <div className="grid gap-4 @xl:grid-cols-3">
            {LISTINGS.map((item) => (
              <div key={item.key} className="flex flex-col gap-2">
                <div className="relative">
                  <PropertyPhoto
                    photo={item.photo}
                    sizes="300px"
                    className="aspect-[4/3] rounded-lg"
                  />
                  <span className="absolute top-2 left-2 rounded bg-white/95 px-1.5 py-0.5 text-[11px] font-semibold">
                    {t(`kinds.${item.kind}`)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">{t(`listings.${item.key}`)}</p>
                  <p className="flex items-center gap-1 text-xs text-quiet">
                    <MapPin className="size-3 shrink-0" aria-hidden />
                    {item.place}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm font-semibold tabular-nums",
                      TRANSITION,
                    )}
                    style={{ color: accent }}
                  >
                    {item.kind === "rent"
                      ? t("perMonth", { price: `USD ${number(item.price)}` })
                      : `USD ${number(item.price)}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="flex flex-col gap-1 border-t border-line bg-mist/60 px-4 py-4 text-xs text-quiet @md:flex-row @md:items-center @md:justify-between @2xl:px-6">
        <span style={title} className="text-sm text-ink">
          Cabrera Propiedades
        </span>
        <span>Av. del Libertador 1250 · +54 11 5555 0123</span>
      </footer>
    </div>
  );
}
