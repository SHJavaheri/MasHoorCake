"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { CandlelightOverlay } from "./CandlelightOverlay";

/**
 * Entry point for the candlelight Easter egg.
 *
 * Gated on three things, all of which matter:
 *   - Dark mode only. The effect is a pool of warm light in a dark room; in
 *     light mode there is nothing to reveal and it just looks broken.
 *   - Fine pointer only. With a finger, the light hides under the hand that is
 *     controlling it, and there is no hover state to discover it with.
 *   - Not under `prefers-reduced-motion`. A large element tracking the cursor
 *     is precisely what that preference exists to prevent.
 *
 * The candle icon simply does not render when the gates fail, rather than
 * rendering disabled — an inert control is worse than an absent one.
 */
export function CandlelightToggle() {
  const { resolvedTheme } = useTheme();
  const [active, setActive] = useState(false);

  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const eligible = finePointer && !reducedMotion;

  const isDark = resolvedTheme === "dark";

  // Leaving dark mode while lit would strand the overlay over a light page.
  // Handled during render, so the overlay is never painted over a light theme.
  const [renderedDark, setRenderedDark] = useState(isDark);
  if (isDark !== renderedDark) {
    setRenderedDark(isDark);
    if (!isDark) setActive(false);
  }

  if (!isDark || !eligible) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setActive((v) => !v)}
        aria-pressed={active}
        aria-label={active ? "Blow out the candle" : "Light a candle"}
        className="text-text-subtle hover:text-accent inline-flex size-8 items-center justify-center rounded-full transition-colors"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
          {/* Flame — filled once lit, outlined when not. */}
          <path
            d="M12 3c0 2.5 2.5 3.5 2.5 6a2.5 2.5 0 1 1-5 0c0-1 .5-1.8 1-2.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill={active ? "currentColor" : "none"}
          />
          <rect
            x="9"
            y="12"
            width="6"
            height="9"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      </button>

      {active && <CandlelightOverlay onExit={() => setActive(false)} />}
    </>
  );
}
