"use client";

import { useEffect, useState } from "react";

/**
 * Trails a value by `delay` milliseconds.
 *
 * Used so that typing in the Cake Maker's free-text fields does not write to
 * the URL and to sessionStorage on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
