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

## Ordering

**`src/config/order.ts`** —

1. `formUrl`: paste the live Google Form link. Until this is a real URL, the
   order page shows an honest disabled state rather than a button that leads
   nowhere.
2. `entries`: the pre-fill field IDs. To get them, open the form → ⋮ menu →
   **Get pre-filled link** → fill in dummy values → **Get link**. The resulting
   URL contains `entry.XXXXXXX=` pairs. Map each one to the matching field.

   This is what lets "Order something like this" carry a customer's chosen cake,
   flavour, and size into the form so they don't retype it.
3. `checklist`: the "what to have ready" list.

Also worth doing: set the form's confirmation message to link to
`/en/thanks/`, so the order finishes on your own page rather than Google's.

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
