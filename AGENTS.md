# Mashoor Cake — project notes

A marketing and inquiry site for a small home bakery that makes **custom cakes only**
(no cupcakes, no pastries, no other baked goods). There is no storefront.

The site does three things:

1. Showcases past work (`/gallery`, `/cakes`, `/about`).
2. Lets a customer configure a cake visually (`/design` — the **Cake Maker**).
3. Produces a **Cake Request Summary** they download, print, or send to the baker
   over WhatsApp or email.

**This is not ecommerce.** No orders, no checkout, no payment, and no confirmed
price — only clearly-labelled estimates. The Cake Maker's job is to let the
customer say exactly what they want _before_ talking to the baker; she confirms
everything, including the price, personally. Any change that makes the site feel
like it takes orders is wrong.

The full development plan lives at
`C:\Users\Hamid\.claude\plans\i-want-to-build-enchanted-mango.md`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion (Framer Motion)
· Radix UI primitives · next-themes · Zod

## Hard constraints

- **Static export only.** `output: "export"`. No API routes, no server actions, no
  middleware, no ISR, no database, no auth. Deployed to GitHub Pages.
- **Never hardcode a host or path prefix.** `basePath` comes from
  `NEXT_PUBLIC_BASE_PATH` and defaults to empty; CI sets it. Plain `<a>` tags are not
  rewritten by Next, so prefix those manually.
- **Bilingual EN + FA with real RTL.** Use Tailwind _logical_ properties everywhere
  (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`) — never `pl-`, `pr-`, `left-`,
  `right-`. Retrofitting RTL is far more expensive than building with it.
- **No hardcoded copy in components.** All strings come from `src/locales/*`; all cake
  data from `src/content/`.
- **Semantic colour tokens only.** Use `bg-surface`, `text-muted`, `border-border`.
  Never reference the raw palette (`--mint-700`) outside `globals.css`.
  _One exception:_ icing, sponge and decoration colours in
  `src/content/cake-maker/**` and the cake SVG are literal hex. A strawberry is
  red in both themes — the cake is an illustration of an object, not a UI
  surface. It is also load-bearing: a serialised SVG carries no stylesheet, so a
  `var()` fill rasterises black in the generated PDF.
- **The brand pastels are surfaces, not ink.** `--mint-300` (#9BD3C7) and
  `--blush-200` (#F3D3D8) are 1.06:1 and 1.15:1 against the page — they may only
  ever be a fill _behind_ `--text`. Anything carrying text, an icon, or a
  hairline border uses the 600/700 steps, which are AA.
- **One animation language.** Durations and easings come from the tokens in
  `globals.css` / `src/lib/motion`. Animate only `transform` and `opacity`.
  _One exception:_ `.cake-fill-transition` animates SVG `fill` in the Cake
  Maker, because the live preview has to show frosting changing colour. It
  repaints without reflowing and the global reduced-motion block already
  flattens it.
- `prefers-reduced-motion` is handled globally — do not re-implement it per component.

## Conventions

- Server Components by default; add `"use client"` only where interaction requires it.
- Persian copy in `src/locales/fa/` is **machine-drafted placeholder** pending review by
  the baker. The file carries a `_TRANSLATION_STATUS` marker; do not remove it until
  reviewed translations land.
- Anything awaiting real business content is marked `TODO(content)`.

## The Cake Maker

Adding a flavour, filling, frosting, topping or decoration is meant to be **one
edit to one data file, with no component changes**. If you find yourself editing
a component to add an option, something has gone wrong.

- Options live in `src/content/cake-maker/options/*.ts`; the catalog is
  assembled and Zod-validated at module load in `src/content/cake-maker/index.ts`,
  so a typo or a dangling reference fails `next build`.
- `visual.svgId` points at artwork in
  `src/components/cake-maker/svg/parts/registry.ts`. New art is one entry in
  `decor.tsx` plus one line there — or set `visual.spriteId` instead and drop a
  PNG in `public/images/cake-maker/sprites/`, which needs no code at all.
- **Money lives in exactly two places:** the global levers in
  `src/content/cake-maker/pricing.ts`, and `priceDelta` / `pricePerServing` /
  `priceMultiplier` on individual options. Nothing else in the repo holds a
  currency amount. Every number shown is an estimate, and `EstimateBadge` is the
  only component that renders one — it hardcodes the disclaimer so there is no
  code path that shows a bare price.
- Cross-field rules (frosting colour needs a tintable frosting, writing needs a
  plaque, heart is single-tier) are declared as `requires` in the data and
  enforced in one place: `normalise()` in `src/lib/cake-maker/state.ts`.
- Cake Maker copy is authored **English-first** via `localizedTextSchema` in
  `src/content/l10n.ts`, read through `text()`. When Persian lands: drop
  `.optional()` from `fa` and drop the `?? value.en` fallback, and TypeScript
  will enumerate everything still untranslated.
- `CakeSvg` is a pure function of the design — no hooks, no context, no DOM
  measurement — so the same component serves the preview, the print sheet and
  the PDF. Its `idPrefix` prop is **required**: all three mount at once, and
  duplicate SVG ids silently break `clipPath` references in every browser.
- The reference photo is never uploaded, cannot travel in a link, and is
  embedded only in the PDF. Say so in the UI rather than leaving it implied.

## Commands

```
npm run dev          # local development
npm run build        # static export to out/
npm run preview      # build, then serve out/ — catches Pages-only breakage
npm run lint
npm run typecheck
npm run format
```

Always verify via `npm run preview` rather than `npm run dev` before calling a change
done: `next dev` hides static-export and basePath failures.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
