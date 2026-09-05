import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const expected = JSON.parse(await readFile('src/data/original-home-checklist.json', 'utf8'));
const origin = process.env.POIEMA_REVIEW_ORIGIN || 'http://127.0.0.1:4321';
const headers = {};
if (origin.includes('review.poiemaretreats.org')) {
  const key = (await readFile('.dev.vars.review', 'utf8')).trim().split('=')[1];
  headers.Cookie = `poiema_review=${key}`;
}
const response = await fetch(origin, { headers });
assert.equal(response.status, 200);
const html = await response.text();
const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
assert.ok(main, 'Missing main content');
const plain = s => s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const missing = expected.filter(text => !plain(main).includes(text));
assert.deepEqual(missing, [], 'Original copy is missing');
assert.equal((main.match(/<section\b/g) || []).length, 8, 'Original section count');
assert.equal((main.match(/<blockquote\b/g) || []).length, 5, 'All testimonials');
assert.equal((main.match(/<a\b[^>]*class="[^"]*\bbtn\b/g) || []).length, 6, 'All original CTA buttons');
assert.equal((main.match(/<img\b/g) || []).length, 6, 'All homepage images');
console.log(`PASS: ${expected.length} original text blocks, 8 sections, 5 testimonials, 6 buttons, 6 images`);
