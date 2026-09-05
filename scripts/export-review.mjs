import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';

// A private static review snapshot, not a replacement for the EmDash deployment.
const origin = 'http://127.0.0.1:4321';
const vars = Object.fromEntries((await readFile('.dev.vars', 'utf8')).trim().split('\n').map(line => line.split('=')));
const routes = ['/', '/about', '/contact', '/funding', '/retreats', '/articles', '/media'];
await mkdir('.artifacts/review/assets', { recursive: true });
await cp('dist/client', '.artifacts/review/assets', { recursive: true });
for (const route of routes) {
  const response = await fetch(origin + route, { headers: { Cookie: `poiema_preview=${vars.DESIGN_PREVIEW_KEY}` } });
  if (!response.ok) throw new Error(`${route}: ${response.status}`);
  const html = await response.text();
  if (!html.includes('</html>')) throw new Error(`Invalid HTML at ${route}`);
  const folder = '.artifacts/review/assets' + (route === '/' ? '' : route);
  await mkdir(folder, { recursive: true });
  await writeFile(folder + '/index.html', html);
  console.log(`Exported ${route}`);
}
