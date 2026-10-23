import { apiFetch } from "./client";

/** How the data arrives: a spreadsheet with mapped columns, a Kyero XML feed, or Tivvu's own XML. */
export type ImportFormat = "table" | "kyero" | "tivvu_xml";

export type ImportAction = "create" | "update" | "unchanged" | "skip" | "error";

export interface ImportField {
  key: string;
  label: string;
  kind: string;
}

/** Everything one import call needs; preview and apply take the same input. */
export interface ImportInput {
  format: ImportFormat;
  file?: File | null;
  url?: string;
  /** Platform slug the properties are tagged with, so re-importing updates them. */
  source?: string;
  /** Spreadsheet header → field key (null = don't import that column). */
  mapping?: Record<string, string | null>;
  archiveMissing?: boolean;
  publish?: boolean;
}

export interface ImportTableInfo {
  headers: string[];
  mapping: Record<string, string | null>;
  suggested: Record<string, string | null>;
  sample: string[][];
  totalRows: number;
}

export interface ImportRowResult {
  row: number;
  action: ImportAction;
  externalId?: string | null;
  title?: string | null;
  changes: string[];
  warnings: string[];
  errors: string[];
}

export interface ImportPreview {
  counts: Record<ImportAction | "trash", number>;
  warnings: string[];
  rows: ImportRowResult[];
  missing: { id: string; title: string; externalId: string }[];
  table: ImportTableInfo | null;
}

export interface ImportResult {
  done: { create: number; update: number; failed: number; trash: number };
  failures: { row: number; externalId?: string | null; error: string }[];
  counts: ImportPreview["counts"];
}

function toForm(input: ImportInput): FormData {
  const form = new FormData();
  form.set("format", input.format);
  if (input.file) form.set("file", input.file);
  if (input.url?.trim()) form.set("url", input.url.trim());
  if (input.source) form.set("source", input.source);
  if (input.mapping) form.set("mapping", JSON.stringify(input.mapping));
  if (input.archiveMissing) form.set("archiveMissing", "true");
  if (input.publish) form.set("publish", "true");
  return form;
}

export function listImportFields(token: string) {
  return apiFetch<ImportField[]>("/api/imports/fields", { token });
}

export function previewImport(token: string, input: ImportInput) {
  return apiFetch<ImportPreview>("/api/imports/preview", { token, method: "POST", body: toForm(input) });
}

export function applyImport(token: string, input: ImportInput) {
  return apiFetch<ImportResult>("/api/imports/apply", { token, method: "POST", body: toForm(input) });
}
