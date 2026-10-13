"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
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

  return (
    <span
      ref={ref}
      className="mr-2 hidden items-center gap-2 text-sm text-muted-foreground sm:inline-flex"
    >
      <span className="size-2 rounded-full bg-amber-500" />
      Cambios sin guardar
    </span>
  );
}

export function ActionBar() {
  const {
    title,
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
      {navigation ?? (
        <h2 className="font-display text-2xl leading-none tracking-tight">
          {title}
        </h2>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {extra}
        {isDirty && <UnsavedChip />}
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        {onSave && (
          <Button
            variant="outline"
            onClick={onSave}
            disabled={!canSubmit || isSubmitting}
          >
            {saveLabel}
          </Button>
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
