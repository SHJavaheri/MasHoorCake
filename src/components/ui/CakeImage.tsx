"use client";

import { useState } from "react";

import imageManifest from "@/content/generated/images.json";
import { asset } from "@/lib/images/assetPath";
import { cn } from "@/lib/utils/cn";

type ImageEntry = {
  src: string;
  width: number;
  height: number;
  lqip: string;
  avif: Record<string, string>;
  webp: Record<string, string>;
  fallback: string;
};

const manifest = imageManifest as unknown as Record<string, ImageEntry>;

/**
 * Renders a pre-optimised photograph.
 *
 * This is the one component that knows how images are served, which is exactly
 * why it exists: migrating to a host with a runtime image optimiser means
 * swapping this file for `next/image` and touching nothing else.
 *
 * Emits a real `<picture>` with AVIF, WebP, and JPEG sources plus a proper
 * `srcset`/`sizes` pair, so the browser downloads the smallest adequate file.
 * The LQIP is painted as a background beneath the image and cross-faded out on
 * load, so there is never an empty box and never a layout shift.
 */
export function CakeImage({
  name,
  alt,
  sizes = "100vw",
  priority = false,
  className,
  imgClassName,
}: {
  /** Manifest key: the source filename without its extension. */
  name: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const entry = manifest[name];

  if (!entry) {
    // Fails loudly in development, quietly in production: a missing photo
    // should never take a customer-facing page down.
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        `CakeImage: "${name}" is not in the image manifest. Run \`npm run images\`.`,
      );
    }
    return null;
  }

  const widths = Object.keys(entry.avif)
    .map(Number)
    .sort((a, b) => a - b);

  // Plain <img>/srcSet paths are invisible to Next, so basePath must be
  // applied by hand or every photo 404s on GitHub Pages.
  const srcSet = (map: Record<string, string>) =>
    widths.map((w) => `${asset(map[String(w)])} ${w}w`).join(", ");

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      // Reserving the intrinsic ratio is what keeps CLS at zero.
      style={{ aspectRatio: `${entry.width} / ${entry.height}` }}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 scale-105 bg-cover bg-center blur-xl transition-opacity duration-[var(--duration-slow)]",
          loaded ? "opacity-0" : "opacity-100",
        )}
        style={{ backgroundImage: `url("${entry.lqip}")` }}
      />

      <picture>
        <source type="image/avif" srcSet={srcSet(entry.avif)} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(entry.webp)} sizes={sizes} />
        <img
          src={asset(entry.fallback)}
          alt={alt}
          width={entry.width}
          height={entry.height}
          // The hero image must not be lazy: it is the LCP element.
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-[var(--duration-base)]",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      </picture>
    </div>
  );
}
