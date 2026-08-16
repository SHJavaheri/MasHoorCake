import Link from "next/link";

import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import { CakeImage } from "@/components/ui/CakeImage";
import { Container, Section } from "@/components/ui/Container";
import type { Cake } from "@/content/schema";
import { findTerm, occasions } from "@/content/taxonomy";
import { imageKey } from "@/lib/gallery/cakes";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Featured work.
 *
 * Deliberately not an even grid. The three cards sit at different vertical
 * offsets so the block reads as a composition rather than a product listing —
 * the difference between a portfolio and a catalogue.
 */
export function SignatureTrio({
  cakes,
  locale,
  dict,
}: {
  cakes: Cake[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (cakes.length === 0) return null;

  // Offsets applied only from `md` up; on mobile everything stacks evenly.
  const offsets = ["md:mt-0", "md:mt-16", "md:mt-6"];

  return (
    <Section>
      <Container width="wide">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="max-w-2xl text-[length:var(--text-display-md)]">
              {dict.home.signatureTitle}
            </h2>
            <p className="text-text-muted mt-5 max-w-lg">{dict.home.signatureIntro}</p>
          </div>
          <Link
            href={localePath(locale, "/gallery")}
            className="group text-text-muted hover:text-accent inline-flex items-center gap-2 text-sm transition-colors"
          >
            {dict.home.viewAll}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            >
              →
            </span>
          </Link>
        </Reveal>

        <Stagger className="mt-14 grid gap-8 md:grid-cols-3">
          {cakes.map((cake, index) => {
            const occasion = findTerm(occasions, cake.occasions[0]);
            return (
              <RevealItem key={cake.slug} className={offsets[index % offsets.length]}>
                <Link
                  href={`${localePath(locale, "/gallery")}?cake=${cake.slug}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-[1.75rem] rounded-tl-[4rem]">
                    <CakeImage
                      name={imageKey(cake.images[0].src)}
                      alt={cake.images[0].alt[locale]}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      imgClassName="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-entrance)] group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="mt-5">
                    <p className="font-display text-text-subtle text-xs tracking-[0.2em] uppercase">
                      {occasion?.label[locale]}
                    </p>
                    <h3 className="group-hover:text-accent mt-2 text-[length:var(--text-title)] transition-colors">
                      {cake.name[locale]}
                    </h3>
                    <p className="text-text-muted mt-1 text-sm">
                      {cake.servings.min}–{cake.servings.max} {dict.common.servings}
                      {cake.priceFrom && ` · ${dict.common.from} $${cake.priceFrom}`}
                    </p>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}
