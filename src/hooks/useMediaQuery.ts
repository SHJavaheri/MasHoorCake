"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: a media query is
 * an external store, and this is the primitive built for exactly that. It also
 * avoids the cascading extra render that setting state inside an effect causes,
 * and gives a correct server snapshot instead of a flash of the wrong branch.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

const noopSubscribe = () => () => {};

/**
 * True only after hydration.
 *
 * For anything that cannot be known on the server — the resolved theme, a
 * stored preference — so the first client render matches the server's HTML and
 * the correct value appears on the render immediately after.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
