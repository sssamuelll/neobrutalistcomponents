# Lettering and Motion: Phase 1 (the engine) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A study theme can document its lettering and its motion in the ficha, the engine validates both, a themed `.motion.css` is linted and compiled, and the theme page shows them. No existing theme changes visually.

**Architecture:** `Ficha` gains optional `lettering` and `motion` blocks; `themeProblems` requires `lettering` of every theme except those still listed in `LETTERING_PENDING` (the 16 current themes, removed from the list as phase 2 retrofits them). `StudyType` gains three optional typography fields compiled to tokens with defaults equal to today's behaviour. A theme may declare `motionFile`; a new `lintMotion` holds it to the spec's rules and the compiler hoists and namespaces its keyframes like a signature's. The theme page renders two new sections.

**Tech Stack:** TypeScript, Vitest + Testing Library, Vite (`import.meta.glob`), React 19, Playwright (e2e unchanged here).

**Spec:** `docs/superpowers/specs/2026-10-09-lettering-and-motion-design.md`

## Global Constraints

- "if the work did not move, the theme does not move": `ficha.motion` and `motionFile` exist together or not at all.
- Motion CSS: "at most 40 lines"; animated properties limited to `transform`, `opacity`, `clip-path`, `background-position`, `outline`; "every `@keyframes` and every `animation` inside `@media (prefers-reduced-motion: no-preference)`"; colours only from tokens.
- The signature's 60-line cap is untouched.
- Control geometry (`font-size`, `line-height`) stays invariant.
- `lettering.documented` joins `documented` and `reading` in the marker check (markers resolve into `reference.sources`, es and en markers match, every source is cited somewhere in the ficha).
- A theme without `lettering` does not compile, except ids in `LETTERING_PENDING`.
- Core fichas (`CoreFicha`) are untouched: they predate the study.
- Fonts registry rules stand (OFL-1.1 or Apache-2.0). Phase 1 adds no font.
- Every new user-facing string exists in `es` and `en`.
- Venezuelan Spanish (tú, never vos) in all `es` strings.
- Commits end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Rulings taken while planning (deviations from the spec's wording)

1. **`LETTERING_PENDING` allowlist.** The spec says the 16 themes "get a provisional `lettering` so they compile". A provisional entry would be a claim without research, which §1.1 forbids. Instead the validator exempts a closed list of ids, fails if a listed theme already has lettering (so the list shrinks as phase 2 lands), and a test pins that the list holds only registered, lettering-less themes. New themes can never be in it. Cost if wrong: phase 2 must remove ids by hand (the validator tells it which).
2. **`lettering` and `motion` are optional on the `Ficha` type**, required by the validator. A required type field cannot coexist with the pending list. Core fichas stay valid unchanged.
3. **`original.free?: true`.** Some works set their text in a free face (Material Design: Roboto, Apache-2.0). The rule "the substitute must differ from the original" is waived when `free` is set; the substitute text must still name the face. Cost if wrong: a theme could claim `free` falsely; the sources are the check.
4. **"The fonts the theme declares must appear in `substitute`"** applies to `fonts.sans` and `fonts.display`, not `fonts.mono` (mono is often incidental). System-font themes (`'system-sans'`, `'system-serif'`) have no face to name and skip the check.
5. **`kerning` accepts `auto | normal | none`**, default `auto`, so today's rendering is unchanged.
6. **Motion keyframes stay top level**, as the compiler already hoists and namespaces them; only the `animation*` declarations must sit inside the `no-preference` media block.

## Review Focus

1. A motion file with an `animation` outside the guard, or inside `@media (prefers-reduced-motion: reduce)` (a guard that looks right and is the opposite): must fail. Pinned in Task 3.
2. `ficha.motion` without a file, a file without `ficha.motion`, and a file that animates nothing: all fail. Pinned in Tasks 1 and 4.
3. A theme that is in `LETTERING_PENDING` and already has lettering, or a pending id that is not registered: fails. Pinned in Tasks 1 and 6.
4. A marker used only in `lettering` or `motion` text must count as citing its source; a marker with no source there must fail. Pinned in Task 1.
5. `transition` in a motion file naming a property outside the allowed five (`width`, `all`): must fail, not only `@keyframes`. Pinned in Task 3.

---

## File structure

| File | Responsibility |
|---|---|
| `src/study/types.ts` | `Lettering`, `MotionFicha`, `LETTERING_KINDS`, `Ficha` extras, `StudyType` extras, `StudyThemeInput.motionFile` |
| `src/study/validate.ts` | lettering/motion prose checks, pending list, coupling, typography value checks |
| `src/study/css.ts` | `animationUses` (animation declarations and whether guarded) |
| `src/study/lint.ts` | `lintMotion`, `animates`, `MOTION_MAX_LINES` |
| `src/study/registry.ts` | `motionCss` on `RegisteredTheme`, declared-file bookkeeping, problems |
| `src/study/compile.ts` | three new tokens, `motionCss` option, motion part |
| `src/lib/tokens.css`, `src/lib/base.css` | defaults and consumption of the new tokens |
| `scripts/build-study.mjs`, `src/study/study.test.ts` | pass `motionCss` to the compiler |
| `src/site/study/FichaExtras.tsx` (+ test) | the «Tipografía» and «Movimiento» sections |
| `src/site/pages/ThemePage.tsx`, `src/site/i18n.ts`, `src/site/site.css` | mount the sections, strings, styles |
| `src/study/lettering.test.ts`, `src/study/motion.test.ts` | new unit tests |

---

### Task 1: Lettering and motion in the ficha, and their validation

**Files:**
- Modify: `src/study/types.ts`
- Modify: `src/study/validate.ts`
- Modify: `src/study/__fixtures__/fixture.ts`
- Create: `src/study/lettering.test.ts`

**Interfaces:**
- Consumes: `FONTS` (`./fonts`), `l10nProblems`, `markers`, `fichaProblems` (existing in `validate.ts`).
- Produces: types `Lettering`, `LetteringKind`, `MotionFicha`; `LETTERING_KINDS`; `Ficha.lettering?`, `Ficha.motion?`; `StudyThemeInput.motionFile?: string`; `LETTERING_PENDING: readonly string[]` exported from `validate.ts`. `themeProblems` enforces all the rules below.

- [ ] **Step 1: Write the failing tests**

Create `src/study/lettering.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { FIXTURE } from './__fixtures__/fixture';
import { LETTERING_PENDING, themeProblems } from './validate';
import type { Ficha, StudyThemeInput } from './types';

const problems = (patch: Partial<StudyThemeInput>) => themeProblems({ ...FIXTURE, ...patch }).join('\n');
const withLettering = (patch: Partial<NonNullable<Ficha['lettering']>>): Partial<StudyThemeInput> => ({
  ficha: { ...FIXTURE.ficha, lettering: { ...FIXTURE.ficha.lettering!, ...patch } },
});
const withoutLettering = (id: string): StudyThemeInput => {
  const { lettering: _lettering, ...ficha } = FIXTURE.ficha;
  return { ...FIXTURE, id, ficha };
};

describe('lettering in the ficha', () => {
  it('the fixture, with lettering, is valid', () => {
    expect(themeProblems(FIXTURE)).toEqual([]);
  });

  it('a theme without lettering fails, unless its id is pending', () => {
    expect(themeProblems(withoutLettering('fixture')).join('\n')).toMatch(/fixture\.ficha\.lettering: missing/);
    expect(LETTERING_PENDING).toContain('win95');
    expect(themeProblems(withoutLettering('win95'))).toEqual([]);
  });

  it('a pending theme that already has lettering must leave the list', () => {
    expect(themeProblems({ ...FIXTURE, id: 'win95' }).join('\n')).toMatch(/win95: has lettering — remove it from LETTERING_PENDING/);
  });

  it.each([
    [{ documented: { es: '', en: 'Set in a grotesque [1].' } }, /lettering\.documented\.es: empty/],
    [{ substitute: { es: 'Barlow.', en: '' } }, /lettering\.substitute\.en: empty/],
    [{ original: { name: '', kind: 'outline' as const } }, /original\.name: empty/],
    [{ original: { name: 'X', kind: 'cursive' as never } }, /original\.kind: unknown "cursive"/],
    [{ original: { name: 'X', kind: 'bitmap' as const, year: 1066.5 } }, /original\.year: 1066\.5 is not a year/],
  ])('rejects %o', (patch, message) => {
    expect(problems(withLettering(patch))).toMatch(message);
  });

  it('the markers in lettering text must resolve into the sources', () => {
    expect(
      problems(withLettering({ documented: { es: 'Rotulada [3].', en: 'Set [3].' } })),
    ).toMatch(/marker \[3\] has no source/);
  });

  it('a source cited only by lettering or motion text counts as cited', () => {
    const ficha: Ficha = {
      ...FIXTURE.ficha,
      documented: { es: 'Un hecho [1].', en: 'A fact [1].' },
      lettering: { ...FIXTURE.ficha.lettering!, documented: { es: 'Rotulada [2].', en: 'Set [2].' } },
    };
    expect(themeProblems({ ...FIXTURE, ficha })).toEqual([]);
    const uncited: Ficha = { ...ficha, lettering: { ...ficha.lettering!, documented: { es: 'Rotulada.', en: 'Set.' } } };
    expect(problems({ ficha: uncited })).toMatch(/source \[2\] is never cited/);
  });

  it('the substitute must name the face the theme loads (sans and display)', () => {
    expect(problems(withLettering({ substitute: { es: 'Una fuente libre.', en: 'A free font.' } }))).toMatch(
      /substitute\.es: does not name Barlow/,
    );
    expect(problems({ fonts: { sans: 'barlow', display: 'dela-gothic-one' } })).toMatch(/does not name Dela Gothic One/);
  });

  it('system-font themes have no face to name', () => {
    expect(themeProblems({ ...FIXTURE, fonts: 'system-sans' })).toEqual([]);
  });

  it('the substitute cannot be the original face, unless the original is free', () => {
    const same = withLettering({ original: { name: 'barlow', kind: 'outline' } });
    expect(problems(same)).toMatch(/the substitute is the original face "barlow"/);
    expect(problems(withLettering({ original: { name: 'Barlow', kind: 'outline', free: true } }))).toBe('');
  });
});

describe('motion in the ficha', () => {
  const motion = { documented: { es: 'Se mueve [1].', en: 'It moves [1].' }, reading: { es: 'Lo imita.', en: 'It imitates that.' } };

  it('ficha.motion and motionFile go together', () => {
    expect(problems({ ficha: { ...FIXTURE.ficha, motion } })).toMatch(/ficha\.motion has no motionFile/);
    expect(problems({ motionFile: './fixture.motion.css' })).toMatch(/motionFile has no ficha\.motion/);
    expect(themeProblems({ ...FIXTURE, ficha: { ...FIXTURE.ficha, motion }, motionFile: './fixture.motion.css' })).toEqual([]);
  });

  it('motion text is checked like the rest of the ficha', () => {
    const ficha = { ...FIXTURE.ficha, motion: { ...motion, reading: { es: '', en: 'x' } } };
    expect(problems({ ficha, motionFile: './fixture.motion.css' })).toMatch(/motion\.reading\.es: empty/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/study/lettering.test.ts`
Expected: FAIL (type errors surface as `LETTERING_PENDING` is not exported; every test errors).

- [ ] **Step 3: Implement the types**

In `src/study/types.ts`, after `PALETTE_ORIGINS`/`PaletteOrigin`, add:

```ts
export const LETTERING_KINDS = ['bitmap', 'outline', 'lettered', 'system'] as const;
export type LetteringKind = (typeof LETTERING_KINDS)[number];

/** What the work set its text in, and the free face the theme uses in its place. */
export interface Lettering {
  readonly original: {
    readonly name: string;
    readonly designer?: string;
    readonly year?: number;
    readonly kind: LetteringKind;
    /** The original is itself freely licensed and loaded as is (Roboto). Waives "substitute differs from original". */
    readonly free?: true;
  };
  /** What the work used; every claim carries a [n] marker into reference.sources. */
  readonly documented: L10n;
  /** The free face the theme loads and why it resembles the original; names it. */
  readonly substitute: L10n;
}

/** How the work moved, when a source documents it. Absent for static works. */
export interface MotionFicha {
  readonly documented: L10n;
  readonly reading: L10n;
}
```

Extend `Ficha` (add after `palette`):

```ts
  /** Required of study themes by the validator (see LETTERING_PENDING); optional here so core fichas stay valid. */
  readonly lettering?: Lettering;
  /** Present exactly when the theme has a motionFile. */
  readonly motion?: MotionFicha;
```

Extend `StudyThemeInput` (after `signature`):

```ts
  /** Path of the theme's motion CSS, relative to its file — './<id>.motion.css'. Goes with ficha.motion. */
  readonly motionFile?: string;
```

- [ ] **Step 4: Implement the validation**

In `src/study/validate.ts`: import `LETTERING_KINDS` and the types, then add (above `fichaProblems`):

```ts
/**
 * Themes that predate the lettering requirement. Phase 2 of the lettering and
 * motion spec removes each id as it writes that theme's lettering; the list
 * never grows, and new themes are never in it.
 */
export const LETTERING_PENDING: readonly string[] = [
  'amiga-os', 'aqua', 'bauhaus-dessau', 'carlton', 'classifieds', 'iphone-os', 'mac-os-classic', 'maeusebunker',
  'material-design', 'nakagin', 'nextstep', 'sesc-pompeia', 'whaam', 'win-xp', 'win95', 'xerox-star',
];

function letteringProblems(lettering: Lettering | undefined, where: string): string[] {
  if (!lettering) return [];
  const { original } = lettering;
  const at = `${where}.lettering`;
  const problems = [...l10nProblems(lettering.documented, `${at}.documented`), ...l10nProblems(lettering.substitute, `${at}.substitute`)];
  if (!original.name?.trim()) problems.push(`${at}.original.name: empty`);
  if (!(LETTERING_KINDS as readonly string[]).includes(original.kind)) problems.push(`${at}.original.kind: unknown "${original.kind}"`);
  if (original.year !== undefined && !(Number.isInteger(original.year) && original.year >= 1400 && original.year <= 2100)) {
    problems.push(`${at}.original.year: ${original.year} is not a year`);
  }
  return problems;
}

function motionProblems(motion: MotionFicha | undefined, where: string): string[] {
  if (!motion) return [];
  return [...l10nProblems(motion.documented, `${where}.motion.documented`), ...l10nProblems(motion.reading, `${where}.motion.reading`)];
}

/** Every prose block of a ficha, for the marker checks. */
function prose(ficha: Ficha): L10n[] {
  return [
    ficha.documented,
    ficha.reading,
    ...(ficha.lettering ? [ficha.lettering.documented, ficha.lettering.substitute] : []),
    ...(ficha.motion ? [ficha.motion.documented, ficha.motion.reading] : []),
  ];
}
```

In `fichaProblems`, add the two checks to the initial `problems` array and compute `cited` from `prose(ficha)`:

```ts
  const problems = [
    ...l10nProblems(ficha.documented, `${where}.documented`),
    ...l10nProblems(ficha.reading, `${where}.reading`),
    ...l10nProblems(ficha.palette?.note, `${where}.palette.note`),
    ...letteringProblems(ficha.lettering, where),
    ...motionProblems(ficha.motion, where),
  ];
  ...
  const cited = LANGS.map((lang) => new Set(prose(ficha).flatMap((block) => markers(block[lang]))));
```

Add the theme-level rules and call them from `themeProblems`, right after the `fichaProblems` push:

```ts
function letteringThemeProblems(theme: StudyThemeInput): string[] {
  const { id, ficha, fonts } = theme;
  const pending = LETTERING_PENDING.includes(id);
  if (!ficha.lettering) return pending ? [] : [`${id}.ficha.lettering: missing`];
  const problems = pending ? [`${id}: has lettering — remove it from LETTERING_PENDING`] : [];
  if (typeof fonts === 'string') return problems;
  const { original, substitute } = ficha.lettering;
  const families = [fonts.sans, fonts.display].filter((key): key is FontKey => key !== undefined && key in FONTS).map((key) => FONTS[key].family);
  for (const lang of LANGS) {
    for (const family of families) {
      if (!substitute[lang]?.includes(family)) problems.push(`${id}.ficha.lettering.substitute.${lang}: does not name ${family}, the face the theme loads`);
    }
  }
  if (!original.free && families.some((family) => family.toLowerCase() === original.name.trim().toLowerCase())) {
    problems.push(`${id}.ficha.lettering: the substitute is the original face "${original.name}"`);
  }
  return problems;
}
```

(import `FontKey` as a type from `./fonts`; add `Lettering`, `MotionFicha` to the types import.) In `themeProblems`:

```ts
  problems.push(...letteringThemeProblems(theme));
  if (Boolean(theme.motionFile) !== Boolean(theme.ficha.motion)) {
    problems.push(`${id}: ${theme.ficha.motion ? 'ficha.motion has no motionFile' : 'motionFile has no ficha.motion'} — they go together`);
  }
```

- [ ] **Step 5: Give the fixture lettering**

In `src/study/__fixtures__/fixture.ts`, add to `ficha` (after `palette`):

```ts
    lettering: {
      original: { name: 'Testschrift', designer: 'Nobody', year: 1971, kind: 'outline' },
      documented: { es: 'Rotulada en una grotesca [1].', en: 'Set in a grotesque [1].' },
      substitute: { es: 'Barlow se le parece en la proporción.', en: 'Barlow resembles it in proportion.' },
    },
```

- [ ] **Step 6: Run to verify it passes**

Run: `npx vitest run src/study/lettering.test.ts src/study/validate.test.ts`
Expected: PASS. Then `npx tsc -p tsconfig.json` — Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/study/types.ts src/study/validate.ts src/study/__fixtures__/fixture.ts src/study/lettering.test.ts
git commit -m "feat(study): lettering and motion blocks in the ficha, with their validation

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Typography fields compiled to tokens

**Files:**
- Modify: `src/study/types.ts` (`StudyType`)
- Modify: `src/study/validate.ts` (`valueProblems`)
- Modify: `src/study/compile.ts` (`ENGINE_DEFAULTS`, `compileTokens`)
- Modify: `src/lib/tokens.css`, `src/lib/base.css`
- Modify: `src/study/lettering.test.ts` (append)

**Interfaces:**
- Consumes: `valueProblems`, `compileTokens` (existing).
- Produces: `StudyType.featureSettings?: string`, `kerning?: 'auto' | 'normal' | 'none'`, `textRendering?: 'auto' | 'optimizeSpeed' | 'optimizeLegibility' | 'geometricPrecision'`; tokens `--nbc-font-features`, `--nbc-font-kerning`, `--nbc-text-rendering`.

- [ ] **Step 1: Write the failing tests**

Append to `src/study/lettering.test.ts`:

```ts
import { compileTokens } from './compile';

describe('typography fields', () => {
  const type = (patch: Partial<StudyThemeInput['type']>) => ({ type: { ...FIXTURE.type, ...patch } });

  it('compile to tokens, with defaults equal to today', () => {
    const base = compileTokens(FIXTURE);
    expect(base.get('--nbc-font-features')).toBe('normal');
    expect(base.get('--nbc-font-kerning')).toBe('auto');
    expect(base.get('--nbc-text-rendering')).toBe('optimizeLegibility');
    const set = compileTokens({ ...FIXTURE, ...type({ featureSettings: '"tnum", "ss01" 1', kerning: 'none', textRendering: 'optimizeSpeed' }) });
    expect(set.get('--nbc-font-features')).toBe('"tnum", "ss01" 1');
    expect(set.get('--nbc-font-kerning')).toBe('none');
    expect(set.get('--nbc-text-rendering')).toBe('optimizeSpeed');
  });

  it.each([
    [{ featureSettings: 'tnum' }, /type\.featureSettings/],
    [{ featureSettings: '"tnum"; color: red' }, /type\.featureSettings/],
    [{ kerning: 'tight' as never }, /type\.kerning/],
    [{ textRendering: 'fast' as never }, /type\.textRendering/],
  ])('rejects %o', (patch, message) => {
    expect(problems(type(patch))).toMatch(message);
  });

  it('accepts normal, tags and tags with values', () => {
    expect(themeProblems({ ...FIXTURE, ...type({ featureSettings: 'normal' }) })).toEqual([]);
    expect(themeProblems({ ...FIXTURE, ...type({ featureSettings: '"smcp", "tnum" 1' }) })).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/study/lettering.test.ts -t "typography fields"`
Expected: FAIL (`--nbc-font-features` is undefined).

- [ ] **Step 3: Implement**

`types.ts`, in `StudyType` after `displayStretch`:

```ts
  /** CSS font-feature-settings: 'normal' or tags like '"tnum", "ss01" 1'. Default 'normal'. */
  readonly featureSettings?: string;
  /** font-kerning. Bitmap faces do not kern: use 'none'. Default 'auto'. */
  readonly kerning?: 'auto' | 'normal' | 'none';
  /** text-rendering. Default 'optimizeLegibility'. */
  readonly textRendering?: 'auto' | 'optimizeSpeed' | 'optimizeLegibility' | 'geometricPrecision';
```

`validate.ts`, near `STRETCH`:

```ts
const FEATURES = /^(normal|"[A-Za-z0-9]{4}"(\s+\d+)?(\s*,\s*"[A-Za-z0-9]{4}"(\s+\d+)?)*)$/;
const KERNINGS = ['auto', 'normal', 'none'];
const RENDERINGS = ['auto', 'optimizeSpeed', 'optimizeLegibility', 'geometricPrecision'];
```

and in `valueProblems`, after the `displayStretch` check:

```ts
  if (type.featureSettings !== undefined && !FEATURES.test(type.featureSettings)) {
    problems.push(`${id}.type.featureSettings: "${type.featureSettings}" must be normal or OpenType tags in quotes, like "tnum", "ss01" 1`);
  }
  if (type.kerning !== undefined && !KERNINGS.includes(type.kerning)) {
    problems.push(`${id}.type.kerning: "${type.kerning}" must be one of ${KERNINGS.join(', ')}`);
  }
  if (type.textRendering !== undefined && !RENDERINGS.includes(type.textRendering)) {
    problems.push(`${id}.type.textRendering: "${type.textRendering}" must be one of ${RENDERINGS.join(', ')}`);
  }
```

`compile.ts`: add to `ENGINE_DEFAULTS`: `featureSettings: 'normal', kerning: 'auto', textRendering: 'optimizeLegibility',` and at the end of `compileTokens`, after `--nbc-display-stretch`:

```ts
  tokens.set('--nbc-font-features', type.featureSettings ?? ENGINE_DEFAULTS.featureSettings);
  tokens.set('--nbc-font-kerning', type.kerning ?? ENGINE_DEFAULTS.kerning);
  tokens.set('--nbc-text-rendering', type.textRendering ?? ENGINE_DEFAULTS.textRendering);
```

`src/lib/tokens.css`, after `--nbc-display-stretch: 100%;`:

```css
  --nbc-font-features: normal;
  --nbc-font-kerning: auto;
  --nbc-text-rendering: optimizeLegibility;
```

`src/lib/base.css`, in `.nbc-root`, replace `text-rendering: optimizeLegibility;` with:

```css
  font-feature-settings: var(--nbc-font-features);
  font-kerning: var(--nbc-font-kerning);
  text-rendering: var(--nbc-text-rendering);
```

(These three tokens are optional like `--nbc-display-stretch`: not in the contract list, defaulted in `tokens.css`, so the five core themes are unchanged.)

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/study src/lib/themes`
Expected: PASS (core contract tests untouched).

- [ ] **Step 5: Commit**

```bash
git add src/study/types.ts src/study/validate.ts src/study/compile.ts src/lib/tokens.css src/lib/base.css src/study/lettering.test.ts
git commit -m "feat(study): feature settings, kerning and text rendering as type fields

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: The motion lint

**Files:**
- Modify: `src/study/css.ts`
- Modify: `src/study/lint.ts`
- Create: `src/study/motion.test.ts`

**Interfaces:**
- Consumes: `topLevelBlocks`, `stripComments`, `parseDeclarations`, `keyframeRules`, `styleRules` (`css.ts`), `lintFlourishCss`, `signatureLines` (`lint.ts`).
- Produces: `animationUses(css, guarded?) → AnimationUse[]` (`{ selector, property, value, guarded }`); `lintMotion(css, where) → string[]`; `animates(css) → boolean`; `MOTION_MAX_LINES = 40`.

- [ ] **Step 1: Write the failing tests**

Create `src/study/motion.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { animates, lintMotion } from './lint';

const GOOD = `@keyframes hourglass {
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
}
@media (prefers-reduced-motion: no-preference) {
  .nbc-progress__bar { animation: hourglass 1s steps(4) infinite; }
  .nbc-button { transition: transform 80ms steps(2); }
}`;

describe('lintMotion', () => {
  it('accepts a guarded step animation', () => {
    expect(lintMotion(GOOD, 'm')).toEqual([]);
    expect(animates(GOOD)).toBe(true);
  });

  it('accepts animation: none outside the guard', () => {
    expect(lintMotion('.nbc-card { animation: none; }', 'm')).toEqual([]);
  });

  it.each([
    ['unguarded', '.nbc-card { animation: x 1s; }', /outside @media \(prefers-reduced-motion: no-preference\)/],
    ['guarded the wrong way round', '@media (prefers-reduced-motion: reduce) { .nbc-card { animation: x 1s; } }', /outside @media/],
    ['guarded by something else', '@media (min-width: 600px) { .nbc-card { animation-name: x; } }', /outside @media/],
    ['keyframes on width', '@keyframes x { to { width: 10px; } }', /@keyframes x animates width/],
    ['keyframes on a colour property', '@keyframes x { to { background-color: var(--nbc-fg); } }', /animates background-color/],
    ['transition on width', '@media (prefers-reduced-motion: no-preference) { .nbc-card { transition: width 1s; } }', /transition names width/],
    ['transition on all', '.nbc-card { transition-property: all; }', /transition names all/],
    ['a literal colour', '@keyframes x { to { outline: 2px solid #f00; } }', /literal color/],
  ])('rejects %s', (_name, css, message) => {
    expect(lintMotion(css, 'm').join('\n')).toMatch(message);
  });

  it('limits the file to 40 non-blank, non-comment lines', () => {
    const line = '.nbc-card { opacity: 1; }';
    expect(lintMotion(`${Array(40).fill(line).join('\n')}\n/* note */\n`, 'm')).toEqual([]);
    expect(lintMotion(Array(41).fill(line).join('\n'), 'm').join('\n')).toMatch(/41 lines, the limit is 40/);
  });

  it('a file with keyframes but no animation animates nothing', () => {
    expect(animates('@keyframes x { to { opacity: 0; } }')).toBe(false);
    expect(animates('.nbc-card { animation: none; }')).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/study/motion.test.ts`
Expected: FAIL (`animates` / `lintMotion` are not exported).

- [ ] **Step 3: Implement `animationUses` in `src/study/css.ts`**

Append:

```ts
const NO_PREFERENCE = /^@media\s*\(\s*prefers-reduced-motion\s*:\s*no-preference\s*\)$/;
const ANIMATION = /^animation(-[a-z-]+)?$/;

export interface AnimationUse {
  readonly selector: string;
  readonly property: string;
  readonly value: string;
  /** Inside @media (prefers-reduced-motion: no-preference). */
  readonly guarded: boolean;
}

/** Every animation declaration, descending into conditional at-rules, and whether the guard wraps it. Keyframes are skipped. */
export function animationUses(css: string, guarded = false): AnimationUse[] {
  const uses: AnimationUse[] = [];
  for (const block of topLevelBlocks(stripComments(css))) {
    if (/^@keyframes\b/.test(block.prelude)) continue;
    if (block.prelude.startsWith('@')) {
      uses.push(...animationUses(block.body, guarded || NO_PREFERENCE.test(block.prelude)));
      continue;
    }
    if (block.body.includes('{')) continue; // CSS nesting: the lint reports it
    for (const { property, value } of parseDeclarations(block.body)) {
      if (ANIMATION.test(property)) uses.push({ selector: block.prelude, property, value, guarded });
    }
  }
  return uses;
}
```

- [ ] **Step 4: Implement `lintMotion` in `src/study/lint.ts`**

Change the css import to `import { animationUses, keyframeRules, stripComments, styleRules } from './css';` and append:

```ts
export const MOTION_MAX_LINES = 40;

/** What a motion file may animate or transition. */
const ANIMATABLE = ['transform', 'opacity', 'clip-path', 'background-position', 'outline'];
const FRAME_PROPERTIES = [...ANIMATABLE, 'animation-timing-function'];
const TRANSITIONABLE = [...ANIMATABLE, 'none'];

/** `animation: none` and its longhand `animation-name: none` stop an animation; they need no guard. */
const isRealAnimation = ({ value }: { value: string }) => value.trim() !== 'none';

/** A motion file animates when it sets at least one animation other than none. */
export const animates = (css: string): boolean => animationUses(css).some(isRealAnimation);

export function lintMotion(css: string, where: string): string[] {
  const problems = lintFlourishCss(css, where);
  const lines = signatureLines(css);
  if (lines > MOTION_MAX_LINES) problems.push(`${where}: ${lines} lines, the limit is ${MOTION_MAX_LINES}`);
  for (const use of animationUses(css).filter(isRealAnimation)) {
    if (!use.guarded) {
      problems.push(`${where}: "${use.selector}" sets ${use.property} outside @media (prefers-reduced-motion: no-preference)`);
    }
  }
  for (const frame of keyframeRules(css)) {
    for (const { property } of frame.declarations) {
      if (!FRAME_PROPERTIES.includes(property)) {
        problems.push(`${where}: @keyframes ${frame.name} animates ${property} — only ${ANIMATABLE.join(', ')}`);
      }
    }
  }
  for (const rule of styleRules(css)) {
    for (const { property, value } of rule.declarations) {
      if (property !== 'transition' && property !== 'transition-property') continue;
      const names = value.split(',').map((part) => part.trim().split(/\s+/)[0]);
      for (const name of names.filter((n) => !TRANSITIONABLE.includes(n))) {
        problems.push(`${where}: "${rule.selector}" transition names ${name} — only ${ANIMATABLE.join(', ')}`);
      }
    }
  }
  return problems;
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx vitest run src/study/motion.test.ts src/study/lint.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/study/css.ts src/study/lint.ts src/study/motion.test.ts
git commit -m "feat(study): lint for a theme's motion CSS

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Motion files in the registry, the compiler and the build

**Files:**
- Modify: `src/study/registry.ts`
- Modify: `src/study/compile.ts`
- Modify: `scripts/build-study.mjs`
- Modify: `src/study/study.test.ts`
- Modify: `src/study/motion.test.ts` (append)

**Interfaces:**
- Consumes: `lintMotion`, `animates` (Task 3); `StudyThemeInput.motionFile` (Task 1).
- Produces: `RegisteredTheme.motionCss?: string`; `CompileOptions.motionCss?: string`; compiled CSS carrying the motion part labelled `motion`, keyframes namespaced `nbc-<id>-motion-<name>`.

- [ ] **Step 1: Write the failing tests**

Append to `src/study/motion.test.ts`:

```ts
import { FIXTURE } from './__fixtures__/fixture';
import { compileTheme } from './compile';
import { collectThemes, registryProblems } from './registry';

describe('compileTheme with motion CSS', () => {
  it('hoists and namespaces the keyframes and keeps the guarded rule scoped to the theme', () => {
    const { css } = compileTheme(FIXTURE, { motionCss: GOOD });
    expect(css).toContain('@keyframes nbc-fixture-motion-hourglass');
    expect(css).toMatch(/animation: nbc-fixture-motion-hourglass 1s steps\(4\) infinite/);
    expect(css).toMatch(/@scope \(\[data-theme="fixture"\]\)[\s\S]*prefers-reduced-motion: no-preference/);
  });

  it('refuses motion CSS that breaks the lint', () => {
    expect(() => compileTheme(FIXTURE, { motionCss: '.nbc-card { animation: x 1s; }' })).toThrow(/outside @media/);
  });
});

describe('registryProblems for motion files', () => {
  const motionTheme = { ...FIXTURE, motionFile: './fixture.motion.css' };
  const entry = (motionCss?: string) => [{ path: './themes/germany/fixture.ts', theme: motionTheme, motionCss }];

  it('reports a declared file that is missing, and one that animates nothing', () => {
    expect(registryProblems(entry(undefined)).join('\n')).toMatch(/fixture: motion file \.\/fixture\.motion\.css not found/);
    expect(registryProblems(entry('@keyframes x { to { opacity: 0; } }')).join('\n')).toMatch(/fixture: \.\/fixture\.motion\.css animates nothing/);
    expect(registryProblems(entry(GOOD))).toEqual([]);
  });

  it('counts a declared motion file as declared, and reports an undeclared stylesheet', () => {
    const modules = { './themes/germany/fixture.ts': { default: motionTheme } };
    const styles = { './themes/germany/fixture.motion.css': GOOD, './themes/germany/orphan.css': GOOD };
    const { themes, problems } = collectThemes(modules, styles);
    expect(themes[0].motionCss).toBe(GOOD);
    expect(problems.join('\n')).toMatch(/orphan\.css: no theme declares this file/);
    expect(problems.join('\n')).not.toMatch(/fixture\.motion\.css/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/study/motion.test.ts`
Expected: FAIL (`motionCss` option unknown; registry reports the motion file as undeclared).

- [ ] **Step 3: Implement the registry**

In `src/study/registry.ts`: import `animates` from `./lint`; add to `RegisteredTheme`:

```ts
  /** Contents of the motion file, when the theme declares one and it exists. */
  readonly motionCss?: string;
```

Replace `signaturePath` with a shared helper and add the motion one:

```ts
/** The glob key of a file a theme declares, next to the theme file. */
const siblingPath = (path: string, relative: string | undefined) =>
  relative ? `${path.slice(0, path.lastIndexOf('/'))}/${relative.replace(/^\.\//, '')}` : undefined;
const signaturePath = (path: string, theme: StudyThemeInput) => siblingPath(path, theme.signature);
const motionPath = (path: string, theme: StudyThemeInput) => siblingPath(path, theme.motionFile);
```

In `collectThemes`, build each entry with both files and extend the declared set:

```ts
    const key = signaturePath(path, theme);
    const motionKey = motionPath(path, theme);
    themes.push({ path, theme, signature: key ? styles[key] : undefined, motionCss: motionKey ? styles[motionKey] : undefined });
  }
  const declared = new Set(themes.flatMap(({ path, theme }) => [signaturePath(path, theme), motionPath(path, theme)]));
```

In `registryProblems`, destructure `motionCss` and add:

```ts
    if (theme.motionFile && motionCss === undefined) {
      problems.push(`${theme.id}: motion file ${theme.motionFile} not found next to the theme file`);
    } else if (motionCss !== undefined && !animates(motionCss)) {
      problems.push(`${theme.id}: ${theme.motionFile} animates nothing — drop the file and ficha.motion`);
    }
```

- [ ] **Step 4: Implement the compiler option**

In `src/study/compile.ts`: import `lintMotion`; add to `CompileOptions` (next to `signature`):

```ts
  /** Contents of the theme's motion CSS. */
  readonly motionCss?: string;
```

In `compileTheme`:

```ts
  const motionCss = options.motionCss?.trim() ? options.motionCss : undefined;
  const problems = [
    ...uses.flatMap(({ def }) => lintFlourishCss(def.css, `family ${def.name}`)),
    ...(signature ? lintSignature(signature, `${theme.id} signature`) : []),
    ...(motionCss ? lintMotion(motionCss, `${theme.id} motion`) : []),
  ];
```

and in `parts`, after the signature part:

```ts
    ...(motionCss ? [flourishPart(motionCss, theme.id, 'motion', 'motion')] : []),
```

- [ ] **Step 5: Pass it through the build and the study test**

`scripts/build-study.mjs`: change `for (const { theme, signature } of study.STUDY_THEMES)` to `for (const { theme, signature, motionCss } of study.STUDY_THEMES)` and pass `{ signature, motionCss, banner: ... }` to `compileTheme`.

`src/study/study.test.ts`: change `for (const { theme, signature } of STUDY_THEMES)` to `for (const { theme, signature, motionCss } of STUDY_THEMES)` and `compileTheme(theme, { signature, motionCss })`.

- [ ] **Step 6: Run to verify it passes**

Run: `npx vitest run src/study && npm run gen:study`
Expected: PASS, and `build-study: 16 study theme(s), 5 core fichas`.

- [ ] **Step 7: Commit**

```bash
git add src/study/registry.ts src/study/compile.ts scripts/build-study.mjs src/study/study.test.ts src/study/motion.test.ts
git commit -m "feat(study): motion files in the registry, the compiler and the build

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: The theme page shows lettering and motion

**Files:**
- Create: `src/site/study/FichaExtras.tsx`
- Create: `src/site/study/FichaExtras.test.tsx`
- Modify: `src/site/pages/ThemePage.tsx` (`Ficha`)
- Modify: `src/site/i18n.ts`
- Modify: `src/site/site.css`

**Interfaces:**
- Consumes: `Ficha` type (Task 1), `useLang`, `useT`, `LangContext` (`../i18n`).
- Produces: `<FichaExtras ficha={ficha} />` rendering, in order, a «Tipografía»/«Typography» section when `ficha.lettering` exists and a «Movimiento»/«Motion» section when `ficha.motion` exists; renders nothing otherwise. New i18n keys `lettering`, `motion`, `letteringOriginal`, `letteringSubstitute`, `letteringFree`.

- [ ] **Step 1: Write the failing test**

Create `src/site/study/FichaExtras.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FIXTURE } from '../../study/__fixtures__/fixture';
import type { Ficha } from '../../study/types';
import { LangContext } from '../i18n';
import { FichaExtras } from './FichaExtras';

const renderExtras = (ficha: Ficha, lang: 'es' | 'en' = 'es') =>
  render(
    <LangContext value={lang}>
      <FichaExtras ficha={ficha} />
    </LangContext>,
  );

describe('FichaExtras', () => {
  it('shows the typography section with the original, what was documented and the substitute', () => {
    renderExtras(FIXTURE.ficha);
    expect(screen.getByRole('heading', { name: 'Tipografía' })).toBeInTheDocument();
    expect(screen.getByText(/Testschrift/)).toBeInTheDocument();
    expect(screen.getByText(/Designer|Nobody/)).toBeInTheDocument();
    expect(screen.getByText('Rotulada en una grotesca [1].')).toBeInTheDocument();
    expect(screen.getByText(/Barlow se le parece/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Movimiento' })).not.toBeInTheDocument();
  });

  it('shows the motion section when the ficha has one, in English too', () => {
    const ficha: Ficha = { ...FIXTURE.ficha, motion: { documented: { es: 'Se mueve [1].', en: 'It moves [1].' }, reading: { es: 'Lo imita.', en: 'It imitates that.' } } };
    renderExtras(ficha, 'en');
    expect(screen.getByRole('heading', { name: 'Typography' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Motion' })).toBeInTheDocument();
    expect(screen.getByText('It moves [1].')).toBeInTheDocument();
    expect(screen.getByText('It imitates that.')).toBeInTheDocument();
  });

  it('renders nothing for a ficha without either block', () => {
    const { lettering: _lettering, ...ficha } = FIXTURE.ficha;
    const { container } = renderExtras(ficha);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/site/study/FichaExtras.test.tsx`
Expected: FAIL (module `./FichaExtras` not found).

- [ ] **Step 3: Add the strings**

In `src/site/i18n.ts`, after `palette`:

```ts
  lettering: { es: 'Tipografía', en: 'Typography' },
  motion: { es: 'Movimiento', en: 'Motion' },
  letteringOriginal: { es: 'La obra usaba', en: 'The work used' },
  letteringSubstitute: { es: 'El tema usa', en: 'The theme uses' },
  letteringFree: { es: 'una fuente libre, cargada tal cual', en: 'a free face, loaded as is' },
```

(Note the type of the strings table: follow the neighbouring entries; if the table is typed by a key union, add the five keys to it.)

- [ ] **Step 4: Implement the component**

Create `src/site/study/FichaExtras.tsx`:

```tsx
import type { Ficha } from '../../study/types';
import { useLang, useT } from '../i18n';

/** The ficha's typography and motion sections; nothing when the ficha has neither. */
export function FichaExtras({ ficha }: { ficha: Ficha }) {
  const lang = useLang();
  const t = useT();
  const { lettering, motion } = ficha;
  if (!lettering && !motion) return null;
  const { original } = lettering ?? {};
  const facts = original ? [original.name, original.designer, original.year].filter(Boolean).join(', ') : '';
  return (
    <>
      {lettering ? (
        <>
          <h2 className="site-h2">{t('lettering')}</h2>
          <p className="site-p site-themepage__lettering">
            {t('letteringOriginal')}: {facts}.
          </p>
          <p className="site-p">{lettering.documented[lang]}</p>
          <p className="site-p">
            {t('letteringSubstitute')}
            {original?.free ? ` ${t('letteringFree')}` : ''}: {lettering.substitute[lang]}
          </p>
        </>
      ) : null}
      {motion ? (
        <>
          <h2 className="site-h2">{t('motion')}</h2>
          <p className="site-p">{motion.documented[lang]}</p>
          <p className="site-p">{motion.reading[lang]}</p>
        </>
      ) : null}
    </>
  );
}
```

Mount it in `src/site/pages/ThemePage.tsx`, in `Ficha`, right after `<p className="site-p">{ficha.reading[lang]}</p>` and before the palette paragraph: `<FichaExtras ficha={ficha} />` (import it). In `src/site/site.css`, extend the muted-note rule at line 881 so the facts line reads as a caption:

```css
.site-themepage__note,
.site-themepage__palette,
.site-themepage__lettering,
.site-themepage__figure figcaption {
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx vitest run src/site && npx tsc -p tsconfig.json`
Expected: PASS, no type errors. If the FIXTURE test's `getByText(/Designer|Nobody/)` collides with another node, narrow it to `/Testschrift, Nobody, 1971/`.

- [ ] **Step 6: Commit**

```bash
git add src/site/study/FichaExtras.tsx src/site/study/FichaExtras.test.tsx src/site/pages/ThemePage.tsx src/site/i18n.ts src/site/site.css
git commit -m "feat(site): the theme page shows a work's typography and motion

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Pin the pending list, document, and verify the whole

**Files:**
- Modify: `src/study/study.test.ts`
- Modify: `docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md` (D7 note)
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: `LETTERING_PENDING` (Task 1), `STUDY_THEMES`.
- Produces: a test that keeps the pending list honest; docs.

- [ ] **Step 1: Write the failing test**

In `src/study/study.test.ts`, add `import { LETTERING_PENDING } from './validate';` (extend the existing validate import) and, after the `proof themes` describe:

```ts
describe('lettering pending list', () => {
  it('holds only registered themes that still lack lettering, and no id twice', () => {
    const lacking = STUDY_THEMES.filter(({ theme }) => !theme.ficha.lettering).map(({ theme }) => theme.id);
    expect([...LETTERING_PENDING].sort()).toEqual([...lacking].sort());
    expect(new Set(LETTERING_PENDING).size).toBe(LETTERING_PENDING.length);
  });
});
```

- [ ] **Step 2: Run to verify it passes (it documents the current state)**

Run: `npx vitest run src/study/study.test.ts`
Expected: PASS now (16 pending = the 16 themes without lettering). It fails the moment phase 2 writes a theme's lettering without removing its id, or a new theme ships without lettering: that is its job.

- [ ] **Step 3: Write the docs**

Append to D7 in `docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md` a dated note:

```md
**Amended 2026-10-09 (lettering and motion).** A ficha may carry a `lettering` block (required of new themes) and a `motion` block (only where a source documents the work's movement). Both follow the marker rules above. See `2026-10-09-lettering-and-motion-design.md`.
```

Add to `CHANGELOG.md` under "Unreleased":

```md
- Study: the ficha gains `lettering` (the original face, what was documented, the free substitute) and `motion` (documented movement), validated like the rest of the ficha. Themes may declare a `<id>.motion.css`, linted to 40 lines, five animatable properties and a `prefers-reduced-motion: no-preference` guard. `StudyType` gains `featureSettings`, `kerning` and `textRendering`. The theme page shows both sections.
```

- [ ] **Step 4: Full verification**

Run: `npm run check`
Expected: lint, typecheck, `vitest run` (all green), build, `check:package`, publint pass.
Run: `npx playwright test`
Expected: all pass (the engine changes no existing page).
Then `git status`: the working tree must be clean apart from the intended files (e2e can rewrite screenshot baselines; revert any).

- [ ] **Step 5: Commit**

```bash
git add src/study/study.test.ts docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md CHANGELOG.md
git commit -m "test(study): pin the lettering pending list; docs and changelog

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

## Self-review

- **Spec coverage:** §3.1 data → Task 1 (+ `featureSettings`, `kerning`, `textRendering` → Task 2); §3.2 registry → no font in phase 1, by design (each phase 2/3 theme adds its own); §3.3 validation → Task 1 (all four bullets, with rulings 3 and 4); §3.4 site → Task 5; §4.1 data → Task 1; §4.2 code (40 lines, five properties, guard, tokens-only colours, coupling) → Tasks 3 and 4, triggers are theme content (phase 2); §6 testing → unit tests in every task, the `reduced-motion` e2e comes with the first animated theme in phase 2 (no animated theme exists yet to run it against); §7 release → at the end of phase 3.
- **Placeholders:** none. Every step shows its code and its command.
- **Types:** `Lettering`, `MotionFicha`, `LETTERING_KINDS`, `LETTERING_PENDING`, `animationUses`, `lintMotion`, `animates`, `motionFile`, `motionCss`, `FichaExtras` are spelled the same wherever they appear.
