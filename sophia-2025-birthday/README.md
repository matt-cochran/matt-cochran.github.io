# Birthday RSVP Landing Page

A magical, interactive birthday landing page for a 7th birthday party.

## Features
- ✨ AI-powered invitation text generation using Gemini.
- 📸 Photo gallery with Google Photos support.
- 📱 Dynamic QR code for easy RSVP scanning.
- 🎉 Fun interactive confetti and animations.

## How to Host on GitHub Pages

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   Upload the contents of the `dist/` folder to your GitHub repository's `gh-pages` branch. 

## ⚠️ Security Note
The Gemini API key is required for the "AI Magic Writer" feature. If you deploy this publicly, the key will be visible in the source code. It is recommended to use a restricted API key with budget limits if hosting on a public URL.