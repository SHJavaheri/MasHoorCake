import type { MetadataRoute } from "next";

import { locales, localePath } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo/url";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Confirmation pages have no search value and only dilute the crawl.
      // Paths in robots.txt are relative to the host, so they carry basePath.
      disallow: locales.map((locale) => `${basePath}${localePath(locale, "/thanks")}`),
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
