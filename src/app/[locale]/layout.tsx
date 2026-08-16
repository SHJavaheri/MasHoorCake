import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ThemeScript } from "@/components/layout/ThemeScript";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { site } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import {
  isLocale,
  locales,
  localeDirection,
  localeHreflang,
  localePath,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

import "../globals.css";

type LayoutParams = { locale: string };

/** Both locales are prerendered at build time — 2 × every route. */
export function generateStaticParams(): LayoutParams[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LayoutParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.tagline[locale]}`,
      template: `%s — ${site.name}`,
    },
    description: site.description[locale],
    alternates: {
      canonical: localePath(locale),
      languages: {
        ...Object.fromEntries(locales.map((l) => [localeHreflang[l], localePath(l)])),
        // Tells search engines which version to serve when no locale matches.
        "x-default": localePath("en"),
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: localeHreflang[locale],
      title: `${site.name} — ${site.tagline[locale]}`,
      description: site.description[locale],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<LayoutParams>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;
  const dict = await getDictionary(typedLocale);

  return (
    <html
      lang={localeHreflang[typedLocale]}
      dir={localeDirection[typedLocale]}
      // next-themes mutates class and style on <html> before React hydrates.
      suppressHydrationWarning
      className={fontVariables}
    >
      <head>
        <ThemeScript />
        <meta name="theme-color" content="#faf6ef" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1512" media="(prefers-color-scheme: dark)" />
      </head>
      <body>
        <ThemeProvider>
          {/* First focusable element on the page, visible only when focused. */}
          <a
            href="#main"
            className="focus-visible:bg-accent focus-visible:text-accent-contrast sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:start-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:px-5 focus-visible:py-2.5"
          >
            {dict.nav.skipToContent}
          </a>
          <main id="main">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
