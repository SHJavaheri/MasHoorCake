import type { CakeOption } from "@/content/cake-maker/schema";

/**
 * Cake shapes.
 *
 * `visual.silhouette` selects the path generator in lib/cake-maker/geometry.ts.
 * Heart and sheet are single-tier only, enforced by `requires` against the size
 * category rather than by any code.
 *
 * TODO(content): confirm which shapes the baker actually offers.
 */
export const shapeOptions: CakeOption[] = [
  {
    id: "round",
    label: { en: "Round" },
    description: { en: "The classic. Works at every size and tier count." },
    priceDelta: 0,
    pricePerServing: 0,
    requires: [],
    allergens: [],
    featured: true,
    visual: { role: "shape", silhouette: "round" },
  },
  {
    id: "square",
    label: { en: "Square" },
    description: { en: "Sharper lines, and a few more slices per tier." },
    priceDelta: 0,
    pricePerServing: 0,
    requires: [],
    allergens: [],
    featured: false,
    visual: { role: "shape", silhouette: "square" },
  },
  {
    id: "heart",
    label: { en: "Heart" },
    description: { en: "Single tier only. Engagements, anniversaries." },
    // TODO(pricing): placeholder. Hand-shaping a heart takes longer.
    priceDelta: 0,
    pricePerServing: 0,
    priceMultiplier: 1.15,
    requires: [{ category: "size", oneOf: ["six-inch", "eight-inch"] }],
    allergens: [],
    featured: false,
    visual: { role: "shape", silhouette: "heart" },
  },
  {
    id: "sheet",
    label: { en: "Sheet" },
    description: { en: "One wide slab. The most servings for the money." },
    // TODO(pricing): placeholder.
    priceDelta: 0,
    pricePerServing: 0,
    priceMultiplier: 0.9,
    requires: [{ category: "size", oneOf: ["sheet-half", "sheet-full"] }],
    allergens: [],
    featured: false,
    visual: { role: "shape", silhouette: "sheet" },
  },
];
