# Mashoor Cake — project notes

A marketing and inquiry site for a small home bakery that makes **custom cakes only**
(no cupcakes, no pastries, no other baked goods). There is no storefront: the site's
job is to showcase past work and funnel visitors into a well-qualified order inquiry
that the baker finalises personally.

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
  Never reference the raw palette (`--saffron-600`) outside `globals.css`.
- **One animation language.** Durations and easings come from the tokens in
  `globals.css` / `src/lib/motion`. Animate only `transform` and `opacity`.
- `prefers-reduced-motion` is handled globally — do not re-implement it per component.

## Conventions

- Server Components by default; add `"use client"` only where interaction requires it.
- Persian copy in `src/locales/fa/` is **machine-drafted placeholder** pending review by
  the baker. The file carries a `_TRANSLATION_STATUS` marker; do not remove it until
  reviewed translations land.
- Anything awaiting real business content is marked `TODO(content)`.

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
