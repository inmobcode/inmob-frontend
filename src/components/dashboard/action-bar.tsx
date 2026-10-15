"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media } from "@/lib/motion";
import { useActionBarStore } from "@/lib/store/action-bar-store";

function UnsavedChip() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from(ref.current, {
          opacity: 0,
          x: distance.sm,
          duration: duration.base,
          ease: ease.out,
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  // The words only fit on very wide screens; otherwise the bar would wrap into two rows
  // just to say it. Below that, an amber dot says it and the tooltip spells it out.
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span ref={ref} className="mr-1 inline-flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <span aria-hidden className="size-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
          <span className="sr-only 2xl:not-sr-only">Cambios sin guardar</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        Cambios sin guardar
      </TooltipContent>
    </Tooltip>
  );
}

/** The save shortcut as this computer writes it. Only read while the tooltip is open, so in the browser. */
function SaveShortcut() {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  return (
    <kbd data-slot="kbd" className="rounded-sm bg-background/20 px-1.5 font-sans">
      {mac ? "⌘ S" : "Ctrl S"}
    </kbd>
  );
}

export function ActionBar() {
  const {
    title,
    back,
    navigation,
    extra,
    isSubmitting,
    isDirty,
    canSubmit,
    onSave,
    onPublish,
    onCancel,
    saveLabel,
    publishLabel,
  } = useActionBarStore();
  const barRef = useRef<HTMLDivElement>(null);
  const visible = Boolean(title || navigation || onSave || onPublish);

  // The bar drops in when a form page registers its actions.
  useGSAP(
    () => {
      if (!visible) return;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from(barRef.current, {
          y: -distance.md,
          opacity: 0,
          duration: duration.base,
          ease: ease.out,
        });
      });
      return () => mm.revert();
    },
    { dependencies: [visible] },
  );

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      className="sticky top-16 z-20 mx-4 mt-3 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-card/75 px-5 py-3 shadow-[0_8px_32px_-12px_oklch(0.3_0.05_160/0.2)] ring-1 ring-foreground/5 backdrop-blur-md sm:mx-6 md:top-4 md:mt-4 lg:mr-12"
    >
      <div className="flex min-w-0 items-center gap-3">
        {back && (
          <>
            <Button variant="ghost" asChild className="gap-1.5 px-2.5">
              <Link href={back.href} aria-label={back.label}>
                <ArrowLeft />
                <span className="hidden sm:inline">{back.label}</span>
              </Link>
            </Button>
            <span aria-hidden className="h-6 w-px bg-foreground/10" />
          </>
        )}
        {navigation ?? (
          <h2 className="font-display text-2xl leading-none tracking-tight">
            {title}
          </h2>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {extra}
        {isDirty && <UnsavedChip />}
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        {onSave && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={onSave}
                disabled={!canSubmit || isSubmitting}
              >
                {saveLabel}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              {saveLabel}
              <SaveShortcut />
            </TooltipContent>
          </Tooltip>
        )}
        {onPublish && (
          <Button onClick={onPublish} disabled={!canSubmit || isSubmitting}>
            {publishLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
