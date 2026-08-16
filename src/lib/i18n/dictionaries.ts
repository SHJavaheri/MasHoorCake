import "server-only";

import en from "@/locales/en/common.json";
import fa from "@/locales/fa/common.json";

import type { Locale } from "./config";

/**
 * Dictionary loader.
 *
 * Statically imported rather than dynamically: with two small JSON files in a
 * fully static export there is nothing to code-split, and static imports give
 * exact inference plus a build-time error if a locale file goes missing.
 *
 * `en` is the source of truth for the shape.
 */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  // The Persian file carries an extra `_TRANSLATION_STATUS` marker key while
  // placeholder copy is in place, so it is a superset of the canonical shape.
  fa: fa as Dictionary,
};

/**
 * Async by design. Nothing here awaits today, but keeping the signature
 * promise-based means swapping in a CMS or per-locale chunk loading later is a
 * change to this file alone, not to every page that consumes it.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}
