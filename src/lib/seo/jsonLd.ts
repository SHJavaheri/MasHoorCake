import { site } from "@/config/site";
import { localeHreflang, localePath, type Locale } from "@/lib/i18n/config";

import { absoluteUrl as absolute } from "./url";

/**
 * Structured data.
 *
 * For a home bakery, `LocalBusiness`/`Bakery` markup is the single highest-value
 * SEO investment: it feeds the knowledge panel and local results, which is where
 * "custom cakes near me" traffic actually comes from.
 *
 * TODO(content): add `address`, `openingHours`, `telephone`, and a real
 * `priceRange` once the business details land.
 */

export function organizationJsonLd(locale: Locale) {
  const socials = [
    site.contact.instagram.enabled ? site.contact.instagram.url : null,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": absolute(localePath(locale)),
    name: site.name,
    description: site.description[locale],
    url: absolute(localePath(locale)),
    inLanguage: localeHreflang[locale],
    servesCuisine: "Cakes",
    areaServed: site.serviceArea[locale],
    // Ternaries rather than `&&`: `site` is `as const`, so a disabled channel
    // narrows to literal `false`, which is not spreadable.
    ...(socials.length > 0 ? { sameAs: socials } : {}),
    ...(site.contact.email.enabled ? { email: site.contact.email.address } : {}),
    ...(site.contact.phone.enabled ? { telephone: site.contact.phone.number } : {}),
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  trail: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(localePath(locale, item.path)),
    })),
  };
}

export function faqJsonLd(faqs: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
