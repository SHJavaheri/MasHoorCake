import type { SlotId, VisualRole } from "@/content/cake-maker/schema";

/**
 * The cake's coordinate system.
 *
 * Everything the drawing needs is computed here as pure functions of the
 * design. Nothing measures the DOM, which is what lets the identical component
 * render into a live preview, a printed page, and a PDF and come out the same.
 *
 * One viewBox serves every consumer, so a decoration authored once sits
 * correctly on a three-tier round cake and on a full sheet without changes.
 */

export const CANVAS = {
  width: 400,
  height: 440,
  /** The surface the cake sits on. */
  baseline: 372,
} as const;

/**
 * Inches-to-pixels reference. Sizes are scaled against a fixed diameter rather
 * than against the largest tier in the current cake, so a 6" and a 10" actually
 * look different — the preview is meant to convey scale, not just shape.
 */
const REFERENCE_DIAMETER = 14;
const REFERENCE_WIDTH = 300;
const MAX_WIDTH = 344;

/** Draw order. A decoration may override this with `visual.layer`. */
export const LAYER: Record<VisualRole, number> = {
  board: 10,
  shape: 20,
  sponge: 20,
  filling: 30,
  frosting: 40,
  texture: 50,
  drip: 60,
  decoration: 70,
  topping: 80,
};

export type Silhouette = "round" | "square" | "heart" | "sheet";

export type TierBox = {
  index: number;
  /** Left edge and top edge of the tier's front face. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Horizontal centre. */
  cx: number;
  /** Vertical radius of the top face — 0 for shapes with a flat top edge. */
  ry: number;
};

export type Point = { x: number; y: number; rotate: number; scale: number };

/* -------------------------------------------------------------------------- */
/* Tier layout                                                                  */
/* -------------------------------------------------------------------------- */

function widthForDiameter(diameter: number): number {
  return Math.min(MAX_WIDTH, (diameter / REFERENCE_DIAMETER) * REFERENCE_WIDTH);
}

/**
 * Stacks the tiers, largest at the bottom.
 *
 * `diameters` arrives largest-first from the size option, and index 0 of the
 * result is the bottom tier. Adding a five-tier size is therefore a content
 * edit: the drawing follows on its own.
 */
export function tierLayout(diameters: number[], silhouette: Silhouette): TierBox[] {
  if (silhouette === "sheet") {
    const w = Math.min(MAX_WIDTH, widthForDiameter(diameters[0] ?? 13));
    const h = 58;
    return [
      {
        index: 0,
        x: (CANVAS.width - w) / 2,
        y: CANVAS.baseline - h,
        w,
        h,
        cx: CANVAS.width / 2,
        ry: w * 0.045,
      },
    ];
  }

  if (silhouette === "heart") {
    // A heart reads a touch smaller than a drum of the same diameter, so it is
    // drawn slightly wider to sit consistently beside the other shapes.
    const w = widthForDiameter(diameters[0] ?? 8) * 1.05;
    const h = w * 0.86;
    return [
      {
        index: 0,
        x: (CANVAS.width - w) / 2,
        y: CANVAS.baseline - h,
        w,
        h,
        cx: CANVAS.width / 2,
        ry: 0,
      },
    ];
  }

  const boxes: TierBox[] = [];
  let bottom: number = CANVAS.baseline;

  diameters.forEach((diameter, index) => {
    const w = widthForDiameter(diameter);
    // Upper tiers are a little shallower, which is how real tiered cakes are
    // built and stops a three-tier reading as a stack of identical drums.
    const h = 62 - index * 6;
    const y = bottom - h;

    boxes.push({
      index,
      x: (CANVAS.width - w) / 2,
      y,
      w,
      h,
      cx: CANVAS.width / 2,
      ry: silhouette === "round" ? w * 0.09 : w * 0.05,
    });

    bottom = y;
  });

  return boxes;
}

/** The topmost tier — where toppings and writing go. */
export function topTier(boxes: TierBox[]): TierBox {
  return boxes[boxes.length - 1];
}

/* -------------------------------------------------------------------------- */
/* Silhouettes                                                                  */
/* -------------------------------------------------------------------------- */

