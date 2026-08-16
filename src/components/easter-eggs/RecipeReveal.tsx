"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { KhatamStar } from "@/components/ui/Ornament";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { spring } from "@/lib/motion/tokens";

/**
 * Hidden recipe card.
 *
 * A subtly marked phrase in the story opens a small handwritten-feeling card.
 * The best Easter eggs flatter the person who finds them, and this one can only
 * be found by someone actually reading the page — which is exactly the visitor
 * worth rewarding.
 *
 * A real <button> rather than a styled span, so it is keyboard reachable and
 * announced as expandable rather than being a trap for anyone not using a mouse.
 */
export function RecipeReveal({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group text-text-muted decoration-accent/40 hover:text-accent inline-flex items-center gap-2 underline decoration-dotted underline-offset-[6px] transition-colors"
      >
        <KhatamStar className="text-accent size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        {dict.about.recipeTrigger}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring.gentle}
            className="overflow-hidden"
          >
            <div className="border-accent/30 bg-accent-subtle/10 mt-5 rounded-[1.25rem] border p-6">
              <p className="font-display text-text-subtle text-xs tracking-[0.2em] uppercase">
                {dict.about.recipeTitle}
              </p>
              <p className="font-display mt-3 text-[length:var(--text-title)] leading-relaxed">
                {dict.about.recipeBody}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
