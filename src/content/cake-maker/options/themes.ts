import type { CakeOption } from "@/content/cake-maker/schema";

/**
 * Overall style. Purely descriptive — it tells the baker the register to work
 * in and does not change the drawing, which is why none of these carry a
 * `visual`. `taxonomySlug` links them to the gallery's style filter.
 *
 * TODO(content): confirm. TODO(pricing): multipliers are placeholders.
 */
export const themeOptions: CakeOption[] = [
  {
    id: "minimal",
    label: { en: "Minimal" },
    description: { en: "Clean surfaces, one gesture, nothing extra." },
    taxonomySlug: "minimal",
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: true,
  },
  {
    id: "floral",
    label: { en: "Floral" },
    description: { en: "Led by flowers, fresh or piped." },
    taxonomySlug: "floral",
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: true,
  },
  {
    id: "textured",
    label: { en: "Textured" },
    description: { en: "The finish itself is the decoration." },
    taxonomySlug: "textured",
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
  },
  {
    id: "persian-motif",
    label: { en: "Persian Motif" },
    description: { en: "Tilework geometry, worth looking at closely." },
    taxonomySlug: "persian-motif",
    priceDelta: 0,
    pricePerServing: 0,
    priceMultiplier: 1.1,
    allergens: [],
    requires: [],
    featured: false,
  },
  {
    id: "sculpted",
    label: { en: "Sculpted" },
    description: { en: "Carved into a shape. Tell us what you have in mind." },
    taxonomySlug: "sculpted",
    priceDelta: 0,
    pricePerServing: 0,
    // TODO(pricing): placeholder. Sculpted work is the slowest thing we do.
    priceMultiplier: 1.4,
    allergens: [],
    requires: [],
    featured: false,
  },
  {
    id: "playful",
    label: { en: "Playful" },
    description: { en: "Bright, loose, and aimed at someone small." },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
  },
];
