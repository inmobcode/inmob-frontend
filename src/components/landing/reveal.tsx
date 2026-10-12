"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Children marked with `data-reveal` settle in as the block scrolls into view.
 * Without motion (reduced-motion users) everything simply stays where it is.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "ul";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from("[data-reveal]", {
          opacity: 0,
          y: distance.lg,
          duration: duration.macro,
          ease: ease.out,
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
