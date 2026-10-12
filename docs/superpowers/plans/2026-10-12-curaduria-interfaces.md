# Curating the gallery to graphical interfaces — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The gallery shows only the 14 graphical interfaces plus the house's 5 core themes; the 15 retired study themes leave the site and stay in the package, deprecated, until 2.0.

**Architecture:** One list (`src/study/retired.ts`) marks the retired ids. The build stamps `deprecated: true` on their catalog entries and a deprecation banner on their stylesheets; the site's `data.ts` filters them out, and rooms open only where works remain (`OPEN_SCENES`). Essays are rewritten for the new object of study through the dossier protocol.

**Tech Stack:** TypeScript, React 19, Vite, Vitest, Playwright. Build scripts in `scripts/*.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-12-curaduria-interfaces-design.md`

## Global Constraints

- Retired (15): `bauhaus-dessau`, `maeusebunker`, `nakagin`, `sesc-pompeia`, `carlton`, `lettera-22`, `din-1451`, `munich-72`, `tokyo-1964`, `caracas-signage`, `create-two-three-many-vietnams`, `loteria`, `whaam` (reason `not-an-interface`); `dragon-quest`, `super-mario-bros` (reason `video-game`).
- Stays (14, scene `usa`): `xerox-star`, `atari-gem`, `amiga-os`, `nextstep`, `mac-os-classic`, `win31`, `win95`, `classifieds`, `palm-os`, `beos`, `aqua`, `win-xp`, `iphone-os`, `material-design`. The 5 core themes stay in scene `origins`, displayed as «La casa» / «The house».
- Retired stylesheets open with `/* Deprecated in 1.4.0, removed in 2.0.0: <reason>.`
- The 15 theme files and their images are **not edited or deleted** in this plan (2.0 does that).
- Scene ids, routes and the `Scene` type stay; no room without works is ever shown.
- Commit and PR text: what changed and the technical why, in English; no AI attribution lines; no audience, intent or process narrative (owner's global rule).
- Essay copy is the site's voice: drafts are shown to the owner before commit. Every historical claim cites a source; sources are paraphrased, never quoted; ≥2 sources, ≥1 outside Wikipedia.
- Before starting: `feat/home-monumento` is merged to main and this branch is rebased onto main (spec §4.4).

## Review Focus

1. A returning visitor whose saved preference is a retired theme (`localStorage` or `?theme=nakagin`): the site must fall back to its default theme, never a blank or broken page. → Task 2, Step 1 (`loader` test).
2. A bookmarked room URL (`#/en/scene/japan`) or retired work URL (`#/en/theme/nakagin`): the not-found page, not an empty room. → Task 2 (router test) and Task 3 (e2e).
3. The atlas with a stale filter (`#/en/atlas?scene=japan`): an empty result set with the normal empty state, no crash, and the scene select offers only open rooms. → Task 3 (e2e).
4. A package user importing `themes/loteria.css` in 1.4: it still works and its first line says it is deprecated. → Task 1 (`check-package`).
5. An agent reading `llms.txt`: retired themes appear only under "Retired study themes", never in the recommendation tables. → Task 5.

---

### Task 1: The retired list, the `deprecated` flag and the stylesheet banner

**Files:**
- Create: `src/study/retired.ts`
- Create: `src/study/retired.test.ts`
- Modify: `src/study/catalog.ts` (`CatalogEntry`, `studyEntry`, `coreEntry`, `renderPackageModule` d.ts)
- Modify: `src/study/catalog.test.ts`
- Modify: `src/study/build.ts` (re-export)
- Modify: `scripts/build-study.mjs` (banner)
- Modify: `scripts/check-package.mjs` (banner check)

**Interfaces:**
- Produces: `RETIRED: Readonly<Record<string, RetiredReason>>`, `RetiredReason = 'not-an-interface' | 'video-game'`, `RETIRED_REASONS: Record<RetiredReason, string>`, `isRetired(id: string): boolean`, `retiredBanner(id: string): string`; `CatalogEntry.deprecated: boolean`.

- [ ] **Step 1: Write the failing tests**

`src/study/retired.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { STUDY_THEMES } from './registry';
import { RETIRED, isRetired, retiredBanner } from './retired';
import { CATALOG } from './.generated/catalog';

describe('retired study themes', () => {
  it('are exactly the fifteen works the curation retired', () => {
    expect(Object.keys(RETIRED).sort()).toEqual(
      [
        'bauhaus-dessau', 'caracas-signage', 'carlton', 'create-two-three-many-vietnams', 'din-1451',
        'dragon-quest', 'lettera-22', 'loteria', 'maeusebunker', 'munich-72', 'nakagin',
        'sesc-pompeia', 'super-mario-bros', 'tokyo-1964', 'whaam',
      ],
    );
    expect(RETIRED['dragon-quest']).toBe('video-game');
    expect(RETIRED['super-mario-bros']).toBe('video-game');
    expect(RETIRED.loteria).toBe('not-an-interface');
  });

  it('name only registered study themes', () => {
    const registered = new Set(STUDY_THEMES.map(({ theme }) => theme.id));
    for (const id of Object.keys(RETIRED)) expect(registered.has(id), id).toBe(true);
  });

  it('are the deprecated entries of the generated catalog, and only they', () => {
    expect(CATALOG.filter((entry) => entry.deprecated).map((entry) => entry.id).sort()).toEqual(Object.keys(RETIRED).sort());
    expect(CATALOG.filter((entry) => entry.predatesStudy).every((entry) => !entry.deprecated)).toBe(true);
  });

  it('give a banner that says when they go and why', () => {
    expect(isRetired('loteria')).toBe(true);
    expect(isRetired('xerox-star')).toBe(false);
    expect(retiredBanner('loteria')).toBe(
      'Deprecated in 1.4.0, removed in 2.0.0: the gallery keeps only graphical interfaces, and this work is not one.',
    );
    expect(retiredBanner('dragon-quest')).toMatch(/^Deprecated in 1\.4\.0, removed in 2\.0\.0: .*video games.*\.$/);
  });
});
```

In `src/study/catalog.test.ts`, add to the `describe('catalog')` block:

```ts
  it('marks a study theme deprecated only when it is retired', () => {
    expect(entry.deprecated).toBe(false);
    expect(load(renderPackageModule([{ ...entry, deprecated: true }]).js)[0].deprecated).toBe(true);
    expect(renderPackageModule([entry]).dts).toContain('readonly deprecated: boolean;');
  });
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- src/study/retired.test.ts src/study/catalog.test.ts`
Expected: FAIL — `Cannot find module './retired'`, and `entry.deprecated` is `undefined`.

- [ ] **Step 3: Implement**

`src/study/retired.ts`:

```ts
/**
 * Study themes retired from the gallery, which keeps only graphical interfaces
 * (docs/superpowers/specs/2026-10-12-curaduria-interfaces-design.md). They ship
 * in the package, deprecated, until 2.0.0 deletes them together with this file.
 */
export const RETIRED_REASONS = {
  'not-an-interface': 'the gallery keeps only graphical interfaces, and this work is not one',
  'video-game': 'the gallery keeps only graphical interfaces, and video games are outside it',
} as const;
export type RetiredReason = keyof typeof RETIRED_REASONS;

export const RETIRED: Readonly<Record<string, RetiredReason>> = {
  'bauhaus-dessau': 'not-an-interface',
  maeusebunker: 'not-an-interface',
  nakagin: 'not-an-interface',
  'sesc-pompeia': 'not-an-interface',
  carlton: 'not-an-interface',
  'lettera-22': 'not-an-interface',
  'din-1451': 'not-an-interface',
  'munich-72': 'not-an-interface',
  'tokyo-1964': 'not-an-interface',
  'caracas-signage': 'not-an-interface',
  'create-two-three-many-vietnams': 'not-an-interface',
  loteria: 'not-an-interface',
  whaam: 'not-an-interface',
  'dragon-quest': 'video-game',
  'super-mario-bros': 'video-game',
};

export const isRetired = (id: string): boolean => Object.hasOwn(RETIRED, id);

/** The first words of a retired theme's stylesheet. */
export const retiredBanner = (id: string): string => `Deprecated in 1.4.0, removed in 2.0.0: ${RETIRED_REASONS[RETIRED[id]]}.`;
```

`src/study/catalog.ts`:
- `import { isRetired } from './retired';`
- In `CatalogEntry`, after `predatesStudy`, add:
  ```ts
  /** Retired from the gallery (src/study/retired.ts): still in the package until 2.0.0, never on the site. */
  readonly deprecated: boolean;
  ```
- In `studyEntry`, after `predatesStudy: false,` add `deprecated: isRetired(theme.id),`.
- In `coreEntry`, after `predatesStudy: true,` add `deprecated: false,`.
- In `renderPackageModule`'s d.ts, after the `predatesStudy` lines add:
  ```ts
    '  /** Retired from the gallery; the stylesheet is removed in 2.0.0. */',
    '  readonly deprecated: boolean;',
  ```

`src/study/build.ts`: add `export { isRetired, retiredBanner } from './retired';`

`scripts/build-study.mjs`, in the compile loop, replace the `banner:` value:

```js
    const banner = `neobrutalistcomponents v${pkg.version} — study theme: ${theme.id}`;
    compiled = study.compileTheme(theme, {
      signature,
      motionCss,
      banner: study.isRetired(theme.id) ? `${study.retiredBanner(theme.id)} ${banner}` : banner,
    });
```

`scripts/check-package.mjs`, after the existing `check(...)` calls on `themeIds`:

```js
for (const entry of STUDY_CATALOG) {
  const head = readFileSync(join(ROOT, `dist/themes/${entry.id}.css`), 'utf8').slice(0, 200);
  check(
    entry.deprecated === head.startsWith('/* Deprecated in 1.4.0, removed in 2.0.0: '),
    `dist/themes/${entry.id}.css: deprecated is ${entry.deprecated} but its banner says otherwise`,
  );
}
```

(add `readFileSync` to the script's `node:fs` import if it is not there).

- [ ] **Step 4: Run the tests and the library build**

Run: `npm test -- src/study/retired.test.ts src/study/catalog.test.ts` → PASS.
Run: `npm run build:lib && npm run check:package` → passes; `head -c 120 dist/themes/loteria.css` starts with `/* Deprecated in 1.4.0, removed in 2.0.0: the gallery keeps only graphical interfaces, and this work is not one.`; `head -c 60 dist/themes/xerox-star.css` does not mention `Deprecated`.

- [ ] **Step 5: Commit**

```bash
git add src/study/retired.ts src/study/retired.test.ts src/study/catalog.ts src/study/catalog.test.ts src/study/build.ts scripts/build-study.mjs scripts/check-package.mjs
git commit -m "feat(study): fifteen study themes are deprecated: the gallery keeps only graphical interfaces"
```

---

### Task 2: The site shows only current works and open rooms

**Files:**
- Modify: `src/site/study/data.ts`
- Modify: `src/site/study/rooms.ts`
- Create: `src/site/study/rooms.test.ts`
- Modify: `src/site/router.ts`, `src/site/router.test.ts`
- Modify: `src/site/study/SceneCards.tsx`, `src/site/study/RoomLegend.tsx`, `src/site/study/WorldMap.tsx`, `src/site/pages/ScenePage.tsx`, `src/site/home/ComponentWall.tsx`
- Modify: `src/site/study/loader.test.ts` (one new case)

**Interfaces:**
- Consumes: `CatalogEntry.deprecated` (Task 1).
- Produces: `CATALOG` (site) without deprecated entries; `OPEN_SCENES: readonly Scene[]`; `OPEN_THEME_SCENES: readonly ThemeScene[]` from `src/site/study/rooms.ts`.

- [ ] **Step 1: Write the failing tests**

`src/site/study/rooms.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { CATALOG } from './data';
import { OPEN_SCENES, OPEN_THEME_SCENES, roomFacts } from './rooms';

describe('rooms', () => {
  it('the site catalog holds no retired work', () => {
    expect(CATALOG.some((entry) => entry.deprecated)).toBe(false);
    expect(CATALOG.filter((entry) => !entry.predatesStudy)).toHaveLength(14);
  });

  it('only rooms with works are open, in SCENES order', () => {
    expect(OPEN_SCENES).toEqual(['usa', 'origins']);
    expect(OPEN_THEME_SCENES).toEqual(['usa']);
    for (const scene of OPEN_SCENES) expect(roomFacts(scene).works).toBeGreaterThan(0);
  });
});
```

In `src/site/router.test.ts`, add:

```ts
  it('a room without works is not a page', () => {
    expect(routeOf('/scene/usa')).toEqual({ name: 'scene', scene: 'usa' });
    expect(routeOf('/scene/japan')).toEqual({ name: 'not-found', path: '/scene/japan' });
  });
```

In `src/site/study/loader.test.ts`, add (Review Focus 1):

```ts
  it('a retired theme is unknown to the site', () => {
    expect(isKnownTheme('nakagin')).toBe(false);
    expect(isKnownTheme('xerox-star')).toBe(true);
  });
```

(import `isKnownTheme` from `./loader` if the file does not already.)

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- src/site/study/rooms.test.ts src/site/router.test.ts src/site/study/loader.test.ts`
Expected: FAIL — `OPEN_SCENES` is not exported; the catalog still has 29 works; `/scene/japan` routes to a scene; `isKnownTheme('nakagin')` is `true`.

- [ ] **Step 3: Implement**

`src/site/study/data.ts`:

```ts
/** The theme catalog as the site uses it (generated by scripts/build-study.mjs). */
import { CATALOG as GENERATED } from '../../study/.generated/catalog';
import type { CatalogEntry } from '../../study/catalog';

/** Retired works (src/study/retired.ts) stay in the package until 2.0.0, never in the gallery. */
export const CATALOG: readonly CatalogEntry[] = GENERATED.filter((entry) => !entry.deprecated);

export const ENTRIES: ReadonlyMap<string, CatalogEntry> = new Map(CATALOG.map((entry) => [entry.id, entry]));

/** Themes made for the study, in catalog order (scene folder, then id). */
export const STUDY_ENTRIES: readonly CatalogEntry[] = CATALOG.filter((entry) => !entry.predatesStudy);
```

`src/site/study/rooms.ts`: import `SCENES` from `../../study/types` and add after `isPlaced`:

```ts
/** Rooms open to visitors: the ones with at least one work, in SCENES order. */
export const OPEN_SCENES: readonly Scene[] = SCENES.filter((scene) => CATALOG.some((entry) => entry.scene === scene));

/** Open rooms with a place on the map. */
export const OPEN_THEME_SCENES: readonly ThemeScene[] = OPEN_SCENES.filter(isPlaced);
```

Replace the scene lists, each a one-identifier change plus its import:
- `src/site/router.ts`: `isThemeScene` checks `OPEN_THEME_SCENES` (import from `./study/rooms`) instead of `THEME_SCENES`.
- `src/site/study/SceneCards.tsx`: default `scenes = OPEN_SCENES`.
- `src/site/study/RoomLegend.tsx`: `SCENES.map` → `OPEN_SCENES.map`.
- `src/site/study/WorldMap.tsx`: both `THEME_SCENES.map` → `OPEN_THEME_SCENES.map`. Closed regions then render as plain land.
- `src/site/pages/ScenePage.tsx`: `SCENES.filter((other) => other !== scene)` → `OPEN_SCENES.filter(...)`.
- `src/site/home/ComponentWall.tsx`: the room `Select` uses `OPEN_THEME_SCENES` for its options and `OPEN_THEME_SCENES[0]` as fallback.

`src/site/home/works.ts` needs no change: `roomRows` already skips rooms without works. `src/site/study/facets.ts` needs no change: `facetOptions` lists only values present in the entries.

- [ ] **Step 4: Run them to verify they pass, then the typecheck**

Run: `npm test -- src/site/study/rooms.test.ts src/site/router.test.ts src/site/study/loader.test.ts` → PASS.
Run: `npm run typecheck` → passes. (Other unit tests that use retired ids as fixtures now fail; Task 3 rewires them. Do not touch them here.)

- [ ] **Step 5: Commit**

```bash
git add src/site
git commit -m "feat(site): the gallery shows only current works, and only rooms that hold some"
```

---

### Task 3: Fixtures move to current works

**Files:**
- Modify (unit): `src/site/home/works.test.ts`, `WorkCard.test.tsx`, `WorkCard.fallback.test.tsx`, `WorkLine.test.tsx`, `ThemeRibbon.test.tsx`, `TakeIt.test.tsx`, `ComponentWall.test.tsx`, `src/site/study/facets.test.ts`, `loader.test.ts`, `ThemeCard.test.tsx`, `PhotoFigure.test.tsx`, `src/site/pages/StudyHome.test.tsx`, `src/site/install.test.ts`, `src/site/router.test.ts`, `src/study/study.test.ts`, `src/study/llms.test.ts`
- Modify (e2e): `e2e/site.spec.ts`
- Modify (comments): `scripts/screenshots.mjs:19`, `scripts/fetch-image.mjs:6`, `src/study/registry.ts:21`

**Interfaces:**
- Consumes: the filtered `CATALOG` and `OPEN_SCENES` (Task 2).

Each test keeps the **property** it was exercising; only the fixture changes. Replacements:

| Retired fixture | Property the tests rely on | Replacement |
|---|---|---|
| `nakagin` | light study theme with a photograph | `xerox-star` (photo, signature CSS, light) |
| `sesc-pompeia` | study theme with a signature stylesheet, distinct from the `nakagin` one | `mac-os-classic` |
| `dragon-quest` | study theme with a motion file | `aqua` |
| `maeusebunker` | study theme whose **native** scheme is dark | No current study theme is native dark. If the test is about a dark native scheme, use core `tech`. If it is about a study theme rendered dark, use `win95` with `mode=dark`. Say which in the commit body. |
| `whaam`, `lettera-22`, `carlton`, `loteria`, `bauhaus-dessau`, `tokyo-1964`, … in date-ordered lists | ordering, neighbours, oldest-of-room | recompute the expected list from the 14 current works (oldest: `xerox-star`, 1981; newest: `material-design`, 2014) |

E2E specifics:
- `STUDY_ROUTES`: `'/en/scene/japan'` → `'/en/scene/usa'`.
- Atlas scene filter (around line 134): select `'usa'` instead of `'japan'`.
- World-map legend (around lines 459–473): `'Japan'` → `'United States'`, `/scene\/japan$/` → `/scene\/usa$/`, title `'United States — neobrutalistcomponents'`.
- Add the Review Focus cases 2 and 3:

```ts
test('a closed room and a retired work fall to the not-found page', async ({ page }) => {
  for (const hash of ['#/en/scene/japan', '#/en/theme/nakagin']) {
    await page.goto(hash);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/not found/i);
  }
});

test('a stale atlas filter for a closed room shows the empty state', async ({ page }) => {
  await page.goto('#/en/atlas?scene=japan');
  await expect(page.locator('.site-card')).toHaveCount(0);
  await expect(page.getByLabel('Scene').locator('option', { hasText: 'Japan' })).toHaveCount(0);
});
```

(Match the not-found heading to the actual text in `src/site/i18n.ts` before running; if `?theme=nakagin` reaches the theme page through another route, assert whatever the not-found page renders there.)

- [ ] **Step 1: Run the full unit suite and the e2e to list the failures**

Run: `npm test` and `npm run e2e`. Write down every failing test; each must map to a row of the table above.

- [ ] **Step 2: Rewire each failing test using the table; add the two e2e cases**

- [ ] **Step 3: Run everything**

Run: `npm test && npm run e2e` → all pass. Any test that cannot keep its property with a current work: stop and report it instead of loosening the assertion.

- [ ] **Step 4: Commit**

```bash
git add src e2e scripts
git commit -m "test: fixtures read current works; closed rooms and retired works fall to not-found"
```

---

### Task 4: The house, and the rooms that close

**Files:**
- Delete: `src/study/essays/scene-germany/`, `scene-italy/`, `scene-japan/`, `scene-latam/`
- Modify: `src/study/essays.ts` (`ESSAY_SLUGS`)
- Modify: `src/site/pages/ScenePage.tsx` (`ESSAYS`)
- Modify: `src/site/i18n.ts` (`titleOrigins`, `SCENE_TEXT.origins`, `SCENE_TEXT.usa`)
- Modify: `src/study/essays/origins/es.md`, `en.md` (opening framing only)

**Interfaces:**
- Produces: `ESSAY_SLUGS = ['home', 'origins', 'method', 'scene-usa']`.

- [ ] **Step 1: Make the essay test fail**

Change `ESSAY_SLUGS` in `src/study/essays.ts` to `['home', 'origins', 'method', 'scene-usa'] as const`.
Run: `npm test -- src/study/essays.content.test.ts` → FAIL (four essay folders on disk the site no longer renders).

- [ ] **Step 2: Delete the four folders; fix `ScenePage`**

```bash
git rm -r src/study/essays/scene-germany src/study/essays/scene-italy src/study/essays/scene-japan src/study/essays/scene-latam
```

`src/site/pages/ScenePage.tsx`:

```ts
/** Rooms with an essay. A room without works is never routed (rooms.ts). */
const ESSAYS: Partial<Record<Scene, EssaySlug>> = { usa: 'scene-usa', origins: 'origins' };
```

and render `{ESSAYS[scene] && <Essay slug={ESSAYS[scene]} />}` in place of `<Essay slug={ESSAYS[scene]} />`.

Run: `npm test -- src/study/essays.content.test.ts && npm run typecheck` → PASS.

- [ ] **Step 3: Draft the labels and show them to the owner**

Proposed copy for `src/site/i18n.ts` (the owner approves or edits it before commit):

```ts
  titleOrigins: { es: 'La casa', en: 'The house' },
```

```ts
  usa: {
    name: { es: 'Estados Unidos', en: 'United States' },
    summary: {
      es: 'Del Xerox Star a Material Design: el escritorio, la ventana, el bisel, el brillo y el tacto.',
      en: 'From the Xerox Star to Material Design: the desktop, the window, the bevel, the gloss and touch.',
    },
  },
  …
  origins: {
    name: { es: 'La casa', en: 'The house' },
    summary: {
      es: 'Los cinco temas propios de la librería, y de dónde viene su nombre: del béton brut a la web brutalista.',
      en: 'The library’s own five themes, and where its name comes from: from béton brut to brutalist websites.',
    },
  },
```

The `origins` essay gains one opening paragraph (es and en, drafted for the owner) saying that this room holds the library's own themes and tells where the library's name comes from; the rest of the essay is unchanged.

- [ ] **Step 4: After the owner's yes, apply, run, commit**

Run: `npm test && npm run typecheck` → PASS. Then update any test that asserts the old `Orígenes`/`Origins` label (grep `Orígenes|'Origins'` in `src` and `e2e`).

```bash
git add -A src e2e
git commit -m "feat(study): the core themes' room is the house; rooms without works close with their essays"
```

---

### Task 5: Agent docs list the retired themes apart

**Files:**
- Modify: `scripts/gen-llms.mjs`
- Modify: `src/study/llms.test.ts`
- Regenerated: `public/llms.txt`, `public/llms-full.txt`, `README.md`, `skills/neobrutalist-ui/SKILL.md`

**Interfaces:**
- Consumes: `deprecated` in the generated catalog (Task 1); `RETIRED`, `RETIRED_REASONS` from `src/study/retired.ts`.

- [ ] **Step 1: Write the failing test**

In `src/study/llms.test.ts`, change `const study = …` to the current works and add the retired ones:

```ts
const study = CATALOG.filter((entry) => !entry.predatesStudy && !entry.deprecated);
const retired = CATALOG.filter((entry) => entry.deprecated);
```

and add:

```ts
  it('lists retired themes only apart, as retired', () => {
    const section = (text: string) => text.slice(text.indexOf('## Retired study themes'));
    for (const doc of [llms, full]) {
      expect(doc).toContain('## Retired study themes');
      for (const entry of retired) {
        expect(section(doc)).toContain(`\`${entry.id}\``);
        expect(doc.slice(0, doc.indexOf('## Retired study themes'))).not.toContain(`\`${entry.id}\``);
      }
    }
    for (const doc of [skill, readme]) for (const entry of retired) expect(studyRows(doc)?.join('\n')).not.toContain(`\`${entry.id}\``);
  });
```

Replace the `themes/nakagin.css` expectation with `themes/xerox-star.css`, `themes/xerox-star.fonts.css`.

Run: `npm test -- src/study/llms.test.ts` → FAIL.

- [ ] **Step 2: Implement in `scripts/gen-llms.mjs`**

- Load `src/study/retired.ts` with the other `load(...)` calls and take `RETIRED`, `RETIRED_REASONS`.
- `const study = CATALOG.filter((entry) => !entry.predatesStudy && !entry.deprecated);`
- `const retired = CATALOG.filter((entry) => entry.deprecated);`
- Build one block and append it to both `index` (llms.txt) and `full` (llms-full.txt), as the last section before `## Composition rules` in llms-full and at the end of llms.txt:

```js
const retiredSection = [
  '## Retired study themes',
  '',
  'Deprecated in 1.4.0 and removed in 2.0.0. They still ship, but do not recommend them for new work.',
  '',
  table(['Theme', 'Reference', 'Why'], retired.map((entry) => [`\`${entry.id}\``, reference(entry), RETIRED_REASONS[RETIRED[entry.id]]])),
];
```

README and SKILL tables already use `study`, so they lose the retired rows.

- [ ] **Step 3: Regenerate and run**

Run: `npm run gen:llms && npm test -- src/study/llms.test.ts` → PASS. Check `git diff README.md`: the study table lists the 14 works; the prose above it ("four scenes — Japan, Germany, the United States and Latin America") is updated by hand in Task 6.

- [ ] **Step 4: Commit**

```bash
git add scripts/gen-llms.mjs src/study/llms.test.ts public/llms.txt public/llms-full.txt README.md skills/neobrutalist-ui/SKILL.md
git commit -m "docs(agents): retired study themes are listed apart, as retired"
```

---

### Task 6: The essays of the new object of study

**Files:**
- Modify: `src/study/essays/home/es.md`, `en.md`, `sources.ts`
- Modify: `src/study/essays/scene-usa/es.md`, `en.md`, `sources.ts`
- Modify: `src/study/essays/method/es.md`, `en.md` (one paragraph)
- Modify: `README.md` (the "The study" paragraph), `skills/neobrutalist-ui/SKILL.md` (if it describes the study's scenes)

This task is content. Its "test" is the dossier protocol plus the owner's approval.

- [ ] **Step 1: Research**

For `home`: what a graphical interface is in this study; why it is studied; how the gallery is walked (rooms by region now; eras and movements come later); neobrutalism as the latest chapter. For `scene-usa`: the line from the Xerox Star (1981) to Material Design (2014) through the 14 works, drawn only from sources. Collect sources into each `sources.ts` in the existing `Source` shape (title, url, publisher, accessed `2026-10-…`). Primary or institutional sources first (Computer History Museum, Xerox PARC/Smithsonian, ACM, the vendors' own documentation), Wikipedia never the only one.

- [ ] **Step 2: Verify sources**

Run: `npm run check:links` → every URL resolves. Then a fresh Opus review reads each essay against its sources and lists any claim the sources do not support. Fix every finding.

- [ ] **Step 3: Show the drafts to the owner**

Both essays in es and en, plus the changed `method` paragraph ("un edificio, una publicación, un objeto, un sitio web" → interfaces) and the README paragraph. Wait for the owner's yes; apply edits.

- [ ] **Step 4: Run and commit**

Run: `npm test -- src/study/essays.content.test.ts src/study/essays.test.ts` → PASS (bilingual, every source cited).

```bash
git add src/study/essays README.md skills/neobrutalist-ui/SKILL.md
git commit -m "docs(study): the essays study the history of the graphical interface"
```

---

### Task 7: Release 1.4.0

**Files:**
- Modify: `CHANGELOG.md`, `package.json` (`version`)

- [ ] **Step 1: CHANGELOG**

Under `## Unreleased`, add:

```markdown
### Deprecated
- Fifteen study themes leave the gallery, which now keeps only graphical interfaces: `bauhaus-dessau`, `maeusebunker`, `nakagin`, `sesc-pompeia`, `carlton`, `lettera-22`, `din-1451`, `munich-72`, `tokyo-1964`, `caracas-signage`, `create-two-three-many-vietnams`, `loteria`, `whaam`, and the video games `dragon-quest` and `super-mario-bros`. Their stylesheets still ship, marked deprecated, and are removed in 2.0.0. `STUDY_CATALOG` entries gain `deprecated`.

### Changed
- Study: the gallery studies the history of the graphical interface. The Germany, Italy, Japan and Latin America rooms close until they hold interfaces; the core themes' room is called the house.
```

Then rename `## Unreleased` to `## 1.4.0 — <date>` and set `"version": "1.4.0"` in `package.json`.

- [ ] **Step 2: Gates**

Run: `npm run check` (lint, typecheck, test, build, check:package) → passes.
Run: `npm run e2e` → passes.
Manual pass in a browser (`npm run dev`): home, atlas, rooms map, the house, the US room, a work page, Credits — in light and dark; no retired work or closed room visible anywhere.

- [ ] **Step 3: Commit**

```bash
git add CHANGELOG.md package.json package-lock.json
git commit -m "chore: release 1.4.0"
```
