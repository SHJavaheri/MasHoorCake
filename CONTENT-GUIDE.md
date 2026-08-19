# Content guide

How to change what the site says without touching component code. Everything
here is a text edit plus, in one case, a single command.

Anything still awaiting real business information is marked `TODO(content)` in
the source. Searching the project for that string finds every outstanding item.

---

## Business details

**`src/config/site.ts`** — bakery name, tagline, description, service area, and
every contact channel. Changing a phone number or an Instagram handle is one
line here and it updates the header, footer, contact page, and order page at
once.

To hide a channel, set `enabled: false` rather than deleting it. The layout and
ordering logic keys off that flag.

## The Cake Maker

There is no order form and no Google Form any more. A customer designs a cake at
`/design`, and the site produces a **Cake Request Summary** they send you over
WhatsApp, Telegram, or email — or download as a PDF. Nothing is ever ordered or
paid for on the site.

### Prices

**`src/content/cake-maker/pricing.ts`** — **every number in it is a
placeholder.** These are the global levers:

| | |
|---|---|
| `base` | flat, covers the bake and the build regardless of size |
| `perServing` | multiplied by the servings of the chosen size |
| `perExtraTier` | added for each tier above the first |
| `minimum` | never quote below this |
| `roundUpTo` | the estimate is rounded **up** to a multiple of this |

Anything that costs extra on its own — fondant, sugar roses, gold leaf — carries
its own `priceDelta` on the option, in `src/content/cake-maker/options/*.ts`.
Sculpted and other slow work uses `priceMultiplier`, which scales the whole cake.

Between those two places, nothing else in the site contains a price. Every
figure shown is labelled an estimate and paired with the line saying you confirm
the real price yourself — that wording cannot be switched off.

### The menu of options

**`src/content/cake-maker/options/`** — one file per question: `shapes`, `sizes`,
`flavours`, `fillings`, `frostings`, `frostingColours`, `toppings`,
`decorations`, `themes`.

Adding a flavour is one entry in `flavours.ts`:

```ts
{
  id: "black-sesame",
  label: { en: "Black Sesame" },
  description: { en: "Toasted, nutty, faintly smoky." },
  pricePerServing: 0.5,
  allergens: ["sesame"],
  taxonomySlug: "black-sesame",   // links it to the gallery filters
  swatch: "#5a5148",
  visual: { role: "sponge", fill: "#5a5148" },   // the baked crumb colour
  requires: [],
  featured: false,
}
```

`sizes.ts` entries also carry `tiers`, `servings`, and `diameters` (largest
first, in inches) — the drawing and the price both read those, so a new size
needs no other change.

If you get something wrong — a colour that isn't a hex code, a reference to an
option that doesn't exist — the **build fails with a message naming the file and
the option**, rather than the site quietly rendering a broken cake.

### Decorations

A decoration points at a piece of artwork with `visual.svgId`. The available ids
are listed in `src/components/cake-maker/svg/parts/registry.ts`.

To add one with a picture instead of drawn artwork, save a PNG (transparent
background) into `public/images/cake-maker/sprites/` and reference it by
filename — no code at all:

```ts
visual: { role: "decoration", slot: "topSurface", spriteId: "macaron-tower", count: 3 }
```

`slot` is where it sits: `topSurface`, `topEdge`, `band` (the sides), `base`,
`sideScatter`, or `plaque`.

## Words on the page

**`src/locales/en/common.json`** and **`src/locales/fa/common.json`** — all
customer-visible copy, including the process steps, testimonials, FAQ, and the
About story.

> **The Persian file is machine-drafted placeholder.** It carries a
> `_TRANSLATION_STATUS` marker at the top. Every string needs a native-speaker
> pass before launch — marketing Persian does not survive literal translation.
> Delete the marker once reviewed.

Both files must have the same keys. A missing key in Persian is a TypeScript
error, not a silent blank on the page.

## The menu

**`src/content/taxonomy.ts`** — flavours, fillings, occasions, styles, colours,
and allergens. Cakes reference these by slug, so renaming a flavour here renames
it everywhere.

Flavour pairing suggestions live in `src/components/sections/FlavourLibrary.tsx`
under `PAIRINGS`.

## Adding a cake

1. Put the photographs in `public/images/cakes/`.
   - At least 2000px on the long edge. Originals are better than exports.
   - Mixed orientations help the masonry grid look composed.
   - Name them descriptively: `saffron-pistachio-2tier-01.jpg`.

2. Run the image pipeline:

   ```bash
   npm run images
   ```

   This generates AVIF and WebP at five widths plus a tiny inline placeholder,
   and updates `src/content/generated/images.json`. Re-run it whenever photos
   are added or replaced.

3. Copy an existing entry in `src/content/cakes.ts` and edit it. Every field is
   validated at build time — a typo in a flavour slug or a missing Persian
   translation fails the build with a message naming the cake, rather than
   quietly rendering a broken card.

   `slug` is also the URL a dedicated page for this cake would use later, so
   choose something readable.

4. `npm run build` to confirm.

## Replacing the placeholder photography

The `placeholder-*.jpg` files are generated stand-ins, not real work. Once real
photographs are in:

```bash
rm public/images/cakes/placeholder-*.jpg
rm scripts/generate-placeholders.ts
npm run images
```

Then update the `images` array of each entry in `src/content/cakes.ts`.

## Branding

- **Logo** — `src/components/layout/Wordmark.tsx`. Currently a placeholder
  drawn as inline SVG. Replace with the real mark; keeping it inline means it
  inherits theme colours and works with the Easter eggs.
- **Colours** — `src/app/globals.css`, the "RAW PALETTE" block at the top. The
  rest of the site references semantic tokens (`--accent`, `--surface`), so
  changing that one block re-themes everything in both light and dark.
- **Fonts** — `src/lib/fonts.ts`.
