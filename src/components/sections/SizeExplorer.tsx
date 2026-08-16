"use client";

import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { saveIntent } from "@/lib/order/intent";
import { spring } from "@/lib/motion/tokens";
import { useRouter } from "next/navigation";

/**
 * Interactive size guide.
 *
 * "How big do I need?" is the first question every customer asks and the one
 * most bakery sites answer with a table nobody reads. Showing the cake at scale
 * beside a familiar reference, with the serving count updating live, answers it
 * in about two seconds.
 *
 * TODO(content): confirm the diameters and serving counts against the baker's
 * actual tins and portion sizes.
 */

/** Standard tin sizes, largest at the base. Servings assume dessert portions. */
const TIER_SIZES = [
  { diameter: 11, servings: 50 },
  { diameter: 9, servings: 32 },
  { diameter: 7, servings: 18 },
  { diameter: 5, servings: 8 },
];

const MAX_TIERS = 4;

export function SizeExplorer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [tiers, setTiers] = useState(2);
  const router = useRouter();

  // Tiers build downward from the smallest, so a 2-tier cake is the bottom two.
  const active = TIER_SIZES.slice(MAX_TIERS - tiers);
  const servings = active.reduce((total, tier) => total + tier.servings, 0);
  const widest = TIER_SIZES[0].diameter;

  function handleEnquire() {
    saveIntent({ tiers, servings });
    router.push(localePath(locale, "/order"));
  }

  return (
    <Section id="sizes" className="bg-bg-subtle">
      <Container>
        <Reveal>
          <h2 className="max-w-2xl text-[length:var(--text-display-md)]">
            {dict.cakes.sizeTitle}
          </h2>
          <p className="text-text-muted mt-5 max-w-xl">{dict.cakes.sizeIntro}</p>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          {/* Scale drawing. A silhouette gives the diagram a familiar reference,
              without which "9 inches" means nothing to most people. */}
          <div className="border-border bg-surface flex min-h-[22rem] items-end justify-center gap-8 rounded-[2rem] border p-8 sm:min-h-[26rem]">
            <div className="flex flex-col items-center justify-end">
              {active.map((tier, index) => {
                const widthPercent = (tier.diameter / widest) * 100;
                return (
                  <motion.div
                    key={tier.diameter}
                    layout
                    initial={{ opacity: 0, scaleX: 0.7 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={spring.gentle}
                    style={{ width: `${widthPercent * 2.4}px` }}
                    className="border-border-strong bg-surface-sunken text-text-subtle flex h-12 items-center justify-center border text-xs first:rounded-t-lg last:rounded-b-lg sm:h-14"
                  >
                    {tier.diameter}&quot;
                    {index === 0 && <span className="sr-only"> top tier</span>}
                  </motion.div>
                );
              })}
              <div
                aria-hidden="true"
                className="bg-border-strong mt-1 h-1.5 w-[280px] rounded-full"
              />
            </div>

            {/* Human silhouette at ~1:12 scale for size reference. */}
            <svg
              viewBox="0 0 40 160"
              aria-hidden="true"
              className="text-border-strong h-40 w-10 shrink-0 self-end opacity-60"
              fill="currentColor"
            >
              <circle cx="20" cy="14" r="10" />
              <path d="M8 30h24l4 62h-9l-2 66h-6l-2-50h-4l-2 50h-6l-2-66H4Z" />
            </svg>
          </div>

          <div>
            <div className="border-border flex items-center justify-between gap-6 border-b pb-6">
              <span className="font-display text-[length:var(--text-title)]">
                {dict.cakes.tiersLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTiers((t) => Math.max(1, t - 1))}
                  disabled={tiers <= 1}
                  aria-label={`${dict.cakes.tiersLabel}: ${tiers - 1}`}
                  className="border-border hover:border-accent disabled:hover:border-border inline-flex size-11 items-center justify-center rounded-full border transition-colors disabled:opacity-30"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span
                  className="font-display w-10 text-center text-2xl tabular-nums"
                  aria-live="polite"
                >
                  {tiers}
                </span>
                <button
                  type="button"
                  onClick={() => setTiers((t) => Math.min(MAX_TIERS, t + 1))}
                  disabled={tiers >= MAX_TIERS}
                  aria-label={`${dict.cakes.tiersLabel}: ${tiers + 1}`}
                  className="border-border hover:border-accent disabled:hover:border-border inline-flex size-11 items-center justify-center rounded-full border transition-colors disabled:opacity-30"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="py-8">
              <p className="text-text-subtle text-sm">{dict.cakes.servingsLabel}</p>
              <p
                className="font-display text-[length:var(--text-display-lg)] tabular-nums"
                aria-live="polite"
              >
                {servings}
                <span className="text-text-muted ms-3 text-[length:var(--text-title)]">
                  {dict.common.servings}
                </span>
              </p>
              <p className="text-text-muted mt-3 text-sm">
                {active.map((t) => `${t.diameter}"`).join(" + ")}
              </p>
            </div>

            <p className="border-border text-text-subtle border-t pt-6 text-sm">
              {dict.cakes.sizeNote}
            </p>

            <Button onClick={handleEnquire} className="mt-8">
              {dict.cakes.orderThis}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
