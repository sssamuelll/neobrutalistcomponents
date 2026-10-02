// Local visual review: screenshots of docs routes × themes × schemes.
//
//   npm run dev &                      (or npm run preview after a site build)
//   node scripts/screenshots.mjs [--base=http://localhost:5173/] [--routes=/,/blocks]
//                                [--themes=classic,tech] [--modes=native,dark] [--width=1440] [--full]
//                                [--selector='.site-band']   (shoot the first matching element only)
//
// Writes .screenshots/<route>__<theme>__<mode>.png (git-ignored).
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const base = arg('base', 'http://localhost:5173/');
const routes = arg('routes', '/,/components/button,/components/input,/themes,/blocks').split(',');
const themes = arg('themes', 'classic,tech,swiss,y2k,riso').split(',');
const modes = arg('modes', 'native,dark').split(',');
const width = Number(arg('width', '1440'));
const fullPage = process.argv.includes('--full');
const selector = arg('selector', '');

mkdirSync('.screenshots', { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

for (const route of routes) {
  for (const theme of themes) {
    for (const mode of modes) {
      const query = mode === 'native' ? `?theme=${theme}` : `?theme=${theme}&mode=${mode}`;
      await page.goto(`${base}${query}#${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => globalThis.document.fonts.ready);
      const name = `${route.replace(/\//g, '_') || '_'}__${theme}__${mode}`.replace(/^_+/, '') || 'home';
      if (selector) await page.locator(selector).first().screenshot({ path: `.screenshots/${name}.png` });
      else await page.screenshot({ path: `.screenshots/${name}.png`, fullPage });
      console.log(`shot ${name}`);
    }
  }
}
await browser.close();
if (errors.length) {
  console.error(`console errors:\n- ${[...new Set(errors)].join('\n- ')}`);
  process.exitCode = 1;
}
