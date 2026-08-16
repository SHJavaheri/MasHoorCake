/**
 * Resolves a /public asset path for the current deployment.
 *
 * `next/link` and `next/image` apply `basePath` automatically, but a plain
 * `<img src>`, `srcSet`, `<a href>`, or CSS `url()` does not — Next never sees
 * them. On GitHub Pages the site is mounted at /MasHoorCake, so an unprefixed
 * "/images/cake.jpg" resolves against the domain root and 404s.
 *
 * Every raw asset reference must go through here.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  // Data URIs and absolute URLs are already complete.
  if (path.startsWith("//")) return path;
  return `${basePath}${path}`;
}
