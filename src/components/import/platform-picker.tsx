"use client";

import { ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Segmented } from "@/components/properties/segmented";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormat } from "@/i18n/format";
import { GENERIC_ORIGINS } from "@/lib/import-guides";
import { platformLogo } from "@/lib/import-logos";
import { IMPORT_PLATFORMS, type ImportPlatform, type PlatformType } from "@/lib/import-platforms";

import { FORMAT_ICON, TYPE_FILTERS, plain, type Origin } from "./import-shared";

export function PlatformLogo({ platform, size }: { platform: ImportPlatform; size: number }) {
  const logo = platformLogo(platform.slug);
  const Icon = FORMAT_ICON[platform.format];
  if (!logo) {
    return (
      <span
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"
      >
        <Icon className="size-4" />
      </span>
    );
  }
  return (
    <Image
      src={logo}
      alt=""
      width={size}
      height={size}
      unoptimized
      className="shrink-0 rounded-xl bg-white object-contain ring-1 ring-foreground/10"
    />
  );
}

/** "Portugal, España": a platform's markets named in the page's language. */
function useMarkets() {
  const { tag } = useFormat();
  return useMemo(() => {
    const names = new Intl.DisplayNames([tag], { type: "region" });
    return (platform: ImportPlatform) => platform.markets.map((code) => names.of(code) ?? code).join(", ");
  }, [tag]);
}

function PlatformButton({ platform, onPick }: { platform: ImportPlatform; onPick: () => void }) {
  const t = useTranslations("importer");
  const markets = useMarkets();
  return (
    <button
      type="button"
      onClick={onPick}
      className="flex items-start gap-3 rounded-2xl bg-card p-4 text-left ring-1 ring-foreground/5 transition-shadow outline-none hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <PlatformLogo platform={platform} size={36} />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-medium">{platform.name}</span>
        <span className="truncate text-xs text-muted-foreground">{markets(platform)}</span>
        <span className="text-xs text-primary">{t(`formats.${platform.format}`)}</span>
      </span>
    </button>
  );
}

/** The generic ways in, for anyone whose system isn't listed. */
function GenericOptions({ onPick, lead }: { onPick: (origin: Origin) => void; lead: string }) {
  const t = useTranslations("importer");
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/5">
      <p className="text-sm text-muted-foreground">{lead}</p>
      <div className="flex flex-wrap gap-3">
        {GENERIC_ORIGINS.map((generic) => {
          const Icon = FORMAT_ICON[generic.format];
          return (
            <Button key={generic.slug} variant="outline" onClick={() => onPick({ generic })}>
              <Icon />
              {t(`generic.${generic.slug}.name`)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export function PlatformPicker({ onPick }: { onPick: (origin: Origin) => void }) {
  const t = useTranslations("importer.picker");
  const markets = useMarkets();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PlatformType | "all">("all");
  const [showAll, setShowAll] = useState(true);

  const platforms = useMemo(() => {
    const needle = plain(query.trim());
    return IMPORT_PLATFORMS.filter(
      (item) =>
        (typeFilter === "all" || item.type === typeFilter) &&
        (!needle || plain(`${item.name} ${markets(item)}`).includes(needle)),
    );
  }, [query, typeFilter, markets]);

  // How many match the search in each type, so a filter never leads to an empty list by surprise.
  const typeCounts = useMemo(() => {
    const needle = plain(query.trim());
    const counts: Record<string, number> = { all: 0 };
    for (const item of IMPORT_PLATFORMS) {
      if (needle && !plain(`${item.name} ${markets(item)}`).includes(needle)) continue;
      counts.all += 1;
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
    return counts;
  }, [query, markets]);

  const popular = platforms.filter((item) => item.priority === 1);
  const others = platforms.filter((item) => item.priority > 1);
  // Searching or filtering is looking for something specific: don't hide matches behind a fold.
  const narrowed = query.trim().length > 0 || typeFilter !== "all";
  const othersOpen = showAll || narrowed;
  const grid = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-3";

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl">{t("title")}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("search")}
              autoFocus
              className="h-10 rounded-full border-transparent bg-foreground/[0.07] pl-10 transition-[background-color,box-shadow,border-color] duration-500 ease-out focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] focus-visible:ring-0 dark:bg-foreground/10 dark:focus-visible:bg-card"
            />
          </div>
          <Segmented
            label={t("type")}
            value={typeFilter}
            onChange={setTypeFilter}
            options={TYPE_FILTERS.map((value) => ({ value, label: t(`types.${value}`) }))}
            counts={typeCounts}
          />
        </div>

        {platforms.length === 0 && (
          <p className="text-sm text-muted-foreground" role="status">
            {t("notFound")}
          </p>
        )}

        {popular.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">{t("popular")}</h3>
            <div className={grid}>
              {popular.map((item) => (
                <PlatformButton key={item.slug} platform={item} onPick={() => onPick({ platform: item })} />
              ))}
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div className="flex flex-col gap-3">
            {othersOpen ? (
              <>
                <h3 className="text-sm font-medium text-muted-foreground">{t("others")}</h3>
                <div id="other-platforms" className={grid}>
                  {others.map((item) => (
                    <PlatformButton key={item.slug} platform={item} onPick={() => onPick({ platform: item })} />
                  ))}
                </div>
                {!narrowed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit"
                    aria-expanded
                    aria-controls="other-platforms"
                    onClick={() => setShowAll(false)}
                  >
                    <ChevronDown className="rotate-180" />
                    {t("showLess")}
                  </Button>
                )}
              </>
            ) : (
              <Button variant="ghost" size="sm" className="w-fit" aria-expanded={false} onClick={() => setShowAll(true)}>
                <ChevronDown />
                {t("showOthers", { count: others.length })}
              </Button>
            )}
          </div>
        )}
      </section>

      <GenericOptions
        onPick={onPick}
        lead={
          platforms.length === 0
            ? t("genericLeadEmpty")
            : t("genericLead")
        }
      />
    </div>
  );
}
