# Email Signature — Design Review (Professional / Luxury / High-Value)

## What’s working

- **Name treatment:** "Matthew" / "COCHRAN" (lowercase + uppercase, steel blue) matches the site and reads as intentional, not generic.
- **Information order:** Name → title → LinkedIn → contact → address → handwritten signature is logical and builds authority.
- **Handwritten signature:** Adds a personal, confident close; size and placement support a high-touch brand.
- **Rounded headshot + light border:** Feels polished without being loud.
- **Minimal palette:** Gray + steel blue + black/white reads calm and executive.

---

## Issues that undercut professional/luxury positioning

### 1. **Headshot size**
- **Issue:** At 188×250px the portrait dominates and can read “sales” or “real estate” rather than “senior advisor.”
- **Recommendation:** Reduce to ~150px width (height scales) so the **name and credentials** lead. The block still reads “you” but doesn’t overpower the message.

### 2. **Green LinkedIn icon**
- **Issue:** Default green reads consumer/social; it fights the steel blue, executive positioning.
- **Recommendation:** Use the steel blue LinkedIn asset from `blue-email-assets.js` and deploy it so the icon matches the site. Until then, the signature will feel less cohesive and less premium.

### 3. **Typography and density**
- **Issue:** 11px for title and contact is small; with tight spacing it can feel cramped and less “high value.”
- **Recommendation:** Bump title and contact to 12px; add a bit more vertical spacing between sections (e.g. after title, before contact) so the block breathes and reads more premium.

### 4. **Link color weight**
- **Issue:** #6b8cae is correct for the site but can feel a bit light in email; lighter links can read “generic template.”
- **Recommendation:** Use a slightly deeper steel blue (e.g. #5a7a9a or site’s `--color-primary-dark` #4a6582) for links so they feel more anchored and confident.

### 5. **Font choice**
- **Issue:** Arial/Helvetica is safe but generic; luxury brands often use a serif or a more distinctive sans.
- **Constraint:** Email clients limit fonts; system stacks are safest. Within that, the current stack is fine; the bigger levers are size, spacing, and color above.

---

## Summary

| Area        | Risk for high-value brand     | Fix (in signature or process)        |
|------------|--------------------------------|--------------------------------------|
| Headshot   | Too large, dominates           | Reduce to ~150px width               |
| LinkedIn   | Green = casual                 | Deploy steel blue icon asset          |
| Type size  | 11px feels cramped             | 12px for title + contact              |
| Spacing    | Tight = less premium           | Slightly more vertical rhythm        |
| Link color | Slightly light                 | Deeper steel blue for links          |

After these tweaks, the signature will better support a professional, luxury, high-value brand.
