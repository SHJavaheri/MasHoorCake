"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { fillings, flavours } from "@/content/taxonomy";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { saveIntent } from "@/lib/order/intent";
import { spring, transition } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils/cn";

/**
 * Flavour builder.
 *
 * Pairing suggestions are the point. Anyone can list ingredients; suggesting
 * that saffron belongs with rosewater and pistachio demonstrates that someone
 * with taste is behind the counter, which is most of what justifies the price.
 *
 * TODO(content): confirm these pairings with the baker.
 */
const PAIRINGS: Record<string, string[]> = {
  saffron: ["fresh-cream", "swiss-buttercream"],
  pistachio: ["cream-cheese", "swiss-buttercream"],
  rosewater: ["fresh-cream", "swiss-buttercream"],
  cardamom: ["salted-caramel", "swiss-buttercream"],
  vanilla: ["fruit-compote", "fresh-cream"],
  chocolate: ["ganache", "salted-caramel"],
  citrus: ["cream-cheese", "fruit-compote"],
  coffee: ["salted-caramel", "ganache"],
};

export function FlavourLibrary({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [sponge, setSponge] = useState<string | null>(null);
  const [filling, setFilling] = useState<string | null>(null);
  const router = useRouter();

  const suggested = sponge ? (PAIRINGS[sponge] ?? []) : [];

  const spongeTerm = flavours.find((f) => f.slug === sponge);
  const fillingTerm = fillings.find((f) => f.slug === filling);

  function handleEnquire() {
    saveIntent({
      flavour: spongeTerm?.label[locale],
      filling: fillingTerm?.label[locale],
    });
    router.push(localePath(locale, "/order"));
  }

  return (
    <Section id="flavours">
      <Container>
        <Reveal>
          <h2 className="max-w-2xl text-[length:var(--text-display-md)]">
            {dict.cakes.flavourTitle}
          </h2>
          <p className="text-text-muted mt-5 max-w-xl">{dict.cakes.flavourIntro}</p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <fieldset>
            <legend className="font-display text-text-subtle text-xs tracking-[0.2em] uppercase">
              {dict.cakes.flavourSponge}
            </legend>
            <div className="mt-5 space-y-2">
              {flavours.map((flavour) => {
                const isActive = sponge === flavour.slug;
                return (
                  <button
                    key={flavour.slug}
                    type="button"
                    onClick={() => {
                      setSponge(isActive ? null : flavour.slug);
                      setFilling(null);
                    }}
                    aria-pressed={isActive}
                    className={cn(
                      "w-full rounded-2xl border px-5 py-4 text-start transition-colors duration-[var(--duration-fast)]",
                      isActive
                        ? "border-accent bg-surface"
                        : "border-border hover:border-accent hover:bg-surface",
                    )}
                  >
                    <span className="font-display text-[length:var(--text-title)]">
                      {flavour.label[locale]}
                    </span>
                    {flavour.description && (
                      <span className="text-text-muted mt-1 block text-sm">
                        {flavour.description[locale]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <fieldset>
              <legend className="font-display text-text-subtle text-xs tracking-[0.2em] uppercase">
                {dict.cakes.flavourFilling}
              </legend>
              <div className="mt-5 flex flex-wrap gap-2">
                {fillings.map((item) => {
                  const isActive = filling === item.slug;
                  const isSuggested = suggested.includes(item.slug);
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => setFilling(isActive ? null : item.slug)}
                      aria-pressed={isActive}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-colors duration-[var(--duration-fast)]",
                        isActive
                          ? "border-accent bg-accent text-accent-contrast"
                          : isSuggested
                            ? "border-accent/60 bg-accent-subtle/20 text-text"
                            : "border-border text-text-muted hover:border-accent hover:text-text",
                      )}
                    >
                      {item.label[locale]}
                      {isSuggested && !isActive && (
                        <span className="text-accent ms-1.5 text-xs">★</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {sponge && suggested.length > 0 && (
                <p className="text-text-subtle mt-4 text-sm">
                  ★{" "}
                  {dict.cakes.pairingNote.replace("{flavour}", spongeTerm?.label[locale] ?? "")}
                </p>
              )}
            </fieldset>

            <AnimatePresence>
              {(sponge || filling) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={spring.gentle}
                  className="border-border bg-surface mt-10 rounded-[1.75rem] border p-6"
                >
                  <p className="font-display text-text-subtle text-xs tracking-[0.2em] uppercase">
                    {dict.cakes.yourCombination}
                  </p>
                  <motion.p
                    layout
                    transition={transition.fast}
                    className="font-display mt-3 text-[length:var(--text-display-sm)]"
                  >
                    {[spongeTerm?.label[locale], fillingTerm?.label[locale]]
                      .filter(Boolean)
                      .join(" + ")}
                  </motion.p>
                  <Button onClick={handleEnquire} size="sm" className="mt-6">
                    {dict.cakes.orderThis}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
}
