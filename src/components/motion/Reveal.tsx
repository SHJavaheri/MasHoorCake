"use client";

import { motion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

import { revealVariants, staggerContainer, transition } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before starting. Use sparingly — prefer `Stagger`. */
  delay?: number;
  as?: ElementType;
};

/**
 * Reveals its children once, when scrolled into view.
 *
 * `once: true` matters: elements that re-animate every time they re-enter the
 * viewport feel restless and make scrolling back up unpleasant. The margin
 * fires the animation slightly before the element reaches the fold, so content
 * is already settled by the time it is actually looked at.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={revealVariants}
      transition={{ ...transition.entrance, delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Staggers direct children that use `RevealItem`. Children animate in sequence
 * rather than all at once, which reads as composed rather than mechanical.
 */
export function Stagger({
  children,
  className,
  variants = staggerContainer,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={cn(className)} variants={revealVariants}>
      {children}
    </motion.div>
  );
}
