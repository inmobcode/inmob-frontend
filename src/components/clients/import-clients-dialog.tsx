"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileSpreadsheet, LoaderCircle, Upload } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Locale } from "@/i18n/config";
import { ApiError } from "@/lib/api/client";
import { createClient, listClients } from "@/lib/api/clients";
import { getAccessToken } from "@/lib/auth/session";
import {
  IMPORT_FIELDS,
  MAX_IMPORT_BYTES,
  MAX_IMPORT_ROWS,
  planImport,
  suggestMapping,
  type ColumnMapping,
  type ImportField,
  type ImportRow,
} from "@/lib/clients-import";
import { csvSeparator, downloadCsv, parseCsv, toCsv } from "@/lib/csv";

/** How many clients are created at once: quick enough for a thousand rows, gentle on the API. */
const CONCURRENCY = 4;
const NOT_IN_FILE = "__none__";
const PROBLEMS_SHOWN = 5;

type FileError = "type" | "size" | "empty" | "tooMany" | "unreadable";

interface Loaded {
  filename: string;
  headers: string[];
  rows: string[][];
}

interface Outcome {
  created: number;
  skipped: number;
  failed: number;
}

/**
 * Brings clients in from a CSV: pick the file, check which column is which,
 * see what will happen, then create them one by one (the API has no bulk
 * endpoint). Rows whose email is already an agency client are skipped.
 */
