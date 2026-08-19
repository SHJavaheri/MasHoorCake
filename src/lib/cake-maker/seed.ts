import { cakeMakerCatalog } from "@/content/cake-maker";
import type { Cake } from "@/content/schema";

import { saveSeed } from "@/lib/cake-maker/persistence";

/**
 * Seeding the Cake Maker from elsewhere on the site.
 *
 * "Design something like this" on a gallery cake, or the size and flavour
 * explorers on /cakes, all land the customer in the designer with the relevant
 * choices already made rather than on an empty configurator.
 *
 * These map by TAXONOMY SLUG, never by display label. The previous order-intent
 * code stored localised strings, which could not be mapped back to an option in
 * the other locale — that is the bug this indirection exists to prevent.
 */

/** Finds the maker option whose taxonomySlug matches one of `slugs`. */
function matchByTaxonomy(
  category: "flavour" | "filling" | "theme",
  slugs: string[],
): string | undefined {
  const options = cakeMakerCatalog.options[category];
  for (const slug of slugs) {
    const match = options.find((option) => option.taxonomySlug === slug || option.id === slug);
    if (match) return match.id;
  }
  return undefined;
}

/** The closest size option to a given tier count and serving estimate. */
function matchSize(tiers: number, servings?: number): string | undefined {
  const candidates = cakeMakerCatalog.sizes.filter((size) => size.tiers === tiers);
  const pool = candidates.length > 0 ? candidates : cakeMakerCatalog.sizes;
  if (pool.length === 0) return undefined;

  if (servings === undefined) return pool[0].id;

  return pool.reduce((best, size) =>
    Math.abs(size.servings - servings) < Math.abs(best.servings - servings) ? size : best,
  ).id;
}

/** From a gallery cake: "design something like this". */
export function seedDesignFromCake(cake: Cake, name: string): void {
  const servings = Math.round((cake.servings.min + cake.servings.max) / 2);

  saveSeed({
    fromCakeName: name,
    size: matchSize(cake.tiers, servings),
    flavour: matchByTaxonomy("flavour", cake.flavours),
    filling: matchByTaxonomy("filling", cake.fillings),
    theme: matchByTaxonomy("theme", cake.styles),
  });
}

/** From the size explorer on /cakes. */
export function seedDesignFromSize(tiers: number, servings: number): void {
  saveSeed({ size: matchSize(tiers, servings) });
}

/** From the flavour library on /cakes. Takes slugs, never labels. */
export function seedDesignFromFlavour(flavourSlug: string, fillingSlug?: string): void {
  saveSeed({
    flavour: matchByTaxonomy("flavour", [flavourSlug]),
    filling: fillingSlug ? matchByTaxonomy("filling", [fillingSlug]) : undefined,
  });
}
