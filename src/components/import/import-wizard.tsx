"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCode2,
  FileSpreadsheet,
  LifeBuoy,
  Link2,
  LoaderCircle,
  Mail,
  Search,
  Upload,
  Workflow,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiError } from "@/lib/api/client";
import {
  applyImport,
  listImportFields,
  previewImport,
  type ImportAction,
  type ImportFormat,
  type ImportInput,
  type ImportPreview,
  type ImportResult,
} from "@/lib/api/imports";
import { requestContact } from "@/lib/api/contact";
import { getAccessToken, useRequireNonAgent, useSessionUser } from "@/lib/auth/session";
import {
  CSV_TEMPLATE,
  FORMAT_LABEL,
    GENERIC_ORIGINS,
  TIVVO_XML_EXAMPLE,
  genericGuide,
  helpMessage,
  platformGuide,
  routeGuide,
  type Guide,
  type GenericOrigin,
  type SupportRequest,
} from "@/lib/import-guides";
import { platformLogo } from "@/lib/import-logos";
import { IMPORT_PLATFORMS, type ImportPlatform, type PlatformType } from "@/lib/import-platforms";

type Step = "source" | "mapping" | "review" | "done";

const NONE = "__none__";

const FORMAT_ICON: Record<ImportFormat, typeof FileSpreadsheet> = {
  table: FileSpreadsheet,
  kyero: FileCode2,
  tivvo_xml: Workflow,
};

const TYPE_FILTERS: { value: PlatformType | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "crm", label: "CRM" },
  { value: "portal", label: "Portales" },
  { value: "aggregator", label: "Agregadores" },
];

type Origin = { platform: ImportPlatform } | { generic: GenericOrigin };

const URL_PLACEHOLDER: Record<ImportFormat, string> = {
  table: "https://tu-crm.com/export/propiedades.csv",
  kyero: "https://tu-crm.com/feeds/kyero.xml",
  tivvo_xml: "https://tu-sistema.com/feeds/tivvo.xml",
};

const ACCEPT: Record<ImportFormat, string> = {
  table: ".csv,.xlsx,.xlsm,text/csv",
  kyero: ".xml,text/xml,application/xml",
  tivvo_xml: ".xml,text/xml,application/xml",
};

const ACTION_LABEL: Record<ImportAction, string> = {
  create: "Nueva",
  update: "Actualiza",
  unchanged: "Sin cambios",
  skip: "Omitida",
  error: "Con error",
};

const ACTION_CLASS: Record<ImportAction, string> = {
  create: "bg-primary/10 text-primary",
  update: "bg-highlight/20 text-foreground",
  unchanged: "bg-foreground/[0.07] text-muted-foreground",
  skip: "bg-foreground/[0.07] text-muted-foreground",
  error: "bg-destructive/10 text-destructive",
};

const CHANGE_LABEL: Record<string, string> = {
  title: "título",
  listing_type: "operación",
  category: "tipo",
  price: "precio",
  currency: "moneda",
  country: "país",
  region: "región",
  area: "zona",
  address: "dirección",
  lat: "coordenadas",
  lng: "coordenadas",
  bedrooms: "dormitorios",
  bathrooms: "baños",
  area_sqm: "m² construidos",
  plot_area: "m² de parcela",
  construction_year: "año",
  energy_certificate: "certificado energético",
  website_url: "link original",
  summary: "resumen",
  description: "descripción",
  parking_spaces: "parking",
  features: "características",
  photos: "fotos",
  owner: "propietario",
};

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

function describeChanges(changes: string[]) {
  return [...new Set(changes.map((key) => CHANGE_LABEL[key] ?? key))].join(", ");
}

