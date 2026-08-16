import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * The site's route table.
 *
 * Single source for header, mobile menu, footer, and sitemap generation, so a
 * new page cannot appear in one navigation and be missing from another.
 * `labelKey` points into the `nav` section of the dictionaries.
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

/** Every route that gets statically generated, for the sitemap. */
export const allRoutes = ["/", ...navRoutes.map((r) => r.path), "/order", "/thanks"] as const;
