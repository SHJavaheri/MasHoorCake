import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CakeMaker } from "@/components/cake-maker/CakeMaker";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Container";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

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

  const dict = await getDictionary(locale);
  return { title: dict.design.title, description: dict.design.intro };
}

export default async function DesignPage({ params }: { params: Promise<PageParams> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;
  const dict = await getDictionary(typedLocale);

  return (
    <>
      <PageHeader
        eyebrow={dict.design.eyebrow}
        title={dict.design.title}
        intro={dict.design.intro}
      />

      {/*
       * The Cake Maker is a client island: everything below here needs the
       * reducer, sessionStorage, and the URL. The dictionary is threaded in as
       * a prop rather than imported, because getDictionary is server-only.
       */}
      <Section spacing="tight">
        <CakeMaker locale={typedLocale} />
      </Section>
    </>
  );
}
