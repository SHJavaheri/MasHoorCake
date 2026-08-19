import { z } from "zod";

import { localizedTextSchema } from "@/content/l10n";
import { slug } from "@/content/schema";

/**
 * Cake Maker content schemas.
 *
 * The governing goal: adding a flavour, a filling, or a decoration must be a
 * single edit to one data file, with no component changes anywhere. Everything
 * a component needs to know — what to label the card, what it costs, what it
 * does to the drawing, and when it is even offered — is declared here as data.
 *
 * Validated at module load in ./index.ts, so a typo fails `next build` rather
 * than rendering a broken cake in production.
 */

/* -------------------------------------------------------------------------- */
/* Categories                                                                   */
/* -------------------------------------------------------------------------- */

export const categoryIds = [
  "shape",
  "size",
  "flavour",
  "filling",
  "frosting",
  "frostingColour",
  "toppings",
  "decorations",
  "writing",
  "theme",
  "notes",
  "reference",
] as const;

export type CategoryId = (typeof categoryIds)[number];

/**
 * A declarative gate on availability.
 *
 * Entries are ANDed together; the ids within one entry's `oneOf` are ORed. So
 * `[{ category: "frosting", oneOf: ["buttercream", "fondant"] }]` reads as
 * "only when the chosen frosting is buttercream or fondant".
 *
 * This is what keeps conditional logic out of components. There is exactly one
 * evaluator, in lib/cake-maker/availability.ts.
 */
export const requirementSchema = z.object({
  category: z.enum(categoryIds),
  oneOf: z.array(slug).min(1),
});

export type Requirement = z.infer<typeof requirementSchema>;

/* -------------------------------------------------------------------------- */
/* The visual recipe — how an option changes the drawing                        */
/* -------------------------------------------------------------------------- */

/** Named anchor families on the cake. Coordinates come from geometry.ts. */
export const slotIds = [
  "topSurface",
  "topEdge",
  "band",
  "base",
  "sideScatter",
  "plaque",
] as const;

export type SlotId = (typeof slotIds)[number];

export const visualRoles = [
  "shape",
  "sponge",
  "filling",
  "frosting",
  "drip",
  "texture",
  "topping",
  "decoration",
  "board",
] as const;

export type VisualRole = (typeof visualRoles)[number];

/**
 * NOTE ON `fill`: these are literal hex values, not semantic tokens, and that
 * is deliberate. A strawberry is red in both themes — the cake is an
 * illustration of an object, not a UI surface, and re-tinting icing with the
 * page theme would look broken. It is also what makes the PDF work: a
 * serialised SVG carries no stylesheet, so a `var()` fill rasterises black.
 *
 * This is the one sanctioned exception to the "semantic colour tokens only"
 * rule in AGENTS.md, and it is scoped strictly to this directory.
 */
export const visualRecipeSchema = z.object({
  role: z.enum(visualRoles),

  /** Icing / sponge pigment. */
  fill: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, "must be a 6-digit hex colour")
    .optional(),
  /** Optional second pigment for shading or a second stripe. */
  fillAlt: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, "must be a 6-digit hex colour")
    .optional(),

  /** Silhouette generator to use. Only meaningful for role "shape". */
  silhouette: z.enum(["round", "square", "heart", "sheet"]).optional(),

  /** Surface treatment. Only meaningful for roles "frosting" / "texture". */
  texture: z.enum(["smooth", "swirl", "ruffle", "naked", "rustic"]).optional(),

  /** Where on the cake this sits. */
  slot: z.enum(slotIds).optional(),

  /** Key into SVG_PARTS (components/cake-maker/svg/parts/registry.ts). */
  svgId: z.string().optional(),

  /**
   * ESCAPE HATCH: renders /images/cake-maker/sprites/<spriteId>.png instead of
   * an inline SVG part. Drop in a PNG, reference it here, ship — no code.
   */
  spriteId: z.string().optional(),

  /** How many instances to distribute across the slot's anchors. */
  count: z.number().int().min(1).max(24).optional(),
  scale: z.number().positive().optional(),

  /** Manual z-order override. Defaults to LAYER[role] in geometry.ts. */
  layer: z.number().int().optional(),
});

export type VisualRecipe = z.infer<typeof visualRecipeSchema>;

/* -------------------------------------------------------------------------- */
/* Options                                                                      */
/* -------------------------------------------------------------------------- */

export const optionSchema = z.object({
  id: slug,
  label: localizedTextSchema,
  description: localizedTextSchema.optional(),

  /**
   * Money. Every currency amount in the Cake Maker is either one of these
   * three fields or a global lever in ./pricing.ts — nowhere else.
   */
  priceDelta: z.number().default(0),
  pricePerServing: z.number().default(0),
  priceMultiplier: z.number().positive().optional(),

  visual: visualRecipeSchema.optional(),

  /** Colour dot shown on the card when there is no artwork. */
  swatch: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, "must be a 6-digit hex colour")
    .optional(),

  requires: z.array(requirementSchema).default([]),

  /** Links a maker option to a gallery taxonomy term, so they stay one thing. */
  taxonomySlug: slug.optional(),
  allergens: z.array(slug).default([]),

  featured: z.boolean().default(false),
});

export type CakeOption = z.infer<typeof optionSchema>;

/**
 * Size options carry the numbers that drive both the geometry and the price.
 * `diameters` is largest-first, one entry per tier.
 */
export const sizeOptionSchema = optionSchema.extend({
  tiers: z.number().int().min(1).max(5),
  servings: z.number().int().positive(),
  diameters: z.array(z.number().positive()).min(1),
});

export type SizeOption = z.infer<typeof sizeOptionSchema>;

/* -------------------------------------------------------------------------- */
/* Category definitions                                                         */
/* -------------------------------------------------------------------------- */

export const categorySchema = z.object({
  id: z.enum(categoryIds),
  label: localizedTextSchema,
  helper: localizedTextSchema.optional(),

  /**
   * How the panel renders:
   *  single   one choice from a card grid
   *  multi    several choices, capped by maxSelections
   *  swatch   a colour grid
   *  stepper  the size picker
   *  text     a free-text field (writing, notes)
   *  upload   the reference image field
   */
  kind: z.enum(["single", "multi", "swatch", "stepper", "text", "upload"]),

  required: z.boolean().default(false),
  maxSelections: z.number().int().positive().optional(),
  maxLength: z.number().int().positive().optional(),

  requires: z.array(requirementSchema).default([]),
  density: z.enum(["comfortable", "compact"]).default("comfortable"),
});

export type CakeCategory = z.infer<typeof categorySchema>;
