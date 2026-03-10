# Formatting Audit — All Pages

**Date:** 2026-02-27  
**Scope:** index.html, scale-readiness.html, snapshot.html, about.html (resume.html not changed)

---

## Browser check note

The browser tool could not load the local site (localhost not reachable from the automation environment). Formatting was checked via HTML/CSS structure review and the following fixes were applied.

---

## index.html — Fixes applied

| Issue | Fix |
|-------|-----|
| **Indentation** | "Who this is for" first `<p>` was at column 0; aligned to match section body (2 spaces). |
| **Invalid HTML** | Footer had nested `<a>` (outer `href="#"` wrapping inner links). Replaced with separate `<h4>` + `<p><a href="...">` for Web and Email; added `mailto:` for email links. |
| **Stray `<br>`** | Removed `<br>` inside LinkedIn `<li>` in hero for cleaner structure. |
| **Heading spacing** | " Contact " → "Contact" (no leading/trailing spaces). |
| **Section structure** | Proof section: removed incorrect comment "<!-- /o-grid__col -->", fixed comment "<!-- /o-grid -->", added missing closing `</div>` for `o-container` and correct comments for `o-section__content`, `o-section__container`, `o-container`. |
| **Section indent** | PROOF section comment/section aligned with other sections (4 spaces under main container). |
| **rel="noopener"** | Added to LinkedIn and footer external links. |

---

## scale-readiness.html — Status

- **Structure:** Consistent. Single content section + minimal footer.
- **Nav:** Same as other pages (flex, same links).
- **Head:** Same assets; paths relative (`assets/...`). No duplicate or missing links.
- **Formatting:** No invalid nesting; indentation consistent (2 spaces).

---

## snapshot.html — Status

- **Structure:** Same pattern as scale-readiness (section + footer).
- **Head:** Same as scale-readiness/about.
- **Formatting:** No issues. Snapshot CTA uses inline styles consistent with other pages.

---

## about.html — Status

- **Structure:** One content section + footer; primary CTA (Snapshot button) + secondary "← Home" link.
- **Footer:** Single line (email, LinkedIn, address).
- **Formatting:** No invalid HTML; indentation consistent.

---

## Cross-page consistency

| Element | index | scale-readiness | snapshot | about |
|---------|-------|-----------------|----------|-------|
| Nav | ✓ Same links, flex | ✓ | ✓ | ✓ |
| Main container | `c-main-container` | ✓ | ✓ | ✓ |
| Preloader | ✓ | ✓ | ✓ | ✓ |
| Section pattern | `o-section` > `o-container` > `o-section__container` | ✓ | ✓ | ✓ |
| Footer | Full contact grid + LinkedIn | Email + LinkedIn | Email + LinkedIn | Email + LinkedIn + address |
| Asset paths | `assets/...` | ✓ | ✓ | ✓ |

---

## Recommendations

1. **Test locally:** Run `npx serve` (or similar) and open `index.html`, `scale-readiness.html`, `snapshot.html`, `about.html` in a browser to confirm layout, theme, and responsive behavior.
2. **resume.html:** Not audited; still uses old layout. If it’s linked from About, consider giving it the same nav for consistency or leave as standalone resume view.
3. **Inline styles:** Nav and CTAs use inline `style=""` for flex/gap/padding. For easier maintenance, consider moving these to `assets/css/custom.css` and reusing classes.

---

*Re-run audit after major layout or structure changes.*

---

# Readability Audit — Astro Pages (Web Readability)

**Date:** 2026-03-10  
**Scope:** All Astro pages and blog content. Formatting only; no content added, removed, or reworded.  
**Principles:** Chunking long paragraphs (~4–5 lines), whitespace between sections, subheadings/visual anchors, scannability.

---

## Readability Audit Checklist

| Page | Issues Found | Changes Made |
|------|-------------|--------------|
| **index.astro** (Home) | Long “Who this is for” paragraph; six “Scale readiness in practice” cards each had one dense paragraph (Context/Scale risk/Intervention/Result in a single block). | Split “Best fit” into two short paragraphs. Split each practice card into four short paragraphs (Context, Scale risk, Intervention, Result) with `mt-1` between. |
| **about.astro** | Second paragraph was three long sentences in one block (~5+ lines). | Split into three paragraphs: focus sentence; previous roles; impact sentence. |
| **resume.astro** | Intro: first paragraph had four sentences in one block. Experience: one long two-sentence paragraph. Recent Projects: several cards had single long paragraphs (4–6 lines). | Intro: split into two paragraphs (intro + challenges). Experience: split into two paragraphs (timeline list; note about repo). Recent Projects: chunked “Establish product management practice”, “Move Operations to the Cloud”, and “Establish project management practice” into 2–3 short paragraphs at sentence boundaries. |
| **scale-readiness.astro** | “Who it’s for” was one long two-sentence paragraph. | Split into two paragraphs (audience; “if that’s not you” sentence). |
| **snapshot.astro** | First “What happens next” list item was two long sentences in one block. | Kept single list item; added block-level span for second sentence and `space-y-3` on list for clearer separation. |
| **blog/index.astro** | None (list of posts; no dense prose). | No changes needed. |
| **blog/[slug].astro** | N/A (template; content from MD). | No changes needed. |
| **scale-readiness-overview.md** | Paragraphs already short (2–3 lines); clear ## subheadings. | No changes needed. |

