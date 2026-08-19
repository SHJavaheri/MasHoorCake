import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { KonamiCake } from "@/components/easter-eggs/KonamiCake";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyActionBar } from "@/components/layout/StickyActionBar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { site } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import {
  isLocale,
  localeDirection,
  localeHreflang,
  localePath,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { organizationJsonLd } from "@/lib/seo/jsonLd";

import "../globals.css";

type LayoutParams = { locale: string };

/** Both locales are prerendered at build time: 2 x every route. */
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
      default: `${site.name}: ${site.tagline[locale]}`,
      template: `%s: ${site.name}`,
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
      title: `${site.name}: ${site.tagline[locale]}`,
      description: site.description[locale],
    },
    twitter: { card: "summary_large_image" },
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
        {/* Must track --bg in globals.css; these cannot read CSS variables. */}
        <meta name="theme-color" content="#fafcfb" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f1513" media="(prefers-color-scheme: dark)" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(typedLocale)),
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <MotionProvider>
            {/* First focusable element on the page, visible only when focused. */}
            <a
              href="#main"
              className="focus-visible:bg-accent focus-visible:text-accent-contrast sr-only rounded-full focus-visible:not-sr-only focus-visible:fixed focus-visible:start-4 focus-visible:top-4 focus-visible:z-70 focus-visible:px-5 focus-visible:py-2.5"
            >
              {dict.nav.skipToContent}
            </a>

            <Header locale={typedLocale} dict={dict} />

            {/* Bottom padding clears the mobile action bar on small screens. */}
            <main id="main" className="flex-1 pb-20 lg:pb-0">
              {children}
            </main>

            <Footer locale={typedLocale} dict={dict} />
            <StickyActionBar locale={typedLocale} dict={dict} />
            <KonamiCake />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
