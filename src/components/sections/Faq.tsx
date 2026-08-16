"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Container, Section } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * FAQ accordion.
 *
 * Radix handles the roving focus, `aria-expanded`, and panel association.
 * The open/close animation is CSS driven by Radix's own data attributes rather
 * than JavaScript height measurement, which keeps it off the main thread.
 */
export function Faq({ dict }: { dict: Dictionary }) {
  return (
    <Section className="bg-bg-subtle">
      <Container width="narrow">
        <Reveal>
          <h2 className="text-[length:var(--text-display-sm)]">{dict.contact.faqTitle}</h2>
        </Reveal>

        <Accordion.Root type="single" collapsible className="mt-10">
          {dict.faq.map((item) => (
            <Accordion.Item
              key={item.question}
              value={item.question}
              className="border-border border-b"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group hover:text-accent flex w-full items-center justify-between gap-6 py-6 text-start transition-colors">
                  <span className="font-display text-[length:var(--text-title)]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className="text-text-subtle size-5 shrink-0 transition-transform duration-[var(--duration-fast)] group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                <p className="text-text-muted pb-6">{item.answer}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Container>
    </Section>
  );
}
