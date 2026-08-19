"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";

import { useMounted } from "@/hooks/useMediaQuery";
import { spring } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils/cn";

import { CakeSvg, DARK_CHROME, LIGHT_CHROME } from "@/components/cake-maker/svg/CakeSvg";
import { useDerived, useDesign } from "@/components/cake-maker/CakeMakerProvider";

/**
 * The live cake.
 *
 * A thin wrapper over the pure CakeSvg that supplies the two things the drawing
 * cannot work out for itself: the current theme's chrome colours, and the
 * accessible description built from the summary model.
 */
export function CakePreview({
  idPrefix,
  className,
  animate = true,
  forceLightChrome = false,
  cutaway = false,
}: {
  idPrefix: string;
  className?: string;
  animate?: boolean;
  /** For the PDF and print copies, which are paper rather than a themed page. */
  forceLightChrome?: boolean;
  /** Cut the cake open — used while a filling is being chosen. */
  cutaway?: boolean;
}) {
  const design = useDesign();
  const { summary } = useDerived();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  // Before mount the theme is unknown; the light chrome is the safe default and
  // matches what the server rendered, so there is no hydration mismatch.
  const dark = !forceLightChrome && mounted && resolvedTheme === "dark";
  const chrome = dark ? DARK_CHROME : LIGHT_CHROME;

  const cake = (
    <CakeSvg
      design={design}
      idPrefix={idPrefix}
      chrome={chrome}
      cutaway={cutaway}
      title={summary.headline}
      className={cn("h-full w-full", className)}
    />
  );

  if (!animate) return cake;

  return (
    <motion.div
      layout
      transition={spring.surface}
      className={cn("flex h-full w-full items-end justify-center", className)}
    >
      {cake}
    </motion.div>
  );
}

/**
 * The desktop right-hand column: a persistent canvas, the running estimate, and
 * the way through to the request. Sticky, so it stays with the customer through
 * the whole left-column scroll — which is the entire point of the wide layout.
 */
export function PreviewPane({
  className,
  children,
  cutaway = false,
}: {
  className?: string;
  children?: React.ReactNode;
  cutaway?: boolean;
}) {
  return (
    <aside
      className={cn(
        "border-border bg-bg-subtle rounded-panel flex flex-col border p-6",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 items-end justify-center py-4">
        <CakePreview idPrefix="preview" cutaway={cutaway} className="max-h-[46vh]" />
      </div>
      {children}
    </aside>
  );
}
