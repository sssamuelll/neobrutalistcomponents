import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { NEO_THEMES } from '../src/lib/themes';
import { SLUGS } from '../src/docs/slugs';
import { CONTRAST_PAIRS } from '../src/lib/themes/contract';
import { CATALOG } from '../src/study/.generated/catalog';
import { SCENES, THEME_SCENES } from '../src/study/types';

const STUDY_ROUTES = ['/en/', '/en/scenes', '/en/scene/japan', '/en/origins', '/en/atlas', '/en/method', '/en/credits'];
const DOC_ROUTES = ['/en/library', '/en/components', '/en/blocks', '/en/start', '/en/agents', ...SLUGS.map((slug) => `/en/components/${slug}`)];
const ROUTES = [...STUDY_ROUTES, ...DOC_ROUTES];

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

  test(`${theme} dark scheme: study, library and blocks pass axe`, async ({ page }) => {
    for (const route of ['/en/', '/en/library', '/en/blocks']) {
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

// The same regression for study themes: their stylesheets are separate assets,
// minified on their own, so check one resolves too (Nakagin: 2px, hard shadow).
test('production CSS keeps a study theme\'s token colors: border, shadow and ground resolve', async ({ page }) => {
  await page.goto('?theme=classic&mode=light#/en/theme/nakagin');
  const button = page.locator('.site-themepage .nbc-button--primary').first();
  await expect(button).toBeVisible();
  const style = await button.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { border: cs.borderTopWidth, shadow: cs.boxShadow };
  });
  expect(style.border).toBe('2px');
  expect(style.shadow).toMatch(/5px 5px 0px/);
  const ground = await page.locator('.site-themepage').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(ground).toBe('rgb(217, 216, 211)');
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
  await expect(page.locator('.site-card')).toHaveCount(CATALOG.length);
  await page.getByLabel('Scene').selectOption('japan');
  await expect(page).toHaveURL(/#\/en\/atlas\?scene=japan$/);
  await expect(page.locator('.site-card')).toHaveCount(3);
  await page.getByLabel('Search').fill('中銀');
  await expect(page.locator('.site-card')).toHaveCount(1);
  await expect(page.locator('.site-card h2')).toHaveText('Nakagin');
  await page.reload();
  await expect(page.getByLabel('Search')).toHaveValue('中銀');
  await expect(page.locator('.site-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page).toHaveURL(/#\/en\/atlas$/);
  await expect(page.locator('.site-card')).toHaveCount(CATALOG.length);
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
  await expect(page.locator('.site-card h2')).toHaveText(['Riso']);
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


// Every theme of the catalog, with its native scheme (study plan 2: five core + four proof themes).
const THEME_PAGES: [id: string, native: 'light' | 'dark'][] = [
  ['classic', 'light'],
  ['tech', 'dark'],
  ['swiss', 'light'],
  ['y2k', 'light'],
  ['riso', 'light'],
  ['maeusebunker', 'dark'],
  ['nakagin', 'light'],
  ['sesc-pompeia', 'light'],
  ['classifieds', 'light'],
];

THEME_PAGES.forEach(([id, native], index) => {
  const lang = index % 2 ? 'es' : 'en';
  for (const scheme of [native, native === 'dark' ? 'light' : 'dark']) {
    test(`theme page ${id} (${lang}, ${scheme}) renders cleanly and passes axe`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`?theme=classic&mode=${scheme}#/${lang}/theme/${id}`);
      await expect(page.locator('.site-themepage h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
      expect(summary, 'axe violations').toEqual([]);
      expect(errors).toEqual([]);
    });
  }
});

test('theme page: a study theme renders in its own stylesheet, fetched only for it', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  await page.goto('#/en/atlas');
  await page.getByRole('link', { name: 'Nakagin' }).click();
  await expect(page).toHaveURL(/#\/en\/theme\/nakagin$/);
  await expect(page.locator('main h1')).toHaveText('Nakagin');
  await expect(page.locator('main [lang="ja"]').first()).toHaveText('中銀カプセルタワービル');
  const image = page.locator('.site-themepage__figure img');
  await expect(image).toHaveAttribute('loading', 'lazy');
  await expect(image).toHaveAttribute('width', /^\d+$/);
  await expect(image).toHaveAttribute('height', /^\d+$/);
  const radius = await page.locator('.site-themepage .nbc-button--primary').first().evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  expect(radius).toBe('999px');
  expect(requested.filter((url) => /\/nakagin-[\w-]+\.css/.test(url))).toHaveLength(1);
  expect(requested.filter((url) => /\/(maeusebunker|sesc-pompeia|classifieds)-[\w-]+\.css/.test(url))).toEqual([]);
});

test('theme page: the theme’s stylesheet is downloaded once; its token tables read data the page already has', async ({ page }) => {
  // Every response that carries Nakagin's token block, whatever its type: the
  // <link>'s CSS, or a JS chunk holding the same stylesheet as text.
  const carriers: Promise<string | null>[] = [];
  page.on('response', (response) => {
    carriers.push(
      response.text().then(
        (body) => (/\[data-theme=["']?nakagin["']?\]\s*\{/.test(body) ? new URL(response.url()).pathname : null),
        () => null,
      ),
    );
  });
  await page.goto('?theme=classic&mode=light#/en/theme/nakagin');
  const tokens = page.getByRole('table', { name: 'Color tokens, light scheme' });
  await expect(tokens.getByRole('row', { name: /--nbc-bg\b/ })).toContainText('#d9d8d3');
  // An ink the compiler picks itself ('auto'): the light ink on the dark primary.
  await expect(tokens.getByRole('row', { name: /--nbc-primary-fg\b/ })).toContainText('#ecebe6');
  await page.waitForLoadState('networkidle');
  const sheets = (await Promise.all(carriers)).filter((path) => path !== null);
  expect(sheets, 'downloads of the theme’s stylesheet').toHaveLength(1);
  expect(sheets[0]).toMatch(/\/nakagin-[\w-]+\.css$/);
});

test('theme page: use across the site applies the theme and survives a reload', async ({ page }) => {
  await page.goto('?theme=classic#/en/theme/sesc-pompeia');
  await page.getByRole('button', { name: 'Use across the site' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sesc-pompeia');
  await expect(page.getByRole('button', { name: 'In use across the site' })).toBeDisabled();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'sesc-pompeia');
});

test('theme page: mode flips a study theme both ways', async ({ page }) => {
  await page.goto('?theme=classic&mode=dark#/en/theme/nakagin');
  await expect(page.locator('main h1')).toBeVisible();
  expect(await page.locator('.site-themepage').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(22, 24, 27)');
  await page.goto('?theme=classic&mode=light#/en/theme/maeusebunker');
  await expect(page.locator('main h1')).toBeVisible();
  expect(await page.locator('.site-themepage').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(207, 204, 197)');
});

test('theme page: a long one-word name stays on one line on a desktop', async ({ page }) => {
  await page.goto('#/en/theme/maeusebunker');
  const title = page.locator('.site-themepage h1');
  await expect(title).toHaveText('Mäusebunker');
  const { height, fontSize } = await title.evaluate((el) => ({
    height: el.getBoundingClientRect().height,
    fontSize: parseFloat(getComputedStyle(el).fontSize),
  }));
  expect(height).toBeLessThan(fontSize * 1.5);
});

test('theme page: a reference title that ends in a parenthesis takes its original inside it', async ({ page }) => {
  await page.goto('#/es/theme/maeusebunker');
  const reference = page.locator('.site-band__facts dd').first();
  await expect(reference.locator('span[lang="de"]')).toHaveText('Zentrale Tierlaboratorien der Freien Universität Berlin');
  await expect(reference).not.toContainText(') (');
});

test('theme page: core themes say they predate the study; unknown ids are not found', async ({ page }) => {
  await page.goto('#/es/theme/tech');
  await expect(page.locator('.site-themepage__note')).toHaveText(/^Este tema es anterior al estudio/);
  await expect(page.getByRole('img', { name: /VT100/ })).toBeVisible();
  await page.goto('#/en/theme/nope');
  await expect(page.locator('main h1')).toHaveText('Nothing at this address');
});


test('theme page: when its data cannot load, it says so in an alert and links back to the atlas in its language', async ({ page }) => {
  await page.route(/\/assets\/sesc-pompeia-[\w-]+\.js$/, (route) => route.abort());
  await page.goto('#/es/theme/sesc-pompeia');
  await expect(page.getByRole('alert')).toContainText('No se pudo cargar este tema.');
  await page.getByRole('link', { name: 'Volver al atlas' }).click();
  await expect(page).toHaveURL(/#\/es\/atlas$/);
});

test('study home: the essay, then the gallery, one work per theme in date order, each linking to its room', async ({ page }) => {
  await page.goto('#/es/');
  await expect(page.locator('main h1')).toHaveText('La Galería de las Interfaces');
  await expect(page).toHaveTitle('La Galería — neobrutalistcomponents');
  await expect(page.locator('.study-essay__text h2').first()).toHaveText('De dónde viene el nombre');
  await expect(page.locator('.gallery-work')).toHaveCount(CATALOG.length);
  await page.locator('.gallery-work', { hasText: 'Nakagin' }).getByRole('link', { name: 'Japón' }).click();
  await expect(page).toHaveURL(/#\/es\/scene\/japan$/);
});

test('rooms: a world map with its legend, then each room lists its references in date order with their themes', async ({ page }) => {
  await page.goto('#/en/scenes');
  await expect(page.locator('main h1')).toHaveText('Rooms');
  await expect(page.locator('.world-map__legend tbody tr')).toHaveCount(SCENES.length);
  await expect(page.locator('.world-map__room')).toHaveCount(THEME_SCENES.length);
  await page.locator('.world-map__room[data-scene="italy"] .world-map__label text').first().click();
  await expect(page).toHaveURL(/#\/en\/scene\/italy$/);
  await page.goto('#/en/scenes');
  await page.locator('.world-map__legend').getByRole('link', { name: 'Japan' }).click();
  await expect(page).toHaveURL(/#\/en\/scene\/japan$/);
  await expect(page).toHaveTitle('Japan — neobrutalistcomponents');
  await expect(page.locator('.study-timeline__year')).toHaveText(['1970', '1980', '1996']);
  await expect(page.locator('.study-timeline .site-card h3')).toHaveText(['Nakagin', 'Riso', 'Y2K']);
  await expect(page.locator('nav .study-scenes__card')).toHaveCount(SCENES.length - 1);
  await page.goto('#/en/origins');
  await expect(page.locator('.study-essay__text h2').first()).toHaveText('Béton brut');
  await expect(page.locator('.study-timeline .site-card h3')).toHaveText(['Classic', 'Swiss']);
});

test('rooms: a focused legend row keeps its text and focus ring readable on the plate', async ({ page }) => {
  for (const theme of ['classic', 'tech', 'whaam']) {
    await page.goto(`?theme=${theme}#/en/scenes`);
    await page.locator('.world-map__legend').getByRole('link', { name: 'Japan' }).focus();
    const results = await new AxeBuilder({ page }).include('.world-map').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.map((v) => `${theme} ${v.id}`)).toEqual([]);
  }
});

test('rooms: map labels show only when the map is wide enough to read them', async ({ page }) => {
  for (const [width, visible] of [[1280, true], [768, false], [360, false]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('#/en/scenes');
    const label = page.locator('.world-map__room[data-scene="usa"] .world-map__label');
    if (visible) await expect(label, `${width} px`).toBeVisible();
    else await expect(label, `${width} px`).toBeHidden();
  }
});

test('a study page whose essay cannot load says so instead of staying blank', async ({ page }) => {
  await page.route(/\/assets\/en-[\w-]+\.js$/, (route) => route.abort());
  await page.goto('#/en/origins');
  await expect(page.getByRole('alert')).toContainText('This content could not load.');
  await expect(page.locator('.study-scenes__card')).toHaveCount(SCENES.length - 1);
});

test('method: the essay, the detail families from their own metadata and the contrast contract', async ({ page }) => {
  await page.goto('#/en/method');
  await expect(page.locator('main h1')).toHaveText('Method');
  await expect(page.locator('.study-essay__text h2').first()).toHaveText('One work per theme');
  await expect(page.locator('.study-family h3')).toHaveText(['concrete', 'grid']);
  await expect(page.locator('table[aria-labelledby="method-contract"] tbody tr')).toHaveCount(CONTRAST_PAIRS.length);
});

test('credits: every photograph and every typeface, each with its licence', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  await page.goto('#/es/credits');
  await expect(page.locator('main h1')).toHaveText('Créditos');
  const photographs = page.locator('table[aria-labelledby="credits-photographs"] tbody tr');
  await expect(photographs).toHaveCount(CATALOG.filter((entry) => entry.image).length);
  await expect(photographs.filter({ hasText: 'Nakagin' })).toContainText('CC BY-SA 4.0');
  const fonts = page.locator('table[aria-labelledby="credits-fonts"] tbody tr');
  await expect(fonts).toHaveCount(new Set(CATALOG.flatMap((entry) => entry.fonts)).size);
  await expect(fonts.filter({ hasText: 'Geist Mono' })).toContainText('Classic, Tech');
  // The credits come from the catalog: no theme's data chunk is fetched for them.
  expect(requested.filter((url) => /\/assets\/(nakagin|maeusebunker|sesc-pompeia|classifieds|core-fichas)-[\w-]+\.js$/.test(url))).toEqual([]);
});

// The study's main pages and the library's, in both languages, at desktop
// width and on a phone: they render, pass axe (heading order included: no
// level skipped), log no errors and never scroll sideways.
const MAIN_PAGES = [
  '/',
  '/scenes',
  '/scene/japan',
  '/scene/germany',
  '/scene/usa',
  '/scene/latam',
  '/scene/italy',
  '/origins',
  '/atlas',
  '/method',
  '/credits',
  '/library',
  '/components',
  '/blocks',
  '/start',
  '/agents',
];
for (const width of [1280, 360]) {
  test.describe(`main pages at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const lang of ['es', 'en']) {
      for (const path of MAIN_PAGES) {
        test(`#/${lang}${path}`, async ({ page }) => {
          const errors: string[] = [];
          page.on('pageerror', (e) => errors.push(e.message));
          await page.goto(`?theme=classic#/${lang}${path}`);
          await expect(page.locator('main h1').first()).toBeVisible();
          await expect(page.locator('html')).toHaveAttribute('lang', lang);
          await expect(page.locator('main [aria-busy="true"], main [role="status"]')).toHaveCount(0);
          await page.evaluate(() => document.fonts.ready);
          const results = await new AxeBuilder({ page })
            .options({ rules: { 'heading-order': { enabled: true } } })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze();
          const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
          expect(summary, 'axe violations').toEqual([]);
          expect(errors).toEqual([]);
          expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        });
      }
    }
  });
}

test.describe('theme and component pages at 360px', () => {
  test.use({ viewport: { width: 360, height: 800 } });
  // Spanish strings run longer than English ones: the study pages are checked in Spanish.
  const STUDY_PAGES = CATALOG.filter((entry) => !entry.predatesStudy).map((entry) => `#/es/theme/${entry.id}`);
  for (const hash of ['#/es/theme/tech', '#/en/theme/maeusebunker', '#/en/components/button', ...STUDY_PAGES]) {
    test(`${hash} passes axe and never scrolls sideways`, async ({ page }) => {
      await page.goto(`?theme=classic${hash}`);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('main [role="status"]')).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
      expect(summary, 'axe violations').toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    });
  }
});

/** Study themes with a motion file, read from disk (the registry needs Vite). */
const MOTION_THEMES = readdirSync(fileURLToPath(new URL('../src/study/themes', import.meta.url)), { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.motion.css'))
  .map((file) => file.split(/[\\/]/).pop()!.replace(/\.motion\.css$/, ''));

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test.describe(`a theme's motion under prefers-reduced-motion: ${reducedMotion}`, () => {
    test.use({ reducedMotion });
    for (const id of MOTION_THEMES) {
      test(`${id}: ${reducedMotion === 'reduce' ? 'nothing in its specimen moves' : 'its motion reaches the specimen'}`, async ({ page }) => {
        await page.goto(`?theme=classic#/en/theme/${id}`);
        await expect(page.locator('main h1')).toBeVisible();
        await expect(page.locator('main [role="status"]')).toHaveCount(0);
        const specimen = page.locator('.site-themepage__motion');
        // What the specimen shows moving right now: the theme's own keyframes, or any transition longer than 1 ms.
        const moving = () =>
          specimen.evaluate((root, theme) => {
            const traces: string[] = [];
            for (const node of [root, ...root.querySelectorAll('*')]) {
              const style = getComputedStyle(node);
              if (style.animationName.includes(`nbc-${theme}-motion-`)) traces.push(`animation ${style.animationName}`);
              if (style.transitionDuration.split(',').some((d) => parseFloat(d) > 0.001)) traces.push(`transition ${style.transitionProperty} ${style.transitionDuration}`);
            }
            return traces;
          }, id);
        const traces: string[] = [];
        await specimen.getByRole('button', { name: 'Press' }).focus(); // focus opens the tooltip at once
        traces.push(...(await moving()));
        await specimen.getByRole('switch', { name: 'Switch' }).click();
        traces.push(...(await moving()));
        await specimen.getByRole('button', { name: 'Open dialog' }).click();
        traces.push(...(await moving()));
        if (reducedMotion === 'reduce') expect(traces).toEqual([]);
        else expect(traces.length, 'the motion file animates nothing the specimen shows').toBeGreaterThan(0);
      });
    }
  });
}
