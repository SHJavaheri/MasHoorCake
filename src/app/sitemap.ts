import type { MetadataRoute } from "next";

import { allRoutes } from "@/config/navigation";
import { localeHreflang, localePath, locales } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo/url";

/**
 * Sitemap.
 *
 * `output: "export"` renders this to a static sitemap.xml at build time.
 * Each URL carries `alternates.languages` so search engines are told explicitly
 * that the English and Persian pages are the same page in two languages,
 * rather than treating them as duplicates competing with each other.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of allRoutes) {
      // The confirmation page is not a destination anyone should arrive at cold.
      if (route === "/thanks") continue;

      entries.push({
        url: absoluteUrl(localePath(locale, route)),
        lastModified: new Date(),
        changeFrequency: route === "/gallery" ? "weekly" : "monthly",
        priority: route === "/" ? 1 : route === "/gallery" ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [localeHreflang[l], absoluteUrl(localePath(l, route))]),
          ),
        },
      });
    }
  }

  return entries;
}
