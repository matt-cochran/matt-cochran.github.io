# Matthew Cochran Product Portfolio — Design System and Strategic Brief

## Product context

This is a founder-led product portfolio and authority site. The primary job is to make technical and product buyers confident that Matthew Cochran's products are carefully conceived, robustly engineered, safe, reliable, maintainable, and commercially grounded. The personal brand remains prominent, but products—not consulting—are the main path through the site.

Matthew is positioned as a rare product-development operator with deep product strategy and hands-on engineering capability across enterprise and startup environments. His career proof, motivation, operating principles, and measurable outcomes answer the buyer's implicit questions: Why trust this builder? Will the product hold up? Does he understand my environment? Will it be maintained responsibly?

## Portfolio represented

Source of truth: the public `matt-cochran-products` GitHub organization. Product repositories and release repositories should be consolidated into customer-facing product entries rather than shown as eight unrelated repos.

- Attestrack — first-party server-side analytics and measurement deployed into the customer's own Cloudflare account. MIT licensed; events and credentials remain in customer infrastructure. Includes community consent, a canonical ClickHouse schema, destination strategies, operator analytics, Explore, public contracts, architecture decision records, a security policy, CI, E2E testing, type checking, boundary checking, verification, and rollback documentation.
- Attestrue — paid privacy/compliance extensions for Attestrack: attorney-maintained regulation configuration, enhanced consent runtime packs, independently witnessed records, Proof, and counsel workflows. Presented clearly as an extension layer, not as a replacement for the open-source analytics core.
- Licenz — offline-first software-license verification for Rust, plus a cross-platform CLI and managed offering. Cryptographically signed licenses, hardware binding, tamper detection, explicit threat model, FMECA guidance, and a Security Witness pattern that separates attestation from enforcement. MIT core; published as `licenz-core` on crates.io; CLI is free to use and closed source.
- FrontRails — a downloadable product distributed through the `frontrails-releases` repository. Treat as a distinct product with a release/download CTA; do not invent feature claims until its customer-facing copy is confirmed.
- Sound Playground — private, local-first music playground for children. Runs entirely on the installed computer, needs no account, and sends nothing a child makes off-device. Downloads support Windows x64/ARM, universal macOS, Linux x64, and ARM Linux; release checksums are published.
- Synapate — an upcoming product at synapate.com. Current public site is “coming soon”; use an honest Coming Soon status and do not invent maturity claims.

Repository utilities (`attestrack-site`, `licenz-cli`, and release-only repositories) belong under their parent product. Confidence must come from candid lifecycle labels and evidence, not inflated claims.

## Open-source engineering portfolio

Give open source a dedicated section after the commercial/customer-facing products. Its job is to prove engineering depth, design judgment, testing discipline, security candor, and cross-platform reach. Do not imply that every repository is a commercial product.

- Attestrack — the open-source core is itself a major proof point: CI and E2E badges, build/test/typecheck/boundary checks, ADRs, public schemas and contracts, a security policy, deployment verification, rollback guidance, and an explicit OSS-versus-paid boundary.
- Licenz / `licenz-core` — published Rust crate with docs, a normative security model, explicit controls and limitations, implementation FMECA, offline and air-gapped use cases, and optional post-quantum support.
- tflo — experimental pre-1.0 embeddable temporal event-processing engine. Rust core plus WASM/TypeScript use, typed absence and signals, deterministic batch/stream parity, browser/edge deployment, and honest “when not to use it” guidance.
- tflo-react — declarative temporal state for React backed by the same Rust/WASM engine, with deterministic replay, typed APIs, SSR/lifecycle guidance, and validation comparisons against incumbent approaches.
- tflo-browser-events — declarative browser interaction capture and CEP-derived domain signals, with durable event IDs, CEL rules, and pluggable sinks.
- execution-policy — runtime-light Rust reliability policies for retry, backoff, jitter, timeouts, circuit breaking, bounded concurrency, retry budgets, routing/failover, deterministic clocks, and observability. Evidence includes documented composition order, explicit classifications, and measured low-overhead success path.
- SureShift — product-readiness and operational-safety scan positioned around a read-only baseline of CI/CD, cloud, monitoring, access, and recovery. Treat it as a customer-facing product emerging from Matthew's public work, with its safety boundary stated plainly: no agent, no secrets collected, no changes made.

