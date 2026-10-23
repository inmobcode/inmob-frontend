"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { BackLink, backLinkClass } from "@/components/shared/back-link";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/client";
import {
  applyImport,
  listImportFields,
  previewImport,
  type ImportFormat,
  type ImportInput,
  type ImportPreview,
  type ImportResult,
} from "@/lib/api/imports";
import { getAccessToken, useRequireNonAgent } from "@/lib/auth/session";
import type { LooseTranslator } from "@/i18n/loose";
import { genericGuide, platformGuide, routeGuide, type Guide, type GenericOrigin } from "@/lib/import-guides";

import { DoneStep } from "./done-step";
import { NONE, type Origin, type Step } from "./import-shared";
import { LeaveGuard } from "./leave-guard";
import { MappingStep } from "./mapping-step";
import { PlatformPicker } from "./platform-picker";
import { ReviewStep } from "./review-step";
import { SourceStep } from "./source-step";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

export function ImportWizard() {
  useRequireNonAgent();
  const t = useTranslations("importer");
  const tGuides = useTranslations("importer.guides") as unknown as LooseTranslator;
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("source");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [override, setOverride] = useState<ImportFormat | null>(null);
  const [byUrl, setByUrl] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [mapping, setMapping] = useState<Record<string, string | null>>({});
  const [archiveMissing, setArchiveMissing] = useState(false);
  const [publish, setPublish] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  // What the finished import was run with, so the last screen doesn't change if a switch moves afterwards.
  const [publishedRun, setPublishedRun] = useState(false);

  const platform = origin && "platform" in origin ? origin.platform : null;
  const generic = origin && "generic" in origin ? (origin as { generic: GenericOrigin }).generic : null;
  const originName = platform ? platform.name : generic ? t(`generic.${generic.slug}.name`) : "";
  const baseGuide: Guide | null = platform ? platformGuide(tGuides, platform) : generic ? genericGuide(tGuides, generic) : null;
  const guide = baseGuide && override ? routeGuide(tGuides, override, baseGuide.source, originName) : baseGuide;
  const format: ImportFormat = guide?.format ?? "table";
  const source = guide?.source ?? "csv";

  const { data: fields } = useQuery({
    queryKey: ["imports", "fields"],
    queryFn: () => listImportFields(requireToken()),
    staleTime: Infinity,
  });

  function buildInput(overrides: Partial<ImportInput> = {}): ImportInput {
    return {
      format,
      file: byUrl ? null : file,
      url: byUrl ? url : undefined,
      source,
      mapping: format === "table" ? mapping : undefined,
      archiveMissing,
      publish,
      ...overrides,
    };
  }

  const previewMutation = useMutation({
    mutationFn: (input: ImportInput) => previewImport(requireToken(), input),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("wizard.readFailed")),
  });

  const applyMutation = useMutation({
    mutationFn: (input: ImportInput) => applyImport(requireToken(), input),
    onSuccess: (data, input) => {
      setResult(data);
      setPublishedRun(Boolean(input.publish));
      setStep("done");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("wizard.importFailed")),
  });

  function clearInput() {
    setFile(null);
    setUrl("");
  }

  function chooseOrigin(next: Origin | null) {
    setOrigin(next);
    setOverride(null);
    setByUrl(true);
    setPreview(null);
    clearInput();
  }

  function changeRoute(next: ImportFormat | null) {
    setOverride(next);
    setByUrl(true);
    setPreview(null);
    clearInput();
  }

  function readFile() {
    previewMutation.mutate(buildInput({ mapping: undefined, archiveMissing: false }), {
      onSuccess: (data) => {
        setPreview(data);
        setArchiveMissing(false);
        if (format === "table" && data.table) {
          setMapping(data.table.mapping);
          setStep("mapping");
        } else {
          setStep("review");
        }
      },
    });
  }

  function refreshPreview(overrides: Partial<ImportInput> = {}, onError?: () => void) {
    previewMutation.mutate(buildInput(overrides), {
      onSuccess: (data) => {
        setPreview(data);
        setStep("review");
      },
      onError,
    });
  }

  function changeMapping(header: string, value: string) {
    setMapping((current) => {
      const next = { ...current };
      const key = value === NONE ? null : value;
      // A field comes from a single column: picking it here frees it elsewhere.
      if (key) for (const other of Object.keys(next)) if (next[other] === key) next[other] = null;
      next[header] = key;
      return next;
    });
  }

  function changeArchiveMissing(checked: boolean) {
    setArchiveMissing(checked);
    refreshPreview({ archiveMissing: checked }, () => setArchiveMissing(!checked));
  }

  function reset() {
    setStep("source");
    setResult(null);
    setArchiveMissing(false);
    setPublish(false);
    chooseOrigin(null);
  }

  const busy = previewMutation.isPending || applyMutation.isPending;
  const importable = preview ? preview.counts.create + preview.counts.update : 0;
  // Nothing is saved until the last step: warn before walking away from a read file.
  const leaving = (preview !== null && step !== "done" && step !== "source") || applyMutation.isPending;

  return (
    <div className="flex flex-col gap-8">
      <LeaveGuard active={leaving} />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
          <BackLink href={`/${agencySlug}/properties`}>{t("wizard.back")}</BackLink>
          {step === "source" && guide && (
            <>
              <span aria-hidden className="h-4 w-px bg-foreground/15" />
              <button
                type="button"
                onClick={() => chooseOrigin(null)}
                className={cn(backLinkClass, "ml-0")}
              >
                {t("wizard.otherPlatform")}
              </button>
            </>
          )}
        </div>
        {/* Each step names itself; the page title stays for screen readers only. */}
        <h1 className="sr-only">{t("wizard.title")}</h1>
      </div>

      {step === "source" && !guide && <PlatformPicker onPick={chooseOrigin} />}

      {step === "source" && guide && (
        <SourceStep
          guide={guide}
          baseGuide={baseGuide}
          platform={platform}
          originName={originName}
          format={format}
          routeOverridden={override !== null}
          byUrl={byUrl}
          onByUrl={setByUrl}
          url={url}
          onUrl={setUrl}
          file={file}
          onFile={setFile}
          busy={busy}
          loading={previewMutation.isPending}
          onChangeRoute={changeRoute}
          onContinue={readFile}
        />
      )}

      {step === "mapping" && preview?.table && (
        <MappingStep
          table={preview.table}
          mapping={mapping}
          fields={fields ?? []}
          onChange={changeMapping}
          loading={previewMutation.isPending}
          onBack={() => setStep("source")}
          onContinue={() => refreshPreview()}
        />
      )}

      {step === "review" && preview && (
        <ReviewStep
          preview={preview}
          originName={originName}
          publish={publish}
          onPublish={setPublish}
          archiveMissing={archiveMissing}
          onArchiveMissing={changeArchiveMissing}
          refreshing={previewMutation.isPending}
          applying={applyMutation.isPending}
          importableCount={importable}
          format={format}
          onBack={() => setStep(format === "table" ? "mapping" : "source")}
          onApply={() => applyMutation.mutate(buildInput())}
        />
      )}

      {step === "done" && result && (
        <DoneStep result={result} agencySlug={agencySlug} published={publishedRun} onReset={reset} />
      )}
    </div>
  );
}
