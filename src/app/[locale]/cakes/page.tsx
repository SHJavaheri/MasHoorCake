import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FlavourLibrary } from "@/components/sections/FlavourLibrary";
import { PageHeader } from "@/components/sections/PageHeader";
import { SizeExplorer } from "@/components/sections/SizeExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { Container, Section } from "@/components/ui/Container";
import { site } from "@/config/site";
import { getStartingPrice } from "@/lib/gallery/cakes";
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
    title: dict.cakes.title,
    description: dict.cakes.intro,
    alternates: { canonical: localePath(locale, "/cakes") },
  };
}

export default async function CakesPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const startingPrice = getStartingPrice();

  return (
    <>
      <PageHeader title={dict.cakes.title} intro={dict.cakes.intro} />

      <SizeExplorer locale={locale} dict={dict} />
      <FlavourLibrary locale={locale} dict={dict} />

      <Section className="bg-bg-subtle">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-[length:var(--text-display-sm)]">
                {dict.cakes.pricingTitle}
              </h2>
              <p className="text-text-muted mt-5">{dict.cakes.pricingIntro}</p>
              {startingPrice && (
                <p className="font-display mt-8 text-[length:var(--text-display-md)]">
                  {dict.common.from} ${startingPrice}
                </p>
              )}
              <p className="text-text-subtle mt-5 text-sm">{dict.cakes.pricingNote}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="text-[length:var(--text-display-sm)]">
                {dict.cakes.policiesTitle}
              </h2>
              <dl className="mt-6 space-y-5">
                <div className="border-border border-b pb-5">
                  <dt className="text-text-subtle text-sm">{dict.cakes.leadTimeLabel}</dt>
                  <dd className="mt-1 font-medium">
                    {dict.cakes.leadTimeValue.replace(
                      "{days}",
                      String(site.policies.minimumNoticeDays),
                    )}
                  </dd>
                </div>
                <div className="border-border border-b pb-5">
                  <dt className="text-text-subtle text-sm">{dict.cakes.depositLabel}</dt>
                  <dd className="mt-1 font-medium">
                    {dict.cakes.depositValue.replace(
                      "{percent}",
                      String(site.policies.depositPercent),
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-subtle text-sm">{dict.cakes.allergenLabel}</dt>
                  <dd className="text-text-muted mt-1">{dict.cakes.allergenValue}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
