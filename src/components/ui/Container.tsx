import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

const widths = {
  /** Reading width. Long-form copy should never span the full grid. */
  prose: "max-w-[68ch]",
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-[88rem]",
  full: "max-w-none",
} as const;

/**
 * Horizontal rhythm for the whole site. Gutters widen with the viewport rather
 * than staying fixed, which keeps large screens from feeling like a phone
 * layout stretched sideways.
 */
export function Container({
  children,
  className,
  width = "default",
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  width?: keyof typeof widths;
  as?: ElementType;
}) {
  return (
    <Component className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", widths[width], className)}>
      {children}
    </Component>
  );
}

/**
 * Vertical rhythm. Sections are spaced by content weight, not set to a uniform
 * height — a page of identical 100vh blocks reads as a template.
 */
export function Section({
  children,
  className,
  spacing = "default",
  as: Component = "section",
  id,
}: {
  children: ReactNode;
  className?: string;
  spacing?: "tight" | "default" | "loose";
  as?: ElementType;
  id?: string;
}) {
  const spacings = {
    tight: "py-14 sm:py-20",
    default: "py-20 sm:py-28 lg:py-36",
    loose: "py-28 sm:py-40 lg:py-52",
  } as const;

  return (
    <Component id={id} className={cn(spacings[spacing], className)}>
      {children}
    </Component>
  );
}
