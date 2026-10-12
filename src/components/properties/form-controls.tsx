"use client";

import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function parse(value: string) {
  const parsed = Number(value.replace(",", "."));
  return value.trim() === "" || Number.isNaN(parsed) ? null : parsed;
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
        value={value}
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
