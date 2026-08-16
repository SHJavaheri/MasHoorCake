import { orderForm } from "@/config/order";

/**
 * Order intent: the bridge between browsing and enquiring.
 *
 * When someone taps "Order something like this" on a cake, or settles on a size
 * and flavour combination, that choice is captured here and carried to the
 * order page. The page then greets them with what they picked instead of an
 * empty form, and the Google Form link is pre-filled with the same values.
 *
 * This is deliberately independent of *how* the order is submitted. Today it
 * builds a Google Forms prefill URL; when a native form replaces that, this
 * module is unchanged and only the adapter below is swapped. That is what keeps
 * the third-party form from becoming an architectural commitment.
 */

export type OrderIntent = {
  cakeSlug?: string;
  cakeName?: string;
  flavour?: string;
  filling?: string;
  occasion?: string;
  tiers?: number;
  servings?: number;
  capturedAt: number;
};

const STORAGE_KEY = "order-intent";

/**
 * sessionStorage, not localStorage: an intent is about the visit in progress.
 * Greeting someone next week with a cake they glanced at once would be strange.
 */
export function saveIntent(intent: Omit<OrderIntent, "capturedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const payload: OrderIntent = { ...intent, capturedAt: Date.now() };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Private browsing and storage-full both throw. Losing the seed is a
    // downgrade, not a failure: the order page still works without it.
  }
}

export function readIntent(): OrderIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OrderIntent;
    return typeof parsed?.capturedAt === "number" ? parsed : null;
  } catch {
    return null;
  }
}

export function clearIntent(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}

/**
 * Builds the Google Forms pre-filled link.
 *
 * Entry IDs come from the form's own "Get pre-filled link" feature and live in
 * config/order.ts. Until they are supplied, this degrades to the plain form URL
 * rather than emitting broken query parameters.
 */
export function buildOrderUrl(intent: OrderIntent | null): string {
  const { formUrl, entries } = orderForm;
  if (!intent || !entries) return formUrl;

  const params = new URLSearchParams({ usp: "pp_url" });
  const add = (id: string | undefined, value: string | number | undefined) => {
    if (id && value !== undefined && value !== "") params.set(id, String(value));
  };

  add(entries.cake, intent.cakeName);
  add(entries.flavour, intent.flavour);
  add(entries.filling, intent.filling);
  add(entries.occasion, intent.occasion);
  add(entries.tiers, intent.tiers);
  add(entries.servings, intent.servings);

  const separator = formUrl.includes("?") ? "&" : "?";
  return `${formUrl}${separator}${params.toString()}`;
}

/** Human-readable summary, e.g. "Saffron & Pistachio, 2 tiers, ~40 servings". */
export function describeIntent(intent: OrderIntent, unitLabel: string): string {
  const parts: string[] = [];
  if (intent.cakeName) parts.push(intent.cakeName);
  if (intent.flavour && !intent.cakeName) parts.push(intent.flavour);
  if (intent.tiers) parts.push(`${intent.tiers}×`);
  if (intent.servings) parts.push(`~${intent.servings} ${unitLabel}`);
  return parts.join(" · ");
}
