import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
const images = {
  'poiema-obx': '.migration/wp-content/uploads/2026/04/DA2A3277_Original-scaled.jpg',
  'poiema-poland': '.migration/wp-content/uploads/2026/03/Polandpromo.jpeg',
  'poiema-media': '.migration/wp-content/uploads/2024/03/174A9400.jpg',
  'poiema-donate': '.migration/wp-content/uploads/2021/03/DEC0D9C5-FB06-49A0-B71D-F927050B3543.jpeg',
};
for (const [name, path] of Object.entries(images)) {
  let bytes;
  try { bytes = await readFile(path); }
  catch {
    const response = await fetch('https://poiemaretreats.org/' + path.replace('.migration/', ''));
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    bytes = Buffer.from(await response.arrayBuffer());
  }
  await sharp(bytes).rotate().resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 90 }).toFile(`public/images/${name}.webp`);
}