---

## Verification

- [x] Every page in the input has a corresponding checklist row.
- [x] No content has been added, removed, or meaningfully reworded.
- [x] Every change maps to a specific readability principle (chunking, whitespace, scannability).
- [x] Pages with no issues are explicitly marked “No changes needed.”
- [x] No page content was missing or ambiguous; none flagged.

---

## Follow-up: Evidence-based readability (About + Section)

**Date:** 2026-03-10 (second pass)

The initial audit only split paragraphs; the About page still read as one dense block. A second pass applied **evidence-based UX/readability practices**:

| Principle | Source / practice | Change |
|-----------|--------------------|--------|
| **Line length** | 50–75 characters per line (Baymard, Visible Language); ~66 CPL ideal | About page content wrapped in `max-w-[65ch]` so line length stays in range. |
| **Paragraph spacing** | Increased margin between blocks improves comprehension | Section prose: `[&_p]:mb-5` (1.25rem between paragraphs). |
| **Line height** | 1.5–1.7 supports readability (W3C, readability studies) | Section prose: `leading-relaxed` (~1.625). |
| **Subheadings** | NN Group: subheadings improve scannability and recall | About: added **Background** and **Impact** so the block has clear visual anchors. |
| **Whitespace before CTAs** | Grouping actions with extra space reduces cognitive load | About: `mt-6` before the “Full resume” / Snapshot / Home block. |

**Files changed:** `Section.astro` (prose spacing + line-height + h3 spacing), `about.astro` (subheadings, 65ch wrapper, CTA spacing). No new body content added.

---

## Site-wide readability pass (all Astro pages)

**Date:** 2026-03-10  
**Principle:** Apply evidence-based readability (65ch line length, paragraph/list spacing, subheadings, CTA spacing) section by section on every page.

### Per-page checklist (inspect section by section)

| Page | Section | What was done |
|------|--------|----------------|
| **index.astro** | Hero | Left as-is (already has `max-w-xl` + `leading-relaxed` on tagline). |
| | Who this is for | Wrapped in `max-w-[65ch]`; added `mt-6` before CTA sentence. |
| | You may not be scale-ready if… | Wrapped in `max-w-[65ch]`. |
| | Scale Readiness Diagnostic (offer) | Wrapped in `max-w-[65ch]`; `mt-6` before “Engagements typically…”. |
| | Scale readiness in practice | No 65ch (grid layout); cards already chunked. |
| | How it works | Wrapped in `max-w-[65ch]`; `mt-6` before CTA link. |
| | Background | Wrapped in `max-w-[65ch]`. |
| **about.astro** | About Matthew Cochran | Already had 65ch, subheadings (Background, Impact), CTA spacing. |
| **resume.astro** | Hero | No change (contact grid). |
| | Intro | Wrapped in `max-w-[65ch]`; added h3 “What I offer” before bullet list; `mt-6` before sign-off. |
| | Expertise | No 65ch (grid). |
| | Advisory Board Seats | No 65ch (grid). |
| | Recent Projects | No 65ch (grid). |
| | Experience | Wrapped in `max-w-[65ch]`; `mt-6` before “About · Home” links. |
| **scale-readiness.astro** | Scale Readiness | Full section wrapped in `max-w-[65ch]`; existing h2/h3 kept. |
| **snapshot.astro** | Scale Readiness Snapshot | Full section wrapped in `max-w-[65ch]`; existing h2s kept. |
| **blog/index.astro** | Blog | List wrapped in `max-w-[65ch]` for line length. |
| **blog/[slug].astro** | Article body | Prose: `max-w-[65ch]`, `leading-relaxed`, `[&_p]:mb-5`, `[&_ul]:mb-5` / `[&_ol]:mb-5`, h2/h3 spacing. |
| **Section.astro** | (global) | Added `[&_h2]:mt-8 [&_h2]:mb-2`, `[&_ul]:mb-5 [&_ol]:mb-5` for all Section content. |

**Summary:** Every prose-heavy section now has a 65ch cap where layout allows; grids (index practice cards, resume Expertise/Advisory/Projects) are unchanged. Section component gives consistent paragraph and list margins site-wide; blog post template matches.
