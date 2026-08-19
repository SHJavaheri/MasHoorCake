import type { ComponentType } from "react";

import { cakeMakerCatalog } from "@/content/cake-maker";

import {
  Band,
  Berries,
  Candle,
  Drip,
  Flower,
  GoldFleck,
  Khatam,
  Macaron,
  Pearls,
  Plaque,
  Rose,
  Ruffle,
  Sprinkle,
  type PointPartProps,
  type SpanPartProps,
} from "@/components/cake-maker/svg/parts/decor";

/**
 * The decoration registry — the Cake Maker's extension point.
 *
 * Content references artwork by `visual.svgId`; this is the only place that
 * maps an id to a drawing. Adding a decoration with new art is one entry in
 * ../decor.tsx plus one line here. Adding one from a PNG is zero code — set
 * `visual.spriteId` instead and CakeSvg renders it through <image>.
 */

export const POINT_PARTS: Record<string, ComponentType<PointPartProps>> = {
  berries: Berries,
  flower: Flower,
  goldFleck: GoldFleck,
  sprinkle: Sprinkle,
  candle: Candle,
  macaron: Macaron,
  rose: Rose,
  khatam: Khatam,
  ruffle: Ruffle,
  pearls: Pearls,
  plaque: Plaque,
};

/** Drawn once for the whole cake; these need the tier boxes. */
export const SPAN_PARTS: Record<string, ComponentType<SpanPartProps>> = {
  drip: Drip,
  band: Band,
};

export function isKnownPart(svgId: string): boolean {
  return svgId in POINT_PARTS || svgId in SPAN_PARTS;
}

/**
 * Referential integrity for the drawing layer, mirroring what
 * content/cake-maker/index.ts does for the data: a `visual.svgId` naming a part
 * that does not exist would silently draw nothing, so fail the build instead.
 *
 * It lives here rather than in the content layer so that content stays free of
 * any dependency on React components.
 */
for (const [categoryId, options] of Object.entries(cakeMakerCatalog.options)) {
  for (const option of options) {
    const { svgId, spriteId } = option.visual ?? {};

    if (svgId && spriteId) {
      throw new Error(
        `[cake-maker svg] option "${categoryId}/${option.id}" sets both svgId and spriteId; pick one`,
      );
    }
    if (svgId && !isKnownPart(svgId)) {
      throw new Error(
        `[cake-maker svg] option "${categoryId}/${option.id}" references unknown svgId "${svgId}"`,
      );
    }
  }
}
