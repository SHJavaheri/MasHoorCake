"use client";

import { text } from "@/content/l10n";
import type { CakeOption } from "@/content/cake-maker/schema";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

/**
 * One choice, as a card.
 *
 * The input is a real <input type="radio"> or <input type="checkbox">, visually
 * hidden inside the <label>. That is not a shortcut — it is how the card gets
 * arrow-key navigation, Home/End, group announcement, `aria-checked`, and
 * correct RTL behaviour without reimplementing any of it. An ARIA radiogroup
 * built from <button aria-pressed> would be more code and worse.
 */
export function OptionCard({
  option,
  locale,
  name,
  type,
  checked,
  onChange,
  disabled,
}: {
  option: CakeOption;
  locale: Locale;
  name: string;
  type: "radio" | "checkbox";
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "group border-border bg-surface rounded-card relative flex cursor-pointer flex-col gap-1 border p-4 text-start",
        "transition-[border-color,background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-entrance)]",
        "hover:border-border-strong active:scale-[0.99]",
        // The whole card reacts to the hidden input's state.
        "has-[:checked]:border-accent has-[:checked]:bg-accent-subtle/40",
        "has-[:focus-visible]:outline-focus-ring has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      <input
        type={type}
        name={name}
        value={option.id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />

      <span className="flex min-w-0 items-center gap-2.5 pe-7">
        {option.swatch && (
          <span
            aria-hidden="true"
            className="border-border-strong size-5 shrink-0 rounded-full border"
            style={{ backgroundColor: option.swatch }}
          />
        )}
        <span className="font-display text-[length:var(--text-title)] leading-tight">
          {text(option.label, locale)}
        </span>
      </span>

      {option.description && (
        <span className="text-text-muted text-sm leading-snug">
          {text(option.description, locale)}
        </span>
      )}

      {/* A tick rather than a colour change alone: colour is not available to
          everyone, and the selected state has to survive a greyscale print. */}
      <span
        aria-hidden="true"
        className="border-border text-accent-contrast group-has-[:checked]:border-accent group-has-[:checked]:bg-accent absolute end-3 top-3 flex size-5 items-center justify-center rounded-full border opacity-0 transition-opacity group-has-[:checked]:opacity-100"
      >
        <svg
          viewBox="0 0 12 12"
          className="size-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M2.5 6.5 5 9l4.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}

/** A colour choice. Same input mechanics, but the swatch is the whole card. */
export function SwatchCard({
  option,
  locale,
  name,
  checked,
  onChange,
}: {
  option: CakeOption;
  locale: Locale;
  name: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer flex-col items-center gap-2 text-center">
      <input
        type="radio"
        name={name}
        value={option.id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "border-border-strong size-14 rounded-full border transition-[box-shadow,transform] duration-[var(--duration-fast)]",
          "group-hover:scale-105",
          "group-has-[:checked]:ring-accent group-has-[:checked]:ring-2 group-has-[:checked]:ring-offset-4 group-has-[:checked]:ring-offset-[var(--surface)]",
          "group-has-[:focus-visible]:outline-focus-ring group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2",
        )}
        style={{ backgroundColor: option.swatch }}
        aria-hidden="true"
      />
      <span className="text-text-muted text-sm leading-tight">
        {text(option.label, locale)}
      </span>
    </label>
  );
}
