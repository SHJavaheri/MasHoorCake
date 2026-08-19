import type { SizeOption } from "@/content/cake-maker/schema";

/**
 * Sizes.
 *
 * `tiers`, `servings` and `diameters` are read by both the price calculation
 * and the SVG geometry, so a new size is genuinely one entry here — the drawing
 * adapts on its own.
 *
 * `diameters` is largest-first, one number per tier, in inches.
 *
 * TODO(content): confirm these against the baker's actual tins and portion
 * sizes. The single-tier numbers mirror the existing SizeExplorer data.
 */
export const sizeOptions: SizeOption[] = [
  {
    id: "six-inch",
    label: { en: '6" round' },
    description: { en: "Serves about 8. A small celebration." },
    tiers: 1,
    servings: 8,
    diameters: [6],
    priceDelta: 0,
    pricePerServing: 0,
    requires: [],
    allergens: [],
    featured: false,
  },
  {
    id: "eight-inch",
    label: { en: '8" round' },
    description: { en: "Serves about 18. The most common choice." },
    tiers: 1,
    servings: 18,
    diameters: [8],
    priceDelta: 0,
    pricePerServing: 0,
    requires: [],
    allergens: [],
    featured: true,
  },
  {
    id: "ten-inch",
    label: { en: '10" round' },
    description: { en: "Serves about 32." },
    tiers: 1,
    servings: 32,
    diameters: [10],
    priceDelta: 0,
    pricePerServing: 0,
    requires: [],
    allergens: [],
    featured: false,
  },
  {
    id: "two-tier",
    label: { en: "Two tiers" },
    description: { en: '8" over 10". Serves about 50.' },
    tiers: 2,
    servings: 50,
    diameters: [10, 8],
    // TODO(pricing): placeholder.
    priceDelta: 0,
    pricePerServing: 0,
    requires: [],
    allergens: [],
    featured: true,
  },
  {
    id: "three-tier",
    label: { en: "Three tiers" },
    description: { en: '6" over 8" over 10". Serves about 70. Weddings.' },
    tiers: 3,
    servings: 70,
    diameters: [10, 8, 6],
    priceDelta: 0,
    pricePerServing: 0,
    requires: [],
    allergens: [],
    featured: false,
  },
  {
    id: "sheet-half",
    label: { en: "Half sheet" },
    description: { en: "Serves about 40. Offices, school parties." },
    tiers: 1,
    servings: 40,
    diameters: [13],
    priceDelta: 0,
    pricePerServing: 0,
    requires: [],
    allergens: [],
    featured: false,
  },
  {
    id: "sheet-full",
    label: { en: "Full sheet" },
    description: { en: "Serves about 80. The largest thing we make." },
    tiers: 1,
    servings: 80,
    diameters: [18],
    priceDelta: 0,
    pricePerServing: 0,
    requires: [],
    allergens: [],
    featured: false,
  },
];
