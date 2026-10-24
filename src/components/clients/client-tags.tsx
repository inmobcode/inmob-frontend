"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { TagsInput } from "@/components/properties/form-controls";
import { cn } from "@/lib/utils";

/** The backend keeps at most this many, of up to 40 characters each (app/schemas/client.py). */
export const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 40;

const CHIP = "inline-flex h-6 max-w-40 shrink-0 items-center rounded-full bg-foreground/[0.06] px-2.5 text-xs font-medium text-foreground/75";

/** Every tag in use, the most used first, to suggest and filter by. */
export function tagsInUse(clients: { tags: string[] }[]) {
  const counts = new Map<string, number>();
  for (const client of clients) for (const tag of client.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
}

/** A client's tags as small chips; past `max`, a "+2" says how many more. */
export function ClientTags({ tags, max = 3, className }: { tags: string[]; max?: number; className?: string }) {
  if (tags.length === 0) return null;
  const shown = tags.slice(0, max);
  const rest = tags.length - shown.length;
  return (
    <span className={cn("flex min-w-0 flex-wrap items-center gap-1", className)}>
      {shown.map((tag) => (
        <span key={tag} className={CHIP} title={tag}>
          <span className="truncate">{tag}</span>
        </span>
      ))}
      {rest > 0 && (
        <span className={CHIP} title={tags.slice(max).join(", ")}>
          +{rest}
        </span>
      )}
    </span>
  );
}

/**
 * Adds and removes tags (Enter or a comma adds, × removes), with the agency's
 * other tags offered underneath for a one-click add.
 */
export function TagEditor({
  value,
  onChange,
  suggestions,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
}) {
  const t = useTranslations("clients.tags");
  const taken = new Set(value.map((tag) => tag.toLocaleLowerCase()));
  const offered = suggestions.filter((tag) => !taken.has(tag.toLocaleLowerCase())).slice(0, 8);
  const full = value.length >= MAX_TAGS;

  return (
    <div className="flex flex-col gap-2.5">
      <TagsInput
        label={t("add")}
        placeholder={t("placeholder")}
        value={value.join(", ")}
        onChange={(next) => onChange(next.split(",").map((tag) => tag.trim()).filter(Boolean))}
        validate={(tag) => !full && tag.length <= MAX_TAG_LENGTH && !taken.has(tag.toLocaleLowerCase())}
      />
      {full ? (
        <p className="text-xs text-muted-foreground">{t("full", { max: MAX_TAGS })}</p>
      ) : (
        offered.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("suggestions")}>
            {offered.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onChange([...value, tag])}
                className="inline-flex h-7 max-w-40 items-center gap-1 rounded-full bg-foreground/[0.06] px-2.5 text-xs font-medium text-muted-foreground transition-colors outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Plus className="size-3 shrink-0" />
                <span className="truncate">{tag}</span>
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}
