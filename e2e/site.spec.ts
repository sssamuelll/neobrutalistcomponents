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

test('the site can run in a study theme: ?theme=nakagin loads its stylesheet and the switcher shows it', async ({ page }) => {
  await page.goto('?theme=nakagin#/en/library');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'nakagin');
  const radius = await page.locator('main .nbc-button--primary').first().evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  expect(radius).toBe('999px');
  await expect(page.getByRole('button', { name: 'Nakagin' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'More themes' }).click();
  await expect(page).toHaveURL(/#\/en\/atlas$/);
});

test('an unknown ?theme falls back to classic', async ({ page }) => {
  await page.goto('?theme=nope#/en/library');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'classic');
});

test('a site-wide study theme whose stylesheet cannot load falls back to classic', async ({ page }) => {
  let requested = false;
  await page.route(/\/assets\/nakagin-[\w-]+\.css$/, (route) => {
    requested = true;
    return route.abort();
  });
  await page.goto('?theme=nakagin#/en/library');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'classic');
  await expect(page.locator('main h1')).toHaveText('Components that hold their shape.');
  expect(requested, 'the site tried to load the stylesheet').toBe(true);
});

test('atlas: every theme as a card; facets and search live in the URL', async ({ page }) => {
  await page.goto('#/en/atlas');
  await expect(page.locator('.site-card')).toHaveCount(9);
  await page.getByLabel('Scene').selectOption('japan');
  await expect(page).toHaveURL(/#\/en\/atlas\?scene=japan$/);
  await expect(page.locator('.site-card')).toHaveCount(3);
  await page.getByLabel('Search').fill('中銀');
  await expect(page.locator('.site-card')).toHaveCount(1);
  await expect(page.locator('.site-card h3')).toHaveText('Nakagin');
  await page.reload();
  await expect(page.getByLabel('Search')).toHaveValue('中銀');
  await expect(page.locator('.site-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page).toHaveURL(/#\/en\/atlas$/);
  await expect(page.locator('.site-card')).toHaveCount(9);
});

test('atlas: typing replaces the address instead of stacking history, so Back leaves the atlas', async ({ page }) => {
  await page.goto('#/en/library');
  await page.goto('#/en/atlas');
  await page.getByLabel('Search').pressSequentially('naka');
  await expect(page).toHaveURL(/#\/en\/atlas\?q=naka$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/en\/library$/);
});

test('atlas: switching language keeps the filters', async ({ page }) => {
  await page.goto('#/es/atlas?scene=japan&q=riso');
  await expect(page.locator('.site-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/#\/en\/atlas\?scene=japan&q=riso$/);
  await expect(page.locator('.site-card h3')).toHaveText(['Riso']);
});

test('atlas cards paint with their own tokens without fetching any study stylesheet', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  await page.goto('#/en/atlas');
  const card = page.locator('[data-theme="sesc-pompeia"] .site-card');
  await expect(card).toBeVisible();
  expect(await card.evaluate((el) => getComputedStyle(el).borderTopColor)).toBe('rgb(27, 26, 25)');
  expect(requested.filter((url) => /\/(nakagin|maeusebunker|sesc-pompeia|classifieds)-[\w-]+\.css/.test(url))).toEqual([]);
});