### Praxec family

Praxec is a major open-source family and should receive comparable visual weight to tflo. Present it as an ecosystem, not a flat list of unrelated repositories.

- Praxec kernel — the AI execution kernel for deterministic, policy-gated workflows over MCP tools, CLIs, HTTP services, scripts, and native modules. YAML state machines expose only legal transitions; the kernel grants bounded access, validates outputs before advancing, supports guards and human approval gates, and produces an audit log. Apache-2.0, CI, cross-platform release binaries and checksums. Keep publication status candid where install methods are still marked coming soon.
- Cognitive Architectures — Praxec-native capabilities and lifecycle orchestrators for governed software work; structured skills, workflows, agents, connections, and hash-pinned scripts. The Max layer adds a grounded-UX factory spanning JTBD discovery, design science, FMECA, implementation, verification, and review.
- Praxec Packs and Praxec Meta — registry/provisioning for workflow packs and their tools, plus self-authoring and optimization flows for Praxec definitions.
- Deterministic MCP tool suite — group these as a designed toolbox: CPM Planner (critical path and lock-aware parallel scheduling), Elicitation (falsification-based discovery/readiness), FMECA (computed risk criticality and mitigation readiness), Corpus (local docs RAG with BM25 and optional embeddings), Crossmatrix (multidimensional QFD/tradeoff analysis), Scientific Process (append-only hypotheses/experiments/evidence/verdicts), plus supporting Log Analyzer and Markdown Administrator tools.
- FrontRails Praxec Pack — exposes IntentOS, StructureOS, SecurityOS, and uxos as governed Praxec capabilities while retaining their authoritative gates, including durable human-approval tickets and fuzz-checked workflow soundness.
- Praxec Design — a governed UI-design annealing pipeline; label it Spec only.

Visual grouping: Praxec kernel at the center, then three rings or bands—architectures/packs, deterministic tools, integrations. Show evidence and maturity at the family and item levels without turning the homepage into a repository directory.

Open-source presentation pattern: project name, maturity badge, one-sentence problem solved, language/runtime, evidence chips (tests/docs/security/license/benchmarks), and “View repository.” Group tflo bindings under the tflo family rather than making the portfolio feel fragmented.

## Selected direction: Editorial Engineering Dossier

The selected visual base is The Builder's Dossier. Evolve it with the Product Workshop's engineered grid, artifact labeling, and visible systems thinking, but keep the voice editorial and personal.

- The intended impression—Matthew can conceive, build, ship, and steward products—must be derived from the breadth and quality of shipped work, not asserted in slogans.
- Remove explicit claims such as “I combine product judgment with deep engineering capability.” Prefer restrained observations and evidence-led copy.
- The hero should be personal but understated: name, portrait, concise working thesis, and a current portfolio signal. Avoid “Founder & Engineer” as a self-awarded badge and avoid a dossier-number gimmick.
- Combine art and science: expressive serif editorial typography and human portraiture over a precise baseline grid, disciplined alignment, mono metadata, version/status labels, and restrained technical diagrams.
- Product thinking should appear through the questions each product answers: user need, market choice, boundary, product decision, and outcome—not only through architecture details.
- Engineering depth should appear through concrete artifacts: languages, runtimes, release coverage, tests, threat models, ADRs, schemas, checksums, deterministic kernels, failure models, and support boundaries.
- Use a denser but calm portfolio index. It may show more than six products by using three levels: Featured Products, Product Families, and Labs/Upcoming.
- Pull selected career context into the homepage as a short evidence timeline connecting product decisions to measurable outcomes; the full résumé remains a separate page.
- Keep Startup Help secondary and understated.
- The Product Workshop becomes a future subpage or methodology page; the homepage may preview it with one compact “From need to maintained product” strip.

