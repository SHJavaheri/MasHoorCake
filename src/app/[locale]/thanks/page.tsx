import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { KhatamStar } from "@/components/ui/Ornament";
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
    title: dict.thanks.title,
    // A confirmation page has no business in search results.
    robots: { index: false, follow: true },
  };
}

/**
 * Post-submission thank-you page.
 *
 * Google Forms lets you put a link in its confirmation message. Pointing it
 * here closes the loop on-brand rather than leaving the customer on Google's
 * own screen, which is the last impression they would otherwise be left with.
 *
 * TODO(content): once the form exists, set its confirmation message to link to
 * this page.
 */
export default async function ThanksPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <Section className="pt-40">
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <KhatamStar className="text-accent mx-auto size-12" />
          <h1 className="mt-8 text-[length:var(--text-display-md)]">{dict.thanks.title}</h1>
          <p className="text-text-muted mx-auto mt-5 max-w-md">{dict.thanks.body}</p>
          <div className="mt-10 flex justify-center">
            <Button href={localePath(locale, "/gallery")} variant="secondary">
              {dict.thanks.cta}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
