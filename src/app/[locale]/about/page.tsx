import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { RecipeReveal } from "@/components/easter-eggs/RecipeReveal";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import { CakeImage } from "@/components/ui/CakeImage";
import { Container, Section } from "@/components/ui/Container";
import { getAllCakes, imageKey } from "@/lib/gallery/cakes";
import { isLocale, locales, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Params = { locale: string };

export function generateStaticParams(): Params[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.about.title,
    description: dict.aboutStory[0],
    alternates: { canonical: localePath(locale, "/about") },
  };
}

export default async function AboutPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  // TODO(content): replace with real behind-the-bake process photographs.
  const processPhotos = getAllCakes().slice(0, 4);

  return (
    <>
      <PageHeader title={dict.about.title} />

      <Section>
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <Reveal>
            {/* TODO(content): a portrait of the baker belongs here. Trust is
                the whole game for a home business, and a face does more for it
                than any amount of design. */}
            <div className="bg-surface-sunken overflow-hidden rounded-[1.75rem] rounded-tl-[4rem]">
              <CakeImage
                name={imageKey(processPhotos[0].images[0].src)}
                alt={dict.about.portraitAlt}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="text-[length:var(--text-display-sm)]">{dict.about.storyTitle}</h2>
            <div className="text-text-muted mt-6 space-y-5">
              {dict.aboutStory.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            {/* Rewards actually reading the page, which is the best kind of egg. */}
            <RecipeReveal dict={dict} />
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-bg-subtle" spacing="tight">
        <Container width="wide">
          <Reveal>
            <h2 className="text-[length:var(--text-display-sm)]">
              {dict.about.processPhotosTitle}
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {processPhotos.map((cake) => (
              <RevealItem key={cake.slug}>
                <div className="overflow-hidden rounded-2xl">
                  <CakeImage
                    name={imageKey(cake.images[0].src)}
                    alt={cake.images[0].alt[locale]}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
