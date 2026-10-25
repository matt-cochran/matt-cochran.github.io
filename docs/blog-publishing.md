# Publishing technical articles

Keep one substantial article per week on cochranweb.com. Each article answers one durable reader problem, with a runnable example, sources, and the tradeoffs needed to use it. Publish narrower social posts after the article is live, each teaching something independently and linking to the canonical article. Revisit older articles when the tools change.

## Drafts and publication

### Approved-only deployment

The deployment workflow also requires `DAILY_PUBLISHING_ENABLED=true` and an exact
approval entry in `publishing-approvals.json` for every due, non-draft Markdown or
MDX article. Each entry binds the complete source file and its own SVG by normalized
SHA256, with the owner's exact-copy/artwork approval reference. Changing either file
invalidates that approval. A missing `draft` follows Astro's `false` default and is
still subject to approval. Future articles and explicit drafts remain excluded.

Enabling the workflow or activation variable is operational permission only. It
does not approve copy, resolve model holds, or authorize a newsletter/social post.
The initial manifest is empty: no current batch item is implicitly approved or
grandfathered. A due unapproved article blocks the whole deployment so an accidental
build cannot release it. After the gate reaches main, enable the workflow and set
the variable; retain the empty manifest until the owner approves exact content.

Run `python scripts/test_publishing.py` to verify the fictional approval fixtures;
`python scripts/check-publishing.py` checks the actual checkout without publishing.

Write Markdown in src/content/blog. Set draft: true while preparing it. Drafts and future pubDate entries produce no article route and stay out of the blog list, RSS, sitemap, and search index. Source files in a public Git repository remain public even when draft: true: keep private interviews and briefs in business-ops. Publication dates are evaluated at build time; a future article needs a new build after its date.

Frontmatter accepts title, description, pubDate, updatedDate, draft, tags, heroImage, heroAlt, heroWidth, and heroHeight. Header images live under /assets/blog/ and require actual pixel dimensions. Informative images require descriptive alt text. Decorative images, including local SVG banners, use heroDecorative: true with heroAlt: "". SVG banners retain the default raster social image for sharing. A header is optional. Use a real screenshot or technical diagram inside an article when it explains the mechanism more accurately than an illustration.

Run npm run build and npm run test:editorial, then npm run preview. Pagefind indexes article bodies after Astro builds. Search assets are available in the built preview, rather than the development server. Review the desktop and mobile article, contents links, search, canonical URL, RSS, social image, and source links before publication. Follow the repository release process; these commands do not publish.

## Default article banners

Create each article with its decorative SVG using article:new. The [approved SVG banner system](editorial-banners.md) defines the palette, proportions, motifs, generation commands, and review rules. This is the default article artwork; generation is local and free of provider calls. The OpenRouter command remains an optional alternative for a specifically requested raster illustration.

## Header images through OpenRouter

Run npm run image:header -- article-slug prompt.txt "Descriptive alt text" --dry-run to inspect the request without credentials or a paid call. Remove --dry-run for one explicit generation. Set OPENROUTER_API_KEY only in the local environment. The browser, build, and deployment workflow never receive the key or generate images.

The fixed default is black-forest-labs/flux.2-klein-4b with one 16:9 JPEG and no automatic retries or provider fallbacks. OpenRouter listed the first megapixel at $0.014 and subsequent megapixels at $0.001 on 2026-10-16; output size and current rates determine the actual charge. This is an inexpensive default, not a guaranteed spend cap. Provider availability and image quality need a live check with a locally configured key. The command reports cost when returned and preserves a prompt/model sidecar. Inspect the result, optimize it, record its actual dimensions, and remove metadata you do not want published before committing an asset. Existing images are never overwritten.

## Search and AI discovery

Use descriptive titles and summaries, semantic headings, canonical links, author identity, honest publication/update dates, crawlable HTML, linked sources, RSS, and the sitemap. Article JSON-LD reflects visible content. Add definitions and direct answers where they help the reader; avoid repetitive FAQ sections or keyword padding. Search Console and referral data can inform later revisions. Rankings and citations are outcomes to observe.

Google says AI Overviews and AI Mode require no special optimization beyond established search practices. Do not add hidden content or crawler-specific claims. See https://developers.google.com/search/docs/appearance/ai-features .

References checked 2026-10-16: https://pagefind.app/docs/ ; https://openrouter.ai/docs/guides/overview/multimodal/image-generation ; https://openrouter.ai/black-forest-labs/flux.2-klein-4b/performance .

## Article sign-off

Close articles with Best, and the original Matt Cochran handwritten signature from the email template, before the closing SVG. Use the local signature asset at /assets/images/email/mc-signature.png at a modest width, with Matt Cochran as its alt text. Keep the full email contact block out of articles. The shared layout renders src/components/ArticleSignoff.astro once per article; do not duplicate the sign-off in article Markdown.


Optional implementation notes belong in src/article-notes/<article-slug>.md. The shared article layout renders them in an expandable section after the signature and before the closing banner, keeping the main Markdown focused on the reader's problem.


## Weekly newsletter signup

The shared layout renders the MC Product Labs Weekly signup block; do not add it to individual article Markdown. The verified Kit form is https://mc-product-labs.kit.com/795deb861b (form 10056639, UID 795deb861b). It uses email confirmation with auto-confirm off. The official Kit browser helper posts directly to Kit; the hosted link remains available without JavaScript. No API keys belong in this site.

The signup follows the sign-off, technical notes and closing artwork, and stays out of Pagefind article text.

The newsletter is a brief weekly digest: initially two useful highlights, growing to three when warranted, with short takeaways and links to evergreen articles. Bizops owns preparation, review and sending. Creating the form or passing a site build does not approve newsletter copy or enable campaign delivery.
