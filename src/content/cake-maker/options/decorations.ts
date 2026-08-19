import type { CakeOption } from "@/content/cake-maker/schema";

/**
 * Decorations — worked into the sides and edges rather than sat on top.
 *
 * The drip options require a frosting that can actually hold a drip, declared
 * per-option here rather than in any component.
 *
 * TODO(content): confirm the menu. TODO(pricing): all deltas are placeholders.
 */
export const decorationOptions: CakeOption[] = [
  {
    id: "sugar-roses",
    label: { en: "Sugar Roses" },
    description: { en: "Piped by hand, one at a time. Adds a day to the build." },
    priceDelta: 45,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: true,
    swatch: "#e9b4bd",
    visual: { role: "decoration", slot: "band", svgId: "rose", count: 6, fill: "#e9b4bd" },
  },
  {
    id: "chocolate-drip",
    label: { en: "Chocolate Drip" },
    description: { en: "Dark ganache, run over the top edge." },
    priceDelta: 15,
    pricePerServing: 0,
    allergens: ["dairy", "soy"],
    requires: [
      { category: "frosting", oneOf: ["buttercream", "fondant", "whipped", "rustic"] },
    ],
    featured: true,
    swatch: "#4b2f22",
    visual: { role: "drip", slot: "topEdge", svgId: "drip", fill: "#4b2f22" },
  },
  {
    id: "caramel-drip",
    label: { en: "Caramel Drip" },
    description: { en: "Cooked dark, so it reads amber rather than yellow." },
    priceDelta: 15,
    pricePerServing: 0,
    allergens: ["dairy"],
    requires: [
      { category: "frosting", oneOf: ["buttercream", "fondant", "whipped", "rustic"] },
    ],
    featured: false,
    swatch: "#c98b3e",
    visual: { role: "drip", slot: "topEdge", svgId: "drip", fill: "#c98b3e" },
  },
  {
    id: "gold-band",
    label: { en: "Gold Band" },
    description: { en: "A painted stripe around the base of each tier." },
    priceDelta: 20,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#d4af37",
    visual: { role: "decoration", slot: "base", svgId: "band", fill: "#d4af37" },
  },
  {
    id: "scallop-motif",
    label: { en: "Scalloped Motif" },
    description: { en: "A fine piped scallop inspired by our logo." },
    priceDelta: 35,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#2e7266",
    visual: { role: "decoration", slot: "band", svgId: "scallop", count: 5, fill: "#d98d9b" },
  },
  {
    id: "ruffles",
    label: { en: "Buttercream Ruffles" },
    description: { en: "Worked around the sides in a single tone." },
    priceDelta: 25,
    pricePerServing: 0,
    allergens: ["dairy", "egg"],
    requires: [{ category: "frosting", oneOf: ["buttercream", "whipped", "rustic"] }],
    featured: false,
    swatch: "#f3d3d8",
    visual: { role: "decoration", slot: "band", svgId: "ruffle", count: 8, fill: "#f3d3d8" },
  },
  {
    id: "pearls",
    label: { en: "Sugar Pearls" },
    description: { en: "A fine line of them where each tier meets the next." },
    priceDelta: 12,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#efe7d8",
    visual: { role: "decoration", slot: "base", svgId: "pearls", count: 12, fill: "#efe7d8" },
  },
];
