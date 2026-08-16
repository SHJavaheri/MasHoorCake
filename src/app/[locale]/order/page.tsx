import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrderHandoff } from "@/components/sections/OrderHandoff";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProcessStepper } from "@/components/sections/ProcessStepper";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
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
    title: dict.order.title,
    description: dict.order.intro,
    alternates: { canonical: localePath(locale, "/order") },
  };
}

export default async function OrderPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.order.title} intro={dict.order.intro} />

      <Section>
        <Container>
          <OrderHandoff locale={locale} dict={dict} />
        </Container>
      </Section>

      <ProcessStepper dict={dict} />

      <Section spacing="tight">
        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="text-[length:var(--text-display-sm)]">{dict.order.notReadyTitle}</h2>
            <p className="text-text-muted mx-auto mt-4 max-w-md">{dict.order.notReadyBody}</p>
            <div className="mt-8 flex justify-center">
              <Button href={localePath(locale, "/gallery")} variant="secondary">
                {dict.order.notReadyCta}
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