export function ImportClientsDialog({ variant = "icon" }: { variant?: "icon" | "button" }) {
  const t = useTranslations("clients.import");
  const tColumns = useTranslations("clients.export.columns");
  const tCreate = useTranslations("clients.create");
  const locale = useLocale() as Locale;
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<FileError | null>(null);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // Same query as the clients page, so opening the dialog costs nothing there.
  const { data: existing } = useQuery({
    queryKey: ["clients"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listClients(token);
    },
    enabled: open,
  });

  const plan = useMemo(() => {
    if (!loaded || !mapping) return null;
    const emails = new Set((existing ?? []).map((client) => client.email.toLowerCase()));
    return planImport(loaded.rows.slice(1), mapping, emails);
  }, [loaded, mapping, existing]);

  const fieldLabel = (field: ImportField) => tColumns(field);
  const importing = progress !== null;
  const missingRequired = mapping !== null && (mapping.name === null || mapping.email === null);

  function reset() {
    setFileError(null);
    setLoaded(null);
    setMapping(null);
    setProgress(null);
    setOutcome(null);
    setDragging(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleOpenChange(next: boolean) {
    // Closing would leave half a list created with nobody watching.
    if (!next && importing) return;
    setOpen(next);
    if (!next) reset();
  }

  async function readFile(file: File | undefined) {
    if (!file) return;
    setFileError(null);
    if (!/\.(csv|txt)$/i.test(file.name) && !file.type.includes("csv")) return setFileError("type");
    if (file.size > MAX_IMPORT_BYTES) return setFileError("size");
    let rows: string[][];
    try {
      rows = parseCsv(await file.text());
    } catch {
      return setFileError("unreadable");
    }
    if (rows.length < 2) return setFileError("empty");
    if (rows.length - 1 > MAX_IMPORT_ROWS) return setFileError("tooMany");
    setLoaded({ filename: file.name, headers: rows[0], rows });
    setMapping(
      suggestMapping(rows[0], {
        name: tColumns("name"),
        email: tColumns("email"),
        phone: tColumns("phone"),
        notes: tColumns("notes"),
      }),
    );
  }

  function downloadTemplate() {
    const header = IMPORT_FIELDS.map((field) => fieldLabel(field));
    const example = [tCreate("namePlaceholder"), tCreate("emailPlaceholder"), tCreate("phonePlaceholder"), ""];
    downloadCsv(toCsv([header, example], csvSeparator(locale)), `${t("templateFilename")}.csv`);
  }

  async function start() {
    const token = getAccessToken();
    if (!plan || !token) return;
    const queue: ImportRow[] = [...plan.rows];
    const result: Outcome = { created: 0, skipped: plan.duplicates.length, failed: 0 };
    setProgress({ done: 0, total: queue.length });

    async function worker() {
      for (let row = queue.shift(); row; row = queue.shift()) {
        try {
          await createClient(token!, { name: row.name, email: row.email, phone: row.phone, notes: row.notes });
          result.created += 1;
        } catch (err) {
          // 409: the email is taken (also by a client in the trash).
          if (err instanceof ApiError && err.status === 409) result.skipped += 1;
          else result.failed += 1;
        }
        setProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : prev));
      }
    }
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));

    queryClient.invalidateQueries({ queryKey: ["clients"] });
    setProgress(null);
    setOutcome(result);
    if (result.created > 0) toast.success(t("result.created", { count: result.created }));
  }

  const trigger =
    variant === "button" ? (
      <Button variant="outline" className="h-10 gap-2 px-5" onClick={() => setOpen(true)}>
        <Upload />
        {t("label")}
      </Button>
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("label")}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-foreground/10 dark:hover:bg-foreground/15"
          >
            <Upload className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={10}>
          {t("label")}
        </TooltipContent>
      </Tooltip>
    );

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-xl" showCloseButton={!importing}>
          <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">
              {outcome ? t("doneTitle") : t("title")}
            </DialogTitle>
            <DialogDescription>{outcome ? t("doneDescription") : t("description")}</DialogDescription>
          </div>

          <div className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto px-7 pb-2">
            {outcome && (
              <ul className="flex flex-col gap-1.5 text-sm" role="status">
                <li className="font-medium">{t("result.created", { count: outcome.created })}</li>
                {outcome.skipped > 0 && <li>{t("result.skipped", { count: outcome.skipped })}</li>}
                {plan && plan.invalid.length > 0 && <li>{t("summary.invalid", { count: plan.invalid.length })}</li>}
                {outcome.failed > 0 && <li className="text-destructive">{t("result.failed", { count: outcome.failed })}</li>}
              </ul>
            )}

            {!outcome && !loaded && (
              <>
                <label
                  htmlFor="clients-csv"
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    readFile(event.dataTransfer.files[0]);
                  }}
                  className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center transition-colors focus-within:ring-3 focus-within:ring-ring/50 hover:bg-muted/50 ${
                    dragging ? "border-primary bg-muted/50" : "border-border"
                  }`}
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
                    <FileSpreadsheet className="size-5" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{t("drop")}</span>
                    <span className="text-sm text-muted-foreground">{t("dropHint", { max: MAX_IMPORT_ROWS })}</span>
                  </span>
                  <input
                    ref={inputRef}
                    id="clients-csv"
                    type="file"
                    accept=".csv,.txt,text/csv"
                    className="sr-only"
                    onChange={(event) => readFile(event.target.files?.[0])}
                  />
                </label>
                {fileError && (
                  <p role="alert" className="text-sm text-destructive">
                    {t(`errors.${fileError}`, { max: MAX_IMPORT_ROWS })}
                  </p>
                )}
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="w-fit rounded-sm text-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {t("template")}
                </button>
              </>
            )}

            {!outcome && loaded && mapping && plan && (
              <>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-4 py-3 text-sm">
                  <span className="min-w-0 truncate">
                    <strong className="font-medium">{loaded.filename}</strong>
                    <span className="text-muted-foreground"> · {t("rows", { count: loaded.rows.length - 1 })}</span>
                  </span>
                  <button
                    type="button"
                    onClick={reset}
                    disabled={importing}
                    className="shrink-0 rounded-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                  >
                    {t("changeFile")}
                  </button>
                </div>

                <fieldset className="flex flex-col gap-3" disabled={importing}>
                  <legend className="mb-1 text-sm text-muted-foreground">{t("columnsHelp")}</legend>
                  {IMPORT_FIELDS.map((field) => (
                    <div key={field} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-3">
                      <Label id={`map-${field}`}>
                        {fieldLabel(field)}
                        {(field === "name" || field === "email") && (
                          <span className="font-normal text-muted-foreground"> · {t("required")}</span>
                        )}
                      </Label>
                      <Select
                        value={mapping[field] === null ? NOT_IN_FILE : String(mapping[field])}
                        onValueChange={(value) =>
                          setMapping({ ...mapping, [field]: value === NOT_IN_FILE ? null : Number(value) })
                        }
                      >
                        <SelectTrigger aria-labelledby={`map-${field}`} className="h-10 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NOT_IN_FILE}>{t("notInFile")}</SelectItem>
                          {loaded.headers.map((header, index) => (
                            <SelectItem key={index} value={String(index)}>
                              {header.trim() || t("untitledColumn", { number: index + 1 })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </fieldset>

                {missingRequired ? (
                  <p role="alert" className="text-sm text-destructive">
                    {t("missingRequired")}
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 text-sm" role="status">
                    <p className="font-medium">{t("summary.ready", { count: plan.rows.length })}</p>
                    {plan.duplicates.length > 0 && (
                      <p className="text-muted-foreground">{t("summary.duplicates", { count: plan.duplicates.length })}</p>
                    )}
                    {plan.invalid.length > 0 && (
                      <div className="flex flex-col gap-1 text-muted-foreground">
                        <p>{t("summary.invalid", { count: plan.invalid.length })}</p>
                        <ul className="flex flex-col gap-0.5 pl-4">
                          {plan.invalid.slice(0, PROBLEMS_SHOWN).map((item) => (
                            <li key={item.line} className="list-disc">
                              {t("line", { line: item.line })}: {t(`problem.${item.problem}`)}
                            </li>
                          ))}
                          {plan.invalid.length > PROBLEMS_SHOWN && (
                            <li className="list-none">{t("moreProblems", { count: plan.invalid.length - PROBLEMS_SHOWN })}</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 px-7 pt-5 pb-7">
            {outcome ? (
              <Button type="button" variant="highlight" className="h-10 px-6" onClick={() => handleOpenChange(false)}>
                {t("close")}
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" className="h-10 px-5" disabled={importing} onClick={() => handleOpenChange(false)}>
                  {t("cancel")}
                </Button>
                {loaded && (
                  <Button
                    type="button"
                    variant="highlight"
                    className="h-10 gap-2 px-6"
                    disabled={importing || missingRequired || !plan || plan.rows.length === 0}
                    onClick={start}
                  >
                    {progress ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        {t("importing", { done: progress.done, total: progress.total })}
                      </>
                    ) : (
                      t("start", { count: plan?.rows.length ?? 0 })
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
