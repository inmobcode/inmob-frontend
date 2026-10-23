import { FileCode2, FileSpreadsheet, Workflow } from "lucide-react";

import type { LooseTranslator } from "@/i18n/loose";
import type { ImportAction, ImportFormat } from "@/lib/api/imports";
import { CSV_TEMPLATE } from "@/lib/import-guides";
import type { GenericOrigin } from "@/lib/import-guides";
import type { ImportPlatform, PlatformType } from "@/lib/import-platforms";

export type Step = "source" | "mapping" | "review" | "done";

export type Origin = { platform: ImportPlatform } | { generic: GenericOrigin };

export const NONE = "__none__";
export const ROWS_PER_PAGE = 20;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export const FORMAT_ICON: Record<ImportFormat, typeof FileSpreadsheet> = {
  table: FileSpreadsheet,
  kyero: FileCode2,
  tivvo_xml: Workflow,
};

export const TYPE_FILTERS: (PlatformType | "all")[] = ["all", "crm", "portal", "aggregator"];

export const URL_PLACEHOLDER: Record<ImportFormat, string> = {
  table: "https://tu-crm.com/export/propiedades.csv",
  kyero: "https://tu-crm.com/feeds/kyero.xml",
  tivvo_xml: "https://tu-sistema.com/feeds/tivvo.xml",
};

export const ACCEPT: Record<ImportFormat, string> = {
  table: ".csv,.xlsx,.xlsm,text/csv",
  kyero: ".xml,text/xml,application/xml",
  tivvo_xml: ".xml,text/xml,application/xml",
};

const EXTENSIONS: Record<ImportFormat, string[]> = {
  table: [".csv", ".xlsx", ".xlsm"],
  kyero: [".xml"],
  tivvo_xml: [".xml"],
};

// The actions' names are in "importer.actions".

export const ACTION_CLASS: Record<ImportAction, string> = {
  create: "bg-primary/10 text-primary",
  update: "bg-highlight/20 text-foreground",
  unchanged: "bg-foreground/[0.07] text-muted-foreground",
  skip: "bg-foreground/[0.07] text-muted-foreground",
  error: "bg-destructive/10 text-destructive",
};

/** "precio, fotos": what an update changes; `t` is scoped to "importer.changes". */
export function describeChanges(changes: string[], t: LooseTranslator & { has(key: string): boolean }) {
  // Latitude and longitude read as one change: the coordinates.
  const keys = changes.map((key) => (key === "lng" ? "lat" : key));
  return [...new Set(keys.map((key) => (t.has(key) ? t(key) : key)))].join(", ");
}

export const plain = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Why a picked file can't be imported (its key in "importer.problems"), or null when it can. Checked before the server sees it. */
export function fileProblem(file: File, format: ImportFormat) {
  const name = file.name.toLowerCase();
  if (!EXTENSIONS[format].some((ext) => name.endsWith(ext))) {
    return format === "table" ? "notTable" : "notXml";
  }
  if (file.size > MAX_FILE_BYTES) return "tooBig";
  return null;
}

/** Why a typed URL can't be imported (its key in "importer.problems"), or null when it looks fine. */
export function urlProblem(value: string) {
  const text = value.trim();
  if (!text) return null;
  try {
    const url = new URL(text);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "notHttps";
    if (!url.hostname.includes(".")) return "incomplete";
    return null;
  } catch {
    return "badUrl";
  }
}

function download(content: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadCsvTemplate() {
  download(CSV_TEMPLATE, "plantilla-propiedades-tivvo.csv");
}

const csvCell = (value: string | number | null | undefined) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export function downloadFailures(
  failures: { row: number; externalId?: string | null; error: string }[],
  headers: { row: string; reference: string; error: string; filename: string },
) {
  const lines = [[headers.row, headers.reference, headers.error].map(csvCell).join(",")];
  for (const item of failures) lines.push([item.row, item.externalId, item.error].map(csvCell).join(","));
  download(lines.join("\n"), headers.filename);
}
