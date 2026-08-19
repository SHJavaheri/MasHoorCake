import { Fragment } from "react";

import { getOption, getSize } from "@/content/cake-maker";
import type { CakeOption, VisualRecipe } from "@/content/cake-maker/schema";

import { POINT_PARTS, SPAN_PARTS } from "@/components/cake-maker/svg/parts/registry";
import { asset } from "@/lib/images/assetPath";
import {
  anchorPoints,
  CANVAS,
  LAYER,
  plaqueWidth,
  shapePath,
  tierLayout,
  topTier,
  type Silhouette,
  type TierBox,
} from "@/lib/cake-maker/geometry";
import type { CakeDesign } from "@/lib/cake-maker/state";

/**
 * The cake.
 *
 * A pure function of the design: no hooks, no context, no effects, nothing that
 * measures the DOM. That is what lets the identical component render into the
 * live preview, the printed summary, and the PDF and produce the same picture.
 *
 * TWO RULES THAT MATTER MORE THAN THEY LOOK:
 *
 * 1. `idPrefix` is required, and every id inside must use it. The preview, the
 *    summary dialog and the hidden print sheet are all mounted at once, and
 *    duplicate SVG ids silently break clipPath and pattern references in every
 *    browser — the element resolves to whichever definition came first.
 *
 * 2. Colours are literal attributes, never CSS custom properties. A serialised
 *    SVG carries no stylesheet, so a `var()` fill rasterises black in the PDF.
 *    Icing colour is content (see content/cake-maker/schema.ts), not theme.
 */

/**
 * The stand, shadow and outline — the frame around the cake rather than the
 * cake itself. These are the one part of the drawing that *should* follow the
 * page theme, but they still cannot be CSS variables for the reason in rule 2
 * above, so the caller passes literals. PreviewPane supplies the dark set when
 * the page is in dark mode; the PDF and print paths take the light default.
 */
export type CakeChrome = { plate: string; shadow: string; outline: string };

export const LIGHT_CHROME: CakeChrome = {
  plate: "#dae2df",
  shadow: "rgba(18, 23, 22, 0.10)",
  outline: "rgba(18, 23, 22, 0.16)",
};

export const DARK_CHROME: CakeChrome = {
  plate: "#2a3532",
  shadow: "rgba(0, 0, 0, 0.55)",
  outline: "rgba(237, 242, 240, 0.22)",
};

export type CakeSvgProps = {
  design: CakeDesign;
  /** Namespace for every id in this instance. Must be unique on the page. */
  idPrefix: string;
  className?: string;
  /** Accessible description. Omit and pass aria-hidden when a caption exists. */
  title?: string;
  decorative?: boolean;
  chrome?: CakeChrome;
  /**
   * Cuts the cake open so the sponge and filling layers are visible.
   *
   * Shown while the customer is choosing a filling: under an opaque frosting
   * the choice would otherwise change nothing on screen, which makes it feel
   * like the preview is ignoring them.
   */
  cutaway?: boolean;
};

/** Where the knife goes — just right of centre, so both faces read clearly. */
function cutX(box: { cx: number; w: number }): number {
  return box.cx + box.w * 0.05;
}

