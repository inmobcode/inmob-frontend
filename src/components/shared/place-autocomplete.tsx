"use client";

import { MapPin, X } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { placeKey } from "@/lib/places";
import { cn } from "@/lib/utils";

const MAX_SUGGESTIONS = 8;

/**
 * A free-text place field that suggests the places it knows as you type
 * (ignoring case and accents). Whatever is typed counts, picked or not; the
 * arrow keys and Enter choose a suggestion, Escape closes the list.
 */
export function PlaceAutocomplete({
  id,
  value,
  onChange,
  places,
  placeholder,
  ariaLabel,
  clearLabel,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  places: string[];
  placeholder?: string;
  ariaLabel?: string;
  clearLabel: string;
  className?: string;
}) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const suggestions = useMemo(() => {
    const term = placeKey(value);
    const matching = term ? places.filter((place) => placeKey(place).includes(term)) : places;
    // Once it's typed exactly, there's nothing left to suggest.
    return matching.filter((place) => placeKey(place) !== term).slice(0, MAX_SUGGESTIONS);
  }, [places, value]);
  const shown = open && suggestions.length > 0;

  function choose(place: string) {
    onChange(place);
    setOpen(false);
    setActive(-1);
  }

  return (
    <div className={cn("relative", className)}>
      <MapPin className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={shown}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={shown && active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        // After a click on a suggestion has had its turn.
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActive((current) => Math.min(current + 1, suggestions.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((current) => Math.max(current - 1, -1));
          } else if (event.key === "Enter" && shown && active >= 0) {
            event.preventDefault();
            choose(suggestions[active]);
          } else if (event.key === "Escape" && shown) {
            // Closes the list without closing the dialog around it.
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
          }
        }}
        className="h-10 rounded-xl pr-9 pl-10"
      />
      {value && (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => onChange("")}
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <X className="size-3.5" />
        </button>
      )}
      {shown && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-64 overflow-y-auto rounded-xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/10"
        >
          {suggestions.map((place, index) => (
            <li
              key={place}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              // mousedown, so the input doesn't lose focus before the click lands.
              onMouseDown={(event) => {
                event.preventDefault();
                choose(place);
              }}
              onMouseEnter={() => setActive(index)}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2",
                index === active ? "bg-foreground/[0.07]" : "hover:bg-foreground/[0.05]",
              )}
            >
              <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
              {place}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
