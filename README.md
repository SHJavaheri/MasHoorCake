# Mashoor Cake

Marketing and inquiry website for a small home bakery specialising in custom cakes.

Built as a **fully static site** — no server, no database, no accounts. Orders are
submitted through a Google Form and finalised directly with the baker.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

The root URL redirects to a locale. Pages live at `/en/…` and `/fa/…`.

## Scripts

| Command             | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Local development server                  |
| `npm run build`     | Static export to `out/`                   |
| `npm run preview`   | Build, then serve `out/` locally          |
| `npm run lint`      | ESLint, including `jsx-a11y` strict rules |
| `npm run typecheck` | TypeScript, no emit                       |
| `npm run format`    | Prettier, with Tailwind class sorting     |

> **Verify with `npm run preview`, not `npm run dev`.** The dev server runs a real
> Next.js server and will happily render things that a static export cannot produce.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the export and
publishes it to GitHub Pages.

One-time repository setup: **Settings → Pages → Build and deployment → Source →
GitHub Actions**.

### Moving to a custom domain or another host

The codebase is deliberately host-agnostic. To migrate:

1. Delete the `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` lines from the deploy
   workflow (or point them at the new origin).
2. For a custom domain on GitHub Pages, add a `public/CNAME` file containing the domain.
3. For Cloudflare Pages / Vercel, additionally remove `output: "export"` from
   `next.config.ts` and swap the image wrapper to `next/image` to regain runtime image
   optimisation.

Nothing else in the codebase is aware of where it is hosted.

Live at **https://hamidjavaheri.com/MasHoorCake/** — the repository owner's user site
carries a custom domain, so project pages are served from it rather than from
`github.io`.

## Changing content

See **[CONTENT-GUIDE.md](CONTENT-GUIDE.md)**. Business details, copy, the menu, and
the cake portfolio are all text edits; adding photographs additionally needs
`npm run images`.

## Project status

Built and deployed: design system in two themes, bilingual EN/FA with RTL, the
gallery with filters and detail modal, all six pages, the motion vocabulary, and the
Easter eggs.

**Everything customer-facing is still placeholder.** Branding, photography, copy,
pricing, contact details, the Google Form link, and the Persian translations are all
marked `TODO(content)` — search the project for that string to find them.
