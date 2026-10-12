"use client";

import { Plus } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { gsap } from "@/lib/gsap";
import { duration, ease, media } from "@/lib/motion";

// Receives the trigger's props (ref, onClick, aria-*) from DialogTrigger's
// `asChild`, so they must be forwarded to the underlying Button.
export function NewItemButton({
  label,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & { label: string }) {
  const iconRef = useRef<SVGSVGElement>(null);

  function spin(rotation: number) {
    if (window.matchMedia(media.reduceMotion).matches) return;
    gsap.to(iconRef.current, { rotation, duration: duration.base, ease: ease.out });
  }

  return (
    <Button
      size="lg"
      className="h-10 gap-2.5 pr-5 pl-1.5"
      {...props}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        spin(90);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        spin(0);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        spin(90);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        spin(0);
      }}
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-highlight text-highlight-foreground">
        <Plus ref={iconRef} className="size-4" strokeWidth={2.5} />
      </span>
      {label}
    </Button>
  );
}