## Leadership positioning

Matthew's differentiator is the integration of three disciplines, not only product plus engineering:

1. Product leadership — market and user discovery, product strategy, JTBD, prioritization, roadmap choices, commercial viability, and ongoing stewardship.
2. Project leadership — decomposition, dependency management, Critical Path Method, sequencing, staffing, delivery governance, risk/ROI decisions, and execution through measurable outcomes.
3. Technical leadership — architecture, hands-on implementation, cloud/data/security/AI systems, engineering practice, release operations, and team development.

This should read as a player-coach pattern: capable of setting direction, building and leading product-engineering organizations, and personally shipping software. Avoid the phrases “ivory tower” and “I can do it all”; show the balance through roles, artifacts, and outcomes.

Leadership evidence to surface accurately:

- Former CTO of Artnet, approximately $26M annual business, with responsibility spanning product/engineering transformation, cloud migration, data modernization, operational resilience, and team/process leadership.
- Former Founder/CTO of TruthShield and current product-building work through OutboundLabs and the public portfolio.
- Senior leadership/architecture experience at enterprise-scale organizations including Medidata, plus experience across Shutterstock and other businesses in the full résumé.
- More recent startup work spans quantum-secure cryptography, military intelligence, health technology, and financial technology. Present this breadth as transferable pattern recognition across risk profiles and regulated/mission-critical contexts; do not fabricate employer or product names not already documented.
- Experience building and leading substantial teams while remaining technically hands-on.
- CPM Planner is concrete evidence of project discipline translated into software: a Critical Path Method engine and MCP server that computes schedules, slack, bottlenecks, critical paths, and lock-aware parallel cohorts for agentic coding workflows.

Homepage treatment: add a concise “Leadership across the product lifecycle” or equivalent evidence band showing Product / Project / Technical as connected responsibilities, backed by one example each. This is not a three-column skills claim; it should connect decisions to delivery and working systems.

## Artificial intelligence engineering specialization

AI engineering is a primary specialization and should be visible throughout the site, not confined to the Praxec repository section. Position it precisely as production-oriented, governed AI systems engineering rather than generic AI enthusiasm or prompt engineering.

Evidence themes:

- Praxec: deterministic, policy-gated AI execution kernel that constrains models to legal workflow transitions, grants bounded capability access, validates outputs, supports human approval, and records audit history.
- Cognitive Architectures: structured agent capabilities and lifecycle workflows that encode how and when models reason, act, verify, and hand off.
- MCP tool ecosystem: deterministic tools for CPM planning, elicitation, FMECA risk analysis, corpus retrieval, QFD tradeoffs, and scientific evidence processes. These separate model judgment from code-owned calculation, state, and gates.
- FrontRails integration: governed intent, structure, security, and UX capabilities with authoritative gates and durable approval tickets.
- Hands-on platform work across Rust, TypeScript, WASM, MCP, model providers, retrieval, agent workflows, tool contracts, evaluation/verification, and operational controls.
- AI is used both inside products and to improve how products are conceived, planned, implemented, verified, and maintained.

Homepage treatment: add “AI engineering” to the early scope in a calm, concrete way, supported immediately by Praxec and the tool ecosystem. Do not use vague phrases like “AI expert,” “AI-powered everything,” or “cutting-edge AI.”

Product Workshop treatment: show where AI is appropriate and where deterministic software, policy gates, human approval, or conventional automation must remain authoritative. Include model/tool boundary design, context and retrieval, evaluation, observability, safety, and failure containment.

Résumé treatment: make Artificial Intelligence Engineering a first-class capability area alongside Product, Project, and Technical Leadership. Include concrete stack and system responsibilities rather than a keyword cloud.

