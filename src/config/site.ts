/**
 * Single source of truth for business information.
 *
 * Everything here is a placeholder pending real details from the baker.
 * Nothing in this file should ever be duplicated into a component — changing a
 * phone number must be a one-line edit here, never a search across the app.
 */

export const site = {
  /** TODO(content): real bakery name. */
  name: "Mashoor Cake",
  /** Short positioning line, used in the hero and meta descriptions. */
  tagline: {
    en: "Custom cakes, made by hand",
    fa: "کیک سفارشی، دست‌ساز",
  },
  description: {
    en: "A small home bakery making bespoke celebration cakes to order, with Persian inspired flavours and finishes.",
    fa: "یک شیرینی‌پزی خانگی کوچک که کیک‌های سفارشی جشن را با طعم‌ها و تزئینات ایرانی می‌سازد.",
  },

  /**
   * Canonical production origin for absolute URLs in metadata, sitemap, and
   * JSON-LD. Supplied by CI so the value tracks wherever the site is deployed;
   * the literal is only a local-development fallback.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** TODO(content): city / region served, and whether delivery is offered. */
  serviceArea: {
    en: "Placeholder City and surrounding areas",
    fa: "شهر نمونه و حومه",
  },

  /**
   * Contact channels. Set `enabled: false` to hide a channel sitewide rather
   * than deleting it — the ordering and layout logic keys off this flag.
   * TODO(content): real handles, numbers, and address.
   */
  contact: {
    instagram: {
      enabled: true,
      handle: "@placeholder",
      url: "https://instagram.com/placeholder",
    },
    whatsapp: { enabled: true, number: "+10000000000", url: "https://wa.me/10000000000" },
    telegram: { enabled: true, handle: "@placeholder", url: "https://t.me/placeholder" },
    email: { enabled: true, address: "hello@example.com" },
    phone: { enabled: false, number: "+1 000 000 0000" },
  },

  /**
   * Lead times and policies, surfaced on /order and /contact so customers
   * self-qualify before submitting an inquiry.
   * TODO(content): real values.
   */
  policies: {
    minimumNoticeDays: 14,
    depositPercent: 50,
  },
} as const;

export type SiteConfig = typeof site;
