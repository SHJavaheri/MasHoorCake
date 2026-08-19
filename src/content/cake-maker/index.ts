import { categories } from "@/content/cake-maker/categories";
import { decorationOptions } from "@/content/cake-maker/options/decorations";
import { fillingOptions } from "@/content/cake-maker/options/fillings";
import { flavourOptions } from "@/content/cake-maker/options/flavours";
import { frostingColourOptions } from "@/content/cake-maker/options/frostingColours";
import { frostingOptions } from "@/content/cake-maker/options/frostings";
import { shapeOptions } from "@/content/cake-maker/options/shapes";
import { sizeOptions } from "@/content/cake-maker/options/sizes";
import { themeOptions } from "@/content/cake-maker/options/themes";
import { toppingOptions } from "@/content/cake-maker/options/toppings";
import {
  categoryIds,
  categorySchema,
  optionSchema,
  sizeOptionSchema,
  type CakeCategory,
  type CakeOption,
  type CategoryId,
  type SizeOption,
} from "@/content/cake-maker/schema";

/**
 * The assembled, validated Cake Maker catalog.
 *
 * Parsing happens at module scope, so `next build` is the test: a malformed
 * option, a duplicate id, or a `requires` pointing at something that does not
 * exist fails the build rather than rendering a broken cake in production.
 * This mirrors what lib/gallery/cakes.ts already does for cake content.
 */

/** Categories that present a grid or list of options. The rest are inputs. */
const optionsByCategory = {
  shape: shapeOptions,
  size: sizeOptions,
  flavour: flavourOptions,
  filling: fillingOptions,
  frosting: frostingOptions,
  frostingColour: frostingColourOptions,
  toppings: toppingOptions,
  decorations: decorationOptions,
  theme: themeOptions,
} satisfies Partial<Record<CategoryId, CakeOption[]>>;

export type OptionCategoryId = keyof typeof optionsByCategory;

export type CakeMakerCatalog = {
  categories: CakeCategory[];
  options: Record<OptionCategoryId, CakeOption[]>;
  sizes: SizeOption[];
};

function fail(message: string): never {
  throw new Error(`[cake-maker content] ${message}`);
}

function validate(): CakeMakerCatalog {
  const parsedCategories = categories.map((category, index) => {
    const result = categorySchema.safeParse(category);
    if (!result.success) {
      fail(`categories[${index}] (${category.id}) is invalid: ${result.error.message}`);
    }
    return result.data;
  });

  // Every category must be declared exactly once, and every declared id must be
  // one the code knows about.
  const seenCategories = new Set<string>();
  for (const category of parsedCategories) {
    if (seenCategories.has(category.id)) fail(`duplicate category "${category.id}"`);
    seenCategories.add(category.id);
  }
  for (const id of categoryIds) {
    if (!seenCategories.has(id)) fail(`category "${id}" is missing from categories.ts`);
  }

  const parsedOptions = {} as Record<OptionCategoryId, CakeOption[]>;

  for (const [categoryId, options] of Object.entries(optionsByCategory) as [
    OptionCategoryId,
    CakeOption[],
  ][]) {
    // Sizes carry extra numeric fields the geometry and pricing both depend on.
    const schema = categoryId === "size" ? sizeOptionSchema : optionSchema;

    const parsed = options.map((option, index) => {
      const result = schema.safeParse(option);
      if (!result.success) {
        fail(`${categoryId}[${index}] (${option.id}) is invalid: ${result.error.message}`);
      }
      return result.data as CakeOption;
    });

    const seen = new Set<string>();
    for (const option of parsed) {
      if (seen.has(option.id)) fail(`duplicate option "${option.id}" in ${categoryId}`);
      seen.add(option.id);
    }

    if (parsed.length === 0) fail(`${categoryId} has no options`);
    parsedOptions[categoryId] = parsed;
  }

  // Referential integrity: a requirement that points at a category with no
  // option list, or at an option id that does not exist, would silently hide a
  // panel forever. Catch it here rather than in a bug report.
  const checkRequirements = (
    source: string,
    requires: { category: CategoryId; oneOf: string[] }[],
  ) => {
    for (const requirement of requires) {
      const pool = parsedOptions[requirement.category as OptionCategoryId];
      if (!pool) {
        fail(`${source} requires category "${requirement.category}", which has no options`);
      }
      for (const id of requirement.oneOf) {
        if (!pool.some((option) => option.id === id)) {
          fail(`${source} requires unknown option "${requirement.category}/${id}"`);
        }
      }
    }
  };

  for (const category of parsedCategories) {
    checkRequirements(`category "${category.id}"`, category.requires);
  }
  for (const [categoryId, options] of Object.entries(parsedOptions) as [
    OptionCategoryId,
    CakeOption[],
  ][]) {
    for (const option of options) {
      checkRequirements(`option "${categoryId}/${option.id}"`, option.requires);
    }
  }

  return {
    categories: parsedCategories,
    options: parsedOptions,
    sizes: parsedOptions.size as SizeOption[],
  };
}

export const cakeMakerCatalog: CakeMakerCatalog = validate();

/* -------------------------------------------------------------------------- */
/* Lookups                                                                      */
/* -------------------------------------------------------------------------- */

export function getCategory(id: CategoryId): CakeCategory | undefined {
  return cakeMakerCatalog.categories.find((category) => category.id === id);
}

export function getOptions(id: OptionCategoryId): CakeOption[] {
  return cakeMakerCatalog.options[id];
}

export function getOption(id: OptionCategoryId, optionId: string): CakeOption | undefined {
  return cakeMakerCatalog.options[id].find((option) => option.id === optionId);
}

export function getSize(optionId: string): SizeOption | undefined {
  return cakeMakerCatalog.sizes.find((size) => size.id === optionId);
}

/** True when the category renders a grid of options rather than an input. */
export function hasOptions(id: CategoryId): id is OptionCategoryId {
  return id in cakeMakerCatalog.options;
}
