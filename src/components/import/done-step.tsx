"use client";

import { CheckCircle2, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ImportResult } from "@/lib/api/imports";
import { getPublicOrigin } from "@/lib/public-origin";
import { useAgencySitePath } from "@/lib/agency-site";
import { agencyPath } from "@/lib/seo";

import { downloadFailures } from "./import-shared";

const PREVIEW_FAILURES = 5;

export function DoneStep({
  result,
  agencySlug,
  published,
  onReset,
}: {
  result: ImportResult;
  agencySlug: string;
  published: boolean;
  onReset: () => void;
}) {
  const t = useTranslations("importer.done");
  const tCsv = useTranslations("importer.failuresCsv");
  const sitePath = useAgencySitePath();
  const [showAll, setShowAll] = useState(false);
  const { done, failures } = result;
  const drafts = !published && done.create > 0;
  const shown = showAll ? failures : failures.slice(0, PREVIEW_FAILURES);

  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl bg-card px-6 py-14 text-center ring-1 ring-foreground/5">
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <CheckCircle2 className="size-6" />
      </span>
      <div className="flex max-w-md flex-col gap-1" role="status">
        <p className="font-display text-2xl">{t("title")}</p>
        <p className="text-sm text-muted-foreground">
          {t("summary", { created: done.create, updated: done.update, trashed: done.trash, failed: done.failed })}
          {drafts && ` ${t("drafts")}`}
        </p>
      </div>

      {failures.length > 0 && (
        <div className="flex w-full max-w-md flex-col gap-3 text-left">
          <ul className="flex flex-col gap-1 text-sm text-destructive">
            {shown.map((failure) => (
              <li key={`${failure.row}-${failure.error}`}>
                {t("failure", { row: failure.row, error: failure.error })}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2">
            {failures.length > PREVIEW_FAILURES && (
              <Button variant="ghost" size="sm" onClick={() => setShowAll((value) => !value)}>
                {showAll ? t("showLess") : t("showAll", { count: failures.length })}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadFailures(failures, {
                  row: tCsv("row"),
                  reference: tCsv("reference"),
                  error: tCsv("error"),
                  filename: tCsv("filename"),
                })
              }
            >
              <Download />
              {t("download")}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {drafts ? (
          <Button size="lg" asChild>
            <Link href={`/${agencySlug}/properties?status=DRAFT`}>{t("reviewDrafts")}</Link>
          </Button>
        ) : (
          <Button size="lg" asChild>
            <Link href={`/${agencySlug}/properties`}>{t("viewProperties")}</Link>
          </Button>
        )}
        {drafts && (
          <Button variant="outline" size="lg" asChild>
            <Link href={`/${agencySlug}/properties`}>{t("viewAll")}</Link>
          </Button>
        )}
        {published && done.create + done.update > 0 && (
          <Button variant="outline" size="lg" asChild>
            <a href={`${getPublicOrigin()}${sitePath(agencyPath(agencySlug))}`} target="_blank" rel="noopener noreferrer">
              {t("viewSite")}
              <ExternalLink />
            </a>
          </Button>
        )}
        <Button variant="ghost" size="lg" onClick={onReset}>
          {t("again")}
        </Button>
      </div>
    </div>
  );
}
