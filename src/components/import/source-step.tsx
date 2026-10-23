"use client";

import { Download, ExternalLink, LoaderCircle, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ImportFormat } from "@/lib/api/imports";
import { TIVVO_XML_EXAMPLE, type Guide } from "@/lib/import-guides";
import type { ImportPlatform } from "@/lib/import-platforms";
import { cn } from "@/lib/utils";

import { ImportHelp } from "./import-help";
import { ACCEPT, URL_PLACEHOLDER, downloadCsvTemplate, fileProblem, urlProblem } from "./import-shared";
import { PlatformLogo } from "./platform-picker";

interface SourceStepProps {
  guide: Guide;
  baseGuide: Guide | null;
  platform: ImportPlatform | null;
  originName: string;
  format: ImportFormat;
  routeOverridden: boolean;
  byUrl: boolean;
  onByUrl: (value: boolean) => void;
  url: string;
  onUrl: (value: string) => void;
  file: File | null;
  onFile: (file: File | null) => void;
  busy: boolean;
  loading: boolean;
  onChangeRoute: (format: ImportFormat | null) => void;
  onContinue: () => void;
}

export function SourceStep({
  guide,
  baseGuide,
  platform,
  originName,
  format,
  routeOverridden,
  byUrl,
  onByUrl,
  url,
  onUrl,
  file,
  onFile,
  busy,
  loading,
  onChangeRoute,
  onContinue,
}: SourceStepProps) {
  const t = useTranslations("importer");
  const errorId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [urlTouched, setUrlTouched] = useState(false);

  const urlErrorKey = urlProblem(url);
  const urlError = urlErrorKey && t(`problems.${urlErrorKey}`);
  const showUrlError = urlError !== null && (urlTouched || url.trim().length > 12);
  const hasInput = byUrl ? url.trim().length > 0 && urlError === null : file !== null;
  const hint = hasInput ? null : byUrl ? t("source.urlHint") : t("source.fileHint");

  function take(next: File | null) {
    if (!next) return;
    const problem = fileProblem(next, format);
    setFileError(problem && t(`problems.${problem}`));
    if (problem) {
      onFile(null);
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    onFile(next);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    take(event.dataTransfer.files?.[0] ?? null);
  }

  function clearFile() {
    onFile(null);
    setFileError(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            {platform && <PlatformLogo platform={platform} size={40} />}
            <h2 className="font-display text-2xl">{guide.title}</h2>
          </div>

          {guide.note && <p className="text-sm text-muted-foreground">{guide.note}</p>}

          <ol className="flex flex-col gap-3">
            {guide.steps.map((text, index) => (
              <li key={text} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-primary">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed">{text}</span>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {format === "table" && (
              <button
                type="button"
                onClick={downloadCsvTemplate}
                className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
              >
                <Download className="size-3.5" />
                {t("source.template")}
              </button>
            )}
            {guide.sources?.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
              >
                {item.label}
                <ExternalLink className="size-3.5" />
              </a>
            ))}
            {baseGuide?.alternative && !routeOverridden && (
              <button
                type="button"
                onClick={() => onChangeRoute(baseGuide.alternative!.format)}
                className="text-primary underline-offset-4 hover:underline"
              >
                {baseGuide.alternative.label}
              </button>
            )}
            {routeOverridden && (
              <button
                type="button"
                onClick={() => onChangeRoute(null)}
                className="text-primary underline-offset-4 hover:underline"
              >
                {t("source.recommended")}
              </button>
            )}
          </div>

          {format === "tivvo_xml" && (
            <details className="text-sm">
              <summary className="cursor-pointer text-primary">{t("source.xmlExample")}</summary>
              <pre className="mt-3 max-h-80 overflow-auto rounded-2xl bg-foreground/[0.07] p-4 text-xs leading-relaxed dark:bg-foreground/10">
                {TIVVO_XML_EXAMPLE}
              </pre>
            </details>
          )}

          <ImportHelp originName={originName} support={guide.support} />
        </section>

        <aside className="flex h-fit flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/5 lg:sticky lg:top-8">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-display text-lg">{t("source.title")}</h3>
            <p className="text-xs text-muted-foreground">{t(`formats.${format}`)}</p>
          </div>
          <Tabs value={byUrl ? "url" : "file"} onValueChange={(value) => onByUrl(value === "url")}>
            <TabsList className="w-full">
              <TabsTrigger value="file">
                <Upload />
                {t("source.upload")}
              </TabsTrigger>
              <TabsTrigger value="url">{t("source.useUrl")}</TabsTrigger>
            </TabsList>
          </Tabs>

          {byUrl ? (
            <div className="flex flex-col gap-2">
              <Input
                value={url}
                onChange={(event) => onUrl(event.target.value)}
                onBlur={() => setUrlTouched(true)}
                placeholder={URL_PLACEHOLDER[format]}
                inputMode="url"
                aria-label="URL"
                aria-invalid={showUrlError}
                aria-describedby={showUrlError ? errorId : undefined}
              />
              {showUrlError ? (
                <p id={errorId} role="alert" className="text-xs text-destructive">
                  {urlError}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {t("source.urlNote")}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed px-4 py-9 text-center transition-colors hover:bg-muted/40 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                  dragging ? "border-primary bg-primary/5" : "border-foreground/20",
                )}
              >
                <Upload className="size-6 text-primary" />
                <span className="text-sm font-medium break-all">
                  {file ? file.name : dragging ? t("source.drop") : t("source.drag")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format === "table" ? t("source.tableLimits") : t("source.xmlLimits")}
                </span>
                <input
                  ref={fileInput}
                  type="file"
                  accept={ACCEPT[format]}
                  className="sr-only"
                  aria-describedby={fileError ? errorId : undefined}
                  onChange={(event) => take(event.target.files?.[0] ?? null)}
                />
              </label>
              {file && (
                <Button variant="ghost" size="sm" className="w-fit" onClick={clearFile}>
                  <X />
                  {t("source.removeFile")}
                </Button>
              )}
              {fileError && (
                <p id={errorId} role="alert" className="text-xs text-destructive">
                  {fileError}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button size="lg" disabled={!hasInput || busy} onClick={onContinue}>
              {loading && <LoaderCircle className="animate-spin" />}
              {loading ? t("source.reading") : t("source.continue")}
            </Button>
            {hint && <p className="text-center text-xs text-muted-foreground">{hint}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
