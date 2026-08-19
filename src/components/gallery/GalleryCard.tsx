"use client";

import { motion } from "motion/react";

import { CakeImage } from "@/components/ui/CakeImage";
import type { Cake } from "@/content/schema";
import { findTerm, occasions } from "@/content/taxonomy";
import { imageKey } from "@/lib/gallery/cakes";
import type { Locale } from "@/lib/i18n/config";
import { spring } from "@/lib/motion/tokens";

/**
 * A single cake in the grid.
 *
 * Hover reveals a light overlay with the essentials; opening the full detail
 * view requires an actual click. Opening a modal on hover fires constantly by
 * accident as the pointer crosses the grid, which is a well-documented
 * frustration — the richness of hover without the misfires.
 *
 * The focus state is styled identically to hover, so keyboard users get exactly
 * the same information rather than a lesser version of it.
 */
export function GalleryCard({
  cake,
  locale,
  onOpen,
  servingsLabel,
  priority,
}: {
  cake: Cake;
  locale: Locale;
  onOpen: () => void;
  servingsLabel: string;
  priority?: boolean;
}) {
  const cover = cake.images[0];
  const occasion = findTerm(occasions, cake.occasions[0]);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      layout
      layoutId={`cake-card-${cake.slug}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={spring.gentle}
      whileHover={{ y: -6 }}
      className="group bg-surface relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-[1.75rem] rounded-tl-[3.5rem] text-start shadow-[var(--shadow-sm)] transition-shadow duration-[var(--duration-base)] hover:shadow-[var(--shadow-lg)] focus-visible:shadow-[var(--shadow-lg)]"
      aria-label={cake.name[locale]}
    >
      {/* layoutId on the image is what makes it fly into the modal. */}
      <motion.div layoutId={`cake-image-${cake.slug}`}>
        <CakeImage
          name={imageKey(cover.src)}
          alt={cover.alt[locale]}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          imgClassName="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-entrance)] group-hover:scale-[1.04]"
        />
      </motion.div>

      {/* Overlay appears on hover and on keyboard focus alike. */}
      <div className="from-scrim/85 via-scrim/20 pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t to-transparent p-6 opacity-0 transition-opacity duration-[var(--duration-base)] group-hover:opacity-100 group-focus-visible:opacity-100">
        <p className="font-display text-on-scrim text-[length:var(--text-title)]">
          {cake.name[locale]}
        </p>
        <p className="text-on-scrim/80 mt-1 text-sm">
          {occasion?.label[locale]}
          {" · "}
          {cake.servings.min} to {cake.servings.max} {servingsLabel}
        </p>
      </div>
    </motion.button>
  );
}
