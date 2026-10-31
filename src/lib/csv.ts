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

/** Picks the separator the file uses by counting each candidate in its first line, outside quotes. */
export function detectCsvSeparator(text: string) {
  const counts: Record<string, number> = { ",": 0, ";": 0, "\t": 0 };
  let quoted = false;
  for (const char of text) {
    if (char === '"') quoted = !quoted;
    else if (!quoted && (char === "\n" || char === "\r")) break;
    else if (!quoted && char in counts) counts[char] += 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * CSV text to rows of cells: quoted cells (with "" for a quote and line breaks
 * inside), either line ending, a BOM up front, and the separator guessed from
 * the first line. Rows with nothing in them are dropped.
 */
export function parseCsv(text: string): string[][] {
  const source = text.replace(/^﻿/, "");
  const separator = detectCsvSeparator(source);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  function endCell() {
    row.push(cell);
    cell = "";
  }
  function endRow() {
    endCell();
    if (row.some((value) => value.trim() !== "")) rows.push(row);
    row = [];
  }

  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char !== '"') cell += char;
      else if (source[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === separator) endCell();
    else if (char === "\n") endRow();
    else if (char === "\r") {
      if (source[i + 1] === "\n") i += 1;
      endRow();
    } else cell += char;
  }
  if (cell !== "" || row.length > 0) endRow();
  return rows;
}