const plain = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function downloadCsvTemplate() {
  const url = URL.createObjectURL(new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "plantilla-propiedades-tivvo.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function SupportCard({ support }: { support: SupportRequest }) {
  const [copied, setCopied] = useState(false);
  const { contact, subject, message } = support;

  async function copy(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }

  // With an email the message opens ready to send; without one we copy it and
  // open the platform's contact page, where it only needs pasting.
  async function askPlatform() {
    const copiedOk = await copy();
    if (contact.email) {
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      toast.message("Se abrió tu correo con el mensaje escrito: solo tenés que enviarlo.");
      return;
    }
    window.open(contact.url, "_blank", "noopener,noreferrer");
    toast.message(
      copiedOk
        ? `Copiamos el mensaje. Pegalo en el contacto de ${support.platform} y enviá.`
        : "Copiá el mensaje y pegalo en el contacto de la plataforma.",
    );
  }

  const gmailUrl = contact.email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    : null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/5">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg">Pedile el feed a {support.platform}</h3>
        <p className="text-sm text-muted-foreground">
          {contact.email
            ? "Te abrimos tu correo con el destinatario, el asunto y el mensaje ya escritos: solo tenés que enviar."
            : "Te llevamos a su página de contacto con el mensaje ya copiado: solo tenés que pegarlo y enviar."}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={askPlatform}>
          <Mail />
          {contact.email ? "Enviar pedido por email" : "Ir al contacto con el mensaje copiado"}
        </Button>
        {gmailUrl && (
          <Button asChild variant="outline">
            <a href={gmailUrl} target="_blank" rel="noopener noreferrer">
              Abrir en Gmail
              <ExternalLink />
            </a>
          </Button>
        )}
        <Button variant="ghost" onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Copiado" : "Copiar mensaje"}
        </Button>
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground">Ver el mensaje</summary>
        <textarea
          readOnly
          value={message}
          rows={10}
          aria-label="Mensaje para la plataforma"
          className="mt-2 w-full resize-y rounded-xl bg-foreground/[0.07] p-3 text-sm leading-relaxed outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-foreground/10"
        />
      </details>
      <p className="text-xs text-muted-foreground">
        {contact.email ? `Se envía a ${contact.email}. ` : ""}
        <a href={contact.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
          {contact.label}
        </a>
      </p>
    </div>
  );
}

function HelpCard({ originName }: { originName: string }) {
  const user = useSessionUser();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const send = useMutation({
    mutationFn: () => requestContact({ name: name.trim(), email: email.trim(), message }),
    onSuccess: () => setSent(true),
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "No se pudo enviar el mensaje. Probá de nuevo en unos minutos."),
  });

  // Everything is filled in when it opens: the person only has to press send.
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setName(user?.name ?? "");
      setEmail(user?.email ?? "");
      setMessage(helpMessage(originName, user?.agencySlug));
      setSent(false);
      send.reset();
    }
  }

  const valid = name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(email.trim()) && message.trim().length >= 5;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/5">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg">¿Necesitás ayuda con la migración?</h3>
        <p className="text-sm text-muted-foreground">
          Escribinos a Tivvo y te ayudamos a migrar desde {originName}. Te dejamos el mensaje listo: solo tenés que enviarlo.
        </p>
      </div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="w-fit">
            <LifeBuoy />
            Pedir ayuda
          </Button>
        </DialogTrigger>
        <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-lg" showCloseButton>
          {sent ? (
            <div className="flex flex-col items-start gap-3 px-7 py-8" role="status">
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
                <CheckCircle2 className="size-5" />
              </span>
              <DialogTitle className="font-display text-2xl">Mensaje enviado</DialogTitle>
              <DialogDescription>Te respondemos por email a la brevedad.</DialogDescription>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>
          ) : (
            <form
              className="flex flex-col"
              onSubmit={(event) => {
                event.preventDefault();
                if (valid) send.mutate();
              }}
            >
              <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
                <DialogTitle className="font-display text-3xl leading-none tracking-tight">Pedir ayuda</DialogTitle>
                <DialogDescription>Revisá el mensaje, cambialo si querés y enviá.</DialogDescription>
              </div>
              <div className="flex flex-col gap-4 px-7 pb-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="help-name">Tu nombre</Label>
                    <Input id="help-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="help-email">Email</Label>
                    <Input
                      id="help-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="help-message">Mensaje</Label>
                  <Textarea id="help-message" rows={8} value={message} onChange={(event) => setMessage(event.target.value)} />
                </div>
              </div>
              <div className="flex justify-end px-7 py-6">
                <Button type="submit" size="lg" disabled={!valid || send.isPending}>
                  {send.isPending && <LoaderCircle className="animate-spin" />}
                  Enviar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlatformLogo({ platform, size }: { platform: ImportPlatform; size: number }) {
  const logo = platformLogo(platform.slug);
  const Icon = FORMAT_ICON[platform.format];
  if (!logo) {
    return (
      <span
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"
      >
        <Icon className="size-4" />
      </span>
    );
  }
  return (
    <Image
      src={logo}
      alt=""
      width={size}
      height={size}
      unoptimized
      className="shrink-0 rounded-xl bg-white object-contain ring-1 ring-foreground/10"
    />
  );
}

function PlatformButton({ platform, onPick }: { platform: ImportPlatform; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="flex items-start gap-3 rounded-2xl bg-card p-4 text-left ring-1 ring-foreground/5 transition-shadow outline-none hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <PlatformLogo platform={platform} size={36} />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-medium">{platform.name}</span>
        <span className="truncate text-xs text-muted-foreground">{platform.market}</span>
        <span className="text-xs text-primary">{FORMAT_LABEL[platform.format]}</span>
      </span>
    </button>
  );
}

export function ImportWizard() {
  useRequireNonAgent();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("source");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [override, setOverride] = useState<ImportFormat | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PlatformType | "all">("all");
  const [byUrl, setByUrl] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [mapping, setMapping] = useState<Record<string, string | null>>({});
  const [archiveMissing, setArchiveMissing] = useState(false);
  const [publish, setPublish] = useState(false);
  const [onlyProblems, setOnlyProblems] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const platform = origin && "platform" in origin ? origin.platform : null;
  const originName = origin ? (platform ? platform.name : (origin as { generic: GenericOrigin }).generic.name) : "";
  const baseGuide: Guide | null = origin
    ? platform
      ? platformGuide(platform)
      : genericGuide((origin as { generic: GenericOrigin }).generic)
    : null;
  const guide = baseGuide && override ? routeGuide(override, baseGuide.source, originName) : baseGuide;
  const format: ImportFormat = guide?.format ?? "table";
  const source = guide?.source ?? "csv";
  const urlMode = byUrl;
  const hasInput = urlMode ? url.trim().length > 0 : file !== null;

  const platforms = useMemo(() => {
    const needle = plain(query.trim());
    return IMPORT_PLATFORMS.filter(
      (item) =>
        (typeFilter === "all" || item.type === typeFilter) &&
        (!needle || plain(`${item.name} ${item.market}`).includes(needle)),
    );
  }, [query, typeFilter]);

  const { data: fields } = useQuery({
    queryKey: ["imports", "fields"],
    queryFn: () => listImportFields(requireToken()),
    staleTime: Infinity,
  });

  function buildInput(overrides: Partial<ImportInput> = {}): ImportInput {
    return {
      format,
      file: urlMode ? null : file,
      url: urlMode ? url : undefined,
      source,
      mapping: format === "table" ? mapping : undefined,
      archiveMissing,
      publish,
      ...overrides,
    };
  }

  const previewMutation = useMutation({
    mutationFn: (input: ImportInput) => previewImport(requireToken(), input),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo leer el archivo"),
  });

  const applyMutation = useMutation({
    mutationFn: (input: ImportInput) => applyImport(requireToken(), input),
    onSuccess: (data) => {
      setResult(data);
      setStep("done");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo importar"),
  });

  function clearInput() {
    setFile(null);
    setUrl("");
    if (fileInput.current) fileInput.current.value = "";
  }

  function chooseOrigin(next: Origin | null) {
    setOrigin(next);
    setOverride(null);
    setByUrl(true);
    clearInput();
  }

  function changeRoute(next: ImportFormat | null) {
    setOverride(next);
    setByUrl(true);
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

  function refreshPreview(overrides: Partial<ImportInput> = {}) {
    previewMutation.mutate(buildInput(overrides), {
      onSuccess: (data) => {
        setPreview(data);
        setStep("review");
      },
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

  function reset() {
    setStep("source");
    setPreview(null);
    setResult(null);
    setArchiveMissing(false);
    setPublish(false);
    chooseOrigin(null);
  }

  const busy = previewMutation.isPending || applyMutation.isPending;
  const mappedCount = Object.values(mapping).filter(Boolean).length;
  const importable = preview ? preview.counts.create + preview.counts.update : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Link
          href={`/${agencySlug}/properties`}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" />
          Propiedades
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl leading-tight">Importar propiedades</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Elegí la plataforma desde la que migrás y te explicamos cómo sacar tus datos de ahí. Antes de guardar nada
            ves qué se crea, qué se actualiza y qué falla; si volvés a importar, se actualiza lo que ya trajiste en
            lugar de duplicarlo.
          </p>
        </div>
      </div>

      {step === "source" && !guide && (
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-xl">¿Desde dónde migrás?</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {GENERIC_ORIGINS.map((generic) => {
                const Icon = FORMAT_ICON[generic.format];
                return (
                  <button
                    key={generic.slug}
                    type="button"
                    onClick={() => chooseOrigin({ generic })}
                    className="flex items-start gap-4 rounded-2xl bg-card p-5 text-left ring-1 ring-foreground/5 transition-shadow outline-none hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="font-display text-lg">{generic.name}</span>
                      <span className="text-sm text-muted-foreground">{generic.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="font-display text-xl">O elegí tu plataforma</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por nombre o país"
                  aria-label="Buscar plataforma"
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map((item) => (
                  <Button
                    key={item.value}
                    size="sm"
                    variant={typeFilter === item.value ? "default" : "outline"}
                    aria-pressed={typeFilter === item.value}
                    onClick={() => setTypeFilter(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {platforms.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No encontramos esa plataforma. Elegí «Otra plataforma (XML)» arriba: sirve para cualquier sistema que pueda dar un feed XML.
              </p>
            )}
            {([1, 2] as const).map((tier) => {
              const group = platforms.filter((item) => (tier === 1 ? item.priority === 1 : item.priority > 1));
              if (group.length === 0) return null;
              return (
                <div key={tier} className="flex flex-col gap-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {tier === 1 ? "Más usadas" : "Otras plataformas"}
                  </h3>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-3">
                    {group.map((item) => (
                      <PlatformButton key={item.slug} platform={item} onPick={() => chooseOrigin({ platform: item })} />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      )}

      {step === "source" && guide && (
        <div className="flex flex-col gap-6">
          <Button variant="ghost" size="sm" className="w-fit" onClick={() => chooseOrigin(null)}>
            <ArrowLeft />
            Elegir otra plataforma
          </Button>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  {platform && <PlatformLogo platform={platform} size={44} />}
                  <h2 className="font-display text-2xl">{guide.title}</h2>
                  <Badge variant="secondary">{FORMAT_LABEL[format]}</Badge>
                </div>
              </div>

              {guide.note && <p className="text-sm text-muted-foreground">{guide.note}</p>}

              <ol className="flex flex-col gap-4">
                {guide.steps.map((text, index) => (
                  <li key={text} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{text}</span>
                  </li>
                ))}
              </ol>

              {format === "table" && (
                <Button variant="outline" className="w-fit" onClick={downloadCsvTemplate}>
                  <Download />
                  Descargar plantilla CSV
                </Button>
              )}
              {format === "tivvo_xml" && (
                <pre className="max-h-80 overflow-auto rounded-2xl bg-foreground/[0.07] p-4 text-xs leading-relaxed dark:bg-foreground/10">
                  {TIVVO_XML_EXAMPLE}
                </pre>
              )}

              {guide.support && <SupportCard support={guide.support} />}
              <HelpCard originName={originName} />

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                {guide.sources?.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    {item.label}
                    <ExternalLink className="size-3.5" />
                  </a>
                ))}
                {baseGuide?.alternative && !override && (
                  <button
                    type="button"
                    onClick={() => changeRoute(baseGuide.alternative!.format)}
                    className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {baseGuide.alternative.label}
                  </button>
                )}
                {override && (
                  <button
                    type="button"
                    onClick={() => changeRoute(null)}
                    className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Volver a la guía recomendada
                  </button>
                )}
              </div>
            </section>

            <aside className="flex h-fit flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/5 lg:sticky lg:top-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-lg">{urlMode ? "URL" : "Tu archivo"}</h3>
                <Button variant="ghost" size="sm" onClick={() => setByUrl((value) => !value)}>
                  {byUrl ? <Upload /> : <Link2 />}
                  {byUrl ? "Subir archivo" : "Usar una URL"}
                </Button>
              </div>
              {urlMode ? (
                <>
                  <Input
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder={URL_PLACEHOLDER[format]}
                    inputMode="url"
                    aria-label="URL"
                  />
                  <p className="text-xs text-muted-foreground">
                    La URL tiene que ser pública. La leemos una sola vez; no queda sincronizada.
                  </p>
                </>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-foreground/20 px-4 py-9 text-center transition-colors hover:bg-muted/40 has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
                  <Upload className="size-6 text-primary" />
                  <span className="text-sm font-medium break-all">{file ? file.name : "Elegí un archivo"}</span>
                  <span className="text-xs text-muted-foreground">
                    {format === "table" ? "CSV o Excel (.xlsx), hasta 10 MB y 3.000 filas" : "XML, hasta 10 MB"}
                  </span>
                  <input
                    ref={fileInput}
                    type="file"
                    accept={ACCEPT[format]}
                    className="sr-only"
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  />
                </label>
              )}
              <Button size="lg" disabled={!hasInput || busy} onClick={readFile}>
                {previewMutation.isPending && <LoaderCircle className="animate-spin" />}
                Continuar
              </Button>
            </aside>
          </div>
        </div>
      )}

      {step === "mapping" && preview?.table && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl">Qué es cada columna</h2>
            <p className="text-sm text-muted-foreground">
              Detectamos {preview.table.totalRows} filas. Revisá lo que sugerimos y corregí lo que haga falta; las columnas
              sin asignar se ignoran. Una celda vacía nunca borra lo que ya está cargado.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl bg-card ring-1 ring-foreground/5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Columna de tu archivo</TableHead>
                  <TableHead>Ejemplos</TableHead>
                  <TableHead className="w-72">Dato en Tivvo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.table.headers.map((header, index) => (
                  <TableRow key={header}>
                    <TableCell className="font-medium">{header}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {preview.table!.sample
                        .slice(0, 2)
                        .map((row) => row[index])
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </TableCell>
                    <TableCell>
                      <Select value={mapping[header] ?? NONE} onValueChange={(value) => changeMapping(header, value)}>
                        <SelectTrigger size="sm" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE}>No importar</SelectItem>
                          {(fields ?? []).map((field) => (
                            <SelectItem key={field.key} value={field.key}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {!Object.values(mapping).includes("external_id") && (
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-highlight" />
              Sin una columna de referencia (ID), volver a importar el archivo duplicará las propiedades en lugar de actualizarlas.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="lg" onClick={() => setStep("source")}>
              Atrás
            </Button>
            <Button size="lg" disabled={mappedCount === 0 || busy} onClick={() => refreshPreview()}>
              {previewMutation.isPending && <LoaderCircle className="animate-spin" />}
              Ver vista previa
            </Button>
          </div>
        </div>
      )}

      {step === "review" && preview && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {(
              [
                ["create", "Nuevas"],
                ["update", "Se actualizan"],
                ["unchanged", "Sin cambios"],
                ["skip", "Omitidas"],
                ["error", "Con error"],
                ["trash", "A la papelera"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-foreground/5">
                <span className="font-display text-3xl">{preview.counts[key]}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
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
                <span className="text-sm font-medium">Publicar las nuevas al importar</span>
                <span className="text-xs text-muted-foreground">
                  Si no, quedan como borrador para que las revises antes de mostrarlas en tu sitio.
                </span>
              </span>
              <Switch checked={publish} onCheckedChange={setPublish} />
            </label>
            <label className="flex items-center justify-between gap-4">
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">Mandar a la papelera lo que ya no está en el archivo</span>
                <span className="text-xs text-muted-foreground">
                  Solo toca propiedades traídas desde «{source}». Se pueden restaurar durante 30 días.
                </span>
              </span>
              <Switch
                checked={archiveMissing}
                disabled={busy}
                onCheckedChange={(checked) => {
                  setArchiveMissing(checked);
                  refreshPreview({ archiveMissing: checked });
                }}
              />
            </label>
            {archiveMissing && preview.missing.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Van a la papelera: {preview.missing.map((item) => item.title).join(", ")}
                {preview.counts.trash > preview.missing.length && ` y ${preview.counts.trash - preview.missing.length} más`}.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">Detalle por fila</h2>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Solo avisos y errores
              <Switch size="sm" checked={onlyProblems} onCheckedChange={setOnlyProblems} />
            </label>
          </div>
          <div className="overflow-x-auto rounded-2xl bg-card ring-1 ring-foreground/5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Fila</TableHead>
                  <TableHead className="w-32">Estado</TableHead>
                  <TableHead>Propiedad</TableHead>
                  <TableHead>Detalle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.rows
                  .filter((row) => !onlyProblems || row.warnings.length > 0 || row.errors.length > 0)
                  .map((row) => (
                    <TableRow key={row.row}>
                      <TableCell className="text-muted-foreground">{row.row}</TableCell>
                      <TableCell>
                        <Badge className={ACTION_CLASS[row.action]}>{ACTION_LABEL[row.action]}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <span className="block truncate font-medium">{row.title ?? "Sin título"}</span>
                        {row.externalId && <span className="text-xs text-muted-foreground">{row.externalId}</span>}
                      </TableCell>
                      <TableCell className="max-w-md text-sm whitespace-normal text-muted-foreground">
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
                        {row.action === "update" && <span className="block">Cambia: {describeChanges(row.changes)}</span>}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {preview.rows.length < Object.values(preview.counts).slice(0, 5).reduce((sum, value) => sum + value, 0) && (
            <p className="text-xs text-muted-foreground">
              La vista previa muestra las primeras {preview.rows.length} filas; la importación procesa todas.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="lg" onClick={() => setStep(format === "table" ? "mapping" : "source")}>
              Atrás
            </Button>
            <Button
              size="lg"
              disabled={busy || (importable === 0 && preview.counts.trash === 0)}
              onClick={() => applyMutation.mutate(buildInput())}
            >
              {applyMutation.isPending && <LoaderCircle className="animate-spin" />}
              {importable > 0 ? `Importar ${importable} ${importable === 1 ? "propiedad" : "propiedades"}` : "Aplicar"}
            </Button>
          </div>
        </div>
      )}

      {step === "done" && result && (
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-card px-6 py-14 text-center ring-1 ring-foreground/5">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="size-6" />
          </span>
          <div className="flex max-w-md flex-col gap-1">
            <p className="font-display text-2xl">Importación lista</p>
            <p className="text-sm text-muted-foreground">
              {result.done.create} creadas, {result.done.update} actualizadas
              {result.done.trash > 0 && `, ${result.done.trash} enviadas a la papelera`}
              {result.done.failed > 0 && `, ${result.done.failed} con error`}.
              {!publish && result.done.create > 0 && " Las nuevas quedaron como borrador."}
            </p>
          </div>
          {result.failures.length > 0 && (
            <ul className="max-w-md text-left text-sm text-destructive">
              {result.failures.slice(0, 5).map((failure) => (
                <li key={failure.row}>
                  Fila {failure.row}: {failure.error}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href={`/${agencySlug}/properties`}>Ver propiedades</Link>
            </Button>
            <Button variant="outline" size="lg" onClick={reset}>
              Importar otro archivo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
