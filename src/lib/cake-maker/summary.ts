import { getOption, getSize } from "@/content/cake-maker";
import { text } from "@/content/l10n";
import type { Locale } from "@/lib/i18n/config";

import { estimatePrice, formatEstimate } from "@/lib/cake-maker/pricing";
import { sizeFacts, type CakeDesign } from "@/lib/cake-maker/state";

/**
 * The Cake Request Summary, as data.
 *
 * One model feeds every rendering of the request: the on-screen receipt, the
 * print sheet, the PDF, and the shared message. They cannot drift apart,
 * because there is only one place that decides what a request says.
 */

export type SummaryRow = {
  id: string;
  label: string;
  value: string;
};

export type SummaryModel = {
  rows: SummaryRow[];
  writing: string;
  notes: string;
  hasReferenceImage: boolean;
  estimate: string;
  /** One-line description, used for the SVG title and the share subject. */
  headline: string;
};

/** Labels live here rather than in a locale file until FA copy lands. */
const LABELS = {
  shape: "Shape",
  size: "Size",
  servings: "Serves",
  flavour: "Flavour",
  filling: "Filling",
  frosting: "Frosting",
  toppings: "Toppings",
  decorations: "Decorations",
  theme: "Style",
} as const;

export function buildSummaryModel(design: CakeDesign, locale: Locale): SummaryModel {
  const rows: SummaryRow[] = [];
  const label = (id: keyof typeof LABELS) => LABELS[id];

  const push = (id: keyof typeof LABELS, value: string | undefined) => {
    if (value && value.trim()) rows.push({ id, label: label(id), value });
  };

  const size = getSize(design.size);
  const { tiers, servings } = sizeFacts(design);

  const shapeName = optionLabel("shape", design.shape, locale);
  const sizeName = size ? text(size.label, locale) : undefined;

  push("shape", tiers > 1 ? `${shapeName}, ${tiers} tiers` : shapeName);
  push("size", sizeName);
  push("servings", servings > 0 ? `about ${servings}` : undefined);
  push("flavour", optionLabel("flavour", design.flavour, locale));
  push("filling", design.filling ? optionLabel("filling", design.filling, locale) : undefined);

  const frosting = optionLabel("frosting", design.frosting, locale);
  const colour = design.frostingColour
    ? optionLabel("frostingColour", design.frostingColour, locale)
    : undefined;
  push("frosting", colour ? `${frosting}, ${colour.toLowerCase()}` : frosting);

  push("toppings", design.toppings.map((id) => optionLabel("toppings", id, locale)).join(", "));
  push(
    "decorations",
    design.decorations.map((id) => optionLabel("decorations", id, locale)).join(", "),
  );
  push("theme", design.theme ? optionLabel("theme", design.theme, locale) : undefined);

  const estimate = formatEstimate(estimatePrice(design).total);

  const headline = [
    tiers > 1 ? `${tiers}-tier` : undefined,
    shapeName?.toLowerCase(),
    optionLabel("flavour", design.flavour, locale)?.toLowerCase(),
    "cake",
    servings > 0 ? `for about ${servings}` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    rows,
    writing: design.writing.trim(),
    notes: design.notes.trim(),
    hasReferenceImage: design.hasReferenceImage,
    estimate,
    headline,
  };
}

function optionLabel(
  category:
    | "shape"
    | "flavour"
    | "filling"
    | "frosting"
    | "frostingColour"
    | "toppings"
    | "decorations"
    | "theme",
  id: string,
  locale: Locale,
): string | undefined {
  const option = getOption(category, id);
  return option ? text(option.label, locale) : undefined;
}
