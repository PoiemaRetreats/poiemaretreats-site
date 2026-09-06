const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const origin = process.env.POIEMA_REVIEW_ORIGIN || 'http://127.0.0.1:4321';
    const url = new URL('/about/', origin);
    if (url.hostname !== '127.0.0.1') {
      url.searchParams.set('key', readFileSync('.dev.vars.review', 'utf8').match(/DESIGN_PREVIEW_KEY\s*=\s*["']?([^\s"']+)/)[1]);
    }
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url.toString());
    await page.locator('.opening-photo').evaluate(image => image.decode());
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForFunction(() => document.querySelector('.site-header').getBoundingClientRect().bottom <= 1);
    await page.screenshot({ path: '.artifacts/screenshots/header-mobile-hidden.png' });
    await page.evaluate(() => window.scrollBy(0, -1));
    await page.waitForFunction(() => document.querySelector('.site-header').getBoundingClientRect().top >= -1);
    assert.ok(await page.evaluate(() => window.scrollY > 600));
    await page.screenshot({ path: '.artifacts/screenshots/header-mobile-revealed.png' });
    await page.locator('.menu-toggle').click();
    await page.evaluate(() => window.scrollBy(0, 200));
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('.site-header').evaluate(el => el.classList.contains('is-scroll-hidden')), false);
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(() => { document.activeElement.blur(); window.scrollBy(0, 200); });
    assert.equal(await page.locator('.site-header').evaluate(el => getComputedStyle(el).transform), 'none');
    await page.screenshot({ path: '.artifacts/screenshots/header-desktop.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.site-header').evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    assert.deepEqual(errors, []);
    console.log('PASS mobile hide, one-pixel upward reveal below top, open menu, desktop unchanged, reduced motion.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
