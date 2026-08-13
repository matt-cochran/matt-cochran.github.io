# Homepage Audience FMECA — Lock Criteria

Scoring is a comparative design heuristic: Severity (S), Likelihood (L), and low-detectability risk (D) are each 1–5; RPN = S × L × D. Scores prioritize the lock pass, not statistical failure rates.

## Persona 1 — Hiring manager or startup-engagement customer

| Failure mode | Effect on decision | S | L | D | RPN | Required mitigation |
|---|---|---:|---:|---:|---:|---|
| Product catalog overwhelms the professional proposition | Reader cannot quickly place Matthew at the right seniority or understand why to engage him | 5 | 4 | 3 | 60 | Hero and first viewport must establish CTO/founder leadership, player-coach operating style, enterprise/startup breadth, AI specialization, and two clear next steps |
| Leadership proof is compressed into titles and generic claims | Hiring manager doubts team-building, operating, and delivery depth | 5 | 4 | 3 | 60 | Add concise, attributed leadership evidence and distinguish strategic direction, team leadership, program execution, and hands-on shipping |
| Unsupported or imprecise claims are noticed | Trust collapses across the entire portfolio | 5 | 3 | 4 | 60 | Describe Artnet as a publicly traded company without foregrounding revenue; remove invented maturity, performance, or product claims; qualify metrics with context |
| Startup engagement remains a small or buried utility link | Qualified founder assumes there is no relevant offer or availability | 5 | 4 | 2 | 40 | Add a compact, credible startup-engagement pathway with fit, outcomes, and a direct next step; keep it consultative, not promotional |
| Breadth reads as scattered experience | Cross-domain history looks unfocused rather than transferable | 4 | 3 | 3 | 36 | Frame breadth as repeated pattern recognition across regulated, high-consequence, and scaling environments, supported by examples |
| AI language feels keyword-led | Specialist positioning is discounted | 4 | 3 | 3 | 36 | Connect governed AI, deterministic execution, MCP tooling, evaluation, approval, and auditability to shipped systems and public work |
| Page density delays résumé and engagement actions | Time-poor reader exits despite positive first impression | 4 | 4 | 3 | 48 | Improve information scent, shorten copy, use progressive disclosure, and repeat the appropriate action at natural decision points |

## Persona 2 — Product user doing research

| Failure mode | Effect on decision | S | L | D | RPN | Required mitigation |
|---|---|---:|---:|---:|---:|---|
| Product maturity, availability, and support are unclear | User cannot judge whether adoption or purchase is safe | 5 | 4 | 4 | 80 | Give every product an honest status, delivery model, evidence link, and specific next action; distinguish available, open-source, preview, and upcoming |
| Products are presented as a flat set of brands | User cannot locate the product for their problem | 5 | 4 | 3 | 60 | Organize products by user problem or family and state “for whom / what it solves” before technical detail |
| Commercial products, open source, and experiments are conflated | Buyer misreads commitment and long-term support | 5 | 4 | 3 | 60 | Visually and verbally separate customer-facing products, open-source foundations, and emerging work |
| Reliability and security assurances are portfolio-wide abstractions | Claims do not reduce the risk of choosing a specific product | 5 | 3 | 4 | 60 | Put product-specific trust evidence on each card: deployment model, threat model, privacy posture, deterministic behavior, docs, or repository as applicable |
| Generic or placeholder calls to action break research flow | User cannot continue validation | 5 | 4 | 2 | 40 | Use destination-specific labels such as View product, Read documentation, Inspect repository, or Join preview |
| Praxec and tflo begin with architecture rather than user value | Non-specialist buyer or evaluator disengages | 4 | 3 | 3 | 36 | Keep separate full-width sections, but lead with plain-language purpose and audience, then expose the technical system |
| Personal career material obscures the product answer | Product researcher leaves before finding fit | 3 | 3 | 2 | 18 | Keep the personal brand as the trust layer while making the product index scannable immediately after the opening proposition |

## Pressure-test journeys

### Hiring manager

- At 10 seconds: can identify seniority, player-coach posture, AI engineering specialization, and product/engineering/program leadership.
- At 30 seconds: can verify enterprise and startup breadth plus at least two attributed outcomes.
- At 2 minutes: can inspect products as evidence, reach a clean résumé, and understand the kind of leadership role for which Matthew is credible.

### Startup-engagement customer

- At 10 seconds: understands Matthew can both set direction and enter the work hands-on.
- At 30 seconds: sees fit for high-consequence product, delivery, architecture, AI, and scaling problems without a sales-heavy pitch.
- At 2 minutes: can review proof and take a direct startup-engagement action.

### Product researcher

- At 10 seconds: can see product families and distinguish products from open-source foundations.
- At 30 seconds: can identify the product relevant to their problem and its current status.
- At 2 minutes: can validate specific safety, reliability, privacy, documentation, or source evidence and follow a meaningful product CTA.

## Non-negotiable factual constraints

- Describe Artnet as a publicly traded company; omit the revenue figure from homepage positioning.
- At Medidata, Matthew architected and repaired flagship products and led turnarounds for some of the weakest products in the portfolio. Describe the scope precisely without implying enterprise-wide authority.
- Attestrack core and Attestrue extensions must not be conflated.
- Do not invent features or maturity for FrontRails or Synapate.
- Do not claim a product is production-ready unless the supplied evidence explicitly supports that label.
- Metrics must be attributed to a role or project context and not imply universal product performance.

## Design lock acceptance criteria

1. The first viewport has a clear personal proposition and distinct Explore products and View résumé/leadership actions.
2. Startup engagement is findable from navigation and has a credible compact section.
3. Products are grouped, status-labeled, and paired with product-specific proof and non-placeholder actions.
4. Praxec and tflo remain separate large-scale sections with plain-language openings.
5. The methodology treatment is edge-to-edge, quiet, readable, and materially less noisy.
6. Motion uses the established animation tokens, respects reduced motion, and never obstructs scanning.
7. No unsupported claims remain.
