# Neobrutalism Study — Site, Essays and Release (Plan 2 of 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the docs site into the bilingual study — language routes, an atlas of every theme, a page per theme, essays on four scenes and their origins, method and credits — load study themes only when needed, give agents the study catalog, and prepare release 1.1.0.

**Architecture:** The site stays a hash-routed React SPA, now with the language in every route (`#/es/…`, `#/en/…`). A study theme's stylesheet is fetched with a `<link>` only when a page shows it or the site switches to it; atlas cards and home tiles paint from catalog data instead. A theme's prose and tokens are lazy chunks; essays are Markdown rendered to HTML at build time by a Vite plugin. Every list on the Method and Credits pages (families, contrast pairs, fonts, images) is generated from data.

**Tech Stack:** React 19, TypeScript 6, Vite 8 (Rolldown), Vitest 5 (jsdom), Playwright + axe-core, `marked` 18 (devDependency, build time only).

**Spec:** `docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md` — D9 (bilingual content), D10 (site structure), D11 (performance), D12 (agents), D14 (release), §5 (testing). Builds on Plan 1 (`docs/superpowers/plans/2026-10-05-neobrutalism-study-engine.md`), merged into `main` at `a69ef04`. Work on branch `study/site`, created from that commit.

**How this plan was checked:** every task was replayed in order on a clean copy of `main` — tests written first and run (red), then the implementation and the gates (green), then committed. Each "Expected" block below is that replay's output, with durations removed. Where an edit says "Replace … with …", the first block occurs exactly once in the file at that point.

## Before you start

- Work on `study/site` (already created from `main` at `a69ef04`).
- Run `npm run gen:study` once. It writes the git-ignored `src/study/.generated/` (the catalog and the study stylesheets) that the tests and the site read. `npm test`, `npm run typecheck`, `npm run dev` and `npm run build:site` run it on their own; `npx vitest run …`, used in the steps below, does not.
- `npx playwright test` builds the site (`npm run build:site`) and serves it on port 4173 before testing; it needs Chromium (`npx playwright install chromium` if it is missing).

## Global Constraints

- Routes carry the language: `#/es/…` and `#/en/…`. First visit: browser language `es*` → `es`, anything else → `en`; the choice is remembered in `localStorage` under `nbc-site-lang`.
- Old routes redirect without adding a history entry: `#/` → `#/<lang>/`; `#/components[/<slug>]`, `#/blocks`, `#/start`, `#/agents` → the same path under `#/<lang>/`; `#/themes` → `#/<lang>/atlas`.
- `<html lang>` follows the language; original-language names carry their own `lang` attribute (`ja`, `pt`, `de`).
- Technical docs (components, props, Start, Agents, Blocks) stay in English in both languages, with a one-line notice in the Spanish version.
- Every user-facing study string is an `L10n` pair (`{ es, en }`); a test rejects an empty string in either language.
- Essays live in `src/study/essays/<slug>/es.md` and `en.md` with a shared `sources.ts`; no raw HTML; `[n]` markers resolve to sources, cover every source and match across languages; sources are paraphrased, never quoted.
- Sources: an https URL, a title, an ISO access date (`YYYY-MM-DD`); at least one source per text is not on `wikipedia.org`.
- A study theme's CSS is fetched only on its page or when chosen for the whole site; it never enters the main CSS bundle. Atlas cards are painted from catalog data; a card's font loads when it nears the viewport.
- Images come from Wikimedia Commons under CC0, public domain, CC BY or CC BY-SA only; they are site-only and lazy-loaded with explicit dimensions.
- `?theme=<id>` accepts any catalog id; an unknown id falls back to `classic`. `NeoProvider`'s `mode` flips a study theme exactly like a core theme.
- Top bar: Study, Scenes, Atlas, Library, Components, plus language, theme and mode controls; it stays non-sticky on phones (the existing ≤ 720 px rule).
- Every page works at 360 px wide, with no horizontal scroll.
- Accessibility: axe with the tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa` passes on every tested page.
- The library gains no runtime dependency; `marked` is a devDependency used only by `vite-plugin-essays.ts`.
- Version **1.1.0**: the `./study` export and the theme files from Plan 1 ship; nothing breaks.
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt`.
- Merging, pushing a tag and `npm publish` happen only on the owner's word.
- This machine has 8 GB of RAM: run Playwright with its configured two workers, and never two e2e runs at once — they share port 4173, and with `reuseExistingServer` the second run would test the first one's build.

## Review Focus

The inputs the spec implies but no test of its own would exercise, most likely first. Each now has a test in the task that owns the code:

1. **A site-wide study theme whose stylesheet fails to load** (a stale cache after a deploy, a renamed asset): the site must fall back to `classic`, not sit on "Loading" — Task 3, "a site-wide study theme whose stylesheet cannot load falls back to classic".
2. **The Back button after an old link** (`#/blocks` from the README or an old bookmark): the redirect must not add a history entry, or Back bounces into the redirect forever — Task 2, "a legacy address redirects without a history entry".
3. **Typing in the atlas search**: the address follows the query, but keystrokes must not stack history; Back should leave the atlas — Task 4, "atlas: typing replaces the address instead of stacking history".
4. **Switching language with filters set**: `#/es/atlas?scene=japan&q=riso` must become `#/en/atlas?scene=japan&q=riso` — Task 4, "atlas: switching language keeps the filters".
5. **A lazy chunk that fails** (an essay or a theme's data on a flaky connection): the page must say so instead of staying blank — Task 5, "theme page: when its data cannot load…", and Task 7, "a study page whose essay cannot load…".

---

## File map

| File | Tasks |
| --- | --- |
| `.github/workflows/ci.yml` | T9 modify |
| `CHANGELOG.md` | T11 modify |
| `README.md` | T11 modify |
| `docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md` | T11 modify |
| `e2e/site.spec.ts` | T2 modify, T3 modify, T4 modify, T5 modify, T7 modify, T8 modify, T10 modify |
| `package-lock.json` | T11 modify |
| `package.json` | T1 modify, T9 modify, T11 modify |
| `public/llms-full.txt` | T9 modify, T11 modify |
| `public/llms.txt` | T9 modify, T11 modify |
| `scripts/gen-llms.mjs` | T9 modify |
| `scripts/screenshots.mjs` | T11 modify |
| `skills/neobrutalist-ui/SKILL.md` | T9 modify |
| `src/docs/guide.ts` | T9 modify, T11 modify |
| `src/docs/meta/Badge.ts` | T11 modify |
| `src/main.tsx` | T4 modify |
| `src/site/App.tsx` | T2 modify, T3 modify, T4 modify, T5 modify, T7 modify, T8 modify |
| `src/site/Shell.tsx` | T2 modify |
| `src/site/ThemeSwitcher.tsx` | T2 modify, T3 modify |
| `src/site/docs/ComponentNav.tsx` | T2 modify |
| `src/site/docs/PropsTable.tsx` | T10 modify |
| `src/site/docs/StudyBand.tsx` | T4 delete |
| `src/site/docs/TableScroll.test.tsx` | T10 create |
| `src/site/docs/TableScroll.tsx` | T10 create |
| `src/site/docs/TokenTables.tsx` | T5 modify, T10 modify |
| `src/site/docs/studyThemes.ts` | T4 delete |
| `src/site/i18n.test.ts` | T2 create |
| `src/site/i18n.ts` | T2 create |
| `src/site/lang.test.ts` | T2 create |
| `src/site/lang.ts` | T2 create |
| `src/site/pages/Agents.tsx` | T9 modify, T10 modify, T11 modify |
| `src/site/pages/Atlas.tsx` | T4 create |
| `src/site/pages/ComponentPage.tsx` | T2 modify |
| `src/site/pages/ComponentsIndex.tsx` | T2 modify |
| `src/site/pages/Credits.tsx` | T8 create, T10 modify |
| `src/site/pages/Library.tsx` | T2 rename from src/site/pages/Home.tsx, T9 modify, T11 modify |
| `src/site/pages/Method.tsx` | T8 create, T10 modify |
| `src/site/pages/NotFound.tsx` | T2 modify |
| `src/site/pages/ScenePage.tsx` | T7 create |
| `src/site/pages/Scenes.tsx` | T7 create |
| `src/site/pages/Start.tsx` | T10 modify |
| `src/site/pages/StudyHome.tsx` | T7 create |
| `src/site/pages/ThemePage.tsx` | T5 create |
| `src/site/pages/Themes.tsx` | T4 delete |
| `src/site/prefs.ts` | T3 modify |
| `src/site/router.test.ts` | T2 create |
| `src/site/router.ts` | T2 modify |
| `src/site/site.css` | T2 modify, T3 modify, T4 modify, T5 modify, T7 modify, T8 modify, T10 modify |
| `src/site/study/Essay.tsx` | T7 create |
| `src/site/study/SceneCards.tsx` | T7 create |
| `src/site/study/SourceList.tsx` | T5 create |
| `src/site/study/ThemeCard.tsx` | T4 create, T7 modify |
| `src/site/study/credits.test.ts` | T8 create |
| `src/site/study/credits.ts` | T8 create |
| `src/site/study/data.ts` | T3 create |
| `src/site/study/detail.ts` | T5 create |
| `src/site/study/essays.test.ts` | T7 create |
| `src/site/study/essays.ts` | T7 create |
| `src/site/study/facets.test.ts` | T4 create |
| `src/site/study/facets.ts` | T4 create |
| `src/site/study/format.test.ts` | T4 create, T8 modify |
| `src/site/study/format.ts` | T4 create, T8 modify |
| `src/site/study/lazy.test.tsx` | T5 create |
| `src/site/study/lazy.ts` | T5 create |
| `src/site/study/loader.test.ts` | T3 create |
| `src/site/study/loader.ts` | T3 create |
| `src/study/essays.content.test.ts` | T6 create |
| `src/study/essays.test.ts` | T1 create |
| `src/study/essays.ts` | T1 create |
| `src/study/essays/home/en.md` | T6 create |
| `src/study/essays/home/es.md` | T6 create |
| `src/study/essays/home/sources.ts` | T6 create |
| `src/study/essays/method/en.md` | T6 create |
| `src/study/essays/method/es.md` | T6 create |
| `src/study/essays/method/sources.ts` | T6 create |
| `src/study/essays/origins/en.md` | T6 create |
| `src/study/essays/origins/es.md` | T6 create |
| `src/study/essays/origins/sources.ts` | T6 create |
| `src/study/essays/scene-germany/en.md` | T6 create |
| `src/study/essays/scene-germany/es.md` | T6 create |
| `src/study/essays/scene-germany/sources.ts` | T6 create |
| `src/study/essays/scene-japan/en.md` | T6 create |
| `src/study/essays/scene-japan/es.md` | T6 create |
| `src/study/essays/scene-japan/sources.ts` | T6 create |
| `src/study/essays/scene-latam/en.md` | T6 create |
| `src/study/essays/scene-latam/es.md` | T6 create |
| `src/study/essays/scene-latam/sources.ts` | T6 create |
| `src/study/essays/scene-usa/en.md` | T6 create |
| `src/study/essays/scene-usa/es.md` | T6 create |
| `src/study/essays/scene-usa/sources.ts` | T6 create |
| `src/study/fonts.test.ts` | T8 modify |
| `src/study/fonts.ts` | T8 modify |
| `src/study/llms.test.ts` | T9 create |
| `src/study/markdown.test.ts` | T1 create |
| `src/study/markdown.ts` | T1 create |
| `src/study/validate.ts` | T1 modify |
| `src/vite-env.d.ts` | T1 modify |
| `tsconfig.node.json` | T1 modify |
| `vite-plugin-essays.ts` | T1 create |
| `vite.config.ts` | T1 modify |
| `vite.site.config.ts` | T1 modify |
| `vitest.config.ts` | T1 modify |

---

### Task 1: Essays: Markdown rendered at build time, and validated

Essays are Markdown in `src/study/essays/<slug>/{es,en}.md` with a shared `sources.ts` (D9). A small Vite plugin turns `import html from './es.md'` into the rendered HTML string at build time, so no Markdown renderer ships to the browser (D11); `marked` is a devDependency used only there. `renderMarkdown` refuses raw HTML and `#` headings (the page owns the h1), keeps only https links (opened in a new tab) and turns `[n]` markers into citation spans. `essayProblems` is the pure check the essay tests run; `sourceProblems` is split out of `referenceProblems` so fichas and essays share it. Config files import local modules with an explicit `.ts` extension (`allowImportingTsExtensions`), which keeps Vite 8 from warning about its future native config loader.

**Files:**
- Modify: `package.json`
- Test (new): `src/study/essays.test.ts`
- Create: `src/study/essays.ts`
- Test (new): `src/study/markdown.test.ts`
- Create: `src/study/markdown.ts`
- Modify: `src/study/validate.ts`
- Modify: `src/vite-env.d.ts`
- Modify: `tsconfig.node.json`
- Create: `vite-plugin-essays.ts`
- Modify: `vite.config.ts`
- Modify: `vite.site.config.ts`
- Modify: `vitest.config.ts`

**Interfaces:**
- Consumes: `markers(text: string): number[]` and the `Source` type from Plan 1 (`src/study/validate.ts`, `src/study/types.ts`).
- Produces: `renderMarkdown(markdown: string): string` (`src/study/markdown.ts`); `ESSAY_SLUGS`, `type EssaySlug`, `essayProblems(slug: string, es: string | undefined, en: string | undefined, sources: readonly Source[]): string[]` (`src/study/essays.ts`); `sourceProblems(sources: readonly Source[], where: string): string[]` exported from `src/study/validate.ts`; the Vite plugin `essays()` (`vite-plugin-essays.ts`), registered in the site and Vitest configs; `declare module '*.md'` (default export: the rendered HTML string).

- [ ] **Step 1: Add `marked` as a devDependency**

Run: `npm install --save-dev marked@18.1.0`

Expected: exit code 0. `package.json` gains `"marked": "^18.1.0"` under `devDependencies`, and `package-lock.json` its entry. Nothing else in `package.json` changes.

- [ ] **Step 2: Write the failing tests**

Create `src/study/essays.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { essayProblems } from './essays';
import type { Source } from './types';

const SOURCES: Source[] = [
  { title: 'One', url: 'https://example.org/one', publisher: 'Example', accessed: '2026-10-05' },
  { title: 'Two', url: 'https://en.wikipedia.org/wiki/Two', accessed: '2026-10-05' },
];
const es = '## Hola\n\nUn hecho [1]. Otro [2].';
const en = '## Hello\n\nA fact [1]. Another [2].';

describe('essayProblems', () => {
  it('accepts a bilingual essay that cites every source', () => {
    expect(essayProblems('fixture', es, en, SOURCES)).toEqual([]);
  });

  it('accepts an essay without sources or markers', () => {
    expect(essayProblems('fixture', '## Método\n\nTexto.', '## Method\n\nText.', [])).toEqual([]);
  });

  it.each([
    [[undefined, en], /fixture\.es: missing or empty/],
    [[es, '<b>Hello</b> [1] [2]'], /fixture\.en: raw HTML is not allowed/],
    [[es, '# Hello\n\n[1] [2]'], /use ## and ###/],
    [[es, en.replace('[2]', '[3]')], /fixture\.en: marker \[3\] has no source/],
    [[es, en.replace(' Another [2].', '')], /markers differ between es \[1,2\] and en \[1\]/],
    [[es.replace(' Otro [2].', ''), en.replace(' Another [2].', '')], /source \[2\] is never cited/],
    [[es, `${en} [1952](https://example.org)`], /may not be a bare number/],
    [[es, `${en} [Tate](http://www.tate.org.uk/)`], /fixture\.en: links must be https/],
  ])('rejects %o', ([esText, enText], message) => {
    expect(essayProblems('fixture', esText, enText, SOURCES).join('\n')).toMatch(message);
  });

  it('checks the sources themselves', () => {
    const bad = [{ ...SOURCES[0], url: 'http://example.org' as never }, SOURCES[1]];
    expect(essayProblems('fixture', es, en, bad).join('\n')).toMatch(/fixture\.sources\[1\]: not https/);
  });
});
```

Create `src/study/markdown.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './markdown';

/** Drops the newlines marked puts between block tags. */
const flat = (html: string) => html.replace(/>\n+</g, '><').trim();

describe('renderMarkdown', () => {
  it('renders headings, paragraphs, lists and block quotes', () => {
    const md = '## Origins\n\nThe word starts\nin concrete.\n\n- one\n- two\n\n> A quoted line\n> that continues.\n\n### Later';
    expect(flat(renderMarkdown(md))).toBe(
      '<h2>Origins</h2><p>The word starts\nin concrete.</p><ul><li>one</li><li>two</li></ul><blockquote><p>A quoted line\nthat continues.</p></blockquote><h3>Later</h3>',
    );
  });

  it('renders emphasis, code, https links in a new tab and source markers', () => {
    expect(flat(renderMarkdown('*béton brut*, **raw**, `code`, [Tate](https://www.tate.org.uk/) [2].'))).toBe(
      '<p><em>béton brut</em>, <strong>raw</strong>, <code>code</code>, <a href="https://www.tate.org.uk/" target="_blank" rel="noreferrer">Tate</a> <span class="study-cite">[2]</span>.</p>',
    );
  });

  it('leaves a lone asterisk alone and keeps parentheses in URLs', () => {
    const md = 'Grade II* [4]. The *New Brutalism* [1][2], [Metabolism](https://en.wikipedia.org/wiki/Metabolism_(architecture)).';
    expect(flat(renderMarkdown(md))).toBe(
      '<p>Grade II* <span class="study-cite">[4]</span>. The <em>New Brutalism</em> <span class="study-cite">[1]</span><span class="study-cite">[2]</span>, <a href="https://en.wikipedia.org/wiki/Metabolism_(architecture)" target="_blank" rel="noreferrer">Metabolism</a>.</p>',
    );
  });

  it('links nothing but https', () => {
    const html = renderMarkdown('[x](javascript:alert(1)) and [y](http://example.org)');
    expect(html).not.toContain('<a ');
    expect(flat(html)).toBe('<p>x and y</p>');
  });

  it('refuses raw HTML and an h1: essays are Markdown, and the page owns the h1', () => {
    expect(() => renderMarkdown('Text <b>bold</b>.')).toThrow(/raw HTML is not allowed/);
    expect(() => renderMarkdown('<div>\nblock\n</div>')).toThrow(/raw HTML is not allowed/);
    expect(() => renderMarkdown('# Title')).toThrow(/use ## and ###/);
  });
});
```

- [ ] **Step 3: Run them and watch them fail**

Run: `npx vitest run src/study/markdown.test.ts src/study/essays.test.ts src/study/validate.test.ts`

Expected: FAIL

```text
Test Files  2 failed | 1 passed (3)
Tests  36 passed (36)
FAIL  src/study/essays.test.ts [ src/study/essays.test.ts ]
Error: Failed to resolve import "./essays" from "src/study/essays.test.ts". Does the file exist?
FAIL  src/study/markdown.test.ts [ src/study/markdown.test.ts ]
Error: Failed to resolve import "./markdown" from "src/study/markdown.test.ts". Does the file exist?
```

- [ ] **Step 4: Implement**

Create `src/study/essays.ts`:

```ts
/**
 * Essays of the study: Markdown in src/study/essays/<slug>/{es,en}.md with a
 * shared sources.ts. Pure checks, shared by the tests and nothing else.
 */
import { markers, sourceProblems } from './validate';
import type { Source } from './types';

/** Every essay the site renders, by slug. */
export const ESSAY_SLUGS = ['home', 'origins', 'method', 'scene-japan', 'scene-germany', 'scene-usa', 'scene-latam'] as const;
export type EssaySlug = (typeof ESSAY_SLUGS)[number];

export function essayProblems(slug: string, es: string | undefined, en: string | undefined, sources: readonly Source[]): string[] {
  const problems: string[] = [];
  for (const [lang, text] of [['es', es], ['en', en]] as const) {
    if (!text?.trim()) {
      problems.push(`${slug}.${lang}: missing or empty`);
      continue;
    }
    if (/<[a-z!/]/i.test(text)) problems.push(`${slug}.${lang}: raw HTML is not allowed in essays`);
    if (/^#\s/m.test(text)) problems.push(`${slug}.${lang}: use ## and ### — the page owns the h1`);
    if (/\[\d+\]\(/.test(text)) problems.push(`${slug}.${lang}: a link label may not be a bare number (it reads as a source marker)`);
    if (/\]\((?!https:\/\/)/.test(text)) problems.push(`${slug}.${lang}: links must be https (others are dropped from the page)`);
    for (const n of markers(text)) if (n < 1 || n > sources.length) problems.push(`${slug}.${lang}: marker [${n}] has no source`);
  }
  if (problems.length) return problems;
  const cited = (text: string) => [...new Set(markers(text))].sort((a, b) => a - b);
  const [inEs, inEn] = [cited(es!), cited(en!)];
  if (inEs.join() !== inEn.join()) problems.push(`${slug}: markers differ between es [${inEs}] and en [${inEn}]`);
  for (let n = 1; n <= sources.length; n += 1) if (!inEs.includes(n)) problems.push(`${slug}: source [${n}] is never cited`);
  problems.push(...sourceProblems(sources, slug));
  return problems;
}
```

Create `src/study/markdown.ts`:

```ts
/**
 * Renders a study essay (Markdown) to HTML at build time. Site-only:
 * vite-plugin-essays.ts is the one caller, so `marked` never reaches the
 * browser or the library. Raw HTML and h1 headings are refused, links must be
 * https and open in a new tab, and `[n]` markers become citation spans.
 */
import { Marked } from 'marked';

const attribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const marked = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      if (depth === 1) throw new Error('essays use ## and ### — the page owns the h1');
      return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`;
    },
    html({ text }) {
      throw new Error(`raw HTML is not allowed in essays: ${text.trim().slice(0, 40)}`);
    },
    link({ href, tokens }) {
      const label = this.parser.parseInline(tokens);
      return href.startsWith('https://') ? `<a href="${attribute(href)}" target="_blank" rel="noreferrer">${label}</a>` : label;
    },
  },
});

/** `[n]` in text — never inside a tag — becomes a citation span. */
const cite = (html: string) =>
  html.replace(/(^|>)([^<]*)/g, (_, edge: string, text: string) => edge + text.replace(/\[(\d+)\]/g, '<span class="study-cite">[$1]</span>'));

export function renderMarkdown(markdown: string): string {
  return cite(marked.parse(markdown, { async: false }));
}
```

Replace the whole of `src/study/validate.ts` with:

```ts
/**
 * Mechanical checks of a study theme and of the core fichas (spec D1, D7, D8).
 * Every function returns a list of problems; empty means valid.
 */
import { NEO_THEMES } from '../lib/themes';
import { FONTS } from './fonts';
import { hasImage, hasUnresolvableColor } from './lint';
import { IMAGE_LICENSES, LANGS, PALETTE_ORIGINS, REFERENCE_KINDS, SCENES, SHADOW_KINDS, THEME_SCENES } from './types';
import type { CoreFicha, Ficha, L10n, Reference, Source, StudyThemeInput } from './types';

export const ID_PATTERN = /^[a-z][a-z0-9-]{1,31}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const BCP47 = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

function l10nProblems(value: L10n | undefined, where: string): string[] {
  if (!value) return [`${where}: missing`];
  return LANGS.filter((lang) => !value[lang]?.trim()).map((lang) => `${where}.${lang}: empty`);
}

/** Source markers ([1], [2]…) in a text. */
export function markers(text: string): number[] {
  return [...text.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1]));
}

/** Checks every source (https, title, ISO access date) and that at least one is not on wikipedia.org. */
export function sourceProblems(sources: readonly Source[], where: string): string[] {
  const problems: string[] = [];
  let independent = 0;
  sources.forEach((source, i) => {
    const at = `${where}.sources[${i + 1}]`;
    try {
      const url = new URL(source.url);
      if (url.protocol !== 'https:') problems.push(`${at}: not https`);
      if (!url.hostname.endsWith('wikipedia.org')) independent += 1;
    } catch {
      problems.push(`${at}: invalid URL ${source.url}`);
    }
    if (!source.title.trim()) problems.push(`${at}: empty title`);
    if (!ISO_DATE.test(source.accessed)) problems.push(`${at}: accessed must be YYYY-MM-DD`);
  });
  if (sources.length > 0 && independent === 0) {
    problems.push(`${where}.sources: at least one source must not be on wikipedia.org`);
  }
  return problems;
}

export function referenceProblems(ref: Reference, where: string): string[] {
  const problems = [...l10nProblems(ref.title, `${where}.title`), ...l10nProblems(ref.place, `${where}.place`)];
  if (ref.original && (!ref.original.text.trim() || !BCP47.test(ref.original.lang))) {
    problems.push(`${where}.original: needs text and a BCP 47 lang`);
  }
  if (!REFERENCE_KINDS.includes(ref.kind)) problems.push(`${where}.kind: unknown "${ref.kind}"`);
  const [from, to] = typeof ref.date === 'number' ? [ref.date, ref.date] : ref.date;
  if (!(Number.isInteger(from) && Number.isInteger(to) && from >= 1800 && to <= 2100 && from <= to)) {
    problems.push(`${where}.date: ${JSON.stringify(ref.date)} is not a year or an ordered range`);
  }
  if (ref.sources.length < 2) problems.push(`${where}.sources: needs at least 2, has ${ref.sources.length}`);
  problems.push(...sourceProblems(ref.sources, where));
  if (ref.image) {
    const image = ref.image;
    if (!IMAGE_LICENSES.includes(image.license)) problems.push(`${where}.image: license "${image.license}" is not allowed`);
    if (!image.author.trim()) problems.push(`${where}.image: empty author`);
    if (!image.sourceUrl.startsWith('https://commons.wikimedia.org/wiki/File:')) {
      problems.push(`${where}.image: sourceUrl must be a Commons file page`);
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*\.avif$/.test(image.file)) problems.push(`${where}.image: file must be a kebab-case .avif name`);
    if (!(image.width > 0 && image.width <= 1600 && image.height > 0)) problems.push(`${where}.image: bad dimensions`);
    problems.push(...l10nProblems(image.alt, `${where}.image.alt`));
  }
  if (ref.archiveUrl && !ref.archiveUrl.startsWith('https://web.archive.org/')) {
    problems.push(`${where}.archiveUrl: must be a web.archive.org link`);
  }
  return problems;
}

export function fichaProblems(ficha: Ficha, sourceCount: number, where: string): string[] {
  const problems = [
    ...l10nProblems(ficha.documented, `${where}.documented`),
    ...l10nProblems(ficha.reading, `${where}.reading`),
    ...l10nProblems(ficha.palette?.note, `${where}.palette.note`),
  ];
  if (!(PALETTE_ORIGINS as readonly string[]).includes(String(ficha.palette?.origin))) problems.push(`${where}.palette.origin: unknown`);
  if (problems.length) return problems;
  const cited = LANGS.map((lang) => new Set([...markers(ficha.documented[lang]), ...markers(ficha.reading[lang])]));
  LANGS.forEach((lang, i) => {
    for (const n of cited[i]) if (n < 1 || n > sourceCount) problems.push(`${where} (${lang}): marker [${n}] has no source`);
  });
  const [es, en] = cited.map((set) => [...set].sort((a, b) => a - b));
  if (es.join() !== en.join()) problems.push(`${where}: markers differ between es [${es}] and en [${en}]`);
  for (let n = 1; n <= sourceCount; n += 1) if (!cited[0].has(n)) problems.push(`${where}: source [${n}] is never cited`);
  if (markers(ficha.documented.es).length === 0) problems.push(`${where}.documented: cites no source`);
  return problems;
}

const SPACING = /^(normal|0|-?(\d+(\.\d+)?|\.\d+)(em|rem|px))$/;
const STRETCH = /^\d+(\.\d+)?%$/;
const EASE =
  /^(linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end|cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)|steps\(\s*\d+\s*(,\s*(jump-start|jump-end|jump-none|jump-both|start|end)\s*)?\))$/;
const TRANSFORMS = ['none', 'uppercase', 'lowercase'];
const BORDER_STYLES = ['solid', 'dashed', 'double'];

/** A value written verbatim into the stylesheet: no declaration or block breakers, balanced parentheses. */
function isSingleValue(value: string): boolean {
  if (/[;{}]/.test(value)) return false;
  let depth = 0;
  for (const ch of value) {
    if (ch === '(') depth += 1;
    else if (ch === ')' && --depth < 0) return false;
  }
  return depth === 0;
}

/** Every number and string the compiler writes into the CSS, checked for range and shape. */
function valueProblems(theme: StudyThemeInput): string[] {
  const { id, type, shape, elevation, focus, motion, fills } = theme;
  const problems: string[] = [];
  const number = (value: number, where: string, min: number, max: number, integer = false) => {
    if (!(Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isInteger(value)))) {
      problems.push(`${id}.${where}: ${value} must be ${integer ? 'an integer' : 'a number'} within ${min}..${max}`);
    }
  };
  number(type.weightBody, 'type.weightBody', 1, 1000, true);
  number(type.weightLabel, 'type.weightLabel', 1, 1000, true);
  number(type.weightDisplay, 'type.weightDisplay', 1, 1000, true);
  for (const key of ['labelSpacing', 'displaySpacing'] as const) {
    const value = type[key];
    if (value !== undefined && !SPACING.test(value)) problems.push(`${id}.type.${key}: "${value}" must be normal, 0 or a length in em, rem or px`);
  }
  for (const key of ['labelTransform', 'displayTransform'] as const) {
    const value = type[key];
    if (value !== undefined && !TRANSFORMS.includes(value)) problems.push(`${id}.type.${key}: "${value}" must be one of ${TRANSFORMS.join(', ')}`);
  }
  if (type.displayStretch !== undefined && !STRETCH.test(type.displayStretch)) {
    problems.push(`${id}.type.displayStretch: "${type.displayStretch}" must be a percentage`);
  }
  number(shape.borderWidth, 'shape.borderWidth', 0, 12, true);
  for (const key of ['radius', 'radiusControl', 'radiusButton', 'radiusSmall'] as const) number(shape[key], `shape.${key}`, 0, 999, true);
  if (shape.borderStyle !== undefined && !BORDER_STYLES.includes(shape.borderStyle)) {
    problems.push(`${id}.shape.borderStyle: "${shape.borderStyle}" must be one of ${BORDER_STYLES.join(', ')}`);
  }
  if (!(SHADOW_KINDS as readonly string[]).includes(elevation.kind)) problems.push(`${id}.elevation.kind: unknown "${elevation.kind}"`);
  for (const key of ['shadow', 'shadowLg', 'shadowPress'] as const) {
    if (!isSingleValue(elevation[key])) problems.push(`${id}.elevation.${key}: "${elevation[key]}" is not a single CSS value`);
  }
  number(elevation.press, 'elevation.press', 0, 24);
  number(elevation.pressActive, 'elevation.pressActive', 0, 24);
  if (elevation.rotate !== undefined) number(elevation.rotate, 'elevation.rotate', -15, 15);
  if (focus) {
    number(focus.width, 'focus.width', 1, 8);
    number(focus.offset, 'focus.offset', 0, 8);
  }
  if (motion) {
    number(motion.duration, 'motion.duration', 0, 5000);
    number(motion.durationSlow, 'motion.durationSlow', 0, 5000);
    if (!EASE.test(motion.ease)) problems.push(`${id}.motion.ease: "${motion.ease}" must be an easing keyword, cubic-bezier() or steps()`);
  }
  for (const key of ['primary', 'danger', 'surface'] as const) {
    const fill = fills?.[key];
    if (fill === undefined) continue;
    if (!isSingleValue(fill)) problems.push(`${id}.fills.${key}: "${fill}" is not a single CSS value`);
    if (hasImage(fill)) problems.push(`${id}.fills.${key}: "${fill}" — no images; a fill is a color or a gradient`);
    if (hasUnresolvableColor(fill)) {
      problems.push(`${id}.fills.${key}: "${fill}" — named colors and color functions are out: the contract cannot check them; use #hex, light-dark() or var()`);
    }
  }
  return problems;
}

export function themeProblems(theme: StudyThemeInput): string[] {
  const { id } = theme;
  const problems: string[] = [];
  if (!ID_PATTERN.test(id)) problems.push(`${id}: id must match ${ID_PATTERN}`);
  if ((NEO_THEMES as readonly string[]).includes(id)) problems.push(`${id}: collides with a core theme id`);
  if (!(THEME_SCENES as readonly string[]).includes(theme.scene)) {
    problems.push(`${id}: scene must be one of ${THEME_SCENES.join(', ')}`);
  }
  problems.push(...l10nProblems(theme.name, `${id}.name`), ...l10nProblems(theme.tagline, `${id}.tagline`));
  problems.push(...referenceProblems(theme.reference, `${id}.reference`));
  problems.push(...fichaProblems(theme.ficha, theme.reference.sources.length, `${id}.ficha`));
  if (typeof theme.fonts !== 'string') {
    for (const key of [theme.fonts.sans, theme.fonts.display, theme.fonts.mono]) {
      if (key !== undefined && !(key in FONTS)) problems.push(`${id}: unknown font "${key}"`);
    }
  }
  problems.push(...valueProblems(theme));
  return problems;
}

export function coreFichaProblems(id: string, core: CoreFicha): string[] {
  const problems = [
    ...l10nProblems(core.tagline, `${id}.tagline`),
    ...referenceProblems(core.reference, `${id}.reference`),
    ...fichaProblems(core.ficha, core.reference.sources.length, `${id}.ficha`),
  ];
  if (!(SCENES as readonly string[]).includes(core.scene)) problems.push(`${id}: unknown scene "${core.scene}"`);
  if (core.predatesStudy !== true) problems.push(`${id}: core fichas must set predatesStudy: true`);
  return problems;
}
```

Replace the whole of `src/vite-env.d.ts` with:

```ts
/// <reference types="vite/client" />

/** Study essays, rendered to HTML by vite-plugin-essays.ts. */
declare module '*.md' {
  const html: string;
  export default html;
}
```

Replace the whole of `tsconfig.node.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "strict": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "skipLibCheck": true,
    "verbatimModuleSyntax": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts", "vite.site.config.ts", "vitest.config.ts", "playwright.config.ts", "css-target.ts", "vite-plugin-essays.ts"]
}
```

Create `vite-plugin-essays.ts`:

```ts
import type { Plugin } from 'vite';
import { renderMarkdown } from './src/study/markdown.ts';

const ESSAY = /\/src\/study\/essays\/[^/]+\/(es|en)\.md$/;

/** Renders the study's Markdown essays to HTML strings at build time: `import html from './es.md'`. */
export function essays(): Plugin {
  return {
    name: 'nbc-essays',
    transform(code, id) {
      if (id.includes('?') || !ESSAY.test(id)) return null;
      return { code: `export default ${JSON.stringify(renderMarkdown(code))};`, map: null };
    },
  };
}
```

In `vite.config.ts`:

Replace

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { CSS_TARGET } from './css-target';

// Library build: ESM-only JS bundle + a single dist/styles.css.
// Type declarations are emitted separately by `tsc -p tsconfig.lib.json`,
```

with

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { CSS_TARGET } from './css-target.ts';

// Library build: ESM-only JS bundle + a single dist/styles.css.
// Type declarations are emitted separately by `tsc -p tsconfig.lib.json`,
```

Replace the whole of `vite.site.config.ts` with:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { essays } from './vite-plugin-essays.ts';
import { fileURLToPath } from 'node:url';
import { CSS_TARGET } from './css-target.ts';

// Docs site. Examples import from 'neobrutalistcomponents' so the code shown
// on the site is exactly what a consumer would paste; the alias points that
// specifier at the library source.
export default defineConfig({
  plugins: [react(), essays()],
  resolve: {
    alias: {
      neobrutalistcomponents: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
    },
  },
  build: {
    cssTarget: CSS_TARGET,
    outDir: 'site-dist',
    emptyOutDir: true,
  },
  base: './',
});
```

In `vitest.config.ts`:

Replace

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      neobrutalistcomponents: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
```

with

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { essays } from './vite-plugin-essays.ts';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react(), essays()],
  resolve: {
    alias: {
      neobrutalistcomponents: fileURLToPath(new URL('./src/lib/index.ts', import.meta.url)),
```

- [ ] **Step 5: Run the tests and the gates**

Run: `npx vitest run src/study/markdown.test.ts src/study/essays.test.ts src/study/validate.test.ts`

Expected: PASS

```text
Test Files  3 passed (3)
Tests  52 passed (52)
```

Run: `npx vitest run`

Expected: PASS

```text
Test Files  38 passed (38)
Tests  835 passed | 4 skipped (839)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

Run: `npm run build:site`

Expected: exit code 0 (the essays plugin loads with the site config).

- [ ] **Step 6: Commit**

```bash
git add package-lock.json package.json src/study/essays.test.ts src/study/essays.ts src/study/markdown.test.ts src/study/markdown.ts src/study/validate.ts src/vite-env.d.ts tsconfig.node.json vite-plugin-essays.ts vite.config.ts vite.site.config.ts vitest.config.ts
git commit -F - <<'EOF'
feat(study): render essays from Markdown at build time, and validate them

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

### Task 2: Language routes and a bilingual shell

Every route now carries the language (D10). `parseHash` turns a hash into either a page (language, route, path, query) or a redirect; `App` follows a redirect with `replaceHash`, which replaces the address and tells listeners at once, so old links neither add history entries nor loop. The dictionary in `src/site/i18n.ts` holds every site string in both languages — including those later tasks use — and its test rejects empty strings. The top bar gets the study's sections and a language link that keeps the current page and query; the technical docs stay in English, with a one-line notice in Spanish. The old home page becomes the Library page (`git mv`). Until later tasks build them, the study route shows the Library page, the atlas route the old Themes page, and the other study routes the not-found page.

**Files:**
- Test: `e2e/site.spec.ts`
- Modify: `src/site/App.tsx`
- Modify: `src/site/Shell.tsx`
- Modify: `src/site/ThemeSwitcher.tsx`
- Modify: `src/site/docs/ComponentNav.tsx`
- Test (new): `src/site/i18n.test.ts`
- Create: `src/site/i18n.ts`
- Test (new): `src/site/lang.test.ts`
- Create: `src/site/lang.ts`
- Modify: `src/site/pages/ComponentPage.tsx`
- Modify: `src/site/pages/ComponentsIndex.tsx`
- Rename: `src/site/pages/Home.tsx` → `src/site/pages/Library.tsx`
- Modify: `src/site/pages/NotFound.tsx`
- Test (new): `src/site/router.test.ts`
- Modify: `src/site/router.ts`
- Modify: `src/site/site.css`

