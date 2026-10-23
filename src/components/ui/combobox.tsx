"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useMemo, useRef, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { placeKey } from "@/lib/places";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

/**
 * A select you can type into: the trigger looks like the app's selects, the
 * list narrows as you type (ignoring case and accents) and works with the
 * arrow keys and Enter. `allValue` is the entry that means "no filter".
 */
export function Combobox({
  id,
  value,
  onChange,
  options,
  allValue,
  allLabel,
  searchPlaceholder,
  emptyText,
  ariaLabel,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  allValue: string;
  allLabel: string;
  searchPlaceholder?: string;
  emptyText?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const t = useTranslations("common.combobox");
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const entries = useMemo<ComboboxOption[]>(() => {
    const term = placeKey(query);
    const matching = term ? options.filter((option) => placeKey(option.label).includes(term)) : options;
    // "All" only while nothing is typed: typing means looking for something.
    return term ? matching : [{ value: allValue, label: allLabel }, ...matching];
  }, [options, query, allValue, allLabel]);

  const selected = value === allValue ? allLabel : (options.find((option) => option.value === value)?.label ?? value);

  function choose(next: string) {
    onChange(next);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, entries.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const picked = entries[active];
      if (picked) choose(picked.value);
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setQuery("");
          setActive(0);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={ariaLabel}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-1.5 rounded-xl border border-transparent bg-foreground/[0.07] py-2 pr-3 pl-3.5 text-sm whitespace-nowrap transition-[background-color,box-shadow,border-color] duration-300 ease-out outline-none select-none hover:bg-foreground/10 focus-visible:border-primary/20 focus-visible:bg-card focus-visible:shadow-[0_8px_24px_-12px_oklch(0.3_0.05_160/0.3)] data-[state=open]:bg-card dark:bg-foreground/10 dark:hover:bg-foreground/15",
            className,
          )}
        >
          <span className="truncate">{selected}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
        className="w-(--radix-popover-trigger-width) min-w-56 gap-1 rounded-2xl p-1.5"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={searchPlaceholder ?? t("search")}
            aria-label={searchPlaceholder}
            aria-controls={listId}
            autoComplete="off"
            className="h-9 w-full rounded-lg bg-foreground/[0.06] pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:bg-foreground/[0.09]"
          />
        </div>
        <ul id={listId} role="listbox" className="max-h-60 overflow-y-auto overscroll-contain">
          {entries.length === 0 && <li className="px-3 py-3 text-sm text-muted-foreground">{emptyText ?? t("empty")}</li>}
          {entries.map((entry, index) => (
            <li key={entry.value} role="option" aria-selected={entry.value === value}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => choose(entry.value)}
                onMouseMove={() => setActive(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm outline-none",
                  index === active && "bg-foreground/[0.07]",
                )}
              >
                <span className="truncate">{entry.label}</span>
                {entry.value === value && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
