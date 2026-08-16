import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[background-color,border-color,color,transform] duration-[var(--duration-fast)] " +
  "ease-[var(--ease-entrance)] active:scale-[0.98] " +
  // Touch targets stay at least 44px tall even at the small size.
  "min-h-11 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-contrast hover:bg-accent-hover shadow-[var(--shadow-sm)]",
  secondary: "border border-border-strong text-text hover:bg-surface hover:border-accent",
  ghost: "text-text-muted hover:text-text hover:bg-surface",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3",
  lg: "px-8 py-4 text-[length:var(--text-title)]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps & ComponentPropsWithoutRef<"button"> & { href?: never };
type AnchorProps = CommonProps & { href: string; external?: boolean };

/**
 * The single button in the system. Renders as a `next/link`, a plain anchor for
 * external destinations, or a `<button>` — so callers never have to restyle a
 * link to look like a button, which is where inconsistency creeps in.
 */
export function Button(props: ButtonProps | AnchorProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, external, ...rest } = props as AnchorProps;
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          {...omitStyling(rest)}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...omitStyling(rest)}>
        {children}
      </Link>
    );
  }

  const { ...rest } = props as ButtonProps;
  return (
    <button className={classes} {...omitStyling(rest)}>
      {children}
    </button>
  );
}

/** Strips the presentational props so they are not forwarded to the DOM. */
function omitStyling<T extends Record<string, unknown>>(props: T) {
  const { variant, size, className, children, external, href, ...rest } = props as T & {
    variant?: unknown;
    size?: unknown;
    className?: unknown;
    children?: unknown;
    external?: unknown;
    href?: unknown;
  };
  void variant;
  void size;
  void className;
  void children;
  void external;
  void href;
  return rest;
}
