import Link from "next/link";

import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import { Container, Section } from "@/components/ui/Container";
import { KhatamStar } from "@/components/ui/Ornament";
import { occasions } from "@/content/taxonomy";
import { getAllCakes } from "@/lib/gallery/cakes";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Occasion-led entry points.
 *
 * Most visitors arrive with an occasion in mind, not a flavour or a style, so
 * this is usually the fastest route into relevant work. Nowruz and Yalda in
 * particular are a genuine differentiator: nobody else's bakery site indexes
 * for them, and they carry real seasonal search traffic.
 *
 * Each links into a pre-filtered gallery rather than a separate page, so there
 * is no duplicate content and nothing extra to maintain.
 */
export function OccasionEntry({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const all = getAllCakes();

  const featured = occasions
    .map((occasion) => ({
      occasion,
      count: all.filter((cake) => cake.occasions.includes(occasion.slug)).length,
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <Section className="bg-bg-subtle">
      <Container>
        <Reveal>
          <h2 className="max-w-2xl text-[length:var(--text-display-md)]">
            {dict.home.occasionsTitle}
          </h2>
          <p className="text-text-muted mt-5 max-w-xl">{dict.home.occasionsIntro}</p>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map(({ occasion, count }) => (
            <RevealItem key={occasion.slug}>
              <Link
                href={`${localePath(locale, "/gallery")}?occasions=${occasion.slug}`}
                className="group border-border bg-surface hover:border-accent flex items-center justify-between gap-4 rounded-2xl border px-6 py-5 transition-all duration-[var(--duration-fast)] hover:shadow-[var(--shadow-md)]"
              >
                <span className="flex items-center gap-3">
                  <KhatamStar className="text-accent size-5 opacity-60 transition-opacity group-hover:opacity-100" />
                  <span className="font-display text-[length:var(--text-title)]">
                    {occasion.label[locale]}
                  </span>
                </span>
                <span className="text-text-subtle text-sm tabular-nums">{count}</span>
              </Link>
            </RevealItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