Do not present experiments, WIP projects, or pre-1.0 tools as production-ready. Confidence must come from candor and visible engineering discipline, not inflated claims.

## Information architecture

Primary navigation: Products, Product Practice, Proof, Writing, About. Utility links: Résumé and Startup Help. Primary CTA: Explore products. Secondary CTA: How I build dependable products.

Homepage sequence should include:

1. Personal-brand hero with a clear thesis: product judgment and engineering depth in one builder.
2. Product portfolio index with maturity/status, audience, outcome, and clear product destinations.
3. Trust architecture: reliability, safety/security, testing/verification, operability, maintenance, and honest lifecycle labels.
4. Product-development acumen: discovery, market validation, architecture, implementation, release, and learning loops.
5. Cross-context proof: enterprise scale plus startup speed, with measurable outcomes such as 280× deployment/management efficiency, 454% project execution velocity, and 110× deployment velocity.
6. Founder motivation and operating principles: build fewer, clearer things; make uncertainty explicit; design for failure; verify what matters; earn trust through evidence.
7. Selected writing and technical thinking.
8. Startup help retained as a secondary offer, and résumé retained as deeper evidence.

## Shared brand invariants

- Always show “Matthew Cochran” prominently. The site is founder-led, not an anonymous holding company.
- Tone: calm, exact, candid, experienced, commercially aware. Never breathless, flashy, or hype-heavy.
- Copy favors verifiable evidence, explicit tradeoffs, lifecycle labels, and concrete buyer outcomes.
- Avoid generic “innovation,” “cutting-edge,” “world-class,” and unqualified safety/reliability claims.
- Product cards must be scannable and should show status: Available, Preview, Experimental, or In development.
- Confidence cues: CI/release status, compatibility, documentation, security posture, test philosophy, support/maintenance expectations, and boundaries.
- Accessibility: WCAG-minded contrast, visible focus states, keyboard usability, 44px touch targets, reduced-motion support.
- Layout max width: 1440px with responsive 24–64px gutters. Dense sections may use 12-column grids.
- Motion is restrained: 160–240ms fades, underline sweeps, status-pulse only where meaningful. Disable under reduced motion.

## Four approved concept families

These are intentional concept branches. Each may use its named family without mixing decorative motifs from another family.

### A. Product Operating System

- Visual idea: sophisticated product studio / command center.
- Background `#0B1016`, panels `#111923`, elevated `#172331`, line `#263545`.
- Text `#EAF0F5`, secondary `#A7B4C1`, accent steel `#75A7D8`, dependable green `#4FD1A5`, caution amber `#E4B45C`.
- Fonts: IBM Plex Sans for display/body; IBM Plex Mono for statuses and technical evidence.
- Modular 12-column grid, compact status rails, release badges, product cards with structured evidence.
- Best for making the breadth of products and operational maturity immediately legible.

### B. The Builder's Dossier

- Visual idea: premium editorial casebook; personal authority first, products as authored bodies of work.
- Paper `#F2EFE8`, ink `#171A1D`, muted `#62676C`, steel `#567A9B`, rule `#CFC9BE`, deep navy `#162536`.
- Fonts: Source Serif 4 for major headlines and quotations; Inter for interface/body; IBM Plex Mono for annotations.
- Strong typographic scale, asymmetric editorial composition, numbered evidence notes, generous whitespace, thin rules.
- Best for standing out as a senior product-development thinker while retaining warmth and biography.

### C. Product Constellation

- Visual idea: one builder, a coherent system of products orbiting shared principles.
- Background `#080B12`, surface `#101522`, text `#F2F5F8`, secondary `#9DA9B7`, electric blue `#69A9FF`, cyan `#63D8D2`, violet used sparingly `#9A87E8`.
- Fonts: Manrope for display/body; JetBrains Mono for labels.
- Spatial map/constellation hero, connected product nodes, product categories as clusters, crisp luminous lines without gradients or sci-fi clutter.
- Best for showing portfolio coherence and making product exploration memorable.

