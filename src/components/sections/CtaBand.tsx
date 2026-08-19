import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { KhatamPattern } from "@/components/ui/Ornament";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Closing call to action. One action only â€” a choice here costs conversions. */
export function CtaBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section className="border-border bg-secondary-subtle/30 relative overflow-hidden border-y">
      <KhatamPattern className="text-secondary" opacity={0.08} />
      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <h2 className="max-w-2xl text-[length:var(--text-display-md)]">
            {dict.home.ctaTitle}
          </h2>
          <p className="text-text-muted mx-auto mt-5 max-w-lg">{dict.home.ctaBody}</p>
          <div className="mt-9 flex justify-center">
            <Button href={localePath(locale, "/design")} size="lg">
              {dict.nav.design}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
