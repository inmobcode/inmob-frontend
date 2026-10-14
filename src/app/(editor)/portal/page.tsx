"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ExternalLink,
  Eye,
  LoaderCircle,
  Monitor,
  PenLine,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  type Draft,
  HEX,
  type SetDraft,
  sameDraft,
  toDraft,
  toPayload,
} from "@/components/portal-editor/draft";
import {
  AgencyPanel,
  BlocksPanel,
  CoverPanel,
  DesignPanel,
} from "@/components/portal-editor/panels";
import {
  SitePreview,
  type Viewport,
} from "@/components/portal-editor/site-preview";
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
import { Button } from "@/components/ui/button";
import { getAgency, updateSite, uploadAgencyCover } from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import { listPublicProperties } from "@/lib/api/properties";
import { getAccessToken, getAgencySlug, useRequireNonAgent } from "@/lib/auth/session";
import { compressToWebp } from "@/lib/image-compression";
import { resolveSite } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

type Tab = "design" | "cover" | "blocks" | "agency";

const TABS: { value: Tab; label: string }[] = [
  { value: "design", label: "Diseño" },
  { value: "cover", label: "Portada" },
  { value: "blocks", label: "Bloques" },
  { value: "agency", label: "Agencia y contacto" },
];

const VIEWPORTS: { value: Viewport; label: string; icon: typeof Monitor }[] = [
  { value: "desktop", label: "Escritorio", icon: Monitor },
  { value: "mobile", label: "Celular", icon: Smartphone },
];

/**
 * The portal editor, full screen like a site builder: settings in tabs on the
 * left, the live page on the right, and its own bar with save and exit. The
 * dashboard's sidebar stays out of the way while the agency designs.
 */
