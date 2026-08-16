import { cakes } from "@/content/cakes";
import { cakeSchema, type Cake } from "@/content/schema";
import { taxonomies } from "@/content/taxonomy";

/**
 * Content access layer.
 *
 * The only module that knows where cake data lives. Swapping the TypeScript
 * modules for a CMS or database later means changing this file alone.
 *
 * Validation runs once at module load — which, in a static export, means at
 * build time. A malformed cake fails the build rather than rendering a broken
 * card in production.
 */

function validate(input: Cake[]): Cake[] {
  const parsed = input.map((cake, index) => {
    const result = cakeSchema.safeParse(cake);
    if (!result.success) {
      throw new Error(
        `Invalid cake at index ${index} (${cake.slug ?? "unknown"}):\n` +
          result.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n"),
      );
    }
    return result.data;
  });

  const slugs = new Set<string>();
  for (const cake of parsed) {
    if (slugs.has(cake.slug)) {
      throw new Error(`Duplicate cake slug: ${cake.slug}`);
    }
    slugs.add(cake.slug);
  }

  // Taxonomy references must resolve, or filters silently drop cakes.
  const check = (field: string, slug: string, valid: ReadonlySet<string>, cakeSlug: string) => {
    if (!valid.has(slug)) {
      throw new Error(`Cake "${cakeSlug}" references unknown ${field}: "${slug}"`);
    }
  };

  const sets = {
    flavours: new Set(taxonomies.flavours.map((t) => t.slug)),
    fillings: new Set(taxonomies.fillings.map((t) => t.slug)),
    occasions: new Set(taxonomies.occasions.map((t) => t.slug)),
    styles: new Set(taxonomies.styles.map((t) => t.slug)),
    colorFamilies: new Set(taxonomies.colorFamilies.map((t) => t.slug)),
    allergens: new Set(taxonomies.allergens.map((t) => t.slug)),
  };

  for (const cake of parsed) {
    cake.flavours.forEach((s) => check("flavour", s, sets.flavours, cake.slug));
    cake.fillings.forEach((s) => check("filling", s, sets.fillings, cake.slug));
    cake.occasions.forEach((s) => check("occasion", s, sets.occasions, cake.slug));
    cake.styles.forEach((s) => check("style", s, sets.styles, cake.slug));
    cake.colorFamilies.forEach((s) => check("colour", s, sets.colorFamilies, cake.slug));
    cake.allergens.forEach((s) => check("allergen", s, sets.allergens, cake.slug));
  }

  return parsed;
}

const validated = validate(cakes);

/** Newest first — the portfolio should lead with current work. */
export function getAllCakes(): Cake[] {
  return [...validated].sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedCakes(limit = 3): Cake[] {
  return getAllCakes()
    .filter((cake) => cake.featured)
    .slice(0, limit);
}

export function getCakeBySlug(slug: string): Cake | undefined {
  return validated.find((cake) => cake.slug === slug);
}

/** Lowest advertised price across the portfolio, for "from $X" copy. */
export function getStartingPrice(): number | undefined {
  const prices = validated.map((c) => c.priceFrom).filter((p): p is number => p !== undefined);
  return prices.length > 0 ? Math.min(...prices) : undefined;
}

/** Manifest key for an image path, e.g. "/images/cakes/x.jpg" -> "x". */
export function imageKey(src: string): string {
  return src
    .split("/")
    .pop()!
    .replace(/\.[^.]+$/, "");
}
