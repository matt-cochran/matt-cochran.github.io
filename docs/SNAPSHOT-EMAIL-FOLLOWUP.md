# Snapshot email capture and autoresponder

For visitors who **don’t** get the calendar (manual review or disqualified), the Snapshot can show an optional email form so you can follow up later. This doc explains where that email goes and how to set up an autoresponder.

## Where the email is submitted

- **Config:** `src/lib/snapshotConfig.ts` → `followUpFormEndpoint`.
- **Behavior:** When `followUpFormEndpoint` is set (non-empty), the manual-review and disqualified result panels each show a small form: “Want a follow-up? Leave your email.” (or “Get notified when you’re further along:”) with an email input and “Notify me”.
- **On submit:** The page POSTs **JSON** to `followUpFormEndpoint`: `firstName`, `email`, and `message: { Subject: "Snapshot follow-up", Outcome: "manual_review" | "disqualified" }`. **Content-Type:** `application/json`. Form fields: Name and Email (both required, with validation).
- **Current endpoint:** n8n webhook test — `https://matt-cochran.app.n8n.cloud/webhook-test/send-email`. Change to your production webhook URL in config when ready.

If `followUpFormEndpoint` is empty, the follow-up form is not shown.

## n8n webhook (current)

Payload shape sent to the webhook:

```json
{
  "firstName": "Jane",
  "email": "jane@example.com",
  "message": { "Subject": "Snapshot follow-up", "Outcome": "manual_review" }
}
```

`Outcome` is `manual_review` or `disqualified`. After testing, set `followUpFormEndpoint` in `src/lib/snapshotConfig.ts` to your production URL and rebuild.

## Setting the endpoint (Formspree example)

1. Create a form at [Formspree](https://formspree.io) and get the form URL, e.g. `https://formspree.io/f/xxxxxxxx`.
2. In `src/lib/snapshotConfig.ts`, set:
   ```ts
   followUpFormEndpoint: 'https://formspree.io/f/xxxxxxxx',
   ```
3. Rebuild. Submissions will appear in Formspree and you’ll receive email notifications (unless you turn them off).

You can use any endpoint that accepts a POST with `email` and `outcome` (e.g. Netlify Forms, Zapier webhook, your own API).

## Google Sheet (no Formspree/Zapier — just a Google account)

You can send submissions straight to a **Google Sheet** using a small **Google Apps Script** web app. No Formspree, no Zapier — only your Google account. (A Sheet is better than a Doc for a list of emails; you can copy from the Sheet into a Doc anytime.)

1. **Create a Google Sheet** (e.g. "Snapshot follow-ups"). In row 1 add headers: `Timestamp` | `Email` | `Outcome`.
2. **Extensions → Apps Script**. Replace the default code with:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = e.parameter || {};
  var email = params.email || '';
  var outcome = params.outcome || '';
  if (email) {
    sheet.appendRow([new Date(), email, outcome]);
    // Optional: send autoresponder
    try {
      MailApp.sendEmail(email, 'We got your note', 'Thanks for your interest. We\'ll be in touch when we have capacity.');
    } catch (err) {}
  }
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}
```

3. **Deploy:** Deploy → New deployment → Type: **Web app**. Set "Execute as" to **Me**, "Who has access" to **Anyone** (so your site can POST). Deploy and copy the **Web app URL**.
4. In `src/lib/snapshotConfig.ts`, set:
   ```ts
   followUpFormEndpoint: 'https://script.google.com/macros/s/xxxxxxxx/exec',
   ```
   (Use your copied URL; it must end with `/exec`.)
5. Rebuild. Submissions will append as rows; the optional `MailApp.sendEmail` sends an immediate "we got it" reply. Remove the `try { … } catch` block if you don't want the autoresponder.

## Autoresponder (immediate “we got it” reply)

**Option A — Formspree built-in**

1. In Formspree: open your form → **Respond** (or **Settings** → **Notifications**).
2. Enable **Auto-respond** and set the message (e.g. “Thanks for your interest. We’ll be in touch when we have capacity.”).
3. Formspree sends that reply to the submitter’s email automatically.

**Option B — Zapier / Make**

1. Use the same Formspree form (or a webhook) as the trigger.
2. Add a step: “Send email” (Gmail, SendGrid, etc.) to the email from the trigger payload.
3. Use a template like: “Thanks for leaving your email. We’ll follow up when it makes sense.”

**Option C — CRM / email tool**

If submissions go to a CRM or tool that supports “send email on new contact,” configure an autoresponder there using the captured `email` field.

## Summary

| What | Where |
|------|--------|
| Turn email form on/off | `followUpFormEndpoint` in `src/lib/snapshotConfig.ts` |
| Where emails are sent | The URL you set (Formspree, Google Apps Script web app, etc.) |
| Zero-infrastructure option | Google Sheet + Apps Script web app (see above); optional autoresponder in the script |
| Autoresponder | Formspree auto-respond, MailApp in Apps Script, or Zapier/Make/CRM “send email” after the form submits |
