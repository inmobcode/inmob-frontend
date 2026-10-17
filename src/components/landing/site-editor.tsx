"use client";

import { Eye, EyeOff, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";

import { SECTION, WRAP } from "@/components/landing/layout";
import { Heading } from "@/components/landing/sections";
import { SitePreview } from "@/components/landing/site-preview";
import { ACCENT_PRESETS, FONT_PAIRS, SITE_TEMPLATES } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

const BLOCKS = [
  { id: "promo", name: "Promoción" },
  { id: "location", name: "Ubicación" },
  { id: "featured", name: "Destacadas" },
] as const;

type BlockId = (typeof BLOCKS)[number]["id"];

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-quiet">{children}</p>;
}

/** The editor drawn wide: controls on the left, the agency's site reacting on the right. */
function EditorFragment() {
  const [template, setTemplate] = useState(0);
  const [accent, setAccent] = useState(ACCENT_PRESETS[1].value);
  const [fonts, setFonts] = useState(0);
  const [shown, setShown] = useState<Record<BlockId, boolean>>({
    promo: true,
    location: true,
    featured: true,
  });

  const [phone, setPhone] = useState(false);
  const pair = FONT_PAIRS[fonts];

  return (
    <div className="grid overflow-hidden rounded-2xl border border-paper/15 lg:grid-cols-[17rem_1fr]">
      <div className="flex flex-col gap-6 border-b border-line bg-white p-5 text-ink lg:border-r lg:border-b-0">
        <div className="flex flex-col gap-2">
          <PanelLabel>Plantilla</PanelLabel>
          <div className="flex flex-wrap gap-1.5">
            {SITE_TEMPLATES.map((item, index) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={template === index}
                onClick={() => setTemplate(index)}
                className={cn(
                  "h-8 rounded-md border px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-forest",
                  template === index
                    ? "border-forest bg-forest text-paper"
                    : "border-line text-quiet hover:text-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-xs leading-snug text-quiet/80">
            {SITE_TEMPLATES[template].description}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <PanelLabel>Color</PanelLabel>
          <div className="flex flex-wrap gap-2">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                aria-label={preset.label}
                aria-pressed={accent === preset.value}
                onClick={() => setAccent(preset.value)}
                style={{ backgroundColor: preset.value }}
                className={cn(
                  "size-6 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
                  accent === preset.value && "ring-2 ring-ink ring-offset-2",
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <PanelLabel>Tipografía</PanelLabel>
          <div className="flex flex-wrap gap-1.5">
            {FONT_PAIRS.map((item, index) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={fonts === index}
                onClick={() => setFonts(index)}
                className={cn(
                  "h-8 rounded-md border px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-forest",
                  fonts === index
                    ? "border-forest bg-forest text-paper"
                    : "border-line text-quiet hover:text-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-xs leading-snug text-quiet/80">
            {pair.description}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <PanelLabel>Bloques</PanelLabel>
          <ul>
            {BLOCKS.map((block) => (
              <li key={block.id} className="border-t border-line">
                <button
                  type="button"
                  aria-pressed={shown[block.id]}
                  onClick={() =>
                    setShown((current) => ({
                      ...current,
                      [block.id]: !current[block.id],
                    }))
                  }
                  className="flex w-full items-center justify-between py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-forest"
                >
                  <span className={cn(!shown[block.id] && "text-quiet")}>
                    {block.name}
                  </span>
                  {shown[block.id] ? (
                    <Eye className="size-4 text-forest" aria-hidden />
                  ) : (
                    <EyeOff className="size-4 text-quiet/50" aria-hidden />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4 bg-paper p-4 text-ink sm:p-6 lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-quiet">
            Probalo: cambiá la plantilla, el color, la tipografía y los bloques.
          </p>
          <div
            role="group"
            aria-label="Tamaño de pantalla"
            className="flex shrink-0 rounded-lg border border-line bg-white p-0.5"
          >
            {(
              [
                [false, Monitor, "Computadora"],
                [true, Smartphone, "Celular"],
              ] as const
            ).map(([value, Icon, label]) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                aria-pressed={phone === value}
                onClick={() => setPhone(value)}
                className={cn(
                  "flex size-7 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-forest",
                  phone === value
                    ? "bg-forest text-paper"
                    : "text-quiet hover:text-ink",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </button>
            ))}
          </div>
        </div>
        {/* A fixed-height viewport: the site scrolls inside it, like a real screen. */}
        <div
          className={cn(
            "mx-auto w-full overflow-hidden border border-line bg-white shadow-sm transition-[max-width,height,border-radius] duration-500 ease-out motion-reduce:transition-none",
            phone
              ? "h-[42rem] max-w-[22rem] rounded-[1.75rem] border-4 border-ink/80"
              : "h-[42rem] max-w-full rounded-xl",
          )}
        >
          <div
            tabIndex={0}
            role="region"
            aria-label="Vista previa del sitio, con scroll"
            className="h-full overflow-y-auto overscroll-contain outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-inset [scrollbar-width:thin]"
          >
            <SitePreview
              state={{
                template,
                accent,
                pair,
                promo: shown.promo,
                location: shown.location,
                featured: shown.featured,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteEditor() {
  return (
    <section
      id="sitio"
      aria-labelledby="sitio-titulo"
      data-nav-dark
      className="scroll-mt-16 bg-forest text-paper"
    >
      <div className={cn(WRAP, SECTION, "flex flex-col gap-14 md:gap-16")}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Heading
            id="sitio-titulo"
            tone="paper"
            claim="Un sitio que parece tuyo."
            rest="Armalo a tu manera, sin pedirle nada a un diseñador."
            className="lg:col-span-7"
          />
          <p className="text-lg leading-relaxed text-pretty text-paper/75 lg:col-span-4 lg:col-start-9">
            Es el portal público de tu agencia, con tu marca y tus propiedades,
            y lo personalizás vos: plantilla, colores, tipografías y bloques.
            Ves cómo queda en computadora, tableta y celular antes de publicar.
          </p>
        </div>

        <EditorFragment />
      </div>
    </section>
  );
}
