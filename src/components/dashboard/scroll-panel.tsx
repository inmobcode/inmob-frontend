"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// Each layer blurs a little more than the one above it and is masked to its own
// band, so the blur ramps up smoothly toward the edge (the "progressive blur"
// look of Apple's scroll edge effect) instead of starting with a hard line.
const BLUR_LAYERS = [0.5, 1, 2, 4, 8, 14];

function bandMask(index: number, total: number, direction: "to bottom" | "to top" = "to bottom") {
  const step = 100 / total;
  const start = index * step;
  const stops = [
    `rgba(0,0,0,0) ${start}%`,
    `#000 ${start + step}%`,
    `#000 ${start + step * 2}%`,
    `rgba(0,0,0,0) ${start + step * 3}%`,
  ];
  return `linear-gradient(${direction}, ${stops.join(", ")})`;
}

/** A soft progressive blur along the top or bottom edge, shown while there is content past that edge. */
function BlurEdge({ edge, visible }: { edge: "top" | "bottom"; visible: boolean }) {
  const direction = edge === "top" ? "to top" : "to bottom";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none sticky shrink-0 transition-opacity duration-500 ease-out",
        edge === "top" ? "top-0 z-10 -mb-24 h-24" : "bottom-0 z-20 -mt-28 h-28",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {BLUR_LAYERS.map((blur, index) => (
        <div
          key={blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: bandMask(index, BLUR_LAYERS.length, direction),
            WebkitMaskImage: bandMask(index, BLUR_LAYERS.length, direction),
          }}
        />
      ))}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b",
          edge === "top" ? "from-background/60 to-transparent" : "from-transparent to-background/55",
        )}
      />
    </div>
  );
}

/**
 * The scrolling area of the dashboard. While there is more content below the
 * fold, a soft progressive blur fades in along the bottom edge; it fades out
 * once you reach the end.
 */
export function ScrollPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [moreBelow, setMoreBelow] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    function update() {
      if (!element) return;
      setMoreBelow(element.scrollHeight - element.scrollTop - element.clientHeight > 8);
      setScrolled(element.scrollTop > 8);
    }

    update();
    element.addEventListener("scroll", update, { passive: true });
    // Content grows and shrinks (loading, filtering), so re-check when it does.
    const observer = new ResizeObserver(update);
    observer.observe(element);
    for (const child of Array.from(element.children)) observer.observe(child);
    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      <BlurEdge edge="top" visible={scrolled} />
      {children}
      <BlurEdge edge="bottom" visible={moreBelow} />
    </div>
  );
}

const CORNER = 25;

/**
 * The rounded left corners of the content panel, drawn as two small pieces in
 * the sidebar colour on top of a square scroller. Rounding the scroller itself
 * (overflow clip + border-radius) makes Chrome ignore the masks of the blur
 * layers inside it, so the corners are painted instead of clipped.
 */
export function PanelCorners() {
  const cut = (at: string) =>
    `radial-gradient(circle at ${at}, transparent ${CORNER - 0.5}px, var(--sidebar) ${CORNER}px)`;
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-30 hidden md:block"
        style={{ width: CORNER, height: CORNER, background: cut(`${CORNER}px ${CORNER}px`) }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-30 hidden md:block"
        style={{ width: CORNER, height: CORNER, background: cut(`${CORNER}px 0px`) }}
      />
    </>
  );
}
