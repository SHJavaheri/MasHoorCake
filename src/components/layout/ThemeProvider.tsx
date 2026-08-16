"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

import { THEME_STORAGE_KEY } from "./ThemeScript";

/**
 * Wraps next-themes with our storage key so it stays in sync with the blocking
 * script in <head>. Three states are exposed: light, dark, and system.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={THEME_STORAGE_KEY}
      // We animate deliberately elsewhere; a global transition on theme swap
      // makes the whole page smear, which looks broken rather than smooth.
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
