import type { CakeCategory } from "@/content/cake-maker/schema";

/**
 * The questions the Cake Maker asks, in order.
 *
 * Categories with a `requires` are hidden entirely until the condition holds,
 * rather than shown disabled — a greyed-out tab a customer cannot explain is
 * worse than one that appears the moment it becomes relevant.
 *
 * Adding a category is deliberately not a pure data edit (see the plan): it
 * also needs a key on CakeDesign, a reducer branch, and a short URL key. A new
 * category is a new question to ask the customer, which deserves that friction.
 */
export const categories: CakeCategory[] = [
  {
    id: "shape",
    label: { en: "Shape" },
    helper: { en: "Start with the silhouette." },
    kind: "single",
    required: true,
    requires: [],
    density: "comfortable",
  },
  {
    id: "size",
    label: { en: "Size" },
    helper: { en: "How many people are you feeding?" },
    kind: "stepper",
    required: true,
    requires: [],
    density: "comfortable",
  },
  {
    id: "flavour",
    label: { en: "Flavour" },
    helper: { en: "The sponge itself." },
    kind: "single",
    required: true,
    requires: [],
    density: "comfortable",
  },
  {
    id: "filling",
    label: { en: "Filling" },
    helper: {
      en: "What goes between the layers. The cake is cut open here so you can see inside.",
    },
    kind: "single",
    required: false,
    requires: [],
    density: "comfortable",
  },
  {
    id: "frosting",
    label: { en: "Frosting" },
    helper: { en: "The outside finish." },
    kind: "single",
    required: true,
    requires: [],
    density: "comfortable",
  },
  {
    id: "frostingColour",
    label: { en: "Frosting Colour" },
    helper: { en: "We match colours by eye, so bring a swatch if it matters." },
    kind: "swatch",
    required: false,
    // Ganache sets dark and naked finishes barely have a surface: neither takes
    // colour, so the whole panel disappears for them.
    requires: [
      { category: "frosting", oneOf: ["buttercream", "whipped", "fondant", "rustic"] },
    ],
    density: "compact",
  },
  {
    id: "toppings",
    label: { en: "Toppings" },
    helper: { en: "Pick up to four." },
    kind: "multi",
    required: false,
    maxSelections: 4,
    requires: [],
    density: "comfortable",
  },
  {
    id: "decorations",
    label: { en: "Decorations" },
    helper: { en: "Pick up to three." },
    kind: "multi",
    required: false,
    maxSelections: 3,
    requires: [],
    density: "comfortable",
  },
  {
    id: "writing",
    label: { en: "Writing" },
    helper: { en: "Piped onto the plaque. Keep it short so it stays legible." },
    kind: "text",
    required: false,
    maxLength: 40,
    // Writing goes on a plaque, so the plaque has to exist first.
    requires: [{ category: "toppings", oneOf: ["chocolate-plaque", "fondant-plaque"] }],
    density: "comfortable",
  },
  {
    id: "theme",
    label: { en: "Style" },
    helper: { en: "The overall register to work in." },
    kind: "single",
    required: false,
    requires: [],
    density: "comfortable",
  },
  {
    id: "notes",
    label: { en: "Anything else" },
    helper: {
      en: "Allergies, the date, colours to match, anything you are worried about.",
    },
    kind: "text",
    required: false,
    maxLength: 500,
    requires: [],
    density: "comfortable",
  },
  {
    id: "reference",
    label: { en: "Reference photo" },
    helper: { en: "Optional. It stays on your device. See the note below." },
    kind: "upload",
    required: false,
    requires: [],
    density: "comfortable",
  },
];
