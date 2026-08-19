import { cakeMakerCatalog, hasOptions } from "@/content/cake-maker";
import type {
  CakeCategory,
  CakeOption,
  CategoryId,
  Requirement,
} from "@/content/cake-maker/schema";

import type { CakeDesign } from "@/lib/cake-maker/state";

/**
 * The single evaluator for conditional availability.
 *
 * Every rule about when an option or a category is offered lives in the content
 * as a `requires` array; this file is the only thing that reads them. That is
 * what keeps "frosting colour does not apply to ganache" out of the components,
 * where it would end up duplicated across the desktop and mobile layouts and
 * drift apart.
 */

/** The currently-selected id(s) for a category, as a flat list. */
function selectedIds(design: CakeDesign, category: CategoryId): string[] {
  switch (category) {
    case "shape":
      return [design.shape];
    case "size":
      return [design.size];
    case "flavour":
      return [design.flavour];
    case "filling":
      return design.filling ? [design.filling] : [];
    case "frosting":
      return [design.frosting];
    case "frostingColour":
      return design.frostingColour ? [design.frostingColour] : [];
    case "toppings":
      return design.toppings;
    case "decorations":
      return design.decorations;
    case "theme":
      return design.theme ? [design.theme] : [];
    // Text and upload categories are never the subject of a requirement.
    case "writing":
    case "notes":
    case "reference":
      return [];
  }
}

/** Requirements are ANDed together; ids within one `oneOf` are ORed. */
function satisfied(requires: Requirement[], design: CakeDesign): boolean {
  return requires.every((requirement) => {
    const selected = selectedIds(design, requirement.category);
    return selected.some((id) => requirement.oneOf.includes(id));
  });
}

export function isOptionAvailable(option: CakeOption, design: CakeDesign): boolean {
  return satisfied(option.requires, design);
}

export function isCategoryAvailable(category: CakeCategory, design: CakeDesign): boolean {
  if (!satisfied(category.requires, design)) return false;

  // A category whose every option is gated out is dead weight: hide it too,
  // rather than showing an empty grid.
  if (hasOptions(category.id)) {
    return cakeMakerCatalog.options[category.id].some((option) =>
      isOptionAvailable(option, design),
    );
  }

  return true;
}

/** The categories to show as tabs, in catalog order. */
export function visibleCategories(design: CakeDesign): CakeCategory[] {
  return cakeMakerCatalog.categories.filter((category) =>
    isCategoryAvailable(category, design),
  );
}

/** The options to show within a category, in catalog order. */
export function availableOptions(category: CategoryId, design: CakeDesign): CakeOption[] {
  if (!hasOptions(category)) return [];
  return cakeMakerCatalog.options[category].filter((option) =>
    isOptionAvailable(option, design),
  );
}
