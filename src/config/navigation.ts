import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * The site's route table.
 *
 * Single source for header, mobile menu, footer, and sitemap generation, so a
 * new page cannot appear in one navigation and be missing from another.
 * `labelKey` points into the `nav` section of the dictionaries.
 */
/**
 * Browse destinations. /design is deliberately absent: it is the primary call
 * to action and appears as a button in the header, the mobile menu, the footer,
 * and the sticky bar — listing it as a plain nav item too would duplicate it
 * beside its own button.
 */
export const navRoutes = [
  { path: "/gallery", labelKey: "gallery" },
  { path: "/cakes", labelKey: "cakes" },
  { path: "/about", labelKey: "about" },
  { path: "/contact", labelKey: "contact" },
] as const satisfies ReadonlyArray<{
  path: string;
  labelKey: keyof Dictionary["nav"];
}>;

/**
 * Every route that gets statically generated, for the sitemap.
 *
 * `/order` is a redirect stub kept for links already in the wild — printed
 * cards, an Instagram bio. It is excluded from the sitemap and noindexed.
 */
export const allRoutes = ["/", "/design", ...navRoutes.map((r) => r.path)] as const;
