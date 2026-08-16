import { z } from "zod";

import { locales } from "@/lib/i18n/config";

/**
 * Content schemas.
 *
 * Cake data is authored as typed TypeScript modules and validated with Zod at
 * build time, so a malformed entry fails the build instead of rendering a blank
 * card in production. When this content eventually moves to a CMS or database,
 * these schemas become the parse boundary and nothing downstream changes.
 */

/** Every customer-visible string exists in both locales. */
export const localizedStringSchema = z.object(
  Object.fromEntries(locales.map((l) => [l, z.string().min(1)])) as Record<
    (typeof locales)[number],
    z.ZodString
  >,
);

export type LocalizedString = z.infer<typeof localizedStringSchema>;

/**
 * Taxonomy references are slugs validated against the shared taxonomy files,
 * not free text. That is what makes filtering, cross-linking, and future cake
 * detail pages trivial rather than a string-matching exercise.
 */
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase kebab-case");

export const cakeImageSchema = z.object({
  /** Path relative to /public, e.g. "/images/cakes/saffron-01.jpg". */
  src: z.string().startsWith("/"),
  /** Intrinsic dimensions, required so the grid can reserve space (no CLS). */
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** Localised, descriptive alt text. Never "cake". */
  alt: localizedStringSchema,
  /** Inline low-quality placeholder (data URI) shown while loading. */
  lqip: z.string().optional(),
});

export type CakeImage = z.infer<typeof cakeImageSchema>;

export const cakeSchema = z.object({
  /** Also the future URL for a dedicated page: /[locale]/gallery/[slug]. */
  slug,
  name: localizedStringSchema,
  description: localizedStringSchema,

  /** First image is the grid cover; the rest feed the modal carousel. */
  images: z.array(cakeImageSchema).min(1),

  flavours: z.array(slug).min(1),
  fillings: z.array(slug),
  occasions: z.array(slug).min(1),
  styles: z.array(slug),
  colorFamilies: z.array(slug),

  tiers: z.number().int().min(1).max(6),
  servings: z.object({ min: z.number().int().positive(), max: z.number().int().positive() }),
  dimensions: z.string().optional(),

  ingredients: z.array(localizedStringSchema),
  allergens: z.array(slug),
  dietaryNotes: localizedStringSchema.optional(),

  /** Omitted means "price on request" rather than free. */
  priceFrom: z.number().positive().optional(),

  featured: z.boolean(),
  /** ISO date, used to order "recent work". */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Cake = z.infer<typeof cakeSchema>;

export const taxonomyTermSchema = z.object({
  slug,
  label: localizedStringSchema,
  description: localizedStringSchema.optional(),
});

export type TaxonomyTerm = z.infer<typeof taxonomyTermSchema>;
