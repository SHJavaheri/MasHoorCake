import type { Transition, Variants } from "motion/react";

/**
 * The site's single animation vocabulary.
 *
 * Every animation — CSS or Motion — draws its easing and duration from here.
 * Inconsistent easing across a site is the clearest tell of an amateur build:
 * individually fine transitions that collectively feel unrelated.
 *
 * Mirrors the `--ease-*` and `--duration-*` custom properties in globals.css.
 */

/** Decelerating. For things arriving: reveals, entrances, opening panels. */
export const easeEntrance = [0.16, 1, 0.3, 1] as const;

/** Accelerating. For things leaving — exits should feel quicker than entrances. */
export const easeExit = [0.4, 0, 1, 1] as const;

/** Symmetric. For state changes that are neither arrival nor departure. */
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const duration = {
  instant: 0.12,
  fast: 0.24,
  base: 0.4,
  slow: 0.7,
} as const;

/** Springs for anything the user is directly manipulating. */
export const spring = {
  /** Snappy, minimal overshoot. Buttons, chips, toggles. */
  responsive: { type: "spring", stiffness: 400, damping: 30 },
  /** Softer. Cards, hover lifts, layout shifts. */
  gentle: { type: "spring", stiffness: 260, damping: 28 },
  /** Heavier, for large surfaces travelling a long way: modals, sheets. */
  surface: { type: "spring", stiffness: 210, damping: 30 },
} satisfies Record<string, Transition>;

export const transition = {
  entrance: { duration: duration.base, ease: easeEntrance },
  fast: { duration: duration.fast, ease: easeEntrance },
  exit: { duration: duration.fast, ease: easeExit },
} satisfies Record<string, Transition>;

/**
 * Shared reveal variants. The translate distance is deliberately small — a
 * long travel reads as a slideshow, not as craft.
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transition.entrance },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/**
 * Reduced-motion equivalents. Nothing translates or scales; only opacity moves.
 * `MotionProvider` swaps these in globally rather than each component branching.
 */
export const reducedRevealVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.fast } },
};
