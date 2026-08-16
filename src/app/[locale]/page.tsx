import { site } from "@/config/site";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import Link from "next/link";

/**
 * Home page — Phase 0 placeholder.
 *
 * Exists to prove routing, locale, RTL, fonts, and theming all work end to end
 * on GitHub Pages. The real sections (hero, signature trio, process stepper,
 * gallery teaser, testimonials, CTA band) arrive in Phase 3.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <p className="font-display text-text-subtle text-sm tracking-[0.3em] uppercase">
        {site.name}
      </p>

      <h1 className="max-w-4xl text-[length:var(--text-display-lg)]">{dict.home.heroTitle}</h1>

      <p className="text-text-muted max-w-xl">{dict.home.heroSubtitle}</p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={localePath(locale, "/order")}
          className="bg-accent text-accent-contrast hover:bg-accent-hover rounded-full px-7 py-3.5 font-medium transition-colors duration-[var(--duration-fast)]"
        >
          {dict.home.heroCtaPrimary}
        </Link>
        <Link
          href={localePath(locale, "/gallery")}
          className="border-border-strong hover:bg-surface rounded-full border px-7 py-3.5 font-medium transition-colors duration-[var(--duration-fast)]"
        >
          {dict.home.heroCtaSecondary}
        </Link>
      </div>

      <p className="text-text-subtle mt-16 text-sm">
        Phase 0 scaffold — design system, i18n, and static export verified.
      </p>
    </div>
  );
}
