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

// The Themes page previews the study's proof themes, each in its own island
// with its own shipped stylesheet (plan 2 moves them to the atlas).
test('themes page previews the four study themes with their own stylesheets', async ({ page }) => {
  await page.goto('?theme=classic#/themes');
  for (const id of ['maeusebunker', 'nakagin', 'sesc-pompeia', 'classifieds']) {
    await expect(page.locator(`section[aria-labelledby="theme-${id}"]`)).toBeVisible();
  }
  const button = page.locator('section[aria-labelledby="theme-nakagin"] .nbc-button--primary').first();
  const style = await button.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { border: cs.borderTopWidth, radius: cs.borderTopLeftRadius };
  });
  expect(style).toEqual({ border: '2px', radius: '999px' });
  await expect(page.locator('section[aria-labelledby="theme-nakagin"] [lang="ja"]')).toHaveText('中銀カプセルタワービル');
});

test('language routes: legacy addresses redirect, the switch keeps the page, html lang follows', async ({ page }) => {
  await page.goto('#/components/button');
  await expect(page).toHaveURL(/#\/en\/components\/button$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/#\/es\/components\/button$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByText('La documentación técnica de la librería está en inglés.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Componentes' })).toHaveAttribute('aria-current', 'page');
  // Addresses without a language now open in the one last used.
  await page.goto('#/start');
  await expect(page).toHaveURL(/#\/es\/start$/);
});

test('a legacy address redirects without a history entry: Back returns to the page before it', async ({ page }) => {
  await page.goto('#/en/library');
  await expect(page.locator('main h1')).toHaveText('Components that hold their shape.');
  await page.goto('#/blocks');
  await expect(page).toHaveURL(/#\/en\/blocks$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/en\/library$/);
  await expect(page.locator('main h1')).toHaveText('Components that hold their shape.');
});