/** Slightly darkened variant of a hex colour, for shading without gradients. */
function shade(hex: string, amount: number): string {
  const value = hex.replace("#", "");
  const num = parseInt(value, 16);
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

  const r = clamp(((num >> 16) & 255) * (1 - amount));
  const g = clamp(((num >> 8) & 255) * (1 - amount));
  const b = clamp((num & 255) * (1 - amount));

  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

type Layered = { layer: number; key: string; node: React.ReactNode };

export function CakeSvg({
  design,
  idPrefix,
  className,
  title,
  decorative = false,
  chrome = LIGHT_CHROME,
  cutaway = false,
}: CakeSvgProps) {
  const id = (name: string) => `${idPrefix}-${name}`;

  const size = getSize(design.size);
  const shapeOption = getOption("shape", design.shape);
  const silhouette: Silhouette = shapeOption?.visual?.silhouette ?? "round";
  const boxes = tierLayout(size?.diameters ?? [8], silhouette);
  const top = topTier(boxes);

  /* ---------------------------------------------------------------------- */
  /* Colours                                                                  */
  /* ---------------------------------------------------------------------- */

  const flavour = getOption("flavour", design.flavour);
  const filling = design.filling ? getOption("filling", design.filling) : undefined;
  const frosting = getOption("frosting", design.frosting);
  const frostingColour = design.frostingColour
    ? getOption("frostingColour", design.frostingColour)
    : undefined;

  const spongeFill = flavour?.visual?.fill ?? "#f2e3c2";
  const spongeShade = flavour?.visual?.fillAlt ?? shade(spongeFill, 0.08);
  const fillingFill = filling?.visual?.fill ?? "#fdf4e3";

  // The frosting's own colour is the default; a chosen tint overrides it.
  const frostingFill = frostingColour?.visual?.fill ?? frosting?.visual?.fill ?? "#fdf4e3";
  const texture = frosting?.visual?.texture ?? "smooth";
  // A naked finish is the one case where the sponge is meant to show through.
  const frostingOpacity = texture === "naked" ? 0.42 : 1;

  /* ---------------------------------------------------------------------- */
  /* Decorations                                                             */
  /* ---------------------------------------------------------------------- */

  const decorations: Layered[] = [];

  const draw = (option: CakeOption, source: string) => {
    const visual: VisualRecipe | undefined = option.visual;
    if (!visual) return;

    const layer = visual.layer ?? LAYER[visual.role];
    const fill = visual.fill ?? "#d4af37";
    const key = `${source}-${option.id}`;

    // Whole-cake artwork: a drip follows the rim, a band wraps every tier.
    const SpanPart = visual.svgId ? SPAN_PARTS[visual.svgId] : undefined;
    if (SpanPart) {
      decorations.push({
        layer,
        key,
        node: <SpanPart boxes={boxes} silhouette={silhouette} fill={fill} />,
      });
      return;
    }

    const points = anchorPoints(
      silhouette,
      boxes,
      visual.slot ?? "topSurface",
      visual.count ?? 1,
      option.id,
    );

    // Per-anchor artwork, either an inline part or — the escape hatch — a PNG.
    const PointPart = visual.svgId ? POINT_PARTS[visual.svgId] : undefined;

    decorations.push({
      layer,
      key,
      node: (
        <g>
          {points.map((point, index) => {
            const scale = point.scale * (visual.scale ?? 1);

            if (PointPart) {
              return (
                <PointPart
                  key={index}
                  x={point.x}
                  y={point.y}
                  scale={scale}
                  rotate={point.rotate}
                  fill={fill}
                />
              );
            }

            if (visual.spriteId) {
              const px = 42 * scale;
              return (
                <image
                  key={index}
                  // asset() is mandatory: <image href> is not rewritten by Next
                  // under basePath the way next/link and next/image are.
                  href={asset(`/images/cake-maker/sprites/${visual.spriteId}.png`)}
                  x={point.x - px / 2}
                  y={point.y - px / 2}
                  width={px}
                  height={px}
                  transform={`rotate(${point.rotate} ${point.x} ${point.y})`}
                  preserveAspectRatio="xMidYMid meet"
                />
              );
            }

            return null;
          })}
        </g>
      ),
    });
  };

  for (const optionId of design.toppings) {
    const option = getOption("toppings", optionId);
    if (option) draw(option, "topping");
  }
  for (const optionId of design.decorations) {
    const option = getOption("decorations", optionId);
    if (option) draw(option, "decoration");
  }

  decorations.sort((a, b) => a.layer - b.layer);

  /* ---------------------------------------------------------------------- */
  /* Writing                                                                  */
  /* ---------------------------------------------------------------------- */

  const plaqueOption =
    design.toppings
      .map((optionId) => getOption("toppings", optionId))
      .find((option) => option?.visual?.slot === "plaque") ?? undefined;

  const writing = design.writing.trim();
  const plaquePoint = plaqueOption
    ? anchorPoints(silhouette, boxes, "plaque", 1, plaqueOption.id)[0]
    : undefined;

  return (
    <svg
      viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
      preserveAspectRatio="xMidYMax meet"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-labelledby={!decorative && title ? id("title") : undefined}
    >
      {!decorative && title && <title id={id("title")}>{title}</title>}

      <defs>
        {boxes.map((box) => (
          <clipPath key={box.index} id={id(`tier-${box.index}`)}>
            <path d={shapePath(silhouette, box).body} />
          </clipPath>
        ))}
        {/* The cut face: everything to the right of the knife. Nested inside
            the tier clip at use, so it follows the cake's own outline. */}
        {boxes.map((box) => (
          <clipPath key={box.index} id={id(`cut-${box.index}`)}>
            <rect
              x={cutX(box)}
              y={box.y - box.ry * 2}
              width={box.w}
              height={box.h + box.ry * 4}
            />
          </clipPath>
        ))}
      </defs>

      {/* The stand, then a tight contact shadow where the cake meets it. An
          ellipse rather than a blur filter: filters cost frames and do not
          survive rasterisation into the PDF. */}
      <CakeStand baseline={CANVAS.baseline} width={boxes[0].w} chrome={chrome} />
      <ellipse
        cx={CANVAS.width / 2}
        cy={CANVAS.baseline + 1}
        rx={boxes[0].w * 0.5}
        ry={4}
        fill={chrome.shadow}
      />

      {boxes.map((box) => (
        <Tier
          key={box.index}
          box={box}
          silhouette={silhouette}
          clipId={id(`tier-${box.index}`)}
          spongeFill={spongeFill}
          spongeShade={spongeShade}
          fillingFill={fillingFill}
          hasFilling={Boolean(filling)}
          frostingFill={frostingFill}
          frostingOpacity={frostingOpacity}
          texture={texture}
          outline={chrome.outline}
          cutaway={cutaway}
          cutClipId={id(`cut-${box.index}`)}
        />
      ))}

      {decorations.map((decoration) => (
        <Fragment key={decoration.key}>{decoration.node}</Fragment>
      ))}

      {plaqueOption && plaquePoint && writing.length > 0 && (
        <text
          x={plaquePoint.x}
          y={plaquePoint.y}
          textAnchor="middle"
          dominantBaseline="central"
          // Shrinks as the message grows so long writing stays inside the
          // plaque. 0.55em is a fair average advance for Georgia; the 0.86
          // keeps a margin rather than running to the very edge.
          fontSize={Math.max(
            7,
            Math.min(15, (plaqueWidth(boxes) * 0.86) / Math.max(writing.length * 0.55, 1)),
          )}
          fill="#ffffff"
          fontFamily="Georgia, serif"
        >
          {writing}
        </text>
      )}

      {/* A single flat highlight. Sells the roundness at almost no cost. */}
      <ellipse
        cx={top.cx - top.w * 0.22}
        cy={top.y + top.h * 0.34}
        rx={top.w * 0.1}
        ry={top.h * 0.2}
        fill="#ffffff"
        opacity={0.12}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Layers                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A nod to the footed cake stand in the bakery's own logo: a wide plate, a
 * pedestal that flares as it descends, and a broad foot.
 */
function CakeStand({
  baseline,
  width,
  chrome,
}: {
  baseline: number;
  width: number;
  chrome: CakeChrome;
}) {
  const cx = CANVAS.width / 2;
  const plateHalf = Math.max(width * 0.6, 96);
  const stemTop = baseline + 9;
  const footTop = baseline + 42;

  return (
    <g fill={chrome.plate}>
      {/* Plate, with a lip so it reads as a dish rather than a shelf. */}
      <rect x={cx - plateHalf} y={baseline} width={plateHalf * 2} height={9} rx={4.5} />
      <ellipse cx={cx} cy={baseline + 9} rx={plateHalf * 0.94} ry={4} />

      {/* Pedestal — widening downward, which is what makes it read as a
          support rather than an anchor. */}
      <path
        d={`M ${cx - 8} ${stemTop} C ${cx - 9} ${stemTop + 18} ${cx - 15} ${footTop - 10} ${cx - 17} ${footTop} L ${cx + 17} ${footTop} C ${cx + 15} ${footTop - 10} ${cx + 9} ${stemTop + 18} ${cx + 8} ${stemTop} Z`}
      />

      <rect x={cx - 46} y={footTop} width={92} height={8} rx={4} />
      <ellipse cx={cx} cy={footTop + 8} rx={46} ry={3.5} />
    </g>
  );
}

type TierProps = {
  box: TierBox;
  silhouette: Silhouette;
  clipId: string;
  spongeFill: string;
  spongeShade: string;
  fillingFill: string;
  hasFilling: boolean;
  frostingFill: string;
  frostingOpacity: number;
  texture: string;
  outline: string;
  cutaway: boolean;
  cutClipId: string;
};

function Tier({
  box,
  silhouette,
  clipId,
  spongeFill,
  spongeShade,
  fillingFill,
  hasFilling,
  frostingFill,
  frostingOpacity,
  texture,
  outline,
  cutaway,
  cutClipId,
}: TierProps) {
  const { body, top } = shapePath(silhouette, box);

  // Two sponge layers with filling between is the honest cross-section for a
  // single tier; taller tiers get a third.
  const stripes = box.h > 56 ? 2 : 1;

  return (
    <g>
      {/* Sponge, with a darker crust along the base. The crust only actually
          shows through a naked finish — which is precisely when the crumb is
          meant to be part of the look. */}
      <path d={body} fill={spongeFill} className="cake-fill-transition" />
      <g clipPath={`url(#${clipId})`}>
        <rect
          x={box.x - 4}
          y={box.y + box.h - 10}
          width={box.w + 8}
          height={10}
          fill={spongeShade}
          className="cake-fill-transition"
        />
      </g>

      {/* Filling, clipped to the tier so the stripes cannot escape the edge. */}
      {hasFilling && (
        <g clipPath={`url(#${clipId})`}>
          {Array.from({ length: stripes }, (_, index) => (
            <rect
              key={index}
              x={box.x - 4}
              y={box.y + (box.h / (stripes + 1)) * (index + 1) - 4}
              width={box.w + 8}
              height={8}
              fill={fillingFill}
              className="cake-fill-transition"
            />
          ))}
        </g>
      )}

      {/* Frosting skin. A naked finish drops the opacity so the sponge and the
          filling stripes read through, which is exactly what it looks like. */}
      <path
        d={body}
        fill={frostingFill}
        fillOpacity={frostingOpacity}
        className="cake-fill-transition"
      />

      {/* Surface treatment. Scallops and combing, drawn as flat shapes and
          clipped to the tier rather than as a pattern fill. */}
      {texture === "swirl" && (
        <g clipPath={`url(#${clipId})`} fill={shade(frostingFill, 0.08)} opacity={0.65}>
          {Array.from({ length: Math.round(box.w / 22) }, (_, index) => (
            <circle key={index} cx={box.x + 11 + index * 22} cy={box.y + box.h * 0.62} r={11} />
          ))}
        </g>
      )}

      {texture === "rustic" && (
        <g
          clipPath={`url(#${clipId})`}
          stroke={shade(frostingFill, 0.1)}
          strokeWidth={3}
          fill="none"
          opacity={0.7}
        >
          {Array.from({ length: 3 }, (_, index) => (
            <path
              key={index}
              d={`M ${box.x} ${box.y + box.h * (0.25 + index * 0.25)} q ${box.w / 4} -6 ${box.w / 2} 0 t ${box.w / 2} 0`}
            />
          ))}
        </g>
      )}

      {/* Top surface, a shade lighter so the tier reads as an object. */}
      {silhouette !== "heart" && (
        <path
          d={top}
          fill={shade(frostingFill, -0.06)}
          fillOpacity={frostingOpacity}
          className="cake-fill-transition"
        />
      )}

      {/*
       * The cut face.
       *
       * Drawn over the finished tier rather than by masking the frosting away,
       * which keeps the normal path untouched. It is always in the tree at
       * opacity 0 so the knife "opens" the cake with a plain opacity fade —
       * no mount/unmount, and no animated property other than opacity.
       */}
      <g
        clipPath={`url(#${clipId})`}
        opacity={cutaway ? 1 : 0}
        className="cake-cutaway"
        aria-hidden="true"
      >
        <g clipPath={`url(#${cutClipId})`}>
          <CutFace
            box={box}
            spongeFill={spongeFill}
            spongeShade={spongeShade}
            fillingFill={fillingFill}
            hasFilling={hasFilling}
            frostingFill={frostingFill}
          />
        </g>
        {/* The knife edge itself. */}
        <line
          x1={cutX(box)}
          y1={box.y - box.ry}
          x2={cutX(box)}
          y2={box.y + box.h}
          stroke={outline}
          strokeWidth={1}
        />
      </g>

      {/* A hairline keeps pale frostings from dissolving into a pale page. */}
      <path d={body} fill="none" stroke={outline} strokeWidth={1} />
    </g>
  );
}

/**
 * The inside of a cut tier: alternating sponge and filling, wrapped in the thin
 * shell of frosting you would actually see on a cut slice.
 */
function CutFace({
  box,
  spongeFill,
  spongeShade,
  fillingFill,
  hasFilling,
  frostingFill,
}: {
  box: TierBox;
  spongeFill: string;
  spongeShade: string;
  fillingFill: string;
  hasFilling: boolean;
  frostingFill: string;
}) {
  const SHELL = 5;
  const FILLING = 7;

  // Taller tiers get an extra layer, which is how they are really built.
  const layers = hasFilling ? (box.h > 56 ? 3 : 2) : 0;
  const innerTop = box.y + SHELL;
  const innerHeight = box.h - SHELL;
  const spongeHeight = (innerHeight - layers * FILLING) / (layers + 1);

  // The crumb stops short of the outer wall so the frosting behind it shows as
  // a shell — a cut slice has frosting on its outside edge, not bare sponge.
  const crumbX = box.x - 4;
  const crumbWidth = box.w + 4 - SHELL;

  const bands: React.ReactNode[] = [];
  let y = innerTop;

  for (let i = 0; i <= layers; i += 1) {
    bands.push(
      <rect
        key={`sponge-${i}`}
        x={crumbX}
        y={y}
        width={crumbWidth}
        height={spongeHeight}
        fill={spongeFill}
        className="cake-fill-transition"
      />,
    );
    y += spongeHeight;

    if (i < layers) {
      bands.push(
        <rect
          key={`filling-${i}`}
          x={crumbX}
          y={y}
          width={crumbWidth}
          height={FILLING}
          fill={fillingFill}
          className="cake-fill-transition"
        />,
      );
      y += FILLING;
    }
  }

  return (
    <>
      {/* Frosting shell, so the cut reads as a slice out of a finished cake
          rather than a bare sponge sitting next to one. */}
      <rect
        x={box.x - 4}
        y={box.y - box.ry * 2}
        width={box.w + 8}
        height={box.h + box.ry * 4}
        fill={frostingFill}
        className="cake-fill-transition"
      />
      {bands}
      {/* A baked edge along the base of the crumb. */}
      <rect
        x={crumbX}
        y={box.y + box.h - 3}
        width={crumbWidth}
        height={3}
        fill={spongeShade}
        className="cake-fill-transition"
      />
    </>
  );
}
