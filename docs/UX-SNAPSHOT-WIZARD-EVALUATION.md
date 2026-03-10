# UX evaluation: Select-then-Next vs auto-advance

How a professional UX engineer would evaluate the wizard interaction (select option → click Next vs auto-advance on selection).

---

## The question

Is “select an option, then click Next” the best UX, or should the form advance automatically when the user selects a radio?

---

## Tradeoffs

### Select + explicit Next (current baseline)

| Pros | Cons |
|------|------|
| **User control** — Clear confirmation; user decides when to move on. Aligns with WCAG principle of predictable, user-driven behavior. | **Extra action per step** — 6 additional clicks (one per question). More friction. |
| **Error recovery** — User can review choice before advancing; Back is a natural “undo.” | **Slower completion** — Especially on mobile, extra tap per step. |
| **Familiar** — Matches traditional forms and “wizard” patterns; low cognitive surprise. | **Goal-gradient** — More steps can reduce perceived progress (though we have “Step X of 6”). |
| **Accessibility** — No change of context on selection; screen reader users aren’t rushed. | |

### Auto-advance on selection

| Pros | Cons |
|------|------|
| **Fewer actions** — One tap/click per question. Reduces friction and supports completion (Hick’s Law, reduced effort). | **Accidental advance** — Mis-tap can move forward before user is ready; requires Back. |
| **Faster flow** — Feels “smooth” and modern (Typeform, many survey tools). | **Perceived loss of control** — Some users (e.g. executives, careful readers) prefer explicit confirmation. |
| **Mobile-friendly** — One tap per step is ideal on touch devices. | **A11y risk** — Advancing immediately can cut off “selected” announcement or feel disorienting; a short delay helps. |
| **Goal-gradient** — Quick transitions can reinforce “almost done” feeling. | **WCAG 3.2.2** — Change of context on input is allowed if expected; we should make the behavior obvious (e.g. microcopy). |

---

## How a UX engineer would evaluate

1. **Audience and context**  
   For a high-stakes, selective assessment (executives, decision-makers), both patterns are defensible: explicit Next signals seriousness and control; auto-advance respects time and reduces drop-off. The best choice is the one that matches your users’ expectations and your own metrics (completion rate, time on form, support/feedback).

2. **Prefer reducing friction when possible**  
   Research and practice (e.g. Baymard, Nielsen, survey-tool benchmarks) generally favor fewer steps and fewer clicks for completion. So **auto-advance is often the preferred default**, with safeguards.

3. **Safeguards for auto-advance**  
   - **Short delay (e.g. 300–500 ms)** before advancing so the user (and assistive tech) registers the selection and isn’t surprised.  
   - **Keep Next (and Back)** so users can still advance or go back without relying on auto-advance.  
   - **Clear microcopy** (e.g. “Choose one to continue”) so change-on-selection is expected (WCAG 3.2.2).  
   - **Respect reduced motion** — use minimal or no transition when `prefers-reduced-motion: reduce`.

4. **Accessibility**  
   - Do **not** advance on **focus** (WCAG 3.2.1); advance only on **selection** (click or keyboard Select).  
   - Short delay before advance gives screen reader users time to hear the selection.  
   - Next/Back remain available for users who prefer explicit control.

5. **Recommendation**  
   **Default: auto-advance on selection with a short delay**, with **Next** (and Back) kept as fallback. This balances lower friction and faster flow with control and accessibility. If you observe anxiety or errors in your audience, you can switch to “Next only” or make auto-advance a user preference.

---

## Implementation in this codebase

- **Auto-advance:** On `change` (radio selected), after clearing validation state, schedule `setStep(currentStep + 1)` with a short delay (e.g. 400 ms). On the last step, do not auto-advance; user clicks “See results.”  
- **Next button:** Still visible and functional; users can click Next immediately instead of waiting for the delay.  
- **Delay:** Configurable (e.g. 400 ms); set to 0 or disable if you prefer “Next only.”  
- **Reduced motion:** When `prefers-reduced-motion: reduce`, use 0 ms delay so there’s no perceived “pause” before advance.

---

## Testing auto-advance

Auto-advance is triggered from **change**, **input**, and **click** (capture) on the form so it works when the user selects via mouse, keyboard, or assistive tech. In some headless or automation environments, inline scripts or timers may not run as in a normal browser.

**To verify in a real browser:** Open `/snapshot`, select any option (e.g. "Series A"); after ~400 ms the next question should appear. You can also click **Next** at any time. **Back** returns to the previous question.
