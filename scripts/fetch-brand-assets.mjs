import fs from 'node:fs/promises';
import sharp from 'sharp';
const assets = { 'poiema-gathering': 'DA2A4259.jpg', 'poiema-fellowship': 'DA2A2030.jpg' };
await fs.mkdir('public/images', { recursive: true });
for (const [name, file] of Object.entries(assets)) {
  const response = await fetch(`https://poiemaretreats.org/wp-content/uploads/2024/03/${file}`);
  if (!response.ok) throw new Error(`${file}: ${response.status}`);
  await sharp(Buffer.from(await response.arrayBuffer())).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 84 }).toFile(`public/images/${name}.webp`);
}