/** Heart outline in a unit box, y-down. Scaled into the tier box. */
function heartPath(box: TierBox): string {
  const { x, y, w, h } = box;
  const px = (u: number) => x + u * w;
  const py = (v: number) => y + v * h;

  return [
    `M ${px(0.5)} ${py(1)}`,
    `C ${px(0.12)} ${py(0.74)} ${px(0)} ${py(0.52)} ${px(0)} ${py(0.33)}`,
    `C ${px(0)} ${py(0.12)} ${px(0.17)} ${py(0)} ${px(0.32)} ${py(0)}`,
    `C ${px(0.43)} ${py(0)} ${px(0.5)} ${py(0.08)} ${px(0.5)} ${py(0.17)}`,
    `C ${px(0.5)} ${py(0.08)} ${px(0.57)} ${py(0)} ${px(0.68)} ${py(0)}`,
    `C ${px(0.83)} ${py(0)} ${px(1)} ${py(0.12)} ${px(1)} ${py(0.33)}`,
    `C ${px(1)} ${py(0.52)} ${px(0.88)} ${py(0.74)} ${px(0.5)} ${py(1)}`,
    "Z",
  ].join(" ");
}

/**
 * The tier's outline and its top surface.
 *
 * `body` is the full silhouette — everything that gets sponge, filling and
 * frosting. `top` is the surface seen from slightly above, drawn a shade
 * lighter so the cake reads as an object rather than a flat sticker.
 */
