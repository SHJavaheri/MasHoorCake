/**
 * Locale configuration.
 *
 * Deliberately dependency-free. With two locales, JSON dictionaries, and a
 * static export, a library like next-intl brings middleware-based routing that
 * `output: "export"` cannot run. A typed dictionary loader plus
 * `generateStaticParams` is simpler, faster, and carries no migration risk.
 */

export const locales = ["en", "fa"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Text direction per locale. Drives the `dir` attribute on <html>. */
export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fa: "rtl",
};

/** Native-language names, used in the locale switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
};

/** BCP 47 tags for `hreflang`, `lang`, and Open Graph metadata. */
export const localeHreflang: Record<Locale, string> = {
  en: "en",
  fa: "fa-IR",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Prefixes a route with its locale segment.
 * `localePath("fa", "/gallery")` → `/fa/gallery/`
 *
 * Trailing slashes matter: `trailingSlash: true` is required for GitHub Pages
 * to resolve directory-style routes, and mismatched links cause a redirect hop.
 */
export function localePath(locale: Locale, path = "/"): string {
  const normalized = path === "/" ? "" : `/${path.replace(/^\/|\/$/g, "")}`;
  return `/${locale}${normalized}/`;
}
