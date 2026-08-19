import type { ReactNode } from "react";

import type { Silhouette, TierBox } from "@/lib/cake-maker/geometry";

/**
 * Decoration artwork.
 *
 * Two kinds, because decorations genuinely come in two shapes:
 *
 *  - POINT parts are drawn once per anchor point that geometry.ts hands back.
 *    A rose, a berry, a candle. They know nothing about the cake.
 *  - SPAN parts are drawn once for the whole cake and need the tier boxes —
 *    a drip runs the length of the rim, a gold band wraps every tier.
 *
 * Everything is kept deliberately simple: flat shapes, no gradients, no SVG
 * filters. Filters are the classic frame-rate killer and, more importantly
 * here, they do not survive being rasterised into a PDF.
 *
 * These are grouped rather than split one-per-file because each is a handful of
 * lines; the registry in ./registry.ts is the index.
 */

export type PointPartProps = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  fill: string;
};

export type SpanPartProps = {
  boxes: TierBox[];
  silhouette: Silhouette;
  fill: string;
};

/** Shared wrapper: positions and scales about the part's own centre. */
function At({ x, y, scale, rotate, children }: PointPartProps & { children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>{children}</g>;
}

/* -------------------------------------------------------------------------- */
/* Point parts                                                                  */
/* -------------------------------------------------------------------------- */

export function Berries(props: PointPartProps) {
  return (
    <At {...props}>
      <circle r={6} fill={props.fill} />
      <circle cx={-2} cy={-2} r={1.8} fill="#ffffff" opacity={0.35} />
    </At>
  );
}

export function Flower(props: PointPartProps) {
  return (
    <At {...props}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          rx={3.4}
          ry={6.2}
          cy={-4.4}
          fill={props.fill}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r={2.6} fill="#f0cf90" />
    </At>
  );
}

export function GoldFleck(props: PointPartProps) {
  return (
    <At {...props}>
      <path d="M -4 -2 L 1 -4 L 4 1 L -1 4 Z" fill={props.fill} />
    </At>
  );
}

export function Sprinkle(props: PointPartProps) {
  return (
    <At {...props}>
      <rect x={-3.2} y={-1.1} width={6.4} height={2.2} rx={1.1} fill={props.fill} />
    </At>
  );
}

export function Candle(props: PointPartProps) {
  return (
    <At {...props}>
      <rect x={-2.2} y={-22} width={4.4} height={22} rx={1.6} fill={props.fill} />
      {/* The wick and flame read at this size only as two flat shapes. */}
      <rect x={-0.5} y={-25} width={1} height={3} fill="#5b4a3a" />
      <path d="M 0 -34 C 3.2 -30 3 -26.5 0 -25 C -3 -26.5 -3.2 -30 0 -34 Z" fill="#f0cf90" />
    </At>
  );
}

export function Macaron(props: PointPartProps) {
  return (
    <At {...props}>
      <path d="M -8 -1.5 A 8 6 0 0 1 8 -1.5 Z" fill={props.fill} />
      <rect x={-8} y={-1.5} width={16} height={3} fill="#fdf4e3" />
      <path d="M -8 1.5 A 8 6 0 0 0 8 1.5 Z" fill={props.fill} />
    </At>
  );
}

export function Rose(props: PointPartProps) {
  return (
    <At {...props}>
      <circle r={8} fill={props.fill} />
      <circle r={5.4} fill="#ffffff" opacity={0.18} />
      <circle r={2.8} fill="#ffffff" opacity={0.22} />
    </At>
  );
}

export function Khatam(props: PointPartProps) {
  // The eight-point star from Persian marquetry, the same motif the rest of
  // the site uses as an ornament.
  const points = Array.from({ length: 16 }, (_, i) => {
    const radius = i % 2 === 0 ? 9 : 4;
    const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
    return `${(Math.cos(angle) * radius).toFixed(2)},${(Math.sin(angle) * radius).toFixed(2)}`;
  }).join(" ");

  return (
    <At {...props}>
      <polygon points={points} fill={props.fill} />
    </At>
  );
}

export function Ruffle(props: PointPartProps) {
  return (
    <At {...props}>
      <path d="M -10 8 C -10 -6 10 -6 10 8 Z" fill={props.fill} opacity={0.9} />
    </At>
  );
}

export function Pearls(props: PointPartProps) {
  return (
    <At {...props}>
      <circle r={2.6} fill={props.fill} />
      <circle cx={-0.8} cy={-0.8} r={0.9} fill="#ffffff" opacity={0.5} />
    </At>
  );
}

export function Plaque(props: PointPartProps) {
  // Sized to the cake by the caller via `scale`; the writing is drawn on top
  // of this by the Writing layer, not here.
  return (
    <At {...props}>
      <rect x={-52} y={-17} width={104} height={34} rx={6} fill={props.fill} />
      <rect x={-47} y={-12.5} width={94} height={25} rx={4} fill="#ffffff" opacity={0.12} />
    </At>
  );
}

/* -------------------------------------------------------------------------- */
/* Span parts                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * A drip running over the rim of the top tier.
 *
 * Built as one path so the tongues share a single fill and the whole thing
 * animates as one element rather than a dozen.
 */
export function Drip({ boxes, silhouette, fill }: SpanPartProps) {
  const top = boxes[boxes.length - 1];
  if (!top) return null;

  const count = Math.max(6, Math.round(top.w / 26));
  const step = top.w / count;
  const segments: string[] = [`M ${top.x} ${top.y}`];

  for (let i = 0; i < count; i += 1) {
    const x = top.x + i * step;
    // Deterministic variation: the same cake always drips the same way.
    const length = 10 + ((i * 37) % 17);
    const mid = x + step / 2;

    segments.push(
      `L ${x} ${top.y + 4}`,
      `Q ${mid} ${top.y + 4 + length * 1.5} ${x + step} ${top.y + 4}`,
    );
  }

  segments.push(`L ${top.x + top.w} ${top.y}`, "Z");

  // Round tiers have a curved rim, so the drip starts a little lower to sit on
  // the front of the ellipse rather than floating above it.
  const offset = silhouette === "round" ? top.ry * 0.5 : 0;

  return <path d={segments.join(" ")} fill={fill} transform={`translate(0 ${offset})`} />;
}

/** A painted stripe around the base of every tier. */
export function Band({ boxes, fill }: SpanPartProps) {
  return (
    <g fill={fill}>
      {boxes.map((box) => (
        <rect key={box.index} x={box.x} y={box.y + box.h - 7} width={box.w} height={5} rx={2} />
      ))}
    </g>
  );
}
