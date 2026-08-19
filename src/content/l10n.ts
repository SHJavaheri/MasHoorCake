import { z } from "zod";

import type { Locale } from "@/lib/i18n/config";

/**
 * Locale scaffolding for content that ships English-first.
 *
 * The Cake Maker has several hundred short strings — category names, option
 * labels, helper notes — and the baker has not reviewed Persian copy for any of
 * them yet. Rather than block the feature or hardcode English into components,
 * every string is authored in this shape from day one and read through `text()`.
 *
 * THE UPGRADE PATH, which is the entire point of this file: when Persian copy
 * lands, delete `.optional()` below and delete the `?? value.en` fallback in
 * `text()`. TypeScript then fails the build on every string still missing a
 * translation, so nothing can be quietly forgotten. No component changes, no
 * refactor, and complete coverage.
 *
 * This deliberately parallels but does not reuse `localizedStringSchema` in
 * ./schema.ts, which requires *both* locales. Cake content is fully translated
 * and must stay that way; Cake Maker content is not yet.
 */
export const localizedTextSchema = z.object({
  en: z.string().min(1),
  fa: z.string().min(1).optional(),
});

export type LocalizedText = z.infer<typeof localizedTextSchema>;

/** Reads a localised string, falling back to English until Persian lands. */
export function text(value: LocalizedText, locale: Locale): string {
  return value[locale] ?? value.en;
}

/** Convenience for joining several labels into one human-readable phrase. */
export function textList(values: LocalizedText[], locale: Locale, separator = ", "): string {
  return values.map((value) => text(value, locale)).join(separator);
}
