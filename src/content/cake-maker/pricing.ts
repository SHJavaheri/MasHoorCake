/**
 * The global pricing levers.
 *
 * ============================================================================
 * TODO(pricing): EVERY NUMBER IN THIS FILE IS A PLACEHOLDER.
 *
 * To change what the Cake Maker estimates, edit this file. Per-option amounts
 * live on the options themselves (`priceDelta`, `pricePerServing`,
 * `priceMultiplier`) in ./options/*.ts. Between the two, nothing else in the
 * repository contains a currency amount — no component, no library function.
 * ============================================================================
 *
 * Nothing here produces a quote. The figure this feeds is labelled an estimate
 * everywhere it appears, and the summary says in plain words that the baker
 * confirms the real price herself.
 */
export const pricing = {
  currency: "USD",
  /** Locale for Intl.NumberFormat. Independent of the site's UI locale. */
  currencyLocale: "en-US",

  /** Covers the bake, the build, and the box, regardless of size. */
  base: 45,

  /** Added per serving from the chosen size. */
  perServing: 4.5,

  /** Added for each tier beyond the first — stacking and dowelling take time. */
  perExtraTier: 30,

  /**
   * The final figure is rounded UP to a multiple of this. Deliberately up: an
   * estimate that rounds down and then rises is the one outcome that makes a
   * customer feel misled.
   */
  roundUpTo: 5,

  /** Never quote below this, however small the cake. */
  minimum: 60,
} as const;
