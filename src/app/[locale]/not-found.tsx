import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { defaultLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Custom 404.
 *
 * A `not-found` boundary cannot read route params, so the locale is unknown
 * here and the default is used. GitHub Pages serves the exported 404.html for
 * any unmatched path, so this is what an out-of-date bookmark reaches.
 *
 * Genuinely funny beats generically apologetic: this is a bakery, not a bank.
 */
export default async function NotFound() {
  const dict = await getDictionary(defaultLocale);

  return (
    <Section className="pt-40">
      <Container className="flex flex-col items-center text-center">
        {/* A cake with a slice taken out of it. */}
        <svg
          viewBox="0 0 120 100"
          aria-hidden="true"
          className="text-accent h-32 w-40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M18 82V54a8 8 0 0 1 8-8h68a8 8 0 0 1 8 8v28Z" />
          <path d="M18 64h34l10-10 10 10h30" />
          {/* The missing slice. */}
          <path d="M62 46v36" strokeDasharray="4 4" />
          <path d="M62 46 84 46 84 82 62 82" fill="none" opacity="0.35" />
          <path d="M46 46v-8M62 40v-10M78 46v-6" strokeLinecap="round" />
          <circle cx="46" cy="34" r="3" fill="currentColor" stroke="none" />
          <circle cx="78" cy="38" r="3" fill="currentColor" stroke="none" />
        </svg>

        <h1 className="mt-10 text-[length:var(--text-display-md)]">{dict.notFound.title}</h1>
        <p className="text-text-muted mx-auto mt-5 max-w-md">{dict.notFound.body}</p>
        <div className="mt-10 flex justify-center">
          <Button href={localePath(defaultLocale, "/gallery")}>{dict.notFound.cta}</Button>
        </div>
      </Container>
    </Section>
  );
}
