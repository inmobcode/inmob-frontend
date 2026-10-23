"use client";

import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { PropertiesPagination } from "@/components/properties/properties-pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ImportAction, ImportPreview } from "@/lib/api/imports";
import { cn } from "@/lib/utils";

import type { LooseTranslator } from "@/i18n/loose";

import { ACTION_CLASS, ROWS_PER_PAGE, describeChanges } from "./import-shared";

type RowFilter = "all" | "problems" | ImportAction;

const CARDS: ImportAction[] = ["create", "update", "unchanged", "skip", "error"];

export function ReviewStep({
  preview,
  originName,
  publish,
  onPublish,
  archiveMissing,
  onArchiveMissing,
  refreshing,
  applying,
  importableCount,
  format,
  onBack,
  onApply,
}: {
  preview: ImportPreview;
  originName: string;
  publish: boolean;
  onPublish: (value: boolean) => void;
  archiveMissing: boolean;
  onArchiveMissing: (value: boolean) => void;
  /** The preview is being recomputed (the trash switch changed). */
  refreshing: boolean;
  applying: boolean;
  importableCount: number;
  format: "table" | "kyero" | "tivvo_xml";
  onBack: () => void;
  onApply: () => void;
}) {
  const t = useTranslations("importer.review");
  const tActions = useTranslations("importer.actions");
  const tc = useTranslations("common");
  const [filter, setFilter] = useState<RowFilter>("all");
  const [page, setPage] = useState(1);
  const [confirmTrash, setConfirmTrash] = useState(false);

  const busy = refreshing || applying;
  const shown = preview.rows.filter((row) => {
    if (filter === "all") return true;
    if (filter === "problems") return row.warnings.length > 0 || row.errors.length > 0;
    return row.action === filter;
  });
  const pageCount = Math.max(1, Math.ceil(shown.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paged = shown.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
  const trashing = archiveMissing ? preview.counts.trash : 0;

  function pick(next: RowFilter) {
    setFilter((current) => (current === next ? "all" : next));
    setPage(1);
  }

  function apply() {
    // Sending properties to the trash is the one destructive part: confirm it first.
    if (trashing > 0) setConfirmTrash(true);
    else onApply();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {CARDS.map((key) => {
          const count = preview.counts[key];
          const active = filter === key;
          const tone =
            count > 0 && key === "error"
              ? "bg-destructive/10 text-destructive ring-destructive/30"
              : count > 0 && key === "skip"
                ? "bg-highlight/15 ring-highlight/40"
                : "bg-card ring-foreground/5";
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => pick(key)}
              className={cn(
                "flex flex-col gap-1 rounded-2xl p-4 text-left ring-1 transition-shadow outline-none hover:ring-foreground/25 focus-visible:ring-3 focus-visible:ring-ring/50",
                tone,
                active && "ring-2 ring-primary hover:ring-primary",
              )}
            >
              <span className="font-display text-3xl">{count}</span>
              <span className={cn("text-sm", tone.includes("text-destructive") ? "text-destructive" : "text-muted-foreground")}>
                {t(`cards.${key}`)}
              </span>
            </button>
          );
        })}
        <div className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-foreground/5">
          <span className="font-display text-3xl">{preview.counts.trash}</span>
          <span className="text-sm text-muted-foreground">{t("cards.trash")}</span>
        </div>
      </div>

      {preview.warnings.map((warning) => (
        <p key={warning} className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-highlight" />
          {warning}
        </p>
      ))}

      <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/5">
        <label className="flex items-center justify-between gap-4">
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{t("publish")}</span>
            <span className="text-xs text-muted-foreground">{t("publishHint")}</span>
          </span>
          <Switch checked={publish} disabled={applying} onCheckedChange={onPublish} />
        </label>
        <label className="flex items-center justify-between gap-4">
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{t("archive")}</span>
            <span className="text-xs text-muted-foreground">{t("archiveHint", { origin: originName })}</span>
          </span>
          <span className="flex items-center gap-2">
            {refreshing && <LoaderCircle className="size-4 animate-spin text-muted-foreground" aria-label={t("refreshing")} />}
            <Switch checked={archiveMissing} disabled={busy} onCheckedChange={onArchiveMissing} />
          </span>
        </label>
        {archiveMissing && preview.missing.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {t("goingToTrash", {
              titles: preview.missing.map((item) => item.title).join(", "),
              more: preview.counts.trash - preview.missing.length,
            })}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl">{t("rows")}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={filter === "problems" ? "default" : "outline"}
            aria-pressed={filter === "problems"}
            onClick={() => pick("problems")}
          >
            {t("problems")}
          </Button>
          {filter !== "all" && (
            <Button size="sm" variant="ghost" onClick={() => pick("all")}>
              {t("all")}
            </Button>
          )}
        </div>
      </div>

      <div className={cn("flex flex-col gap-6 transition-opacity", refreshing && "pointer-events-none opacity-50")} aria-busy={refreshing}>
        <div className="hidden overflow-x-auto rounded-2xl bg-card ring-1 ring-foreground/5 md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t("columns.row")}</TableHead>
                <TableHead className="w-32">{t("columns.status")}</TableHead>
                <TableHead>{t("columns.property")}</TableHead>
                <TableHead>{t("columns.detail")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((row) => (
                <TableRow key={row.row}>
                  <TableCell className="text-muted-foreground">{row.row}</TableCell>
                  <TableCell>
                    <Badge className={ACTION_CLASS[row.action]}>{tActions(row.action)}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="block truncate font-medium">{row.title ?? t("untitled")}</span>
                    {row.externalId && <span className="text-xs text-muted-foreground">{row.externalId}</span>}
                  </TableCell>
                  <TableCell className="max-w-md text-sm whitespace-normal text-muted-foreground">
                    <RowDetail row={row} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <ul className="flex flex-col gap-3 md:hidden">
          {paged.map((row) => (
            <li key={row.row} className="flex flex-col gap-2 rounded-2xl bg-card p-4 ring-1 ring-foreground/5">
              <div className="flex items-center justify-between gap-3">
                <Badge className={ACTION_CLASS[row.action]}>{tActions(row.action)}</Badge>
                <span className="text-xs text-muted-foreground">{t("row", { row: row.row })}</span>
              </div>
              <span className="font-medium break-words">{row.title ?? t("untitled")}</span>
              {row.externalId && <span className="text-xs text-muted-foreground">{row.externalId}</span>}
              <div className="text-sm text-muted-foreground">
                <RowDetail row={row} />
              </div>
            </li>
          ))}
        </ul>

        <PropertiesPagination page={safePage} pageCount={pageCount} onChange={setPage} />
        {shown.length === 0 && (
          <p className="text-sm text-muted-foreground" role="status">
            {filter === "problems" ? t("noProblems") : t("noRows")}
          </p>
        )}
        {preview.rows.length < Object.values(preview.counts).slice(0, 5).reduce((sum, value) => sum + value, 0) && (
          <p className="text-xs text-muted-foreground">
            {t("partial", { count: preview.rows.length })}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="lg" disabled={busy} onClick={onBack}>
            {t("back")}
          </Button>
          <Button size="lg" disabled={busy || (importableCount === 0 && preview.counts.trash === 0)} onClick={apply}>
            {applying && <LoaderCircle className="animate-spin" />}
            {applying ? t("importing") : importableCount > 0 ? t("import", { count: importableCount }) : t("apply")}
          </Button>
        </div>
        {applying && (
          <p className="text-sm text-muted-foreground" role="status">
            {format === "table" ? t("savingTable") : t("savingFeed")} {t("savingWait")}
          </p>
        )}
      </div>

      <AlertDialog open={confirmTrash} onOpenChange={setConfirmTrash}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("confirm.title", { count: trashing })}
            </AlertDialogTitle>
            <AlertDialogDescription>{t("confirm.body")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmTrash(false);
                onApply();
              }}
            >
              {t("confirm.action")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RowDetail({ row }: { row: ImportPreview["rows"][number] }) {
  const t = useTranslations("importer.review");
  const tChanges = useTranslations("importer.changes");
  return (
    <>
      {row.errors.map((message) => (
        <span key={message} className="block text-destructive">
          {message}
        </span>
      ))}
      {row.warnings.map((message) => (
        <span key={message} className="block">
          {message}
        </span>
      ))}
      {row.action === "update" && (
        <span className="block">
          {t("changes", {
            fields: describeChanges(row.changes, tChanges as unknown as LooseTranslator & { has(key: string): boolean }),
          })}
        </span>
      )}
    </>
  );
}