**Interfaces:**
- Consumes: `Lang`, `L10n`, `LANGS`, `Scene`, `ThemeScene`, `THEME_SCENES`, `ReferenceKind`, `ShadowKind`, `PaletteOrigin`, `BorderFacet`, `CornerFacet` (`src/study/types.ts`); `CONTRAST_PAIRS` (`src/lib/themes/contract.ts`).
- Produces: `src/site/i18n.ts`: `UI` and `type UIKey`, `SCENE_TEXT`, `KIND_TEXT`, `SCHEME_TEXT`, `BORDER_TEXT`, `SHADOW_TEXT`, `CORNER_TEXT`, `PALETTE_TEXT`, `PAIR_TEXT` (keyed `` `${fg} ${bg}` ``), `themeCount(lang, n)`, `decadeLabel(lang, decade)`, `LangContext`, `useLang(): Lang`, `useT(): (key: UIKey) => string`. `src/site/router.ts`: `type Route` (`study`, `scenes`, `scene` + `scene: ThemeScene`, `atlas`, `theme` + `id`, `origins`, `method`, `credits`, `library`, `components`, `component` + `slug`, `blocks`, `start`, `agents`, `not-found` + `path`), `type Location`, `routeOf(path)`, `toHash(lang, path, query?)`, `parseHash(hash, fallback)`, `replaceHash(hash)`, `useHash()`. `src/site/lang.ts`: `detectLang()`, `rememberLang(lang)`. `src/site/App.tsx`: `type PageLocation`. `src/site/pages/Library.tsx`: `Library()`.

- [ ] **Step 1: Write the failing tests**

Append to the end of `e2e/site.spec.ts`:

```ts

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
```

Create `src/site/i18n.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { CONTRAST_PAIRS } from '../lib/themes/contract';
import { LANGS, REFERENCE_KINDS, SCENES, SHADOW_KINDS } from '../study/types';
import type { L10n } from '../study/types';
import {
  BORDER_TEXT,
  CORNER_TEXT,
  KIND_TEXT,
  PAIR_TEXT,
  PALETTE_TEXT,
  SCENE_TEXT,
  SCHEME_TEXT,
  SHADOW_TEXT,
  UI,
  decadeLabel,
  themeCount,
} from './i18n';

const entries = (record: Record<string, L10n>, prefix: string) => Object.entries(record).map(([k, v]) => [`${prefix}.${k}`, v] as const);

describe('site dictionary', () => {
  it('has every string in both languages', () => {
    const all = [
      ...entries(UI, 'UI'),
      ...Object.entries(SCENE_TEXT).flatMap(([k, v]) => [[`scene.${k}.name`, v.name] as const, [`scene.${k}.summary`, v.summary] as const]),
      ...entries(KIND_TEXT, 'kind'),
      ...entries(SCHEME_TEXT, 'scheme'),
      ...entries(BORDER_TEXT, 'border'),
      ...entries(SHADOW_TEXT, 'shadow'),
      ...entries(CORNER_TEXT, 'corners'),
      ...entries(PALETTE_TEXT, 'palette'),
      ...entries(PAIR_TEXT, 'pair'),
    ];
    const empty = all.flatMap(([where, value]) => LANGS.filter((lang) => !value[lang]?.trim()).map((lang) => `${where}.${lang}`));
    expect(empty).toEqual([]);
  });

  it('covers every scene, kind, shadow and contrast pair', () => {
    expect(Object.keys(SCENE_TEXT).sort()).toEqual([...SCENES].sort());
    expect(Object.keys(KIND_TEXT).sort()).toEqual([...REFERENCE_KINDS].sort());
    expect(Object.keys(SHADOW_TEXT).sort()).toEqual([...SHADOW_KINDS].sort());
    expect(CONTRAST_PAIRS.map((p) => `${p.fg} ${p.bg}`).filter((key) => !PAIR_TEXT[key])).toEqual([]);
    expect(CONTRAST_PAIRS.map((p) => PAIR_TEXT[`${p.fg} ${p.bg}`].en)).toEqual(CONTRAST_PAIRS.map((p) => p.why));
  });

  it('counts and names decades in both languages', () => {
    expect([themeCount('es', 1), themeCount('es', 9), themeCount('en', 1), themeCount('en', 9)]).toEqual(['1 tema', '9 temas', '1 theme', '9 themes']);
    expect([decadeLabel('es', 1970), decadeLabel('en', 1990)]).toEqual(['Años 70', '1990s']);
  });
});
```

Create `src/site/lang.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectLang, rememberLang } from './lang';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('detectLang', () => {
  it('uses the remembered language first', () => {
    rememberLang('es');
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    expect(detectLang()).toBe('es');
  });

  it('falls back to the browser language: es* → es, anything else → en', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('es-MX');
    expect(detectLang()).toBe('es');
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-DE');
    expect(detectLang()).toBe('en');
  });

  it('ignores a corrupted stored value', () => {
    localStorage.setItem('nbc-site-lang', 'klingon');
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-GB');
    expect(detectLang()).toBe('en');
  });
});
```

Create `src/site/router.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { parseHash, replaceHash, routeOf, toHash } from './router';

describe('parseHash', () => {
  it('reads the language prefix and the route', () => {
    expect(parseHash('#/es/atlas', 'en')).toMatchObject({ kind: 'page', lang: 'es', route: { name: 'atlas' }, path: '/atlas' });
    expect(parseHash('#/en/', 'es')).toMatchObject({ kind: 'page', lang: 'en', route: { name: 'study' }, path: '/' });
    expect(parseHash('#/es', 'en')).toMatchObject({ kind: 'page', lang: 'es', route: { name: 'study' } });
  });

  it('keeps the query inside the hash', () => {
    const location = parseHash('#/en/atlas?scene=japan&q=%E4%B8%AD%E9%8A%80', 'en');
    expect(location.kind === 'page' && location.query.get('q')).toBe('中銀');
    expect(location.kind === 'page' && location.query.get('scene')).toBe('japan');
  });

  it('redirects legacy addresses, keeping their path, into the fallback language', () => {
    expect(parseHash('', 'es')).toEqual({ kind: 'redirect', to: '#/es/' });
    expect(parseHash('#/', 'en')).toEqual({ kind: 'redirect', to: '#/en/' });
    expect(parseHash('#/components/button', 'en')).toEqual({ kind: 'redirect', to: '#/en/components/button' });
    expect(parseHash('#/start', 'es')).toEqual({ kind: 'redirect', to: '#/es/start' });
  });

  it('sends the old Themes page to the atlas', () => {
    expect(parseHash('#/themes', 'es')).toEqual({ kind: 'redirect', to: '#/es/atlas' });
  });
});

describe('routeOf', () => {
  it.each([
    ['/scenes', { name: 'scenes' }],
    ['/scene/japan', { name: 'scene', scene: 'japan' }],
    ['/theme/sesc-pompeia', { name: 'theme', id: 'sesc-pompeia' }],
    ['/origins', { name: 'origins' }],
    ['/method', { name: 'method' }],
    ['/credits', { name: 'credits' }],
    ['/library', { name: 'library' }],
    ['/components/button', { name: 'component', slug: 'button' }],
  ])('%s', (path, route) => {
    expect(routeOf(path)).toEqual(route);
  });

  it('origins is its own page, not a scene; unknown paths are not found', () => {
    expect(routeOf('/scene/origins')).toEqual({ name: 'not-found', path: '/scene/origins' });
    expect(routeOf('/theme/Bad_Id')).toEqual({ name: 'not-found', path: '/theme/Bad_Id' });
    expect(routeOf('/constructor')).toEqual({ name: 'not-found', path: '/constructor' });
  });
});

describe('toHash', () => {
  it('prefixes the language and appends a non-empty query', () => {
    expect(toHash('es', '/')).toBe('#/es/');
    expect(toHash('en', '/atlas', new URLSearchParams({ scene: 'latam' }))).toBe('#/en/atlas?scene=latam');
    expect(toHash('en', '/atlas', new URLSearchParams())).toBe('#/en/atlas');
  });
});

describe('replaceHash', () => {
  it('changes the hash without a history entry and notifies listeners synchronously', () => {
    const before = window.history.length;
    let heard = '';
    const listener = () => {
      heard = window.location.hash;
    };
    window.addEventListener('hashchange', listener);
    replaceHash('#/es/atlas?scene=latam');
    window.removeEventListener('hashchange', listener);
    expect(heard).toBe('#/es/atlas?scene=latam');
    expect(window.history.length).toBe(before);
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/site/router.test.ts src/site/lang.test.ts src/site/i18n.test.ts`

Expected: FAIL

```text
TypeError: routeOf is not a function
FAIL  src/site/router.test.ts > routeOf > origins is its own page, not a scene; unknown paths are not found
FAIL  src/site/router.test.ts > toHash > prefixes the language and appends a non-empty query
TypeError: toHash is not a function
FAIL  src/site/router.test.ts > replaceHash > changes the hash without a history entry and notifies listeners synchronously
TypeError: replaceHash is not a function
```

Run: `npx playwright test -g "language routes|without a history entry" --reporter=line`

Expected: FAIL

```text
Error: expect(page).toHaveURL(expected) failed
Error: expect(locator).toHaveText(expected) failed
2 failed
```

(Playwright builds the site and serves it with `vite preview` on port 4173 first.)

- [ ] **Step 3: Implement**

Replace the whole of `src/site/App.tsx` with:

```tsx
import { useEffect, useMemo } from 'react';
import { NeoProvider } from 'neobrutalistcomponents';
import { Shell } from './Shell';
import { useSitePrefs } from './prefs';
import type { SitePrefs } from './prefs';
import { parseHash, replaceHash, useHash } from './router';
import type { Location, Route } from './router';
import { detectLang, rememberLang } from './lang';
import { LangContext, UI } from './i18n';
import type { UIKey } from './i18n';
import { SitePrefsContext } from './prefsContext';
import { Library } from './pages/Library';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
import { Themes } from './pages/Themes';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
import { Agents } from './pages/Agents';
import { NotFound } from './pages/NotFound';

export type PageLocation = Extract<Location, { kind: 'page' }>;

function Page({ route }: { route: Route }) {
  switch (route.name) {
    // Until the study home exists (study plan 2, Task 8) the study route shows the library page.
    case 'study':
    case 'library':
      return <Library />;
    // Until the atlas exists (Task 5) the atlas route shows the old Themes page.
    case 'atlas':
      return <Themes />;
    case 'components':
      return <ComponentsIndex />;
    case 'component':
      return <ComponentPage slug={route.slug} />;
    case 'blocks':
      return <Blocks />;
    case 'start':
      return <Start />;
    case 'agents':
      return <Agents />;
    default:
      return <NotFound />;
  }
}

const TITLES: Partial<Record<Route['name'], UIKey>> = {
  study: 'titleStudy',
  scenes: 'titleScenes',
  atlas: 'titleAtlas',
  origins: 'titleOrigins',
  method: 'titleMethod',
  credits: 'titleCredits',
  library: 'titleLibrary',
  components: 'titleComponents',
  blocks: 'titleBlocks',
  start: 'titleStart',
  agents: 'titleAgents',
  'not-found': 'titleNotFound',
};

function Site({ location, prefs, update }: { location: PageLocation; prefs: SitePrefs; update: (next: Partial<SitePrefs>) => void }) {
  const { lang, route } = location;
  const routeKey = `${lang}:${location.path}`;

  useEffect(() => {
    rememberLang(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const key = TITLES[route.name];
    const title = route.name === 'component' ? route.slug : route.name === 'theme' ? route.id : key ? UI[key][lang] : undefined;
    document.title = title ? `${title} — neobrutalistcomponents` : 'neobrutalistcomponents';
    window.scrollTo({ top: 0 });
  }, [routeKey, route, lang]);

  return (
    <LangContext value={lang}>
      <NeoProvider theme={prefs.theme} mode={prefs.mode === 'native' ? undefined : prefs.mode}>
        <Shell location={location} prefs={prefs} onPrefsChange={update}>
          <Page route={route} />
        </Shell>
      </NeoProvider>
    </LangContext>
  );
}

export function App() {
  const [prefs, update] = useSitePrefs();
  const hash = useHash();
  const location = useMemo(() => parseHash(hash, detectLang()), [hash]);
  const ctx = useMemo(() => ({ prefs, update }), [prefs, update]);

  useEffect(() => {
    if (location.kind === 'redirect') replaceHash(location.to);
  }, [location]);

  if (location.kind === 'redirect') return null;
  return (
    <SitePrefsContext value={ctx}>
      <Site location={location} prefs={prefs} update={update} />
    </SitePrefsContext>
  );
}
```

Replace the whole of `src/site/Shell.tsx` with:

```tsx
import type { ReactNode } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { SitePrefs } from './prefs';
import { toHash } from './router';
import type { Route } from './router';
import type { PageLocation } from './App';
import { useT } from './i18n';
import type { UIKey } from './i18n';
import { PACKAGE, REPO_URL } from '../docs/guide';
import pkg from '../../package.json';

const NAV: { key: UIKey; path: string; match: Route['name'][] }[] = [
  { key: 'navStudy', path: '/', match: ['study'] },
  { key: 'navScenes', path: '/scenes', match: ['scenes', 'scene', 'origins'] },
  { key: 'navAtlas', path: '/atlas', match: ['atlas', 'theme'] },
  { key: 'navLibrary', path: '/library', match: ['library', 'blocks', 'start', 'agents'] },
  { key: 'navComponents', path: '/components', match: ['components', 'component'] },
];

/** The library's technical documentation, which stays in English in both languages. */
const DOCS: Route['name'][] = ['library', 'components', 'component', 'blocks', 'start', 'agents'];

interface ShellProps {
  location: PageLocation;
  prefs: SitePrefs;
  onPrefsChange: (next: Partial<SitePrefs>) => void;
  children: ReactNode;
}

export function Shell({ location, prefs, onPrefsChange, children }: ShellProps) {
  const t = useT();
  const { lang, route } = location;
  const other = lang === 'es' ? 'en' : 'es';
  const englishDocs = lang === 'es' && DOCS.includes(route.name);

  return (
    <div className="site">
      <a
        className="site-skip"
        href={toHash(lang, location.path)}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        {t('skip')}
      </a>
      <header className="site-bar">
        <a className="site-brand" href={toHash(lang, '/')} aria-label={t('brandHome')}>
          <span className="site-brand__mark" aria-hidden="true">
            nb
          </span>
          <span className="site-brand__name">neobrutalist­components</span>
        </a>
        <nav className="site-nav" aria-label={t('navPrimary')}>
          {NAV.map((item) => (
            <a
              key={item.path}
              href={toHash(lang, item.path)}
              className="site-nav__link"
              aria-current={item.match.includes(route.name) ? 'page' : undefined}
            >
              {t(item.key)}
            </a>
          ))}
        </nav>
        <div className="site-bar__end">
          <ThemeSwitcher prefs={prefs} onChange={onPrefsChange} />
          <a className="site-bar__lang" href={toHash(other, location.path, location.query)} hrefLang={other} lang={other}>
            {t('switchLanguage')}
          </a>
          <a className="site-bar__repo" href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </header>
      <main id="main" className="site-main" tabIndex={-1}>
        {englishDocs ? <p className="site-docs-note">{t('docsInEnglish')}</p> : null}
        {englishDocs ? <div lang="en">{children}</div> : children}
      </main>
      <footer className="site-footer">
        <p>
          {PACKAGE} v{pkg.version}. {t('footerNote')}
        </p>
        <nav aria-label={t('footerNav')} className="site-footer__links">
          <a href={toHash(lang, '/credits')}>{t('footerCredits')}</a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={`https://www.npmjs.com/package/${PACKAGE}`} target="_blank" rel="noreferrer">
            npm
          </a>
          <a href="llms.txt">llms.txt</a>
          <a href="llms-full.txt">llms-full.txt</a>
        </nav>
      </footer>
    </div>
  );
}
```

Replace the whole of `src/site/ThemeSwitcher.tsx` with:

```tsx
import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import type { ModePref, SitePrefs } from './prefs';
import { useT } from './i18n';
import type { UIKey } from './i18n';

const MODES: { value: ModePref; label: UIKey }[] = [
  { value: 'native', label: 'modeNative' },
  { value: 'light', label: 'modeLight' },
  { value: 'dark', label: 'modeDark' },
  { value: 'system', label: 'modeSystem' },
];

interface Props {
  prefs: SitePrefs;
  onChange: (next: Partial<SitePrefs>) => void;
}

