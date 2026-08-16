"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";

import type { Cake } from "@/content/schema";
import { taxonomies } from "@/content/taxonomy";
import {
  countActive,
  countFor,
  filterCategories,
  type FilterCategory,
  type FilterState,
} from "@/lib/gallery/filters";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { spring } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils/cn";

const CATEGORY_TERMS: Record<FilterCategory, keyof typeof taxonomies> = {
  occasions: "occasions",
  styles: "styles",
  flavours: "flavours",
  colorFamilies: "colorFamilies",
};

/**
 * Filter chips.
 *
 * Each chip carries the number of cakes it would still leave, and options that
 * would return nothing are disabled rather than hidden. Hiding them makes the
 * interface appear to shift under the user; disabling them explains why.
 */
export function GalleryFilters({
  cakes,
  filters,
  onToggle,
  onClear,
  resultCount,
  locale,
  dict,
}: {
  cakes: Cake[];
  filters: FilterState;
  onToggle: (category: FilterCategory, slug: string) => void;
  onClear: () => void;
  resultCount: number;
  locale: Locale;
  dict: Dictionary;
}) {
  const activeCount = countActive(filters);

  return (
    <div className="space-y-6">
      {filterCategories.map((category) => {
        const terms = taxonomies[CATEGORY_TERMS[category]];
        return (
          <div key={category}>
            <h3 className="font-display text-text-subtle mb-3 text-xs tracking-[0.2em] uppercase">
              {dict.gallery.categories[category]}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {terms.map((term) => {
                const isActive = filters[category].includes(term.slug);
                const available = countFor(cakes, filters, category, term.slug);
                const disabled = !isActive && available === 0;

                return (
                  <li key={term.slug}>
                    <button
                      type="button"
                      onClick={() => onToggle(category, term.slug)}
                      disabled={disabled}
                      aria-pressed={isActive}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm",
                        "transition-colors duration-[var(--duration-fast)]",
                        isActive
                          ? "border-accent bg-accent text-accent-contrast"
                          : "border-border text-text-muted hover:border-accent hover:text-text",
                        disabled && "hover:border-border cursor-not-allowed opacity-35",
                      )}
                    >
                      {term.label[locale]}
                      <span
                        className={cn(
                          "text-xs tabular-nums",
                          isActive ? "opacity-80" : "text-text-subtle",
                        )}
                      >
                        {available}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <div className="border-border flex items-center justify-between gap-4 border-t pt-5">
        {/* Announced politely so filter changes are audible without stealing focus. */}
        <p role="status" aria-live="polite" className="text-text-muted text-sm">
          {dict.gallery.resultCount.replace("{count}", String(resultCount))}
        </p>

        {activeCount > 0 && (
          <motion.button
            type="button"
            onClick={onClear}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring.responsive}
            className="text-text-muted hover:bg-surface hover:text-text inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors"
          >
            <X className="size-3.5" aria-hidden="true" />
            {dict.gallery.clearFilters}
          </motion.button>
        )}
      </div>
    </div>
  );
}
