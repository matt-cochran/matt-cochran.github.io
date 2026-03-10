# Email assets scripts

## Blue email assets

Recolors green email icons to steel blue (`#6B8CAE`) and generates circular profile headshots from `assets/images/MC-headshot.png`.

**Run (from repo root):**

```bash
cd scripts && npm install && node blue-email-assets.js
```

**What it does:**

- **Icons:** Overwrites these files in `assets/images/email/` with blue versions:  
  `facebook-24.png`, `facebook-50.png`, `link-12.png`, `linkedin-24.png`, `linkedin-50.png`,  
  `location-12.png`, `mail-12.png`, `phone-12.png`, `twitter-24.png`, `twitter-50.png`,  
  `youtube-24.png`, `youtube-50.png`
- **Circular headshots:** Creates/overwrites from `MC-headshot.png`:  
  `Headshot-Circle-100x100.png`, `Headshot-Circle-150x150.png`,  
  `Headshot-green-circle-100x100.png`, `Headshot-green-circle-150x150.png` (now with steel blue background)

**Note:** `mc-signature.png` and `Headshot-Circle-100x109.png` are left unchanged (signature stays black; 100×109 is a different aspect and can be edited separately if needed).

## Gray email assets

Same as blue, but icons and circular headshot background use neutral gray (`#5c5c5c`) for a more understated look.

**Run (from repo root):**

```bash
cd scripts && npm install && node gray-email-assets.js
```

Or: `npm run gray-assets` from the `scripts/` directory.

Use with the HTML signature in `email-templates/signature.html` (copy into Gmail/Outlook; images must be hosted at cochranweb.com).