export function ThemeSwitcher({ prefs, onChange }: Props) {
  const t = useT();
  return (
    <div className="site-switcher">
      <div className="site-switcher__themes" role="group" aria-label={t('themeGroup')}>
        {NEO_THEMES.map((id) => (
          <button
            key={id}
            type="button"
            className="site-swatch"
            aria-pressed={prefs.theme === id}
            title={`${THEME_INFO[id].name} — ${THEME_INFO[id].tagline}`}
            onClick={() => onChange({ theme: id })}
          >
            <span className="site-swatch__chip" aria-hidden="true">
              {THEME_INFO[id].swatch.slice(0, 3).map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </span>
            <span className="site-swatch__name">{THEME_INFO[id].name}</span>
          </button>
        ))}
      </div>
      <label className="site-switcher__mode">
        <span className="site-visually-hidden">{t('colorScheme')}</span>
        <select value={prefs.mode} onChange={(e) => onChange({ mode: e.target.value as ModePref })}>
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {t(m.label)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
```

Replace the whole of `src/site/docs/ComponentNav.tsx` with:

```tsx
import { COMPONENTS } from '../../docs/meta';
import { GROUP_ORDER } from '../../docs/types';
import { useLang } from '../i18n';
import { toHash } from '../router';

export function ComponentNav({ current }: { current?: string }) {
  const lang = useLang();
  return (
    <nav className="site-sidenav" aria-label="Components">
      {GROUP_ORDER.map((group) => {
        const items = COMPONENTS.filter((c) => c.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group} className="site-sidenav__group">
            <p className="site-sidenav__heading">{group}</p>
            <ul>
              {items.map((c) => (
                <li key={c.slug}>
                  <a href={toHash(lang, `/components/${c.slug}`)} aria-current={current === c.slug ? 'page' : undefined}>
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
```

Create `src/site/i18n.ts`:

```ts
/**
 * Every string of the site's chrome and study pages, in both languages. No
 * i18n library: plain records of { es, en }, checked by i18n.test.ts. Essays
 * and fichas carry their own bilingual text.
 */
import { createContext, use } from 'react';
import type { BorderFacet, CornerFacet, L10n, Lang, PaletteOrigin, ReferenceKind, Scene, ShadowKind } from '../study/types';

export const UI = {
  // Shell
  skip: { es: 'Saltar al contenido', en: 'Skip to content' },
  brandHome: { es: 'neobrutalistcomponents, inicio', en: 'neobrutalistcomponents home' },
  navPrimary: { es: 'Principal', en: 'Primary' },
  navStudy: { es: 'Estudio', en: 'Study' },
  navScenes: { es: 'Escenas', en: 'Scenes' },
  navAtlas: { es: 'Atlas', en: 'Atlas' },
  navLibrary: { es: 'Librería', en: 'Library' },
  navComponents: { es: 'Componentes', en: 'Components' },
  /** Link text of the language switch: the other language's own name. */
  switchLanguage: { es: 'English', en: 'Español' },
  footerNav: { es: 'Pie de página', en: 'Footer' },
  footerNote: {
    es: 'Licencia MIT. Hecho con sus propios componentes: cambia el tema arriba y esta página cambia con él.',
    en: 'MIT licensed. Built with its own components — switch the theme above and this page changes with it.',
  },
  footerCredits: { es: 'Créditos', en: 'Credits' },
  docsInEnglish: {
    es: 'La documentación técnica de la librería está en inglés.',
    en: 'The technical documentation is in English.',
  },
  loading: { es: 'Cargando…', en: 'Loading…' },

  // Theme switcher
  themeGroup: { es: 'Tema', en: 'Theme' },
  colorScheme: { es: 'Esquema de color', en: 'Color scheme' },
  modeNative: { es: 'Por defecto del tema', en: 'Theme default' },
  modeLight: { es: 'Claro', en: 'Light' },
  modeDark: { es: 'Oscuro', en: 'Dark' },
  modeSystem: { es: 'Sistema', en: 'System' },
  moreThemes: { es: 'Más temas', en: 'More themes' },

  // Page titles
  titleStudy: { es: 'El estudio', en: 'The study' },
  titleScenes: { es: 'Escenas', en: 'Scenes' },
  titleAtlas: { es: 'Atlas', en: 'Atlas' },
  titleOrigins: { es: 'Orígenes', en: 'Origins' },
  titleMethod: { es: 'Método', en: 'Method' },
  titleCredits: { es: 'Créditos', en: 'Credits' },
  titleLibrary: { es: 'Librería', en: 'Library' },
  titleComponents: { es: 'Componentes', en: 'Components' },
  titleBlocks: { es: 'Bloques', en: 'Blocks' },
  titleStart: { es: 'Primeros pasos', en: 'Get started' },
  titleAgents: { es: 'Para agentes', en: 'For agents' },
  titleNotFound: { es: 'No encontrado', en: 'Not found' },

  // Study home
  studyTitle: { es: 'El neobrutalismo en las interfaces', en: 'Neobrutalism in interfaces' },
  studyLead: {
    es: 'Un estudio en cuatro escenas —Japón, Alemania, Estados Unidos y Latinoamérica— y en sus orígenes. Cada tema del atlas lee una obra documentada y cita sus fuentes.',
    en: 'A study in four scenes — Japan, Germany, the United States and Latin America — and in their origins. Each theme in the atlas reads one documented work and cites its sources.',
  },
  scenesHeading: { es: 'Escenas', en: 'Scenes' },
  openAtlas: { es: 'Abrir el atlas', en: 'Open the atlas' },
  readMethod: { es: 'Cómo se hace un tema', en: 'How a theme is made' },
  mosaicLabel: { es: 'Los temas del estudio', en: 'The themes of the study' },
  loadError: {
    es: 'No se pudo cargar este contenido. Recarga la página para intentarlo de nuevo.',
    en: 'This content could not load. Reload the page to try again.',
  },
  useHeading: { es: 'Usarlos en tu app', en: 'Use them in your app' },
  useBody: {
    es: 'Un tema del estudio es un tema más de la librería: importa su hoja de estilos y pasa su id a NeoProvider. Los temas del estudio llegan con la versión 1.1.0.',
    en: 'A study theme is one more library theme: import its stylesheet and pass its id to NeoProvider. Study themes ship with version 1.1.0.',
  },

  // Scenes and scene pages
  scenesLead: {
    es: 'Cuatro lecturas regionales de una misma idea, y el lugar donde empezó.',
    en: 'Four regional readings of one idea, and the place where it began.',
  },
  timelineHeading: { es: 'Línea de tiempo', en: 'Timeline' },
  sceneThemes: { es: 'Temas de esta escena', en: 'Themes in this scene' },
  otherScenes: { es: 'Otras escenas', en: 'Other scenes' },
  originsThemes: { es: 'Temas que parten de aquí', en: 'Themes that start here' },

  // Atlas
  atlasLead: {
    es: 'Todos los temas, del estudio y de la librería. Cada tarjeta se pinta con los tokens de su propio tema.',
    en: 'Every theme, from the study and the library. Each card is painted with its own theme’s tokens.',
  },
  filters: { es: 'Filtros', en: 'Filters' },
  facetScene: { es: 'Escena', en: 'Scene' },
  facetDecade: { es: 'Década', en: 'Decade' },
  facetKind: { es: 'Obra', en: 'Kind of work' },
  facetScheme: { es: 'Esquema nativo', en: 'Native scheme' },
  facetBorder: { es: 'Borde', en: 'Border' },
  facetShadow: { es: 'Sombra', en: 'Shadow' },
  facetCorners: { es: 'Esquinas', en: 'Corners' },
  any: { es: 'Todas', en: 'Any' },
  search: { es: 'Buscar', en: 'Search' },
  searchPlaceholder: { es: 'Nombre, obra, autoría o lugar', en: 'Name, work, author or place' },
  noResults: { es: 'Ningún tema coincide con estos filtros.', en: 'No theme matches these filters.' },
  clearFilters: { es: 'Quitar filtros', en: 'Clear filters' },
  fromLibrary: { es: 'Librería', en: 'Library' },

  // Theme page
  refLabel: { es: 'Referencia', en: 'Reference' },
  byLabel: { es: 'Autoría', en: 'By' },
  whenWhere: { es: 'Fecha y lugar', en: 'When and where' },
  sceneLabel: { es: 'Escena', en: 'Scene' },
  typefacesLabel: { es: 'Tipografías', en: 'Typefaces' },
  schemeLabel: { es: 'Esquema nativo', en: 'Native scheme' },
  anonymous: { es: 'Anónimo / vernáculo', en: 'Anonymous / vernacular' },
  systemFonts: { es: 'Fuentes del sistema', en: 'System fonts' },
  documented: { es: 'Lo documentado', en: 'What is documented' },
  reading: { es: 'La lectura', en: 'The reading' },
  palette: { es: 'Paleta', en: 'Palette' },
  sources: { es: 'Fuentes', en: 'Sources' },
  photoBy: { es: 'Foto:', en: 'Photo:' },
  via: { es: 'vía', en: 'via' },
  converted: { es: 'redimensionada y convertida a AVIF', en: 'resized and converted to AVIF' },
  noImage: { es: 'No hay una imagen libre de esta obra.', en: 'There is no free image of this work.' },
  seeArchive: { es: 'Ver la página archivada en la Wayback Machine', en: 'See the archived page in the Wayback Machine' },
  seeSource: { es: 'Ver la fuente principal', en: 'See the main source' },
  predatesStudy: {
    es: 'Este tema es anterior al estudio: su ficha nombra la referencia más cercana.',
    en: 'This theme predates the study: its ficha names its closest reference.',
  },
  specimenHeading: { es: 'El tema en uso', en: 'The theme at work' },
  tokensHeading: { es: 'Tokens y contraste', en: 'Tokens and contrast' },
  installHeading: { es: 'Instalar', en: 'Install' },
  installStudyNote: { es: 'Llega con neobrutalistcomponents 1.1.0.', en: 'Ships with neobrutalistcomponents 1.1.0.' },
  useAcrossSite: { es: 'Usar en todo el sitio', en: 'Use across the site' },
  inUse: { es: 'En uso en todo el sitio', en: 'In use across the site' },
  previousTheme: { es: 'Anterior', en: 'Previous' },
  nextTheme: { es: 'Siguiente', en: 'Next' },
  themeNav: { es: 'Temas de la escena', en: 'Themes in this scene' },
  loadingTheme: { es: 'Cargando el tema…', en: 'Loading the theme…' },
  themeLoadError: {
    es: 'No se pudo cargar este tema. Recarga la página para intentarlo de nuevo.',
    en: 'This theme could not load. Reload the page to try again.',
  },
  backToAtlas: { es: 'Volver al atlas', en: 'Back to the atlas' },

  // Token tables
  colToken: { es: 'Token', en: 'Token' },
  colSwatch: { es: 'Muestra', en: 'Swatch' },
  colValue: { es: 'Valor', en: 'Value' },
  colPair: { es: 'Par', en: 'Pair' },
  colRatio: { es: 'Ratio', en: 'Ratio' },
  colNeeds: { es: 'Mínimo', en: 'Needs' },

  // Method
  methodLead: {
    es: 'Cómo se hace un tema a partir de una obra, y las reglas que lo comprueban.',
    en: 'How a theme is made from a work, and the rules that check it.',
  },
  familiesHeading: { es: 'Familias de detalles', en: 'Detail families' },
  paramMeaning: { es: 'Qué hace', en: 'What it does' },
  paramToken: { es: 'un token de color', en: 'a colour token' },
  touchesLabel: { es: 'Toca', en: 'Touches' },
  paramName: { es: 'Parámetro', en: 'Parameter' },
  paramDefault: { es: 'Por defecto', en: 'Default' },
  paramRange: { es: 'Rango', en: 'Range' },
  contractHeading: { es: 'El contrato de contraste', en: 'The contrast contract' },
  contractLead: {
    es: 'Ningún tema se publica si uno de estos pares falla, en claro o en oscuro, texturas incluidas.',
    en: 'No theme ships if any of these pairs fails, in light or dark, textures included.',
  },

  // Credits
  creditsLead: {
    es: 'Cada fotografía conserva su propia licencia; el código y el resto del sitio son MIT.',
    en: 'Each photograph keeps its own licence; the code and the rest of the site are MIT.',
  },
  photographsHeading: { es: 'Fotografías', en: 'Photographs' },
  fontsHeading: { es: 'Tipografías', en: 'Typefaces' },
  colTheme: { es: 'Tema', en: 'Theme' },
  colAuthor: { es: 'Autoría', en: 'Author' },
  colLicense: { es: 'Licencia', en: 'Licence' },
  colSource: { es: 'Fuente', en: 'Source' },
  colFamily: { es: 'Familia', en: 'Family' },
  colUsedBy: { es: 'La usan', en: 'Used by' },

  // Not found
  notFoundTitle: { es: 'Nada en esta dirección', en: 'Nothing at this address' },
  notFoundBody: { es: 'Puede que la página haya cambiado de sitio.', en: 'The page may have moved.' },
  goStudy: { es: 'Ir al estudio', en: 'Go to the study' },
} as const satisfies Record<string, L10n>;

export type UIKey = keyof typeof UI;

export const SCENE_TEXT: Record<Scene, { readonly name: L10n; readonly summary: L10n }> = {
  japan: {
    name: { es: 'Japón', en: 'Japan' },
    summary: { es: 'Metabolismo, cápsulas y la densidad de la web japonesa.', en: 'Metabolism, capsules and the density of the Japanese web.' },
  },
  germany: {
    name: { es: 'Alemania', en: 'Germany' },
    summary: { es: 'Ulm, la rotulación DIN y el hormigón de Berlín Occidental.', en: 'Ulm, DIN lettering and West Berlin concrete.' },
  },
  usa: {
    name: { es: 'Estados Unidos', en: 'United States' },
    summary: {
      es: 'Páginas web llanas, Emigre, Ray Gun y el neobrutalismo de producto.',
      en: 'Plain web pages, Emigre, Ray Gun and product neobrutalism.',
    },
  },
  latam: {
    name: { es: 'Latinoamérica', en: 'Latin America' },
    summary: {
      es: 'Brutalismo paulista, poesía concreta, Cybersyn y carteles chicha.',
      en: 'Paulista brutalism, concrete poetry, Cybersyn and chicha posters.',
    },
  },
  origins: {
    name: { es: 'Orígenes', en: 'Origins' },
    summary: {
      es: 'Béton brut, el New Brutalism británico, el estilo suizo y la web brutalista.',
      en: 'Béton brut, British New Brutalism, the Swiss style and brutalist websites.',
    },
  },
};

export const KIND_TEXT: Record<ReferenceKind, L10n> = {
  architecture: { es: 'Arquitectura', en: 'Architecture' },
  graphic: { es: 'Gráfica', en: 'Graphic design' },
  type: { es: 'Tipografía', en: 'Typeface' },
  web: { es: 'Web', en: 'Website' },
  software: { es: 'Software', en: 'Software' },
  signage: { es: 'Señalética', en: 'Signage' },
  object: { es: 'Objeto', en: 'Object' },
};

export const SCHEME_TEXT: Record<'light' | 'dark', L10n> = {
  light: { es: 'claro', en: 'light' },
  dark: { es: 'oscuro', en: 'dark' },
};

export const BORDER_TEXT: Record<BorderFacet, L10n> = {
  hairline: { es: 'Fino', en: 'Hairline' },
  standard: { es: 'Medio', en: 'Standard' },
  heavy: { es: 'Grueso', en: 'Heavy' },
};

export const SHADOW_TEXT: Record<ShadowKind, L10n> = {
  none: { es: 'Sin sombra', en: 'None' },
  hard: { es: 'Dura', en: 'Hard' },
  double: { es: 'Doble', en: 'Double' },
  soft: { es: 'Suave', en: 'Soft' },
};

export const CORNER_TEXT: Record<CornerFacet, L10n> = {
  square: { es: 'Rectas', en: 'Square' },
  soft: { es: 'Suaves', en: 'Soft' },
  round: { es: 'Redondas', en: 'Round' },
};

export const PALETTE_TEXT: Record<PaletteOrigin, L10n> = {
  documented: { es: 'documentada', en: 'documented' },
  sampled: { es: 'muestreada', en: 'sampled' },
  interpreted: { es: 'interpretada', en: 'interpreted' },
};

/** The `why` of every CONTRAST_PAIRS entry, keyed `${fg} ${bg}`. */
export const PAIR_TEXT: Record<string, L10n> = {
  '--nbc-fg --nbc-bg': { es: 'texto sobre la página', en: 'body text on page' },
  '--nbc-fg --nbc-surface': { es: 'texto en tarjetas y campos', en: 'text on cards and fields' },
  '--nbc-fg --nbc-surface-alt': { es: 'texto en filas resaltadas y franjas', en: 'text on hover rows, stripes' },
  '--nbc-fg --nbc-surface-fill': { es: 'texto en superficies con relleno', en: 'text on filled surfaces' },
  '--nbc-fg-muted --nbc-surface': { es: 'descripciones y textos de ejemplo', en: 'descriptions and placeholders' },
  '--nbc-fg-muted --nbc-bg': { es: 'texto secundario de la página', en: 'secondary page text' },
  '--nbc-primary-fg --nbc-primary': { es: 'etiqueta del botón principal', en: 'primary button label' },
  '--nbc-primary-fg --nbc-primary-fill': { es: 'etiqueta del botón principal sobre relleno', en: 'primary button label on fill' },
  '--nbc-accent-fg --nbc-accent': { es: 'insignia de acento', en: 'accent badge label' },
  '--nbc-info-fg --nbc-info': { es: 'insignia informativa', en: 'info badge label' },
  '--nbc-success-fg --nbc-success': { es: 'insignia de éxito', en: 'success badge label' },
  '--nbc-warning-fg --nbc-warning': { es: 'insignia de aviso', en: 'warning badge label' },
  '--nbc-danger-fg --nbc-danger': { es: 'insignia de peligro', en: 'danger badge label' },
  '--nbc-danger-fg --nbc-danger-fill': { es: 'etiqueta del botón de peligro', en: 'danger button label' },
  '--nbc-danger --nbc-surface': { es: 'mensajes de error', en: 'error messages' },
  '--nbc-border-color --nbc-bg': { es: 'bordes de los controles', en: 'control boundaries' },
  '--nbc-focus --nbc-bg': { es: 'indicador de foco', en: 'focus indicator' },
};

export function themeCount(lang: Lang, n: number): string {
  if (lang === 'es') return n === 1 ? '1 tema' : `${n} temas`;
  return n === 1 ? '1 theme' : `${n} themes`;
}

/** 1970 → 'Años 70' / '1970s'. */
export function decadeLabel(lang: Lang, decade: number): string {
  return lang === 'es' ? `Años ${String(decade).slice(2)}` : `${decade}s`;
}

export const LangContext = createContext<Lang>('en');

export function useLang(): Lang {
  return use(LangContext);
}

/** `t('navStudy')` in the current language. */
export function useT(): (key: UIKey) => string {
  const lang = useLang();
  return (key) => UI[key][lang];
}
```

Create `src/site/lang.ts`:

```ts
import { LANGS } from '../study/types';
import type { Lang } from '../study/types';

const KEY = 'nbc-site-lang';

/** The language for an address that carries none: the last one used, else the browser's. */
export function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored && (LANGS as readonly string[]).includes(stored)) return stored as Lang;
  } catch {
    // storage can be unavailable (private mode)
  }
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function rememberLang(lang: Lang): void {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // the URL still carries the language
  }
}
```

In `src/site/pages/ComponentPage.tsx`:

1. Replace

```tsx
import { PropsTable } from '../docs/PropsTable';
import { getExample } from '../docs/registry';
import { NotFound } from './NotFound';

export function ComponentPage({ slug }: { slug: string }) {
  const meta = findComponent(slug);
  if (!meta) return <NotFound />;
  const index = COMPONENTS.indexOf(meta);
```

with

```tsx
import { PropsTable } from '../docs/PropsTable';
import { getExample } from '../docs/registry';
import { NotFound } from './NotFound';
import { useLang } from '../i18n';
import { toHash } from '../router';

export function ComponentPage({ slug }: { slug: string }) {
  const lang = useLang();
  const meta = findComponent(slug);
  if (!meta) return <NotFound />;
  const index = COMPONENTS.indexOf(meta);
```

2. Replace

```tsx
      <article className="site-doc">
        <header className="site-doc__head">
          <p className="site-doc__crumbs">
            <a href="#/components">Components</a> <span aria-hidden="true">/</span> {meta.group}
          </p>
          <h1 className="site-h1">{meta.name}</h1>
          <p className="site-lead">{meta.summary}</p>
```

with

```tsx
      <article className="site-doc">
        <header className="site-doc__head">
          <p className="site-doc__crumbs">
            <a href={toHash(lang, '/components')}>Components</a> <span aria-hidden="true">/</span> {meta.group}
          </p>
          <h1 className="site-h1">{meta.name}</h1>
          <p className="site-lead">{meta.summary}</p>
```

3. Replace

```tsx

        <nav className="site-pager" aria-label="Previous and next component">
          {prev ? (
            <a href={`#/components/${prev.slug}`} rel="prev">
              <span className="site-pager__dir">Previous</span> {prev.name}
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a href={`#/components/${next.slug}`} rel="next">
              <span className="site-pager__dir">Next</span> {next.name}
            </a>
          )}
```

with

```tsx

        <nav className="site-pager" aria-label="Previous and next component">
          {prev ? (
            <a href={toHash(lang, `/components/${prev.slug}`)} rel="prev">
              <span className="site-pager__dir">Previous</span> {prev.name}
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a href={toHash(lang, `/components/${next.slug}`)} rel="next">
              <span className="site-pager__dir">Next</span> {next.name}
            </a>
          )}
```

In `src/site/pages/ComponentsIndex.tsx`:

1. Replace

```tsx
import { COMPONENTS } from '../../docs/meta';
import { GROUP_ORDER } from '../../docs/types';

export function ComponentsIndex() {
  return (
    <div className="site-page">
      <header className="site-page__head">
```

with

```tsx
import { COMPONENTS } from '../../docs/meta';
import { GROUP_ORDER } from '../../docs/types';
import { useLang } from '../i18n';
import { toHash } from '../router';

export function ComponentsIndex() {
  const lang = useLang();
  return (
    <div className="site-page">
      <header className="site-page__head">
```

2. Replace

```tsx
            <ul className="site-index">
              {items.map((c) => (
                <li key={c.slug}>
                  <a href={`#/components/${c.slug}`} className="site-index__item">
                    <span className="site-index__name">{c.name}</span>
                    <span className="site-index__summary">{c.summary}</span>
                  </a>
```

with

```tsx
            <ul className="site-index">
              {items.map((c) => (
                <li key={c.slug}>
                  <a href={toHash(lang, `/components/${c.slug}`)} className="site-index__item">
                    <span className="site-index__name">{c.name}</span>
                    <span className="site-index__summary">{c.summary}</span>
                  </a>
```

Rename `src/site/pages/Home.tsx` to `src/site/pages/Library.tsx`:

```bash
git mv src/site/pages/Home.tsx src/site/pages/Library.tsx
```

In `src/site/pages/Library.tsx`:

1. Replace

```tsx
import { INSTALL_CODE, SITE_URL } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { useSitePrefsContext } from '../prefsContext';

const PLATFORM: { term: string; text: string }[] = [
  { term: '@layer', text: 'Your CSS always wins. The library lives in cascade layers, so a plain rule in your stylesheet beats it without !important.' },
```

with

```tsx
import { INSTALL_CODE, SITE_URL } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { useSitePrefsContext } from '../prefsContext';
import { useLang } from '../i18n';
import { toHash } from '../router';

const PLATFORM: { term: string; text: string }[] = [
  { term: '@layer', text: 'Your CSS always wins. The library lives in cascade layers, so a plain rule in your stylesheet beats it without !important.' },
```

2. Replace

```tsx
  );
}

export function Home() {
  const llms = [
    '# neobrutalistcomponents',
    '',
```

with

```tsx
  );
}

/** The library's own landing page (it was the site's home before the study). */
export function Library() {
  const lang = useLang();
  const llms = [
    '# neobrutalistcomponents',
    '',
```

3. Replace

```tsx
          <CodeBlock code={INSTALL_CODE} label="Shell" />
          <div className="home-hero__ctas">
            <Button asChild size="lg" rightIcon={<ArrowRight />}>
              <a href="#/start">Set it up</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#/components">Browse components</a>
            </Button>
          </div>
        </div>
```

with

```tsx
          <CodeBlock code={INSTALL_CODE} label="Shell" />
          <div className="home-hero__ctas">
            <Button asChild size="lg" rightIcon={<ArrowRight />}>
              <a href={toHash(lang, '/start')}>Set it up</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={toHash(lang, '/components')}>Browse components</a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href={toHash(lang, '/blocks')}>See full screens</a>
            </Button>
          </div>
        </div>
```

4. Replace

```tsx
            would.
          </p>
          <Button asChild variant="secondary">
            <a href="#/agents">How agents use it</a>
          </Button>
        </div>
        <CodeBlock code={llms} label="llms.txt" />
```

with

```tsx
            would.
          </p>
          <Button asChild variant="secondary">
            <a href={toHash(lang, '/agents')}>How agents use it</a>
          </Button>
        </div>
        <CodeBlock code={llms} label="llms.txt" />
```

Replace the whole of `src/site/pages/NotFound.tsx` with:

```tsx
import { Button } from 'neobrutalistcomponents';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';

export function NotFound() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="site-page site-notfound">
      <h1 className="site-h1">{t('notFoundTitle')}</h1>
      <p className="site-lead">{t('notFoundBody')}</p>
      <Button asChild>
        <a href={toHash(lang, '/')}>{t('goStudy')}</a>
      </Button>
    </div>
  );
}
```

Replace the whole of `src/site/router.ts` with:

```ts
import { useSyncExternalStore } from 'react';
import { LANGS, THEME_SCENES } from '../study/types';
import type { Lang, ThemeScene } from '../study/types';

export type Route =
  | { name: 'study' }
  | { name: 'scenes' }
  | { name: 'scene'; scene: ThemeScene }
  | { name: 'atlas' }
  | { name: 'theme'; id: string }
  | { name: 'origins' }
  | { name: 'method' }
  | { name: 'credits' }
  | { name: 'library' }
  | { name: 'components' }
  | { name: 'component'; slug: string }
  | { name: 'blocks' }
  | { name: 'start' }
  | { name: 'agents' }
  | { name: 'not-found'; path: string };

/** A parsed hash: a page in a language, or a legacy address to redirect. */
export type Location =
  | {
      readonly kind: 'page';
      readonly lang: Lang;
      readonly route: Route;
      /** The path without the language prefix, e.g. '/atlas'. */
      readonly path: string;
      /** The hash's own query, e.g. #/es/atlas?scene=japan. */
      readonly query: URLSearchParams;
    }
  | { readonly kind: 'redirect'; readonly to: string };

const SIMPLE: Readonly<Record<string, Route>> = {
  '/': { name: 'study' },
  '/scenes': { name: 'scenes' },
  '/atlas': { name: 'atlas' },
  '/origins': { name: 'origins' },
  '/method': { name: 'method' },
  '/credits': { name: 'credits' },
  '/library': { name: 'library' },
  '/components': { name: 'components' },
  '/blocks': { name: 'blocks' },
  '/start': { name: 'start' },
  '/agents': { name: 'agents' },
};

const isLang = (value: string): value is Lang => (LANGS as readonly string[]).includes(value);
const isThemeScene = (value: string): value is ThemeScene => (THEME_SCENES as readonly string[]).includes(value);

export function routeOf(path: string): Route {
  if (Object.hasOwn(SIMPLE, path)) return SIMPLE[path];
  const scene = path.match(/^\/scene\/([a-z]+)$/);
  if (scene && isThemeScene(scene[1])) return { name: 'scene', scene: scene[1] };
  const theme = path.match(/^\/theme\/([a-z][a-z0-9-]{1,31})$/);
  if (theme) return { name: 'theme', id: theme[1] };
  const component = path.match(/^\/components\/([a-z0-9-]+)$/);
  if (component) return { name: 'component', slug: component[1] };
  return { name: 'not-found', path };
}

/** '#/es/atlas?scene=japan' for ('es', '/atlas', scene=japan). */
export function toHash(lang: Lang, path: string, query?: URLSearchParams): string {
  const search = query && query.size > 0 ? `?${query}` : '';
  return `#/${lang}${path === '/' ? '/' : path}${search}`;
}

export function parseHash(hash: string, fallback: Lang): Location {
  const raw = hash.replace(/^#/, '');
  const cut = raw.indexOf('?');
  const pathPart = cut === -1 ? raw : raw.slice(0, cut);
  const query = new URLSearchParams(cut === -1 ? '' : raw.slice(cut + 1));
  const path = pathPart.replace(/\/+$/, '') || '/';
  const first = path.split('/')[1] ?? '';
  if (isLang(first)) {
    const rest = path.slice(first.length + 1) || '/';
    return { kind: 'page', lang: first, route: routeOf(rest), path: rest, query };
  }
  // A legacy address without a language: keep it, add one. The old Themes page is now the atlas.
  return { kind: 'redirect', to: toHash(fallback, path === '/themes' ? '/atlas' : path, query) };
}

/**
 * Replaces the hash without adding a history entry, and tells useHash() at
 * once — so a controlled field bound to the URL (the atlas search) never
 * loses a keystroke waiting for an asynchronous hashchange.
 */
export function replaceHash(hash: string): void {
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hash}`);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

/** The current hash, kept in sync with the address bar. Links are plain `<a href="#/…">`. */
export function useHash(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash, () => '');
}
```

In `src/site/site.css`:

Replace

```css
  gap: var(--nbc-space-md);
  margin-inline-start: auto;
}
.site-bar__repo {
  font-size: var(--nbc-fs-sm);
  font-weight: var(--nbc-weight-label);
```

with

```css
  gap: var(--nbc-space-md);
  margin-inline-start: auto;
}
.site-bar__lang {
  font-weight: var(--nbc-weight-label);
  text-decoration: none;
}
.site-docs-note {
  max-inline-size: 1180px;
  margin: var(--nbc-space-lg) auto 0;
  padding-inline: clamp(16px, 4vw, 40px);
  font-size: var(--nbc-fs-sm);
  color: var(--nbc-fg-muted);
}
.site-bar__repo {
  font-size: var(--nbc-fs-sm);
  font-weight: var(--nbc-weight-label);
```

- [ ] **Step 4: Run the tests and the gates**

Run: `npx vitest run src/site/router.test.ts src/site/lang.test.ts src/site/i18n.test.ts`

Expected: PASS

```text
Test Files  3 passed (3)
Tests  21 passed (21)
```

Run: `npx vitest run`

Expected: PASS

```text
Test Files  41 passed (41)
Tests  856 passed | 4 skipped (860)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

Run: `npx playwright test -g "language routes|without a history entry" --reporter=line`

Expected: PASS

```text
2 passed
```

- [ ] **Step 5: Commit**

```bash
git add e2e/site.spec.ts src/site/App.tsx src/site/Shell.tsx src/site/ThemeSwitcher.tsx src/site/docs/ComponentNav.tsx src/site/i18n.test.ts src/site/i18n.ts src/site/lang.test.ts src/site/lang.ts src/site/pages/ComponentPage.tsx src/site/pages/ComponentsIndex.tsx src/site/pages/Home.tsx src/site/pages/Library.tsx src/site/pages/NotFound.tsx src/site/router.test.ts src/site/router.ts src/site/site.css
git commit -F - <<'EOF'
feat(site): language routes (#/es, #/en) and a bilingual shell

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

### Task 3: Study themes load on demand; `?theme=` takes any catalog theme

The main bundle keeps only the URLs of the study themes' stylesheets (`import.meta.glob` with `?url`); `loadThemeStylesheet` inserts one `<link>` per theme, once, and removes it if it fails so that a later attempt can retry (D11). Core themes stay always loaded. The site preferences accept any catalog id: while a study theme's stylesheet loads, the site shows a neutral loading line, and if it fails the site falls back to `classic` (D10). The switcher shows the five core themes, the study theme in use and a link to the atlas.

**Files:**
- Test: `e2e/site.spec.ts`
- Modify: `src/site/App.tsx`
- Modify: `src/site/ThemeSwitcher.tsx`
- Modify: `src/site/prefs.ts`
- Modify: `src/site/site.css`
- Create: `src/site/study/data.ts`
- Test (new): `src/site/study/loader.test.ts`
- Create: `src/site/study/loader.ts`

**Interfaces:**
- Consumes: `CATALOG` from the generated `src/study/.generated/catalog.ts` and the `CatalogEntry` type (`src/study/catalog.ts`), both from Plan 1; `NEO_THEMES`; `toHash`, `useLang`, `useT`, `UI` (Task 2).
- Produces: `src/site/study/data.ts`: `CATALOG`, `ENTRIES: ReadonlyMap<string, CatalogEntry>`, `STUDY_ENTRIES`. `src/site/study/loader.ts`: `isKnownTheme(id): boolean`, `loadThemeStylesheet(id): Promise<void>`, `loadFonts(href: string | null | undefined): void`, `type ThemeStatus = 'ready' | 'loading' | 'error'`, `useThemeStylesheet(id): ThemeStatus`. `SitePrefs.theme` becomes `string`.

- [ ] **Step 1: Write the failing tests**

Append to the end of `e2e/site.spec.ts`:

```ts

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
```

Create `src/site/study/loader.test.ts`:

```ts
import { afterEach, describe, expect, it } from 'vitest';
import { isKnownTheme, loadFonts, loadThemeStylesheet } from './loader';

const links = (selector: string) => [...document.head.querySelectorAll<HTMLLinkElement>(selector)];

afterEach(() => {
  for (const link of links('link')) link.remove();
});

describe('theme loader', () => {
  it('knows core and study themes, nothing else', () => {
    expect(['classic', 'riso', 'nakagin', 'classifieds'].map(isKnownTheme)).toEqual([true, true, true, true]);
    expect(['nope', 'constructor', ''].map(isKnownTheme)).toEqual([false, false, false]);
  });

  it('never fetches a core theme', async () => {
    await expect(loadThemeStylesheet('classic')).resolves.toBeUndefined();
    expect(links('link[data-nbc-theme]')).toHaveLength(0);
  });

  it('adds one stylesheet per study theme and resolves when it loads', async () => {
    const first = loadThemeStylesheet('nakagin');
    const again = loadThemeStylesheet('nakagin');
    expect(again).toBe(first);
    const added = links('link[data-nbc-theme="nakagin"]');
    expect(added).toHaveLength(1);
    expect(added[0].rel).toBe('stylesheet');
    added[0].dispatchEvent(new Event('load'));
    await expect(first).resolves.toBeUndefined();
  });

  it('removes a stylesheet that fails and tries again next time', async () => {
    const attempt = loadThemeStylesheet('sesc-pompeia');
    links('link[data-nbc-theme="sesc-pompeia"]')[0].dispatchEvent(new Event('error'));
    await expect(attempt).rejects.toThrow(/could not load the stylesheet of "sesc-pompeia"/);
    expect(links('link[data-nbc-theme="sesc-pompeia"]')).toHaveLength(0);
    void loadThemeStylesheet('sesc-pompeia').catch(() => undefined);
    expect(links('link[data-nbc-theme="sesc-pompeia"]')).toHaveLength(1);
  });

  it('rejects an unknown theme', async () => {
    await expect(loadThemeStylesheet('nope')).rejects.toThrow(/unknown theme "nope"/);
  });

  it('adds each fonts stylesheet once', () => {
    loadFonts('https://fonts.googleapis.com/css2?family=Chivo&display=swap');
    loadFonts('https://fonts.googleapis.com/css2?family=Chivo&display=swap');
    loadFonts(null);
    expect(links('link[data-nbc-fonts]')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/site/study/loader.test.ts`

Expected: FAIL

```text
Test Files  1 failed (1)
Tests  no tests
FAIL  src/site/study/loader.test.ts [ src/site/study/loader.test.ts ]
Error: Failed to resolve import "./loader" from "src/site/study/loader.test.ts". Does the file exist?
```

Run: `npx playwright test -g "study theme: \?theme=nakagin|unknown \?theme|cannot load falls back" --reporter=line`

Expected: FAIL

```text
Error: the site tried to load the stylesheet
Error: expect(locator).toHaveAttribute(expected) failed
2 failed
1 passed
```

(Playwright builds the site and serves it with `vite preview` on port 4173 first.)

The unknown-`?theme` test already passes: it pins what Task 2 does. The other two fail.

- [ ] **Step 3: Implement**

In `src/site/App.tsx`:

1. Replace

```tsx
import { LangContext, UI } from './i18n';
import type { UIKey } from './i18n';
import { SitePrefsContext } from './prefsContext';
import { Library } from './pages/Library';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
```

with

```tsx
import { LangContext, UI } from './i18n';
import type { UIKey } from './i18n';
import { SitePrefsContext } from './prefsContext';
import { useThemeStylesheet } from './study/loader';
import { Library } from './pages/Library';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
```

2. Replace

```tsx
function Site({ location, prefs, update }: { location: PageLocation; prefs: SitePrefs; update: (next: Partial<SitePrefs>) => void }) {
  const { lang, route } = location;
  const routeKey = `${lang}:${location.path}`;

  useEffect(() => {
    rememberLang(lang);
```

with

```tsx
function Site({ location, prefs, update }: { location: PageLocation; prefs: SitePrefs; update: (next: Partial<SitePrefs>) => void }) {
  const { lang, route } = location;
  const routeKey = `${lang}:${location.path}`;
  const status = useThemeStylesheet(prefs.theme);

  useEffect(() => {
    rememberLang(lang);
```

3. Replace

```tsx
    window.scrollTo({ top: 0 });
  }, [routeKey, route, lang]);

  return (
    <LangContext value={lang}>
      <NeoProvider theme={prefs.theme} mode={prefs.mode === 'native' ? undefined : prefs.mode}>
```

with

```tsx
    window.scrollTo({ top: 0 });
  }, [routeKey, route, lang]);

  // A study theme whose stylesheet cannot load falls back to the default theme.
  useEffect(() => {
    if (status === 'error') update({ theme: 'classic' });
  }, [status, update]);

  if (status !== 'ready') {
    return (
      <p className="site-loading" role="status">
        {UI.loading[lang]}
      </p>
    );
  }

  return (
    <LangContext value={lang}>
      <NeoProvider theme={prefs.theme} mode={prefs.mode === 'native' ? undefined : prefs.mode}>
```

Replace the whole of `src/site/ThemeSwitcher.tsx` with:

```tsx
import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { ENTRIES } from './study/data';
import { toHash } from './router';
import type { ModePref, SitePrefs } from './prefs';
import { useLang, useT } from './i18n';
import type { UIKey } from './i18n';

const MODES: { value: ModePref; label: UIKey }[] = [
  { value: 'native', label: 'modeNative' },
  { value: 'light', label: 'modeLight' },
  { value: 'dark', label: 'modeDark' },
  { value: 'system', label: 'modeSystem' },
];

interface Props {
  prefs: SitePrefs;
  onChange: (next: Partial<SitePrefs>) => void;
}

export function ThemeSwitcher({ prefs, onChange }: Props) {
  const t = useT();
  const lang = useLang();
  const entry = ENTRIES.get(prefs.theme);
  const study = entry && !entry.predatesStudy ? entry : undefined;
  return (
    <div className="site-switcher">
      <div className="site-switcher__themes" role="group" aria-label={t('themeGroup')}>
        {NEO_THEMES.map((id) => (
          <button
            key={id}
            type="button"
            className="site-swatch"
            aria-pressed={prefs.theme === id}
            title={`${THEME_INFO[id].name} — ${THEME_INFO[id].tagline}`}
            onClick={() => onChange({ theme: id })}
          >
            <span className="site-swatch__chip" aria-hidden="true">
              {THEME_INFO[id].swatch.slice(0, 3).map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </span>
            <span className="site-swatch__name">{THEME_INFO[id].name}</span>
          </button>
        ))}
        {study ? (
          <button type="button" className="site-swatch" aria-pressed="true" title={`${study.name[lang]} — ${study.tagline[lang]}`}>
            <span className="site-swatch__chip" aria-hidden="true">
              {study.swatch.slice(0, 3).map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </span>
            <span className="site-swatch__name">{study.name[lang]}</span>
          </button>
        ) : null}
        <a className="site-switcher__more" href={toHash(lang, '/atlas')}>
          {t('moreThemes')}
        </a>
      </div>
      <label className="site-switcher__mode">
        <span className="site-visually-hidden">{t('colorScheme')}</span>
        <select value={prefs.mode} onChange={(e) => onChange({ mode: e.target.value as ModePref })}>
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {t(m.label)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
```

In `src/site/prefs.ts`:

Replace

```ts
import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { NEO_MODES, NEO_THEMES } from 'neobrutalistcomponents';
import type { NeoBuiltinTheme, NeoMode } from 'neobrutalistcomponents';

/** `native` = leave NeoProvider's mode unset (the theme's own scheme). */
export type ModePref = NeoMode | 'native';

export interface SitePrefs {
  theme: NeoBuiltinTheme;
  mode: ModePref;
}

const STORAGE_KEY = 'nbc-site-prefs';

const isTheme = (v: unknown): v is NeoBuiltinTheme => NEO_THEMES.includes(v as NeoBuiltinTheme);
const isMode = (v: unknown): v is ModePref => v === 'native' || NEO_MODES.includes(v as NeoMode);

function readStored(): Partial<SitePrefs> {
```

with

```ts
import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { NEO_MODES } from 'neobrutalistcomponents';
import type { NeoMode } from 'neobrutalistcomponents';
import { isKnownTheme } from './study/loader';

/** `native` = leave NeoProvider's mode unset (the theme's own scheme). */
export type ModePref = NeoMode | 'native';

export interface SitePrefs {
  /** A core theme or a study theme id. */
  theme: string;
  mode: ModePref;
}

const STORAGE_KEY = 'nbc-site-prefs';

const isTheme = (v: unknown): v is string => typeof v === 'string' && isKnownTheme(v);
const isMode = (v: unknown): v is ModePref => v === 'native' || NEO_MODES.includes(v as NeoMode);

function readStored(): Partial<SitePrefs> {
```

In `src/site/site.css`:

Replace

```css
.site-swatch__chip > span {
  flex: 1;
}
.site-switcher__mode select {
  min-block-size: 32px;
  padding: 0 var(--nbc-space-sm);
```

with

```css
.site-swatch__chip > span {
  flex: 1;
}
.site-switcher__more {
  align-self: center;
  font-size: var(--nbc-fs-sm);
  font-weight: var(--nbc-weight-label);
}
.site-loading {
  display: grid;
  place-items: center;
  min-block-size: 100dvh;
  margin: 0;
  font-family: system-ui, sans-serif;
}
.site-switcher__mode select {
  min-block-size: 32px;
  padding: 0 var(--nbc-space-sm);
```

Create `src/site/study/data.ts`:

```ts
/** The theme catalog as the site uses it (generated by scripts/build-study.mjs). */
import { CATALOG } from '../../study/.generated/catalog';
import type { CatalogEntry } from '../../study/catalog';

export { CATALOG };

export const ENTRIES: ReadonlyMap<string, CatalogEntry> = new Map(CATALOG.map((entry) => [entry.id, entry]));

/** Themes made for the study, in catalog order (scene folder, then id). */
export const STUDY_ENTRIES: readonly CatalogEntry[] = CATALOG.filter((entry) => !entry.predatesStudy);
```

Create `src/site/study/loader.ts`:

```ts
/**
 * Study themes load on demand: the main bundle holds only their stylesheet
 * URLs, and a theme's CSS is fetched the first time a page shows it or the
 * site switches to it. Core themes are always loaded (src/main.tsx).
 */
import { useEffect, useState } from 'react';
import { NEO_THEMES } from 'neobrutalistcomponents';
import { ENTRIES } from './data';

const STYLESHEETS: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>(['../../study/.generated/themes/*.css', '!../../study/.generated/themes/*.fonts.css'], {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  ).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -'.css'.length), url]),
);

const CORE: ReadonlySet<string> = new Set(NEO_THEMES);

/** A core theme or a theme of the study. */
export const isKnownTheme = (id: string): boolean => CORE.has(id) || (ENTRIES.has(id) && Object.hasOwn(STYLESHEETS, id));

const pending = new Map<string, Promise<void>>();
const loaded = new Set<string>();

/** Loads a study theme's stylesheet once; resolves at once for core themes. */
export function loadThemeStylesheet(id: string): Promise<void> {
  if (CORE.has(id)) return Promise.resolve();
  if (!isKnownTheme(id)) return Promise.reject(new Error(`unknown theme "${id}"`));
  const existing = pending.get(id);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STYLESHEETS[id];
    link.dataset.nbcTheme = id;
    link.addEventListener('load', () => {
      loaded.add(id);
      resolve();
    });
    link.addEventListener('error', () => {
      pending.delete(id);
      link.remove();
      reject(new Error(`could not load the stylesheet of "${id}"`));
    });
    document.head.append(link);
  });
  pending.set(id, promise);
  return promise;
}

const fontLinks = new Set<string>();

/** Adds a Google Fonts stylesheet once. Core themes' fonts come from index.html. */
export function loadFonts(href: string | null | undefined): void {
  if (!href || fontLinks.has(href)) return;
  fontLinks.add(href);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.nbcFonts = '';
  document.head.append(link);
}

export type ThemeStatus = 'ready' | 'loading' | 'error';

const statusNow = (id: string): ThemeStatus => (CORE.has(id) || loaded.has(id) ? 'ready' : 'loading');

/** Loads a theme's stylesheet and fonts; 'ready' once its tokens are in the page. */
export function useThemeStylesheet(id: string): ThemeStatus {
  const [state, setState] = useState(() => ({ id, status: statusNow(id) }));
  useEffect(() => {
    let live = true;
    loadFonts(ENTRIES.get(id)?.predatesStudy === false ? ENTRIES.get(id)?.fontsHref : null);
    loadThemeStylesheet(id).then(
      () => live && setState({ id, status: 'ready' }),
      () => live && setState({ id, status: 'error' }),
    );
    return () => {
      live = false;
    };
  }, [id]);
  return state.id === id ? state.status : statusNow(id);
}
```

- [ ] **Step 4: Run the tests and the gates**

Run: `npx vitest run src/site/study/loader.test.ts`

Expected: PASS

```text
Test Files  1 passed (1)
Tests  6 passed (6)
```

Run: `npx vitest run`

Expected: PASS

```text
Test Files  42 passed (42)
Tests  862 passed | 4 skipped (866)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

Run: `npx playwright test -g "study theme: \?theme=nakagin|unknown \?theme|cannot load falls back" --reporter=line`

Expected: PASS

```text
3 passed
```

- [ ] **Step 5: Commit**

```bash
git add e2e/site.spec.ts src/site/App.tsx src/site/ThemeSwitcher.tsx src/site/prefs.ts src/site/site.css src/site/study/data.ts src/site/study/loader.test.ts src/site/study/loader.ts
git commit -F - <<'EOF'
feat(site): load study themes on demand; ?theme accepts any catalog theme

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

### Task 4: The atlas

Every theme as a card, with facets — scene, decade, kind, scheme, border, shadow, corners — and a search over names, titles, original names, authors and places in both languages, with accents folded (D10). The filters live in the address (`#/<lang>/atlas?scene=japan&q=…`) and are written with `replaceHash`, so typing never stacks history. Cards paint from each entry's catalog `vars`, so no stylesheet is fetched, and load their fonts when they come near the viewport (D11). The atlas replaces Plan 1's quick preview: the Themes page, `StudyBand`, `studyThemes.ts` and the eager CSS import in `main.tsx` go.

**Files:**
- Test: `e2e/site.spec.ts`
- Modify: `src/main.tsx`
- Modify: `src/site/App.tsx`
- Delete: `src/site/docs/StudyBand.tsx`
- Delete: `src/site/docs/studyThemes.ts`
- Create: `src/site/pages/Atlas.tsx`
- Delete: `src/site/pages/Themes.tsx`
- Modify: `src/site/site.css`
- Create: `src/site/study/ThemeCard.tsx`
- Test (new): `src/site/study/facets.test.ts`
- Create: `src/site/study/facets.ts`
- Test (new): `src/site/study/format.test.ts`
- Create: `src/site/study/format.ts`

**Interfaces:**
- Consumes: `CATALOG`, `loadFonts` (Task 3); `SCENE_TEXT`, `KIND_TEXT`, `BORDER_TEXT`, `SHADOW_TEXT`, `CORNER_TEXT`, `UI`, `decadeLabel`, `themeCount`, `useLang`, `useT` (Task 2); `replaceHash`, `toHash` (Task 2); `useSitePrefsContext` (existing).
- Produces: `src/site/study/facets.ts`: `FACET_KEYS`, `type FacetKey`, `type Filters`, `FACET_LABELS`, `facetValue`, `facetOptions(entries, key)`, `facetLabel(lang, key, value)`, `filtersFromQuery(query, entries)`, `filtersToQuery(filters)`, `searchText(entry)`, `matches(entry, filters)`, `applyFilters(entries, filters)`. `src/site/study/format.ts`: `LICENSE_URLS`, `licenseName(license, lang)`, `years(date)`, `startYear(date)`, `sceneHref(lang, scene)`. `src/site/study/ThemeCard.tsx`: `ThemeCard({ entry })`, rendered as an `<li>`. `src/site/pages/Atlas.tsx`: `Atlas({ query })`.

- [ ] **Step 1: Write the failing tests**

In `e2e/site.spec.ts`:

1. Replace

```ts
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
```

with

```ts
  expect(bg).toBe('rgb(231, 230, 225)');
});

test('language routes: legacy addresses redirect, the switch keeps the page, html lang follows', async ({ page }) => {
  await page.goto('#/components/button');
  await expect(page).toHaveURL(/#\/en\/components\/button$/);
```

2. Replace

```ts
  await expect(page.locator('main h1')).toHaveText('Components that hold their shape.');
  expect(requested, 'the site tried to load the stylesheet').toBe(true);
});
```

with

```ts
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
```

Create `src/site/study/facets.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { CATALOG } from './data';
import { applyFilters, facetLabel, facetOptions, filtersFromQuery, filtersToQuery } from './facets';

const ids = (filters: Parameters<typeof applyFilters>[1]) => applyFilters(CATALOG, filters).map((entry) => entry.id);

describe('atlas facets', () => {
  it('filters by scene, decade and shape', () => {
    expect(ids({ scene: 'japan' })).toEqual(expect.arrayContaining(['nakagin', 'riso', 'y2k']));
    expect(ids({ scene: 'japan' })).not.toContain('classic');
    expect(ids({ decade: '1970' })).toEqual(expect.arrayContaining(['nakagin', 'maeusebunker', 'sesc-pompeia', 'tech']));
    expect(ids({ shadow: 'none' })).toEqual(expect.arrayContaining(['classifieds', 'swiss']));
    expect(ids({ scene: 'usa', border: 'hairline' })).toEqual(expect.arrayContaining(['classifieds', 'tech']));
  });

  it('searches names, works, original names, authors and places, folding accents', () => {
    expect(ids({ q: '中銀' })).toEqual(['nakagin']);
    expect(ids({ q: 'pompeia' })).toEqual(['sesc-pompeia']);
    expect(ids({ q: 'kurokawa' })).toEqual(['nakagin']);
    expect(ids({ q: 'le corbusier' })).toEqual(['classic']);
    expect(ids({ q: 'berlín' })).toEqual(['maeusebunker']);
    expect(ids({ q: 'nothing like this' })).toEqual([]);
  });

  it('orders facet options meaningfully', () => {
    const decades = facetOptions(CATALOG, 'decade');
    expect(decades).toEqual([...decades].sort((a, b) => Number(a) - Number(b)));
    expect(facetOptions(CATALOG, 'scene').indexOf('japan')).toBeLessThan(facetOptions(CATALOG, 'scene').indexOf('origins'));
  });

  it('round-trips filters through the URL and drops values no theme has', () => {
    const query = filtersToQuery({ scene: 'latam', q: 'rojo' });
    expect(String(query)).toBe('scene=latam&q=rojo');
    expect(filtersFromQuery(query, CATALOG)).toEqual({ scene: 'latam', q: 'rojo' });
    expect(filtersFromQuery(new URLSearchParams('scene=mars&decade=1066'), CATALOG)).toEqual({});
  });

  it('labels values in both languages', () => {
    expect([facetLabel('es', 'scene', 'latam'), facetLabel('en', 'decade', '1970'), facetLabel('es', 'shadow', 'none')]).toEqual([
      'Latinoamérica',
      '1970s',
      'Sin sombra',
    ]);
  });
});
```

Create `src/site/study/format.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { licenseName, startYear, years } from './format';

describe('study formatting', () => {
  it('names licences the way their owners write them', () => {
    expect([licenseName('CC-BY-SA-4.0', 'en'), licenseName('CC-BY-2.0', 'es'), licenseName('CC0-1.0', 'en')]).toEqual(['CC BY-SA 4.0', 'CC BY 2.0', 'CC0']);
    expect([licenseName('PD', 'es'), licenseName('PD', 'en')]).toEqual(['dominio público', 'public domain']);
  });

  it('prints a year or a span, and sorts by the start', () => {
    expect([years(1978), years([1970, 1972])]).toEqual(['1978', '1970–1972']);
    expect([startYear(1978), startYear([1970, 1972])]).toEqual([1978, 1970]);
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/site/study/facets.test.ts src/site/study/format.test.ts`

Expected: FAIL

```text
Test Files  2 failed (2)
Tests  no tests
FAIL  src/site/study/facets.test.ts [ src/site/study/facets.test.ts ]
Error: Failed to resolve import "./facets" from "src/site/study/facets.test.ts". Does the file exist?
FAIL  src/site/study/format.test.ts [ src/site/study/format.test.ts ]
Error: Failed to resolve import "./format" from "src/site/study/format.test.ts". Does the file exist?
```

Run: `npx playwright test -g "atlas: every theme|atlas cards paint|atlas: typing|atlas: switching" --reporter=line`

Expected: FAIL

```text
Error: expect(locator).toHaveCount(expected) failed
Error: expect(locator).toBeVisible() failed
Error: element(s) not found
Error: locator.pressSequentially: Test timeout of 30000ms exceeded.
4 failed
```

(Playwright builds the site and serves it with `vite preview` on port 4173 first.)

- [ ] **Step 3: Implement**

Replace the whole of `src/main.tsx` with:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// The library exactly as consumers load it: core stylesheet + theme stylesheets.
// The five core themes are always loaded, so the switcher and the atlas cards
// change instantly; study themes load on demand (src/site/study/loader.ts).
import './lib/styles.css';
import './lib/themes/classic/index.css';
import './lib/themes/tech/index.css';
import './lib/themes/swiss/index.css';
import './lib/themes/y2k/index.css';
import './lib/themes/riso/index.css';
import './site/site.css';
import { App } from './site/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

In `src/site/App.tsx`:

1. Replace

```tsx
import { Library } from './pages/Library';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
import { Themes } from './pages/Themes';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
import { Agents } from './pages/Agents';
```

with

```tsx
import { Library } from './pages/Library';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
import { Atlas } from './pages/Atlas';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
import { Agents } from './pages/Agents';
```

2. Replace

```tsx

export type PageLocation = Extract<Location, { kind: 'page' }>;

function Page({ route }: { route: Route }) {
  switch (route.name) {
    // Until the study home exists (study plan 2, Task 8) the study route shows the library page.
    case 'study':
    case 'library':
      return <Library />;
    // Until the atlas exists (Task 5) the atlas route shows the old Themes page.
    case 'atlas':
      return <Themes />;
    case 'components':
      return <ComponentsIndex />;
    case 'component':
```

with

```tsx

export type PageLocation = Extract<Location, { kind: 'page' }>;

function Page({ location }: { location: PageLocation }) {
  const { route } = location;
  switch (route.name) {
    // Until the study home exists (study plan 2, Task 8) the study route shows the library page.
    case 'study':
    case 'library':
      return <Library />;
    case 'atlas':
      return <Atlas query={location.query} />;
    case 'components':
      return <ComponentsIndex />;
    case 'component':
```

3. Replace

```tsx
    <LangContext value={lang}>
      <NeoProvider theme={prefs.theme} mode={prefs.mode === 'native' ? undefined : prefs.mode}>
        <Shell location={location} prefs={prefs} onPrefsChange={update}>
          <Page route={route} />
        </Shell>
      </NeoProvider>
    </LangContext>
```

with

```tsx
    <LangContext value={lang}>
      <NeoProvider theme={prefs.theme} mode={prefs.mode === 'native' ? undefined : prefs.mode}>
        <Shell location={location} prefs={prefs} onPrefsChange={update}>
          <Page location={location} />
        </Shell>
      </NeoProvider>
    </LangContext>
```

Delete `src/site/docs/StudyBand.tsx`:

```bash
git rm src/site/docs/StudyBand.tsx
```

Delete `src/site/docs/studyThemes.ts`:

```bash
git rm src/site/docs/studyThemes.ts
```

Create `src/site/pages/Atlas.tsx`:

```tsx
import { Button, Input, Select } from 'neobrutalistcomponents';
import { themeCount, useLang, useT } from '../i18n';
import { replaceHash, toHash } from '../router';
import { CATALOG } from '../study/data';
import { FACET_KEYS, FACET_LABELS, applyFilters, facetLabel, facetOptions, filtersFromQuery, filtersToQuery } from '../study/facets';
import type { FacetKey, Filters } from '../study/facets';
import { ThemeCard } from '../study/ThemeCard';

/** Every theme, filtered by facets and search; the filters live in the URL. */
export function Atlas({ query }: { query: URLSearchParams }) {
  const lang = useLang();
  const t = useT();
  const filters = filtersFromQuery(query, CATALOG);
  const results = applyFilters(CATALOG, filters);
  const active = Object.keys(filters).length > 0;
  const update = (next: Filters) => replaceHash(toHash(lang, '/atlas', filtersToQuery(next)));
  const set = (key: FacetKey | 'q', value: string) => update({ ...filters, [key]: value || undefined });

  return (
    <div className="site-page site-atlas">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleAtlas')}</h1>
        <p className="site-lead">{t('atlasLead')}</p>
      </header>

      <form className="site-atlas__filters" role="search" aria-label={t('filters')} onSubmit={(e) => e.preventDefault()}>
        <div className="site-atlas__search">
          <Input
            type="search"
            label={t('search')}
            placeholder={t('searchPlaceholder')}
            value={query.get('q') ?? ''}
            onChange={(e) => set('q', e.target.value)}
          />
        </div>
        {FACET_KEYS.map((key) => (
          <Select key={key} label={t(FACET_LABELS[key])} value={filters[key] ?? ''} onChange={(e) => set(key, e.target.value)}>
            <option value="">{t('any')}</option>
            {facetOptions(CATALOG, key).map((value) => (
              <option key={value} value={value}>
                {facetLabel(lang, key, value)}
              </option>
            ))}
          </Select>
        ))}
      </form>

      <div className="site-atlas__status">
        <p className="site-p" aria-live="polite">
          {themeCount(lang, results.length)}
        </p>
        {active ? (
          <Button variant="ghost" size="sm" onClick={() => update({})}>
            {t('clearFilters')}
          </Button>
        ) : null}
      </div>

      {results.length ? (
        <ul className="site-cards">
          {results.map((entry) => (
            <ThemeCard key={entry.id} entry={entry} />
          ))}
        </ul>
      ) : (
        <p className="site-lead site-atlas__empty">{t('noResults')}</p>
      )}
    </div>
  );
}
```

Delete `src/site/pages/Themes.tsx`:

```bash
git rm src/site/pages/Themes.tsx
```

In `src/site/site.css`:

Replace

```css
  gap: var(--nbc-space-md);
}

.site-study-intro {
  padding-block-start: var(--nbc-space-3xl);
}
.site-study-intro .site-p {
  max-inline-size: 68ch;
}

.site-study__figure {
  align-self: start;
  margin: 0;
}
.site-study__figure img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  max-block-size: 34rem;
  object-fit: cover;
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
}
.site-study__figure figcaption,
.site-study__noimage,
.site-study__palette {
  font-size: var(--nbc-fs-sm);
  color: var(--nbc-fg-muted);
}
.site-study__figure figcaption {
  margin-block-start: var(--nbc-space-sm);
}
.site-study__text .site-h3 {
  margin-block: var(--nbc-space-lg) var(--nbc-space-xs);
}
.site-study__text .site-h3:first-child {
  margin-block-start: 0;
}
.site-study__text .site-p {
  max-inline-size: 68ch;
}
.site-study__sources {
  margin: 0;
  padding-inline-start: 1.4em;
  font-size: var(--nbc-fs-sm);
}
.site-study__sources li + li {
  margin-block-start: var(--nbc-space-xs);
}
.site-notfound {
  display: grid;
  justify-items: start;
```

with

```css
  gap: var(--nbc-space-md);
}

.site-atlas__filters {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--nbc-space-md) var(--nbc-space-lg);
  align-items: end;
  margin-block: var(--nbc-space-xl) var(--nbc-space-lg);
}
.site-atlas__search {
  grid-column: 1 / -1;
  max-inline-size: 36rem;
}
.site-atlas__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--nbc-space-md);
  margin-block-end: var(--nbc-space-lg);
}
.site-atlas__status .site-p {
  margin: 0;
}
.site-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: var(--nbc-space-xl);
  margin: 0;
  padding: 0;
  list-style: none;
}
.site-cards__item {
  display: flex;
}
.site-card-island {
  flex: 1;
  display: flex;
  padding: var(--nbc-space-lg);
  border: 1px solid color-mix(in srgb, var(--nbc-border-color) 25%, transparent);
}
.site-card {
  flex: 1;
}
.site-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--nbc-space-md);
}
.site-card__swatches {
  display: flex;
}
.site-card__swatches > span {
  inline-size: 22px;
  block-size: 22px;
  border: 1px solid var(--nbc-border-color);
}
.site-card__swatches > span + span {
  margin-inline-start: -4px;
}
.site-card__foot {
  justify-content: space-between;
  font-size: var(--nbc-fs-sm);
}

.site-notfound {
  display: grid;
  justify-items: start;
```

Create `src/site/study/ThemeCard.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import { Badge, Card, NeoProvider } from 'neobrutalistcomponents';
import type { CatalogEntry } from '../../study/catalog';
import { SCENE_TEXT, useLang, useT } from '../i18n';
import { useSitePrefsContext } from '../prefsContext';
import { toHash } from '../router';
import { years } from './format';
import { loadFonts } from './loader';

/** Loads a study theme's fonts once its island comes near the viewport. */
function useFontsNearViewport(ref: RefObject<HTMLElement | null>, entry: CatalogEntry) {
  const href = entry.predatesStudy ? null : entry.fontsHref;
  useEffect(() => {
    const element = ref.current;
    if (!href || !element) return;
    if (typeof IntersectionObserver === 'undefined') {
      loadFonts(href);
      return;
    }
    const observer = new IntersectionObserver(
      (records) => {
        if (records.some((record) => record.isIntersecting)) {
          loadFonts(href);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, href]);
}

/**
 * A theme's own island: study themes paint with their catalog tokens set
 * inline, so no stylesheet is fetched; core themes are always loaded.
 */
function Island({ entry, className, children }: { entry: CatalogEntry; className: string; children: ReactNode }) {
  const { prefs } = useSitePrefsContext();
  const ref = useRef<HTMLElement>(null);
  useFontsNearViewport(ref, entry);
  return (
    <NeoProvider
      ref={ref}
      theme={entry.id}
      mode={prefs.mode === 'native' ? undefined : prefs.mode}
      className={className}
      style={(entry.vars ?? undefined) as CSSProperties | undefined}
    >
      {children}
    </NeoProvider>
  );
}

/** One theme as an atlas card. */
export function ThemeCard({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  return (
    <li className="site-cards__item">
      <Island entry={entry} className="site-card-island">
        <Card variant="interactive" as="article" className="site-card">
          <Card.Header>
            <Card.Title as="h3">
              <a href={toHash(lang, `/theme/${entry.id}`)}>{entry.name[lang]}</a>
            </Card.Title>
            <Card.Description>
              {entry.reference.title[lang]}, {years(entry.reference.date)}
            </Card.Description>
          </Card.Header>
          <Card.Content className="site-card__body">
            <span className="site-card__swatches" aria-hidden="true">
              {entry.swatch.map((color) => (
                <span key={color} style={{ background: color }} />
              ))}
            </span>
            <span className="nbc-button nbc-button--primary nbc-button--sm" aria-hidden="true">
              <span className="nbc-button__label">Aa</span>
            </span>
          </Card.Content>
          <Card.Footer className="site-card__foot">
            <span>{SCENE_TEXT[entry.scene].name[lang]}</span>
            {entry.predatesStudy ? <Badge variant="neutral">{t('fromLibrary')}</Badge> : null}
          </Card.Footer>
        </Card>
      </Island>
    </li>
  );
}
```

Create `src/site/study/facets.ts`:

```ts
/** Atlas filtering: facets and free-text search over the catalog. Pure functions. */
import { REFERENCE_KINDS, SCENES, SHADOW_KINDS } from '../../study/types';
import type { Lang } from '../../study/types';
import type { CatalogEntry } from '../../study/catalog';
import { BORDER_TEXT, CORNER_TEXT, KIND_TEXT, SCENE_TEXT, SHADOW_TEXT, UI, decadeLabel } from '../i18n';
import type { UIKey } from '../i18n';

export const FACET_KEYS = ['scene', 'decade', 'kind', 'scheme', 'border', 'shadow', 'corners'] as const;
export type FacetKey = (typeof FACET_KEYS)[number];
export type Filters = { readonly [K in FacetKey]?: string } & { readonly q?: string };

export const FACET_LABELS: Record<FacetKey, UIKey> = {
  scene: 'facetScene',
  decade: 'facetDecade',
  kind: 'facetKind',
  scheme: 'facetScheme',
  border: 'facetBorder',
  shadow: 'facetShadow',
  corners: 'facetCorners',
};

const ORDER: Record<FacetKey, readonly string[] | null> = {
  scene: SCENES,
  decade: null,
  kind: REFERENCE_KINDS,
  scheme: ['light', 'dark'],
  border: ['hairline', 'standard', 'heavy'],
  shadow: SHADOW_KINDS,
  corners: ['square', 'soft', 'round'],
};

export const facetValue = (entry: CatalogEntry, key: FacetKey): string => String(entry.facets[key]);

/** The values a facet takes in these entries, in a meaningful order (decades ascending). */
export function facetOptions(entries: readonly CatalogEntry[], key: FacetKey): string[] {
  const present = new Set(entries.map((entry) => facetValue(entry, key)));
  const order = ORDER[key];
  return order ? order.filter((value) => present.has(value)) : [...present].sort((a, b) => Number(a) - Number(b));
}

export function facetLabel(lang: Lang, key: FacetKey, value: string): string {
  switch (key) {
    case 'scene':
      return SCENE_TEXT[value as keyof typeof SCENE_TEXT].name[lang];
    case 'decade':
      return decadeLabel(lang, Number(value));
    case 'kind':
      return KIND_TEXT[value as keyof typeof KIND_TEXT][lang];
    case 'scheme':
      return UI[value === 'dark' ? 'modeDark' : 'modeLight'][lang];
    case 'border':
      return BORDER_TEXT[value as keyof typeof BORDER_TEXT][lang];
    case 'shadow':
      return SHADOW_TEXT[value as keyof typeof SHADOW_TEXT][lang];
    case 'corners':
      return CORNER_TEXT[value as keyof typeof CORNER_TEXT][lang];
  }
}

/** Filters from the atlas URL; values no entry has are dropped, so a stale link still shows themes. */
export function filtersFromQuery(query: URLSearchParams, entries: readonly CatalogEntry[]): Filters {
  const filters: { [K in FacetKey]?: string } & { q?: string } = {};
  for (const key of FACET_KEYS) {
    const value = query.get(key);
    if (value && facetOptions(entries, key).includes(value)) filters[key] = value;
  }
  const q = query.get('q')?.trim();
  if (q) filters.q = q;
  return filters;
}

export function filtersToQuery(filters: Filters): URLSearchParams {
  const query = new URLSearchParams();
  for (const key of FACET_KEYS) {
    const value = filters[key];
    if (value) query.set(key, value);
  }
  if (filters.q?.trim()) query.set('q', filters.q);
  return query;
}

/** Lower case, accents folded: "Pompéia" and "pompeia" match. Other scripts stay as written. */
const fold = (text: string) => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();

/** Everything a search can hit, in both languages. */
export function searchText(entry: CatalogEntry): string {
  const { reference } = entry;
  return fold(
    [
      entry.id,
      entry.name.es,
      entry.name.en,
      reference.title.es,
      reference.title.en,
      reference.original?.text ?? '',
      ...reference.authors,
      reference.place.es,
      reference.place.en,
    ].join(' '),
  );
}

export function matches(entry: CatalogEntry, filters: Filters): boolean {
  for (const key of FACET_KEYS) {
    const wanted = filters[key];
    if (wanted && facetValue(entry, key) !== wanted) return false;
  }
  const terms = fold(filters.q ?? '').split(/\s+/).filter(Boolean);
  const text = searchText(entry);
  return terms.every((term) => text.includes(term));
}

export const applyFilters = (entries: readonly CatalogEntry[], filters: Filters): CatalogEntry[] =>
  entries.filter((entry) => matches(entry, filters));
```

Create `src/site/study/format.ts`:

```ts
/** Small formatting helpers shared by the study pages. */
import type { ImageLicense, Lang, Reference, Scene } from '../../study/types';
import { toHash } from '../router';

export const LICENSE_URLS: Record<ImageLicense, string> = {
  'CC0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
  PD: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
  'CC-BY-2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'CC-BY-2.5': 'https://creativecommons.org/licenses/by/2.5/',
  'CC-BY-3.0': 'https://creativecommons.org/licenses/by/3.0/',
  'CC-BY-4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC-BY-SA-2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
  'CC-BY-SA-2.5': 'https://creativecommons.org/licenses/by-sa/2.5/',
  'CC-BY-SA-3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC-BY-SA-4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
};

/** 'CC-BY-SA-4.0' → 'CC BY-SA 4.0'; 'PD' → 'public domain' / 'dominio público'. */
export function licenseName(license: ImageLicense, lang: Lang): string {
  if (license === 'PD') return lang === 'es' ? 'dominio público' : 'public domain';
  if (license === 'CC0-1.0') return 'CC0';
  return license.replace(/^CC-/, 'CC ').replace(/-(\d)/, ' $1');
}

export const years = (date: Reference['date']): string => (typeof date === 'number' ? String(date) : `${date[0]}–${date[1]}`);

export const startYear = (date: Reference['date']): number => (typeof date === 'number' ? date : date[0]);

/** The page of a scene; Origins has its own. */
export const sceneHref = (lang: Lang, scene: Scene): string => toHash(lang, scene === 'origins' ? '/origins' : `/scene/${scene}`);
```

- [ ] **Step 4: Run the tests and the gates**

Run: `npx vitest run src/site/study/facets.test.ts src/site/study/format.test.ts`

Expected: PASS

```text
Test Files  2 passed (2)
Tests  7 passed (7)
```

Run: `npx vitest run`

Expected: PASS

```text
Test Files  44 passed (44)
Tests  869 passed | 4 skipped (873)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

Run: `npx playwright test -g "atlas: every theme|atlas cards paint|atlas: typing|atlas: switching" --reporter=line`

Expected: PASS

```text
4 passed
```

- [ ] **Step 5: Commit**

```bash
git add e2e/site.spec.ts src/main.tsx src/site/App.tsx src/site/pages/Atlas.tsx src/site/site.css src/site/study/ThemeCard.tsx src/site/study/facets.test.ts src/site/study/facets.ts src/site/study/format.test.ts src/site/study/format.ts
git commit -F - <<'EOF'
feat(site): the atlas — every theme, faceted and searchable, painted from catalog data

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

### Task 5: A page per theme

`#/<lang>/theme/<id>` renders inside the theme (D10). Its stylesheet loads first (Task 3), then its data: the reference and ficha from the theme's own lazy chunk (or `core-fichas.ts`), and its tokens parsed from the generated stylesheet exactly as the contract tests parse them. The page shows the reference with its image and credit, what is documented and the reading, the palette's origin, the sources, the component specimen in light and dark side by side, the token and contrast tables (now bilingual), an install snippet, "use across the site", and previous / next within the scene by start year, then id. Core themes add a one-line note that they predate the study. Lazy loads go through one `useLazy` hook, which reports an error instead of loading forever.

**Files:**
- Test: `e2e/site.spec.ts`
- Modify: `src/site/App.tsx`
- Modify: `src/site/docs/TokenTables.tsx`
- Create: `src/site/pages/ThemePage.tsx`
- Modify: `src/site/site.css`
- Create: `src/site/study/SourceList.tsx`
- Create: `src/site/study/detail.ts`
- Test (new): `src/site/study/lazy.test.tsx`
- Create: `src/site/study/lazy.ts`

**Interfaces:**
- Consumes: `ENTRIES`, `CATALOG`, `loadThemeStylesheet`, `useThemeStylesheet` (Task 3); `LICENSE_URLS`, `licenseName`, `years`, `startYear`, `sceneHref` (Task 4); `PALETTE_TEXT`, `PAIR_TEXT`, `SCHEME_TEXT`, `SCENE_TEXT`, `useLang`, `useT` (Task 2); `parseThemeTokens` (`src/lib/themes/color.ts`), `THEME_TOKENS` (`src/site/docs/themeTokens.ts`), `CORE_FICHAS` (Plan 1).
- Produces: `src/site/study/lazy.ts`: `type Lazy<T>`, `useLazy<T>(key: string, load: () => Promise<T>): Lazy<T>`. `src/site/study/detail.ts`: `interface ThemeDetail { reference; ficha; tokens: Map<string, string> }`, `loadThemeData(entry)`, `loadDetail(entry)`, `useThemeDetail(entry): Lazy<ThemeDetail>`, `imageUrl(file)`. `src/site/study/SourceList.tsx`: `SourceList({ sources })`. `src/site/pages/ThemePage.tsx`: `ThemePage({ id })`.

- [ ] **Step 1: Write the failing tests**

In `e2e/site.spec.ts`:

1. Replace

```ts
  expect(bg).toBe('rgb(231, 230, 225)');
});

test('language routes: legacy addresses redirect, the switch keeps the page, html lang follows', async ({ page }) => {
  await page.goto('#/components/button');
  await expect(page).toHaveURL(/#\/en\/components\/button$/);
```

with

```ts
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
```

2. Replace

```ts
  expect(requested.filter((url) => /\/(nakagin|maeusebunker|sesc-pompeia|classifieds)-[\w-]+\.css/.test(url))).toEqual([]);
});
```

with

```ts
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

test('theme page: core themes say they predate the study; unknown ids are not found', async ({ page }) => {
  await page.goto('#/es/theme/tech');
  await expect(page.locator('.site-themepage__note')).toHaveText(/^Este tema es anterior al estudio/);
  await expect(page.getByRole('img', { name: /VT100/ })).toBeVisible();
  await page.goto('#/en/theme/nope');
  await expect(page.locator('main h1')).toHaveText('Nothing at this address');
});

test('theme page: when its data cannot load, it says so instead of loading forever', async ({ page }) => {
  await page.route(/\/assets\/sesc-pompeia-[\w-]+\.js$/, (route) => route.abort());
  await page.goto('#/en/theme/sesc-pompeia');
  await expect(page.getByText('This theme could not load', { exact: false })).toBeVisible();
});
```

Create `src/site/study/lazy.test.tsx`:

```tsx
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useLazy } from './lazy';

describe('useLazy', () => {
  it('reports loading, then the value', async () => {
    const { result } = renderHook(() => useLazy('a', () => Promise.resolve(42)));
    expect(result.current).toEqual({ status: 'loading' });
    await waitFor(() => expect(result.current).toEqual({ status: 'ready', value: 42 }));
  });

  it('reports an error instead of loading forever', async () => {
    const { result } = renderHook(() => useLazy('b', () => Promise.reject(new Error('offline'))));
    await waitFor(() => expect(result.current).toEqual({ status: 'error' }));
  });

  it('ignores a load that finishes after the key changed', async () => {
    let finishSlow: (value: string) => void = () => undefined;
    const loads: Record<string, () => Promise<string>> = {
      slow: () => new Promise((resolve) => (finishSlow = resolve)),
      fast: () => Promise.resolve('fast'),
    };
    const { result, rerender } = renderHook(({ id }) => useLazy(id, loads[id]), { initialProps: { id: 'slow' } });
    rerender({ id: 'fast' });
    await waitFor(() => expect(result.current).toEqual({ status: 'ready', value: 'fast' }));
    await act(async () => finishSlow('slow'));
    expect(result.current).toEqual({ status: 'ready', value: 'fast' });
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/site/study/lazy.test.tsx`

Expected: FAIL

```text
Test Files  1 failed (1)
Tests  no tests
FAIL  src/site/study/lazy.test.tsx [ src/site/study/lazy.test.tsx ]
Error: Failed to resolve import "./lazy" from "src/site/study/lazy.test.tsx". Does the file exist?
```

Run: `npx playwright test -g "theme page|production CSS keeps" --reporter=line`

Expected: FAIL

```text
Error: expect(locator).toHaveText(expected) failed
Error: element(s) not found
Error: expect(locator).toBeVisible() failed
25 failed
1 passed
```

(Playwright builds the site and serves it with `vite preview` on port 4173 first.)

The filter also matches the existing `classic` production-CSS test, which passes; the other 25 fail.

- [ ] **Step 3: Implement**

In `src/site/App.tsx`:

1. Replace

```tsx
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
import { Atlas } from './pages/Atlas';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
import { Agents } from './pages/Agents';
```

with

```tsx
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
import { Atlas } from './pages/Atlas';
import { ThemePage } from './pages/ThemePage';
import { ENTRIES } from './study/data';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
import { Agents } from './pages/Agents';
```

2. Replace

```tsx
      return <Library />;
    case 'atlas':
      return <Atlas query={location.query} />;
    case 'components':
      return <ComponentsIndex />;
    case 'component':
```

with

```tsx
      return <Library />;
    case 'atlas':
      return <Atlas query={location.query} />;
    case 'theme':
      return <ThemePage id={route.id} />;
    case 'components':
      return <ComponentsIndex />;
    case 'component':
```

3. Replace

```tsx

  useEffect(() => {
    const key = TITLES[route.name];
    const title = route.name === 'component' ? route.slug : route.name === 'theme' ? route.id : key ? UI[key][lang] : undefined;
    document.title = title ? `${title} — neobrutalistcomponents` : 'neobrutalistcomponents';
    window.scrollTo({ top: 0 });
  }, [routeKey, route, lang]);
```

with

```tsx

  useEffect(() => {
    const key = TITLES[route.name];
    const title = route.name === 'component' ? route.slug : route.name === 'theme' ? (ENTRIES.get(route.id)?.name[lang] ?? route.id) : key ? UI[key][lang] : undefined;
    document.title = title ? `${title} — neobrutalistcomponents` : 'neobrutalistcomponents';
    window.scrollTo({ top: 0 });
  }, [routeKey, route, lang]);
```

Replace the whole of `src/site/docs/TokenTables.tsx` with:

```tsx
import { COLOR_TOKENS, CONTRAST_PAIRS } from '../../lib/themes/contract';
import { contrastRatio, resolveColor, resolveStops } from '../../lib/themes/color';
import type { Scheme } from '../../lib/themes/color';
import { PAIR_TEXT, SCHEME_TEXT, useLang, useT } from '../i18n';

/**
 * A theme's color tokens and WCAG contrast ratios in one scheme, computed with
 * the same parser and color tools the contract tests use.
 */
export function TokenTables({ tokens, scheme }: { tokens: Map<string, string>; scheme: Scheme }) {
  const lang = useLang();
  const t = useT();
  const page = resolveColor(tokens, '--nbc-bg', scheme);
  const schemeName = SCHEME_TEXT[scheme][lang];
  return (
    <div className="site-band__tables">
      <div className="site-props">
        <table>
          <caption>{lang === 'es' ? `Tokens de color, esquema ${schemeName}` : `Color tokens, ${schemeName} scheme`}</caption>
          <thead>
            <tr>
              <th scope="col">{t('colToken')}</th>
              <th scope="col">{t('colSwatch')}</th>
              <th scope="col">{t('colValue')}</th>
            </tr>
          </thead>
          <tbody>
            {COLOR_TOKENS.map((t) => (
              <tr key={t}>
                <th scope="row">
                  <code>{t}</code>
                </th>
                <td>
                  <span className="site-swatch-cell" style={{ background: `var(${t})` }} />
                </td>
                <td>
                  <code>{resolveColor(tokens, t, scheme)}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="site-props">
        <table>
          <caption>{lang === 'es' ? `Contraste, esquema ${schemeName} (WCAG 2.2)` : `Contrast, ${schemeName} scheme (WCAG 2.2)`}</caption>
          <thead>
            <tr>
              <th scope="col">{t('colPair')}</th>
              <th scope="col">{t('colRatio')}</th>
              <th scope="col">{t('colNeeds')}</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST_PAIRS.map((pair) => {
              const fg = resolveColor(tokens, pair.fg, scheme);
              const ratio = Math.min(
                ...resolveStops(tokens, pair.bg, scheme).map((bg) => contrastRatio(fg, bg, page)),
              );
              return (
                <tr key={`${pair.fg}-${pair.bg}`}>
                  <th scope="row">
                    {pair.min === 3 ? (
                      // Non-text pair (control boundary, focus ring): drawn as a ring, not as text.
                      <span className="site-pair site-pair--ui" style={{ background: `var(${pair.bg})` }} aria-hidden="true">
                        <span style={{ borderColor: `var(${pair.fg})` }} />
                      </span>
                    ) : (
                      <span className="site-pair" style={{ color: `var(${pair.fg})`, background: `var(${pair.bg})` }}>
                        Aa
                      </span>
                    )}{' '}
                    {PAIR_TEXT[`${pair.fg} ${pair.bg}`][lang]}
                  </th>
                  <td className="site-num">{ratio.toFixed(2)}</td>
                  <td className="site-num">{pair.min}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

Create `src/site/pages/ThemePage.tsx`:

```tsx
import { Button, NeoProvider } from 'neobrutalistcomponents';
import type { NeoMode } from 'neobrutalistcomponents';
import type { Scheme } from '../../lib/themes/color';
import type { CatalogEntry } from '../../study/catalog';
import { PALETTE_TEXT, SCENE_TEXT, useLang, useT } from '../i18n';
import { useSitePrefsContext } from '../prefsContext';
import { toHash } from '../router';
import { CodeBlock } from '../docs/CodeBlock';
import { ThemeSampler } from '../docs/ThemeSampler';
import { TokenTables } from '../docs/TokenTables';
import { CATALOG, ENTRIES } from '../study/data';
import { imageUrl, useThemeDetail } from '../study/detail';
import type { ThemeDetail } from '../study/detail';
import { LICENSE_URLS, licenseName, sceneHref, startYear, years } from '../study/format';
import { loadThemeStylesheet, useThemeStylesheet } from '../study/loader';
import { SourceList } from '../study/SourceList';
import { NotFound } from './NotFound';

function schemeFor(native: 'light' | 'dark', mode: NeoMode | 'native'): Scheme {
  if (mode === 'light' || mode === 'dark') return mode;
  if (mode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return native;
}

const installCode = (id: string, fonts: boolean) => `import { NeoProvider } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/${id}.css';
import 'neobrutalistcomponents/themes/${id}.fonts.css'; // ${fonts ? 'optional: loads the theme’s fonts' : 'system fonts: nothing to load'}

export function App() {
  return <NeoProvider theme="${id}">{/* your app */}</NeoProvider>;
}`;

/** Themes of the same scene, by the reference's start year. */
const siblingsOf = (entry: CatalogEntry) =>
  CATALOG.filter((e) => e.scene === entry.scene).sort(
    (a, b) => startYear(a.reference.date) - startYear(b.reference.date) || (a.id < b.id ? -1 : 1),
  );

function Reference({ entry, detail }: { entry: CatalogEntry; detail: ThemeDetail }) {
  const lang = useLang();
  const t = useT();
  const { reference } = detail;
  return (
    <dl className="site-band__facts">
      <div>
        <dt>{t('refLabel')}</dt>
        <dd>
          {reference.title[lang]}
          {reference.original ? (
            <>
              {' '}
              (<span lang={reference.original.lang}>{reference.original.text}</span>)
            </>
          ) : null}
        </dd>
      </div>
      <div>
        <dt>{t('byLabel')}</dt>
        <dd>{reference.authors.length ? reference.authors.join(', ') : t('anonymous')}</dd>
      </div>
      <div>
        <dt>{t('whenWhere')}</dt>
        <dd>
          {years(reference.date)}, {reference.place[lang]}
        </dd>
      </div>
      <div>
        <dt>{t('sceneLabel')}</dt>
        <dd>
          <a href={sceneHref(lang, entry.scene)}>{SCENE_TEXT[entry.scene].name[lang]}</a>
        </dd>
      </div>
      <div>
        <dt>{t('typefacesLabel')}</dt>
        <dd>{entry.fonts.length ? entry.fonts.join(', ') : t('systemFonts')}</dd>
      </div>
      <div>
        <dt>{t('schemeLabel')}</dt>
        <dd>{t(entry.nativeScheme === 'dark' ? 'modeDark' : 'modeLight')}</dd>
      </div>
    </dl>
  );
}

function Figure({ detail }: { detail: ThemeDetail }) {
  const lang = useLang();
  const t = useT();
  const { image, archiveUrl, sources } = detail.reference;
  const url = image ? imageUrl(image.file) : undefined;
  if (image && url) {
    return (
      <figure className="site-themepage__figure">
        <img src={url} alt={image.alt[lang]} width={image.width} height={image.height} loading="lazy" decoding="async" />
        <figcaption>
          {t('photoBy')} {image.author},{' '}
          <a href={LICENSE_URLS[image.license]} target="_blank" rel="noreferrer">
            {licenseName(image.license, lang)}
          </a>
          , {t('via')}{' '}
          <a href={image.sourceUrl} target="_blank" rel="noreferrer">
            Wikimedia Commons
          </a>
          ; {t('converted')}.
        </figcaption>
      </figure>
    );
  }
  const href = archiveUrl ?? sources[0].url;
  return (
    <div className="site-themepage__noimage">
      <p className="site-p">{t('noImage')}</p>
      <a href={href} target="_blank" rel="noreferrer">
        {t(archiveUrl ? 'seeArchive' : 'seeSource')}
      </a>
    </div>
  );
}

function Ficha({ detail }: { detail: ThemeDetail }) {
  const lang = useLang();
  const t = useT();
  const { ficha, reference } = detail;
  return (
    <section className="site-themepage__ficha" aria-labelledby="ficha-documented">
      <h2 className="site-h2" id="ficha-documented">
        {t('documented')}
      </h2>
      <p className="site-p">{ficha.documented[lang]}</p>
      <h2 className="site-h2">{t('reading')}</h2>
      <p className="site-p">{ficha.reading[lang]}</p>
      <p className="site-p site-themepage__palette">
        {t('palette')}, {PALETTE_TEXT[ficha.palette.origin][lang]}: {ficha.palette.note[lang]}
      </p>
      <h2 className="site-h2">{t('sources')}</h2>
      <SourceList sources={reference.sources} />
    </section>
  );
}

function ThemeView({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const { prefs, update } = useSitePrefsContext();
  const status = useThemeStylesheet(entry.id);
  const data = useThemeDetail(entry);
  const inUse = prefs.theme === entry.id;

  if (status === 'error' || data.status === 'error') return <p className="site-page site-lead">{t('themeLoadError')}</p>;
  if (status !== 'ready' || data.status !== 'ready') {
    return (
      <p className="site-page site-lead" role="status">
        {t('loadingTheme')}
      </p>
    );
  }

  const detail = data.value;
  const siblings = siblingsOf(entry);
  const index = siblings.indexOf(entry);
  const previous = siblings[index - 1];
  const next = siblings[index + 1];
  const mode = prefs.mode === 'native' ? undefined : prefs.mode;

  return (
    <NeoProvider theme={entry.id} mode={mode} className="site-themepage">
      <div className="site-themepage__inner">
        <p className="site-doc__crumbs">
          <a href={toHash(lang, '/atlas')}>{t('backToAtlas')}</a>
        </p>

        <div className="site-themepage__intro">
          <header className="site-themepage__head">
            <h1 className="site-themepage__title">{entry.name[lang]}</h1>
            <p className="site-lead">{entry.tagline[lang]}</p>
            {entry.predatesStudy ? <p className="site-themepage__note">{t('predatesStudy')}</p> : null}
          </header>
          <div className="site-themepage__facts">
            <Reference entry={entry} detail={detail} />
            <div className="site-themepage__actions">
              <Button disabled={inUse} onClick={() => void loadThemeStylesheet(entry.id).then(() => update({ theme: entry.id }))}>
                {t(inUse ? 'inUse' : 'useAcrossSite')}
              </Button>
            </div>
          </div>
          <Figure detail={detail} />
        </div>

        <Ficha detail={detail} />

        <section aria-labelledby="theme-specimen">
          <h2 className="site-h2" id="theme-specimen">
            {t('specimenHeading')}
          </h2>
          <div className="site-themepage__specimens">
            {(['light', 'dark'] as const).map((scheme) => (
              <NeoProvider key={scheme} theme={entry.id} mode={scheme} className="site-themepage__specimen">
                <p className="site-themepage__label">{t(scheme === 'dark' ? 'modeDark' : 'modeLight')}</p>
                <ThemeSampler />
              </NeoProvider>
            ))}
          </div>
        </section>

        <section aria-labelledby="theme-tokens">
          <h2 className="site-h2" id="theme-tokens">
            {t('tokensHeading')}
          </h2>
          <TokenTables tokens={detail.tokens} scheme={schemeFor(entry.nativeScheme, prefs.mode)} />
        </section>

        <section aria-labelledby="theme-install">
          <h2 className="site-h2" id="theme-install">
            {t('installHeading')}
          </h2>
          {entry.predatesStudy ? null : <p className="site-p">{t('installStudyNote')}</p>}
          <CodeBlock code={installCode(entry.id, entry.fonts.length > 0)} label="TSX" />
        </section>

        <nav className="site-pager" aria-label={t('themeNav')}>
          {previous ? (
            <a href={toHash(lang, `/theme/${previous.id}`)} rel="prev">
              <span className="site-pager__dir">{t('previousTheme')}</span> {previous.name[lang]}
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a href={toHash(lang, `/theme/${next.id}`)} rel="next">
              <span className="site-pager__dir">{t('nextTheme')}</span> {next.name[lang]}
            </a>
          ) : null}
        </nav>
      </div>
    </NeoProvider>
  );
}

/** One theme's page: its reference and ficha, a live specimen in both schemes, its numbers and how to install it. */
export function ThemePage({ id }: { id: string }) {
  const entry = ENTRIES.get(id);
  return entry ? <ThemeView key={entry.id} entry={entry} /> : <NotFound />;
}
```

In `src/site/site.css`:

Replace

```css
  font-size: var(--nbc-fs-sm);
}

.site-notfound {
  display: grid;
  justify-items: start;
```

with

```css
  font-size: var(--nbc-fs-sm);
}

.site-themepage {
  padding: clamp(32px, 6vw, 72px) clamp(16px, 4vw, 40px);
}
.site-themepage__inner {
  display: grid;
  gap: var(--nbc-space-3xl);
  max-inline-size: 1180px;
  margin-inline: auto;
}
.site-themepage__inner > .site-doc__crumbs {
  margin: 0;
}
/* The name gets the full width (a long one-word name must not break); facts and image share the row below. */
.site-themepage__intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  grid-template-areas: 'head head' 'facts figure';
  gap: var(--nbc-space-2xl) clamp(24px, 5vw, 64px);
  align-items: start;
}
.site-themepage__head {
  grid-area: head;
  display: grid;
  gap: var(--nbc-space-md);
}
.site-themepage__facts {
  grid-area: facts;
  display: grid;
  gap: var(--nbc-space-lg);
}
.site-themepage__figure,
.site-themepage__noimage {
  grid-area: figure;
}
.site-themepage__head .site-lead {
  margin: 0;
}
.site-themepage__title {
  margin: 0;
  font-family: var(--nbc-font-display);
  font-weight: var(--nbc-weight-display);
  font-stretch: var(--nbc-display-stretch);
  font-size: clamp(48px, 9vw, 108px);
  line-height: 0.95;
  letter-spacing: var(--nbc-display-spacing);
  text-transform: var(--nbc-display-transform);
  overflow-wrap: anywhere;
}
.site-themepage__note,
.site-themepage__palette,
.site-themepage__figure figcaption {
  font-size: var(--nbc-fs-sm);
  color: var(--nbc-fg-muted);
}
.site-themepage__note {
  margin: 0;
}
.site-themepage__figure {
  margin: 0;
}
.site-themepage__figure img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  max-block-size: 36rem;
  object-fit: cover;
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
}
.site-themepage__figure figcaption {
  margin-block-start: var(--nbc-space-sm);
}
.site-themepage__noimage {
  padding: var(--nbc-space-xl);
  border: var(--nbc-border-width) dashed var(--nbc-border-color);
}
.site-themepage__noimage .site-p {
  margin-block-start: 0;
}
.site-themepage__ficha {
  display: grid;
  gap: var(--nbc-space-sm);
  max-inline-size: 72ch;
}
.site-themepage__ficha .site-h2 {
  margin-block: var(--nbc-space-lg) 0;
}
.site-themepage__ficha .site-h2:first-child {
  margin-block-start: 0;
}
.study-sources {
  max-inline-size: 72ch;
  margin: 0;
  padding-inline-start: 1.4em;
  font-size: var(--nbc-fs-sm);
  line-height: 1.5;
  color: var(--nbc-fg-muted);
}
.study-sources li + li {
  margin-block-start: var(--nbc-space-xs);
}
.site-themepage__specimens {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--nbc-space-lg);
  margin-block-start: var(--nbc-space-lg);
}
.site-themepage__specimen {
  padding: var(--nbc-space-xl);
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
}
.site-themepage__label {
  margin: 0 0 var(--nbc-space-lg);
  font-size: var(--nbc-fs-sm);
  font-weight: var(--nbc-weight-label);
  letter-spacing: var(--nbc-label-spacing);
  text-transform: var(--nbc-label-transform);
}
@media (max-width: 900px) {
  .site-themepage__intro,
  .site-themepage__specimens {
    grid-template-columns: minmax(0, 1fr);
  }
  .site-themepage__intro {
    grid-template-areas: 'head' 'facts' 'figure';
  }
}

.site-notfound {
  display: grid;
  justify-items: start;
```

Create `src/site/study/SourceList.tsx`:

```tsx
import type { Source } from '../../study/types';

/** Numbered sources; the numbers are the [n] markers in the text above. */
export function SourceList({ sources }: { sources: readonly Source[] }) {
  return (
    <ol className="study-sources">
      {sources.map((source) => (
        <li key={source.url}>
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.title}
          </a>
          {source.publisher ? `, ${source.publisher}` : ''}
          {source.year ? ` (${source.year})` : ''}
        </li>
      ))}
    </ol>
  );
}
```

Create `src/site/study/detail.ts`:

```ts
/**
 * The full data of one theme for its page, loaded on demand: a study theme's
 * data file and generated stylesheet are separate chunks; a core theme's ficha
 * comes from core-fichas.ts and its tokens from the core stylesheet.
 */
import { parseThemeTokens } from '../../lib/themes/color';
import type { NeoBuiltinTheme } from '../../lib/themes';
import type { CatalogEntry } from '../../study/catalog';
import type { Ficha, Reference, StudyThemeInput } from '../../study/types';
import { THEME_TOKENS } from '../docs/themeTokens';
import { useLazy } from './lazy';
import type { Lazy } from './lazy';

const themeModules = import.meta.glob<StudyThemeInput>('../../study/themes/*/*.ts', { import: 'default' });
const themeStyles = import.meta.glob<string>(
  ['../../study/.generated/themes/*.css', '!../../study/.generated/themes/*.fonts.css'],
  { query: '?raw', import: 'default' },
);
const images = import.meta.glob<string>('../../study/images/*.avif', { eager: true, query: '?url', import: 'default' });

export interface ThemeDetail {
  readonly reference: Reference;
  readonly ficha: Ficha;
  /** The theme block's tokens, parsed exactly like the contract tests parse them. */
  readonly tokens: Map<string, string>;
}

/** A theme's reference and ficha: its own lazy chunk for a study theme, core-fichas.ts for a core one. */
export async function loadThemeData(entry: CatalogEntry): Promise<Pick<ThemeDetail, 'reference' | 'ficha'>> {
  if (entry.predatesStudy) {
    const { CORE_FICHAS } = await import('../../study/core-fichas');
    const core = CORE_FICHAS[entry.id as NeoBuiltinTheme];
    return { reference: core.reference, ficha: core.ficha };
  }
  const theme = await themeModules[`../../study/themes/${entry.scene}/${entry.id}.ts`]();
  return { reference: theme.reference, ficha: theme.ficha };
}

export async function loadDetail(entry: CatalogEntry): Promise<ThemeDetail> {
  const tokens = entry.predatesStudy
    ? Promise.resolve(THEME_TOKENS[entry.id as NeoBuiltinTheme])
    : themeStyles[`../../study/.generated/themes/${entry.id}.css`]().then((css) => parseThemeTokens(css, entry.id));
  const [data, parsed] = await Promise.all([loadThemeData(entry), tokens]);
  return { ...data, tokens: parsed };
}

export const useThemeDetail = (entry: CatalogEntry): Lazy<ThemeDetail> => useLazy(entry.id, () => loadDetail(entry));

export const imageUrl = (file: string): string | undefined => images[`../../study/images/${file}`];
```

Create `src/site/study/lazy.ts`:

```ts
import { useEffect, useState } from 'react';

export type Lazy<T> = { readonly status: 'loading' } | { readonly status: 'ready'; readonly value: T } | { readonly status: 'error' };

/**
 * Loads once per key, for the study's lazy chunks (a theme's data, an essay).
 * A failed load reports 'error' instead of loading forever, and a load that
 * finishes after the key changed is ignored.
 */
export function useLazy<T>(key: string, load: () => Promise<T>): Lazy<T> {
  const [state, setState] = useState<{ key: string; lazy: Lazy<T> } | null>(null);
  useEffect(() => {
    let live = true;
    load().then(
      (value) => live && setState({ key, lazy: { status: 'ready', value } }),
      () => live && setState({ key, lazy: { status: 'error' } }),
    );
    return () => {
      live = false;
    };
    // The key names what is loaded; `load` is a fresh closure on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state?.key === key ? state.lazy : { status: 'loading' };
}
```

- [ ] **Step 4: Run the tests and the gates**

Run: `npx vitest run src/site/study/lazy.test.tsx`

Expected: PASS

```text
Test Files  1 passed (1)
Tests  3 passed (3)
```

Run: `npx vitest run`

Expected: PASS

```text
Test Files  45 passed (45)
Tests  872 passed | 4 skipped (876)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

Run: `npx playwright test -g "theme page|production CSS keeps" --reporter=line`

Expected: PASS

```text
26 passed
```

- [ ] **Step 5: Commit**

```bash
git add e2e/site.spec.ts src/site/App.tsx src/site/docs/TokenTables.tsx src/site/pages/ThemePage.tsx src/site/site.css src/site/study/SourceList.tsx src/site/study/detail.ts src/site/study/lazy.test.tsx src/site/study/lazy.ts
git commit -F - <<'EOF'
feat(site): a page per theme — reference, ficha, specimen, tokens and install

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

### Task 6: The essays

Seven essays in Spanish and English (D9): the study home's thesis, Origins, Method, and an introduction for each scene. Every fact comes from the research dossier (`docs/superpowers/plans/2026-10-05-neobrutalism-study-engine.research.md`, Part B) and is paraphrased; where sources disagree, the essay says so instead of picking one. The scene introductions run three or four short sections rather than D9's minimum of two paragraphs, because the dossier had enough verified material; each scene's full essay still comes with its own sub-project. The Method essay's two new sources (WCAG 2.2 and Commons' licensing policy) were opened on 2026-10-05.

**Files:**
- Test (new): `src/study/essays.content.test.ts`
- Create: `src/study/essays/home/en.md`
- Create: `src/study/essays/home/es.md`
- Create: `src/study/essays/home/sources.ts`
- Create: `src/study/essays/method/en.md`
- Create: `src/study/essays/method/es.md`
- Create: `src/study/essays/method/sources.ts`
- Create: `src/study/essays/origins/en.md`
- Create: `src/study/essays/origins/es.md`
- Create: `src/study/essays/origins/sources.ts`
- Create: `src/study/essays/scene-germany/en.md`
- Create: `src/study/essays/scene-germany/es.md`
- Create: `src/study/essays/scene-germany/sources.ts`
- Create: `src/study/essays/scene-japan/en.md`
- Create: `src/study/essays/scene-japan/es.md`
- Create: `src/study/essays/scene-japan/sources.ts`
- Create: `src/study/essays/scene-latam/en.md`
- Create: `src/study/essays/scene-latam/es.md`
- Create: `src/study/essays/scene-latam/sources.ts`
- Create: `src/study/essays/scene-usa/en.md`
- Create: `src/study/essays/scene-usa/es.md`
- Create: `src/study/essays/scene-usa/sources.ts`

**Interfaces:**
- Consumes: `ESSAY_SLUGS`, `essayProblems` (Task 1); the `Source` type.
- Produces: `src/study/essays/<slug>/{es.md,en.md,sources.ts}` for every slug in `ESSAY_SLUGS`; each `sources.ts` default-exports a `readonly Source[]` whose order gives the `[n]` numbers.

- [ ] **Step 1: Write the failing tests**

Create `src/study/essays.content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { ESSAY_SLUGS, essayProblems } from './essays';
import type { Source } from './types';

const texts = import.meta.glob<string>('./essays/*/*.md', { eager: true, query: '?raw', import: 'default' });
const sources = import.meta.glob<readonly Source[]>('./essays/*/sources.ts', { eager: true, import: 'default' });

describe('the essays of the study', () => {
  it('are exactly the ones the site renders, each with es, en and sources', () => {
    const slugs = (paths: string[]) => [...new Set(paths.map((path) => path.split('/')[2]))].sort();
    expect(slugs(Object.keys(texts))).toEqual([...ESSAY_SLUGS].sort());
    expect(Object.keys(texts)).toHaveLength(ESSAY_SLUGS.length * 2);
    expect(slugs(Object.keys(sources))).toEqual([...ESSAY_SLUGS].sort());
  });

  it.each(ESSAY_SLUGS)('%s passes the essay checks', (slug) => {
    const problems = essayProblems(
      slug,
      texts[`./essays/${slug}/es.md`],
      texts[`./essays/${slug}/en.md`],
      sources[`./essays/${slug}/sources.ts`] ?? [],
    );
    expect(problems).toEqual([]);
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/study/essays.content.test.ts`

Expected: FAIL

```text
FAIL  src/study/essays.content.test.ts > the essays of the study > scene-japan passes the essay checks
AssertionError: expected [ …(2) ] to deeply equal []
FAIL  src/study/essays.content.test.ts > the essays of the study > scene-germany passes the essay checks
FAIL  src/study/essays.content.test.ts > the essays of the study > scene-usa passes the essay checks
FAIL  src/study/essays.content.test.ts > the essays of the study > scene-latam passes the essay checks
```

- [ ] **Step 3: Write the essays**

Copy each file exactly: the text is the deliverable, and the test checks markers and sources but not wording.

Create `src/study/essays/home/en.md`:

```md
Thick borders, hard single-colour shadows, flat colour and a structure left in plain sight. Nielsen Norman Group describes neobrutalism as a visual trend of high contrast, blocky layouts, bold colours and deliberately unpolished elements; compared with web brutalism, it says, neobrutalism mixes that roughness with nostalgic 1990s graphics and comes out more colourful and more orderly [1].

## Where the name comes from

The word began in architecture. Le Corbusier called concrete left exposed *béton brut*, and his use of the phrase is what spread the term brutalism [2]. In 1950s Britain, architects and critics turned it into the *New Brutalism* [3]. In 2014 Pascal Deville brought it to the web: he coined the term and founded Brutalist Websites, a directory of sites that embody it [4]. That directory presents web brutalism as a younger generation's rough answer to light, optimistic and frivolous web design [5].

## How each theme reads

Each theme's ficha separates what the sources say from what the theme reads into them, and its palette states whether the colours come from a document, a photograph or a reading of our own. The themes are not costumes: they restyle the whole library, components included, without touching its geometry. Controls are 32, 40 or 48 pixels tall in every one of them, and every one meets WCAG 2.2 contrast in light and dark. Each theme's page lets you try it across the site.
```

Create `src/study/essays/home/es.md`:

```md
Bordes gruesos, sombras duras de un solo color, colores planos y una estructura que se deja ver. Nielsen Norman Group describe el neobrutalismo como una tendencia visual de alto contraste, composición en bloques, colores intensos y elementos poco pulidos a propósito; frente al brutalismo web, dice, mezcla esa aspereza con gráficos nostálgicos de los noventa y resulta más colorido y más ordenado [1].

## De dónde viene el nombre

La palabra empezó en la arquitectura. Le Corbusier llamó *béton brut* al hormigón que se deja a la vista, y fue su uso de la expresión lo que difundió el término brutalismo [2]. En la Gran Bretaña de los años cincuenta, arquitectos y críticos lo convirtieron en el *New Brutalism* [3]. En 2014 Pascal Deville lo llevó a la web: acuñó el término y fundó Brutalist Websites, un directorio de sitios que lo encarnan [4]. Ese directorio presenta el brutalismo web como la respuesta áspera de una generación más joven a un diseño web ligero, optimista y frívolo [5].

## Cómo se lee cada tema

La ficha de cada tema separa lo que dicen las fuentes de lo que el tema interpreta, y su paleta declara si los colores vienen de un documento, de una fotografía o de una lectura propia. Los temas no son disfraces: cambian la librería entera, componentes incluidos, sin tocar su geometría. Los controles miden 32, 40 o 48 píxeles en todos, y todos cumplen los contrastes de WCAG 2.2 en claro y en oscuro. Desde la página de cada tema se puede probar en todo el sitio.
```

Create `src/study/essays/home/sources.ts`:

```ts
import type { Source } from '../../types';

const sources: readonly Source[] = [
  {
    title: 'Neobrutalism: Definition and Best Practices',
    url: 'https://www.nngroup.com/articles/neobrutalism/',
    publisher: 'Nielsen Norman Group',
    year: 2025,
    accessed: '2026-10-05',
  },
  {
    title: 'Du béton brut au brutalisme',
    url: 'https://passerelles.essentiels.bnf.fr/fr/article/471c3dd1-bbab-41dc-ad1f-3a6da99c1a65-beton-brut-brutalisme',
    publisher: 'Bibliothèque nationale de France',
    accessed: '2026-10-05',
  },
  { title: 'Brutalism', url: 'https://www.tate.org.uk/art/art-terms/b/brutalism', publisher: 'Tate', accessed: '2026-10-05' },
  {
    title: 'The Split Personality Of Brutalist Web Development',
    url: 'https://www.smashingmagazine.com/2020/01/split-personality-brutalist-web-development/',
    publisher: 'Smashing Magazine',
    year: 2020,
    accessed: '2026-10-05',
  },
  { title: 'Brutalist Websites', url: 'https://brutalistwebsites.com/', accessed: '2026-10-05' },
];

export default sources;
```

Create `src/study/essays/method/en.md`:

```md
## One work per theme

Every study theme starts from a single documented work: a building, a publication, an object, a website. Its ficha cites at least two sources, at least one of them not Wikipedia. Sources are paraphrased, never quoted, and every statement carries the number of its source, the same in Spanish and in English.

## The documented and the reading

The ficha has two parts. What is documented gathers what the sources say. The reading explains what the theme takes from the work and why: it is an interpretation and is presented as one. The palette states its origin: documented, when a source names the colours; sampled, when they come from a free photograph; interpreted, when they are a reading of our own.

## Images

Photographs come from Wikimedia Commons, which accepts only free content: anyone may reuse it, change it and use it commercially, and non-commercial or no-derivatives licences are excluded [2]. The study narrows that to CC0, public domain, CC BY and CC BY-SA. Each image is resized to at most 1600 pixels and converted to AVIF, and its credit names the author, the licence and the source page. Images live on the site, not in the npm package. When a work has no free image, its page links to an archive or to the main source.

## One geometry, many themes

Every theme fills in the same token contract. Colour, type, borders, shadows and detail change; geometry does not: controls are 32, 40 or 48 pixels tall in every theme. Detail families, such as concrete or the grid, add texture without changing the size of anything, and an automatic check rejects, in each theme's own CSS, literal colours, images and any change of geometry outside pseudo-elements.

## Contrast

Every colour pair of the contract is measured in light and dark with the WCAG 2.2 formula: 4.5:1 for text and 3:1 for control boundaries and the focus indicator, the minimums the standard sets for normal text and for user interface components [1]. Pairs are measured on the textures too. A theme that fails does not ship.
```

Create `src/study/essays/method/es.md`:

```md
## Una obra por tema

Cada tema del estudio parte de una sola obra documentada: un edificio, una publicación, un objeto, un sitio web. Su ficha cita al menos dos fuentes, y al menos una no es Wikipedia. Las fuentes se parafrasean, nunca se citan textualmente, y cada afirmación lleva el número de su fuente, el mismo en español y en inglés.

## Lo documentado y la lectura

La ficha tiene dos partes. Lo documentado recoge lo que dicen las fuentes. La lectura explica qué toma el tema de la obra y por qué: es una interpretación y se presenta como tal. La paleta declara su origen: documentada, si una fuente nombra los colores; muestreada, si salen de una fotografía libre; interpretada, si son una lectura propia.

## Las imágenes

Las fotografías vienen de Wikimedia Commons, que solo acepta contenido libre: cualquiera puede reutilizarlo, modificarlo y usarlo con fines comerciales, y las licencias no comerciales o sin obras derivadas quedan fuera [2]. El estudio se limita a CC0, dominio público, CC BY y CC BY-SA. Cada imagen se reduce a 1600 píxeles como máximo y se convierte a AVIF, y su crédito nombra la autoría, la licencia y la página de origen. Las imágenes viven en el sitio, no en el paquete npm. Cuando una obra no tiene imagen libre, su página enlaza a un archivo o a la fuente principal.

## Una geometría, muchos temas

Todos los temas rellenan el mismo contrato de tokens. Cambian el color, la letra, los bordes, las sombras y el detalle, pero no la geometría: los controles miden 32, 40 o 48 píxeles en todos. Las familias de detalles, como el hormigón o la retícula, añaden textura sin cambiar el tamaño de nada, y una comprobación automática rechaza, en el CSS propio de cada tema, los colores literales, las imágenes y cualquier cambio de geometría fuera de los pseudoelementos.

## El contraste

Cada par de colores del contrato se mide en claro y en oscuro con la fórmula de WCAG 2.2: 4,5:1 para el texto y 3:1 para los bordes de los controles y el indicador de foco, los mínimos que la norma pide al texto normal y a los componentes de interfaz [1]. Los pares se miden también sobre las texturas. Un tema que no cumple no se publica.
```

Create `src/study/essays/method/sources.ts`:

```ts
import type { Source } from '../../types';

const sources: readonly Source[] = [
  {
    title: 'Web Content Accessibility Guidelines (WCAG) 2.2',
    url: 'https://www.w3.org/TR/WCAG22/',
    publisher: 'W3C',
    year: 2024,
    accessed: '2026-10-05',
  },
  {
    title: 'Commons:Licensing',
    url: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
    publisher: 'Wikimedia Commons',
    accessed: '2026-10-05',
  },
];

export default sources;
```

Create `src/study/essays/origins/en.md`:

```md
## Béton brut

Le Corbusier called concrete left as it comes out of the formwork *béton brut*, raw concrete. At the handover of the Unité d'habitation in Marseille, on 14 October 1952, he said he had come to value the marks the formwork leaves on that surface [1]. His use of the phrase is what spread the word brutalism [1][2], and the Fondation Le Corbusier counts the Unités d'habitation among his brutalist works [3].

## The New Brutalism

In 1950, aged 21 and 26, Alison and Peter Smithson won the competition for a secondary school at Hunstanton. The building, finished in 1954, has a welded steel frame inspired by Mies van der Rohe and its services in plain view, and it is now listed Grade II* [4]. Who named the *New Brutalism* is disputed: the Twentieth Century Society credits Alison Smithson, who meant by it truth to materials and the use of found objects [4], while Tate credits the critic Reyner Banham [2].

Banham published his essay "The New Brutalism" in *The Architectural Review* in December 1955, and in 1966 the book *The New Brutalism: Ethic or Aesthetic?* [5]. The BnF sums up his three criteria: a legible form, a structure shown clearly, and materials valued as found [1].

## The Swiss grid

After the Second World War, Swiss graphic design had its golden age. The new International Style, also called the International Typographic Style or the Swiss Style, joined the theories of the Zurich and Basel schools [6]. The Swiss National Library lists its traits: precision, a typographic grid and sans-serif type, simple typography, strong visual impact, rational composition without ornament, photography, mostly black and white, instead of illustration, and restrained colour [6]. Armin Hofmann, head of the Basel school of arts and crafts, spread the style and built ties with Yale; through the 1970s and 1980s it gave way [6]. Lars Müller presents the magazine *Neue Grafik* as the organ of that Swiss school, with a rigorous Zurich wing, and as a model for corporate design [7].

## Brutalism on the web

Pascal Deville coined the term web brutalism in 2014 and founded the Brutalist Websites directory [8]. Co-founder and creative director of the agency Freundliche Grüsse, he borrowed the word because he saw web design drifting toward streamlined, neutral interfaces with no brand character, and saw designers trying rough, back-to-basics sites away from the pursuit of a perfect user experience [9]. The directory itself presents the style as a younger generation's rough answer to light, optimistic and frivolous web design [10]. Deville later told three strands apart: purists, UX minimalists and artists [8]. In 2017 the journal *Dialectic* added that these sites borrow the rough look of the early web, from 1994 to 1998, and use raw, hand-written HTML [11].

## Neobrutalism

Nielsen Norman Group defines neobrutalism, also spelled neubrutalism, as a visual trend of high contrast, blocky layouts, bold colours, thick borders and unpolished elements [12]. Its typical traits are bright primary colours, thick borders and solid lines, and hard single-colour shadows, such as a black shadow offset by 4 pixels, instead of soft ones; NN/g advises keeping navigation conventional and the interface accessible [12]. Among its examples it names Figma's brand refresh and Gumroad [12]. Gumroad's founder, Sahil Lavingia, introduced the new brand, with a new website, fonts and colours, on 26 November 2021, in the company's tenth year [13].
```

Create `src/study/essays/origins/es.md`:

```md
## Béton brut

Le Corbusier llamó *béton brut*, hormigón bruto, al hormigón que se deja tal como sale del encofrado. En la entrega de la Unité d'habitation de Marsella, el 14 de octubre de 1952, contó que había aprendido a apreciar las marcas que el encofrado deja en esa superficie [1]. Fue su uso de la expresión lo que difundió la palabra brutalismo [1][2], y la Fondation Le Corbusier cuenta las Unités d'habitation entre sus obras brutalistas [3].

## El New Brutalism

En 1950, con 21 y 26 años, Alison y Peter Smithson ganaron el concurso para una escuela secundaria en Hunstanton. El edificio, terminado en 1954, tiene una estructura de acero soldado inspirada en Mies van der Rohe y las instalaciones a la vista, y hoy está catalogado con el grado II* [4]. Quién bautizó el *New Brutalism* es discutido: la Twentieth Century Society se lo atribuye a Alison Smithson, que lo entendía como verdad de los materiales y uso de objetos encontrados [4], mientras que la Tate se lo atribuye al crítico Reyner Banham [2].

Banham publicó su ensayo «The New Brutalism» en *The Architectural Review* en diciembre de 1955, y en 1966 el libro *The New Brutalism: Ethic or Aesthetic?* [5]. La BnF resume sus tres criterios: una forma legible, una estructura mostrada con claridad y unos materiales valorados tal como se encuentran [1].

## La retícula suiza

Tras la Segunda Guerra Mundial el diseño gráfico suizo vivió su edad de oro. El nuevo Estilo Internacional, también llamado Estilo Tipográfico Internacional o estilo suizo, unió las teorías de las escuelas de Zúrich y de Basilea [6]. La Biblioteca Nacional Suiza enumera sus rasgos: precisión, retícula tipográfica y letra de palo seco, tipografía sencilla, un fuerte impacto visual, composición racional sin ornamento, fotografía, casi siempre en blanco y negro, en lugar de ilustración, y un color contenido [6]. Armin Hofmann, director de la escuela de artes y oficios de Basilea, difundió el estilo y tendió lazos con Yale; entre los años setenta y ochenta fue cediendo su lugar [6]. Lars Müller presenta la revista *Neue Grafik* como el órgano de esa escuela suiza, con un ala rigurosa en Zúrich, y como un modelo para el diseño corporativo [7].

## El brutalismo en la web

Pascal Deville acuñó el término brutalismo web en 2014 y fundó el directorio Brutalist Websites [8]. Cofundador y director creativo de la agencia Freundliche Grüsse, tomó prestada la palabra porque veía que el diseño web derivaba hacia interfaces pulidas y neutras, sin carácter de marca, y que había diseñadores probando sitios toscos y elementales lejos de la búsqueda de una experiencia de usuario perfecta [9]. El propio directorio presenta el estilo como la respuesta áspera de una generación más joven a un diseño web ligero, optimista y frívolo [10]. Más tarde Deville distinguió tres corrientes: puristas, minimalistas de la experiencia de usuario y artistas [8]. La revista *Dialectic* añadía en 2017 que estos sitios toman el aspecto tosco de la web temprana, de 1994 a 1998, y usan HTML en bruto, escrito a mano [11].

## El neobrutalismo

Nielsen Norman Group define el neobrutalismo, también escrito neubrutalismo, como una tendencia visual de alto contraste, composición en bloques, colores intensos, bordes gruesos y elementos sin pulir [12]. Sus rasgos típicos son los colores primarios brillantes, los bordes gruesos y las líneas sólidas, y las sombras duras de un solo color, como una sombra negra desplazada 4 píxeles, en lugar de las sombras difusas; NN/g recomienda mantener una navegación convencional y cuidar la accesibilidad [12]. Entre sus ejemplos cita la renovación de marca de Figma y Gumroad [12]. El fundador de Gumroad, Sahil Lavingia, presentó la nueva marca, con web, tipografías y colores nuevos, el 26 de noviembre de 2021, en el décimo año de la empresa [13].
```

Create `src/study/essays/origins/sources.ts`:

```ts
import type { Source } from '../../types';

const sources: readonly Source[] = [
  {
    title: 'Du béton brut au brutalisme',
    url: 'https://passerelles.essentiels.bnf.fr/fr/article/471c3dd1-bbab-41dc-ad1f-3a6da99c1a65-beton-brut-brutalisme',
    publisher: 'Bibliothèque nationale de France',
    accessed: '2026-10-05',
  },
  { title: 'Brutalism', url: 'https://www.tate.org.uk/art/art-terms/b/brutalism', publisher: 'Tate', accessed: '2026-10-05' },
  {
    title: 'Vocabulaire corbuséen',
    url: 'https://www.fondationlecorbusier.fr/dossier-thematique/vocabulaire-corbuseen/',
    publisher: 'Fondation Le Corbusier',
    accessed: '2026-10-05',
  },
  {
    title: '1954: Smithdon High School, Hunstanton',
    url: 'https://c20society.org.uk/100-buildings/1954-smithdon-high-school-hunstanton',
    publisher: 'The Twentieth Century Society',
    accessed: '2026-10-05',
  },
  {
    title: 'The New Brutalism: Ethic vs. Marxism? Ideological Collisions in Post-War English Architecture',
    url: 'https://hpa.unibo.it/article/view/11436',
    publisher: 'Histories of Postwar Architecture',
    year: 2020,
    accessed: '2026-10-05',
  },
  {
    title: 'The International style 1950-1970',
    url: 'https://www.nb.admin.ch/en/the-international-style-1950-1970',
    publisher: 'Swiss National Library',
    accessed: '2026-10-05',
  },
  {
    title: 'Neue Grafik/New Graphic Design/Graphisme Actuel 1958–1965',
    url: 'https://www.lars-mueller-publishers.com/neue-grafiknew-graphic-designgraphisme-actuel-1958-1965',
    publisher: 'Lars Müller Publishers',
    accessed: '2026-10-05',
  },
  {
    title: 'The Split Personality Of Brutalist Web Development',
    url: 'https://www.smashingmagazine.com/2020/01/split-personality-brutalist-web-development/',
    publisher: 'Smashing Magazine',
    year: 2020,
    accessed: '2026-10-05',
  },
  {
    title: "Are brutalist sites the web's punk rock moment?",
    url: 'https://www.creativebloq.com/features/are-brutalist-sites-the-webs-punk-rock-moment',
    publisher: 'Creative Bloq',
    year: 2018,
    accessed: '2026-10-05',
  },
  { title: 'Brutalist Websites', url: 'https://brutalistwebsites.com/', accessed: '2026-10-05' },
  {
    title: 'On Web Brutalism and Contemporary Web Design',
    url: 'https://quod.lib.umich.edu/d/dialectic/14932326.0001.107/--on-web-brutalism-and-contemporary-web-design?rgn=main&view=fulltext',
    publisher: 'Dialectic',
    year: 2017,
    accessed: '2026-10-05',
  },
  {
    title: 'Neobrutalism: Definition and Best Practices',
    url: 'https://www.nngroup.com/articles/neobrutalism/',
    publisher: 'Nielsen Norman Group',
    year: 2025,
    accessed: '2026-10-05',
  },
  {
    title: 'Introducing the new Gumroad',
    url: 'https://sahil.gumroad.com/p/introducing-the-new-gumroad',
    publisher: 'Gumroad',
    year: 2021,
    accessed: '2026-10-05',
  },
];

export default sources;
```

Create `src/study/essays/scene-germany/en.md`:

```md
## Ulm

The Ulm School of Design, the Hochschule für Gestaltung, ran from 1953 to 1968. It was founded by Inge Aicher-Scholl, Otl Aicher and Max Bill [1][2]; Bill, a former Bauhaus student, was its first rector [2]. Its Ulm model grounded design in science and technology, and it produced the Ulm stool, the stacking TC 100 tableware and Braun's SK 4 radio-phonograph [1]. Gui Bonsiepe is listed among its staff from 1955 to 1959 [2]; he would later lead the industrial design group that built the Cybersyn operations room in Chile [3].

## Munich 1972

For the Munich Olympic Games, Otl Aicher chose seven colours plus white, among them a silver and an official light blue meant to be apolitical, with the Bavarian Alps as a reference [4]. He deliberately left out red, gold and black, tied to the 1936 Berlin Games, and the black and yellow of the city of Munich [4]; Smithsonian sums up the palette as light shades of blue, green, silver, orange and yellow [5]. The prescribed typeface was Univers, for a light typography free of pathos, and Gerhard Joksch drew the first pictogram sketches in April 1968 [4]. The pictograms are drawn on a grid, with stick figures along vertical and diagonal lines, and a Cooper Hewitt poster gathers 166 of them [5]. For SFMOMA it was a complete system, from signage to print and staff uniforms [6].

## DIN 1451

The German standards committee defined DIN 1451 in 1931, under Ludwig Goller, and confirmed it in 1936 [7]; according to Wikipedia, a 1938 order prescribed it for the Autobahn [8]. It is used on traffic signs and postmarks [7][8], and it was on number plates until 1994 according to Fonts In Use, or until January 1995 according to Wikipedia [7][8]. Adolf Gropp drew the 1980 revision [7], and the condensed version, the Engschrift, goes back to Prussian railway lettering, from 1905 according to Wikipedia [8].

## Concrete in Berlin

The scene's theme, for now, is the Mäusebunker in Berlin-Lichterfelde. Its page carries the building's sources and what the theme reads in it.
```

Create `src/study/essays/scene-germany/es.md`:

```md
## Ulm

La Escuela de Diseño de Ulm, la Hochschule für Gestaltung, funcionó de 1953 a 1968. La fundaron Inge Aicher-Scholl, Otl Aicher y Max Bill [1][2]; Bill, antiguo alumno de la Bauhaus, fue su primer rector [2]. Su modelo de Ulm entendía el diseño a partir de la ciencia y la técnica, y de allí salieron el taburete de Ulm, la vajilla apilable TC 100 y el radiotocadiscos SK 4 de Braun [1]. Gui Bonsiepe figura entre su personal de 1955 a 1959 [2]; más tarde dirigiría en Chile el grupo de diseño industrial que construyó la sala de operaciones de Cybersyn [3].

## Múnich 1972

Para los Juegos Olímpicos de Múnich, Otl Aicher eligió siete colores y el blanco, entre ellos un plateado y un azul claro oficial pensado como apolítico, con los Alpes bávaros como referencia [4]. Dejó fuera a propósito el rojo, el oro y el negro, asociados a los Juegos de Berlín de 1936, y el negro y amarillo de la ciudad de Múnich [4]; el Smithsonian resume la paleta en tonos claros de azul, verde, plata, naranja y amarillo [5]. La letra prescrita fue la Univers, para una tipografía ligera y sin patetismo, y Gerhard Joksch dibujó los primeros bocetos de pictogramas en abril de 1968 [4]. Los pictogramas se trazan sobre una retícula, con figuras de palo en líneas verticales y diagonales, y un cartel del Cooper Hewitt reúne 166 [5]. Para el SFMOMA fue un sistema completo, de la señalética a los impresos y los uniformes del personal [6].

## DIN 1451

El comité alemán de normalización definió la DIN 1451 en 1931, bajo la dirección de Ludwig Goller, y la confirmó en 1936 [7]; según Wikipedia, una orden de 1938 la prescribió para las autopistas [8]. Se usa en las señales de tráfico y en los matasellos [7][8], y estuvo en las matrículas hasta 1994 según Fonts In Use, o hasta enero de 1995 según Wikipedia [7][8]. Adolf Gropp dibujó la revisión de 1980 [7], y la versión estrecha, la Engschrift, viene de la rotulación de los ferrocarriles prusianos, de 1905 según Wikipedia [8].

## Hormigón en Berlín

El tema de la escena, por ahora, es el Mäusebunker de Berlín-Lichterfelde. Su página recoge las fuentes del edificio y lo que el tema lee en él.
```

Create `src/study/essays/scene-germany/sources.ts`:

```ts
import type { Source } from '../../types';

const sources: readonly Source[] = [
  {
    title: 'From the Zero Hour to 1968',
    url: 'https://hfg-archiv.museumulm.de/en/permanent-exhibition/from-the-zero-hour-to-1968/',
    publisher: 'HfG-Archiv Ulm, Museum Ulm',
    accessed: '2026-10-05',
  },
  { title: 'Ulm School of Design', url: 'https://en.wikipedia.org/wiki/Ulm_School_of_Design', publisher: 'Wikipedia', accessed: '2026-10-05' },
  {
    title: 'Cybernetic Revolutionaries',
    url: 'https://www.cabinetmagazine.org/issues/46/medina.php',
    publisher: 'Cabinet',
    year: 2012,
    accessed: '2026-10-05',
  },
  {
    title: 'The Rainbow Games',
    url: 'https://www.otlaicher.de/en/articles/the-rainbow-games/',
    publisher: 'otlaicher.de',
    year: 2022,
    accessed: '2026-10-05',
  },
  {
    title: "This Graphic Artist's Olympic Pictograms Changed Urban Design Forever",
    url: 'https://www.smithsonianmag.com/innovation/this-graphic-artists-olympic-pictograms-changed-urban-design-forever-180978256/',
    publisher: 'Smithsonian Magazine',
    year: 2021,
    accessed: '2026-10-05',
  },
  { title: 'Otl Aicher: München 1972', url: 'https://www.sfmoma.org/exhibition/otl-aicher/', publisher: 'SFMOMA', accessed: '2026-10-05' },
  { title: 'DIN 1451', url: 'https://fontsinuse.com/typefaces/1149/din-1451', publisher: 'Fonts In Use', accessed: '2026-10-05' },
  { title: 'DIN 1451', url: 'https://en.wikipedia.org/wiki/DIN_1451', publisher: 'Wikipedia', accessed: '2026-10-05' },
];

export default sources;
```

Create `src/study/essays/scene-japan/en.md`:

```md
## Metabolism

The movement began with a manifesto, *Metabolism: The Proposals for New Urbanism*, written for the World Design Conference held in Tokyo in 1960 [1][2]. Behind it were the architects Kisho Kurokawa, Kiyonori Kikutake, Fumihiko Maki and Masato Ōtaka, the designers Kenji Ekuan and Kiyoshi Awazu and the critic Noboru Kawazoe, with Kenzo Tange guiding the group [1]. The idea: cities and buildings that grow and renew themselves like the cells of a living organism [1]. The manifesto gathered four essays: Ocean City, Space City, Towards Group Form, and Material and Man [2].

Little was built. The Nakagin Capsule Tower, from 1972, is the best-known Metabolist work [1][2], and Expo '70 in Osaka gathered much of the group's work [2].

## The dense page

The Japanese web is known for being crowded. *MultiLingual* describes sites with loud banners, dense text, several columns and many small images, and puts that down to cultural and practical reasons [3]. Japanese mixes four scripts, hiragana, katakana, kanji and the Latin alphabet, and can run horizontally or vertically, which looks chaotic to Western eyes [3]. Its readers also grew up with packed printed flyers, *chirashi*, and want more information before they buy; brands such as Rakuten, Honda and Starbucks run denser Japanese sites than their global ones [3].

GIGAZINE names Yahoo! JAPAN, Rakuten and goo as typical. It reports YouTuber Sabrina Cruz's analysis of 2,671 website images, measured for density and brightness, in which Japanese sites stood apart from other countries', and a designer's view: kanji pack a lot of meaning into few characters, and since Japanese has no italics or capitals, emphasis comes from decoration [4].

## What the themes take

Nakagin reads the tower as a system of identical modules. Riso starts from the stencil printer and its flat inks, and Y2K from the holographic shine of 1990s trading cards. None of them copies the density of the Japanese web: the library's geometry stays the same, while colour, type and detail change.
```

Create `src/study/essays/scene-japan/es.md`:

```md
## Metabolismo

El movimiento nació con un manifiesto, *Metabolism: The Proposals for New Urbanism*, escrito para la Conferencia Mundial de Diseño celebrada en Tokio en 1960 [1][2]. Lo firmaban los arquitectos Kisho Kurokawa, Kiyonori Kikutake, Fumihiko Maki y Masato Ōtaka, los diseñadores Kenji Ekuan y Kiyoshi Awazu y el crítico Noboru Kawazoe, con Kenzo Tange como guía del grupo [1]. Su idea: ciudades y edificios que crecen y se renuevan como las células de un organismo vivo [1]. El manifiesto reunía cuatro ensayos: Ocean City, Space City, Towards Group Form y Material and Man [2].

Se construyó poco. La Torre de Cápsulas Nakagin, de 1972, es la obra metabolista más conocida [1][2], y la Expo '70 de Osaka concentró buena parte del trabajo del grupo [2].

## La página densa

La web japonesa tiene fama de abigarrada. La revista *MultiLingual* describe sitios con banners llamativos, texto denso, varias columnas y muchas imágenes pequeñas, y atribuye esa forma a razones culturales y prácticas [3]. El japonés mezcla cuatro escrituras, hiragana, katakana, kanji y alfabeto latino, y puede escribirse en horizontal o en vertical, lo que a ojos occidentales parece caótico [3]. Además, su público creció con folletos impresos muy cargados, los *chirashi*, y quiere más información antes de comprar; marcas como Rakuten, Honda o Starbucks tienen sitios japoneses más densos que los globales [3].

GIGAZINE pone como ejemplos típicos a Yahoo! JAPAN, Rakuten y goo. Recoge el análisis de la youtuber Sabrina Cruz sobre 2671 imágenes de sitios web, medidas por densidad y por brillo, en el que los sitios japoneses se apartaban de los de otros países, y la opinión de un diseñador: los kanji concentran mucho significado en pocos caracteres, y como el japonés no tiene cursiva ni mayúsculas, el énfasis se busca con decoración [4].

## Lo que toman los temas

Nakagin lee la torre como un sistema de módulos idénticos. Riso parte de la impresora de esténcil y sus tintas planas, y Y2K, del brillo holográfico de las cartas coleccionables de los noventa. Ninguno copia la densidad de la web japonesa: la geometría de la librería no cambia; cambian el color, la letra y el detalle.
```

Create `src/study/essays/scene-japan/sources.ts`:

```ts
import type { Source } from '../../types';

const sources: readonly Source[] = [
  {
    title: "[Photos] Metabolism: The Future Envisioned by Architects During Japan's Economic Boom",
    url: 'https://www.nippon.com/en/images/i00057/photos-metabolism-the-future-envisioned-by-architects-during-japan%E2%80%99s-economic-boom.html',
    publisher: 'Nippon.com',
    accessed: '2026-10-05',
  },
  { title: 'Metabolism (architecture)', url: 'https://en.wikipedia.org/wiki/Metabolism_(architecture)', publisher: 'Wikipedia', accessed: '2026-10-05' },
  {
    title: 'The truth about Japanese web design',
    url: 'https://multilingual.com/issues/aug-sep-2018/the-truth-about-japanese-web-design/',
    publisher: 'MultiLingual',
    year: 2018,
    accessed: '2026-10-05',
  },
  {
    title: "Why are Japanese websites with lots of text and flashy colors so 'different'?",
    url: 'https://gigazine.net/gsc_news/en/20221129-peculiar-case-of-japanese-web-design/',
    publisher: 'GIGAZINE',
    year: 2022,
    accessed: '2026-10-05',
  },
];

export default sources;
```

Create `src/study/essays/scene-latam/en.md`:

```md
## The Escola Paulista

Escola Paulista names a São Paulo group led by João Batista Vilanova Artigas (1915–1985) and marked by an emphasis on building technique, exposed reinforced concrete and expressed structure [1][2]. Its emblematic work is Artigas's building for the Faculty of Architecture and Urbanism of the University of São Paulo, and that faculty's curriculum reform dates from 1962 [1]. The Enciclopédia Itaú Cultural counts Paulo Mendes da Rocha, Marcello Fragelli, Abrahão Sanovicz, João Walter Toscano, Pedro Paulo de Melo Saraiva and Ruy Ohtake, among others, in the group [1]. Lina Bo Bardi, the architect of the SESC Pompéia that one of the themes reads, is not on that list, although the Portuguese Wikipedia includes her among the main names [2].

## Concrete poetry

In 1952, Augusto de Campos, Haroldo de Campos and Décio Pignatari founded the magazine *Noigandres* [3], which named the group and launched concrete poetry in Brazil [3][4]. Augusto's colour poems, *Poetamenos*, from 1953, appeared in its second issue [3].

## Cybersyn

In Chile, between 1971 and 1973, Salvador Allende's government built a system to run the economy in near real time [5][6]. Stafford Beer was contacted in July 1971 and arrived in Chile on 4 November that year [5]. The system had four parts: a telex network, statistical software, an economic simulator and an operations room; by January 1973 there were working prototypes of all of them but the simulator [5]. The room was built by the state's Industrial Design Group, led by Gui Bonsiepe, a former member of the Ulm School of Design, and it showed Ulm traits; its screens and chairs were made of fibreglass [5], and it had seven swivel chairs with control buttons [6]. Allende visited it on 30 December 1972. After the coup of 11 September 1973, the military stopped the project, and the work was abandoned or destroyed [5].

## Chicha posters

In Lima, chicha posters announce chicha and cumbia concerts in curvy lettering and fluorescent colours, screen-printed and pasted on walls [7][8]. They arose in the 1980s, a time of terrorism, along avenues such as the Panamericana Norte and the Carretera Central, in fuchsia, yellow, green and orange, with a cheap, artisanal screen-printing process [8]. Fortunato Urcuhuaranga, from Huancayo, was one of the precursors; in the 1980s only about five families made these posters [8]. His son Elliot Túpac designed his first posters at 12 and took the style to murals and brand work [7], though he did not invent the genre [8].

## What the themes take

SESC Pompéia reads Lina Bo Bardi's cultural centre in São Paulo: the concrete of its towers and its irregular openings, framed in red.
```

Create `src/study/essays/scene-latam/es.md`:

```md
## La Escuela Paulista

Se llama Escuela Paulista a un grupo de São Paulo encabezado por João Batista Vilanova Artigas (1915–1985) y marcado por el énfasis en la técnica constructiva, el hormigón armado a la vista y la estructura expresada [1][2]. Su obra emblemática es el edificio de Artigas para la Facultad de Arquitectura y Urbanismo de la Universidad de São Paulo, y la reforma de los estudios de esa facultad data de 1962 [1]. La Enciclopedia Itaú Cultural cuenta en el grupo a Paulo Mendes da Rocha, Marcello Fragelli, Abrahão Sanovicz, João Walter Toscano, Pedro Paulo de Melo Saraiva y Ruy Ohtake, entre otros [1]. Lina Bo Bardi, autora del SESC Pompéia que lee uno de los temas, no figura en esa lista, aunque la Wikipedia en portugués la incluye entre los nombres principales [2].

## La poesía concreta

En 1952, Augusto de Campos, Haroldo de Campos y Décio Pignatari fundaron la revista *Noigandres* [3], que dio nombre al grupo y lanzó la poesía concreta en Brasil [3][4]. Los poemas en color de Augusto, *Poetamenos*, de 1953, salieron en el segundo número [3].

## Cybersyn

En Chile, entre 1971 y 1973, el gobierno de Salvador Allende montó un sistema para gestionar la economía casi en tiempo real [5][6]. Stafford Beer fue contactado en julio de 1971 y llegó a Chile el 4 de noviembre de ese año [5]. El sistema tenía cuatro partes: una red de télex, programas estadísticos, un simulador económico y una sala de operaciones; en enero de 1973 había prototipos en funcionamiento de todas salvo el simulador [5]. La sala la construyó el Grupo de Diseño Industrial del Estado, dirigido por Gui Bonsiepe, antiguo miembro de la Escuela de Ulm, y tenía rasgos de Ulm; las pantallas y las sillas eran de fibra de vidrio [5], y había siete sillones giratorios con botones de control [6]. Allende la visitó el 30 de diciembre de 1972. Tras el golpe del 11 de septiembre de 1973, los militares detuvieron el proyecto, y el trabajo quedó abandonado o destruido [5].

## Los carteles chicha

En Lima, los carteles chicha anuncian conciertos de chicha y de cumbia con letras curvas en colores fluorescentes, impresos en serigrafía y pegados en los muros [7][8]. Surgieron en los años ochenta, en tiempos de terrorismo, en avenidas como la Panamericana Norte y la Carretera Central, con fucsia, amarillo, verde y naranja y una serigrafía artesanal y barata [8]. Fortunato Urcuhuaranga, de Huancayo, fue uno de los precursores; en los ochenta solo unas cinco familias hacían estos carteles [8]. Su hijo Elliot Túpac diseñó sus primeros carteles a los 12 años y llevó el estilo a murales y a trabajos para marcas [7], aunque no inventó el género [8].

## Lo que toman los temas

SESC Pompéia lee el centro cultural de Lina Bo Bardi en São Paulo: el hormigón de sus torres y sus huecos irregulares, enmarcados en rojo.
```

Create `src/study/essays/scene-latam/sources.ts`:

```ts
import type { Source } from '../../types';

const sources: readonly Source[] = [
  {
    title: 'Escola Paulista',
    url: 'https://enciclopedia.itaucultural.org.br/termos/80205-escola-paulista',
    publisher: 'Enciclopédia Itaú Cultural',
    year: 2025,
    accessed: '2026-10-05',
  },
  { title: 'Escola Paulista', url: 'https://pt.wikipedia.org/wiki/Escola_Paulista', publisher: 'Wikipedia', accessed: '2026-10-05' },
  {
    title: 'Augusto de Campos',
    url: 'https://site.videobrasil.org.br/acervo/artistas/artista/37699',
    publisher: 'Associação Cultural Videobrasil',
    accessed: '2026-10-05',
  },
  { title: 'Haroldo de Campos', url: 'https://en.wikipedia.org/wiki/Haroldo_de_Campos', publisher: 'Wikipedia', accessed: '2026-10-05' },
  {
    title: 'Cybernetic Revolutionaries',
    url: 'https://www.cabinetmagazine.org/issues/46/medina.php',
    publisher: 'Cabinet',
    year: 2012,
    accessed: '2026-10-05',
  },
  { title: 'Project Cybersyn', url: 'https://en.wikipedia.org/wiki/Project_Cybersyn', publisher: 'Wikipedia', accessed: '2026-10-05' },
  {
    title: 'Elliot Tupac, el peruano que llevó la estética "chicha" a las murallas',
    url: 'https://www.latercera.com/noticia/elliot-tupac-el-peruano-que-llevo-la-estetica-chicha-a-las-murallas/',
    publisher: 'La Tercera',
    year: 2012,
    accessed: '2026-10-05',
  },
  {
    title: "'Afiches chicha': La historia detrás de los colores fosforescentes que iluminaron al Perú en tiempos de crisis",
    url: 'https://www.infobae.com/peru/2023/10/15/afiches-chicha-la-historia-detras-de-los-colores-fosforescentes-que-iluminaron-al-peru-en-tiempos-de-crisis/',
    publisher: 'Infobae',
    year: 2023,
    accessed: '2026-10-05',
  },
];

export default sources;
```

Create `src/study/essays/scene-usa/en.md`:

```md
## Vernacular brutalism

The journal *Dialectic* counts Bloomberg Businessweek features, the Drudge Report and, as the best-known example, Craigslist among brutalist websites [1]. In 2016, The Washington Post opened its piece on the trend for sites that look bad on purpose with Hacker News, Pinboard, the Drudge Report, Adult Swim and Bloomberg Businessweek features: hand-coded HTML with graphic nods to the 1990s [2]. Nielsen Norman Group calls the Drudge Report's stripped-down, pre-CSS look brutalist [3].

## Type let loose

*Emigre* was founded in 1984 by Rudy VanderLans and Zuzana Licko, in step with the arrival of the Macintosh; Emigre Inc. carries on as a digital type foundry in Berkeley [4][5]. The magazine ran from 1984 to 2005, edited by VanderLans from Berkeley and Sacramento, and each issue showed new typefaces, many of them by Licko; SFMOMA counts the pair among the first to exploit the freedom the Macintosh gave to layout and type [6]. The final issue, number 69, came out in November 2005 [4][5].

*Ray Gun*, an alternative-rock magazine, first appeared in 1992 in Santa Monica, California, with Marvin Scott Jarrett as publisher and David Carson as art director, and closed in 2000 [7]. Its grunge typography was often barely readable: an interview with Bryan Ferry was set entirely in Zapf Dingbats, a symbol font [7].

## Product neobrutalism

Nielsen Norman Group gives Figma's brand refresh and Gumroad as examples of neobrutalism [3]. Sahil Lavingia, Gumroad's founder, introduced the new brand on 26 November 2021 [8].

## What the themes take

Classifieds reads Craigslist: text, links and little else. Tech reads Digital Equipment Corporation's VT100 video terminal: monospaced type on a dark ground.
```

Create `src/study/essays/scene-usa/es.md`:

```md
## Brutalismo vernáculo

La revista *Dialectic* cuenta entre los sitios brutalistas los reportajes de Bloomberg Businessweek, el Drudge Report y, como ejemplo más conocido, Craigslist [1]. En 2016, The Washington Post abría su artículo sobre la moda de los sitios feos a propósito con Hacker News, Pinboard, el Drudge Report, Adult Swim y los reportajes de Bloomberg Businessweek: HTML escrito a mano con guiños gráficos a los noventa [2]. Nielsen Norman Group llama brutalista al aspecto desnudo del Drudge Report, anterior al CSS [3].

## La letra suelta

*Emigre* nació en 1984, de la mano de Rudy VanderLans y Zuzana Licko, a la par que llegaba el Macintosh; Emigre Inc. sigue hoy como fundición tipográfica digital en Berkeley [4][5]. La revista se publicó de 1984 a 2005, editada por VanderLans desde Berkeley y Sacramento, y cada número mostraba tipos nuevos, muchos de Licko; el SFMOMA los cuenta entre los primeros en aprovechar la libertad que daba el Macintosh para maquetar y para dibujar letra [6]. El último número, el 69, salió en noviembre de 2005 [4][5].

*Ray Gun*, revista de rock alternativo, apareció en 1992 en Santa Mónica, California, con Marvin Scott Jarrett como editor y David Carson como director de arte, y cerró en 2000 [7]. Su tipografía grunge era a menudo casi ilegible: una entrevista con Bryan Ferry se compuso entera en Zapf Dingbats, una fuente de símbolos [7].

## El neobrutalismo de producto

Nielsen Norman Group pone como ejemplos de neobrutalismo la renovación de marca de Figma y Gumroad [3]. Sahil Lavingia, fundador de Gumroad, presentó la nueva marca el 26 de noviembre de 2021 [8].

## Lo que toman los temas

Classifieds lee Craigslist: texto, enlaces y casi nada más. Tech lee el terminal de vídeo VT100 de Digital Equipment Corporation: letra monoespaciada sobre fondo oscuro.
```

Create `src/study/essays/scene-usa/sources.ts`:

```ts
import type { Source } from '../../types';

const sources: readonly Source[] = [
  {
    title: 'On Web Brutalism and Contemporary Web Design',
    url: 'https://quod.lib.umich.edu/d/dialectic/14932326.0001.107/--on-web-brutalism-and-contemporary-web-design?rgn=main&view=fulltext',
    publisher: 'Dialectic',
    year: 2017,
    accessed: '2026-10-05',
  },
  {
    title: 'The hottest trend in Web design is making intentionally ugly, difficult sites',
    url: 'https://www.washingtonpost.com/news/the-intersect/wp/2016/05/09/the-hottest-trend-in-web-design-is-intentionally-ugly-unusable-sites/',
    publisher: 'The Washington Post',
    year: 2016,
    accessed: '2026-10-05',
  },
  {
    title: 'Neobrutalism: Definition and Best Practices',
    url: 'https://www.nngroup.com/articles/neobrutalism/',
    publisher: 'Nielsen Norman Group',
    year: 2025,
    accessed: '2026-10-05',
  },
  { title: 'An Ending', url: 'https://www.emigre.com/Essays/Emigre/AnEnding', publisher: 'Emigre', accessed: '2026-10-05' },
  { title: 'Rudy VanderLans', url: 'https://www.sfmoma.org/artist/Rudy_VanderLans/', publisher: 'SFMOMA', accessed: '2026-10-05' },
  {
    title: 'Emigre magazine, no. 18 (Type-Site), 1991',
    url: 'https://www.sfmoma.org/artwork/92.22/',
    publisher: 'SFMOMA',
    accessed: '2026-10-05',
  },
  { title: 'Ray Gun (magazine)', url: 'https://en.wikipedia.org/wiki/Ray_Gun_(magazine)', publisher: 'Wikipedia', accessed: '2026-10-05' },
  {
    title: 'Introducing the new Gumroad',
    url: 'https://sahil.gumroad.com/p/introducing-the-new-gumroad',
    publisher: 'Gumroad',
    year: 2021,
    accessed: '2026-10-05',
  },
];

export default sources;
```

- [ ] **Step 4: Run the tests and the gates**

Run: `npx vitest run src/study/essays.content.test.ts`

Expected: PASS

```text
Test Files  1 passed (1)
Tests  8 passed (8)
```

Run: `npx vitest run`

Expected: PASS

```text
Test Files  46 passed (46)
Tests  880 passed | 4 skipped (884)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add src/study/essays.content.test.ts src/study/essays/home/en.md src/study/essays/home/es.md src/study/essays/home/sources.ts src/study/essays/method/en.md src/study/essays/method/es.md src/study/essays/method/sources.ts src/study/essays/origins/en.md src/study/essays/origins/es.md src/study/essays/origins/sources.ts src/study/essays/scene-germany/en.md src/study/essays/scene-germany/es.md src/study/essays/scene-germany/sources.ts src/study/essays/scene-japan/en.md src/study/essays/scene-japan/es.md src/study/essays/scene-japan/sources.ts src/study/essays/scene-latam/en.md src/study/essays/scene-latam/es.md src/study/essays/scene-latam/sources.ts src/study/essays/scene-usa/en.md src/study/essays/scene-usa/es.md src/study/essays/scene-usa/sources.ts
git commit -F - <<'EOF'
docs(study): seven essays in Spanish and English, with sources

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

### Task 7: Study home, scenes and origins

The study's own pages (D10). The home shows the thesis, a mosaic of the themes painted in their own tokens, the home essay, the scenes and a "use these themes in your app" block. A Scenes index lists the four scenes and Origins; each scene page — Origins included — has its essay, its references in date order, each with its theme card, and the other scenes. Essays load as lazy chunks of pre-rendered HTML with their sources, through `useLazy`.

**Files:**
- Test: `e2e/site.spec.ts`
- Modify: `src/site/App.tsx`
- Create: `src/site/pages/ScenePage.tsx`
- Create: `src/site/pages/Scenes.tsx`
- Create: `src/site/pages/StudyHome.tsx`
- Modify: `src/site/site.css`
- Create: `src/site/study/Essay.tsx`
- Create: `src/site/study/SceneCards.tsx`
- Modify: `src/site/study/ThemeCard.tsx`
- Test (new): `src/site/study/essays.test.ts`
- Create: `src/site/study/essays.ts`

**Interfaces:**
- Consumes: `useLazy`, `SourceList` (Task 5); `ThemeCard` (Task 4); `CATALOG`, `STUDY_ENTRIES` (Task 3); `startYear`, `sceneHref` (Task 4); the essays (Task 6), through the plugin (Task 1); `CodeBlock` (existing).
- Produces: `src/site/study/essays.ts`: `interface Essay { html: string; sources: readonly Source[] }`, `loadEssay(slug, lang)`, `useEssay(slug, lang): Lazy<Essay>`. `Essay({ slug })`, `SceneCards({ scenes?, heading? })`, `ThemeTile({ entry })`; `ThemeCard` gains `as?: 'li' | 'div'`. Pages `StudyHome()`, `Scenes()`, `ScenePage({ scene })`.

- [ ] **Step 1: Write the failing tests**

Append to the end of `e2e/site.spec.ts`:

```ts

test('study home: the thesis, a tile per theme, the essay with its sources and the scenes', async ({ page }) => {
  await page.goto('#/es/');
  await expect(page.locator('main h1')).toHaveText('El neobrutalismo en las interfaces');
  await expect(page).toHaveTitle('El estudio — neobrutalistcomponents');
  await expect(page.locator('.study-tile')).toHaveCount(9);
  await expect(page.locator('.study-essay__text h2').first()).toHaveText('De dónde viene el nombre');
  await expect(page.locator('.study-sources li')).toHaveCount(5);
  await expect(page.locator('.study-scenes__card')).toHaveCount(5);
  await page.locator('.study-scenes').getByRole('link', { name: 'Japón' }).click();
  await expect(page).toHaveURL(/#\/es\/scene\/japan$/);
});

test('scenes: an index, then each scene lists its references in date order with their themes', async ({ page }) => {
  await page.goto('#/en/scenes');
  await expect(page.locator('main h1')).toHaveText('Scenes');
  await expect(page.locator('.study-scenes__card')).toHaveCount(5);
  await page.goto('#/en/scene/japan');
  await expect(page).toHaveTitle('Japan — neobrutalistcomponents');
  await expect(page.locator('.study-timeline__year')).toHaveText(['1970', '1980', '1996']);
  await expect(page.locator('.study-timeline .site-card h3')).toHaveText(['Nakagin', 'Riso', 'Y2K']);
  await expect(page.locator('nav .study-scenes__card')).toHaveCount(4);
  await page.goto('#/en/origins');
  await expect(page.locator('.study-essay__text h2').first()).toHaveText('Béton brut');
  await expect(page.locator('.study-timeline .site-card h3')).toHaveText(['Classic', 'Swiss']);
});

test('a study page whose essay cannot load says so instead of staying blank', async ({ page }) => {
  await page.route(/\/assets\/en-[\w-]+\.js$/, (route) => route.abort());
  await page.goto('#/en/');
  await expect(page.getByText('This content could not load.', { exact: false })).toBeVisible();
  await expect(page.locator('.study-scenes__card')).toHaveCount(5);
});
```

Create `src/site/study/essays.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { ESSAY_SLUGS } from '../../study/essays';
import { loadEssay } from './essays';

describe('loadEssay', () => {
  it('loads every essay as rendered HTML with its sources, in both languages', async () => {
    for (const slug of ESSAY_SLUGS) {
      for (const lang of ['es', 'en'] as const) {
        const { html, sources } = await loadEssay(slug, lang);
        expect(html, `${slug}.${lang}`).toMatch(/^<(h2|p)>/);
        expect(html, `${slug}.${lang}`).not.toMatch(/<h1|\n# /);
        expect(Array.isArray(sources)).toBe(true);
      }
    }
  });

  it('marks citations', async () => {
    const { html } = await loadEssay('origins', 'en');
    expect(html).toContain('<span class="study-cite">[13]</span>');
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/site/study/essays.test.ts`

Expected: FAIL

```text
Test Files  1 failed (1)
Tests  no tests
FAIL  src/site/study/essays.test.ts [ src/site/study/essays.test.ts ]
Error: Failed to resolve import "./essays" from "src/site/study/essays.test.ts". Does the file exist?
```

Run: `npx playwright test -g "study home: the thesis|scenes: an index|essay cannot load" --reporter=line`

Expected: FAIL

```text
Error: expect(locator).toHaveText(expected) failed
Error: expect(locator).toBeVisible() failed
Error: element(s) not found
3 failed
```

(Playwright builds the site and serves it with `vite preview` on port 4173 first.)

- [ ] **Step 3: Implement**

In `src/site/App.tsx`:

1. Replace

```tsx
import { parseHash, replaceHash, useHash } from './router';
import type { Location, Route } from './router';
import { detectLang, rememberLang } from './lang';
import { LangContext, UI } from './i18n';
import type { UIKey } from './i18n';
import { SitePrefsContext } from './prefsContext';
import { useThemeStylesheet } from './study/loader';
```

with

```tsx
import { parseHash, replaceHash, useHash } from './router';
import type { Location, Route } from './router';
import { detectLang, rememberLang } from './lang';
import { LangContext, SCENE_TEXT, UI } from './i18n';
import type { UIKey } from './i18n';
import { SitePrefsContext } from './prefsContext';
import { useThemeStylesheet } from './study/loader';
```

2. Replace

```tsx
import { ComponentPage } from './pages/ComponentPage';
import { Atlas } from './pages/Atlas';
import { ThemePage } from './pages/ThemePage';
import { ENTRIES } from './study/data';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
```

with

```tsx
import { ComponentPage } from './pages/ComponentPage';
import { Atlas } from './pages/Atlas';
import { ThemePage } from './pages/ThemePage';
import { StudyHome } from './pages/StudyHome';
import { Scenes } from './pages/Scenes';
import { ScenePage } from './pages/ScenePage';
import { ENTRIES } from './study/data';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
```

3. Replace

```tsx
function Page({ location }: { location: PageLocation }) {
  const { route } = location;
  switch (route.name) {
    // Until the study home exists (study plan 2, Task 8) the study route shows the library page.
    case 'study':
    case 'library':
      return <Library />;
    case 'atlas':
```

with

```tsx
function Page({ location }: { location: PageLocation }) {
  const { route } = location;
  switch (route.name) {
    case 'study':
      return <StudyHome />;
    case 'scenes':
      return <Scenes />;
    case 'scene':
      return <ScenePage scene={route.scene} />;
    case 'origins':
      return <ScenePage scene="origins" />;
    case 'library':
      return <Library />;
    case 'atlas':
```

4. Replace

```tsx

  useEffect(() => {
    const key = TITLES[route.name];
    const title = route.name === 'component' ? route.slug : route.name === 'theme' ? (ENTRIES.get(route.id)?.name[lang] ?? route.id) : key ? UI[key][lang] : undefined;
    document.title = title ? `${title} — neobrutalistcomponents` : 'neobrutalistcomponents';
    window.scrollTo({ top: 0 });
  }, [routeKey, route, lang]);
```

with

```tsx

  useEffect(() => {
    const key = TITLES[route.name];
    const title = route.name === 'component' ? route.slug : route.name === 'theme' ? (ENTRIES.get(route.id)?.name[lang] ?? route.id) : route.name === 'scene' ? SCENE_TEXT[route.scene].name[lang] : key ? UI[key][lang] : undefined;
    document.title = title ? `${title} — neobrutalistcomponents` : 'neobrutalistcomponents';
    window.scrollTo({ top: 0 });
  }, [routeKey, route, lang]);
```

Create `src/site/pages/ScenePage.tsx`:

```tsx
import { SCENES } from '../../study/types';
import type { Scene } from '../../study/types';
import type { EssaySlug } from '../../study/essays';
import { SCENE_TEXT, useLang, useT } from '../i18n';
import { toHash } from '../router';
import { CATALOG } from '../study/data';
import { Essay } from '../study/Essay';
import { startYear } from '../study/format';
import { SceneCards } from '../study/SceneCards';
import { ThemeCard } from '../study/ThemeCard';

const ESSAYS: Record<Scene, EssaySlug> = {
  japan: 'scene-japan',
  germany: 'scene-germany',
  usa: 'scene-usa',
  latam: 'scene-latam',
  origins: 'origins',
};

/** A scene (or Origins): its essay, its references in date order with their themes, and the other scenes. */
export function ScenePage({ scene }: { scene: Scene }) {
  const lang = useLang();
  const t = useT();
  const themes = CATALOG.filter((entry) => entry.scene === scene).sort(
    (a, b) => startYear(a.reference.date) - startYear(b.reference.date) || (a.id < b.id ? -1 : 1),
  );
  return (
    <div className="site-page study-scene">
      <p className="site-doc__crumbs">
        <a href={toHash(lang, '/scenes')}>{t('titleScenes')}</a>
      </p>
      <header className="site-page__head">
        <h1 className="site-h1">{SCENE_TEXT[scene].name[lang]}</h1>
        <p className="site-lead">{SCENE_TEXT[scene].summary[lang]}</p>
      </header>

      <Essay slug={ESSAYS[scene]} />

      <section className="study-section" aria-labelledby="scene-themes">
        <h2 className="site-h2" id="scene-themes">
          {t(scene === 'origins' ? 'originsThemes' : 'timelineHeading')}
        </h2>
        <ol className="study-timeline">
          {themes.map((entry) => (
            <li key={entry.id} className="study-timeline__item">
              <p className="study-timeline__year">{startYear(entry.reference.date)}</p>
              <ThemeCard entry={entry} as="div" />
            </li>
          ))}
        </ol>
      </section>

      <nav className="study-section" aria-labelledby="scene-others">
        <h2 className="site-h2" id="scene-others">
          {t('otherScenes')}
        </h2>
        <SceneCards scenes={SCENES.filter((other) => other !== scene)} />
      </nav>
    </div>
  );
}
```

Create `src/site/pages/Scenes.tsx`:

```tsx
import { useT } from '../i18n';
import { SceneCards } from '../study/SceneCards';

/** Every scene of the study, and Origins. */
export function Scenes() {
  const t = useT();
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleScenes')}</h1>
        <p className="site-lead">{t('scenesLead')}</p>
      </header>
      <SceneCards heading="h2" />
    </div>
  );
}
```

Create `src/site/pages/StudyHome.tsx`:

```tsx
import { Button } from 'neobrutalistcomponents';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';
import { CodeBlock } from '../docs/CodeBlock';
import { CATALOG, STUDY_ENTRIES } from '../study/data';
import { Essay } from '../study/Essay';
import { SceneCards } from '../study/SceneCards';
import { ThemeTile } from '../study/ThemeCard';

/** The study's own themes first, then the library's; at most twelve tiles however large the catalog grows. */
const MOSAIC = [...STUDY_ENTRIES, ...CATALOG.filter((entry) => entry.predatesStudy)].slice(0, 12);

const USE_CODE = `import { NeoProvider } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/nakagin.css';

export function App() {
  return <NeoProvider theme="nakagin">{/* your app */}</NeoProvider>;
}`;

/** The study's home: the thesis, its scenes, a way into the atlas and how to use the themes. */
export function StudyHome() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="site-page study-home">
      <section className="study-hero" aria-labelledby="study-title">
        <div className="study-hero__copy">
          <h1 className="site-h1 study-hero__title" id="study-title">
            {t('studyTitle')}
          </h1>
          <p className="site-lead">{t('studyLead')}</p>
          <div className="study-hero__actions">
            <Button asChild size="lg">
              <a href={toHash(lang, '/atlas')}>{t('openAtlas')}</a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href={toHash(lang, '/method')}>{t('readMethod')}</a>
            </Button>
          </div>
        </div>
        <ul className="study-mosaic" aria-label={t('mosaicLabel')}>
          {MOSAIC.map((entry) => (
            <ThemeTile key={entry.id} entry={entry} />
          ))}
        </ul>
      </section>

      <div className="study-section">
        <Essay slug="home" />
      </div>

      <section className="study-section" aria-labelledby="study-scenes">
        <h2 className="site-h2" id="study-scenes">
          {t('scenesHeading')}
        </h2>
        <SceneCards />
      </section>

      <section className="study-section study-use" aria-labelledby="study-use">
        <div>
          <h2 className="site-h2" id="study-use">
            {t('useHeading')}
          </h2>
          <p className="site-p">{t('useBody')}</p>
        </div>
        <CodeBlock code={USE_CODE} label="TSX" />
      </section>
    </div>
  );
}
```

In `src/site/site.css`:

Replace

```css
  }
}

.site-notfound {
  display: grid;
  justify-items: start;
```

with

```css
  }
}

/* ============================================================
   Study pages
   ============================================================ */
.study-section {
  margin-block-start: clamp(56px, 8vw, 104px);
}

.study-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: clamp(32px, 6vw, 72px);
  align-items: center;
}
.study-hero__title {
  font-size: clamp(44px, 7vw, 96px);
  text-wrap: balance;
}
.study-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--nbc-space-md);
  margin-block-start: var(--nbc-space-2xl);
}
.study-mosaic {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--nbc-space-md);
  margin: 0;
  padding: 0;
  list-style: none;
}
.study-mosaic__item {
  display: flex;
}
.study-tile {
  flex: 1;
  display: flex;
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
  border-radius: var(--nbc-radius);
  box-shadow: var(--nbc-shadow);
}
.study-tile__link {
  flex: 1;
  display: grid;
  align-content: space-between;
  gap: var(--nbc-space-md);
  min-block-size: 112px;
  padding: var(--nbc-space-md);
  color: inherit;
  text-decoration: none;
  border-radius: inherit;
}
.study-tile__name {
  font-family: var(--nbc-font-display);
  font-weight: var(--nbc-weight-display);
  letter-spacing: var(--nbc-display-spacing);
  text-transform: var(--nbc-display-transform);
  font-size: clamp(17px, 1.6vw, 22px);
  line-height: 1.05;
  overflow-wrap: anywhere;
}
@media (hover: hover) {
  .study-tile__link:hover .study-tile__name {
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }
}
.study-tile__swatches {
  display: flex;
  gap: 4px;
}
.study-tile__swatches > span {
  inline-size: 14px;
  block-size: 14px;
  border: 1px solid var(--nbc-border-color);
}

.study-essay {
  max-inline-size: 70ch;
}
.study-essay--loading {
  min-block-size: 40vh;
}
.study-essay__text h2,
.study-essay__sources {
  margin: var(--nbc-space-3xl) 0 var(--nbc-space-md);
  font-family: var(--nbc-font-display);
  font-weight: var(--nbc-weight-display);
  font-stretch: var(--nbc-display-stretch);
  letter-spacing: var(--nbc-display-spacing);
  text-transform: var(--nbc-display-transform);
  font-size: clamp(24px, 2.6vw, 30px);
  line-height: 1.1;
}
.study-essay__text h3 {
  margin: var(--nbc-space-2xl) 0 var(--nbc-space-sm);
  font-size: var(--nbc-fs-lg);
  font-weight: var(--nbc-weight-label);
}
.study-essay__text > :first-child {
  margin-block-start: 0;
}
.study-essay__text p {
  margin: 0 0 var(--nbc-space-lg);
}
.study-essay__text p,
.study-essay__text li {
  line-height: 1.7;
  text-wrap: pretty;
}
.study-essay__text blockquote {
  margin: var(--nbc-space-lg) 0;
  padding-inline-start: var(--nbc-space-lg);
  border-inline-start: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
}
.study-cite {
  font-size: 0.78em;
  font-variant-numeric: tabular-nums;
  color: var(--nbc-fg-muted);
  white-space: nowrap;
}

.study-scenes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: var(--nbc-space-xl);
  margin: 0;
  padding: 0;
  list-style: none;
}
/* Cards in a row stretch to the tallest: the header takes the slack, so the footer stays at the bottom. */
.study-scenes__card > .nbc-card__header {
  flex: 1;
}
.study-scenes__foot {
  justify-content: space-between;
  font-size: var(--nbc-fs-sm);
}
.study-scenes__dots {
  display: flex;
  gap: 4px;
}
.study-scenes__dots > span {
  inline-size: 14px;
  block-size: 14px;
  border: 1px solid var(--nbc-border-color);
  border-radius: 50%;
}

/* The years share one column (subgrid), as wide as the widest year in the theme's display type. */
.study-timeline {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: var(--nbc-space-xl) var(--nbc-space-lg);
  margin: 0;
  padding: 0;
  list-style: none;
}
.study-timeline__item {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: start;
}
.study-timeline__year {
  margin: 0;
  padding-block-start: var(--nbc-space-lg);
  font-family: var(--nbc-font-display);
  font-weight: var(--nbc-weight-display);
  font-size: clamp(22px, 2.4vw, 30px);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.study-timeline .site-cards__item {
  max-inline-size: 520px;
}

.study-use {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: clamp(24px, 5vw, 56px);
  align-items: start;
}
.study-use .site-h2 {
  margin-block-start: 0;
}
.study-use .site-code {
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
  border-radius: var(--nbc-radius);
  box-shadow: var(--nbc-shadow);
}

@media (max-width: 900px) {
  .study-hero,
  .study-use {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 480px) {
  .study-mosaic {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .study-tile__link {
    min-block-size: 84px;
  }
  .study-timeline {
    grid-template-columns: minmax(0, 1fr);
  }
  .study-timeline__item {
    gap: var(--nbc-space-sm);
  }
  .study-timeline__year {
    padding-block-start: 0;
  }
}

.site-notfound {
  display: grid;
  justify-items: start;
```

Create `src/site/study/Essay.tsx`:

```tsx
import type { EssaySlug } from '../../study/essays';
import { useLang, useT } from '../i18n';
import { useEssay } from './essays';
import { SourceList } from './SourceList';

/** A study essay and its numbered sources. The HTML was rendered at build time from the repo's own Markdown. */
export function Essay({ slug }: { slug: EssaySlug }) {
  const lang = useLang();
  const t = useT();
  const essay = useEssay(slug, lang);
  if (essay.status === 'error') return <p className="site-p">{t('loadError')}</p>;
  if (essay.status === 'loading') return <div className="study-essay study-essay--loading" aria-busy="true" />;
  const { html, sources } = essay.value;
  return (
    <div className="study-essay">
      <div className="study-essay__text" dangerouslySetInnerHTML={{ __html: html }} />
      {sources.length ? (
        <section aria-labelledby={`${slug}-sources`}>
          <h2 className="study-essay__sources" id={`${slug}-sources`}>
            {t('sources')}
          </h2>
          <SourceList sources={sources} />
        </section>
      ) : null}
    </div>
  );
}
```

Create `src/site/study/SceneCards.tsx`:

```tsx
import { Card } from 'neobrutalistcomponents';
import { SCENES } from '../../study/types';
import type { Scene } from '../../study/types';
import { SCENE_TEXT, themeCount, useLang } from '../i18n';
import { CATALOG } from './data';
import { sceneHref } from './format';

/** The four scenes and Origins as cards, each with a dot per theme (its primary colour). */
export function SceneCards({ scenes = SCENES, heading = 'h3' }: { scenes?: readonly Scene[]; heading?: 'h2' | 'h3' }) {
  const lang = useLang();
  return (
    <ul className="study-scenes">
      {scenes.map((scene) => {
        const themes = CATALOG.filter((entry) => entry.scene === scene);
        return (
          <Card key={scene} as="li" variant="interactive" className="study-scenes__card">
            <Card.Header>
              <Card.Title as={heading}>
                <a href={sceneHref(lang, scene)}>{SCENE_TEXT[scene].name[lang]}</a>
              </Card.Title>
              <Card.Description>{SCENE_TEXT[scene].summary[lang]}</Card.Description>
            </Card.Header>
            <Card.Footer className="study-scenes__foot">
              <span className="study-scenes__dots" aria-hidden="true">
                {themes.map((entry) => (
                  <span key={entry.id} style={{ background: entry.swatch[0] }} />
                ))}
              </span>
              <span>{themeCount(lang, themes.length)}</span>
            </Card.Footer>
          </Card>
        );
      })}
    </ul>
  );
}
```

In `src/site/study/ThemeCard.tsx`:

1. Replace

```tsx
  );
}

/** One theme as an atlas card. */
export function ThemeCard({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  return (
    <li className="site-cards__item">
      <Island entry={entry} className="site-card-island">
        <Card variant="interactive" as="article" className="site-card">
          <Card.Header>
```

with

```tsx
  );
}

/** One theme as an atlas card; `as="div"` where the card is not a list item. */
export function ThemeCard({ entry, as: Wrapper = 'li' }: { entry: CatalogEntry; as?: 'li' | 'div' }) {
  const lang = useLang();
  const t = useT();
  return (
    <Wrapper className="site-cards__item">
      <Island entry={entry} className="site-card-island">
        <Card variant="interactive" as="article" className="site-card">
          <Card.Header>
```

2. Replace

```tsx
          </Card.Footer>
        </Card>
      </Island>
    </li>
  );
}
```

with

```tsx
          </Card.Footer>
        </Card>
      </Island>
    </Wrapper>
  );
}

/** One theme as a small tile: its name in its own display type, on its own ground. */
export function ThemeTile({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  return (
    <li className="study-mosaic__item">
      <Island entry={entry} className="study-tile">
        <a className="study-tile__link" href={toHash(lang, `/theme/${entry.id}`)}>
          <span className="study-tile__name">{entry.name[lang]}</span>
          <span className="study-tile__swatches" aria-hidden="true">
            {entry.swatch.slice(0, 3).map((color) => (
              <span key={color} style={{ background: color }} />
            ))}
          </span>
        </a>
      </Island>
    </li>
  );
}
```

Create `src/site/study/essays.ts`:

```ts
/**
 * Essays load on demand: each language is its own chunk of HTML rendered at
 * build time (vite-plugin-essays.ts), with a small sources module beside it.
 */
import type { EssaySlug } from '../../study/essays';
import type { Lang, Source } from '../../study/types';
import { useLazy } from './lazy';
import type { Lazy } from './lazy';

const texts = import.meta.glob<string>('../../study/essays/*/*.md', { import: 'default' });
const sourceModules = import.meta.glob<readonly Source[]>('../../study/essays/*/sources.ts', { import: 'default' });

export interface Essay {
  readonly html: string;
  readonly sources: readonly Source[];
}

export async function loadEssay(slug: EssaySlug, lang: Lang): Promise<Essay> {
  const [html, sources] = await Promise.all([
    texts[`../../study/essays/${slug}/${lang}.md`](),
    sourceModules[`../../study/essays/${slug}/sources.ts`](),
  ]);
  return { html, sources };
}

export const useEssay = (slug: EssaySlug, lang: Lang): Lazy<Essay> => useLazy(`${slug}:${lang}`, () => loadEssay(slug, lang));
```

- [ ] **Step 4: Run the tests and the gates**

Run: `npx vitest run src/site/study/essays.test.ts`

Expected: PASS

```text
Test Files  1 passed (1)
Tests  2 passed (2)
```

Run: `npx vitest run`

Expected: PASS

```text
Test Files  47 passed (47)
Tests  882 passed | 4 skipped (886)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

Run: `npx playwright test -g "study home: the thesis|scenes: an index|essay cannot load" --reporter=line`

Expected: PASS

```text
3 passed
```

- [ ] **Step 5: Commit**

```bash
git add e2e/site.spec.ts src/site/App.tsx src/site/pages/ScenePage.tsx src/site/pages/Scenes.tsx src/site/pages/StudyHome.tsx src/site/site.css src/site/study/Essay.tsx src/site/study/SceneCards.tsx src/site/study/ThemeCard.tsx src/site/study/essays.test.ts src/site/study/essays.ts
git commit -F - <<'EOF'
feat(site): study home, scenes and origins

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

### Task 8: Method and credits, generated from data

The Method page (D10) shows the essay, then each detail family from its own metadata — name, description, the component roots it touches, and every parameter with its default, range and meaning — and the contrast contract from `CONTRAST_PAIRS`. The Credits page lists every photograph with its author, licence and Commons file, and every typeface with its licence and the themes that use it. The core themes' ten font families get their licences in `CORE_FONT_LICENSES`; all eighteen families are OFL-1.1, checked against the google/fonts repository, which files each family under `ofl/`. `fontCredits` refuses a family whose licence is not recorded.

**Files:**
- Test: `e2e/site.spec.ts`
- Modify: `src/site/App.tsx`
- Create: `src/site/pages/Credits.tsx`
- Create: `src/site/pages/Method.tsx`
- Modify: `src/site/site.css`
- Test (new): `src/site/study/credits.test.ts`
- Create: `src/site/study/credits.ts`
- Test: `src/site/study/format.test.ts`
- Modify: `src/site/study/format.ts`
- Test: `src/study/fonts.test.ts`
- Modify: `src/study/fonts.ts`

**Interfaces:**
- Consumes: `FAMILIES` and `ParamSpec` (Plan 1); `CONTRAST_PAIRS`; `PAIR_TEXT`, `useLang`, `useT` (Task 2); `Essay` (Task 7); `loadThemeData`, `useLazy` (Task 5); `LICENSE_URLS`, `licenseName` (Task 4); `FONTS` (Plan 1); `THEME_INFO`, `NEO_THEMES` (library).
- Produces: `src/study/fonts.ts`: `CORE_FONT_LICENSES`, `fontLicense(family): 'OFL-1.1' | 'Apache-2.0' | undefined`. `src/site/study/credits.ts`: `interface FontCredit { family; license; usedBy }`, `FONT_LICENSE_URLS`, `specimenUrl(family)`, `fontCredits(entries)`. `commonsTitle(sourceUrl)` in `src/site/study/format.ts`. Pages `Method()`, `Credits()`.

- [ ] **Step 1: Write the failing tests**

In `e2e/site.spec.ts`:

1. Replace

```ts
import AxeBuilder from '@axe-core/playwright';
import { NEO_THEMES } from '../src/lib/themes';
import { SLUGS } from '../src/docs/slugs';

const ROUTES = ['/', '/components', '/themes', '/blocks', '/start', '/agents', ...SLUGS.map((slug) => `/components/${slug}`)];
```

with

```ts
import AxeBuilder from '@axe-core/playwright';
import { NEO_THEMES } from '../src/lib/themes';
import { SLUGS } from '../src/docs/slugs';
import { CONTRAST_PAIRS } from '../src/lib/themes/contract';

const ROUTES = ['/', '/components', '/themes', '/blocks', '/start', '/agents', ...SLUGS.map((slug) => `/components/${slug}`)];
```

2. Replace

```ts
  await expect(page.getByText('This content could not load.', { exact: false })).toBeVisible();
  await expect(page.locator('.study-scenes__card')).toHaveCount(5);
});
```

with

```ts
  await expect(page.getByText('This content could not load.', { exact: false })).toBeVisible();
  await expect(page.locator('.study-scenes__card')).toHaveCount(5);
});

test('method: the essay, the detail families from their own metadata and the contrast contract', async ({ page }) => {
  await page.goto('#/en/method');
  await expect(page.locator('main h1')).toHaveText('Method');
  await expect(page.locator('.study-essay__text h2').first()).toHaveText('One work per theme');
  await expect(page.locator('.study-family h3')).toHaveText(['concrete', 'grid']);
  await expect(page.locator('table[aria-labelledby="method-contract"] tbody tr')).toHaveCount(CONTRAST_PAIRS.length);
});

test('credits: every photograph and every typeface, each with its licence', async ({ page }) => {
  await page.goto('#/es/credits');
  await expect(page.locator('main h1')).toHaveText('Créditos');
  const photographs = page.locator('table[aria-labelledby="credits-photographs"] tbody tr');
  await expect(photographs).toHaveCount(5);
  await expect(photographs.filter({ hasText: 'Nakagin' })).toContainText('CC BY-SA 4.0');
  const fonts = page.locator('table[aria-labelledby="credits-fonts"] tbody tr');
  await expect(fonts).toHaveCount(18);
  await expect(fonts.filter({ hasText: 'Geist Mono' })).toContainText('Classic, Tech');
});
```

Create `src/site/study/credits.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { CATALOG } from './data';
import { fontCredits } from './credits';

describe('fontCredits', () => {
  it('lists every family once, in order, with its licence and the themes that use it', () => {
    const credits = fontCredits(CATALOG);
    const families = credits.map((credit) => credit.family);
    expect(families).toEqual([...families].sort());
    expect(new Set(families).size).toBe(families.length);
    expect(families).toHaveLength(18);
    expect(credits.find((credit) => credit.family === 'Geist Mono')?.usedBy.map((entry) => entry.id)).toEqual(['classic', 'tech']);
    expect(credits.every((credit) => credit.license === 'OFL-1.1')).toBe(true);
  });

  it('refuses a family with no recorded licence', () => {
    expect(() => fontCredits([{ ...CATALOG[0], fonts: ['Comic Sans MS'] }])).toThrow(/no licence recorded for the font "Comic Sans MS"/);
  });
});
```

Replace the whole of `src/site/study/format.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { commonsTitle, licenseName, startYear, years } from './format';

describe('study formatting', () => {
  it('names licences the way their owners write them', () => {
    expect([licenseName('CC-BY-SA-4.0', 'en'), licenseName('CC-BY-2.0', 'es'), licenseName('CC0-1.0', 'en')]).toEqual(['CC BY-SA 4.0', 'CC BY 2.0', 'CC0']);
    expect([licenseName('PD', 'es'), licenseName('PD', 'en')]).toEqual(['dominio público', 'public domain']);
  });

  it('prints a year or a span, and sorts by the start', () => {
    expect([years(1978), years([1970, 1972])]).toEqual(['1978', '1970–1972']);
    expect([startYear(1978), startYear([1970, 1972])]).toEqual([1978, 1970]);
  });

  it('reads the file title out of a Commons file page', () => {
    expect(commonsTitle('https://commons.wikimedia.org/wiki/File:SESC_Pompeia_-_S%C3%A3o_Paulo_-_20220726142122.jpg')).toBe(
      'SESC Pompeia - São Paulo - 20220726142122.jpg',
    );
    expect(commonsTitle('https://commons.wikimedia.org/wiki/File:Broken_%E0%A4%A.jpg')).toBe('Broken %E0%A4%A.jpg');
  });
});
```

Replace the whole of `src/study/fonts.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { NEO_THEMES, THEME_INFO } from '../lib/themes';
import { FONTS, fontLicense, fontStack, googleFontsUrl } from './fonts';
import type { FontEntry } from './fonts';

describe('font registry', () => {
  it('lists only OFL-1.1 or Apache-2.0 families, with kebab keys and weight axes', () => {
    for (const [key, font] of Object.entries(FONTS) as [string, FontEntry][]) {
      expect(['OFL-1.1', 'Apache-2.0'], key).toContain(font.license);
      expect(['sans', 'serif', 'mono'], key).toContain(font.fallback);
      expect(key).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(font.axes, key).toMatch(/^$|^wght@\d{3}(;\d{3})*$/);
    }
  });

  it('builds a font stack with the generic fallback', () => {
    expect(fontStack('dm-mono')).toBe("'DM Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace");
  });

  it('builds one deduplicated Google Fonts URL, in order', () => {
    expect(googleFontsUrl(['zen-kaku-gothic-new', 'dela-gothic-one', 'zen-kaku-gothic-new'])).toBe(
      'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Dela+Gothic+One&display=swap',
    );
  });
});

describe('fontLicense', () => {
  it('knows the licence of every family a core theme loads', () => {
    for (const id of NEO_THEMES) {
      for (const family of THEME_INFO[id].fonts) expect(fontLicense(family), `${id}: ${family}`).toBe('OFL-1.1');
    }
  });

  it('reads study families from the registry and knows nothing else', () => {
    expect(fontLicense('Dela Gothic One')).toBe('OFL-1.1');
    expect(fontLicense('Comic Sans MS')).toBeUndefined();
    expect(fontLicense('toString')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/study/fonts.test.ts src/site/study/credits.test.ts src/site/study/format.test.ts`

Expected: FAIL

```text
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯
FAIL  src/study/fonts.test.ts > fontLicense > knows the licence of every family a core theme loads
TypeError: fontLicense is not a function
FAIL  src/study/fonts.test.ts > fontLicense > reads study families from the registry and knows nothing else
FAIL  src/site/study/format.test.ts > study formatting > reads the file title out of a Commons file page
TypeError: commonsTitle is not a function
```

Run: `npx playwright test -g "method: the essay|credits: every photograph" --reporter=line`

Expected: FAIL

```text
Error: expect(locator).toHaveText(expected) failed
2 failed
```

(Playwright builds the site and serves it with `vite preview` on port 4173 first.)

- [ ] **Step 3: Implement**

In `src/site/App.tsx`:

1. Replace

```tsx
import { StudyHome } from './pages/StudyHome';
import { Scenes } from './pages/Scenes';
import { ScenePage } from './pages/ScenePage';
import { ENTRIES } from './study/data';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
```

with

```tsx
import { StudyHome } from './pages/StudyHome';
import { Scenes } from './pages/Scenes';
import { ScenePage } from './pages/ScenePage';
import { Method } from './pages/Method';
import { Credits } from './pages/Credits';
import { ENTRIES } from './study/data';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
```

2. Replace

```tsx
      return <ScenePage scene={route.scene} />;
    case 'origins':
      return <ScenePage scene="origins" />;
    case 'library':
      return <Library />;
    case 'atlas':
```

with

```tsx
      return <ScenePage scene={route.scene} />;
    case 'origins':
      return <ScenePage scene="origins" />;
    case 'method':
      return <Method />;
    case 'credits':
      return <Credits />;
    case 'library':
      return <Library />;
    case 'atlas':
```

Create `src/site/pages/Credits.tsx`:

```tsx
import type { CatalogEntry } from '../../study/catalog';
import type { Reference } from '../../study/types';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';
import { FONT_LICENSE_URLS, fontCredits, specimenUrl } from '../study/credits';
import { CATALOG } from '../study/data';
import { loadThemeData } from '../study/detail';
import { LICENSE_URLS, commonsTitle, licenseName } from '../study/format';
import { useLazy } from '../study/lazy';

const FONTS = fontCredits(CATALOG);

const loadReferences = (): Promise<{ entry: CatalogEntry; reference: Reference }[]> =>
  Promise.all(CATALOG.map(async (entry) => ({ entry, reference: (await loadThemeData(entry)).reference })));

function ThemeLinks({ entries }: { entries: readonly CatalogEntry[] }) {
  const lang = useLang();
  return entries.map((entry, i) => (
    <span key={entry.id}>
      {i ? ', ' : ''}
      <a href={toHash(lang, `/theme/${entry.id}`)}>{entry.name[lang]}</a>
    </span>
  ));
}

function Photographs() {
  const lang = useLang();
  const t = useT();
  const references = useLazy('credits:references', loadReferences);
  if (references.status === 'error') return <p className="site-p">{t('loadError')}</p>;
  if (references.status === 'loading') {
    return (
      <p className="site-p" role="status">
        {t('loading')}
      </p>
    );
  }
  return (
    <div className="site-props">
      <table aria-labelledby="credits-photographs">
        <thead>
          <tr>
            <th scope="col">{t('colTheme')}</th>
            <th scope="col">{t('colAuthor')}</th>
            <th scope="col">{t('colLicense')}</th>
            <th scope="col">{t('colSource')}</th>
          </tr>
        </thead>
        <tbody>
          {references.value.map(({ entry, reference: { image } }) =>
            image ? (
              <tr key={entry.id}>
                <th scope="row">
                  <a href={toHash(lang, `/theme/${entry.id}`)}>{entry.name[lang]}</a>
                </th>
                <td>{image.author}</td>
                <td className="study-nowrap">
                  <a href={LICENSE_URLS[image.license]} target="_blank" rel="noreferrer">
                    {licenseName(image.license, lang)}
                  </a>
                </td>
                <td>
                  <a href={image.sourceUrl} target="_blank" rel="noreferrer">
                    {commonsTitle(image.sourceUrl)}
                  </a>
                </td>
              </tr>
            ) : null,
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Every photograph and every typeface the study uses, with its licence, generated from data. */
export function Credits() {
  const t = useT();
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleCredits')}</h1>
        <p className="site-lead">{t('creditsLead')}</p>
      </header>

      <section aria-labelledby="credits-photographs">
        <h2 className="site-h2" id="credits-photographs">
          {t('photographsHeading')}
        </h2>
        <Photographs />
      </section>

      <section aria-labelledby="credits-fonts">
        <h2 className="site-h2" id="credits-fonts">
          {t('fontsHeading')}
        </h2>
        <div className="site-props">
          <table aria-labelledby="credits-fonts">
            <thead>
              <tr>
                <th scope="col">{t('colFamily')}</th>
                <th scope="col">{t('colLicense')}</th>
                <th scope="col">{t('colUsedBy')}</th>
              </tr>
            </thead>
            <tbody>
              {FONTS.map((font) => (
                <tr key={font.family}>
                  <th scope="row">
                    <a href={specimenUrl(font.family)} target="_blank" rel="noreferrer">
                      {font.family}
                    </a>
                  </th>
                  <td>
                    <a href={FONT_LICENSE_URLS[font.license]} target="_blank" rel="noreferrer">
                      {font.license}
                    </a>
                  </td>
                  <td>
                    <ThemeLinks entries={font.usedBy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
```

Create `src/site/pages/Method.tsx`:

```tsx
import { CONTRAST_PAIRS } from '../../lib/themes/contract';
import { FAMILIES } from '../../study/families';
import type { ParamSpec } from '../../study/families/types';
import { PAIR_TEXT, useLang, useT } from '../i18n';
import { Essay } from '../study/Essay';

const UNITS: Partial<Record<ParamSpec['type'], string>> = { length: ' px', angle: '°' };

function Range({ spec }: { spec: ParamSpec }) {
  const t = useT();
  if (spec.type === 'token') return <>{t('paramToken')}</>;
  if (spec.type === 'enum') return <code>{spec.values.join(' | ')}</code>;
  return (
    <code>
      {spec.min}–{spec.max}
      {UNITS[spec.type] ?? ''}
    </code>
  );
}

/** How a theme is made: the method essay, the detail families from their own metadata, and the contrast contract. */
export function Method() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleMethod')}</h1>
        <p className="site-lead">{t('methodLead')}</p>
      </header>

      <Essay slug="method" />

      <section className="study-section" aria-labelledby="method-families">
        <h2 className="site-h2" id="method-families">
          {t('familiesHeading')}
        </h2>
        {Object.values(FAMILIES).map((family) => (
          <article key={family.name} className="study-family" aria-labelledby={`family-${family.name}`}>
            <h3 className="site-h3" id={`family-${family.name}`}>
              <code>{family.name}</code>
            </h3>
            <p className="site-p">{family.description[lang]}</p>
            <p className="site-p study-family__touches">
              {t('touchesLabel')}:{' '}
              {family.touches.map((root, i) => (
                <span key={root}>
                  {i ? ', ' : ''}
                  <code>.{root}</code>
                </span>
              ))}
            </p>
            <div className="site-props">
              <table aria-labelledby={`family-${family.name}`}>
                <thead>
                  <tr>
                    <th scope="col">{t('paramName')}</th>
                    <th scope="col">{t('paramDefault')}</th>
                    <th scope="col">{t('paramRange')}</th>
                    <th scope="col">{t('paramMeaning')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(family.params).map(([name, spec]) => (
                    <tr key={name}>
                      <th scope="row">
                        <code>{name}</code>
                      </th>
                      <td>
                        <code>{String(spec.default)}</code>
                      </td>
                      <td>
                        <Range spec={spec} />
                      </td>
                      <td>{spec.description[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>

      <section className="study-section" aria-labelledby="method-contract">
        <h2 className="site-h2" id="method-contract">
          {t('contractHeading')}
        </h2>
        <p className="site-p">{t('contractLead')}</p>
        <div className="site-props">
          <table aria-labelledby="method-contract">
            <thead>
              <tr>
                <th scope="col">{t('colPair')}</th>
                <th scope="col">{t('colToken')}</th>
                <th scope="col">{t('colNeeds')}</th>
              </tr>
            </thead>
            <tbody>
              {CONTRAST_PAIRS.map((pair) => (
                <tr key={`${pair.fg} ${pair.bg}`}>
                  <th scope="row">{PAIR_TEXT[`${pair.fg} ${pair.bg}`][lang]}</th>
                  <td>
                    <code>{pair.fg}</code> / <code>{pair.bg}</code>
                  </td>
                  <td>{pair.min}:1</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
```

In `src/site/site.css`:

Replace

```css
  box-shadow: var(--nbc-shadow);
}

@media (max-width: 900px) {
  .study-hero,
  .study-use {
```

with

```css
  box-shadow: var(--nbc-shadow);
}

.study-nowrap {
  white-space: nowrap;
}
.study-family + .study-family {
  margin-block-start: var(--nbc-space-2xl);
}
.study-family .site-h3 {
  margin-block-start: var(--nbc-space-xl);
}
.study-family__touches {
  font-size: var(--nbc-fs-sm);
  color: var(--nbc-fg-muted);
}

@media (max-width: 900px) {
  .study-hero,
  .study-use {
```

Create `src/site/study/credits.ts`:

```ts
/** Credits generated from the catalog: every font family, its licence and the themes that use it. */
import type { CatalogEntry } from '../../study/catalog';
import { fontLicense } from '../../study/fonts';
import type { FontEntry } from '../../study/fonts';

export interface FontCredit {
  readonly family: string;
  readonly license: FontEntry['license'];
  readonly usedBy: readonly CatalogEntry[];
}

export const FONT_LICENSE_URLS: Record<FontEntry['license'], string> = {
  'OFL-1.1': 'https://openfontlicense.org/',
  'Apache-2.0': 'https://www.apache.org/licenses/LICENSE-2.0',
};

export const specimenUrl = (family: string): string => `https://fonts.google.com/specimen/${family.replace(/ /g, '+')}`;

export function fontCredits(entries: readonly CatalogEntry[]): FontCredit[] {
  const byFamily = new Map<string, CatalogEntry[]>();
  for (const entry of entries) {
    for (const family of entry.fonts) byFamily.set(family, [...(byFamily.get(family) ?? []), entry]);
  }
  return [...byFamily]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([family, usedBy]) => {
      const license = fontLicense(family);
      if (!license) throw new Error(`no licence recorded for the font "${family}"`);
      return { family, license, usedBy };
    });
}
```

Replace the whole of `src/site/study/format.ts` with:

```ts
/** Small formatting helpers shared by the study pages. */
import type { ImageLicense, Lang, Reference, Scene } from '../../study/types';
import { toHash } from '../router';

export const LICENSE_URLS: Record<ImageLicense, string> = {
  'CC0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
  PD: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
  'CC-BY-2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'CC-BY-2.5': 'https://creativecommons.org/licenses/by/2.5/',
  'CC-BY-3.0': 'https://creativecommons.org/licenses/by/3.0/',
  'CC-BY-4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC-BY-SA-2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
  'CC-BY-SA-2.5': 'https://creativecommons.org/licenses/by-sa/2.5/',
  'CC-BY-SA-3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC-BY-SA-4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
};

/** 'CC-BY-SA-4.0' → 'CC BY-SA 4.0'; 'PD' → 'public domain' / 'dominio público'. */
export function licenseName(license: ImageLicense, lang: Lang): string {
  if (license === 'PD') return lang === 'es' ? 'dominio público' : 'public domain';
  if (license === 'CC0-1.0') return 'CC0';
  return license.replace(/^CC-/, 'CC ').replace(/-(\d)/, ' $1');
}

export const years = (date: Reference['date']): string => (typeof date === 'number' ? String(date) : `${date[0]}–${date[1]}`);

export const startYear = (date: Reference['date']): number => (typeof date === 'number' ? date : date[0]);

/** The page of a scene; Origins has its own. */
export const sceneHref = (lang: Lang, scene: Scene): string => toHash(lang, scene === 'origins' ? '/origins' : `/scene/${scene}`);

/** 'https://commons.wikimedia.org/wiki/File:SESC_Pompeia_-_S%C3%A3o_Paulo.jpg' → 'SESC Pompeia - São Paulo.jpg'. */
export function commonsTitle(sourceUrl: string): string {
  const name = sourceUrl.slice(sourceUrl.lastIndexOf('/') + 1).replace(/^File:/, '');
  let decoded = name;
  try {
    decoded = decodeURIComponent(name);
  } catch {
    // A malformed escape: show the title as written.
  }
  return decoded.replace(/_/g, ' ');
}
```

Replace the whole of `src/study/fonts.ts` with:

```ts
/**
 * Font registry for study themes. Themes name fonts by key, so a typo fails
 * type checking and compilation. Google Fonts families under OFL-1.1 or
 * Apache-2.0 only. Add a family here before a theme uses it, and check that
 * `https://fonts.googleapis.com/css2?family=<Name>:<axes>&display=swap`
 * answers 200.
 */
export interface FontEntry {
  /** CSS family name, exactly as Google Fonts serves it. */
  readonly family: string;
  /** css2 axis spec after the colon ('wght@400;700'); empty for single-style families. */
  readonly axes: string;
  readonly fallback: 'sans' | 'serif' | 'mono';
  readonly license: 'OFL-1.1' | 'Apache-2.0';
  readonly scripts: readonly ('latin' | 'latin-ext' | 'japanese')[];
}

export const FONTS = {
  barlow: { family: 'Barlow', axes: 'wght@400;500;600;700', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  'barlow-condensed': { family: 'Barlow Condensed', axes: 'wght@600;700;800', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  chivo: { family: 'Chivo', axes: 'wght@400;500;700;900', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  'chivo-mono': { family: 'Chivo Mono', axes: 'wght@400;500;700', fallback: 'mono', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  'dela-gothic-one': { family: 'Dela Gothic One', axes: '', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'japanese'] },
  'dm-mono': { family: 'DM Mono', axes: 'wght@400;500', fallback: 'mono', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  'm-plus-1-code': { family: 'M PLUS 1 Code', axes: 'wght@400;500;700', fallback: 'mono', license: 'OFL-1.1', scripts: ['latin', 'japanese'] },
  'zen-kaku-gothic-new': { family: 'Zen Kaku Gothic New', axes: 'wght@400;500;700;900', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'japanese'] },
} as const satisfies Record<string, FontEntry>;

export type FontKey = keyof typeof FONTS;

/**
 * Licences of the families the five core themes load (the library's
 * themes/<id>.fonts.css), for the Credits page. Checked against the
 * google/fonts repository, which files every family under ofl/ or apache/.
 */
export const CORE_FONT_LICENSES: Readonly<Record<string, FontEntry['license']>> = {
  'Bricolage Grotesque': 'OFL-1.1',
  'Geist Mono': 'OFL-1.1',
  'Martian Mono': 'OFL-1.1',
  'Inter Tight': 'OFL-1.1',
  'JetBrains Mono': 'OFL-1.1',
  Sixtyfour: 'OFL-1.1',
  'M PLUS Rounded 1c': 'OFL-1.1',
  VT323: 'OFL-1.1',
  Archivo: 'OFL-1.1',
  'IBM Plex Mono': 'OFL-1.1',
};

/** A family's licence by its CSS name: the registry for study themes, the list above for core ones. */
export function fontLicense(family: string): FontEntry['license'] | undefined {
  const registered = (Object.values(FONTS) as FontEntry[]).find((font) => font.family === family);
  if (registered) return registered.license;
  return Object.hasOwn(CORE_FONT_LICENSES, family) ? CORE_FONT_LICENSES[family] : undefined;
}

export const FALLBACKS = {
  sans: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  serif: "'Times New Roman', Times, serif",
  mono: "ui-monospace, 'SFMono-Regular', Menlo, monospace",
} as const;

/** Font tokens for themes that load nothing. */
export const SYSTEM_STACKS = {
  'system-sans': { sans: FALLBACKS.sans, mono: FALLBACKS.mono },
  'system-serif': { sans: FALLBACKS.serif, mono: "'Courier New', Courier, monospace" },
} as const;

/** CSS font-family value: the family, then its generic fallback stack. */
export function fontStack(key: FontKey): string {
  const font: FontEntry = FONTS[key];
  return `'${font.family}', ${FALLBACKS[font.fallback]}`;
}

/** Google Fonts css2 URL for the given families (deduplicated, in order). */
export function googleFontsUrl(keys: readonly FontKey[]): string {
  const families = [...new Set(keys)].map((key) => {
    const font: FontEntry = FONTS[key];
    const name = font.family.replace(/ /g, '+');
    return `family=${font.axes ? `${name}:${font.axes}` : name}`;
  });
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}
```

- [ ] **Step 4: Run the tests and the gates**

Run: `npx vitest run src/study/fonts.test.ts src/site/study/credits.test.ts src/site/study/format.test.ts`

Expected: PASS

```text
Test Files  3 passed (3)
Tests  10 passed (10)
```

Run: `npx vitest run`

Expected: PASS

```text
Test Files  48 passed (48)
Tests  887 passed | 4 skipped (891)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

Run: `npx playwright test -g "method: the essay|credits: every photograph" --reporter=line`

Expected: PASS

```text
2 passed
```

- [ ] **Step 5: Commit**

```bash
git add e2e/site.spec.ts src/site/App.tsx src/site/pages/Credits.tsx src/site/pages/Method.tsx src/site/site.css src/site/study/credits.test.ts src/site/study/credits.ts src/site/study/format.test.ts src/site/study/format.ts src/study/fonts.test.ts src/study/fonts.ts
git commit -F - <<'EOF'
feat(site): method and credits pages, generated from data

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

### Task 9: Agents: the study catalog in llms.txt, llms-full.txt and the skill

D12: the same generator writes the study themes — reference, scene, native scheme and stylesheets — into `llms.txt` and `llms-full.txt`, and into a table between two markers in `skills/neobrutalist-ui/SKILL.md`. Generated links switch to the `#/en/…` routes through `pageUrl`, as do the llms.txt samples on the Agents and Library pages. `pregen:llms` builds the study catalog first, and CI's drift check now covers the skill.

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`
- Modify: `public/llms-full.txt` (regenerated by `npm run gen:llms`)
- Modify: `public/llms.txt` (regenerated by `npm run gen:llms`)
- Modify: `scripts/gen-llms.mjs`
- Modify: `skills/neobrutalist-ui/SKILL.md`
- Modify: `src/docs/guide.ts`
- Modify: `src/site/pages/Agents.tsx`
- Modify: `src/site/pages/Library.tsx`
- Test (new): `src/study/llms.test.ts`

**Interfaces:**
- Consumes: the generated `CATALOG` (Plan 1); `SCENE_TEXT` (Task 2); `SITE_URL` (`src/docs/guide.ts`).
- Produces: `pageUrl(path: string): string` in `src/docs/guide.ts`; the study sections of `public/llms.txt` and `public/llms-full.txt`; the `<!-- study-themes:start -->` / `<!-- study-themes:end -->` table in the skill.

- [ ] **Step 1: Write the failing tests**

Create `src/study/llms.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATALOG } from './.generated/catalog';

// The committed agent docs (CI regenerates them and fails on any diff).
const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const llms = read('public/llms.txt');
const full = read('public/llms-full.txt');
const skill = read('skills/neobrutalist-ui/SKILL.md');
const study = CATALOG.filter((entry) => !entry.predatesStudy);

describe('agent docs carry the study catalog', () => {
  it('llms.txt links every study theme page with its reference, in the language-prefixed routes', () => {
    for (const entry of study) {
      expect(llms).toContain(`/#/en/theme/${entry.id})`);
      expect(llms).toContain(entry.reference.title.en);
    }
    expect(llms).toContain('/#/en/components/button)');
    expect(llms).not.toMatch(/\/#\/(?!en\/)/);
  });

  it('llms-full.txt lists every study theme with its scene, scheme and stylesheets', () => {
    for (const entry of study) expect(full).toContain(`| \`${entry.id}\` |`);
    expect(full).toContain('`themes/nakagin.css`, `themes/nakagin.fonts.css`');
    expect(full).toContain("import { STUDY_CATALOG } from 'neobrutalistcomponents/study'");
  });

  it('the skill gains a generated table of the study themes', () => {
    const section = skill.slice(skill.indexOf('<!-- study-themes:start -->'), skill.indexOf('<!-- study-themes:end -->'));
    for (const entry of study) expect(section).toContain(`| \`${entry.id}\` |`);
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/study/llms.test.ts`

Expected: FAIL

```text
+         web-app is live on production. 3 of 3 health checks passed.
+       <Alert variant="danger" title="Payment failed">
+         Build failed
+     body: 'Build #482 passed all checks. Deploying replaces the live version of Atlas API in about two minutes.',
FAIL  src/study/llms.test.ts > agent docs carry the study catalog > the skill gains a generated table of the study themes
AssertionError: expected '' to contain '| `maeusebunker` |'
```

- [ ] **Step 3: Implement**

In `.github/workflows/ci.yml`:

Replace

```yaml
      - name: llms.txt is up to date
        run: |
          npm run gen:llms
          git diff --exit-code public/llms.txt public/llms-full.txt
      - name: Site bundle sanity
        run: |
          test -f site-dist/index.html
```

with

```yaml
      - name: llms.txt is up to date
        run: |
          npm run gen:llms
          git diff --exit-code public/llms.txt public/llms-full.txt skills/neobrutalist-ui/SKILL.md
      - name: Site bundle sanity
        run: |
          test -f site-dist/index.html
```

In `package.json`:

Replace

```json
    "check": "npm run lint && npm run typecheck && npm run test && npm run build && npm run check:package",
    "preview": "vite preview --config vite.site.config.ts",
    "prepublishOnly": "npm run build:lib && npm run check:package",
    "gen:llms": "node scripts/gen-llms.mjs",
    "fetch:image": "node scripts/fetch-image.mjs",
    "screenshots": "node scripts/screenshots.mjs",
```

with

```json
    "check": "npm run lint && npm run typecheck && npm run test && npm run build && npm run check:package",
    "preview": "vite preview --config vite.site.config.ts",
    "prepublishOnly": "npm run build:lib && npm run check:package",
    "pregen:llms": "npm run gen:study",
    "gen:llms": "node scripts/gen-llms.mjs",
    "fetch:image": "node scripts/fetch-image.mjs",
    "screenshots": "node scripts/screenshots.mjs",
```

In `scripts/gen-llms.mjs`:

1. Replace

```js
// Generates public/llms.txt and public/llms-full.txt from the docs metadata
// (src/docs/meta/*.ts), the shared guide (src/docs/guide.ts), the theme
// registry and the live example sources. Output is deterministic: the same
// sources always produce byte-identical files (CI checks for a clean diff).
//
//   node scripts/gen-llms.mjs          → public/
//   node scripts/gen-llms.mjs --dist   → also copies into dist/ (npm package)
import { runnerImport } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
```

with

```js
// Generates public/llms.txt and public/llms-full.txt from the docs metadata
// (src/docs/meta/*.ts), the shared guide (src/docs/guide.ts), the theme
// registry, the study catalog (src/study/.generated/catalog.ts, written by
// build-study.mjs) and the live example sources, and rewrites the study-themes
// table of skills/neobrutalist-ui/SKILL.md. Output is deterministic: the same
// sources always produce byte-identical files (CI checks for a clean diff).
//
//   node scripts/gen-llms.mjs          → public/ and the skill
//   node scripts/gen-llms.mjs --dist   → also copies into dist/ (npm package)
import { runnerImport } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
```

2. Replace

```js
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = async (id) => (await runnerImport(join(ROOT, id), { configFile: false, logLevel: 'silent' })).module;

const [{ COMPONENTS }, guide, themes, contract] = await Promise.all([
  load('src/docs/meta/index.ts'),
  load('src/docs/guide.ts'),
  load('src/lib/themes/index.ts'),
  load('src/lib/themes/contract.ts'),
]);
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const { SITE_URL, REPO_URL, TAGLINE, INSTALL_CODE, SETUP_CODE, BYO_THEME_CODE, THEME_GUIDE, GLOBAL_RULES, FONTS_NOTE } =
  guide;
const { NEO_THEMES, THEME_INFO } = themes;
```

with

```js
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = async (id) => (await runnerImport(join(ROOT, id), { configFile: false, logLevel: 'silent' })).module;

const [{ COMPONENTS }, guide, themes, contract, { CATALOG }, { SCENE_TEXT }] = await Promise.all([
  load('src/docs/meta/index.ts'),
  load('src/docs/guide.ts'),
  load('src/lib/themes/index.ts'),
  load('src/lib/themes/contract.ts'),
  load('src/study/.generated/catalog.ts'),
  load('src/site/i18n.ts'),
]);
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const { SITE_URL, REPO_URL, TAGLINE, INSTALL_CODE, SETUP_CODE, BYO_THEME_CODE, THEME_GUIDE, GLOBAL_RULES, FONTS_NOTE, pageUrl } =
  guide;
const { NEO_THEMES, THEME_INFO } = themes;
```

3. Replace

```js
const list = (items) => items.map((i) => `- ${i}`).join('\n');
const groups = [...new Set(COMPONENTS.map((c) => c.group))];

// ---------------------------------------------------------------- llms.txt
const index = [
  `# ${pkg.name}`,
```

with

```js
const list = (items) => items.map((i) => `- ${i}`).join('\n');
const groups = [...new Set(COMPONENTS.map((c) => c.group))];

// The study's own themes (the five core themes are listed from THEME_INFO).
const study = CATALOG.filter((entry) => !entry.predatesStudy);
const years = (date) => (typeof date === 'number' ? String(date) : `${date[0]}–${date[1]}`);
const reference = ({ reference: r }) =>
  [`${r.title.en}${r.original ? ` (${r.original.text})` : ''}`, r.authors.join(', '), r.place.en, years(r.date)].filter(Boolean).join(', ');
const scene = (entry) => SCENE_TEXT[entry.scene].name.en;
const stylesheets = (entry) => `\`themes/${entry.id}.css\`, \`themes/${entry.id}.fonts.css\``;

// ---------------------------------------------------------------- llms.txt
const index = [
  `# ${pkg.name}`,
```

4. Replace

```js
  '',
  '## Docs',
  '',
  `- [Getting started](${SITE_URL}/#/start): install, setup, fonts, bring-your-own theme`,
  `- [Themes and tokens](${SITE_URL}/#/themes): the five themes, every token, live contrast ratios`,
  `- [Blocks](${SITE_URL}/#/blocks): complete screens composed from the components`,
  '',
  ...groups.flatMap((group) => [
    `## ${group}`,
    '',
    ...COMPONENTS.filter((c) => c.group === group).map((c) => `- [${c.name}](${SITE_URL}/#/components/${c.slug}): ${c.summary}`),
    '',
  ]),
  '## Optional',
  '',
  `- [Full reference](${SITE_URL}/llms-full.txt): every component, prop, rule and example in one file`,
```

with

```js
  '',
  '## Docs',
  '',
  `- [Getting started](${pageUrl('/start')}): install, setup, fonts, bring-your-own theme`,
  `- [Atlas](${pageUrl('/atlas')}): every theme, with its reference, every token and live contrast ratios`,
  `- [Blocks](${pageUrl('/blocks')}): complete screens composed from the components`,
  '',
  ...groups.flatMap((group) => [
    `## ${group}`,
    '',
    ...COMPONENTS.filter((c) => c.group === group).map((c) => `- [${c.name}](${pageUrl(`/components/${c.slug}`)}): ${c.summary}`),
    '',
  ]),
  '## Study themes',
  '',
  `Themes of the [neobrutalism study](${pageUrl('/')}), each read from one documented work. Same contract and geometry as the five core themes; import \`${pkg.name}/themes/<id>.css\`.`,
  '',
  ...study.map((entry) => `- [${entry.name.en}](${pageUrl(`/theme/${entry.id}`)}): \`${entry.id}\` — ${reference(entry)}. ${scene(entry)}, ${entry.nativeScheme} native.`),
  '',
  '## Optional',
  '',
  `- [Full reference](${SITE_URL}/llms-full.txt): every component, prop, rule and example in one file`,
```

5. Replace

```js
    ]),
  ),
  '',
  '## Composition rules',
  '',
  list(GLOBAL_RULES),
```

with

```js
    ]),
  ),
  '',
  '## Study themes',
  '',
  `Each study theme reads one documented work; its page (${pageUrl('/atlas')}) cites the sources. Same token contract and geometry as the core themes: import its stylesheet, and its fonts file unless you self-host the fonts (system-font themes ship an empty one). The catalog is also data: \`import { STUDY_CATALOG } from '${pkg.name}/study'\`.`,
  '',
  table(
    ['Theme', 'Reference', 'Scene', 'Native scheme', 'Fonts', 'Stylesheets'],
    study.map((entry) => [
      `\`${entry.id}\``,
      reference(entry),
      scene(entry),
      entry.nativeScheme,
      entry.fonts.length ? entry.fonts.join(', ') : 'system fonts',
      stylesheets(entry),
    ]),
  ),
  '',
  '## Composition rules',
  '',
  list(GLOBAL_RULES),
```

6. Replace

```js
writeFileSync(join(out, 'llms.txt'), index);
writeFileSync(join(out, 'llms-full.txt'), full.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');

if (process.argv.includes('--dist')) {
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  copyFileSync(join(out, 'llms.txt'), join(ROOT, 'dist/llms.txt'));
  copyFileSync(join(out, 'llms-full.txt'), join(ROOT, 'dist/llms-full.txt'));
}
console.log(`gen-llms: ${COMPONENTS.length} components → public/llms.txt, public/llms-full.txt`);
```

with

```js
writeFileSync(join(out, 'llms.txt'), index);
writeFileSync(join(out, 'llms-full.txt'), full.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');

// The skill's study-themes table, between its markers.
const SKILL = join(ROOT, 'skills/neobrutalist-ui/SKILL.md');
const START = '<!-- study-themes:start -->';
const END = '<!-- study-themes:end -->';
const skill = readFileSync(SKILL, 'utf8');
const [from, to] = [skill.indexOf(START), skill.indexOf(END)];
if (from < 0 || to < from) throw new Error(`gen-llms: ${START} … ${END} not found in SKILL.md`);
const studyTable = table(
  ['Theme', 'Reference', 'Scene', 'Native scheme'],
  study.map((entry) => [`\`${entry.id}\``, reference(entry), scene(entry), entry.nativeScheme]),
);
writeFileSync(SKILL, `${skill.slice(0, from + START.length)}\n${studyTable}\n${skill.slice(to)}`);

if (process.argv.includes('--dist')) {
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  copyFileSync(join(out, 'llms.txt'), join(ROOT, 'dist/llms.txt'));
  copyFileSync(join(out, 'llms-full.txt'), join(ROOT, 'dist/llms-full.txt'));
}
console.log(`gen-llms: ${COMPONENTS.length} components, ${study.length} study themes → public/llms.txt, public/llms-full.txt, SKILL.md`);
```

In `skills/neobrutalist-ui/SKILL.md`, replace

```md
Pick one per product. Apps: `mode="system"`. Marketing pages: leave `mode` unset.
```

with

````md
Pick one per product. Apps: `mode="system"`. Marketing pages: leave `mode` unset.

### Study themes

Each reads one documented work — a building, a magazine, a terminal, a website. Choose one when the brief names that work, its place or its period, and set it up exactly like a core theme with its id. Their pages cite the sources: https://sssamuelll.github.io/neobrutalistcomponents/#/en/atlas

<!-- study-themes:start -->
<!-- study-themes:end -->
````

The table between the two markers is written by `npm run gen:llms` in the next step.

In `src/docs/guide.ts`:

Replace

```ts
export const SITE_URL = 'https://sssamuelll.github.io/neobrutalistcomponents';
export const REPO_URL = 'https://github.com/sssamuelll/neobrutalistcomponents';

export const TAGLINE = 'Brutalist React components. Five themes, light and dark, one token contract.';

export const INSTALL_CODE = 'npm install neobrutalistcomponents';
```

with

```ts
export const SITE_URL = 'https://sssamuelll.github.io/neobrutalistcomponents';
export const REPO_URL = 'https://github.com/sssamuelll/neobrutalistcomponents';

/** A page of the site, in English: the language of the generated agent docs. */
export const pageUrl = (path: string): string => `${SITE_URL}/#/en${path}`;

export const TAGLINE = 'Brutalist React components. Five themes, light and dark, one token contract.';

export const INSTALL_CODE = 'npm install neobrutalistcomponents';
```

In `src/site/pages/Agents.tsx`:

1. Replace

```tsx
import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { COMPONENTS } from '../../docs/meta';
import { GLOBAL_RULES, SITE_URL, THEME_GUIDE } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';

const SKILL_CODE = `# Claude Code (or any agent that reads skills)
```

with

```tsx
import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { COMPONENTS } from '../../docs/meta';
import { GLOBAL_RULES, THEME_GUIDE, pageUrl } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';

const SKILL_CODE = `# Claude Code (or any agent that reads skills)
```

2. Replace

```tsx
    '',
    ...COMPONENTS.filter((c) => c.group === 'Forms')
      .slice(0, 3)
      .map((c) => `- [${c.name}](${SITE_URL}/#/components/${c.slug}): ${c.summary}`),
    '…',
  ].join('\n');
```

with

```tsx
    '',
    ...COMPONENTS.filter((c) => c.group === 'Forms')
      .slice(0, 3)
      .map((c) => `- [${c.name}](${pageUrl(`/components/${c.slug}`)}): ${c.summary}`),
    '…',
  ].join('\n');
```

In `src/site/pages/Library.tsx`:

1. Replace

```tsx
import { Badge, Button, Card, Input, NeoProvider, Progress, Select, Switch, NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { ArrowRight, GitBranch } from 'lucide-react';
import { COMPONENTS } from '../../docs/meta';
import { INSTALL_CODE, SITE_URL } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { useSitePrefsContext } from '../prefsContext';
import { useLang } from '../i18n';
```

with

```tsx
import { Badge, Button, Card, Input, NeoProvider, Progress, Select, Switch, NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { ArrowRight, GitBranch } from 'lucide-react';
import { COMPONENTS } from '../../docs/meta';
import { INSTALL_CODE, pageUrl } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { useSitePrefsContext } from '../prefsContext';
import { useLang } from '../i18n';
```

2. Replace

```tsx
    '## Forms',
    ...COMPONENTS.filter((c) => c.group === 'Forms')
      .slice(0, 2)
      .map((c) => `- [${c.name}](${SITE_URL}/#/components/${c.slug}): ${c.summary}`),
  ].join('\n');

  return (
```

with

```tsx
    '## Forms',
    ...COMPONENTS.filter((c) => c.group === 'Forms')
      .slice(0, 2)
      .map((c) => `- [${c.name}](${pageUrl(`/components/${c.slug}`)}): ${c.summary}`),
  ].join('\n');

  return (
```

- [ ] **Step 4: Regenerate the agent docs**

Run: `npm run gen:llms`

Expected: exit code 0, and:

```text
gen-llms: 16 components, 4 study themes → public/llms.txt, public/llms-full.txt, SKILL.md
```

The generator rewrites `public/llms.txt`, `public/llms-full.txt` and the skill's table; they are committed with the task.

- [ ] **Step 5: Run the tests and the gates**

Run: `npx vitest run src/study/llms.test.ts`

Expected: PASS

```text
Test Files  1 passed (1)
Tests  3 passed (3)
```

Run: `npx vitest run`

Expected: PASS

```text
Test Files  49 passed (49)
Tests  890 passed | 4 skipped (894)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/ci.yml package.json public/llms-full.txt public/llms.txt scripts/gen-llms.mjs skills/neobrutalist-ui/SKILL.md src/docs/guide.ts src/site/pages/Agents.tsx src/site/pages/Library.tsx src/study/llms.test.ts
git commit -F - <<'EOF'
feat(agents): llms.txt, llms-full.txt and the skill list the study themes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

### Task 10: Every page at 360 px and in both languages

§5's browser matrix. The route × theme matrix moves to the `#/en/…` routes and gains the study pages; every main page is checked in both languages at 1280 and 360 px (axe, no page errors, no sideways scroll); theme and component pages are checked at 360 px too. The phone tests fail first. On 1.0.1 the theme switcher already widened a 360 px page to 368 px, and with five nav items, the language link and "More themes" it reaches 451 px. The site grid's column becomes `minmax(0, 1fr)`, the switcher wraps, and so does the theme page's grid. axe also flags tables that scroll sideways without keyboard access (`scrollable-region-focusable`): `TableScroll` makes each such wrapper a named, focusable region, docs tables included.

**Files:**
- Test: `e2e/site.spec.ts`
- Modify: `src/site/docs/PropsTable.tsx`
- Test (new): `src/site/docs/TableScroll.test.tsx`
- Create: `src/site/docs/TableScroll.tsx`
- Modify: `src/site/docs/TokenTables.tsx`
- Modify: `src/site/pages/Agents.tsx`
- Modify: `src/site/pages/Credits.tsx`
- Modify: `src/site/pages/Method.tsx`
- Modify: `src/site/pages/Start.tsx`
- Modify: `src/site/site.css`

**Interfaces:**
- Consumes: every page from Tasks 2–8.
- Produces: `TableScroll({ label, children })` (`src/site/docs/TableScroll.tsx`), used by every table that can scroll sideways.

- [ ] **Step 1: Write the failing tests**

In `e2e/site.spec.ts`:

1. Replace

```ts
import { SLUGS } from '../src/docs/slugs';
import { CONTRAST_PAIRS } from '../src/lib/themes/contract';

const ROUTES = ['/', '/components', '/themes', '/blocks', '/start', '/agents', ...SLUGS.map((slug) => `/components/${slug}`)];

for (const theme of NEO_THEMES) {
  test.describe(`theme ${theme}`, () => {
```

with

```ts
import { SLUGS } from '../src/docs/slugs';
import { CONTRAST_PAIRS } from '../src/lib/themes/contract';

const STUDY_ROUTES = ['/en/', '/en/scenes', '/en/scene/japan', '/en/origins', '/en/atlas', '/en/method', '/en/credits'];
const DOC_ROUTES = ['/en/library', '/en/components', '/en/blocks', '/en/start', '/en/agents', ...SLUGS.map((slug) => `/en/components/${slug}`)];
const ROUTES = [...STUDY_ROUTES, ...DOC_ROUTES];

for (const theme of NEO_THEMES) {
  test.describe(`theme ${theme}`, () => {
```

2. Replace

```ts
    }
  });

  test(`${theme} dark scheme: home and blocks pass axe`, async ({ page }) => {
    for (const route of ['/', '/blocks']) {
      await page.goto(`?theme=${theme}&mode=dark#${route}`);
      await expect(page.locator('main h1').first()).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
```

with

```ts
    }
  });

  test(`${theme} dark scheme: study, library and blocks pass axe`, async ({ page }) => {
    for (const route of ['/en/', '/en/library', '/en/blocks']) {
      await page.goto(`?theme=${theme}&mode=dark#${route}`);
      await expect(page.locator('main h1').first()).toBeVisible();
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
```

3. Replace

```ts
  await expect(page.locator('main h1')).toHaveText('Nothing at this address');
});

test('theme page: when its data cannot load, it says so instead of loading forever', async ({ page }) => {
  await page.route(/\/assets\/sesc-pompeia-[\w-]+\.js$/, (route) => route.abort());
  await page.goto('#/en/theme/sesc-pompeia');
```

with

```ts
  await expect(page.locator('main h1')).toHaveText('Nothing at this address');
});


test('theme page: when its data cannot load, it says so instead of loading forever', async ({ page }) => {
  await page.route(/\/assets\/sesc-pompeia-[\w-]+\.js$/, (route) => route.abort());
  await page.goto('#/en/theme/sesc-pompeia');
```

4. Replace

```ts
  await expect(fonts.filter({ hasText: 'Geist Mono' })).toContainText('Classic, Tech');
});
```

with

```ts
  await expect(fonts.filter({ hasText: 'Geist Mono' })).toContainText('Classic, Tech');
});

// The study's main pages in both languages, at desktop width and on a phone:
// they render, pass axe, log no errors and never scroll sideways.
const MAIN_PAGES = ['/', '/scenes', '/scene/japan', '/scene/germany', '/scene/usa', '/scene/latam', '/origins', '/atlas', '/method', '/credits', '/library'];
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
          const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
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
  for (const hash of ['#/es/theme/tech', '#/en/theme/nakagin', '#/es/theme/maeusebunker', '#/en/components/button']) {
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
```

Create `src/site/docs/TableScroll.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TableScroll } from './TableScroll';

describe('TableScroll', () => {
  it('is a named region a keyboard can focus, so a table wider than the screen can be scrolled without a mouse', () => {
    render(
      <TableScroll label="Button props">
        <table>
          <tbody>
            <tr>
              <td>size</td>
            </tr>
          </tbody>
        </table>
      </TableScroll>,
    );
    const region = screen.getByRole('region', { name: 'Button props' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveClass('site-props');
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run src/site/docs/TableScroll.test.tsx`

Expected: FAIL

```text
Test Files  1 failed (1)
Tests  no tests
FAIL  src/site/docs/TableScroll.test.tsx [ src/site/docs/TableScroll.test.tsx ]
Error: Failed to resolve import "./TableScroll" from "src/site/docs/TableScroll.test.tsx". Does the file exist?
```

Run: `npx playwright test -g "main pages at 360px|theme and component pages at 360px" --reporter=line`

Expected: FAIL

```text
Error: expect(received).toBeLessThanOrEqual(expected)
Error: axe violations
26 failed
```

(Playwright builds the site and serves it with `vite preview` on port 4173 first.)

The 360 px tests fail on sideways scroll (`scrollWidth` above 360) and, on the Method page, on axe's `scrollable-region-focusable`.

- [ ] **Step 3: Implement**

In `src/site/docs/PropsTable.tsx`:

1. Replace

```tsx
import type { PropDoc } from '../../docs/types';

export function PropsTable({ props, caption }: { props: PropDoc[]; caption: string }) {
  if (props.length === 0) return null;
  return (
    <div className="site-props">
      <table>
        <caption>{caption}</caption>
        <thead>
```

with

```tsx
import type { PropDoc } from '../../docs/types';
import { TableScroll } from './TableScroll';

export function PropsTable({ props, caption }: { props: PropDoc[]; caption: string }) {
  if (props.length === 0) return null;
  return (
    <TableScroll label={caption}>
      <table>
        <caption>{caption}</caption>
        <thead>
```

2. Replace

```tsx
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

with

```tsx
          ))}
        </tbody>
      </table>
    </TableScroll>
  );
}
```

Create `src/site/docs/TableScroll.tsx`:

```tsx
import type { ReactNode } from 'react';

/**
 * Wraps a table that may scroll sideways on a phone. The region is focusable,
 * so a keyboard can scroll it (axe: scrollable-region-focusable), and named
 * after its table.
 */
export function TableScroll({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="site-props" role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}
```

In `src/site/docs/TokenTables.tsx`:

1. Replace

```tsx
import { contrastRatio, resolveColor, resolveStops } from '../../lib/themes/color';
import type { Scheme } from '../../lib/themes/color';
import { PAIR_TEXT, SCHEME_TEXT, useLang, useT } from '../i18n';

/**
 * A theme's color tokens and WCAG contrast ratios in one scheme, computed with
```

with

```tsx
import { contrastRatio, resolveColor, resolveStops } from '../../lib/themes/color';
import type { Scheme } from '../../lib/themes/color';
import { PAIR_TEXT, SCHEME_TEXT, useLang, useT } from '../i18n';
import { TableScroll } from './TableScroll';

/**
 * A theme's color tokens and WCAG contrast ratios in one scheme, computed with
```

2. Replace

```tsx
  const t = useT();
  const page = resolveColor(tokens, '--nbc-bg', scheme);
  const schemeName = SCHEME_TEXT[scheme][lang];
  return (
    <div className="site-band__tables">
      <div className="site-props">
        <table>
          <caption>{lang === 'es' ? `Tokens de color, esquema ${schemeName}` : `Color tokens, ${schemeName} scheme`}</caption>
          <thead>
            <tr>
              <th scope="col">{t('colToken')}</th>
```

with

```tsx
  const t = useT();
  const page = resolveColor(tokens, '--nbc-bg', scheme);
  const schemeName = SCHEME_TEXT[scheme][lang];
  const tokensCaption = lang === 'es' ? `Tokens de color, esquema ${schemeName}` : `Color tokens, ${schemeName} scheme`;
  const contrastCaption = lang === 'es' ? `Contraste, esquema ${schemeName} (WCAG 2.2)` : `Contrast, ${schemeName} scheme (WCAG 2.2)`;
  return (
    <div className="site-band__tables">
      <TableScroll label={tokensCaption}>
        <table>
          <caption>{tokensCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{t('colToken')}</th>
```

3. Replace

```tsx
            ))}
          </tbody>
        </table>
      </div>
      <div className="site-props">
        <table>
          <caption>{lang === 'es' ? `Contraste, esquema ${schemeName} (WCAG 2.2)` : `Contrast, ${schemeName} scheme (WCAG 2.2)`}</caption>
          <thead>
            <tr>
              <th scope="col">{t('colPair')}</th>
```

with

```tsx
            ))}
          </tbody>
        </table>
      </TableScroll>
      <TableScroll label={contrastCaption}>
        <table>
          <caption>{contrastCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{t('colPair')}</th>
```

4. Replace

```tsx
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

with

```tsx
            })}
          </tbody>
        </table>
      </TableScroll>
    </div>
  );
}
```

In `src/site/pages/Agents.tsx`:

1. Replace

```tsx
import { COMPONENTS } from '../../docs/meta';
import { GLOBAL_RULES, THEME_GUIDE, pageUrl } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';

const SKILL_CODE = `# Claude Code (or any agent that reads skills)
mkdir -p ~/.claude/skills
```

with

```tsx
import { COMPONENTS } from '../../docs/meta';
import { GLOBAL_RULES, THEME_GUIDE, pageUrl } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { TableScroll } from '../docs/TableScroll';

const SKILL_CODE = `# Claude Code (or any agent that reads skills)
mkdir -p ~/.claude/skills
```

2. Replace

```tsx
        <h2 className="site-h2" id="choose">
          Choosing a theme
        </h2>
        <div className="site-props">
          <table>
            <caption>Which theme fits which product</caption>
            <thead>
```

with

```tsx
        <h2 className="site-h2" id="choose">
          Choosing a theme
        </h2>
        <TableScroll label={'Which theme fits which product'}>
          <table>
            <caption>Which theme fits which product</caption>
            <thead>
```

3. Replace

```tsx
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
```

with

```tsx
              ))}
            </tbody>
          </table>
        </TableScroll>
      </section>
    </div>
  );
```

In `src/site/pages/Credits.tsx`:

1. Replace

```tsx
import type { Reference } from '../../study/types';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';
import { FONT_LICENSE_URLS, fontCredits, specimenUrl } from '../study/credits';
import { CATALOG } from '../study/data';
import { loadThemeData } from '../study/detail';
```

with

```tsx
import type { Reference } from '../../study/types';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';
import { TableScroll } from '../docs/TableScroll';
import { FONT_LICENSE_URLS, fontCredits, specimenUrl } from '../study/credits';
import { CATALOG } from '../study/data';
import { loadThemeData } from '../study/detail';
```

2. Replace

```tsx
    );
  }
  return (
    <div className="site-props">
      <table aria-labelledby="credits-photographs">
        <thead>
          <tr>
```

with

```tsx
    );
  }
  return (
    <TableScroll label={t('photographsHeading')}>
      <table aria-labelledby="credits-photographs">
        <thead>
          <tr>
```

3. Replace

```tsx
          )}
        </tbody>
      </table>
    </div>
  );
}
```

with

```tsx
          )}
        </tbody>
      </table>
    </TableScroll>
  );
}
```

4. Replace

```tsx
        <h2 className="site-h2" id="credits-fonts">
          {t('fontsHeading')}
        </h2>
        <div className="site-props">
          <table aria-labelledby="credits-fonts">
            <thead>
              <tr>
```

with

```tsx
        <h2 className="site-h2" id="credits-fonts">
          {t('fontsHeading')}
        </h2>
        <TableScroll label={t('fontsHeading')}>
          <table aria-labelledby="credits-fonts">
            <thead>
              <tr>
```

5. Replace

```tsx
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
```

with

```tsx
              ))}
            </tbody>
          </table>
        </TableScroll>
      </section>
    </div>
  );
```

In `src/site/pages/Method.tsx`:

1. Replace

```tsx
import { FAMILIES } from '../../study/families';
import type { ParamSpec } from '../../study/families/types';
import { PAIR_TEXT, useLang, useT } from '../i18n';
import { Essay } from '../study/Essay';

const UNITS: Partial<Record<ParamSpec['type'], string>> = { length: ' px', angle: '°' };
```

with

```tsx
import { FAMILIES } from '../../study/families';
import type { ParamSpec } from '../../study/families/types';
import { PAIR_TEXT, useLang, useT } from '../i18n';
import { TableScroll } from '../docs/TableScroll';
import { Essay } from '../study/Essay';

const UNITS: Partial<Record<ParamSpec['type'], string>> = { length: ' px', angle: '°' };
```

2. Replace

```tsx
                </span>
              ))}
            </p>
            <div className="site-props">
              <table aria-labelledby={`family-${family.name}`}>
                <thead>
                  <tr>
```

with

```tsx
                </span>
              ))}
            </p>
            <TableScroll label={`${t('familiesHeading')}: ${family.name}`}>
              <table aria-labelledby={`family-${family.name}`}>
                <thead>
                  <tr>
```

3. Replace

```tsx
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>
```

with

```tsx
                  ))}
                </tbody>
              </table>
            </TableScroll>
          </article>
        ))}
      </section>
```

4. Replace

```tsx
          {t('contractHeading')}
        </h2>
        <p className="site-p">{t('contractLead')}</p>
        <div className="site-props">
          <table aria-labelledby="method-contract">
            <thead>
              <tr>
```

with

```tsx
          {t('contractHeading')}
        </h2>
        <p className="site-p">{t('contractLead')}</p>
        <TableScroll label={t('contractHeading')}>
          <table aria-labelledby="method-contract">
            <thead>
              <tr>
```

5. Replace

```tsx
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
```

with

```tsx
              ))}
            </tbody>
          </table>
        </TableScroll>
      </section>
    </div>
  );
