import type { CakeOption } from "@/content/cake-maker/schema";

/**
 * Frostings — the outer skin of the cake.
 *
 * `visual.texture` picks the surface treatment in the SVG. `fill` here is only
 * the *default* colour; if the frosting supports tinting, the chosen entry from
 * ./frostingColours.ts overrides it. Which frostings can be tinted is declared
 * on the frostingColour *category* in ../categories.ts, not here.
 *
 * TODO(content): confirm the menu. TODO(pricing): all deltas are placeholders.
 */
export const frostingOptions: CakeOption[] = [
  {
    id: "buttercream",
    label: { en: "Buttercream" },
    description: { en: "Smooth or textured, and it takes colour beautifully." },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: ["dairy", "egg"],
    requires: [],
    featured: true,
    swatch: "#fdf4e3",
    visual: { role: "frosting", texture: "smooth", fill: "#fdf4e3" },
  },
  {
    id: "whipped",
    label: { en: "Whipped Cream" },
    description: { en: "Lighter and less sweet. Softer edges, by nature." },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: ["dairy"],
    requires: [],
    featured: false,
    swatch: "#fffdf8",
    visual: { role: "frosting", texture: "swirl", fill: "#fffdf8" },
  },
  {
    id: "fondant",
    label: { en: "Fondant" },
    description: { en: "A flawless matte finish. Best for sculpted work." },
    // TODO(pricing): placeholder. Fondant is slower to apply.
    priceDelta: 25,
    pricePerServing: 0,
    allergens: [],
    requires: [],
    featured: false,
    swatch: "#f6f2ec",
    visual: { role: "frosting", texture: "smooth", fill: "#f6f2ec" },
  },
  {
    id: "ganache-drip",
    label: { en: "Ganache Coat" },
    description: { en: "Dark, glossy, and sets firm. Not tintable." },
    priceDelta: 15,
    pricePerServing: 0,
    allergens: ["dairy", "soy"],
    requires: [],
    featured: false,
    swatch: "#3f281d",
    visual: { role: "frosting", texture: "smooth", fill: "#3f281d" },
  },
  {
    id: "naked",
    label: { en: "Naked / Semi naked" },
    description: { en: "Barely frosted, with the sponge showing through." },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: ["dairy", "egg"],
    requires: [],
    featured: true,
    swatch: "#f6eddc",
    visual: { role: "frosting", texture: "naked", fill: "#fdf4e3" },
  },
  {
    id: "rustic",
    label: { en: "Rustic Swirl" },
    description: { en: "Deliberately uneven, worked with a palette knife." },
    priceDelta: 0,
    pricePerServing: 0,
    allergens: ["dairy", "egg"],
    requires: [],
    featured: false,
    swatch: "#fdf4e3",
    visual: { role: "frosting", texture: "rustic", fill: "#fdf4e3" },
  },
];
