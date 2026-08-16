import type { NextConfig } from "next";

/**
 * Base path handling.
 *
 * On GitHub Pages the site is served from https://<user>.github.io/<repo>, so
 * every asset and route needs a `/<repo>` prefix. On a custom domain — or after
 * migrating to Cloudflare Pages / Vercel — that prefix must be absent.
 *
 * Rather than hardcoding either case, the prefix comes from an env var that
 * defaults to empty. The GitHub Actions workflow sets it; local dev and any
 * future host leave it unset. Migration is a one-line CI change, not a refactor.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Emit a fully static site to `out/`. No server, no API routes, no ISR.
  output: "export",

  // GitHub Pages resolves /gallery/ to /gallery/index.html. Without this,
  // every non-root route 404s.
  trailingSlash: true,

  basePath,
  assetPrefix: basePath,

  images: {
    // The Image Optimization API needs a server. Images are instead
    // pre-optimized at build time by scripts/optimize-images.ts.
    unoptimized: true,
  },
};

export default nextConfig;
