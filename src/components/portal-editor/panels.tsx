"use client";

import { Check, ImagePlus, LoaderCircle, Monitor, Smartphone, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("portalEditor");
  const customColor = !ACCENT_PRESETS.some(
    (preset) => preset.value.toLowerCase() === draft.accent.toLowerCase(),
  );
  const onMobile = viewport === "mobile";
  const sameOnMobile = !draft.templateMobile || draft.templateMobile === draft.template;
  // The layout this screen shows: on phones, the desktop one until another is picked.
  const shown = onMobile && !sameOnMobile ? draft.templateMobile : draft.template;

  function pick(value: Draft["template"]) {
    if (!onMobile) set("template", value);
    else set("templateMobile", value === draft.template ? "" : value);
  }

  return (
    <>
      <Group
        title={t("design.title")}
        description={t("design.description")}
      >
        <div
          role="radiogroup"
          aria-label={t("design.screen")}
          className="flex gap-1 self-start rounded-lg bg-foreground/[0.06] p-1"
        >
          {(
            [
              { value: "desktop", label: t("design.desktop"), icon: Monitor },
              { value: "mobile", label: t("design.mobile"), icon: Smartphone },
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
              <span className="text-sm font-medium">{t("design.sameAsDesktop")}</span>
              <span className="text-xs text-muted-foreground">{t("design.sameAsDesktopHint")}</span>
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
          aria-label={onMobile ? t("design.onMobile") : t("design.onDesktop")}
          className={cn("grid grid-cols-3 gap-3", onMobile && sameOnMobile && "pointer-events-none opacity-50")}
          aria-disabled={onMobile && sameOnMobile}
        >
          {SITE_TEMPLATES.map((option) => {
            const active = shown === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={onMobile && sameOnMobile ? -1 : undefined}
                onClick={() => pick(option)}
                className={cn(CHOICE, active ? CHOICE_ON : CHOICE_OFF)}
              >
                <TemplateSketch template={option} />
                <span className="text-sm font-medium">{t(`templates.${option}.label`)}</span>
              </button>
            );
          })}
        </div>
        {shown && <p className="text-sm text-muted-foreground">{t(`templates.${shown}.description`)}</p>}
      </Group>

      <Group
        title={t("color.title")}
        description={t("color.description")}
      >
        <div
          role="radiogroup"
          aria-label={t("color.title")}
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
                aria-label={t(`accents.${preset.name}`)}
                title={t(`accents.${preset.name}`)}
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
            title={t("color.custom")}
          >
            <span className="sr-only">{t("color.custom")}</span>
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
            aria-label={t("color.code")}
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
              t("color.picker")
            ) : (
              <span className="text-destructive">{t("color.format")}</span>
            )}
          </span>
        </div>
      </Group>

      <Group title={t("fontsTitle")}>
        <div
          role="radiogroup"
          aria-label={t("fontsTitle")}
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
                  <span className="text-sm font-medium">{t(`fonts.${pair.value}.label`)}</span>
                  <span className="text-xs leading-snug text-muted-foreground">
                    {t(`fonts.${pair.value}.description`)}
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
  const t = useTranslations("portalEditor.cover");
  const tc = useTranslations("common");
  const tSite = useTranslations("site.portal");
  const inputRef = useRef<HTMLInputElement>(null);
  const usesMosaic = draft.template === "mosaico" || draft.templateMobile === "mosaico";

  return (
    <>
      {usesMosaic && (
        <Group
          title={t("mosaicTitle")}
          description={t("mosaicDescription")}
        >
          <MosaicPicker
            value={draft.mosaicPhotos}
            onChange={(urls) => set("mosaicPhotos", urls)}
            properties={properties}
          />
        </Group>
      )}

      <Group
        title={t("photoTitle")}
        description={t("photoDescription")}
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-foreground/[0.05]">
          {draft.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={draft.coverUrl}
              alt={t("current")}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <ImagePlus className="size-6" strokeWidth={1.5} />
              {t("none")}
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
            {draft.coverUrl ? t("change") : t("upload")}
          </button>
          {draft.coverUrl && (
            <button
              type="button"
              onClick={() => set("coverUrl", "")}
              className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Trash2 className="size-4" />
              {t("remove")}
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

      <Group title={t("texts")}>
        <TextField
          id="heroTitle"
          label={t("heroTitle")}
          value={draft.heroTitle}
          onChange={(value) => set("heroTitle", value)}
          placeholder={tSite("defaultHeroTitle")}
          maxLength={120}
          hint={t("heroTitleHint")}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="heroSubtitle" className="text-sm font-medium">
            {t("heroSubtitle")}{" "}
            <span className="font-normal text-muted-foreground">
              {tc("optional")}
            </span>
          </label>
          <Textarea
            id="heroSubtitle"
            rows={3}
            maxLength={240}
            value={draft.heroSubtitle}
            placeholder={t("heroSubtitlePlaceholder")}
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
  const t = useTranslations("portalEditor.blocksPanel");
  return (
    <Group
      title={t("title")}
      description={t("description")}
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
  const t = useTranslations("portalEditor.agency");
  return (
    <>
      <Group
        title={t("aboutTitle")}
        description={t("aboutDescription")}
      >
        <label className="flex items-center justify-between gap-4 rounded-xl bg-foreground/[0.04] px-4 py-3.5">
          <span className="text-sm font-medium">
            {t("showAbout")}
          </span>
          <Switch
            checked={draft.showAbout}
            onCheckedChange={(checked) => set("showAbout", checked)}
          />
        </label>
        <RichTextEditor
          ariaLabel={t("aboutLabel")}
          value={draft.about}
          placeholder={t("aboutPlaceholder")}
          onChange={(html) => set("about", html)}
          contentClassName="min-h-36"
        />
      </Group>

      <Group
        title={t("contactTitle")}
        description={t("contactDescription")}
      >
        <TextField
          id="whatsapp"
          label="WhatsApp"
          type="tel"
          value={draft.whatsapp}
          onChange={(value) => set("whatsapp", value)}
          placeholder="+54 9 11 5555-1234"
          hint={t("whatsappHint")}
          maxLength={40}
        />
        <TextField
          id="phone"
          label={t("phone")}
          type="tel"
          value={draft.phone}
          onChange={(value) => set("phone", value)}
          maxLength={40}
        />
        <TextField
          id="address"
          label={t("address")}
          value={draft.address}
          onChange={(value) => set("address", value)}
          maxLength={200}
        />
        <TextField
          id="instagram"
          label="Instagram"
          value={draft.instagram}
          onChange={(value) => set("instagram", value)}
          placeholder={t("instagramPlaceholder")}
          maxLength={100}
        />
      </Group>
    </>
  );
}
