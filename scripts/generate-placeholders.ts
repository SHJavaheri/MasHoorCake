/**
 * Generates placeholder cake photography.
 *
 * The gallery cannot be designed against empty boxes: column balance, aspect
 * variety, and the warmth of the palette only become judgeable with images in
 * place. These stand-ins are abstract rather than fake photographs, so nobody
 * mistakes them for real work, but they carry the right tones and proportions.
 *
 * DELETE THIS SCRIPT once real photography lands in public/images/cakes/.
 * Run: npx tsx scripts/generate-placeholders.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const OUT_DIR = path.join(process.cwd(), "public", "images", "cakes");

/** Warm palettes drawn from the site's own tokens, so placeholders sit in-key. */
const PALETTES = [
  { bg: "#f3ece0", cake: "#e8ddcb", accent: "#d18e21", crumb: "#b9a488" },
  { bg: "#efe6dc", cake: "#e0d3c0", accent: "#7f9457", crumb: "#a8977d" },
  { bg: "#f5efe6", cake: "#eadfd0", accent: "#a94456", crumb: "#c2ae94" },
  { bg: "#ece4d8", cake: "#dcccb4", accent: "#8a5711", crumb: "#ab9a80" },
  { bg: "#f2ebe1", cake: "#e5d8c4", accent: "#5c6d3c", crumb: "#b5a288" },
];

/** Mixed orientations: masonry only looks composed with varied aspect ratios. */
const SHAPES = [
  { w: 1600, h: 2000 },
  { w: 1600, h: 1600 },
  { w: 1600, h: 1200 },
  { w: 1600, h: 2133 },
];

function svg(width: number, height: number, seed: number) {
  const p = PALETTES[seed % PALETTES.length];
  const cx = width / 2;
  const tiers = (seed % 3) + 1;
  const baseW = width * 0.52;
  const tierH = height * 0.13;
  const bottom = height * 0.78;

  const layers = Array.from({ length: tiers }, (_, i) => {
    const w = baseW * (1 - i * 0.18);
    const y = bottom - (i + 1) * tierH;
    return `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${tierH}" rx="${
      tierH * 0.12
    }" fill="${p.cake}" stroke="${p.crumb}" stroke-width="2"/>`;
  }).join("");

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="${p.crumb}" stop-opacity="0.55"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.32" r="0.6">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>

  <!-- Pointed-arch framing, echoing the site's taq motif -->
  <path d="M ${width * 0.12} ${height * 0.92}
           L ${width * 0.12} ${height * 0.34}
           Q ${cx} ${height * 0.04} ${width * 0.88} ${height * 0.34}
           L ${width * 0.88} ${height * 0.92} Z"
        fill="none" stroke="${p.accent}" stroke-opacity="0.28" stroke-width="3"/>

  ${layers}

  <!-- Cake stand -->
  <ellipse cx="${cx}" cy="${bottom + 6}" rx="${baseW * 0.62}" ry="${height * 0.014}"
           fill="${p.crumb}" opacity="0.5"/>

  <!-- A single Khatam star as the topper -->
  <g transform="translate(${cx} ${bottom - tiers * tierH - height * 0.05})"
     stroke="${p.accent}" stroke-width="3" fill="none" opacity="0.75">
    <rect x="-26" y="-26" width="52" height="52"/>
    <rect x="-26" y="-26" width="52" height="52" transform="rotate(45)"/>
  </g>
</svg>`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const manifest: string[] = [];

  for (let i = 0; i < 18; i++) {
    const shape = SHAPES[i % SHAPES.length];
    const name = `placeholder-${String(i + 1).padStart(2, "0")}.jpg`;
    const file = path.join(OUT_DIR, name);

    await sharp(svg(shape.w, shape.h, i))
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(file);

    manifest.push(name);
  }

  await writeFile(
    path.join(OUT_DIR, "README.md"),
    `# Cake photography\n\nThe \`placeholder-*.jpg\` files here are generated stand-ins, not real work.\nReplace them with real photographs and delete \`scripts/generate-placeholders.ts\`.\n\nGuidance for real photos:\n- At least 2000px on the long edge; originals preferred.\n- Mixed orientations help the masonry grid look composed.\n- Name them descriptively: \`saffron-pistachio-2tier-01.jpg\`.\n`,
    "utf8",
  );

  console.log(`Generated ${manifest.length} placeholder images in ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
