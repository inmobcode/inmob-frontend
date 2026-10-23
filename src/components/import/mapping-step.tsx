"use client";

import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ImportField, ImportTableInfo } from "@/lib/api/imports";
import { cn } from "@/lib/utils";

import { NONE } from "./import-shared";

function MappingSelect({
  header,
  value,
  fields,
  onChange,
}: {
  header: string;
  value: string | null;
  fields: ImportField[];
  onChange: (value: string) => void;
}) {
  const t = useTranslations("importer.mapping");
  return (
    <Select value={value ?? NONE} onValueChange={onChange}>
      <SelectTrigger
        size="sm"
        className={cn("w-full", value === null && "text-muted-foreground")}
        aria-label={t("fieldFor", { header })}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>{t("skip")}</SelectItem>
        {fields.map((field) => (
          <SelectItem key={field.key} value={field.key}>
            {field.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function MappingStep({
  table,
  mapping,
  fields,
  onChange,
  loading,
  onBack,
  onContinue,
}: {
  table: ImportTableInfo;
  mapping: Record<string, string | null>;
  fields: ImportField[];
  onChange: (header: string, value: string) => void;
  loading: boolean;
  onBack: () => void;
  onContinue: () => void;
}) {
  const t = useTranslations("importer.mapping");
  const mappedCount = Object.values(mapping).filter(Boolean).length;
  const detected = Object.values(table.mapping).filter(Boolean).length;
  const total = table.headers.length;
  const hasReference = Object.values(mapping).includes("external_id");

  const sample = (header: string) => {
    const index = table.headers.indexOf(header);
    return table.sample.slice(0, 2).map((row) => row[index]).filter(Boolean).join(" · ") || "—";
  };

  // Ordered by what we recognized at first, not by the live choices, so rows don't jump while editing.
  const recognized = (header: string) => (table.mapping[header] ? 1 : 0);
  const headers = [...table.headers].sort((a, b) => recognized(a) - recognized(b));
  const unassigned = headers.filter((header) => !mapping[header]).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("lead", { rows: table.totalRows, detected, total })}
        </p>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {t("status", { mapped: mappedCount, unassigned })}
        </p>
      </div>

      <div className="hidden overflow-x-auto rounded-2xl bg-card ring-1 ring-foreground/5 md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("column")}</TableHead>
              <TableHead>{t("examples")}</TableHead>
              <TableHead className="w-72">{t("field")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {headers.map((header) => (
              <TableRow key={header}>
                <TableCell className="font-medium">{header}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{sample(header)}</TableCell>
                <TableCell>
                  <MappingSelect
                    header={header}
                    value={mapping[header] ?? null}
                    fields={fields}
                    onChange={(value) => onChange(header, value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {headers.map((header) => (
          <li key={header} className="flex flex-col gap-2 rounded-2xl bg-card p-4 ring-1 ring-foreground/5">
            <span className="font-medium break-words">{header}</span>
            <span className="truncate text-xs text-muted-foreground">{sample(header)}</span>
            <MappingSelect
              header={header}
              value={mapping[header] ?? null}
              fields={fields}
              onChange={(value) => onChange(header, value)}
            />
          </li>
        ))}
      </ul>

      {!hasReference && (
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-highlight" />
          {t("noReference")}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="lg" onClick={onBack}>
          {t("back")}
        </Button>
        <Button size="lg" disabled={mappedCount === 0 || loading} onClick={onContinue}>
          {loading && <LoaderCircle className="animate-spin" />}
          {t("preview")}
        </Button>
        {mappedCount === 0 && <span className="text-xs text-muted-foreground">{t("atLeastOne")}</span>}
      </div>
    </div>
  );
}
