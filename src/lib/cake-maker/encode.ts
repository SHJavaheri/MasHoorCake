import { normalise, type CakeDesign } from "@/lib/cake-maker/state";

/**
 * The design as URL state.
 *
 * A design is worth sharing — with a partner, or back to yourself on a phone —
 * so it lives in the query string. This follows the serialisation pattern
 * already proven by lib/gallery/filters.ts, and pairs with the existing
 * useUrlSearch / setUrlSearch hooks rather than introducing a router dependency.
 *
 * The reference image is deliberately absent: it is far too large for a URL and
 * it never leaves the browser. A shared link reproduces the cake but not the
 * photo, and the UI says so.
 */

/** Short keys, because this string ends up inside a WhatsApp message. */
const KEYS = {
  shape: "sh",
  size: "sz",
  flavour: "fl",
  filling: "fi",
  frosting: "fr",
  frostingColour: "fc",
  toppings: "tp",
  decorations: "dc",
  theme: "th",
  writing: "wr",
  notes: "nt",
} as const;

/**
 * Notes are capped harder in the URL than in the design. The full text stays in
 * memory and reaches the baker through the message and the PDF; truncating here
 * only protects the link, and the summary flags when it has happened.
 */
export const URL_NOTES_LIMIT = 200;

export function designToParams(design: CakeDesign): URLSearchParams {
  const params = new URLSearchParams();

  params.set(KEYS.shape, design.shape);
  params.set(KEYS.size, design.size);
  params.set(KEYS.flavour, design.flavour);
  params.set(KEYS.frosting, design.frosting);

  if (design.filling) params.set(KEYS.filling, design.filling);
  if (design.frostingColour) params.set(KEYS.frostingColour, design.frostingColour);
  if (design.theme) params.set(KEYS.theme, design.theme);

  if (design.toppings.length > 0) params.set(KEYS.toppings, design.toppings.join(","));
  if (design.decorations.length > 0) {
    params.set(KEYS.decorations, design.decorations.join(","));
  }

  if (design.writing.trim()) params.set(KEYS.writing, design.writing.trim());
  if (design.notes.trim()) {
    params.set(KEYS.notes, design.notes.trim().slice(0, URL_NOTES_LIMIT));
  }

  return params;
}

/** True when a link's notes were shortened to fit. */
export function notesWereTruncated(design: CakeDesign): boolean {
  return design.notes.trim().length > URL_NOTES_LIMIT;
}

function list(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

/**
 * Reads a design out of a query string.
 *
 * Unknown ids are not an error: `normalise` drops anything the catalog no
 * longer recognises, so a link shared before the baker renamed an option comes
 * back as a slightly different cake rather than a broken one.
 */
export function designFromParams(params: URLSearchParams, base: CakeDesign): CakeDesign {
  const read = (key: string, fallback: string) => params.get(key) ?? fallback;

  return normalise({
    ...base,
    shape: read(KEYS.shape, base.shape),
    size: read(KEYS.size, base.size),
    flavour: read(KEYS.flavour, base.flavour),
    frosting: read(KEYS.frosting, base.frosting),
    filling: params.get(KEYS.filling) ?? null,
    frostingColour: params.get(KEYS.frostingColour) ?? null,
    theme: params.get(KEYS.theme) ?? null,
    toppings: list(params.get(KEYS.toppings)),
    decorations: list(params.get(KEYS.decorations)),
    writing: params.get(KEYS.writing) ?? "",
    notes: params.get(KEYS.notes) ?? "",
  });
}

/** Whether a query string carries a design at all, as opposed to being empty. */
export function hasDesignParams(params: URLSearchParams): boolean {
  return Object.values(KEYS).some((key) => params.has(key));
}
