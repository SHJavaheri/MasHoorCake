import { normalise, type CakeDesign } from "@/lib/cake-maker/state";

/**
 * Session persistence for a design in progress, and the seed handed over from
 * elsewhere on the site.
 *
 * This replaces lib/order/intent.ts, which carried the same idea to a Google
 * Form. Same reasoning about storage: sessionStorage, not localStorage, because
 * a half-designed cake is about the visit in progress. Greeting someone next
 * week with a cake they abandoned would be strange.
 *
 * Every access is wrapped: private browsing and a full quota both throw, and
 * losing this is a downgrade rather than a failure — the designer still works.
 */

const DESIGN_KEY = "cake-design";
const SEED_KEY = "cake-design-seed";

/* -------------------------------------------------------------------------- */
/* The design in progress                                                       */
/* -------------------------------------------------------------------------- */

export function saveDesign(design: CakeDesign): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DESIGN_KEY, JSON.stringify(design));
  } catch {
    /* no-op — see the note above. */
  }
}

export function readDesign(base: CakeDesign): CakeDesign | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DESIGN_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CakeDesign>;
    if (typeof parsed !== "object" || parsed === null) return null;

    // The stored shape may predate a catalog change, so it is merged onto a
    // fresh design and normalised rather than trusted wholesale.
    return normalise({ ...base, ...parsed, hasReferenceImage: false });
  } catch {
    return null;
  }
}

export function clearDesign(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(DESIGN_KEY);
  } catch {
    /* no-op */
  }
}

/* -------------------------------------------------------------------------- */
/* The seed                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * A partial design handed to the Cake Maker from somewhere else — "design
 * something like this" on a gallery cake, or the size and flavour explorers.
 * Consumed once and cleared, so a later visit starts clean.
 */
export type DesignSeed = Partial<
  Pick<CakeDesign, "shape" | "size" | "flavour" | "filling" | "theme">
> & {
  /** Shown as "you're designing something like <name>" when it came from a cake. */
  fromCakeName?: string;
  capturedAt: number;
};

export function saveSeed(seed: Omit<DesignSeed, "capturedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const payload: DesignSeed = { ...seed, capturedAt: Date.now() };
    window.sessionStorage.setItem(SEED_KEY, JSON.stringify(payload));
  } catch {
    /* no-op */
  }
}

export function readSeed(): DesignSeed | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SEED_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as DesignSeed;
    return typeof parsed?.capturedAt === "number" ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSeed(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SEED_KEY);
  } catch {
    /* no-op */
  }
}
