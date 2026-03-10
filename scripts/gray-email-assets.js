/**
 * Gray email assets: recolor green/icons to neutral gray and generate circular headshots with gray background.
 * Run from repo root: cd scripts && npm install && node gray-email-assets.js
 * Output: icons in assets/images/email/ are overwritten with gray versions;
 *         Headshot-Circle-100x100.png, Headshot-Circle-150x150.png and the
 *         former "green circle" headshots are (re)generated from MC-headshot.png with gray background.
 */
const path = require('path');
const fs = require('fs');

const Jimp = require('jimp');

const GRAY = 0x5c5c5cff; // Jimp 0xRRGGBBAA - neutral gray
const GRAY_RGB = { r: 92, g: 92, b: 92 };

const EMAIL_IMAGES = path.join(__dirname, '..', 'assets', 'images', 'email');
const HEADSHOT_PATH = path.join(__dirname, '..', 'assets', 'images', 'MC-headshot.png');

const ICON_FILES = [
  'facebook-24.png', 'facebook-50.png',
  'link-12.png', 'linkedin-24.png', 'linkedin-50.png',
  'location-12.png', 'mail-12.png', 'phone-12.png',
  'twitter-24.png', 'twitter-50.png',
  'youtube-24.png', 'youtube-50.png',
];

function isColored(r, g, b) {
  const hasColor = Math.max(r, g, b) - Math.min(r, g, b) > 25;
  const notWhite = Math.max(r, g, b) < 250;
  const notBlack = Math.min(r, g, b) > 5;
  return hasColor && notWhite && notBlack;
}

function recolorToGray(image) {
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const r = image.bitmap.data[idx];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    const a = image.bitmap.data[idx + 3];
    if (a > 0 && isColored(r, g, b)) {
      image.bitmap.data[idx] = GRAY_RGB.r;
      image.bitmap.data[idx + 1] = GRAY_RGB.g;
      image.bitmap.data[idx + 2] = GRAY_RGB.b;
    }
  });
  return image;
}

function createCircularHeadshot(sourcePath, size, outPath) {
  return Jimp.read(sourcePath).then((src) => {
    const s = Math.min(src.bitmap.width, src.bitmap.height);
    const x0 = Math.floor((src.bitmap.width - s) / 2);
    const y0 = Math.floor((src.bitmap.height - s) / 2);
    src.crop(x0, y0, s, s).resize(size, size);

    const r = size / 2;
    const cx = r;
    const cy = r;

    src.scan(0, 0, size, size, (x, y) => {
      const dx = x - cx + 0.5;
      const dy = y - cy + 0.5;
      if (dx * dx + dy * dy > r * r) {
        src.setPixelColor(GRAY, x, y);
      }
    });

    return src.writeAsync(outPath);
  });
}

async function main() {
  const emailDir = EMAIL_IMAGES;
  if (!fs.existsSync(emailDir)) {
    console.error('Missing directory:', emailDir);
    process.exit(1);
  }

  console.log('Recoloring icons to gray...');
  for (const file of ICON_FILES) {
    const p = path.join(emailDir, file);
    if (!fs.existsSync(p)) {
      console.warn('Skip (not found):', file);
      continue;
    }
    const img = await Jimp.read(p);
    recolorToGray(img);
    await img.writeAsync(p);
    console.log('  OK', file);
  }

  if (!fs.existsSync(HEADSHOT_PATH)) {
    console.warn('Headshot not found:', HEADSHOT_PATH);
    return;
  }

  console.log('Creating circular headshots (gray background)...');
  await createCircularHeadshot(HEADSHOT_PATH, 100, path.join(emailDir, 'Headshot-Circle-100x100.png'));
  console.log('  OK Headshot-Circle-100x100.png');
  await createCircularHeadshot(HEADSHOT_PATH, 150, path.join(emailDir, 'Headshot-Circle-150x150.png'));
  console.log('  OK Headshot-Circle-150x150.png');

  await createCircularHeadshot(HEADSHOT_PATH, 100, path.join(emailDir, 'Headshot-green-circle-100x100.png'));
  console.log('  OK Headshot-green-circle-100x100.png (gray)');
  await createCircularHeadshot(HEADSHOT_PATH, 150, path.join(emailDir, 'Headshot-green-circle-150x150.png'));
  console.log('  OK Headshot-green-circle-150x150.png (gray)');

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
