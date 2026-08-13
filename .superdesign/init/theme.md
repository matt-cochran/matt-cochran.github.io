# Theme

## Compact token summary

- Framework: Tailwind CSS 4 via `@tailwindcss/vite`; tokens declared with `@theme`.
- Font: Lato, weights 300/400/700/900. Current body base is approximately 16px; headline sizes range 30–40px.
- Primary: steel blue `#6b8cae`; hover `#8fa3b8`; dark `#4a6582`.
- Surfaces: `#2d2e2e`, alternate `#282929`, muted `#2b2c2c`.
- Border: `#404242`.
- Text: body `#b0b1b3`, emphasis `#c8c9cb`, headline `#e2e3e5`, inverse `#f8f9fa`, muted `#8e8f91`.
- Validation/error: `#c17a6b`; muted `#8a5a50`.
- Radius: mostly Tailwind `rounded` (4px) and hero portrait `rounded-2xl` (16px).
- Layout: max width `min(1440px, 92vw)`; page gutters 24–56px; section vertical spacing 40–48px.
- Breakpoints: Tailwind defaults (`sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px).
- Motion: short color transitions; effectively disabled when `prefers-reduced-motion` is set.
- Accessibility: visible 2px primary focus outline, skip link, 44px minimum snapshot targets.

## Raw source: `src/styles/global.css`

```css
@import 'tailwindcss';
@theme {
  --color-primary: #6b8cae;
  --color-primary-hover: #8fa3b8;
  --color-primary-dark: #4a6582;
  --color-surface: #2d2e2e;
  --color-surface-alt: #282929;
  --color-surface-muted: #2b2c2c;
  --color-border: #404242;
  --color-text: #b0b1b3;
  --color-text-emphasis: #c8c9cb;
  --color-text-headline: #e2e3e5;
  --color-text-inverse: #f8f9fa;
  --color-muted: #8e8f91;
  --color-text-bright: var(--color-text-emphasis);
  --color-error: #c17a6b;
  --color-error-muted: #8a5a50;
}
.snapshot-form .snapshot-option-label { min-height: 44px; }
.snapshot-form .snapshot-fieldset[aria-invalid="true"] { padding-left: .75rem; border-left: 3px solid var(--color-error); }
.snapshot-form .snapshot-field-error.hidden { display: none; }
.snapshot-form .snapshot-step { position: absolute; left: 0; right: 0; top: 0; visibility: hidden; }
.snapshot-form .snapshot-step[data-visible] { position: relative; visibility: visible; }
a:focus-visible, button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
a:focus:not(:focus-visible), button:focus:not(:focus-visible) { outline: none; }
.skip-link { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
.skip-link:focus { position:absolute; width:auto; height:auto; padding:.5rem 1rem; margin:0; left:1rem; top:1rem; z-index:101; background:var(--color-primary); color:var(--color-surface); border-radius:.25rem; clip:auto; overflow:visible; outline:2px solid var(--color-text-inverse); outline-offset:2px; }
@media (prefers-reduced-motion: reduce) { a, button, * { transition-duration: .01ms !important; } }
```

## Raw source: `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: 'https://matt-cochran.github.io', base: '/', trailingSlash: 'always', vite: { plugins: [tailwindcss()] }, output: 'static', build: { format: 'directory' } });
```

