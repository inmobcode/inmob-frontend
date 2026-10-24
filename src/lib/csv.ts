import type { Locale } from "@/i18n/config";

type Cell = string | number | null | undefined;

/**
 * Excel splits on the list separator of the system's region: a comma where
 * decimals use a point (English), a semicolon where they use a comma (the rest
 * of our languages). Google Sheets and Numbers read either.
 */
export function csvSeparator(locale: Locale) {
  return locale === "en" ? "," : ";";
}

/** Numbers and phone numbers ("+54 9 11…") are safe to start with + or -. */
const NUMERIC = /^[+\d\s().-]+$/;

/**
 * One cell, quoted. Text that a spreadsheet would run as a formula (=, +, -, @)
 * gets a leading apostrophe: what comes from the public site's forms is not ours.
 */
export function csvCell(value: Cell) {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text) && !NUMERIC.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** Rows to CSV text, with a BOM so Excel reads accents as UTF-8. */
export function toCsv(rows: Cell[][], separator = ",") {
  return "﻿" + rows.map((row) => row.map(csvCell).join(separator)).join("\r\n");
}

export function downloadCsv(content: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
