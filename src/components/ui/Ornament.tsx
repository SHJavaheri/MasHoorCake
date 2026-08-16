import { cn } from "@/lib/utils/cn";

/**
 * Persian ornament, used as texture rather than decoration.
 *
 * The motif is the eight-point Khatam star — the shape that anchors most
 * Persian geometric tilework. It appears only at very low opacity, and the rule
 * across the site is that it never competes with cake photography: the cakes
 * are the subject, the pattern is the frame.
 *
 * Rendered as inline SVG rather than an image file so it inherits `currentColor`
 * and therefore works in both themes without a second asset.
 */

/** Tiling background pattern. Intended for large, quiet surfaces. */
export function KhatamPattern({
  className,
  opacity = 0.05,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ opacity }}
    >
      <defs>
        <pattern id="khatam" width="72" height="72" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            {/* Two overlaid squares at 45° — the classic eight-point star. */}
            <rect x="18" y="18" width="36" height="36" />
            <rect x="18" y="18" width="36" height="36" transform="rotate(45 36 36)" />
            <circle cx="36" cy="36" r="4" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#khatam)" />
    </svg>
  );
}

/**
 * A single star, for use as a section divider or a small mark. Sized by the
 * caller via `className`.
 */
export function KhatamStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <rect x="10" y="10" width="28" height="28" />
      <rect x="10" y="10" width="28" height="28" transform="rotate(45 24 24)" />
    </svg>
  );
}

/**
 * Section divider: a hairline rule interrupted by a centred star. Reads as
 * bookbinding rather than as a horizontal rule.
 */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("text-accent flex items-center justify-center gap-5", className)}
      aria-hidden="true"
    >
      <span className="to-border-strong h-px w-16 bg-gradient-to-r from-transparent sm:w-28" />
      <KhatamStar className="h-5 w-5 opacity-70" />
      <span className="to-border-strong h-px w-16 bg-gradient-to-l from-transparent sm:w-28" />
    </div>
  );
}
