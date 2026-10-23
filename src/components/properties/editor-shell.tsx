"use client";

import { Check, ChevronDown } from "lucide-react";
import { NavigationMenu } from "radix-ui";
import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SectionTab {
  value: string;
  label: string;
  /** A few words under the label in the menu. */
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SectionGroup {
  label: string;
  tabs: SectionTab[];
}

/**
 * The popover card for one group. It animates in on mount (it is only
 * mounted while open), and a soft highlight glides between the options as
 * the pointer moves over them.
 */
function GroupPanel({
  group,
  active,
  onChange,
}: {
  group: SectionGroup;
  active: string;
  onChange: (value: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const highlightShown = useRef(false);

  // Items cascade in when the menu opens from closed. When moving between
  // groups the viewport slides the panels instead, so skip it.
  useGSAP(
    () => {
      const switching = panelRef.current?.closest("[data-motion]") != null;
      if (switching) return;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from("[data-panel-item]", {
          opacity: 0,
          y: distance.sm,
          duration: duration.base,
          ease: ease.out,
          stagger: stagger.tight,
          delay: 0.06,
        });
      });
      return () => mm.revert();
    },
    { scope: panelRef },
  );

  function moveHighlight(item: HTMLElement) {
    const highlight = highlightRef.current;
    if (!highlight) return;
    const state = { y: item.offsetTop, height: item.offsetHeight, opacity: 1 };
    if (highlightShown.current && !window.matchMedia(media.reduceMotion).matches) {
      gsap.to(highlight, { ...state, duration: duration.micro + 0.06, ease: ease.out, overwrite: true });
    } else {
      gsap.set(highlight, state);
    }
    highlightShown.current = true;
  }

  function hideHighlight() {
    highlightShown.current = false;
    gsap.to(highlightRef.current, { opacity: 0, duration: duration.micro, overwrite: true });
  }

  return (
    <div ref={panelRef} className="p-2">
      <ul className="relative flex flex-col gap-[5px]" onPointerLeave={hideHighlight}>
        <span
          ref={highlightRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 rounded-xl bg-foreground/[0.06] opacity-0"
        />
        {group.tabs.map((tab) => {
          const isActive = tab.value === active;
          return (
            <li key={tab.value} data-panel-item className="relative">
              <NavigationMenu.Link asChild active={isActive}>
                <button
                  type="button"
                  onClick={() => onChange(tab.value)}
                  onPointerEnter={(event) => moveHighlight(event.currentTarget.parentElement as HTMLElement)}
                  onFocus={(event) => moveHighlight(event.currentTarget.parentElement as HTMLElement)}
                  className={cn(
                    "group/item flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                    isActive && "bg-secondary",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover/item:scale-105",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-primary",
                    )}
                  >
                    <tab.icon className="size-4" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className={cn("truncate text-sm", isActive ? "font-semibold" : "font-medium")}>
                      {tab.label}
                    </span>
                    {tab.hint && <span className="truncate text-xs text-muted-foreground">{tab.hint}</span>}
                  </span>
                  {isActive && <Check className="size-4 shrink-0 text-primary" />}
                </button>
              </NavigationMenu.Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Section menu for the action bar: one pill per group; hovering (or tapping)
 * a pill opens a popover with that group's sections. All groups share one
 * viewport, so moving between pills slides the panels and morphs the card's
 * size and position instead of closing and reopening.
 */
export function SectionNavbar({
  groups,
  active,
  onChange,
}: {
  groups: SectionGroup[];
  active: string;
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const items = useRef<Record<string, HTMLLIElement | null>>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  // The shared card follows the pill that is currently open.
  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const item = value ? items.current[value] : null;
      if (!wrap || !item) {
        wasOpen.current = false;
        return;
      }
      const x = item.offsetLeft;
      if (wasOpen.current && !window.matchMedia(media.reduceMotion).matches) {
        gsap.to(wrap, { x, duration: duration.base, ease: ease.inOut, overwrite: true });
      } else {
        gsap.set(wrap, { x });
      }
      wasOpen.current = true;
    },
    { dependencies: [value] },
  );

  return (
    <NavigationMenu.Root
      value={value}
      onValueChange={setValue}
      delayDuration={60}
      skipDelayDuration={400}
      className="relative min-w-0"
    >
      <NavigationMenu.List className="flex flex-wrap items-center gap-1">
        {groups.map((group) => {
          const groupActive = group.tabs.some((tab) => tab.value === active);
          const pillClass = cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            groupActive
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
          );

          // A group with a single section has nothing to open: go straight to it, no chevron.
          if (group.tabs.length === 1) {
            return (
              <NavigationMenu.Item key={group.label} value={group.label}>
                <NavigationMenu.Link asChild active={groupActive}>
                  <button type="button" className={pillClass} onClick={() => onChange(group.tabs[0].value)}>
                    {group.label}
                  </button>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item
              key={group.label}
              value={group.label}
              ref={(node) => {
                items.current[group.label] = node;
              }}
              className="relative"
            >
              <NavigationMenu.Trigger
                className={cn(
                  "group/trigger inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  groupActive
                    ? "bg-primary/10 text-primary hover:bg-primary/15 data-[state=open]:bg-primary/15"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground",
                )}
              >
                {group.label}
                <ChevronDown className="size-3.5 transition-transform duration-300 ease-out group-data-[state=open]/trigger:rotate-180" />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content
                className={cn(
                  "w-72",
                  "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in-0 data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out-0",
                  "data-[motion=from-end]:slide-in-from-right-12 data-[motion=from-start]:slide-in-from-left-12",
                  "data-[motion=to-end]:slide-out-to-right-12 data-[motion=to-start]:slide-out-to-left-12",
                  "data-[motion^=from-]:duration-300 data-[motion^=to-]:duration-300",
                )}
              >
                <GroupPanel group={group} active={active} onChange={onChange} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      <div
        ref={wrapRef}
        className={cn("absolute top-full left-0 z-30 pt-[17px]", value ? "pointer-events-auto" : "pointer-events-none")}
      >
        <NavigationMenu.Viewport
          className={cn(
            "relative h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top-left overflow-hidden rounded-2xl bg-popover",
            "shadow-[0_24px_48px_-16px_oklch(0.3_0.05_160/0.35)] ring-1 ring-foreground/5",
            "transition-[width,height] duration-300 ease-out",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-1 data-[state=open]:duration-200",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150",
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
}
