/**
 * Brand assets: favicon variants and the Open Graph share card.
 * Run from repo root: cd scripts && npm install && node brand-assets.js
 * Output: public/favicon-32.png, public/apple-touch-icon.png, public/og-image.png
 */
const path = require('path');
const fs = require('fs');

const Jimp = require('jimp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const HEADSHOT_PATH = path.join(PUBLIC_DIR, 'assets', 'images', 'MC-headshot.png');

// Matches --color-text-headline / --color-surface in src/styles/global.css.
const INK = 0x162536ff;

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

async function centeredText(image, font, text, centerX, y) {
  const width = Jimp.measureText(font, text);
  image.print(font, Math.round(centerX - width / 2), y, text);
}

// Sized so the 128px monogram fills most of the tile before downscaling.
const MONOGRAM_CANVAS = 232;

async function buildMonogram(size, outPath) {
  const canvas = new Jimp(MONOGRAM_CANVAS, MONOGRAM_CANVAS, INK);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
  const height = Jimp.measureTextHeight(font, 'MC', MONOGRAM_CANVAS);
  await centeredText(canvas, font, 'MC', MONOGRAM_CANVAS / 2, Math.round((MONOGRAM_CANVAS - height) / 2));
  await canvas.resize(size, size).writeAsync(outPath);
}

async function buildShareCard(outPath) {
  const canvas = new Jimp(OG_WIDTH, OG_HEIGHT, INK);

  const portraitWidth = 460;
  const headshot = await Jimp.read(HEADSHOT_PATH);
  const targetRatio = portraitWidth / OG_HEIGHT;
  const srcRatio = headshot.bitmap.width / headshot.bitmap.height;
  let cropW;
  let cropH;
  if (srcRatio > targetRatio) {
    cropH = headshot.bitmap.height;
    cropW = Math.floor(cropH * targetRatio);
  } else {
    cropW = headshot.bitmap.width;
    cropH = Math.floor(cropW / targetRatio);
  }
  headshot
    .crop(
      Math.floor((headshot.bitmap.width - cropW) / 2),
      Math.floor((headshot.bitmap.height - cropH) * 0.1),
      cropW,
      cropH,
    )
    .resize(portraitWidth, OG_HEIGHT);
  canvas.composite(headshot, OG_WIDTH - portraitWidth, 0);

  const nameFont = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  const lineFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  canvas.print(nameFont, 72, 232, 'Matthew Cochran');
  canvas.print(lineFont, 72, 320, 'Product and engineering leadership');
  canvas.print(lineFont, 72, 362, 'Governed AI systems');

  await canvas.writeAsync(outPath);
}

async function main() {
  if (!fs.existsSync(HEADSHOT_PATH)) {
    console.error('Headshot not found:', HEADSHOT_PATH);
    process.exit(1);
  }

  await buildMonogram(32, path.join(PUBLIC_DIR, 'favicon-32.png'));
  console.log('  OK favicon-32.png');
  await buildMonogram(180, path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('  OK apple-touch-icon.png');
  await buildShareCard(path.join(PUBLIC_DIR, 'og-image.png'));
  console.log('  OK og-image.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
