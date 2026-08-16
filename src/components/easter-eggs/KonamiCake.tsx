"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { spring, transition } from "@/lib/motion/tokens";

const SECRET = "cake";

/**
 * Typing "cake" anywhere lights a candle.
 *
 * Deliberately not confetti. The reward is a small, well-made moment that fits
 * the rest of the site; a burst of particles would read as a different website
 * briefly interrupting this one.
 *
 * Keystrokes are ignored while the user is typing into a field, so the egg can
 * never fire in the middle of filling something in.
 */
export function KonamiCake() {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    let buffer = "";

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key.length !== 1) return;

      buffer = (buffer + event.key.toLowerCase()).slice(-SECRET.length);
      if (buffer === SECRET) {
        buffer = "";
        setLit(true);
        window.setTimeout(() => setLit(false), 3600);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {lit && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={transition.entrance}
          className="border-border bg-surface-raised pointer-events-none fixed inset-x-0 bottom-24 z-70 mx-auto flex w-fit max-w-[90vw] items-center gap-3 rounded-full border px-6 py-3 shadow-[var(--shadow-lg)] lg:bottom-8"
          role="status"
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="text-accent size-5 shrink-0"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M12 2c0 2.5 2.5 3.5 2.5 6a2.5 2.5 0 1 1-5 0C9.5 5.5 12 4.5 12 2Z"
              fill="currentColor"
              initial={{ scale: 0, originY: 1 }}
              animate={{ scale: 1 }}
              transition={spring.responsive}
            />
            <rect x="9" y="11" width="6" height="3" rx="1" fill="currentColor" opacity="0.4" />
            <path
              d="M4 21v-4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4Z"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </motion.svg>
          <span className="text-text-muted text-sm">
            A candle for you. Now you just need the cake.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
