# Routes

Astro file-based routing; every route uses `src/layouts/BaseLayout.astro`.

| URL | Entry | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | Current consulting-led homepage: Scale Readiness offer, proof, process, bio. |
| `/about/` | `src/pages/about.astro` | Personal bio and career credibility. |
| `/resume/` | `src/pages/resume.astro` | Full résumé and experience timeline. |
| `/scale-readiness/` | `src/pages/scale-readiness.astro` | Startup diagnostic offer details. |
| `/snapshot/` | `src/pages/snapshot.astro` | Interactive qualification questionnaire and booking outcome. |
| `/blog/` | `src/pages/blog/index.astro` | Blog index. |
| `/blog/[slug]/` | `src/pages/blog/[slug].astro` | Individual Markdown blog post. |

There is no explicit router configuration. `astro.config.mjs` uses static directory output and trailing slashes.

