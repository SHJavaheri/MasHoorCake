import type { CakeOption } from "@/content/cake-maker/schema";

/**
 * Frosting colours.
 *
 * Only offered when the chosen frosting can actually be tinted — that gate is
 * declared once on the frostingColour category in ../categories.ts, so ganache
 * and naked finishes simply hide the whole panel.
 *
 * The first four echo the brand: soft white, mint, blush, and the muted teal.
 * `swatch` and `visual.fill` are the same value here — the card shows exactly
 * the colour the cake will take.
 *
 * TODO(content): confirm which colours the baker will actually mix.
 */
export const frostingColourOptions: CakeOption[] = [
  {
    id: "ivory",
    label: { en: "Ivory" },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: true,
    swatch: "#fdf4e3",
    visual: { role: "frosting", fill: "#fdf4e3" },
  },
  {
    id: "mint",
    label: { en: "Mint" },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: true,
    swatch: "#9bd3c7",
    visual: { role: "frosting", fill: "#9bd3c7" },
  },
  {
    id: "blush",
    label: { en: "Blush Pink" },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: true,
    swatch: "#f3d3d8",
    visual: { role: "frosting", fill: "#f3d3d8" },
  },
  {
    id: "sage",
    label: { en: "Muted Teal" },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#859f99",
    visual: { role: "frosting", fill: "#859f99" },
  },
  {
    id: "dusty-rose",
    label: { en: "Dusty Rose" },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#d98d9b",
    visual: { role: "frosting", fill: "#d98d9b" },
  },
  {
    id: "butter",
    label: { en: "Buttercup" },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#f0cf90",
    visual: { role: "frosting", fill: "#f0cf90" },
  },
  {
    id: "terracotta",
    label: { en: "Terracotta" },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#c97f5e",
    visual: { role: "frosting", fill: "#c97f5e" },
  },
  {
    id: "deep-plum",
    label: { en: "Deep Plum" },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#6b3550",
    visual: { role: "frosting", fill: "#6b3550" },
  },
  {
    id: "charcoal",
    label: { en: "Charcoal" },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#3a3f3d",
    visual: { role: "frosting", fill: "#3a3f3d" },
  },
];
