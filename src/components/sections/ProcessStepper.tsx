"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Container, Section } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * The four steps from enquiry to collection.
 *
 * A vertical timeline whose connecting line fills as the section is scrolled,
 * so progress through the list and progress through the process are the same
 * gesture. The line is drawn with `scaleY` on a transform origin rather than by
 * animating height, which would trigger layout on every frame.
 */
export function ProcessStepper({ dict }: { dict: Dictionary }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 55%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const steps = dict.process;

  return (
    <Section className="bg-bg-subtle">
      <Container>
        <Reveal>
          <h2 className="max-w-2xl text-[length:var(--text-display-md)]">
            {dict.home.processTitle}
          </h2>
          <p className="text-text-muted mt-5 max-w-xl">{dict.home.processIntro}</p>
        </Reveal>

        <div ref={ref} className="relative mt-16 ps-10 sm:ps-16">
          {/* Track and fill are absolutely positioned on the inline-start edge,
              so the whole timeline mirrors correctly under RTL. */}
          <div
            aria-hidden="true"
            className="bg-border absolute inset-y-0 start-[7px] w-px sm:start-[11px]"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY }}
            className="bg-accent absolute inset-y-0 start-[7px] w-px origin-top sm:start-[11px]"
          />

          <ol className="space-y-14">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <Reveal delay={index * 0.05}>
                  <span
                    aria-hidden="true"
                    className="border-accent bg-bg absolute -start-10 top-1.5 flex size-4 items-center justify-center rounded-full border sm:-start-16 sm:size-6"
                  >
                    <span className="bg-accent size-1.5 rounded-full sm:size-2" />
                  </span>
                  <p className="font-display text-text-subtle text-xs tracking-[0.2em] uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-[length:var(--text-display-sm)]">{step.title}</h3>
                  <p className="text-text-muted mt-3 max-w-xl">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
