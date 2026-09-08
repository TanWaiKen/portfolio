// Asset encoding only. Artwork was created with the built-in image generation tool.
const path = require('node:path');
const sharp = require(process.env.CODEX_NODE_MODULES ? path.join(process.env.CODEX_NODE_MODULES, 'sharp') : 'sharp');
async function run() {
  await sharp('public/art/guide-original.png').resize({ width: 480 }).webp({ quality: 86 }).toFile('public/art/guide.webp');
  await sharp('public/art/landscape-original.png').resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 88 }).toFile('public/art/landscape.webp');
  console.log('Website art encoded as WebP. Original generated PNGs preserved.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
