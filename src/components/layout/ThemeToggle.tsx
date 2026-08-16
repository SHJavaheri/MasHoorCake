"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";

import { useMounted } from "@/hooks/useMediaQuery";
import { spring } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils/cn";

/**
 * Light/dark toggle.
 *
 * The icon morphs rather than crossfading: the sun's rays retract and the disc
 * slides into a crescent. A crossfade between two icons always reads as two
 * icons; a morph reads as one object changing state.
 *
 * Deliberately a two-state toggle even though the provider supports "system".
 * A three-state control in the header is a puzzle most visitors will not solve;
 * the system default still applies until someone actively chooses.
 */
export function ThemeToggle({ label, className }: { label: string; className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  // The server cannot know the theme, so the icon stays in its neutral state
  // until after hydration. Rendering the wrong icon first is worse than
  // rendering none, and it would also be a hydration mismatch.
  const mounted = useMounted();

  const isDark = resolvedTheme === "dark";

  // Easter egg: rapid toggling earns a wry acknowledgement.
  const clicks = useRef<number[]>([]);
  const [teasing, setTeasing] = useState(false);

  function handleClick() {
    setTheme(isDark ? "light" : "dark");

    const now = Date.now();
    clicks.current = [...clicks.current, now].filter((t) => now - t < 3000);
    if (clicks.current.length >= 5) {
      clicks.current = [];
      setTeasing(true);
      window.setTimeout(() => setTeasing(false), 3200);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        aria-pressed={mounted ? isDark : undefined}
        className={cn(
          "relative inline-flex size-11 items-center justify-center rounded-full",
          "text-text-muted transition-colors duration-[var(--duration-fast)]",
          "hover:bg-surface hover:text-text",
          className,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="size-5"
          aria-hidden="true"
        >
          {/* The disc: full circle in light, offset-masked crescent in dark. */}
          <defs>
            <mask id="theme-toggle-mask">
              <rect width="24" height="24" fill="white" />
              <motion.circle
                cx="24"
                cy="6"
                r="9"
                fill="black"
                animate={{ cx: mounted && isDark ? 17 : 26, cy: mounted && isDark ? 6 : 3 }}
                transition={spring.gentle}
              />
            </mask>
          </defs>

          <motion.circle
            cx="12"
            cy="12"
            r={6}
            fill="currentColor"
            stroke="none"
            mask="url(#theme-toggle-mask)"
            animate={{ r: mounted && isDark ? 9 : 5 }}
            transition={spring.gentle}
          />

          {/* Rays retract into the disc as dark mode engages. */}
          <motion.g
            animate={{
              opacity: mounted && isDark ? 0 : 1,
              rotate: mounted && isDark ? 45 : 0,
              scale: mounted && isDark ? 0.5 : 1,
            }}
            transition={spring.gentle}
            style={{ originX: "12px", originY: "12px" }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="12"
                y1="1.5"
                x2="12"
                y2="3.5"
                transform={`rotate(${angle} 12 12)`}
              />
            ))}
          </motion.g>
        </svg>
      </button>

      {/* Announced politely so it never interrupts, and never traps focus. */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-6 z-50 mx-auto w-fit max-w-[90vw]",
          "border-border bg-surface-raised text-text-muted rounded-full border px-5 py-2.5 text-sm",
          "shadow-[var(--shadow-lg)] transition-opacity duration-[var(--duration-base)]",
          teasing ? "opacity-100" : "opacity-0",
        )}
      >
        {teasing ? "Can't decide? The cake tastes the same in both." : ""}
      </div>
    </>
  );
}
