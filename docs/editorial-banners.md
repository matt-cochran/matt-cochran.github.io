# Editorial SVG banner style

Approved by Matt October 16, 2026, using the Jevitate Journey banner as the reference. The original is public/assets/blog/jevitate-journey-banner.svg. scripts/banner-style.mjs is the shared executable specification. Keep that original as a reference when changing the generator.

Each canonical article must have its own custom SVG. Reuse the visual style, never another article's artwork. Social feeder posts reuse only the SVG belonging to the article they link to. Confirmed by Matt October 16, 2026.

## Visual rules

Use a 1440 by 320 viewBox, roughly 4.5 to 1. Display the banner with its natural aspect ratio below the title and summary, and repeat the same asset after the article text to frame the reading experience. The closing banner follows the text column and loads lazily. Both instances are decorative. Keep the warm paper background, faint dot texture, navy main structure, muted blue secondary details, and subtle rules. Colors match the site's paper (#f2efe8), deeper paper (#e9e5db), navy (#162536), steel blue (#567a9b), and border (#cfc9be).

Use generous empty space. Main strokes are approximately 2 to 3 units; secondary strokes are 1 to 2 units with reduced opacity. Checkpoints are small outlined circles. Patterns suggest the article's subject without presenting a factual diagram. No people, text, numbers, logos, fake interfaces, animation, scripts, external references, or embedded raster images. Keep content readable without the artwork.

## Choose a motif from the reader problem

| Motif | Fits |
| --- | --- |
| branches | Journeys, exploration, testing paths and alternatives |
| grid | Planning, dependencies, matrices, and structured decisions |
| handoffs | Delegation, bounded tasks, and coordination |
| layers | Configuration, secret delivery, and operational boundaries |

Use the same palette and density across motifs. The article slug supplies deterministic positional variation, so a rerun produces the same artwork and a new article gets a distinct arrangement. Review the result for relevance instead of selecting a motif solely from a product name.

## Generate with the article

Create a new draft and its SVG together:

```sh
npm run article:new -- article-slug --title "A concrete reader problem" --description "What the reader will learn." --motif branches
```

For an existing article without a header:

```sh
npm run article:banner -- article-slug --motif grid
```

Both commands are local and need no model, API key, or provider credits. New articles are drafts. Existing publication status is preserved. Existing banners are never overwritten, and the attach command refuses to replace a header already selected for an article. The commands prepare files; they do not write the article's claims, approve copy, or publish it.

Treat each banner as decorative: heroDecorative: true, empty heroAlt, and actual width and height. SVG artwork stays out of social-image metadata, which retains the site's raster sharing image. Screenshots and explanatory diagrams belong in the article body when they supply evidence or explain a mechanism.

Before review, inspect the banner at desktop and mobile widths, confirm the draft's source and style checks, and build the site. Do not regenerate assets during a build: the reviewed SVG belongs in the repository. If the shared style changes, increment its version and review existing artwork deliberately rather than silently replacing it.
