"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

/**
 * Language switcher.
 *
 * Swaps the locale segment of the current path rather than sending everyone to
 * the home page — someone reading the gallery in English should land on the
 * gallery in Persian, not be thrown back to the start.
 *
 * `usePathname` returns the path without `basePath`, and `next/link` adds it
 * back, so the prefix is handled correctly without any manual string work.
 */
export function LocaleSwitcher({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";

  function pathForLocale(target: Locale) {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return `/${target}/`;
    segments[0] = target;
    return `/${segments.join("/")}/`;
  }

  return (
    <div
      className={cn(
        "border-border flex items-center gap-0.5 rounded-full border p-0.5",
        className,
      )}
      role="group"
      aria-label={label}
    >
      {locales.map((l) => {
        const isActive = l === locale;
        return (
          <Link
            key={l}
            href={pathForLocale(l)}
            hrefLang={l}
            aria-current={isActive ? "true" : undefined}
            // The label is set in its own language, so mark it as such for
            // screen readers rather than letting them read Persian as English.
            lang={l}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm transition-colors duration-[var(--duration-fast)]",
              isActive
                ? "bg-accent text-accent-contrast"
                : "text-text-muted hover:bg-surface hover:text-text",
            )}
          >
            {localeNames[l]}
          </Link>
        );
      })}
    </div>
  );
}
