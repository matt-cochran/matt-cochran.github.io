# Shared Layouts

## BaseLayout

- Path: `src/layouts/BaseLayout.astro`
- Description: Site document shell; loads Lato, global styles, sticky navigation, page slot, and footer.

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props { title: string; description?: string; }
const { title, description = 'Matthew Cochran: Scale Readiness Validation for Series A SaaS.' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&display=swap" rel="stylesheet" />
    <title>{title}</title>
  </head>
  <body class="min-h-screen bg-[var(--color-surface)] font-sans text-[var(--color-text)] antialiased" style="font-family: 'Lato', sans-serif;">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <Nav />
    <main id="main-content" tabindex="-1"><slot /></main>
    <Footer />
  </body>
</html>
```

## Nav

- Path: `src/components/Nav.astro`
- Description: Sticky global navigation with Matthew Cochran wordmark and five links.

```astro
---
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/scale-readiness/', label: 'Scale Readiness' },
  { href: '/snapshot/', label: 'Take the Snapshot' },
  { href: '/about/', label: 'About' },
  { href: '/blog/', label: 'Blog' },
];
---
<nav class="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/98" aria-label="Main">
  <div class="mx-auto flex max-w-[min(1440px,92vw)] flex-wrap items-center justify-between gap-4 px-7 py-3.5">
    <a href="/" class="text-lg font-bold tracking-wide no-underline group">
      <span class="text-[var(--color-text-headline)] group-hover:text-[var(--color-text-inverse)]">Matthew </span>
      <span class="text-[var(--color-primary)] group-hover:text-[var(--color-primary-hover)]">Cochran</span>
    </a>
    <ul class="flex flex-wrap items-center gap-6 list-none p-0 m-0">
      {navLinks.map(({ href, label }) => (<li><a href={href} class="text-[0.9375rem] text-[var(--color-text-emphasis)] no-underline py-1 border-b-2 border-transparent transition-colors hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]">{label}</a></li>))}
    </ul>
  </div>
</nav>
```

## Footer

- Path: `src/components/Footer.astro`
- Description: Four-column contact footer with personal wordmark and LinkedIn link.

```astro
---
const currentYear = new Date().getFullYear();
---
<footer class="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
  <div class="mx-auto max-w-[min(1440px,92vw)] px-7 py-10">
    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div><h4 class="mb-2 text-sm font-semibold text-[var(--color-text-emphasis)]">Location</h4><address class="text-sm text-[var(--color-text)] not-italic">99 Wall Street, #2794<br />New York, NY 10005</address></div>
      <div><h4 class="mb-2 text-sm font-semibold text-[var(--color-text-emphasis)]">Phone</h4><p class="text-sm text-[var(--color-text)]">(w) 1-800-394-2500<br />(m) 1-212-470-0237</p></div>
      <div><h4 class="mb-2 text-sm font-semibold text-[var(--color-text-emphasis)]">Web</h4><p class="text-sm"><a href="https://outboundlabs.com/" class="text-[var(--color-primary)]">outboundlabs.com</a><br /><a href="https://cochranweb.com/" class="text-[var(--color-primary)]">cochranweb.com</a></p></div>
      <div><h4 class="mb-2 text-sm font-semibold text-[var(--color-text-emphasis)]">Email</h4><p class="text-sm"><a href="mailto:matthew@cochranweb.com" class="text-[var(--color-primary)]">matthew at cochranweb.com</a></p></div>
    </div>
    <hr class="my-8 border-[var(--color-border)]" />
    <div class="flex flex-wrap items-center justify-between gap-4"><p class="text-lg font-light text-[var(--color-text)]"><span class="font-bold text-[var(--color-text-headline)]">Matthew </span><span class="font-bold text-[var(--color-primary)]">Cochran</span></p><a href="https://www.linkedin.com/in/matthew-cochran-1a02b119/" class="inline-flex h-10 w-10 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-muted)]" aria-label="LinkedIn">in</a></div>
  </div>
</footer>
```

