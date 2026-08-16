import type { Cake } from "@/content/schema";

/**
 * Gallery filtering.
 *
 * Semantics: OR within a category, AND across categories. Selecting
 * "birthday" and "wedding" widens the results; adding "pistachio" then narrows
 * them. That matches how people actually think — "a birthday or wedding cake,
 * in pistachio" — and is the behaviour every faceted search uses.
 */

export const filterCategories = ["occasions", "styles", "flavours", "colorFamilies"] as const;

export type FilterCategory = (typeof filterCategories)[number];

export type FilterState = Record<FilterCategory, string[]>;

export const emptyFilters: FilterState = {
  occasions: [],
  styles: [],
  flavours: [],
  colorFamilies: [],
};

export function filterCakes(cakes: Cake[], filters: FilterState): Cake[] {
  return cakes.filter((cake) =>
    filterCategories.every((category) => {
      const selected = filters[category];
      if (selected.length === 0) return true;
      return selected.some((slug) => cake[category].includes(slug));
    }),
  );
}

export function toggleFilter(
  state: FilterState,
  category: FilterCategory,
  slug: string,
): FilterState {
  const current = state[category];
  return {
    ...state,
    [category]: current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
  };
}

export function countActive(state: FilterState): number {
  return filterCategories.reduce((total, c) => total + state[c].length, 0);
}

/**
 * How many results a given option would still yield, given everything else
 * selected. Shown on the chips so nobody picks a combination that returns
 * nothing — a dead end is far more frustrating than a greyed-out option.
 */
export function countFor(
  cakes: Cake[],
  filters: FilterState,
  category: FilterCategory,
  slug: string,
): number {
  const hypothetical: FilterState = {
    ...filters,
    [category]: filters[category].includes(slug)
      ? filters[category]
      : [...filters[category], slug],
  };
  return filterCakes(cakes, hypothetical).length;
}

/** Serialises to a query string so a filtered view is shareable. */
export function filtersToParams(state: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  for (const category of filterCategories) {
    if (state[category].length > 0) params.set(category, state[category].join(","));
  }
  return params;
}

export function filtersFromParams(params: URLSearchParams): FilterState {
  const state: FilterState = { ...emptyFilters };
  for (const category of filterCategories) {
    const raw = params.get(category);
    state[category] = raw ? raw.split(",").filter(Boolean) : [];
  }
  return state;
}
