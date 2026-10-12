"use client";

import { Minus, Plus, Search, X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function parse(value: string | undefined) {
  const text = value ?? "";
  const parsed = Number(text.replace(",", "."));
  return text.trim() === "" || Number.isNaN(parsed) ? null : parsed;
}

/** A number field with − / + buttons. The value stays a string, like the rest of the form. */
export function Stepper({
  id,
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}) {
  const current = parse(value);

  function bump(direction: 1 | -1) {
    const base = current ?? (direction === 1 ? min - step : min);
    const next = Math.min(max, Math.max(min, base + direction * step));
    onChange(String(Math.round(next * 100) / 100));
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label={`Disminuir ${label.toLowerCase()}`}
        onClick={() => bump(-1)}
        disabled={current !== null && current <= min}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-muted-foreground transition-colors outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <Input
        id={id}
        inputMode="decimal"
        value={value ?? ""}
        placeholder="0"
        onChange={(event) => onChange(event.target.value.replace(/[^\d.,]/g, ""))}
        className="min-w-0 text-center tabular-nums"
      />
      <button
        type="button"
        aria-label={`Aumentar ${label.toLowerCase()}`}
        onClick={() => bump(1)}
        disabled={current !== null && current >= max}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-muted-foreground transition-colors outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

/** Text input with a unit shown inside on the right (e.g. m²). */
export function UnitInput({
  unit,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { unit: string }) {
  return (
    <div className="relative">
      <Input inputMode="decimal" className={cn("pr-12", className)} {...props} />
      <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs text-muted-foreground">
        {unit}
      </span>
    </div>
  );
}

/**
 * Chips input over a comma-separated string, so it plugs into fields that are
 * stored as "1, 2, 3". Enter, comma or leaving the field adds the typed value.
 */
export function TagsInput({
  id,
  value,
  onChange,
  placeholder,
  validate = () => true,
  label,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  validate?: (tag: string) => boolean;
  label: string;
}) {
  const [draft, setDraft] = useState("");
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  function commit(raw: string) {
    const tag = raw.trim();
    setDraft("");
    if (!tag || !validate(tag) || tags.includes(tag)) return;
    onChange([...tags, tag].join(", "));
  }

  function remove(tag: string) {
    onChange(tags.filter((item) => item !== tag).join(", "));
  }

  return (
    <div
      className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border border-transparent bg-foreground/[0.07] px-2 py-1.5 transition-[background-color,box-shadow,border-color] duration-300 ease-out focus-within:border-primary/20 focus-within:bg-card focus-within:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] dark:bg-foreground/10 dark:focus-within:bg-card"
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex h-6 items-center gap-1 rounded-full bg-primary pr-1 pl-2.5 text-xs font-medium text-primary-foreground"
        >
          {tag}
          <button
            type="button"
            aria-label={`Quitar ${tag}`}
            onClick={() => remove(tag)}
            className="flex size-4 items-center justify-center rounded-full outline-none hover:bg-primary-foreground/20 focus-visible:ring-2 focus-visible:ring-primary-foreground/60"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        aria-label={label}
        value={draft}
        placeholder={tags.length === 0 ? placeholder : undefined}
        onChange={(event) => {
          const next = event.target.value;
          if (next.endsWith(",")) commit(next.slice(0, -1));
          else setDraft(next);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit(draft);
          } else if (event.key === "Backspace" && !draft && tags.length > 0) {
            remove(tags[tags.length - 1]);
          }
        }}
        onBlur={() => commit(draft)}
        className="h-6 min-w-24 flex-1 bg-transparent px-1.5 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

/** Multi-select as toggleable chips. `labels` translates option values for display only. */
export function ChipToggleGroup({
  options,
  value,
  onChange,
  labels = {},
  label,
  counts,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  labels?: Record<string, string>;
  label: string;
  /** Optional number shown after each option. */
  counts?: Record<string, number>;
}) {
  function toggle(option: string) {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  }

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(option)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
            )}
          >
            {labels[option] ?? option}
            {counts && (
              <span className={cn("text-xs tabular-nums", active ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                {counts[option] ?? 0}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * A long multi-select: search box, a counter of what is chosen, and only the
 * first options shown until you ask for more. Chosen options are always visible.
 */
export function ChipPicker({
  options,
  value,
  onChange,
  labels = {},
  label,
  limit = 14,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  labels?: Record<string, string>;
  label: string;
  limit?: number;
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const term = query.trim().toLowerCase();
  const matches = options.filter(
    (option) =>
      !term || (labels[option] ?? option).toLowerCase().includes(term) || option.toLowerCase().includes(term),
  );
  const collapsed = !term && !expanded;
  const visible = collapsed ? matches.filter((option, index) => value.includes(option) || index < limit) : matches;
  const hidden = matches.length - visible.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar"
            aria-label={`Buscar en ${label.toLowerCase()}`}
            className="rounded-full pl-10"
          />
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">
          {value.length === 0 ? "Ninguna seleccionada" : `${value.length} seleccionada${value.length === 1 ? "" : "s"}`}
        </p>
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <ChipToggleGroup label={label} options={visible} value={value} onChange={onChange} labels={labels} />
      ) : (
        <p className="text-sm text-muted-foreground">Nada coincide con «{query}».</p>
      )}

      {!term && matches.length > limit && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="w-fit text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:underline"
        >
          {expanded ? "Ver menos" : `Ver ${hidden} más`}
        </button>
      )}
    </div>
  );
}
