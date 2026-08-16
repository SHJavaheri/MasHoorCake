import { cn } from "@/lib/utils/cn";

/**
 * Placeholder wordmark.
 *
 * TODO(content): replace with the bakery's real logo (SVG preferred, light and
 * dark variants if it is not monochrome). Kept as inline SVG using
 * `currentColor` so it works in both themes with no second asset, and so the
 * Easter eggs can animate its parts.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 32"
      role="img"
      aria-label="Mashoor Cake"
      className={cn("text-text", className)}
      fill="none"
    >
      {/* Mark: a Khatam star, doubling as the candle flame in the Easter egg. */}
      <g stroke="currentColor" strokeWidth="1.25" className="text-accent">
        <rect x="6" y="9" width="14" height="14" />
        <rect x="6" y="9" width="14" height="14" transform="rotate(45 13 16)" />
      </g>
      <text
        x="34"
        y="22"
        fill="currentColor"
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "19px",
          letterSpacing: "0.01em",
        }}
      >
        Mashoor Cake
      </text>
    </svg>
  );
}
