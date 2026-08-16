import type { ReactNode } from "react";

/**
 * Pass-through root layout.
 *
 * `<html>` needs `lang` and `dir` derived from the locale, but the locale lives
 * in the `[locale]` segment below this one — a root layout cannot read it. So
 * the document shell is rendered by `app/[locale]/layout.tsx` (and by the root
 * redirect page, which has no locale), and this layout only forwards children.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
