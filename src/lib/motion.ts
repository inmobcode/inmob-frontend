/**
 * Shared motion tokens. Every animation takes its duration and ease from
 * here so the whole product moves like one family.
 */

export const duration = {
  /** Hover, press, toggles. */
  micro: 0.18,
  /** Small reveals, menus, tooltips. */
  base: 0.35,
  /** Page and section transitions, reorders. */
  macro: 0.7,
} as const;

export const ease = {
  /** Elements entering the screen. */
  out: "power3.out",
  /** Elements leaving the screen. */
  in: "power2.in",
  /** Moves between two on-screen states. */
  inOut: "power3.inOut",
  /** Playful settle, for rare emphasis. */
  spring: "back.out(1.4)",
} as const;

/** Delay between items in a staggered entrance. */
export const stagger = {
  tight: 0.04,
  base: 0.08,
} as const;

/**
 * Stagger for a grid of cards: every card in a row enters together and the rows
 * follow one after another, so the cards in the later columns don't trail behind.
 */
export const rowStagger = { each: 0.08, grid: "auto", axis: "y" } as const;

/** Distance (px) for slide-in reveals. */
export const distance = {
  sm: 8,
  md: 20,
  lg: 40,
} as const;

/** matchMedia conditions for gsap.matchMedia(). */
export const media = {
  reduceMotion: "(prefers-reduced-motion: reduce)",
  allowMotion: "(prefers-reduced-motion: no-preference)",
} as const;
