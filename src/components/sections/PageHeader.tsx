import { Container } from "@/components/ui/Container";
import { KhatamPattern } from "@/components/ui/Ornament";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Standard page opener.
 *
 * Deliberately not a hero: interior pages should start reading immediately
 * rather than making the visitor scroll past a second full-height banner.
 * Top padding clears the fixed header.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="border-border bg-bg-subtle relative overflow-hidden border-b pt-32 pb-16 sm:pt-40 sm:pb-24">
      <KhatamPattern className="text-accent" opacity={0.045} />
      <Container className="relative">
        <Reveal>
          {eyebrow && (
            <p className="font-display text-accent mb-4 text-xs tracking-[0.25em] uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-3xl text-[length:var(--text-display-md)]">{title}</h1>
          {intro && <p className="text-text-muted mt-6 max-w-2xl">{intro}</p>}
        </Reveal>
      </Container>
    </header>
  );
}