```

In `src/site/pages/Start.tsx`:

1. Replace

```tsx
import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { CodeBlock } from '../docs/CodeBlock';
import { BYO_THEME_CODE, FONTS_NOTE, INSTALL_CODE, REPO_URL, SETUP_CODE } from '../../docs/guide';

const MODE_CODE = `<NeoProvider theme="tech">              {/* tech is dark by nature */}
```

with

```tsx
import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { CodeBlock } from '../docs/CodeBlock';
import { TableScroll } from '../docs/TableScroll';
import { BYO_THEME_CODE, FONTS_NOTE, INSTALL_CODE, REPO_URL, SETUP_CODE } from '../../docs/guide';

const MODE_CODE = `<NeoProvider theme="tech">              {/* tech is dark by nature */}
```

2. Replace

```tsx
          Fonts
        </h2>
        <p className="site-p">{FONTS_NOTE}</p>
        <div className="site-props">
          <table>
            <caption>Font families per theme</caption>
            <thead>
```

with

```tsx
          Fonts
        </h2>
        <p className="site-p">{FONTS_NOTE}</p>
        <TableScroll label={'Font families per theme'}>
          <table>
            <caption>Font families per theme</caption>
            <thead>
```

3. Replace

```tsx
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="customize">
```

with

```tsx
              ))}
            </tbody>
          </table>
        </TableScroll>
      </section>

      <section aria-labelledby="customize">
