"use client";

import { Check, ImagePlus, LoaderCircle, Monitor, Smartphone, Trash2 } from "lucide-react";
import { useRef } from "react";

import { BlocksEditor } from "@/components/portal-editor/blocks-editor";
import { MosaicPicker } from "@/components/portal-editor/mosaic-picker";
import type { Viewport } from "@/components/portal-editor/site-preview";
import {
  type Draft,
  HEX,
  type SetDraft,
} from "@/components/portal-editor/draft";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
import type { Property } from "@/lib/api/properties";
import {
  ACCENT_PRESETS,
  DEFAULT_HERO_TITLE,
  FONT_PAIRS,
  SITE_TEMPLATES,
  accentInk,
} from "@/lib/site-theme";
import { cn } from "@/lib/utils";

/** A group of controls inside a tab: a short heading, an optional line of help, then the controls. */
export function Group({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && (
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  maxLength,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 px-4"
      />
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

/** A tiny drawing of each layout, so the choice is visual rather than a name. */
function TemplateSketch({ template }: { template: Draft["template"] }) {
  const bar = "rounded-[2px] bg-current";
  return (
    <div
      aria-hidden
      className="flex aspect-[4/3] flex-col gap-1 overflow-hidden rounded-md bg-background p-2 text-foreground/15"
    >
      <div className={cn(bar, "h-1 w-full opacity-60")} />
      {template === "portada" && (
        <div className="flex flex-1 flex-col justify-end gap-1 rounded-[3px] bg-current p-1.5">
          <div className="h-1.5 w-2/3 rounded-[2px] bg-background/80" />
          <div className="h-2 w-full rounded-[2px] bg-background" />
        </div>
      )}
      {template === "editorial" && (
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          <div className="flex flex-col justify-center gap-1">
            <div className={cn(bar, "h-2 w-full")} />
            <div className={cn(bar, "h-2 w-3/4")} />
            <div className={cn(bar, "mt-1 h-1.5 w-full opacity-60")} />
          </div>
          <div className="rounded-[3px] bg-current" />
        </div>
      )}
      {template === "dividido" && (
        <div className="grid flex-1 grid-cols-2 overflow-hidden rounded-[3px]">
          <div className="flex flex-col justify-center gap-1 bg-current p-1.5">
            <div className="h-1.5 w-full rounded-[2px] bg-background/80" />
            <div className="h-1.5 w-2/3 rounded-[2px] bg-background/80" />
            <div className="mt-0.5 h-2 w-full rounded-[2px] bg-background" />
          </div>
          <div className="bg-current opacity-50" />
        </div>
      )}
      {template === "mosaico" && (
        <div className="flex flex-1 flex-col gap-1">
          <div className={cn(bar, "h-1.5 w-2/3")} />
          <div className="grid flex-1 grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-1">
            <div className="row-span-2 rounded-[2px] bg-current" />
            <div className="rounded-[2px] bg-current" />
            <div className="rounded-[2px] bg-current" />
            <div className="col-span-2 rounded-[2px] bg-current" />
          </div>
        </div>
      )}
      {template === "compacto" && (
        <div className="flex flex-1 flex-col gap-1">
          <div className={cn(bar, "h-1.5 w-1/2")} />
          <div className={cn(bar, "h-1.5 w-full opacity-60")} />
          <div className="grid flex-1 grid-cols-4 gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div key={index} className="rounded-[2px] bg-current" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const CHOICE =
  "flex flex-col gap-3 rounded-xl p-3 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50";
const CHOICE_ON = "bg-primary/10 ring-2 ring-primary";
const CHOICE_OFF = "bg-foreground/[0.04] hover:bg-foreground/[0.07]";

export function DesignPanel({
  draft,
  set,
  viewport,
  onViewportChange,
}: {
  draft: Draft;
  set: SetDraft;
  /** Which screen the layout choice applies to; it also drives the preview. */
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
}) {
  const customColor = !ACCENT_PRESETS.some(
    (preset) => preset.value.toLowerCase() === draft.accent.toLowerCase(),
  );
  const onMobile = viewport === "mobile";
  const sameOnMobile = !draft.templateMobile || draft.templateMobile === draft.template;
  // The layout this screen shows: on phones, the desktop one until another is picked.
  const shown = onMobile && !sameOnMobile ? draft.templateMobile : draft.template;
  const template = SITE_TEMPLATES.find((option) => option.value === shown);

  function pick(value: Draft["template"]) {
    if (!onMobile) set("template", value);
    else set("templateMobile", value === draft.template ? "" : value);
  }

  return (
    <>
      <Group
        title="Diseño"
        description="La forma general de la página de inicio. Podés usar uno en computadoras y otro en celulares."
      >
        <div
          role="radiogroup"
          aria-label="Pantalla"
          className="flex gap-1 self-start rounded-lg bg-foreground/[0.06] p-1"
        >
          {(
            [
              { value: "desktop", label: "Computadora", icon: Monitor },
              { value: "mobile", label: "Celular", icon: Smartphone },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={viewport === option.value}
              onClick={() => onViewportChange(option.value)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                viewport === option.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <option.icon className="size-4" />
              {option.label}
            </button>
          ))}
        </div>
        {onMobile && (
          <label className="flex items-center justify-between gap-4 rounded-xl bg-foreground/[0.04] px-4 py-3.5">
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Igual que en computadora</span>
              <span className="text-xs text-muted-foreground">
                Apagalo para elegir otro diseño solo para celulares.
              </span>
            </span>
            <Switch
              checked={sameOnMobile}
              onCheckedChange={(checked) =>
                set(
                  "templateMobile",
                  checked
                    ? ""
                    : // Start from a layout other than the desktop one.
                      draft.template === "portada"
                      ? "compacto"
                      : "portada",
                )
              }
            />
          </label>
        )}
        <div
          role="radiogroup"
          aria-label={onMobile ? "Diseño en celulares" : "Diseño en computadoras"}
          className={cn("grid grid-cols-3 gap-3", onMobile && sameOnMobile && "pointer-events-none opacity-50")}
          aria-disabled={onMobile && sameOnMobile}
        >
          {SITE_TEMPLATES.map((option) => {
            const active = shown === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={onMobile && sameOnMobile ? -1 : undefined}
                onClick={() => pick(option.value)}
                className={cn(CHOICE, active ? CHOICE_ON : CHOICE_OFF)}
              >
                <TemplateSketch template={option.value} />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
        {template && (
          <p className="text-sm text-muted-foreground">
            {template.description}
          </p>
        )}
      </Group>

      <Group
        title="Color"
        description="Para botones, enlaces y detalles. El resto del portal queda en blanco y gris."
      >
        <div
          role="radiogroup"
          aria-label="Color"
          className="grid grid-cols-8 gap-2"
        >
          {ACCENT_PRESETS.map((preset) => {
            const active =
              preset.value.toLowerCase() === draft.accent.toLowerCase();
            return (
              <button
                key={preset.value}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={preset.label}
                title={preset.label}
                onClick={() => set("accent", preset.value)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-full outline-none transition-transform focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "hover:scale-105",
                )}
                style={{
                  backgroundColor: preset.value,
                  color: accentInk(preset.value),
                }}
              >
                {active && <Check className="size-4" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <label
            className={cn(
              "relative flex size-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full ring-1 ring-border",
              customColor &&
                "ring-2 ring-foreground ring-offset-2 ring-offset-background",
            )}
            style={{
              backgroundColor: HEX.test(draft.accent)
                ? draft.accent
                : undefined,
            }}
            title="Elegir otro color"
          >
            <span className="sr-only">Elegir otro color</span>
            <input
              type="color"
              value={HEX.test(draft.accent) ? draft.accent : "#000000"}
              onChange={(event) =>
                set("accent", event.target.value.toUpperCase())
              }
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
          <Input
            aria-label="Código del color"
            value={draft.accent}
            maxLength={7}
            onChange={(event) =>
              set(
                "accent",
                event.target.value.startsWith("#")
                  ? event.target.value
                  : `#${event.target.value}`,
              )
            }
            aria-invalid={!HEX.test(draft.accent)}
            className="h-11 w-32 px-3.5 font-mono uppercase"
          />
          <span className="text-sm text-muted-foreground">
            {HEX.test(draft.accent) ? (
              "U otro, con el selector"
            ) : (
              <span className="text-destructive">Usá el formato #1F5F4A</span>
            )}
          </span>
        </div>
      </Group>

      <Group title="Tipografía">
        <div
          role="radiogroup"
          aria-label="Tipografía"
          className="grid grid-cols-3 gap-3"
        >
          {FONT_PAIRS.map((pair) => {
            const active = draft.fonts === pair.value;
            return (
              <button
                key={pair.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => set("fonts", pair.value)}
                className={cn(
                  CHOICE,
                  "items-start",
                  active ? CHOICE_ON : CHOICE_OFF,
                )}
              >
                <span
                  className="text-4xl leading-none"
                  style={{
                    fontFamily: pair.heading,
                    fontWeight: pair.weight,
                    letterSpacing: pair.tracking,
                  }}
                  aria-hidden
                >
                  Aa
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{pair.label}</span>
                  <span className="text-xs leading-snug text-muted-foreground">
                    {pair.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Group>
    </>
  );
}

export function CoverPanel({
  draft,
  set,
  uploading,
  onUpload,
  properties,
}: {
  draft: Draft;
  set: SetDraft;
  uploading: boolean;
  onUpload: (file: File) => void;
  properties: Property[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const usesMosaic = draft.template === "mosaico" || draft.templateMobile === "mosaico";

  return (
    <>
      {usesMosaic && (
        <Group
          title="Fotos del mosaico"
          description="Las cuatro fotos de la portada, en este orden; la primera va en grande. Si no elegís ninguna, se usan las fotos de tus propiedades."
        >
          <MosaicPicker
            value={draft.mosaicPhotos}
            onChange={(urls) => set("mosaicPhotos", urls)}
            properties={properties}
          />
        </Group>
      )}

      <Group
        title="Foto de portada"
        description="La imagen principal de tu página. Mejor horizontal y de al menos 1920 px de ancho."
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-foreground/[0.05]">
          {draft.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={draft.coverUrl}
              alt="Portada actual"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <ImagePlus className="size-6" strokeWidth={1.5} />
              Sin portada: se usa tu color.
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/50 text-background">
              <LoaderCircle className="size-6 animate-spin" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground/[0.06] px-4 text-sm font-medium outline-none hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
          >
            <ImagePlus className="size-4" />
            {draft.coverUrl ? "Cambiar foto" : "Subir foto"}
          </button>
          {draft.coverUrl && (
            <button
              type="button"
              onClick={() => set("coverUrl", "")}
              className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Trash2 className="size-4" />
              Quitar
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.target.value = "";
          }}
        />
      </Group>

      <Group title="Textos">
        <TextField
          id="heroTitle"
          label="Titular"
          value={draft.heroTitle}
          onChange={(value) => set("heroTitle", value)}
          placeholder={DEFAULT_HERO_TITLE}
          maxLength={120}
          hint="Si lo dejás vacío, se usa el de ejemplo."
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="heroSubtitle" className="text-sm font-medium">
            Bajada{" "}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </label>
          <Textarea
            id="heroSubtitle"
            rows={3}
            maxLength={240}
            value={draft.heroSubtitle}
            placeholder="Casas y departamentos en venta y alquiler en la costa atlántica."
            onChange={(event) => set("heroSubtitle", event.target.value)}
            className="px-4 py-3"
          />
        </div>
      </Group>
    </>
  );
}

export function BlocksPanel({
  draft,
  set,
  properties,
}: {
  draft: Draft;
  set: SetDraft;
  properties: Property[];
}) {
  return (
    <Group
      title="Bloques"
      description="Secciones propias entre la portada y el listado: destinos como Ibiza o Grecia, o promociones con propiedades destacadas."
    >
      <BlocksEditor
        sections={draft.sections}
        onChange={(sections) => set("sections", sections)}
        properties={properties}
      />
    </Group>
  );
}

export function AgencyPanel({ draft, set }: { draft: Draft; set: SetDraft }) {
  return (
    <>
      <Group
        title="Sobre tu agencia"
        description="Un párrafo sobre quiénes son y cómo trabajan."
      >
        <label className="flex items-center justify-between gap-4 rounded-xl bg-foreground/[0.04] px-4 py-3.5">
          <span className="text-sm font-medium">
            Mostrar la sección en el portal
          </span>
          <Switch
            checked={draft.showAbout}
            onCheckedChange={(checked) => set("showAbout", checked)}
          />
        </label>
        <RichTextEditor
          ariaLabel="Texto sobre tu agencia"
          value={draft.about}
          placeholder="Somos una inmobiliaria familiar con 20 años en la zona…"
          onChange={(html) => set("about", html)}
          contentClassName="min-h-36"
        />
      </Group>

      <Group
        title="Contacto"
        description="Aparece en el pie y en la sección de contacto. El email se cambia en Configuración."
      >
        <TextField
          id="whatsapp"
          label="WhatsApp"
          type="tel"
          value={draft.whatsapp}
          onChange={(value) => set("whatsapp", value)}
          placeholder="+54 9 11 5555-1234"
          hint="Con código de país. Activa el botón “Escribinos por WhatsApp”."
          maxLength={40}
        />
        <TextField
          id="phone"
          label="Teléfono"
          type="tel"
          value={draft.phone}
          onChange={(value) => set("phone", value)}
          maxLength={40}
        />
        <TextField
          id="address"
          label="Dirección de la oficina"
          value={draft.address}
          onChange={(value) => set("address", value)}
          maxLength={200}
        />
        <TextField
          id="instagram"
          label="Instagram"
          value={draft.instagram}
          onChange={(value) => set("instagram", value)}
          placeholder="@tuagencia"
          maxLength={100}
        />
      </Group>
    </>
  );
}
