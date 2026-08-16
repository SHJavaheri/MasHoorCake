import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import { Faq } from "@/components/sections/Faq";
import { Container, Section } from "@/components/ui/Container";
import { site } from "@/config/site";
import { contactChannels } from "@/lib/contact/channels";
import { isLocale, locales, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { faqJsonLd } from "@/lib/seo/jsonLd";

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
    title: dict.contact.title,
    description: dict.contact.intro,
    alternates: { canonical: localePath(locale, "/contact") },
  };
}

export default async function ContactPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const channels = contactChannels(dict.contact.chatGreeting);

  return (
    <>
      {/* FAQ markup is eligible for rich results, and these are the questions
          people actually search for before enquiring. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(dict.faq)),
        }}
      />

      <PageHeader title={dict.contact.title} intro={dict.contact.intro} />

      <Section>
        <Container>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => (
              <RevealItem key={channel.id}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group border-border bg-surface hover:border-accent flex h-full items-center gap-4 rounded-2xl border p-6 transition-all duration-[var(--duration-fast)] hover:shadow-[var(--shadow-md)]"
                >
                  <channel.Icon className="text-accent size-6 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="font-display block text-[length:var(--text-title)] capitalize">
                      {channel.id}
                    </span>
                    <span className="text-text-muted mt-0.5 block text-sm">
                      {channel.label}
                    </span>
                  </span>
                </a>
              </RevealItem>
            ))}
          </Stagger>

          <Reveal className="border-border mt-12 border-t pt-8">
            <p className="text-text-subtle text-sm">{dict.contact.serviceAreaLabel}</p>
            <p className="text-text-muted mt-1">{site.serviceArea[locale]}</p>
          </Reveal>
        </Container>
      </Section>

      <Faq dict={dict} />
    </>
  );
}
