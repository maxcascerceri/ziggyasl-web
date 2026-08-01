# Ziggy ASL — Marketing Site

Single-page marketing landing page for [ziggyasl.com](https://ziggyasl.com). Light theme, brand-matched to the iOS app, built with Next.js + Tailwind + Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Edits hot-reload.

> Note: Node was installed to `~/.local/node22`. If `npm` isn't found, run
> `export PATH="$HOME/.local/node22/bin:$PATH"` first (or add it to `~/.zshrc`).

## Where to edit things

| What | File |
|---|---|
| All marketing copy (headlines, benefits, buttons) | `src/lib/copy.ts` |
| All URLs (App Store, privacy, terms, contact) | `src/lib/links.ts` |
| Privacy / Terms copy | `src/lib/legal.ts` → `/privacy` and `/terms` |
| Brand colors, shadows, tokens | `src/app/globals.css` |
| Page section order | `src/app/page.tsx` |
| Individual sections | `src/components/*.tsx` |

## Screenshots

Drop your app UI screenshots into `public/screenshots/` with these names:

- `home.png` — hero phone (learning path / home)
- `lesson.png` — a lesson with sign video
- `path.png` — the learning path
- `celebration.png` — streak / celebration moment

Until a file exists, its phone frame shows a friendly placeholder. Use tall
portrait screenshots (iPhone aspect ratio, ~9:19.5); they're cropped to fill.

## App Store link

The CTA buttons point at `links.appStore` in `src/lib/links.ts` — currently a
`#download` placeholder. Swap in the real App Store URL when the app is live.

## Deploy (later)

When the local version is approved: push to GitHub, import into Vercel
(or Netlify / Cloudflare Pages), then point `ziggyasl.com` DNS at the host
from GoDaddy.