```

In `src/site/site.css`:

1. Replace

```css

.site {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-block-size: 100dvh;
}
```

with

```css

.site {
  display: grid;
  /* minmax(0, 1fr): no page's content can widen the bar or the footer. */
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto 1fr auto;
  min-block-size: 100dvh;
}
```

2. Replace

```css

.site-switcher {
  display: flex;
  align-items: center;
  gap: var(--nbc-space-sm);
}
.site-switcher__themes {
  display: flex;
  gap: 2px;
}
.site-swatch {
```

with

```css

.site-switcher {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--nbc-space-sm);
}
.site-switcher__themes {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
.site-swatch {
```

3. Replace

```css
}
.site-themepage__inner {
  display: grid;
  gap: var(--nbc-space-3xl);
  max-inline-size: 1180px;
  margin-inline: auto;
```

with

```css
}
.site-themepage__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--nbc-space-3xl);
  max-inline-size: 1180px;
  margin-inline: auto;
```

- [ ] **Step 4: Run the tests and the gates**

Run: `npx vitest run src/site/docs/TableScroll.test.tsx`

Expected: PASS

```text
Test Files  1 passed (1)
Tests  1 passed (1)
```

Run: `npx vitest run`

Expected: PASS

```text
Test Files  50 passed (50)
Tests  891 passed | 4 skipped (895)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