### D. The Product Workshop

- Visual idea: transparent engineering workshop; decisions, tests, and artifacts are visible.
- Warm white `#FAF8F3`, charcoal `#202326`, muted `#676D70`, workshop blue `#3977A6`, verification green `#2F8067`, orange `#C86D35`, grid line `#D9D4CA`.
- Fonts: Archivo for display/body; Source Code Pro for technical annotations.
- Bold blocks, annotated diagrams, blueprint/grid cues, large plainspoken headings, physical-card feel with 2px rules and minimal shadow.
- Best for communicating method, craft, dependability, and hands-on engineering depth.

## Current-site baseline for reproduction

The mandatory current-state draft must reproduce the existing homepage exactly before branching. It uses Lato, dark charcoal surfaces (`#2d2e2e`), steel blue (`#6b8cae`), gray text hierarchy, a sticky wordmark navigation, compact portrait hero, and repeated 30/70 split sections. Do not apply any concept-family styling to the reproduction.

## Responsive behavior

- Desktop concepts should be designed at 1440px.
- At tablet, product grids collapse from 3–4 columns to 2; editorial splits become stacked.
- At mobile, keep product name/status/outcome visible without opening details; navigation uses a clear compact menu.
- Interactive constellation or diagrams must have an equivalent accessible list.

## Motion tokens

Motion should make the editorial grid feel alive and engineered, never promotional or ornamental.

- `--motion-instant: 80ms` — pressed states and immediate acknowledgements.
- `--motion-fast: 140ms` — link underlines, icon shifts, focus/hover state changes.
- `--motion-standard: 220ms` — card-border emphasis, metadata reveal, small layout transitions.
- `--motion-enter: 420ms` — first viewport entry for major editorial blocks.
- `--motion-sequence-gap: 55ms` — restrained stagger between sibling product artifacts, capped at six items.
- `--ease-standard: cubic-bezier(0.2, 0, 0, 1)` — primary deceleration curve.
- `--ease-emphasis: cubic-bezier(0.16, 1, 0.3, 1)` — rare hero/diagram entrance.

Approved micro-animation patterns:

- Navigation underline draws left-to-right on hover/focus in 140ms.
- Product artifact border moves from rule to steel; its arrow translates no more than 3px.
- Status markers may reveal with opacity plus a 4px vertical movement; never pulse continuously.
- Major sections reveal once with opacity plus 10px translation; content remains fully visible without JavaScript.
- Family diagrams may draw connector rules once as they enter the viewport; nodes do not float, orbit, or loop.
- Numerical evidence may cross-fade from label to value but must not use odometer/count-up theater.
- Use View Transitions for internal navigation only when supported.
- Under `prefers-reduced-motion: reduce`, remove transforms, stagger, smooth scrolling, and view-transition animation; state changes remain instantaneous.

## Audience pressure tests

### Hiring manager

Within the first viewport and first two sections, the reader should understand scope, seniority, recency, and role range without decoding product names. Include a restrained line connecting current shipping work with 25+ years across product, engineering, enterprise transformation, and startups. Make the résumé path prominent. Metrics need enough context to be credible, not floating numbers. Avoid a page so product-commercial that it obscures leadership, team-building, or cross-functional judgment.

### Product or technical buyer

Within the first viewport and product index, the reader should see what is available, who each product is for, its maturity, its trust boundary, and where to learn more. Separate products from open-source proof. Avoid implying support, security, or production maturity that the repositories do not document.

### Technical peer or open-source adopter

The reader should quickly find the tflo and Praxec families as two independent, equally deliberate bodies of work. Each receives a full-width section with its own thesis, architecture/family map, maturity, evidence, member projects, and repository CTA. Do not nest tflo visually or semantically inside Praxec.
