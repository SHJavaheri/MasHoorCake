"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Button } from "@/components/ui/Button";
import { CakeImage } from "@/components/ui/CakeImage";
import { KhatamStar } from "@/components/ui/Ornament";
import type { Cake } from "@/content/schema";
import { imageKey } from "@/lib/gallery/cakes";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { easeEntrance } from "@/lib/motion/tokens";

/**
 * Homepage hero.
 *
 * The headline reveals word by word rather than as a block: it makes the first
 * two seconds feel authored, and it gives the eye somewhere to land while the
 * photograph decodes.
 *
 * `100dvh`, not `100vh` — on mobile browsers `vh` ignores the collapsing
 * address bar, so a `100vh` hero jumps as soon as the page is scrolled.
 */
export function Hero({
  cake,
  locale,
  dict,
}: {
  cake: Cake | undefined;
  locale: Locale;
  dict: Dictionary;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The photograph drifts slower than the page, so the layers separate.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const words = dict.home.heroTitle.split(" ");

  return (
    <section ref={ref} className="relative flex min-h-dvh items-center overflow-hidden">
      {cake && (
        <motion.div style={{ y: imageY }} className="absolute inset-0 -z-10 scale-110">
          <CakeImage
            name={imageKey(cake.images[0].src)}
            alt={cake.images[0].alt[locale]}
            // The LCP element: never lazy, always high priority.
            priority
            sizes="100vw"
            className="size-full"
            imgClassName="size-full"
          />
        </motion.div>
      )}

      {/* Warm scrim so the headline holds contrast over any photograph. */}
      <div
        aria-hidden="true"
        className="from-scrim/70 via-scrim/45 to-scrim/80 absolute inset-0 -z-10 bg-gradient-to-b"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-[88rem] px-5 pt-28 pb-24 sm:px-8 lg:px-12"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeEntrance }}
          className="font-display text-on-scrim/80 flex items-center gap-3 text-xs tracking-[0.3em] uppercase"
        >
          <KhatamStar className="size-4" />
          {dict.home.eyebrow}
        </motion.p>

        <h1 className="text-on-scrim mt-6 max-w-4xl text-[length:var(--text-display-xl)]">
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              // inline-block is required for transform to apply to a span.
              className="inline-block"
              initial={{ opacity: 0, y: "0.4em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.07, duration: 0.75, ease: easeEntrance }}
            >
              {word}
              {i < words.length - 1 && " "}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: easeEntrance }}
          className="text-on-scrim/85 mt-7 max-w-xl text-[length:var(--text-title)]"
        >
          {dict.home.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: easeEntrance }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button href={localePath(locale, "/design")} size="lg">
            {dict.home.heroCtaPrimary}
          </Button>
          <Button
            href={localePath(locale, "/gallery")}
            size="lg"
            variant="secondary"
            className="border-on-scrim/30 text-on-scrim hover:border-on-scrim hover:bg-on-scrim/10 hover:text-on-scrim"
          >
            {dict.home.heroCtaSecondary}
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute inset-x-0 bottom-8 flex justify-center"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="text-on-scrim/60 text-xs tracking-[0.25em] uppercase"
        >
          {dict.home.scrollCue}
        </motion.span>
      </motion.div>
    </section>
  );
}
