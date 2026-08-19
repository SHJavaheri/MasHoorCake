import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RedirectToDesign } from "@/app/[locale]/order/RedirectToDesign";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { isLocale, localePath, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Redirect stub.
 *
 * /order used to hand off to a Google Form; the Cake Maker replaced it. This
 * exists only for links already in the wild — printed cards, an Instagram bio —
 * and can be deleted once those have turned over.
 */

type PageParams = { locale: string };

export function generateStaticParams(): PageParams[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: (await getDictionary(locale)).design.redirectTitle,
    robots: { index: false, follow: true },
    alternates: { canonical: localePath(locale, "/design") },
  };
}

export default async function OrderRedirectPage({ params }: { params: Promise<PageParams> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;
  const dict = await getDictionary(typedLocale);

  return (
    <Section>
      <Container width="narrow">
        <RedirectToDesign locale={typedLocale} />
        <PageHeader title={dict.design.redirectTitle} intro={dict.design.redirectBody} />
        {/* A real link, so the page works with JavaScript disabled and for
            anyone who lands here before the redirect fires. */}
        <Button href={localePath(typedLocale, "/design")} className="mt-8">
          {dict.design.redirectCta}
        </Button>
      </Container>
    </Section>
  );
}
