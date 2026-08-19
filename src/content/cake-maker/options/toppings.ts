import type { CakeOption } from "@/content/cake-maker/schema";

/**
 * Toppings — scattered or placed on the cake surface.
 *
 * `visual.slot` names an anchor family from lib/cake-maker/geometry.ts and
 * `visual.count` says how many to distribute. A topping never contains
 * coordinates, which is what lets the same entry work on a round two-tier and
 * a full sheet without changes.
 *
 * Note the two plaque options: selecting either unlocks the "writing" category,
 * declared on that category in ../categories.ts.
 *
 * TODO(content): confirm the menu. TODO(pricing): all deltas are placeholders.
 */
export const toppingOptions: CakeOption[] = [
  {
    id: "fresh-berries",
    label: { en: "Fresh Berries" },
    description: { en: "Whatever is in season and actually good that week." },
    priceDelta: 15,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: true,
    swatch: "#a8324a",
    visual: {
      role: "topping",
      slot: "topSurface",
      svgId: "berries",
      count: 7,
      fill: "#a8324a",
    },
  },
  {
    id: "fresh-flowers",
    label: { en: "Fresh Flowers" },
    description: { en: "Food safe blooms, arranged on the day." },
    priceDelta: 25,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: true,
    swatch: "#e9b4bd",
    visual: { role: "topping", slot: "topSurface", svgId: "flower", count: 5, fill: "#e9b4bd" },
  },
  {
    id: "gold-leaf",
    label: { en: "Edible Gold Leaf" },
    description: { en: "Applied in small flecks, not sheets." },
    priceDelta: 30,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#d4af37",
    visual: { role: "topping", slot: "topEdge", svgId: "goldFleck", count: 9, fill: "#d4af37" },
  },
  {
    id: "sprinkles",
    label: { en: "Sprinkles" },
    description: { en: "A custom mix, matched to your colours." },
    priceDelta: 5,
    pricePerServing: 0,
    allergens: ["soy"],
    requires: [],
    featured: false,
    swatch: "#f0cf90",
    visual: { role: "topping", slot: "sideScatter", svgId: "sprinkle", count: 14 },
  },
  {
    id: "candles",
    label: { en: "Candles" },
    description: { en: "Tapered, in a colour that matches the frosting." },
    priceDelta: 5,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#f3d3d8",
    visual: { role: "topping", slot: "topSurface", svgId: "candle", count: 3, fill: "#f3d3d8" },
  },
  {
    id: "macarons",
    label: { en: "Macarons" },
    description: { en: "Three or five, tucked into the top edge." },
    priceDelta: 20,
    pricePerServing: 0,
    allergens: ["nuts", "egg"],
    requires: [],
    featured: false,
    swatch: "#e9b4bd",
    visual: { role: "topping", slot: "topEdge", svgId: "macaron", count: 4, fill: "#e9b4bd" },
  },
  {
    id: "chocolate-plaque",
    label: { en: "Chocolate Plaque" },
    description: { en: "A dark chocolate tablet. It is the neatest way to add writing." },
    priceDelta: 10,
    pricePerServing: 0,
    allergens: ["dairy", "soy"],
    requires: [],
    featured: true,
    swatch: "#4b2f22",
    visual: { role: "topping", slot: "plaque", svgId: "plaque", count: 1, fill: "#4b2f22" },
  },
  {
    id: "fondant-plaque",
    label: { en: "Fondant Plaque" },
    description: { en: "A pale tablet for writing, tinted to match." },
    priceDelta: 10,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#f6f2ec",
    visual: { role: "topping", slot: "plaque", svgId: "plaque", count: 1, fill: "#f6f2ec" },
  },
];
