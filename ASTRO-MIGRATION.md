# Astro + Tailwind 4 migration

This site is now built with [Astro](https://astro.build) and [Tailwind CSS 4](https://tailwindcss.com). Static HTML is generated at build time; URLs match the previous site where possible.

## Commands

- **Develop:** `npm run dev` — dev server (default `http://localhost:4321`)
- **Build:** `npm run build` — copies `assets/` to `public/assets/` then builds to `dist/`
- **Preview:** `npm run preview` — serve `dist/` locally

## Structure

- `src/layouts/BaseLayout.astro` — HTML shell, nav, footer, global CSS
- `src/components/` — Nav, Footer, Section
- `src/pages/` — One `.astro` file per route (e.g. `index.astro` → `/`, `about.astro` → `/about/`)
- `src/content/blog/` — Markdown blog posts (frontmatter: `title`, `description`, `pubDate`, optional `updatedDate`)
- `src/styles/global.css` — Tailwind import + `@theme` design tokens (slate/steel blue)
- `public/` — Static files; `npm run build` copies repo root `assets/` to `public/assets/` so `/assets/images/` etc. work

## URLs

| Old (static HTML) | New (Astro)   |
|-------------------|---------------|
| `index.html`      | `/`           |
| `about.html`      | `/about/`     |
| `resume.html`     | `/resume/`    |
| `scale-readiness.html` | `/scale-readiness/` |
| `snapshot.html`   | `/snapshot/`  |
| —                 | `/blog/`      |
| —                 | `/blog/[slug]/` |

For GitHub Pages, deploy the contents of `dist/`. If your site is served at a subpath (e.g. `https://username.github.io/repo/`), set `base` in `astro.config.mjs`.

## Blog

Add a post by creating a file in `src/content/blog/` with frontmatter:

```md
---
title: Your post title
description: Short description (optional)
pubDate: 2025-01-15
---

Your content in **Markdown**.
```

The blog index is at `/blog/`; each post is at `/blog/<filename-without-ext>/`.

## Design tokens (Tailwind 4)

Defined in `src/styles/global.css` under `@theme`:

- `--color-primary` — steel blue `#6B8CAE`
- `--color-primary-hover`, `--color-primary-dark`
- `--color-surface`, `--color-surface-alt`, `--color-border`
- `--color-text`, `--color-text-bright`, `--color-text-inverse`, `--color-muted`

Use in Tailwind with arbitrary values, e.g. `text-[var(--color-primary)]`, or extend Tailwind theme in CSS.

## Legacy files

The original static HTML, CSS, and JS are still in the repo (e.g. `index.html`, `assets/css/`, `assets/js/`). They are not used by the Astro build. You can remove them once you are happy with the new site, or keep them for reference.

## Email assets script

The script in `scripts/` (blue-email-assets.js) is unchanged. Run it from repo root: `cd scripts && npm install && node blue-email-assets.js`. It reads/writes `assets/images/email/` and `assets/images/MC-headshot.png`; run `npm run build` after to copy updated assets into `public/` for the next build.
