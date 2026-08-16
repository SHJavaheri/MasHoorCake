"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Global motion configuration.
 *
 * `reducedMotion="user"` makes Motion honour the OS preference for every
 * animation in the tree: transform and layout animations are dropped while
 * opacity still cross-fades. Handling it once here means no component has to
 * remember to check, which is exactly the kind of thing that gets forgotten in
 * one place and quietly fails an accessibility audit.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
