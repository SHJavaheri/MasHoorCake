import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryExperience } from "@/components/gallery/GalleryExperience";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container, Section } from "@/components/ui/Container";
import { getAllCakes } from "@/lib/gallery/cakes";
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
    title: dict.gallery.title,
    description: dict.gallery.intro,
    alternates: { canonical: localePath(locale, "/gallery") },
  };
}

export default async function GalleryPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const cakes = getAllCakes();

  return (
    <>
      <PageHeader title={dict.gallery.title} intro={dict.gallery.intro} />
      <Section>
        <Container width="wide">
          <GalleryExperience cakes={cakes} locale={locale} dict={dict} />
        </Container>
      </Section>
    </>
  );
}
