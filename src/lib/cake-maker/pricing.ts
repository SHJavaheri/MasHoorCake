import { getOption, getSize } from "@/content/cake-maker";
import { pricing } from "@/content/cake-maker/pricing";
import type { CakeOption } from "@/content/cake-maker/schema";

import { sizeFacts, type CakeDesign } from "@/lib/cake-maker/state";

/**
 * The estimate.
 *
 * This never produces a quote. The number it returns is labelled an estimate
 * everywhere it is rendered — EstimateBadge is the only component that displays
 * it, and it hardcodes the disclaimer, so there is no code path that shows a
 * price without one.
 *
 * Every amount comes from content/cake-maker/pricing.ts or from the options
 * themselves. There are no currency literals in this file.
 */

export type PriceLine = { id: string; amount: number };

export type PriceEstimate = {
  currency: string;
  /** Itemisation, available but deliberately not rendered by default. */
  lines: PriceLine[];
  total: number;
};

/** Every option the design currently has selected, in catalog order. */
function selectedOptions(design: CakeDesign): CakeOption[] {
  const picked: (CakeOption | undefined)[] = [
    getOption("shape", design.shape),
    getOption("size", design.size),
    getOption("flavour", design.flavour),
    design.filling ? getOption("filling", design.filling) : undefined,
    getOption("frosting", design.frosting),
    design.frostingColour ? getOption("frostingColour", design.frostingColour) : undefined,
    ...design.toppings.map((id) => getOption("toppings", id)),
    ...design.decorations.map((id) => getOption("decorations", id)),
    design.theme ? getOption("theme", design.theme) : undefined,
  ];

  return picked.filter((option): option is CakeOption => option !== undefined);
}

export function estimatePrice(design: CakeDesign): PriceEstimate {
  const options = selectedOptions(design);
  const { servings, tiers } = sizeFacts(design);
  const lines: PriceLine[] = [];

  // 1. The flat base.
  let subtotal = pricing.base;
  lines.push({ id: "base", amount: pricing.base });

  // 2. Per-serving, including any premium the chosen sponge or filling adds.
  const perServing =
    pricing.perServing + options.reduce((sum, option) => sum + option.pricePerServing, 0);
  const servingCost = perServing * servings;
  subtotal += servingCost;
  lines.push({ id: "servings", amount: servingCost });

  // 3. Stacking and dowelling, per tier above the first.
  if (tiers > 1) {
    const tierCost = (tiers - 1) * pricing.perExtraTier;
    subtotal += tierCost;
    lines.push({ id: "tiers", amount: tierCost });
  }

  // 4. Flat additions for individual options.
  for (const option of options) {
    if (option.priceDelta !== 0) {
      subtotal += option.priceDelta;
      lines.push({ id: option.id, amount: option.priceDelta });
    }
  }

  // 5. Multipliers last, so they scale everything before them — sculpted work
  //    is slower across the whole build, not just the decoration.
  const multiplier = options.reduce(
    (product, option) => product * (option.priceMultiplier ?? 1),
    1,
  );
  subtotal *= multiplier;

  // 6. Round UP, then floor at the minimum. Up rather than to-nearest: an
  //    estimate that lands under the real price is the one that causes an
  //    awkward conversation later.
  const rounded = Math.ceil(subtotal / pricing.roundUpTo) * pricing.roundUpTo;
  const total = Math.max(pricing.minimum, rounded);

  return { currency: pricing.currency, lines, total };
}

/** Formats the estimate as currency. Whole units — cents imply precision. */
export function formatEstimate(total: number): string {
  return new Intl.NumberFormat(pricing.currencyLocale, {
    style: "currency",
    currency: pricing.currency,
    maximumFractionDigits: 0,
  }).format(total);
}

/** The lowest price the Cake Maker can produce, for "from $X" teasers. */
export function startingEstimate(): number {
  return Math.max(
    pricing.minimum,
    Math.ceil(
      (pricing.base + pricing.perServing * (getSize("six-inch")?.servings ?? 8)) /
        pricing.roundUpTo,
    ) * pricing.roundUpTo,
  );
}
