import { site } from "@/config/site";

/**
 * Builds an absolute URL for metadata, sitemaps, and structured data.
 *
 * Deliberately string concatenation rather than `new URL(path, site.url)`.
 * When the site is served from a sub-path — as it is on GitHub Pages, at
 * https://hamidjavaheri.com/MasHoorCake — a root-relative path passed to the
 * `URL` constructor *replaces* the base's path rather than extending it:
 *
 *   new URL("/en/", "https://example.com/MasHoorCake")
 *     -> "https://example.com/en/"        // wrong, prefix silently dropped
 *
 * That failure is invisible in development, where there is no base path, and
 * produces a sitemap full of 404s in production.
 *
 * Note this is only for *absolute* URLs in metadata. Links and assets inside
 * the page are handled by Next's `basePath` and by `asset()` respectively —
 * `site.url` already carries the prefix, so it must not be added twice.
 */
export function absoluteUrl(path: string): string {
  const base = site.url.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
