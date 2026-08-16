import { Fraunces, Inter, Vazirmatn } from "next/font/google";

/**
 * Typefaces.
 *
 * `next/font/google` downloads these at build time and serves them from our own
 * origin — there is no runtime request to Google, so this is self-hosting with
 * less ceremony, and it works under `output: "export"`.
 *
 * TODO(content): swap if the bakery has brand typefaces of its own.
 */

/**
 * Display serif. Fraunces is variable with optical-size and "softness" axes,
 * which lets large headings stay high-contrast and editorial while small ones
 * remain readable — exactly the warm-but-refined register we want.
 */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
});

/** Body sans. Quiet by design — it should never compete with the display face. */
export const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

/**
 * Persian. Vazirmatn is the best-maintained open Persian variable font and
 * covers both body and headings, since Fraunces has no Arabic-script coverage.
 */
export const fontPersian = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-persian",
});

export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontPersian.variable,
].join(" ");
