# FMECA + Poka-Yoke: Expert Engagement Perception

**Scope:** Failure modes that hinder the site from being perceived as an expert, high-ticket engagement.  
**Lenses:** Cognitive science (fluency, authority, uncertainty reduction); Five Whys (root cause); *The Science of Selling* (Hoffeld)—brain-based buying, commitment, scarcity, consistency.

---

## 1. Failure Mode: Broken or Incomplete Copy

| Item | Detail |
|------|--------|
| **Failure** | Orphan fragment ("I'm ") or placeholder text visible. |
| **Effect** | Cognitive fluency disrupted; brain flags error → trust drop. Inconsistency = "not expert." |
| **Criticality** | **High** — Single visible error can dominate recall (negativity bias). |
| **Five Whys** | Why not expert? → Page feels unfinished. Why? → Copy error visible. Why? → Incomplete edit or merge. Why? → No single source of truth / no pre-publish checklist. Why? → No poka-yoke to prevent or catch fragments. |
| **Poka-yoke** | (1) Remove all orphan fragments. (2) Pre-publish checklist: "No standalone pronoun or single word in a \<p\>." (3) Optional: simple HTML lint or build step that flags \<p\> with very short text. |

---

## 2. Failure Mode: Competing CTAs Dilute Authority

| Item | Detail |
|------|--------|
| **Failure** | Multiple equal-weight CTAs (e.g. "Take Snapshot" + "What you get" + "More detail" + "Take the Snapshot" again in same view). |
| **Effect** | Choice overload → decision deferred; expert positioning uses one clear next step (commitment/consistency). Science of Selling: clarity on *one* next action reduces uncertainty and increases conversion. |
| **Criticality** | **High** — Confuses "what do I do?" and weakens authority (experts don't beg from every section). |
| **Five Whys** | Why not expert? → Feels like lead-gen site. Why? → Many competing asks. Why? → Every section has its own CTA. Why? → Design goal was "CTA everywhere." Why? → No hierarchy (primary vs secondary). |
| **Poka-yoke** | (1) One **primary** CTA per page: "Take the Scale Readiness Snapshot." (2) Secondary actions are text links, not buttons, and de-emphasized. (3) Nav: "Take the Snapshot" is the only action-style item; rest are wayfinding. |

---

## 3. Failure Mode: Snapshot CTA Points to Placeholder (#)

| Item | Detail |
|------|--------|
| **Failure** | "Start the Scale Readiness Snapshot" links to `#snapshot-form` with no form. |
| **Effect** | User commits, then dead end → frustration and loss of trust. Violates expectation of "structured process." |
| **Criticality** | **Critical** — Directly breaks the core funnel and expert promise. |
| **Five Whys** | Why not expert? → Process doesn't work. Why? → Button goes nowhere. Why? → Form not yet implemented. Why? → No guard against going live without URL. Why? → No "go-live" checklist. |
| **Poka-yoke** | (1) Replace `#snapshot-form` with real Typeform/Form URL before launch. (2) If URL is placeholder, don't show the CTA as primary button, or show "Coming soon" and collect email. (3) Checklist: "Snapshot button href is not # and returns 200." |

---

## 4. Failure Mode: No Scarcity or Exclusivity

| Item | Detail |
|------|--------|
| **Failure** | No signal that capacity or attention is limited. |
| **Effect** | Brain values scarce resources more (Science of Selling). "Anyone can get this" = commodity. Expert engagements are positioned as limited. |
| **Criticality** | **Medium** — Affects perceived value and urgency. |
| **Five Whys** | Why not expert? → Feels available to everyone. Why? → No scarcity. Why? → Copy doesn't mention capacity. Why? → Fear of sounding salesy. Why? → No design rule: "scarcity = capacity, not fake urgency." |
| **Poka-yoke** | (1) One line only: e.g. "I run a limited number of diagnostics at a time." (Already on scale-readiness; ensure consistent on homepage offer.) (2) No countdowns or fake scarcity. (3) Tone: calm, factual. |

---

## 5. Failure Mode: Proof Without Clear Attribution or Specificity

| Item | Detail |
|------|--------|
| **Failure** | Case snippets are anonymous ("I did X") or vague ("a company"). |
| **Effect** | Specificity and named outcomes increase perceived authority (cognitive ease + social proof). Vague proof = brochure speak. |
| **Criticality** | **Medium** — Proof exists but underperforms for trust. |
| **Five Whys** | Why not expert? → Proof feels generic. Why? → No names or concrete context. Why? → Anonymity preferred. Why? → Legal/privacy. Why? → No rule: "anonymous but specific (metrics, role, stage)." |
| **Poka-yoke** | (1) Keep client names out if required; add context: "At a Series A art-tech company," "CTO engagement," "10–50 eng." (2) Lead with outcome numbers (280x, 454%, etc.) and role. (3) One line per case: who (type), what (intervention), result (metric). |

---

## 6. Failure Mode: Inconsistent Tone (Casual vs Formal)

| Item | Detail |
|------|--------|
| **Failure** | Mix of "If that's you" (casual) and "decision-grade validation" (formal) without a clear voice. |
| **Effect** | Fluency drops when style shifts; consistency = expertise. Executive buyers expect steady, calm tone. |
| **Criticality** | **Medium** — Weakens coherence and authority. |
| **Five Whys** | Why not expert? → Voice feels uneven. Why? → Some sentences conversational, some formal. Why? → Copy written in passes. Why? → No single voice guideline. Why? → No "one reader, one tone" rule. |
| **Poka-yoke** | (1) Voice rule: "Executive, calm, direct; no slang; no hype." (2) Replace casual phrases: "If that's you" → "If that describes you" or "If this matches your situation." (3) Single pass for tone before publish. |

---

## 7. Failure Mode: Footer and Social Suggest "Influencer" Not Advisor

| Item | Detail |
|------|--------|
| **Failure** | Homepage footer: LinkedIn + Facebook + Twitter + YouTube. |
| **Effect** | Many social channels = content creator / influencer. Experts and executives typically emphasize one professional channel (e.g. LinkedIn). |
| **Criticality** | **Medium** — Dilutes "executive advisor" signal. |
| **Five Whys** | Why not expert? → Looks like broad-audience presence. Why? → Four social links. Why? → Legacy from general portfolio. Why? → No positioning rule for footer. Why? → Footer not reviewed for expert positioning. |
| **Poka-yoke** | (1) Homepage footer: LinkedIn only for "expert" frame; move other links to About or remove. (2) Rule: "Primary contact = email + LinkedIn; other social only if purpose is clear." |

---

## 8. Failure Mode: Price Anchoring Buried or Unclear

| Item | Detail |
|------|--------|
| **Failure** | "$25k+" appears once, late; no clear expectation set. |
| **Effect** | Science of Selling: anchoring reduces uncertainty and pre-qualifies. Hidden price = either "cheap" or "scary surprise." Expert positioning uses clear, confident anchoring. |
| **Criticality** | **Medium** — Affects qualification and perceived tier. |
| **Five Whys** | Why not expert? → Unclear what tier this is. Why? → Price not visible. Why? → Fear of scaring people. Why? → No rule that anchoring filters and builds trust. Why? → No placement guideline. |
| **Poka-yoke** | (1) Keep "Engagements typically start at $25k+" in Offer section; add one mention in Scale Readiness page. (2) No discounts or "contact for pricing" without range. (3) Rule: "One clear anchor per offer." |

---

## 9. Failure Mode: No Response-Time Expectation

| Item | Detail |
|------|--------|
| **Failure** | Snapshot page says "I'll review and reply within a few business days" but no explicit commitment. |
| **Effect** | Uncertainty about "what happens next" increases anxiety and reduces trust (cognitive need for predictability). |
| **Criticality** | **Low–Medium** — Improves perceived process control. |
| **Five Whys** | Why not expert? → Unclear when they'll hear back. Why? → "Few business days" is vague. Why? → Avoid over-promising. Why? → No standard SLA. Why? → No design rule for response clarity. |
| **Poka-yoke** | (1) Be specific: "within 2 business days" or "within 3 business days." (2) Same line in disqualification email: "We respond to all Snapshot submissions within X days." (3) If you can't commit, say "typically within 3–5 business days." |

---

## 10. Failure Mode: About Page Two Equal CTAs

| Item | Detail |
|------|--------|
| **Failure** | "← Back to Scale Readiness" and "Take the Snapshot" as equal links. |
| **Effect** | Same as #2: no single next step; About should support the main funnel, not split attention. |
| **Criticality** | **Low** — About is secondary. |
| **Five Whys** | Why not expert? → About feels like a crossroads. Why? → Two CTAs. Why? → Want to offer both return and action. Why? → No hierarchy. Why? → No rule: "About = credibility; one primary CTA to Snapshot." |
| **Poka-yoke** | (1) Primary: "Take the Scale Readiness Snapshot." (2) Secondary: "Back to home" as small text. (3) Rule: "About page has one primary CTA." |

---

## 11. Failure Mode: Avatar or Images Without Alt / Professional Polish

| Item | Detail |
|------|--------|
| **Failure** | `alt=""` on avatar or missing alt. |
| **Effect** | Accessibility failure; empty alt can be read as "unfinished" or "generic" by assistive tech. Small polish gaps reduce fluency. |
| **Criticality** | **Low** — But easy fix; supports "detail-oriented expert." |
| **Five Whys** | Why not expert? → Small oversights. Why? → Alt not set. Why? → Template or copy-paste. Why? → No a11y checklist. Why? → No go-live checklist. |
| **Poka-yoke** | (1) Meaningful alt on all images: e.g. "Matt Cochran" for avatar. (2) Checklist: "Every img has non-empty, descriptive alt." |

---

## 12. Failure Mode: Section Comments or Dev Artifacts Visible

| Item | Detail |
|------|--------|
| **Failure** | HTML comments like "############ INTRO #############" or "REMOVED: ..." visible in source or in certain readers. |
| **Effect** | If ever exposed (e.g. in search snippets, readers, or tools), looks unprofessional. |
| **Criticality** | **Low** — Usually hidden. |
| **Five Whys** | Why not expert? → Looks like dev site. Why? → Comments are verbose. Why? → Legacy from template. Why? → No cleanup before launch. Why? → No "no dev comments in prod" rule. |
| **Poka-yoke** | (1) Remove or shorten section comments to single line. (2) No "REMOVED" or "TODO" in production HTML. |

---

## Summary: Poka-Yoke Implementation Checklist

| # | Poka-yoke | Owner |
|---|-----------|--------|
| 1 | No orphan copy; pre-publish scan for short \<p\> fragments | Content |
| 2 | One primary CTA per page (Snapshot); secondary = text links | Design |
| 3 | Snapshot button: real URL before launch; checklist item | Dev |
| 4 | One scarcity line (limited diagnostics); no fake urgency | Content |
| 5 | Proof: context (stage/role) + metric; no vague "we" | Content |
| 6 | Single voice: executive, calm, direct; tone pass | Content |
| 7 | Footer: LinkedIn primary; other social on About or remove | Design |
| 8 | One price anchor per offer; visible in Offer + Scale Readiness | Content |
| 9 | Snapshot: specific response window (e.g. 2–3 business days) | Content |
| 10 | About: one primary CTA (Snapshot); Back = secondary | Design |
| 11 | All images: meaningful alt text | Dev |
| 12 | No dev/TODO/REMOVED comments in production HTML | Dev |

---

## Cognitive Science Principles Applied

- **Fluency:** Reduce cognitive load—one primary action, consistent tone, no errors.
- **Authority:** Scarcity (limited capacity), specificity (metrics, context), one professional channel (LinkedIn).
- **Uncertainty reduction:** Clear next step, response-time commitment, price anchor.
- **Commitment/consistency:** Snapshot as single gate; "qualified → fit call" reinforces structure.
- **No choice overload:** Primary vs secondary CTAs; About supports one path (Snapshot).

---

---

## Pre-launch checklist (poka-yoke)

Before going live, confirm:

- [ ] No orphan copy or "I'm" / single-word `<p>` fragments on any page.
- [ ] **Snapshot CTA:** `snapshot.html` — "Start the Scale Readiness Snapshot" `href` is a real form URL (not `#snapshot-form`). If still placeholder, use a "Snapshot coming soon" state or collect email.
- [ ] Homepage footer: LinkedIn only (no Facebook/Twitter/YouTube on homepage).
- [ ] Every `<img>` has non-empty, descriptive `alt` (e.g. avatar: "Matt Cochran").
- [ ] Response-time commitment is consistent: Snapshot page and disqualification email both say "2 business days" (or your chosen window).
- [ ] One primary CTA per page; secondary actions are text links, not buttons.
- [ ] Price anchor visible in Offer (home) and Scale Readiness page.
- [ ] No `TODO`, `REMOVED`, or verbose dev comments in production HTML.

---

*End of FMECA + Poka-Yoke. Revisit when adding pages or changing CTAs.*
