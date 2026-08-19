import { cakeMakerCatalog, getCategory, getSize, hasOptions } from "@/content/cake-maker";
import type { CategoryId } from "@/content/cake-maker/schema";

/**
 * Cake Maker state.
 *
 * A reducer rather than a dozen `useState`s, because the selections are not
 * independent: choosing a frosting can invalidate a frosting colour, choosing a
 * size can invalidate a shape, and removing a plaque invalidates the writing.
 * `normalise` below is the one place those invariants are enforced — spread
 * across components they would be duplicated per layout and drift apart.
 */

export type CakeDesign = {
  shape: string;
  size: string;
  flavour: string;
  filling: string | null;
  frosting: string;
  frostingColour: string | null;
  toppings: string[];
  decorations: string[];
  theme: string | null;
  writing: string;
  notes: string;
  /**
   * Whether a reference photo is attached. The image itself is deliberately not
   * part of the design: it cannot be serialised into a URL and it never leaves
   * the browser. See lib/cake-maker/referenceImage.ts.
   */
  hasReferenceImage: boolean;
};

export type DesignAction =
  | { type: "select"; category: CategoryId; optionId: string }
  | { type: "toggle"; category: CategoryId; optionId: string }
  | { type: "setText"; field: "writing" | "notes"; value: string }
  | { type: "setReference"; present: boolean }
  | { type: "hydrate"; design: Partial<CakeDesign> }
  | { type: "reset" };

/* -------------------------------------------------------------------------- */
/* Defaults                                                                     */
/* -------------------------------------------------------------------------- */

/** First featured option in a category, else the first option. */
function defaultFor(category: CategoryId): string {
  if (!hasOptions(category)) return "";
  const options = cakeMakerCatalog.options[category];
  return (options.find((option) => option.featured) ?? options[0]).id;
}

/**
 * The design the server renders. It must be a pure function of the catalog with
 * no browser state, or the prerendered HTML and the first client render would
 * disagree and React would blow away the tree on hydration.
 */
export function initialDesign(): CakeDesign {
  return normalise({
    shape: defaultFor("shape"),
    size: defaultFor("size"),
    flavour: defaultFor("flavour"),
    filling: defaultFor("filling"),
    frosting: defaultFor("frosting"),
    frostingColour: null,
    toppings: [],
    decorations: [],
    theme: null,
    writing: "",
    notes: "",
    hasReferenceImage: false,
  });
}

/* -------------------------------------------------------------------------- */
/* Invariants                                                                   */
/* -------------------------------------------------------------------------- */

function optionExists(category: CategoryId, id: string): boolean {
  if (!hasOptions(category)) return false;
  return cakeMakerCatalog.options[category].some((option) => option.id === id);
}

/**
 * Enforces every cross-field rule in one pass. Runs after every action, and
 * after hydrating from a URL or from storage — which is what makes an old
 * shared link degrade gracefully instead of rendering an impossible cake.
 */
export function normalise(design: CakeDesign): CakeDesign {
  const next: CakeDesign = { ...design };

  // 1. Required single-choice categories must always hold a real option.
  if (!optionExists("shape", next.shape)) next.shape = defaultFor("shape");
  if (!optionExists("size", next.size)) next.size = defaultFor("size");
  if (!optionExists("flavour", next.flavour)) next.flavour = defaultFor("flavour");
  if (!optionExists("frosting", next.frosting)) next.frosting = defaultFor("frosting");

  // 2. Optional single-choice categories may be null, but not nonsense.
  if (next.filling && !optionExists("filling", next.filling)) next.filling = null;
  if (next.theme && !optionExists("theme", next.theme)) next.theme = null;

  // 3. Multi-selects: drop unknown ids, then trim to the cap, oldest first.
  next.toppings = next.toppings.filter((id) => optionExists("toppings", id));
  next.decorations = next.decorations.filter((id) => optionExists("decorations", id));

  const toppingCap = getCategory("toppings")?.maxSelections;
  if (toppingCap && next.toppings.length > toppingCap) {
    next.toppings = next.toppings.slice(-toppingCap);
  }
  const decorationCap = getCategory("decorations")?.maxSelections;
  if (decorationCap && next.decorations.length > decorationCap) {
    next.decorations = next.decorations.slice(-decorationCap);
  }

  // 4. Shape and size have to agree: heart and sheet are single-tier shapes,
  //    and a sheet size drawn as a round cake is not a thing we make.
  const size = getSize(next.size);
  const tiers = size?.tiers ?? 1;
  const isSheetSize = next.size.startsWith("sheet-");

  if (next.shape === "heart" && (tiers > 1 || isSheetSize)) next.shape = "round";
  if (next.shape === "sheet" && !isSheetSize) next.shape = "round";
  if (isSheetSize && next.shape !== "sheet") next.shape = "sheet";

  // 5. Drop selections whose own `requires` no longer hold. Imported lazily to
  //    keep this module free of a circular import at load time.
  next.toppings = next.toppings.filter((id) => requiresHold("toppings", id, next));
  next.decorations = next.decorations.filter((id) => requiresHold("decorations", id, next));

  // 6. Frosting colour only survives if this frosting can be tinted at all.
  const colourCategory = getCategory("frostingColour");
  const tintable =
    colourCategory?.requires.every((requirement) =>
      requirement.category === "frosting" ? requirement.oneOf.includes(next.frosting) : true,
    ) ?? true;

  if (
    !tintable ||
    (next.frostingColour && !optionExists("frostingColour", next.frostingColour))
  ) {
    next.frostingColour = null;
  }

  // 7. Writing needs a plaque to sit on.
  const writingRequires = getCategory("writing")?.requires ?? [];
  const canWrite = writingRequires.every((requirement) =>
    requirement.category === "toppings"
      ? next.toppings.some((id) => requirement.oneOf.includes(id))
      : true,
  );
  if (!canWrite) next.writing = "";

  // 8. Text length caps, so a pasted essay cannot break the URL or the PDF.
  const writingMax = getCategory("writing")?.maxLength ?? 40;
  const notesMax = getCategory("notes")?.maxLength ?? 500;
  if (next.writing.length > writingMax) next.writing = next.writing.slice(0, writingMax);
  if (next.notes.length > notesMax) next.notes = next.notes.slice(0, notesMax);

  return next;
}