Run: `npx playwright test --reporter=line`

Expected: PASS

```text
233 passed
```

- [ ] **Step 5: Commit**

```bash
git add e2e/site.spec.ts src/site/docs/PropsTable.tsx src/site/docs/TableScroll.test.tsx src/site/docs/TableScroll.tsx src/site/docs/TokenTables.tsx src/site/pages/Agents.tsx src/site/pages/Credits.tsx src/site/pages/Method.tsx src/site/pages/Start.tsx src/site/site.css
git commit -F - <<'EOF'
fix(site): every page at 360 px in both languages; keyboard-scrollable tables

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

### Task 11: Release 1.1.0

D14: version 1.1.0, a CHANGELOG entry, a README section on the study, copy that no longer counts five themes (the tagline, the Library page, a Badge rule), the screenshot script on the new routes, and Plan 2's implementation notes in the spec. Then the contact sheets of the four study themes — light and dark, desktop and phone — are reviewed. Merging, tagging and publishing wait for the owner.

**Files:**
- Modify: `CHANGELOG.md`
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md`
- Modify: `package-lock.json`
- Modify: `package.json`
- Modify: `public/llms-full.txt` (regenerated by `npm run gen:llms`)
- Modify: `public/llms.txt` (regenerated by `npm run gen:llms`)
- Modify: `scripts/screenshots.mjs`
- Modify: `src/docs/guide.ts`
- Modify: `src/docs/meta/Badge.ts`
- Modify: `src/site/pages/Agents.tsx`
- Modify: `src/site/pages/Library.tsx`

