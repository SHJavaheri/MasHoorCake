"use client";

import { useSyncExternalStore } from "react";

/**
 * The URL query string as a subscribable store.
 *
 * The gallery keeps its filters and its open cake in the URL so a view can be
 * shared, bookmarked, and restored by the back button. Rather than mirroring
 * that into React state — which means two sources of truth and a sync effect
 * between them — the URL *is* the state, and this exposes it as an external
 * store the way `useSyncExternalStore` intends.
 *
 * The snapshot is cached because `useSyncExternalStore` requires a stable
 * reference between changes; returning a fresh value each call loops forever.
 */

const listeners = new Set<() => void>();
let cached = "";

function emit() {
  cached = window.location.search;
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function getSnapshot() {
  if (cached !== window.location.search) cached = window.location.search;
  return cached;
}

/**
 * Replaces the query string and notifies subscribers.
 *
 * `replaceState`, not `pushState`: refining a filter is not a navigation, and
 * stacking every chip click into history would make the back button useless.
 */
export function setUrlSearch(query: string) {
  const next = query ? `?${query}` : window.location.pathname;
  window.history.replaceState(null, "", next);
  emit();
}

export function useUrlSearch(): string {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    // Prerendered HTML has no query string, so the server snapshot is empty.
    () => "",
  );
}