/** Whether an option's own requirements hold against a design. */
function requiresHold(category: CategoryId, id: string, design: CakeDesign): boolean {
  if (!hasOptions(category)) return true;
  const option = cakeMakerCatalog.options[category].find((entry) => entry.id === id);
  if (!option) return false;

  return option.requires.every((requirement) => {
    switch (requirement.category) {
      case "frosting":
        return requirement.oneOf.includes(design.frosting);
      case "shape":
        return requirement.oneOf.includes(design.shape);
      case "size":
        return requirement.oneOf.includes(design.size);
      case "flavour":
        return requirement.oneOf.includes(design.flavour);
      case "filling":
        return design.filling !== null && requirement.oneOf.includes(design.filling);
      case "theme":
        return design.theme !== null && requirement.oneOf.includes(design.theme);
      case "toppings":
        return design.toppings.some((entry) => requirement.oneOf.includes(entry));
      case "decorations":
        return design.decorations.some((entry) => requirement.oneOf.includes(entry));
      default:
        return true;
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Reducer                                                                      */
/* -------------------------------------------------------------------------- */

export function designReducer(state: CakeDesign, action: DesignAction): CakeDesign {
  switch (action.type) {
    case "select": {
      const { category, optionId } = action;
      switch (category) {
        case "shape":
          return normalise({ ...state, shape: optionId });
        case "size":
          return normalise({ ...state, size: optionId });
        case "flavour":
          return normalise({ ...state, flavour: optionId });
        case "frosting":
          return normalise({ ...state, frosting: optionId });
        // Optional single-choice categories toggle off when re-selected, so a
        // customer can back out of a choice without a separate "none" card.
        case "filling":
          return normalise({ ...state, filling: state.filling === optionId ? null : optionId });
        case "frostingColour":
          return normalise({
            ...state,
            frostingColour: state.frostingColour === optionId ? null : optionId,
          });
        case "theme":
          return normalise({ ...state, theme: state.theme === optionId ? null : optionId });
        default:
          return state;
      }
    }

    case "toggle": {
      const { category, optionId } = action;
      if (category !== "toppings" && category !== "decorations") return state;

      const current = state[category];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];

      return normalise({ ...state, [category]: next });
    }

    case "setText":
      return normalise({ ...state, [action.field]: action.value });

    case "setReference":
      return { ...state, hasReferenceImage: action.present };

    case "hydrate":
      return normalise({ ...state, ...action.design });

    case "reset":
      return initialDesign();
  }
}

/* -------------------------------------------------------------------------- */
/* Derived                                                                      */
/* -------------------------------------------------------------------------- */

/** Servings and tier count for the chosen size, with a safe fallback. */
export function sizeFacts(design: CakeDesign): {
  tiers: number;
  servings: number;
  diameters: number[];
} {
  const size = getSize(design.size);
  return {
    tiers: size?.tiers ?? 1,
    servings: size?.servings ?? 0,
    diameters: size?.diameters ?? [8],
  };
}

/** Whether a category currently holds a selection, for the tab checkmarks. */
export function hasSelection(design: CakeDesign, category: CategoryId): boolean {
  switch (category) {
    case "shape":
    case "size":
    case "flavour":
    case "frosting":
      return true;
    case "filling":
      return design.filling !== null;
    case "frostingColour":
      return design.frostingColour !== null;
    case "theme":
      return design.theme !== null;
    case "toppings":
      return design.toppings.length > 0;
    case "decorations":
      return design.decorations.length > 0;
    case "writing":
      return design.writing.trim().length > 0;
    case "notes":
      return design.notes.trim().length > 0;
    case "reference":
      return design.hasReferenceImage;
  }
}