**Interfaces:**
- Consumes: everything above.
- Produces: release 1.1.0, ready for the owner's review.

- [ ] **Step 1: Bump the version**

Run: `npm version 1.1.0 --no-git-tag-version`

Expected: prints `v1.1.0`; `package.json` and the two root entries of `package-lock.json` now read `1.1.0` (nothing else in the lockfile changes).

- [ ] **Step 2: Update the copy, the changelog, the README, the screenshot script and the spec**

In `CHANGELOG.md`, use the day of the release commit in the `## 1.1.0 — YYYY-MM-DD` heading.

Replace the whole of `CHANGELOG.md` with:

```md
# Changelog

## 1.1.0 — 2026-10-05

The library becomes a study of neobrutalism in interfaces, in Spanish and English, and its first study themes ship on the same token contract.

### Added
- Four study themes, one per scene, each read from a documented work: `nakagin` (Nakagin Capsule Tower, Tokyo), `maeusebunker` (Mäusebunker, Berlin), `sesc-pompeia` (SESC Pompéia, São Paulo) and `classifieds` (craigslist, San Francisco). Use them like the core themes: `themes/<id>.css` plus `themes/<id>.fonts.css`.
- `neobrutalistcomponents/study`: the study's theme catalog as data (`STUDY_CATALOG`, `StudyThemeId`) for theme pickers.
- `llms.txt`, `llms-full.txt` and the `neobrutalist-ui` skill list the study themes with their references.
- Docs site in Spanish and English (`#/es/…`, `#/en/…`): the study's essays, four scenes and their origins, an atlas of every theme with facets and search, a page per theme with its reference, sources, specimen and contrast tables, the method and the credits.