export default function PortalEditorPage() {
  useRequireNonAgent();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("design");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  // Below the large breakpoint there's no room for both; this toggles which one shows.
  const [showPreview, setShowPreview] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  const { data: agency, isLoading } = useQuery({
    queryKey: ["agency"],
    queryFn: () => getAgency(requireToken()),
  });
  const { data: properties = [] } = useQuery({
    queryKey: ["public-properties", agency?.slug],
    queryFn: () => listPublicProperties(agency!.slug),
    enabled: Boolean(agency?.slug),
  });

  const [draft, setDraft] = useState<Draft | null>(null);
  const saved = useMemo(() => (agency ? toDraft(agency.site) : null), [agency]);
  const isDirty = Boolean(draft && saved && !sameDraft(draft, saved));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the editor starts from what's saved once it arrives
    if (saved && !draft) setDraft(saved);
  }, [saved, draft]);

  // Closing the tab or reloading with unsaved changes asks first.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const set: SetDraft = (key, value) =>
    setDraft((current) => (current ? { ...current, [key]: value } : current));

  const saveMutation = useMutation({
    mutationFn: (next: Draft) => updateSite(requireToken(), toPayload(next)),
    onSuccess: (updated) => {
      queryClient.setQueryData(["agency"], updated);
      setDraft(toDraft(updated.site));
      toast.success("Portal actualizado");
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError && err.status === 400
          ? "Revisá los datos marcados"
          : "No se pudo guardar el portal",
      ),
  });

  const coverMutation = useMutation({
    mutationFn: async (file: File) =>
      uploadAgencyCover(
        requireToken(),
        await compressToWebp(file, { maxSide: 2400 }),
      ),
    onSuccess: (updated) => {
      queryClient.setQueryData(["agency"], updated);
      // The upload saves the cover right away; the rest of the unsaved edits stay as they are.
      set("coverUrl", updated.site.coverUrl ?? "");
      toast.success("Portada actualizada");
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : "No se pudo subir la portada",
      ),
  });

  function leave() {
    if (window.history.length > 1) router.back();
    else router.push(`/${getAgencySlug()}/properties`);
  }

  const canSave =
    Boolean(draft && HEX.test(draft.accent)) && !saveMutation.isPending;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-4">
        <Button
          variant="ghost"
          className="gap-1.5"
          onClick={() => (isDirty ? setConfirmExit(true) : leave())}
        >
          <ChevronLeft />
          <span className="hidden sm:inline">Volver</span>
        </Button>
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="font-display text-xl leading-none">Tu portal</h1>
          {isDirty && (
            <span className="hidden items-center gap-2 text-sm text-muted-foreground md:inline-flex">
              <span className="size-2 rounded-full bg-amber-500" />
              Cambios sin guardar
            </span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div
            role="radiogroup"
            aria-label="Tamaño de la vista previa"
            className="hidden gap-1 rounded-lg bg-foreground/[0.06] p-1 lg:flex"
          >
            {VIEWPORTS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={viewport === option.value}
                aria-label={option.label}
                title={option.label}
                onClick={() => setViewport(option.value)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  viewport === option.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <option.icon className="size-4" />
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            className="gap-1.5 lg:hidden"
            onClick={() => setShowPreview((current) => !current)}
            aria-pressed={showPreview}
          >
            {showPreview ? <PenLine /> : <Eye />}
            {showPreview ? "Editar" : "Vista previa"}
          </Button>
          {agency && (
            <Button variant="ghost" className="gap-1.5" asChild>
              <a
                href={`/page/${agency.slug}`}
                target="_blank"
                rel="noreferrer"
                title="Ver portal publicado"
              >
                <ExternalLink />
                <span className="hidden xl:inline">Ver publicado</span>
              </a>
            </Button>
          )}
          {isDirty && saved && (
            <Button
              variant="ghost"
              onClick={() => setDraft(saved)}
              disabled={saveMutation.isPending}
            >
              Cancelar
            </Button>
          )}
          <Button
            onClick={() => draft && saveMutation.mutate(draft)}
            disabled={!isDirty || !canSave}
            className="gap-1.5"
          >
            {saveMutation.isPending && (
              <LoaderCircle className="animate-spin" />
            )}
            Guardar cambios
          </Button>
        </div>
      </header>

      {isLoading || !agency || !draft ? (
        <div className="flex flex-1 animate-pulse gap-6 p-6">
          <div className="w-full max-w-md rounded-2xl bg-muted" />
          <div className="hidden flex-1 rounded-2xl bg-muted lg:block" />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <aside
            className={cn(
              "flex min-h-0 w-full flex-col border-r border-border lg:w-[28rem] lg:shrink-0",
              showPreview && "max-lg:hidden",
            )}
          >
            <div
              role="tablist"
              aria-label="Secciones del editor"
              className="flex shrink-0 gap-6 overflow-x-auto border-b border-border px-6"
            >
              {TABS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  id={`tab-${option.value}`}
                  aria-selected={tab === option.value}
                  aria-controls="panel-editor"
                  onClick={() => setTab(option.value)}
                  className={cn(
                    "-mb-px h-12 shrink-0 border-b-2 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:text-foreground focus-visible:underline",
                    tab === option.value
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option.label}
                  {option.value === "blocks" && draft.sections.length > 0 && (
                    <span className="ml-1.5 text-muted-foreground tabular-nums">
                      {draft.sections.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div
              id="panel-editor"
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              className="flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto px-6 py-8"
            >
              {tab === "design" && (
                <DesignPanel draft={draft} set={set} viewport={viewport} onViewportChange={setViewport} />
              )}
              {tab === "cover" && (
                <CoverPanel
                  draft={draft}
                  set={set}
                  uploading={coverMutation.isPending}
                  onUpload={(file) => coverMutation.mutate(file)}
                  properties={properties}
                />
              )}
              {tab === "blocks" && (
                <BlocksPanel draft={draft} set={set} properties={properties} />
              )}
              {tab === "agency" && <AgencyPanel draft={draft} set={set} />}
            </div>
          </aside>

          <SitePreview
            viewport={viewport}
            agencySlug={agency.slug}
            agency={{
              name: agency.name,
              logoUrl: agency.logoUrl,
              contactEmail: agency.contactEmail,
              site: agency.site,
            }}
            site={resolveSite(toPayload(draft))}
            properties={properties}
            className={cn(
              "flex-1 bg-foreground/[0.03] p-4 lg:p-8",
              !showPreview && "max-lg:hidden",
            )}
          />
        </div>
      )}

      <AlertDialog open={confirmExit} onOpenChange={setConfirmExit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tenés cambios sin guardar</AlertDialogTitle>
            <AlertDialogDescription>
              Si salís ahora, se pierden los cambios que todavía no guardaste en
              tu portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Seguir editando</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={leave}>
              Salir sin guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
