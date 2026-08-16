import { notFound } from "next/navigation";

import { CtaBand } from "@/components/sections/CtaBand";
import { Hero } from "@/components/sections/Hero";
import { OccasionEntry } from "@/components/sections/OccasionEntry";
import { ProcessStepper } from "@/components/sections/ProcessStepper";
import { SignatureTrio } from "@/components/sections/SignatureTrio";
import { Testimonials } from "@/components/sections/Testimonials";
import { getFeaturedCakes } from "@/lib/gallery/cakes";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Params = { locale: string };

export function generateStaticParams(): Params[] {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const featured = getFeaturedCakes(4);

  return (
    <>
      <Hero cake={featured[0]} locale={locale} dict={dict} />
      <SignatureTrio cakes={featured.slice(1, 4)} locale={locale} dict={dict} />
      <ProcessStepper dict={dict} />
      <OccasionEntry locale={locale} dict={dict} />
      <Testimonials dict={dict} />
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
