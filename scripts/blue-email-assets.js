/**
 * Blue email assets: recolor green icons to steel blue and generate circular headshots.
 * Run from repo root: cd scripts && npm install && node blue-email-assets.js
 * Output: icons in assets/images/email/ are overwritten with blue versions;
 *         Headshot-Circle-100x100.png, Headshot-Circle-150x150.png and the
 *         former "green circle" headshots are (re)generated from MC-headshot.png.
 */
const path = require('path');
const fs = require('fs');

const Jimp = require('jimp');

const STEEL_BLUE = 0x6b8caeff; // Jimp 0xRRGGBBAA
const STEEL_BLUE_RGB = { r: 107, g: 140, b: 174 };

const EMAIL_IMAGES = path.join(__dirname, '..', 'assets', 'images', 'email');
const HEADSHOT_PATH = path.join(__dirname, '..', 'assets', 'images', 'MC-headshot.png');

// Icons to recolor (green -> steel blue)
const ICON_FILES = [
  'facebook-24.png', 'facebook-50.png',
  'link-12.png', 'linkedin-24.png', 'linkedin-50.png',
  'location-12.png', 'mail-12.png', 'phone-12.png',
  'twitter-24.png', 'twitter-50.png',
  'youtube-24.png', 'youtube-50.png',
];

// Green detection: pixel is "green" if green channel dominates and has some saturation
function isGreenish(r, g, b) {
  const isGreenDominant = g > r && g > b;
  const hasColor = Math.max(r, g, b) - Math.min(r, g, b) > 30;
  return isGreenDominant && g > 60 && hasColor;
}

function recolorGreenToBlue(image) {
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const r = image.bitmap.data[idx];
    const g = image.bitmap.data[idx + 1];
    const b = image.bitmap.data[idx + 2];
    const a = image.bitmap.data[idx + 3];
    if (a > 0 && isGreenish(r, g, b)) {
      image.bitmap.data[idx] = STEEL_BLUE_RGB.r;
      image.bitmap.data[idx + 1] = STEEL_BLUE_RGB.g;
      image.bitmap.data[idx + 2] = STEEL_BLUE_RGB.b;
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
        src.setPixelColor(STEEL_BLUE, x, y);
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

  console.log('Recoloring icons (green -> steel blue)...');
  for (const file of ICON_FILES) {
    const p = path.join(emailDir, file);
    if (!fs.existsSync(p)) {
      console.warn('Skip (not found):', file);
      continue;
    }
    const img = await Jimp.read(p);
    recolorGreenToBlue(img);
    await img.writeAsync(p);
    console.log('  OK', file);
  }

  if (!fs.existsSync(HEADSHOT_PATH)) {
    console.warn('Headshot not found:', HEADSHOT_PATH);
    return;
  }

  console.log('Creating circular headshots (steel blue background)...');
  await createCircularHeadshot(HEADSHOT_PATH, 100, path.join(emailDir, 'Headshot-Circle-100x100.png'));
  console.log('  OK Headshot-Circle-100x100.png');
  await createCircularHeadshot(HEADSHOT_PATH, 150, path.join(emailDir, 'Headshot-Circle-150x150.png'));
  console.log('  OK Headshot-Circle-150x150.png');

  // Replace green-circle assets with blue versions (same filenames so existing refs keep working)
  await createCircularHeadshot(HEADSHOT_PATH, 100, path.join(emailDir, 'Headshot-green-circle-100x100.png'));
  console.log('  OK Headshot-green-circle-100x100.png (now blue)');
  await createCircularHeadshot(HEADSHOT_PATH, 150, path.join(emailDir, 'Headshot-green-circle-150x150.png'));
  console.log('  OK Headshot-green-circle-150x150.png (now blue)');

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
