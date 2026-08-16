/**
 * Build-time image optimisation.
 *
 * A static export cannot use the Next Image Optimization API, so this does the
 * same job ahead of time: for every source photo it emits AVIF and WebP at a
 * range of widths, plus a tiny inlined placeholder.
 *
 * Doing it at build time is arguably better than at request time. There is no
 * cold-start penalty, every byte is CDN-cacheable forever, and the output is
 * identical on every host, which is what keeps the migration path open.
 *
 * Output: public/images/cakes/optimized/<name>-<width>.<fmt>
 *         src/content/generated/images.json  (the manifest CakeImage reads)
 *
 * Run: npm run images
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const SOURCE_DIR = path.join(process.cwd(), "public", "images", "cakes");
const OUT_DIR = path.join(SOURCE_DIR, "optimized");
const MANIFEST = path.join(process.cwd(), "src", "content", "generated", "images.json");

/**
 * Widths chosen to cover a 1-to-4 column masonry grid at 1x and 2x. More widths
 * would mean more build time and cache fragmentation for no visible gain.
 */
const WIDTHS = [400, 800, 1200, 1600, 2400];

/** AVIF at ~60 is visually lossless for photography and roughly half of WebP. */
const AVIF_QUALITY = 60;
const WEBP_QUALITY = 72;

export type ImageEntry = {
  src: string;
  width: number;
  height: number;
  lqip: string;
  avif: Record<number, string>;
  webp: Record<number, string>;
  fallback: string;
};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const files = (await readdir(SOURCE_DIR, { withFileTypes: true }))
    .filter((f) => f.isFile() && /\.(jpe?g|png)$/i.test(f.name))
    .map((f) => f.name)
    .sort();

  const manifest: Record<string, ImageEntry> = {};

  for (const file of files) {
    const name = path.parse(file).name;
    const source = path.join(SOURCE_DIR, file);
    const image = sharp(source);
    const meta = await image.metadata();

    if (!meta.width || !meta.height) {
      console.warn(`Skipping ${file}: could not read dimensions`);
      continue;
    }

    // Never upscale: a 2400px variant of a 1200px source is wasted bytes.
    const widths = WIDTHS.filter((w) => w <= meta.width!);
    if (widths.length === 0) widths.push(meta.width);

    const avif: Record<number, string> = {};
    const webp: Record<number, string> = {};

    for (const width of widths) {
      const resized = sharp(source).resize({ width, withoutEnlargement: true });

      await resized
        .clone()
        .avif({ quality: AVIF_QUALITY })
        .toFile(path.join(OUT_DIR, `${name}-${width}.avif`));
      await resized
        .clone()
        .webp({ quality: WEBP_QUALITY })
        .toFile(path.join(OUT_DIR, `${name}-${width}.webp`));

      avif[width] = `/images/cakes/optimized/${name}-${width}.avif`;
      webp[width] = `/images/cakes/optimized/${name}-${width}.webp`;
    }

    // JPEG fallback at a middle width, for browsers without AVIF or WebP.
    const fallbackWidth = widths.includes(1200) ? 1200 : widths[widths.length - 1];
    await sharp(source)
      .resize({ width: fallbackWidth, withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(path.join(OUT_DIR, `${name}-${fallbackWidth}.jpg`));

    /**
     * A ~20px blur, inlined as a data URI. Small enough to sit in the HTML
     * without bloating it, and it means the grid is composed and colour-correct
     * on first paint rather than a field of empty rectangles.
     */
    const lqipBuffer = await sharp(source)
      .resize({ width: 20 })
      .blur(1.4)
      .webp({ quality: 32 })
      .toBuffer();

    manifest[name] = {
      src: `/images/cakes/${file}`,
      width: meta.width,
      height: meta.height,
      lqip: `data:image/webp;base64,${lqipBuffer.toString("base64")}`,
      avif,
      webp,
      fallback: `/images/cakes/optimized/${name}-${fallbackWidth}.jpg`,
    };

    console.log(`  ${file} -> ${widths.length} widths`);
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`\nOptimised ${Object.keys(manifest).length} images.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