### Changed
- The site's Themes page became the atlas and a page per theme. Old addresses (`#/themes`, `#/components/…`) redirect.
- Study theme stylesheets load only when a page shows them; atlas cards paint from catalog data.

## 1.0.1 — 2026-10-05

### Fixed
- Production CSS lost every token color: Vite's minifier lowered `light-dark()` into variables that the token-driven `color-scheme` never switched on, so borders, shadows and backgrounds vanished in `dist/styles.css` and on the docs site. CSS is now built for browsers with native `light-dark()` (Chrome/Edge 123, Firefox 128, Safari 17.5); `check-package` and the E2E suite guard against it.

## 1.0.0 — 2026-10-02

A rebuild for 2026. See [MIGRATION.md](./MIGRATION.md).

### Added
- 13 components: Textarea, Select, Checkbox, RadioGroup + Radio, Switch, Badge, Alert, Progress, Table, Kbd, Tabs, Dialog, Tooltip.
- New theme: **riso** (two-ink risograph zine).
- Light and dark for every theme via `light-dark()`; `NeoProvider mode` (`light` | `dark` | `system`).
- `Button asChild`, automatic icon-only buttons.
- Token contract with enforced WCAG AA contrast in both schemes.
- `themes/<name>.fonts.css` one-line font loaders.
- `llms.txt`, `llms-full.txt` and a Claude Code skill (`skills/neobrutalist-ui`).
- Docs site rebuilt: live examples with their exact source, token explorer, full-screen blocks.

### Changed
- CSS architecture: cascade layers (`nbc.tokens < nbc.theme < nbc.base < nbc.components < nbc.flourish`) and donut-`@scope`d theme flourishes.
- Themes refreshed: classic (concrete + cobalt), tech (light "green-bar paper"), swiss, y2k (Frutiger-Aero body font).
- Unified field API (`label`, `description`, `error`).
- Button defaults to `type="button"`.
- `useTheme()` returns `{ theme, mode }`.
- ESM only; Vite 8, TypeScript 6, React 19.3; bundle marked `'use client'`.

## 0.2.1
- Patch release. See git history.
```

In `README.md`:

1. Replace

````md
# neobrutalistcomponents

**Components that hold their shape.** Sixteen brutalist React components on one token contract. Five themes, light and dark, and the same geometry in every one — documented for people and for the agents that build with them.

```bash
npm install neobrutalistcomponents
````

with

````md
# neobrutalistcomponents

**Components that hold their shape.** Sixteen brutalist React components on one token contract. Five core themes plus the themes of a study of neobrutalism, light and dark, and the same geometry in every one — documented for people and for the agents that build with them.

```bash
npm install neobrutalistcomponents
````

2. Replace

```md
| Display | `Card`, `Badge`, `Alert`, `Progress`, `Table`, `Kbd` |
| Overlays | `Tabs`, `Dialog`, `Tooltip` |

## Themes

| Theme | Voice | Native scheme | Fonts |
| --- | --- | --- | --- |
```

with

```md
| Display | `Card`, `Badge`, `Alert`, `Progress`, `Table`, `Kbd` |
| Overlays | `Tabs`, `Dialog`, `Tooltip` |

## Core themes

| Theme | Voice | Native scheme | Fonts |
| --- | --- | --- | --- |
```

3. Replace

```md

Every theme ships a full light **and** dark scheme. Leave `mode` unset for the native one, or pass `light`, `dark` or `system`. Providers nest — an inner provider is a self-contained island.

## Why it stays deterministic

- **One token contract.** Every visual decision is a `--nbc-*` custom property; every built-in theme defines all of them, in both schemes, and a test enforces WCAG AA contrast for every text/background pair.
```

with

````md

Every theme ships a full light **and** dark scheme. Leave `mode` unset for the native one, or pass `light`, `dark` or `system`. Providers nest — an inner provider is a self-contained island.

## The study

The site is also a study of neobrutalism in interfaces, in Spanish and English: [the study](https://sssamuelll.github.io/neobrutalistcomponents/#/en/) follows the style from *béton brut* to today's product design through four scenes — Japan, Germany, the United States and Latin America — and their origins. Each study theme reads one documented work, and its page cites the sources.

| Theme | Reads | Scene | Native scheme |
| --- | --- | --- | --- |
| `nakagin` | Nakagin Capsule Tower, Kisho Kurokawa, Tokyo, 1970–1972 | Japan | light |
| `maeusebunker` | Mäusebunker, Gerd and Magdalena Hänska with Kurt Schmersow, Berlin, 1971–1982 | Germany | dark |
| `sesc-pompeia` | SESC Pompéia, Lina Bo Bardi with André Vainer and Marcelo Carvalho Ferraz, São Paulo, 1977–1986 | Latin America | light |
| `classifieds` | craigslist, Craig Newmark, San Francisco, 1995 | United States | light |

Study themes are used exactly like the core ones:

```tsx
import 'neobrutalistcomponents/themes/nakagin.css';
import 'neobrutalistcomponents/themes/nakagin.fonts.css'; // optional: loads the theme's fonts

<NeoProvider theme="nakagin">{/* your app */}</NeoProvider>
```

Their catalog also ships as data for theme pickers: `import { STUDY_CATALOG } from 'neobrutalistcomponents/study'`.

## Why it stays deterministic

- **One token contract.** Every visual decision is a `--nbc-*` custom property; every built-in theme defines all of them, in both schemes, and a test enforces WCAG AA contrast for every text/background pair.
````

Append to the end of `docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md`:

```md

Plan 2 of 2 (`docs/superpowers/plans/2026-10-05-neobrutalism-study-site.md`).

- **Markdown is rendered by `marked`** (a devDependency, used only by `vite-plugin-essays.ts`), wrapped to refuse raw HTML and `#` headings, keep only https links (opened in a new tab) and turn `[n]` into citation spans outside tags. A first hand-written renderer paired the asterisk of "Grade II\*" with the next emphasis and cut URLs at their first parenthesis.
- **Scene introductions run three or four short sections** rather than D9's minimum of two paragraphs: the research dossier had enough verified material. Each scene's full essay still arrives with its own sub-project.
- **Routes**: a `#/<lang>/scenes` index page gives the top bar's "Scenes" a destination (the D10 table has none); Origins has its own route and shares the scene page. Unprefixed addresses redirect by replacing the hash, with no history entry; `replaceHash` notifies synchronously, so the atlas search never loses a keystroke.
- **One `useLazy` hook loads a theme's data and the essays**: a chunk that fails shows an error message instead of loading forever.
- **Atlas cards and the study home's mosaic paint from catalog vars.** `--nbc-display-stretch` is not a preview token, so tile names do not use it.
- **Core theme pages keep a one-line note** that the theme predates the study, besides the ficha's own first sentence.
- **Font licences for Credits**: the ten families of the core themes are recorded in `CORE_FONT_LICENSES`; all eighteen families are OFL-1.1, checked against the google/fonts repository (`ofl/<family>`).
- **The skill's study table is generated** between `<!-- study-themes:start -->` and `<!-- study-themes:end -->`; CI's drift check now covers `SKILL.md`, and `pregen:llms` runs `gen:study` first.
- **Config files import local modules with a `.ts` extension** (`allowImportingTsExtensions` in `tsconfig.node.json`): Vite 8 warns about extensionless imports for its future native config loader.
- **Phones**: on 1.0.1 the theme switcher already widened a 360 px page to 368 px; with five nav items, the language link and "More themes" it reached 451 px. The site grid's column is now `minmax(0, 1fr)`, the switcher wraps, and every main page is tested at 360 px in both languages.
- **The tagline stops counting themes** ("Core and study themes"), so it stays true as scenes add themes.
- **Package**: `npm pack` lists 72 files, 107.3 kB packed and 439.4 kB unpacked (1.0.1: 104.9 kB and 433.7 kB); the nine theme stylesheets and `dist/study.js` ship, and still no `src/study` path.
- **A theme page's name spans the full width**, above the facts and the image: the first contact sheets showed "Mäusebunker" breaking mid-word in the left column at 1440 px. A test keeps a long one-word name on one line.
- **Tables that scroll sideways are focusable regions** (`TableScroll`: `role="region"`, a label, `tabIndex={0}`). axe at 360 px caught the Method tables (`scrollable-region-focusable`); the older docs tables (props, Start, Agents) got the same wrapper.
```

In `scripts/screenshots.mjs`:

1. Replace

```js
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
```

with

```js
// Local visual review: screenshots of docs routes × themes × schemes.
//
//   npm run dev &                      (or npm run preview after a site build)
//   node scripts/screenshots.mjs [--base=http://localhost:5173/] [--routes=/en/,/en/blocks]
//                                [--themes=classic,tech] [--modes=native,dark] [--width=1440] [--full]
//                                [--selector='.site-band']   (shoot the first matching element only)
//
// Writes .screenshots/<route>__<theme>__<mode>__<width>.png (git-ignored).
// Contact sheet of a study theme: --routes=/en/theme/<id> --themes=classic --modes=light,dark --full,
// once at the default width and once with --width=360.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
```

2. Replace

```js
  return hit ? hit.slice(name.length + 3) : fallback;
};
const base = arg('base', 'http://localhost:5173/');
const routes = arg('routes', '/,/components/button,/components/input,/themes,/blocks').split(',');
const themes = arg('themes', 'classic,tech,swiss,y2k,riso').split(',');
const modes = arg('modes', 'native,dark').split(',');
const width = Number(arg('width', '1440'));
```

with

```js
  return hit ? hit.slice(name.length + 3) : fallback;
};
const base = arg('base', 'http://localhost:5173/');
const routes = arg('routes', '/en/,/en/atlas,/en/theme/nakagin,/en/components/button,/en/blocks').split(',');
const themes = arg('themes', 'classic,tech,swiss,y2k,riso').split(',');
const modes = arg('modes', 'native,dark').split(',');
const width = Number(arg('width', '1440'));
```

3. Replace

```js
      const query = mode === 'native' ? `?theme=${theme}` : `?theme=${theme}&mode=${mode}`;
      await page.goto(`${base}${query}#${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => globalThis.document.fonts.ready);
      const name = `${route.replace(/\//g, '_') || '_'}__${theme}__${mode}`.replace(/^_+/, '') || 'home';
      if (selector) await page.locator(selector).first().screenshot({ path: `.screenshots/${name}.png` });
      else await page.screenshot({ path: `.screenshots/${name}.png`, fullPage });
      console.log(`shot ${name}`);
```

with

```js
      const query = mode === 'native' ? `?theme=${theme}` : `?theme=${theme}&mode=${mode}`;
      await page.goto(`${base}${query}#${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => globalThis.document.fonts.ready);
      const name = `${route.replace(/\//g, '_')}__${theme}__${mode}__${width}`.replace(/^_+/, '');
      if (selector) await page.locator(selector).first().screenshot({ path: `.screenshots/${name}.png` });
      else await page.screenshot({ path: `.screenshots/${name}.png`, fullPage });
      console.log(`shot ${name}`);
```

In `src/docs/guide.ts`:

Replace

```ts
/** A page of the site, in English: the language of the generated agent docs. */
export const pageUrl = (path: string): string => `${SITE_URL}/#/en${path}`;

export const TAGLINE = 'Brutalist React components. Five themes, light and dark, one token contract.';

export const INSTALL_CODE = 'npm install neobrutalistcomponents';
```

with

```ts
/** A page of the site, in English: the language of the generated agent docs. */
export const pageUrl = (path: string): string => `${SITE_URL}/#/en${path}`;

export const TAGLINE = 'Brutalist React components. Core and study themes, light and dark, one token contract.';

export const INSTALL_CODE = 'npm install neobrutalistcomponents';
```

In `src/docs/meta/Badge.ts`:

Replace

```ts
    'Color is never the only carrier — the label says "Failed", not just red. Keep the word, even next to an icon.',
    'Icons inside a badge are sized to 1em; mark decorative ones aria-hidden="true".',
    'A badge whose text changes while the page is open (a deploy going from Building to Live) is not announced; add role="status" if the change matters.',
    'Text on every filled variant uses the matching -fg token, which meets WCAG AA in all five themes and both color modes.',
  ],
  rules: [
    'One or two words, never a sentence. If it needs a full line, it is not a badge.',
```

with

```ts
    'Color is never the only carrier — the label says "Failed", not just red. Keep the word, even next to an icon.',
    'Icons inside a badge are sized to 1em; mark decorative ones aria-hidden="true".',
    'A badge whose text changes while the page is open (a deploy going from Building to Live) is not announced; add role="status" if the change matters.',
    'Text on every filled variant uses the matching -fg token, which meets WCAG AA in every theme and both color modes.',
  ],
  rules: [
    'One or two words, never a sentence. If it needs a full line, it is not a badge.',
```

In `src/site/pages/Agents.tsx`:

1. Replace

```tsx
import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { COMPONENTS } from '../../docs/meta';
import { GLOBAL_RULES, THEME_GUIDE, pageUrl } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { TableScroll } from '../docs/TableScroll';
```

with

```tsx
import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { COMPONENTS } from '../../docs/meta';
import { GLOBAL_RULES, TAGLINE, THEME_GUIDE, pageUrl } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { TableScroll } from '../docs/TableScroll';
```

2. Replace

```tsx
  const sample = [
    '# neobrutalistcomponents',
    '',
    '> Brutalist React components. Five themes, light and dark, one token contract.',
    '',
    '## Forms',
    '',
```

with

```tsx
  const sample = [
    '# neobrutalistcomponents',
    '',
    `> ${TAGLINE}`,
    '',
    '## Forms',
    '',
```

In `src/site/pages/Library.tsx`:

1. Replace

```tsx
import { Badge, Button, Card, Input, NeoProvider, Progress, Select, Switch, NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { ArrowRight, GitBranch } from 'lucide-react';
import { COMPONENTS } from '../../docs/meta';
import { INSTALL_CODE, pageUrl } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { useSitePrefsContext } from '../prefsContext';
import { useLang } from '../i18n';
```

with

```tsx
import { Badge, Button, Card, Input, NeoProvider, Progress, Select, Switch, NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { ArrowRight, GitBranch } from 'lucide-react';
import { COMPONENTS } from '../../docs/meta';
import { INSTALL_CODE, TAGLINE, pageUrl } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { useSitePrefsContext } from '../prefsContext';
import { useLang } from '../i18n';
```

2. Replace

```tsx
  const llms = [
    '# neobrutalistcomponents',
    '',
    '> Brutalist React components. Five themes, light and dark, one token contract.',
    '',
    '## Forms',
    ...COMPONENTS.filter((c) => c.group === 'Forms')
```

with

```tsx
  const llms = [
    '# neobrutalistcomponents',
    '',
    `> ${TAGLINE}`,
    '',
    '## Forms',
    ...COMPONENTS.filter((c) => c.group === 'Forms')
```

3. Replace

```tsx
            Components that hold their shape.
          </h1>
          <p className="site-lead">
            Sixteen React components on one token contract. Five themes, light and dark, and the same geometry in every
            one — documented for the people and the agents who build with them.
          </p>
          <CodeBlock code={INSTALL_CODE} label="Shell" />
          <div className="home-hero__ctas">
```

with

```tsx
            Components that hold their shape.
          </h1>
          <p className="site-lead">
            Sixteen React components on one token contract. Five core themes plus the study’s, light and dark, and the
            same geometry in every one — documented for the people and the agents who build with them.
          </p>
          <CodeBlock code={INSTALL_CODE} label="Shell" />
          <div className="home-hero__ctas">
```

4. Replace

```tsx
      <section className="home-section" aria-labelledby="home-themes-title">
        <div className="home-section__intro">
          <h2 className="site-h2" id="home-themes-title">
            Five themes. Pick one and stop deciding.
          </h2>
          <p className="site-p">
            Each theme is a complete point of view — type, color, edges, shadows, motion — in a light and a dark scheme.
            Click one: this whole site switches.
          </p>
        </div>
        <ThemeStrip />
```

with

```tsx
      <section className="home-section" aria-labelledby="home-themes-title">
        <div className="home-section__intro">
          <h2 className="site-h2" id="home-themes-title">
            Five core themes. Pick one and stop deciding.
          </h2>
          <p className="site-p">
            Each theme is a complete point of view — type, color, edges, shadows, motion — in a light and a dark scheme.
            Click one: this whole site switches. The study’s themes, each read from a documented work, are in{' '}
            <a href={toHash(lang, '/atlas')}>the atlas</a>.
          </p>
        </div>
        <ThemeStrip />
```

5. Replace

```tsx
            Same shape in every theme
          </h2>
          <p className="site-p">
            Controls share one height scale — 32, 40 and 48 pixels — in all five themes. Swapping themes never moves
            your layout; only the voice changes.
          </p>
        </div>
```

with

```tsx
            Same shape in every theme
          </h2>
          <p className="site-p">
            Controls share one height scale — 32, 40 and 48 pixels — in every theme. Swapping themes never moves
            your layout; only the voice changes.
          </p>
        </div>
```

- [ ] **Step 3: Regenerate the agent docs**

Run: `npm run gen:llms`

Expected: exit code 0, and:

```text
gen-llms: 16 components, 4 study themes → public/llms.txt, public/llms-full.txt, SKILL.md
```

- [ ] **Step 4: Run the tests and the gates**

Run: `npx vitest run`

Expected: PASS

```text
Test Files  50 passed (50)
Tests  891 passed | 4 skipped (895)
```

Run: `npm run typecheck`

Expected: exit code 0, no errors.

Run: `npm run lint`

Expected: exit code 0, no errors.

Run: `npm run check`

Expected: exit code 0 — lint, typecheck, unit tests, library and site builds, package check.

Run: `npx playwright test --reporter=line`

Expected: PASS

```text
233 passed
```

- [ ] **Step 5: Review the contact sheets**

Serve a production build, then shoot the four study theme pages in light and dark, at desktop and phone width:

```bash
npm run build:site
./node_modules/.bin/vite preview --config vite.site.config.ts --port 4173 --strictPort &
PREVIEW=$!
until curl -s -o /dev/null http://localhost:4173/; do sleep 1; done
node scripts/screenshots.mjs --base=http://localhost:4173/ --routes=/en/theme/nakagin,/en/theme/maeusebunker,/en/theme/sesc-pompeia,/en/theme/classifieds --themes=classic --modes=light,dark --full
node scripts/screenshots.mjs --base=http://localhost:4173/ --routes=/en/theme/nakagin,/en/theme/maeusebunker,/en/theme/sesc-pompeia,/en/theme/classifieds --themes=classic --modes=light,dark --full --width=360
kill $PREVIEW
```

Expected: 16 files in `.screenshots/` named `en_theme_<id>__classic__<light|dark>__<1440|360>.png`, and no "console errors" line. Open every one and check: the page renders in the theme's own type and colours in both schemes; the theme's name sits on one line across the top; the facts and the image share a row on desktop and stack on the phone; nothing runs off the right edge; the tables scroll inside their frames. Anything wrong goes back to the task that owns it, with a failing test first.

- [ ] **Step 6: Measure the package**

Run: `npm pack --dry-run 2>&1 | grep -cE "dist/themes/[a-z0-9-]+\.css"`

Expected: `9` (five core themes and four study themes).

Run: `npm pack --dry-run 2>&1 | grep -E "src/study|total files|package size|unpacked size"`

Expected (no `src/study` line: no images, essays or fichas ship):

```text
npm notice package size: 107.3 kB
npm notice unpacked size: 439.4 kB
npm notice total files: 72
```

- [ ] **Step 7: Commit**

```bash
git add CHANGELOG.md README.md docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md package-lock.json package.json public/llms-full.txt public/llms.txt scripts/screenshots.mjs src/docs/guide.ts src/docs/meta/Badge.ts src/site/pages/Agents.tsx src/site/pages/Library.tsx
git commit -F - <<'EOF'
chore(release): 1.1.0

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
EOF
```


---

## After Task 11

- The branch now holds the whole sub-project: `npm run check` and the full e2e suite pass, and the contact sheets have been reviewed.
- Then use superpowers:finishing-a-development-branch. Opening a pull request, merging, pushing the `v1.1.0` tag (which publishes to npm) and deploying all wait for the owner's word. The site deploys from `main`, as before.
