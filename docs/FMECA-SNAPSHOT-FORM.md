# FMECA: Scale Readiness Snapshot Form — Completion Prevention

Failure Modes, Effects, and Criticality Analysis for barriers that prevent users from completing the Snapshot, with motivation theory, cognitive science, and UX research grounding. Poka-yoke remediations are implemented in the codebase.

---

## 1. Abandonment Before Starting

| Item | Detail |
|------|--------|
| **Failure mode** | User leaves without answering any question. |
| **Causes** | Unclear value/effort trade-off; anxiety about being “assessed” or rejected; perceived length (6 questions). |
| **Theory** | Expectancy–value (Eccles & Wigfield): completion likelihood ∝ expectancy of success × perceived value. Ambiguity about “what happens if I don’t qualify” lowers value. Loss aversion (Kahneman) amplifies fear of rejection. |
| **Effect** | Zero completions from this segment. |
| **Criticality** | High (likelihood medium for high-status users who are loss-averse). |
| **Poka-yoke** | Intro copy sets expectation (“~3 min”, “fit before we offer a call”); microcopy on form: “Select the option that best describes your situation. No trick questions.” Reduces overthinking and signals low stakes. |

---

## 2. Abandonment Mid-Form (Decision Fatigue / Cognitive Load)

| Item | Detail |
|------|--------|
| **Failure mode** | User starts then drops off before submit. |
| **Causes** | No sense of progress; decision fatigue (Baumeister); choice overload (Schwartz); high cognitive load (6 × N options). |
| **Theory** | Goal-gradient: visible progress increases completion (Hull). Zeigarnik: unresolved tasks create tension; a progress indicator reduces perceived “open loop.” Cognitive load (Sweller): too many visible choices at once increases load. |
| **Effect** | Partial completions; no submission. |
| **Criticality** | High. |
| **Poka-yoke** | **Progress indicator**: “3 of 6 answered” (or progress bar). Updated on each selection so the user sees closure approaching. |

---

## 3. Submit Blocked by Validation — User Doesn’t Know What’s Missing

| Item | Detail |
|------|--------|
| **Failure mode** | User clicks Submit with one or more questions unanswered; validation blocks submit; user cannot easily see which question(s) to fix. |
| **Causes** | `reportValidity()` focuses first invalid control, which may be off-screen; no per-field error text; no count of missing answers. |
| **Theory** | Late validation (on submit only) increases perceived failure and “form is broken” (Baymard, Nielsen). Inline or per-field validation reduces abandonment. |
| **Effect** | User retries blindly or abandons. |
| **Criticality** | Critical. |
| **Poka-yoke** | **(1)** On submit: mark every unanswered fieldset with `aria-invalid="true"` and visible “Please select one.” **(2)** Scroll to first invalid fieldset and focus first radio. **(3)** Optional: “2 of 6 questions need an answer” so the user knows how many to fix. **(4)** Inline feedback: when a question is answered, remove invalid state (so re-submit shows only remaining gaps). |

---

## 4. Confusion About “Right” Answer (Overthinking / Gaming)

| Item | Detail |
|------|--------|
| **Failure mode** | User hesitates or abandons because they’re unsure which option is “correct” or try to game the assessment. |
| **Causes** | Ambiguous labels (e.g. “Shared” vs “Primary”); high-stakes perception; no reassurance. |
| **Theory** | Choice architecture (Thaler): framing and default-like cues reduce hesitation. Explicit “no right answer” reduces evaluation anxiety. |
| **Effect** | Slower completion or drop-off. |
| **Criticality** | Medium. |
| **Poka-yoke** | Microcopy: “Select the option that best describes your situation. No trick questions—we use this only to determine fit.” |

---

## 5. Technical Failure (Script Not Running)

| Item | Detail |
|------|--------|
| **Failure mode** | Form appears but nothing happens on submit (e.g. JS blocked, failed to load). |
| **Causes** | Ad blockers, strict CSP, network failure, script error. |
| **Effect** | User believes form is broken; no path to complete. |
| **Criticality** | Medium (low likelihood but high severity when it occurs). |
| **Poka-yoke** | **Noscript**: message that the Snapshot requires JavaScript and an alternative (e.g. email link). Form submit remains `preventDefault()` in script; if script never runs, fallback message is visible with `<noscript>`. |

---

## 6. Submit Button Not Found or Not Actionable

