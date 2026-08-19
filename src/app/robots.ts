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
      // /order is a redirect stub kept for links already in the wild; it has no
      // search value of its own and would compete with /design.
      // Paths in robots.txt are relative to the host, so they carry basePath.
      disallow: locales.map((locale) => `${basePath}${localePath(locale, "/order")}`),
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
