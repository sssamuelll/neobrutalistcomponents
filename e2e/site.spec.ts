import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { NEO_THEMES } from '../src/lib/themes';
import { SLUGS } from '../src/docs/slugs';

const ROUTES = ['/', '/components', '/themes', '/blocks', '/start', '/agents', ...SLUGS.map((slug) => `/components/${slug}`)];

for (const theme of NEO_THEMES) {
  test.describe(`theme ${theme}`, () => {
    for (const route of ROUTES) {
      test(`${route} renders cleanly and passes axe`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(e.message));
        page.on('console', (m) => {
          if (m.type() === 'error') errors.push(m.text());
        });
        await page.goto(`?theme=${theme}#${route}`);
        await expect(page.locator('main h1').first()).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
        expect(summary, 'axe violations').toEqual([]);
        expect(errors.filter((e) => !e.includes('fonts.g')), 'console errors').toEqual([]);
      });
    }
  });

  test(`${theme} dark scheme: home and blocks pass axe`, async ({ page }) => {
    for (const route of ['/', '/blocks']) {
      await page.goto(`?theme=${theme}&mode=dark#${route}`);
      await expect(page.locator('main h1').first()).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
      expect(results.violations.map((v) => v.id), `${route} dark`).toEqual([]);
    }
  });
}

// Regression: a production CSS build once lowered light-dark() into variables
// nothing switched on, so every token color was invalid (no borders, white page).
// axe could not see it; these computed-style checks can.
test('production CSS keeps token colors: borders, shadows and page color resolve', async ({ page }) => {
  await page.goto('?theme=classic#/');
  const button = page.locator('main .nbc-button--primary').first();
  await expect(button).toBeVisible();
  const style = await button.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { border: cs.borderTopWidth, shadow: cs.boxShadow };
  });
  expect(style.border).toBe('3px');
  expect(style.shadow).not.toBe('none');
  const bg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  expect(bg).toBe('rgb(231, 230, 225)');
});
