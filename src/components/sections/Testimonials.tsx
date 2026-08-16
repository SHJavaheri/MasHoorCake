import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import { Container, Section } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Testimonials.
 *
 * No star ratings and no avatars. Stars read as e-commerce and invite the
 * question "out of how many reviews?", which is the wrong frame for a bakery
 * that takes a handful of orders a week. Set as quiet editorial pull-quotes,
 * the same words read as word of mouth instead.
 */
export function Testimonials({ dict }: { dict: Dictionary }) {
  return (
    <Section>
      <Container>
        <Reveal>
          <h2 className="text-[length:var(--text-display-md)]">
            {dict.home.testimonialsTitle}
          </h2>
        </Reveal>

        <Stagger className="mt-14 grid gap-10 md:grid-cols-3">
          {dict.testimonials.map((testimonial) => (
            <RevealItem key={testimonial.quote}>
              <figure className="flex h-full flex-col">
                <span
                  aria-hidden="true"
                  className="font-display text-accent text-5xl leading-none opacity-40"
                >
                  &ldquo;
                </span>
                <blockquote className="font-display mt-3 flex-1 text-[length:var(--text-title)] leading-snug">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="text-text-subtle mt-5 text-sm">
                  {testimonial.author}
                  {" · "}
                  {testimonial.occasion}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
