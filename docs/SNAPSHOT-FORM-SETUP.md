# Scale Readiness Snapshot — Form Setup

The **Snapshot** is a short qualification questionnaire. The site’s “Start the Scale Readiness Snapshot” button currently has no live form behind it. You need to host the questionnaire somewhere and put its URL into `snapshot.html`.

---

## Option 1: Google Form (simplest)

1. Create a new form at [Google Forms](https://forms.google.com).
2. Add the questions below (required fields from your playbook).
3. Under **Settings** (gear): collect email addresses if you want to reply directly; optionally send responses to a Google Sheet and turn on email notifications for new responses.
4. Click **Send** → link icon → copy the form URL (e.g. `https://docs.google.com/forms/d/e/xxxx/viewform`).
5. In `snapshot.html`, replace the button’s `href` with that URL (and add `target="_blank" rel="noopener"` so it opens in a new tab).

**Suggested questions (Snapshot):**

- Stage (e.g. Pre-seed / Seed / Series A / Series B+)
- Engineering team size (e.g. 1–10 / 10–25 / 25–50 / 50+)
- Hiring plans in the next 6 months (e.g. None / 1–5 / 5–15 / 15+)
- Type of scaling friction (e.g. velocity drag, cross-team friction, architecture instability, roadmap confusion, fear of scaling wrong — multi-select or single)
- Decision authority (e.g. Yes, I have budget/authority / No / Shared with others)
- Budget intent within 60 days (e.g. Yes, we’re ready to engage within 60 days / Exploring only / Not sure)
- Optional: Company name, email (if not already collected), one short “What’s your biggest scaling concern?” text field

Keep it to ~3 minutes and “no trick questions” as on the page.

---

## Option 2: Typeform

Same idea: create a Typeform with the questions above, get the share link, and set the Snapshot button `href` to that link (with `target="_blank" rel="noopener"`).

---

## Option 3: Other form builders

Any form tool (Tally, Jotform, etc.) that gives you a public URL works. Use that URL as the button `href`.

---

## After you have the URL

In **snapshot.html**, find this line:

```html
<a href="#snapshot-form" id="snapshot-cta" class="c-hero-cta  t-social-button" ...>Start the Scale Readiness Snapshot</a>
```

Change it to:

```html
<a href="YOUR_FORM_URL_HERE" id="snapshot-cta" class="c-hero-cta  t-social-button" target="_blank" rel="noopener" style="...">Start the Scale Readiness Snapshot</a>
```

Replace `YOUR_FORM_URL_HERE` with your Google Form (or Typeform/etc.) link.