export function shapePath(silhouette: Silhouette, box: TierBox): { body: string; top: string } {
  const { y, w, h, cx, ry } = box;
  const rx = w / 2;
  const left = cx - rx;
  const right = cx + rx;

  switch (silhouette) {
    case "round": {
      const body = [
        `M ${left} ${y}`,
        `L ${left} ${y + h - ry}`,
        `A ${rx} ${ry} 0 0 0 ${right} ${y + h - ry}`,
        `L ${right} ${y}`,
        `A ${rx} ${ry} 0 0 1 ${left} ${y}`,
        "Z",
      ].join(" ");

      const top = [
        `M ${left} ${y}`,
        `A ${rx} ${ry} 0 0 1 ${right} ${y}`,
        `A ${rx} ${ry} 0 0 1 ${left} ${y}`,
        "Z",
      ].join(" ");

      return { body, top };
    }

    case "square": {
      // A shallow trapezoid receding upward gives just enough dimension
      // without pretending to be a 3D render.
      const depth = ry * 2;
      const inset = w * 0.055;
      const r = 5;

      const body = [
        `M ${left} ${y}`,
        `L ${left} ${y + h - r}`,
        `Q ${left} ${y + h} ${left + r} ${y + h}`,
        `L ${right - r} ${y + h}`,
        `Q ${right} ${y + h} ${right} ${y + h - r}`,
        `L ${right} ${y}`,
        `L ${right - inset} ${y - depth}`,
        `L ${left + inset} ${y - depth}`,
        "Z",
      ].join(" ");

      const top = [
        `M ${left} ${y}`,
        `L ${left + inset} ${y - depth}`,
        `L ${right - inset} ${y - depth}`,
        `L ${right} ${y}`,
        "Z",
      ].join(" ");

      return { body, top };
    }

    case "heart": {
      const body = heartPath(box);
      // A heart is presented face-on, so there is no separate top surface.
      return { body, top: body };
    }

    case "sheet": {
      const depth = ry * 2;
      const inset = w * 0.03;
      const r = 6;

      const body = [
        `M ${left} ${y}`,
        `L ${left} ${y + h - r}`,
        `Q ${left} ${y + h} ${left + r} ${y + h}`,
        `L ${right - r} ${y + h}`,
        `Q ${right} ${y + h} ${right} ${y + h - r}`,
        `L ${right} ${y}`,
        `L ${right - inset} ${y - depth}`,
        `L ${left + inset} ${y - depth}`,
        "Z",
      ].join(" ");

      const top = [
        `M ${left} ${y}`,
        `L ${left + inset} ${y - depth}`,
        `L ${right - inset} ${y - depth}`,
        `L ${right} ${y}`,
        "Z",
      ].join(" ");

      return { body, top };
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Deterministic jitter                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Seeded PRNG. Decorations must land in the same place on every render: the PDF
 * has to match what the customer saw, and a print preview that reshuffles the
 * sprinkles looks broken.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* -------------------------------------------------------------------------- */
/* Anchors                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Where an option's instances sit.
 *
 * A decoration never carries coordinates — it names a slot and a count, and
 * this decides the rest. `seed` is the option id, so the layout is stable but
 * two different decorations in the same slot do not overlap exactly.
 */
export function anchorPoints(
  silhouette: Silhouette,
  boxes: TierBox[],
  slot: SlotId,
  count: number,
  seed: string,
): Point[] {
  const random = mulberry32(hash(`${seed}:${slot}:${silhouette}:${boxes.length}`));
  const top = topTier(boxes);
  const points: Point[] = [];

  switch (slot) {
    case "topSurface": {
      // A ring on the top face, with the centre used first for small counts.
      const rx = (top.w / 2) * 0.58;
      const ry = Math.max(top.ry * 0.9, top.w * 0.035);
      const cy = silhouette === "heart" ? top.y + top.h * 0.42 : top.y - top.ry * 0.15;

      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const wobble = 0.86 + random() * 0.28;
        points.push({
          x: top.cx + Math.cos(angle) * rx * wobble,
          y: cy + Math.sin(angle) * ry * wobble,
          rotate: (random() - 0.5) * 18,
          scale: 0.9 + random() * 0.2,
        });
      }
      return points;
    }

    case "topEdge": {
      // Along the visible front half of the top rim.
      for (let i = 0; i < count; i += 1) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const angle = Math.PI * (0.08 + t * 0.84);
        points.push({
          x: top.cx - Math.cos(angle) * (top.w / 2) * 0.94,
          y: top.y + Math.sin(angle) * top.ry * 0.9,
          rotate: 0,
          scale: 0.9 + random() * 0.2,
        });
      }
      return points;
    }

    case "band": {
      // Spread across the front faces of every tier, upper tiers first so a
      // small count decorates the visually dominant top.
      const ordered = [...boxes].reverse();
      for (let i = 0; i < count; i += 1) {
        const box = ordered[i % ordered.length];
        const withinTier = Math.floor(i / ordered.length);
        const perRow = Math.ceil(count / ordered.length);
        const t = (withinTier + 0.5 + (random() - 0.5) * 0.3) / Math.max(perRow, 1);

        points.push({
          x: box.x + box.w * (0.16 + t * 0.68),
          y: box.y + box.h * (0.42 + (random() - 0.5) * 0.18),
          rotate: (random() - 0.5) * 20,
          scale: 0.85 + random() * 0.3,
        });
      }
      return points;
    }

    case "base": {
      // A run along the bottom edge of every tier.
      const perTier = Math.max(2, Math.ceil(count / boxes.length));
      for (const box of boxes) {
        for (let i = 0; i < perTier; i += 1) {
          const t = (i + 0.5) / perTier;
          points.push({
            x: box.x + box.w * (0.06 + t * 0.88),
            y: box.y + box.h - (box.index === 0 ? box.ry * 0.5 : 1),
            rotate: 0,
            scale: 0.9 + random() * 0.15,
          });
        }
      }
      return points;
    }

    case "sideScatter": {
      for (let i = 0; i < count; i += 1) {
        const box = boxes[Math.floor(random() * boxes.length)];
        points.push({
          x: box.x + box.w * (0.1 + random() * 0.8),
          y: box.y + box.h * (0.15 + random() * 0.7),
          rotate: random() * 360,
          scale: 0.7 + random() * 0.6,
        });
      }
      return points;
    }

    case "plaque": {
      return [
        {
          x: top.cx,
          y: silhouette === "heart" ? top.y + top.h * 0.48 : top.y + top.h * 0.52,
          rotate: 0,
          // The plaque artwork is authored at PLAQUE_ART_WIDTH; scale it so it
          // always sits proportionally on the tier, whatever the cake size.
          scale: plaqueWidth(boxes) / PLAQUE_ART_WIDTH,
        },
      ];
    }
  }
}

/**
 * Intrinsic width of the plaque artwork in ../components/.../decor.tsx. The
 * plaque is scaled to the cake rather than drawn per size, so this constant and
 * that <rect> width must stay in step.
 */
export const PLAQUE_ART_WIDTH = 104;

/** Width the plaque actually occupies on the current cake. */
export function plaqueWidth(boxes: TierBox[]): number {
  return topTier(boxes).w * 0.72;
}
