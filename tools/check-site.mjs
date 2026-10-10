import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { projects } from '../src/data/projects.js';
import { screens, phones } from '../src/data/blues.js';
import { vvScreens } from '../src/data/vitalview-screens.js';
import { profile } from '../src/data/profile.js';

const basePath = process.env.SITE_BASE || '/';
const url = process.env.CHECK_URL || `http://127.0.0.1:4174${basePath}`;
const asset = path => new URL(`${basePath}${path.replace(/^\//, '')}`, url).pathname;
let server, browser;
const errors = [], failures = [];
try {
  if (!process.env.CHECK_URL) {
    server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], {stdio: 'pipe', windowsHide: true});
    let serverError = '';
    server.stderr.on('data', data => { serverError += data; });
    server.on('error', error => { serverError += error.message; });
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (server.exitCode !== null || serverError.includes('EPERM')) throw new Error(`Preview failed: ${serverError}`);
      try { ready = (await fetch(url)).ok; } catch {}
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, 'Production preview did not start');
  }
  browser = await chromium.launch({headless: true, executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined});
  const context = await browser.newContext({viewport: {width: 1440, height: 1000}, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write']});
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  // React reports hydration mismatches (server HTML ≠ first client render) as console errors
  page.on('console', message => { if (message.type() === 'error' && /hydrat/i.test(message.text())) errors.push(message.text()); });
  page.on('response', response => { if (new URL(response.url()).origin === new URL(url).origin && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  page.on('dialog', async dialog => { errors.push(`Unexpected dialog: ${dialog.message()}`); await dialog.dismiss(); });
  await fs.mkdir('test-results', {recursive: true});

  // Recruiter tools and AI screeners read the raw HTML without running JavaScript
  const rawText = (await (await fetch(url)).text()).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  for (const text of [...projects.map(p => p.shortName), '18 modules', '600 features', 'Event Coordinator', 'Dean’s List', 'Coursework', profile.email]) {
    assert.ok(rawText.includes(text), `Pre-rendered HTML is missing "${text}"`);
  }
  const noJs = await browser.newContext({viewport: {width: 1440, height: 1000}, javaScriptEnabled: false});
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(url);
  for (const selector of ['#blues h4', '#about h2', '#experience li']) assert.ok(await noJsPage.locator(selector).first().isVisible(), `${selector} is visible without JavaScript`);
  assert.equal(await noJsPage.locator('#blues .story-change').evaluate(el => getComputedStyle(el).opacity), '1', 'Animated content is shown without JavaScript');
  await noJs.close();

  await page.goto(url);
  await page.locator('#hero-title').waitFor();
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 4000))]));
  assert.match(await page.title(), /Hakan Alex Kucukhuseyin/);
  assert.deepEqual(await page.locator('#work article.project').evaluateAll(els => els.map(el => el.id)), projects.map(p => p.id));
  assert.equal(await page.locator('.work-index a').count(), 5);
  assert.equal(await page.locator('.entry-play').count(), 0, 'Reduced motion disables rotation');
  assert.match(await page.locator('#blues .story-result').innerText(), /18 modules/);
  assert.match(await page.locator('#vitalview').innerText(), /600 features/);
  assert.match(await page.locator('#about').innerText(), /June 2028/);
  assert.match(await page.locator('#about').innerText(), /3.6 GPA/);
  assert.equal(await page.locator('#contact a[href^="mailto:"]').getAttribute('href'), `mailto:${profile.email}`);
  assert.equal(await page.locator('#contact a[href="https://github.com/HakanAlex-K"]').count(), 1);
  const structuredData = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  assert.equal(structuredData.name, profile.name);
  assert.equal(structuredData.email, `mailto:${profile.email}`);
  const socialUrl = await page.locator('meta[property="og:image"]').getAttribute('content');
  assert.equal(new URL(socialUrl, url).pathname, asset('/img/social-card.png'));
  assert.ok((await context.request.get(new URL(new URL(socialUrl, url).pathname, url).href)).ok(), 'Social card loads');

  const featured = projects.filter(p => p.featured !== false);
  for (let i = 0; i < featured.length; i++) {
    await page.locator(`#entry-tab-${i}`).click();
    await page.waitForFunction(i => document.querySelector(`#entry-tab-${i}`).getAttribute('aria-selected') === 'true', i);
    // The outgoing card stays mounted until its exit finishes, so wait for the swap
    await page.waitForFunction(src => [...document.querySelectorAll('.deck-card.is-front img')].map(img => img.getAttribute('src')).join() === src, asset(featured[i].src), {timeout: 3000}).catch(() => {});
    assert.equal(await page.locator('.deck-card.is-front img').getAttribute('src'), asset(featured[i].src));
  }
  await page.locator('#entry-tab-3').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#entry-tab-0').getAttribute('aria-selected'), 'true');

  const lightbox = async (selector, expected) => {
    await page.locator(selector).focus();
    await page.keyboard.press('Enter');
    await page.locator('.lightbox').waitFor();
    assert.equal(await page.locator('.lightbox img').getAttribute('src'), asset(expected));
    assert.equal(await page.evaluate(() => document.activeElement.className), 'lightbox-close');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'lightbox-close');
    await page.keyboard.press('Escape');
    await page.locator('.lightbox').waitFor({state: 'detached'});
    await page.waitForFunction(selector => document.activeElement === document.querySelector(selector), selector);
  };
  for (const [id, items] of [['blues', screens], ['vv', vvScreens]]) {
    for (let i = 0; i < items.length; i++) {
      await page.locator(`#${id}-tab-${i}`).click();
      await page.waitForFunction(({id, expected}) => document.querySelector(`#${id}-panel img`)?.getAttribute('src') === expected, {id, expected: asset(items[i].src)});
      const response = await context.request.get(new URL(asset(items[i].src), url).href);
      assert.ok(response.ok());
      if (items[i].full) await lightbox(`#${id}-panel img`, items[i].full);
    }
    await page.locator(`#${id}-tab-0`).focus();
    await page.keyboard.press('End');
    assert.equal(await page.locator(`#${id}-tab-${items.length - 1}`).getAttribute('aria-selected'), 'true');
  }
  await page.getByRole('button', {name: 'Mobile screens', exact: true}).click();
  await page.locator('#blues-panel .phones').waitFor();
  assert.equal(await page.locator('#blues-panel .phone').count(), phones.length);
  for (const [id, expected] of [['drexel-tsa', '/img/tsa-full.webp'], ['university-rankings', projects[3].src], ['hack-computer', projects[4].src]]) await lightbox(`#${id} img[role="button"]`, expected);
  for (const id of ['blues', 'drexel-tsa', 'university-rankings']) {
    await page.locator(`#${id} summary`).click();
    assert.equal(await page.locator(`#${id} details`).getAttribute('open'), '');
  }
  for (const i of [0, 1, 2, 3, 4]) {
    if (await page.locator(`#xp-trigger-${i}`).getAttribute('aria-expanded') !== 'true') await page.locator(`#xp-trigger-${i}`).click();
    assert.equal(await page.locator(`#xp-trigger-${i}`).getAttribute('aria-expanded'), 'true');
  }
  for (const [query, target] of [['experience', 'experience'], ['Hack Computer', 'hack-computer'], ['rankings', 'university-rankings']]) {
    await page.locator('.kbd-btn').click();
    await page.locator('.cmdk input').fill(query);
    assert.equal(await page.locator('.cmdk-item').count(), 1);
    await page.keyboard.press('Enter');
    await page.locator('.cmdk').waitFor({state: 'detached'});
    await page.waitForFunction(target => {
      const rect = document.getElementById(target).getBoundingClientRect();
      return rect.top >= -10 && rect.top < innerHeight * 0.6;
    }, target);
  }
  await page.locator('#contact button').click();
  await page.waitForFunction(() => document.querySelector('#contact button').textContent.includes('Copied!'));
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), profile.email);
  const pdfResponse = await context.request.get(new URL(asset(profile.links.resume), url).href);
  assert.equal(pdfResponse.status(), 200);
  assert.match(pdfResponse.headers()['content-type'], /application\/pdf/);
  const pdfBytes = await pdfResponse.body();
  assert.equal(pdfBytes.subarray(0, 5).toString(), '%PDF-');
  assert.ok(pdfBytes.equals(await fs.readFile('public/resume.pdf')), 'Published resume equals the supplied PDF');
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({width, height: 900});
    await page.evaluate(async () => {
      for (const img of document.images) img.loading = 'eager';
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
      for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(requestAnimationFrame); }
      scrollTo(0, 0);
    });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false, `No horizontal overflow at ${width}px`);
    assert.deepEqual(await page.locator('img').evaluateAll(imgs => imgs.filter(img => !img.naturalWidth).map(img => img.src)), []);
    if (width === 1440 || width === 390) {
      await page.screenshot({path: `test-results/site-${width}.png`, fullPage: true});
      await page.screenshot({path: `test-results/hero-${width}.png`});
    }
  }
  await page.setViewportSize({width: 390, height: 844});
  await page.locator('#menu-toggle').click();
  await page.locator('#mobile-menu a[href="#work"]').click();
  await page.locator('#mobile-menu').waitFor({state: 'detached'});
  assert.equal(new URL(page.url()).hash, '#work');
  await page.locator('#menu-toggle').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'menu-toggle');
  await page.setViewportSize({width: 1440, height: 1000});
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto(url);
  await page.locator('.entry-play').click();
  assert.equal(await page.locator('.entry-play').getAttribute('aria-pressed'), 'false');
  await page.locator('#entry-tab-0').click();
  await page.mouse.move(1, 995);
  await page.waitForTimeout(6500);
  assert.equal(await page.locator('#entry-tab-0').getAttribute('aria-selected'), 'true', 'Explicit pause holds the hero');
  await page.locator('.entry-play').click();
  await page.locator('.entry-play').blur();
  await page.mouse.move(1, 995);
  await page.waitForFunction(() => document.querySelector('#entry-tab-1').getAttribute('aria-selected') === 'true', null, {timeout: 9000});
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  await fs.writeFile('test-results/checks.json', JSON.stringify({passed: true, basePath, projects: projects.map(p => p.id), widths: [1440, 1024, 768, 390, 320], errors, failures}, null, 2));
  console.log(`PASS: pre-rendered HTML, no-JS view, hydration, résumé alignment, 5 projects, 5 widths, images, PDF, keyboard controls, navigation, clipboard, motion, metadata; base ${basePath}`);
} finally {
  await browser?.close();
  server?.kill();
}