| Item | Detail |
|------|--------|
| **Failure mode** | User never reaches Submit (below fold on small screens) or doesn’t realize the form is submittable. |
| **Causes** | Long form; Submit at bottom; no “you’re done” cue. |
| **Theory** | Visibility and affordance (Norman): primary action must be discoverable and clearly actionable. |
| **Effect** | No submission. |
| **Criticality** | Medium on mobile. |
| **Poka-yoke** | Progress text implies “answer all to submit”; ensure Submit is in tab order and has clear label; after validation fix, scroll so Submit is visible. Optional: sticky/fixed “Submit” bar on narrow viewports (not implemented in v1 to keep UI minimal). |

---

## 7. Result Not Seen (Belief That Nothing Happened)

| Item | Detail |
|------|--------|
| **Failure mode** | After submit, result is rendered but user doesn’t see it (e.g. scroll position, or screen reader doesn’t announce). |
| **Causes** | `scrollIntoView({ block: 'nearest' })` may not scroll enough; result region not focused; no live region announcement. |
| **Theory** | Feedback (Norman): system must show clear, visible feedback for every user action. |
| **Effect** | User thinks submit failed; may resubmit or leave. |
| **Criticality** | High. |
| **Poka-yoke** | **(1)** `scrollIntoView({ block: 'start' })` so result enters viewport. **(2)** Result container has `tabindex="-1"` and receives `focus()` after show so keyboard and screen reader land on outcome. **(3)** `aria-live="polite"` and `role="status"` already present; ensure result text is in DOM when shown so it’s announced. |

---

## 8. Double-Submit / Accidental Refresh

| Item | Detail |
|------|--------|
| **Failure mode** | User clicks Submit twice or refreshes; ambiguous state or duplicate submissions. |
| **Causes** | No loading state; button remains clickable. |
| **Effect** | Confusion; possible duplicate data if backend added later. |
| **Criticality** | Medium. |
| **Poka-yoke** | **Disable submit** after first valid submit; set `aria-busy="true"` and button text to “Submitting…” (or show spinner) until result is shown, then hide button or keep disabled. |

---

## 9. Radio Touch Target Too Small or Unresponsive

| Item | Detail |
|------|--------|
| **Failure mode** | On touch devices, tap doesn’t select option (target too small or label not associated). |
| **Causes** | Small clickable area; label not wrapping control. |
| **Theory** | WCAG 2.5.5 Target Size (AAA); minimum ~44×44 px reduces mis-taps. |
| **Effect** | Perceived broken control; abandonment. |
| **Criticality** | Medium on mobile. |
| **Poka-yoke** | Entire option is a `<label>` wrapping the radio; ensure min-height 44px and full-width tap target; `cursor: pointer`. |

---

## 10. Unclear Which Question Has an Error (Multi-Field Validation)

| Item | Detail |
|------|--------|
| **Failure mode** | When several questions are unanswered, user only sees focus on first; others have no visible error. |
| **Causes** | Single focus from `reportValidity()`; no per-fieldset error messaging. |
| **Effect** | User fixes one, submits again, gets blocked again; frustration. |
| **Criticality** | Critical. |
| **Poka-yoke** | **Mark all** invalid fieldsets: same treatment for every unanswered question (aria-invalid + “Please select one” + optional icon). Scroll to first invalid and focus first radio; user can then tab through and see each invalid fieldset. |

---

## Summary: Poka-Yoke Implemented

| # | Remediation | Where |
|---|-------------|--------|
| 1 | Progress indicator (“X of 6 answered”) | Component + script |
| 2 | Per-fieldset validation state + “Please select one” | Component + script |
| 3 | Scroll to first error + focus first invalid radio | Script |
| 4 | Submit disabled + “Submitting…” after click | Component + script |
| 5 | Result: scroll into view (block: start) + focus result region | Script |
| 6 | Microcopy: “Select the option that best describes…” + “No trick questions” | Component |
| 7 | Noscript message + contact fallback | Component |
| 8 | Min touch target 44px on option labels | CSS / component |
| 9 | Clear invalid state when user answers (so only remaining gaps show on re-submit) | Script |
| 10 | Respect `prefers-reduced-motion` for scroll (smooth vs auto) | Script |

---

*Doc generated for poka-yoke implementation. Update this FMECA if new failure modes are discovered or thresholds change.*
