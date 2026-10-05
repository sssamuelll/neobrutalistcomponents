# The Study — Plan 1 of 2: engine, package and proof themes

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the study's theme engine — themes as data compiled to CSS, detail families, validation of fichas and sources, the npm `./study` catalog — and ship the five core fichas plus four proof themes (`classifieds`, `nakagin`, `maeusebunker`, `sesc-pompeia`) through it.

**Architecture:** A study theme is a TypeScript data file (`src/study/themes/<scene>/<id>.ts`). A pure compiler (`src/study/compile.ts`) turns it into a stylesheet shaped exactly like a hand-written core theme (token block in `nbc.theme`, flourishes in `nbc.flourish` inside the theme's donut `@scope`). Validation and the token contract run in Vitest and again in `scripts/build-study.mjs`, which writes git-ignored output for the site and tests and, with `--dist`, the npm files.

**Tech Stack:** TypeScript 6, Vite 8 (`runnerImport` for scripts, `?raw` imports), Vitest 5, Node ≥ 20.19, sharp (dev only, image conversion).

**Spec:** `docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md` (approved). This plan covers spec D1–D8, D13, the engine half of D6/D14 and §5 unit tests. **Plan 2** (written after this one lands, against the real code) covers D9–D12, the site, essays, e2e and the 1.1.0 release.

**Research dossier:** `docs/superpowers/plans/2026-10-05-neobrutalism-study-engine.research.md` — verified facts, sources and Commons images for every reference. Content tasks (7, 9–12) take facts and URLs **only** from it.

## Global Constraints

- Theme ids match `/^[a-z][a-z0-9-]{1,31}$/`, are unique across the catalog and never equal a core id (`classic`, `tech`, `swiss`, `y2k`, `riso`).
- Every color token is written explicitly as `#hex` or `[light, dark]`; `*Fg` tokens may be `'auto'`. If the best ink is below 4.5:1, compilation fails and names the token and the ratio.
- The compiled CSS always declares every token in `REQUIRED_TOKENS` (`src/lib/themes/contract.ts`). Compilation is a pure function: same data → byte-identical CSS.
- Family parameters never take literal colors. Family and signature CSS: no literal colors (hex, `rgb()`, `hsl()`, `oklch()`, named colors other than `transparent`, `currentColor`, `inherit`); no `height`, `min-height`, `max-height`, `block-size` (+min/max), `padding*`, `font`, `font-size`, `line-height` outside `::before` / `::after` rules; no CSS nesting; no `@layer`, `@import`, `@scope`, `[data-theme]` or `data:` URIs.
- Anything painted behind text goes through `--nbc-texture`, built by a family's `texture()` from hex-with-alpha stops. Every stop, composited over each ground, keeps the contract's text pairs for that ground at ≥ 4.5:1 in both schemes: `--nbc-surface-fill` (fg, fg-muted), `--nbc-surface-alt` (fg), `--nbc-bg` (fg, fg-muted).
- A signature file has at most **60** non-blank, non-comment lines.
- Fonts come only from `src/study/fonts.ts` (Google Fonts, `OFL-1.1` or `Apache-2.0`), at most three families per theme, or `'system-sans'` / `'system-serif'`. Every theme ships `<id>.fonts.css`.
- Each shipped `dist/themes/<id>.css` of a study theme is ≤ **12 KB** (12288 bytes) as shipped.
- Fichas: ≥ 2 sources, ≥ 1 not on wikipedia.org, `https` URLs, `accessed` as `YYYY-MM-DD`; every `[n]` resolves to a source, every source is cited, and the marker set is identical in `es` and `en`. Fichas paraphrase — never quote verbatim. Influence between works is stated only when a source documents it; otherwise it goes in `reading` as a kinship we see. No live commercial brand names a theme.
- Images: Wikimedia Commons only, license in `CC0-1.0 | PD | CC-BY-{2.0,2.5,3.0,4.0} | CC-BY-SA-{2.0,2.5,3.0,4.0}`; AVIF, ≤ 1600 px wide, ≤ 250 000 bytes; author and license read from the Commons API by `scripts/fetch-image.mjs`, never typed by hand. Images live in `src/study/images/` and are never part of the npm package.
- Every user-facing study string is an `{ es, en }` pair; neither may be empty.
- The library keeps zero runtime dependencies. The five core themes' CSS (`src/lib/themes/**`) is not modified.
- Generated output (`src/study/.generated/`) is never committed.
- Every commit message ends with:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt
  ```

## Review Focus

1. **A study theme nested inside another theme's island (and the reverse).** Tokens and flourishes must not leak. Pinned in Task 3: every flourish rule sits inside the exact donut `@scope` prelude, keyframes are namespaced outside it, and the token block selector is exactly `[data-theme="<id>"]`.
2. **`mode="dark"` on a light-native theme (and the reverse).** Every color whose two schemes differ must compile to `light-dark()`, and `--nbc-scheme` must equal `nativeScheme`. Pinned in Task 2.
3. **Hex written the way people write it** — `#ABC`, `#262626ff`, uppercase. Accepted, normalized to lowercase, still resolvable by the contract tool. Pinned in Task 2.
4. **A family parameter out of range or of the wrong type** (`grain: 0.5`, `ink: 'red'`, a typo'd key). Compilation fails naming theme, family and parameter. Pinned in Task 3.
5. **A theme file in the wrong folder, or a signature path that doesn't exist.** The registry reports it with the expected path. Pinned in Task 5.

---

## File map

```
src/study/
  types.ts                 data model (types + constants)                    Task 1
  fonts.ts                 font registry, stacks, Google Fonts URL           Task 1
  elevation.ts             flat / hardShadow / doubleStack                   Task 1
  define.ts                defineTheme + re-exported helpers                 Task 1
  color.ts                 normalizeHex, lightDark, withAlpha                Task 2
  compile.ts               data → CSS (tokens, families, signature)          Tasks 2–3
  css.ts                   minimal CSS reading (blocks, rules, declarations) Task 3
  lint.ts                  flourish/signature lint                           Task 3
  families/types.ts        ParamSpec, defineFamily                           Task 3
  families/params.ts       parameter resolution + declarations               Task 3
  families/index.ts        FAMILIES registry + helper re-exports             Tasks 3–4
  families/concrete/       family.css + family.ts                            Task 4
  families/grid/           family.css + family.ts                            Task 4
  validate.ts              theme / reference / ficha / core ficha checks     Task 5
  registry.ts              eager glob of themes + signatures                 Task 5
  contract.ts              token contract on compiled output                 Task 5
  commons.ts               Commons API helpers (pure)                        Task 6
  images/NOTICE            image licensing note                              Task 6
  core-fichas.ts           fichas of the five core themes                    Task 7
  catalog.ts               catalog entries + module renderers                Task 8
  build.ts                 single import for the build script                Task 8
  themes/<scene>/<id>.ts   the four proof themes                             Tasks 9–12
  __fixtures__/fixture.ts  a complete valid theme for unit tests             Task 2
scripts/
  fetch-image.mjs          Commons → AVIF + ImageCredit                      Task 6
  build-study.mjs          compile, validate, write outputs                  Task 8
src/lib/themes/color.ts    + composite()                                     Task 5
scripts/check-package.mjs  study themes, budget, ./study export              Task 8
package.json, .gitignore, eslint.config.js                                   Tasks 6, 8
```

---

### Task 1: Data model, font registry and elevation helpers

**Files:**
- Create: `src/study/types.ts`, `src/study/fonts.ts`, `src/study/elevation.ts`, `src/study/define.ts`
- Test: `src/study/fonts.test.ts`, `src/study/elevation.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: every type below (`StudyThemeInput`, `L10n`, `Lang`, `Hex`, `SchemeColor`, `InkColor`, `StudyColors`, `ColorToken`, `COLOR_VARS`, `StudyFills`, `StudyType`, `StudyShape`, `ShadowKind`, `StudyElevation`, `StudyFocus`, `StudyMotion`, `StudyFonts`, `Source`, `IMAGE_LICENSES`, `ImageLicense`, `ImageCredit`, `REFERENCE_KINDS`, `ReferenceKind`, `Reference`, `PALETTE_ORIGINS`, `Ficha`, `FamilyUse`, `Facets`, `BorderFacet`, `CornerFacet`, `CoreFicha`, `SCENES`, `Scene`, `THEME_SCENES`, `ThemeScene`, `LANGS`); `FONTS`, `FontKey`, `FontEntry`, `FALLBACKS`, `SYSTEM_STACKS`, `fontStack(key)`, `googleFontsUrl(keys)`; `flat()`, `hardShadow(offset?, color?)`, `doubleStack(inner?, outer?, outerColor?, innerColor?)`; `defineTheme(theme)`.

- [ ] **Step 1: Write the failing tests**

`src/study/fonts.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { FONTS, fontStack, googleFontsUrl } from './fonts';
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
```

`src/study/elevation.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { doubleStack, flat, hardShadow } from './elevation';

describe('elevation helpers', () => {
  it('hardShadow(4) equals the neutral contract defaults in src/lib/tokens.css', () => {
    expect(hardShadow(4)).toEqual({
      kind: 'hard',
      shadow: '4px 4px 0 var(--nbc-border-color)',
      shadowLg: '8px 8px 0 var(--nbc-border-color)',
      shadowPress: '1px 1px 0 var(--nbc-border-color)',
      press: 3,
      pressActive: 4,
    });
  });

  it('hardShadow keeps the silhouette: press + press shadow = offset', () => {
    for (const offset of [2, 3, 5, 6, 8]) {
      const e = hardShadow(offset, 'fg');
      const pressShadow = Number(e.shadowPress.split('px')[0]);
      expect(e.press + pressShadow).toBe(offset);
      expect(e.shadow).toContain('var(--nbc-fg)');
    }
  });

  it('doubleStack(5, 7) reproduces the classic theme geometry', () => {
    expect(doubleStack(5, 7)).toEqual({
      kind: 'double',
      shadow: '5px 5px 0 var(--nbc-border-color), 7px 7px 0 var(--nbc-accent)',
      shadowLg: '8px 8px 0 var(--nbc-border-color), 11px 11px 0 var(--nbc-accent)',
      shadowPress: '2px 2px 0 var(--nbc-border-color), 4px 4px 0 var(--nbc-accent)',
      press: 3,
      pressActive: 5,
    });
  });

  it('flat() has no shadows and a 1px press', () => {
    expect(flat()).toEqual({ kind: 'none', shadow: 'none', shadowLg: 'none', shadowPress: 'none', press: 1, pressActive: 1 });
  });

  it('rejects impossible geometry', () => {
    expect(() => hardShadow(1)).toThrow(/offset must be an integer ≥ 2/);
    expect(() => doubleStack(5, 5)).toThrow(/outer must be an integer > inner/);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/study/fonts.test.ts src/study/elevation.test.ts`
Expected: FAIL — `Failed to resolve import "./fonts"` / `"./elevation"`.

- [ ] **Step 3: Write the data model**

`src/study/types.ts`:

```ts
/**
 * The study's data model. A study theme is one documented reference work
 * (a building, a poster, a typeface, a website…) read through the token
 * contract. Types and constants only — no runtime logic.
 */
import type { FontKey } from './fonts';

export const SCENES = ['japan', 'germany', 'usa', 'latam', 'origins'] as const;
export type Scene = (typeof SCENES)[number];

/** Scenes that host study themes. `origins` holds history and core themes only. */
export const THEME_SCENES = ['japan', 'germany', 'usa', 'latam'] as const;
export type ThemeScene = (typeof THEME_SCENES)[number];

export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];

/** Every user-facing study string, in both languages. */
export type L10n = { readonly [K in Lang]: string };

export type Hex = `#${string}`;
/** One color for both schemes, or `[light, dark]`. */
export type SchemeColor = Hex | readonly [light: Hex, dark: Hex];
/** Text-on-color tokens may let the compiler pick the ink with the most contrast. */
export type InkColor = SchemeColor | 'auto';

export interface StudyColors {
  readonly bg: SchemeColor;
  readonly fg: SchemeColor;
  readonly fgMuted: SchemeColor;
  readonly surface: SchemeColor;
  readonly surfaceAlt: SchemeColor;
  readonly border: SchemeColor;
  readonly primary: SchemeColor;
  readonly primaryFg: InkColor;
  readonly accent: SchemeColor;
  readonly accentFg: InkColor;
  readonly info: SchemeColor;
  readonly infoFg: InkColor;
  readonly success: SchemeColor;
  readonly successFg: InkColor;
  readonly warning: SchemeColor;
  readonly warningFg: InkColor;
  readonly danger: SchemeColor;
  readonly dangerFg: InkColor;
  readonly focus: SchemeColor;
}
export type ColorToken = keyof StudyColors;

/** The custom property behind each color key, in contract order. */
export const COLOR_VARS = {
  bg: '--nbc-bg',
  fg: '--nbc-fg',
  fgMuted: '--nbc-fg-muted',
  surface: '--nbc-surface',
  surfaceAlt: '--nbc-surface-alt',
  border: '--nbc-border-color',
  primary: '--nbc-primary',
  primaryFg: '--nbc-primary-fg',
  accent: '--nbc-accent',
  accentFg: '--nbc-accent-fg',
  info: '--nbc-info',
  infoFg: '--nbc-info-fg',
  success: '--nbc-success',
  successFg: '--nbc-success-fg',
  warning: '--nbc-warning',
  warningFg: '--nbc-warning-fg',
  danger: '--nbc-danger',
  dangerFg: '--nbc-danger-fg',
  focus: '--nbc-focus',
} as const satisfies Record<ColorToken, `--nbc-${string}`>;

/**
 * Gradient or solid fills. Colors inside must be #hex or light-dark(#hex, #hex):
 * the contract checks every stop. Each defaults to its solid color.
 */
export interface StudyFills {
  readonly primary?: string;
  readonly danger?: string;
  readonly surface?: string;
}

export type TextTransform = 'none' | 'uppercase' | 'lowercase';

export interface StudyType {
  readonly weightBody: number;
  readonly weightLabel: number;
  readonly weightDisplay: number;
  /** Default 'none'. */
  readonly labelTransform?: TextTransform;
  /** CSS letter-spacing. Default 'normal'. */
  readonly labelSpacing?: string;
  /** Default 'none'. */
  readonly displayTransform?: TextTransform;
  /** CSS letter-spacing. Default '-0.02em'. */
  readonly displaySpacing?: string;
  /** font-stretch for display text. Default '100%'. */
  readonly displayStretch?: string;
}

/** All values in px. */
export interface StudyShape {
  readonly borderWidth: number;
  /** Default 'solid'. */
  readonly borderStyle?: 'solid' | 'dashed' | 'double';
  /** Surfaces (cards, dialogs, tables). */
  readonly radius: number;
  /** Fields. */
  readonly radiusControl: number;
  /** Buttons; 999 for pills. */
  readonly radiusButton: number;
  /** Badges, kbd, checkboxes. */
  readonly radiusSmall: number;
}

export const SHADOW_KINDS = ['none', 'hard', 'double', 'soft'] as const;
export type ShadowKind = (typeof SHADOW_KINDS)[number];

/** Build with the helpers in ./elevation (flat, hardShadow, doubleStack). */
export interface StudyElevation {
  readonly kind: ShadowKind;
  readonly shadow: string;
  readonly shadowLg: string;
  readonly shadowPress: string;
  /** px a control travels when hovered. */
  readonly press: number;
  /** px a control travels when pressed. */
  readonly pressActive: number;
  /** deg. Default 0. */
  readonly rotate?: number;
}

/** px. Default { width: 3, offset: 2 }. */
export interface StudyFocus {
  readonly width: number;
  readonly offset: number;
}

/** ms. Default { duration: 120, durationSlow: 220, ease: 'cubic-bezier(0.2, 0.9, 0.3, 1)' }. */
export interface StudyMotion {
  readonly duration: number;
  readonly durationSlow: number;
  readonly ease: string;
}

export type StudyFonts =
  | 'system-sans'
  | 'system-serif'
  | { readonly sans: FontKey; readonly display?: FontKey; readonly mono?: FontKey };

export interface Source {
  /** As published, in its original language. */
  readonly title: string;
  readonly url: `https://${string}`;
  readonly publisher?: string;
  readonly year?: number;
  /** YYYY-MM-DD */
  readonly accessed: string;
}

export const IMAGE_LICENSES = [
  'CC0-1.0',
  'PD',
  'CC-BY-2.0',
  'CC-BY-2.5',
  'CC-BY-3.0',
  'CC-BY-4.0',
  'CC-BY-SA-2.0',
  'CC-BY-SA-2.5',
  'CC-BY-SA-3.0',
  'CC-BY-SA-4.0',
] as const;
export type ImageLicense = (typeof IMAGE_LICENSES)[number];

export interface ImageCredit {
  /** File name inside src/study/images/ (kebab-case, .avif). */
  readonly file: string;
  readonly width: number;
  readonly height: number;
  readonly alt: L10n;
  /** As stated on the Commons file page (read by scripts/fetch-image.mjs). */
  readonly author: string;
  readonly license: ImageLicense;
  readonly sourceUrl: `https://commons.wikimedia.org/wiki/File:${string}`;
}

export const REFERENCE_KINDS = ['architecture', 'graphic', 'type', 'web', 'software', 'signage', 'object'] as const;
export type ReferenceKind = (typeof REFERENCE_KINDS)[number];

export interface Reference {
  readonly title: L10n;
  /** The name in its own language and script; `lang` is a BCP 47 tag. */
  readonly original?: { readonly text: string; readonly lang: string };
  /** Empty = anonymous or vernacular. */
  readonly authors: readonly string[];
  readonly date: number | readonly [from: number, to: number];
  readonly place: L10n;
  readonly kind: ReferenceKind;
  readonly sources: readonly Source[];
  readonly image?: ImageCredit;
  readonly archiveUrl?: `https://web.archive.org/${string}`;
}

export const PALETTE_ORIGINS = ['documented', 'sampled', 'interpreted'] as const;
export type PaletteOrigin = (typeof PALETTE_ORIGINS)[number];

export interface Ficha {
  /** 2–4 sentences of fact; every claim carries a [n] marker into reference.sources. */
  readonly documented: L10n;
  /** 2–4 sentences of interpretation: what the theme takes from the reference, and why. */
  readonly reading: L10n;
  readonly palette: { readonly origin: PaletteOrigin; readonly note: L10n };
}

/** A family applied to a theme. Build with the family helpers (concrete(), grid()…). */
export interface FamilyUse {
  readonly family: string;
  readonly params: Readonly<Record<string, string | number>>;
}

export interface StudyThemeInput {
  readonly id: string;
  readonly scene: ThemeScene;
  readonly nativeScheme: 'light' | 'dark';
  readonly name: L10n;
  readonly tagline: L10n;
  readonly reference: Reference;
  readonly ficha: Ficha;
  readonly fonts: StudyFonts;
  readonly colors: StudyColors;
  readonly fills?: StudyFills;
  readonly type: StudyType;
  readonly shape: StudyShape;
  readonly elevation: StudyElevation;
  readonly focus?: StudyFocus;
  readonly motion?: StudyMotion;
  readonly families?: readonly FamilyUse[];
  /** Path of the theme's signature CSS, relative to its file — './<id>.css'. */
  readonly signature?: string;
}

export type BorderFacet = 'hairline' | 'standard' | 'heavy';
export type CornerFacet = 'square' | 'soft' | 'round';

export interface Facets {
  readonly scene: Scene;
  /** Decade of the reference's start year, e.g. 1970. */
  readonly decade: number;
  readonly kind: ReferenceKind;
  readonly scheme: 'light' | 'dark';
  readonly border: BorderFacet;
  readonly shadow: ShadowKind;
  readonly corners: CornerFacet;
}

/** The ficha of a core theme (classic, tech, swiss, y2k, riso). */
export interface CoreFicha {
  readonly scene: Scene;
  /** `en` must equal THEME_INFO[id].tagline. */
  readonly tagline: L10n;
  readonly reference: Reference;
  readonly ficha: Ficha;
  readonly facets: Pick<Facets, 'border' | 'shadow' | 'corners'>;
  readonly predatesStudy: true;
}
```

- [ ] **Step 4: Write the font registry**

`src/study/fonts.ts`:

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

- [ ] **Step 5: Write the elevation helpers and `defineTheme`**

`src/study/elevation.ts`:

```ts
import { COLOR_VARS } from './types';
import type { ColorToken, StudyElevation } from './types';

const ref = (token: ColorToken) => `var(${COLOR_VARS[token]})`;

/** No shadows — the flat, accidental-web register. Controls still sink 1px. */
export function flat(): StudyElevation {
  return { kind: 'none', shadow: 'none', shadowLg: 'none', shadowPress: 'none', press: 1, pressActive: 1 };
}

/**
 * One hard offset shadow. `hardShadow(4)` equals the neutral contract defaults.
 * Pressing moves the control by `press` and shrinks the shadow by the same
 * amount, so the outer silhouette never moves.
 */
export function hardShadow(offset = 4, color: ColorToken = 'border'): StudyElevation {
  if (!Number.isInteger(offset) || offset < 2) throw new Error(`hardShadow: offset must be an integer ≥ 2, got ${offset}`);
  const pressShadow = Math.max(1, Math.round(offset / 4));
  const layer = (n: number) => `${n}px ${n}px 0 ${ref(color)}`;
  return {
    kind: 'hard',
    shadow: layer(offset),
    shadowLg: layer(offset * 2),
    shadowPress: layer(pressShadow),
    press: offset - pressShadow,
    pressActive: offset,
  };
}

/** Two stacked hard shadows — an ink core and a colored edge, like the classic theme. */
export function doubleStack(
  inner = 5,
  outer = 7,
  outerColor: ColorToken = 'accent',
  innerColor: ColorToken = 'border',
): StudyElevation {
  if (!Number.isInteger(inner) || inner < 2) throw new Error(`doubleStack: inner must be an integer ≥ 2, got ${inner}`);
  if (!Number.isInteger(outer) || outer <= inner) throw new Error(`doubleStack: outer must be an integer > inner, got ${outer}`);
  const press = Math.min(3, inner - 1);
  const layers = (a: number, b: number) => `${a}px ${a}px 0 ${ref(innerColor)}, ${b}px ${b}px 0 ${ref(outerColor)}`;
  return {
    kind: 'double',
    shadow: layers(inner, outer),
    shadowLg: layers(Math.round(inner * 1.6), Math.round(outer * 1.6)),
    shadowPress: layers(inner - press, outer - press),
    press,
    pressActive: inner,
  };
}
```

`src/study/define.ts`:

```ts
import type { StudyThemeInput } from './types';

/**
 * Declares a study theme. An identity function: it exists for type checking
 * and to mark a theme file's default export. Validation lives in ./validate,
 * compilation in ./compile.
 */
export function defineTheme<const T extends StudyThemeInput>(theme: T): T {
  return theme;
}

export { flat, hardShadow, doubleStack } from './elevation';
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run src/study/fonts.test.ts src/study/elevation.test.ts && npx tsc -p tsconfig.json`
Expected: PASS (8 tests); typecheck clean.

- [ ] **Step 7: Commit**

```bash
git add src/study/types.ts src/study/fonts.ts src/study/elevation.ts src/study/define.ts src/study/fonts.test.ts src/study/elevation.test.ts
git commit -m "feat(study): data model, font registry and elevation helpers

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 2: Token compiler

**Files:**
- Create: `src/study/color.ts`, `src/study/compile.ts`, `src/study/__fixtures__/fixture.ts`
- Test: `src/study/color.test.ts`, `src/study/compile.test.ts`

**Interfaces:**
- Consumes (Task 1): `StudyThemeInput`, `COLOR_VARS`, `ColorToken`, `SchemeColor`, `FONTS`, `FontKey`, `SYSTEM_STACKS`, `fontStack`, `googleFontsUrl`, `defineTheme`, `hardShadow`. From the library: `LAYER_STATEMENT`, `REQUIRED_TOKENS` (`src/lib/themes/contract.ts`); `contrastRatio`, `resolveColor`, `resolveStops`, `parseThemeTokens`, `Scheme` (`src/lib/themes/color.ts`).
- Produces:
  - `normalizeHex(color: string): string`, `lightDark(light: string, dark: string): string`, `withAlpha(color: string, alpha: number): string` (`src/study/color.ts`).
  - `ENGINE_DEFAULTS`, `fontKeys(fonts: StudyFonts): FontKey[]`, `compileTokens(theme): Map<string, string>`, `renderTokenBlock(id, tokens): string`, `compileTheme(theme, options?): CompiledTheme`, `interface CompileOptions { banner?: string; signature?: string }`, `interface CompiledTheme { id: string; tokens: ReadonlyMap<string, string>; css: string; fontsCss: string; fontsHref: string | null }` (`src/study/compile.ts`). Task 3 extends `CompileOptions` with `families`.
  - `FIXTURE` — a complete, valid `StudyThemeInput` with id `fixture` (`src/study/__fixtures__/fixture.ts`).

- [ ] **Step 1: Write the fixture and the failing tests**

`src/study/__fixtures__/fixture.ts`:

```ts
import { defineTheme, hardShadow } from '../define';

/** A complete, valid study theme for unit tests. Not a real study theme. */
export const FIXTURE = defineTheme({
  id: 'fixture',
  scene: 'germany',
  nativeScheme: 'light',
  name: { es: 'Fixture', en: 'Fixture' },
  tagline: { es: 'Solo para tests.', en: 'Tests only.' },
  reference: {
    title: { es: 'Obra de prueba', en: 'Test work' },
    original: { text: 'Testwerk', lang: 'de' },
    authors: ['Nobody'],
    date: [1971, 1981],
    place: { es: 'Berlín, Alemania', en: 'Berlin, Germany' },
    kind: 'architecture',
    sources: [
      { title: 'Source one', url: 'https://example.org/one', publisher: 'Example Museum', accessed: '2026-10-05' },
      { title: 'Source two', url: 'https://en.wikipedia.org/wiki/Example', accessed: '2026-10-05' },
    ],
  },
  ficha: {
    documented: { es: 'Un hecho [1]. Otro hecho [2].', en: 'A fact [1]. Another fact [2].' },
    reading: { es: 'Una lectura.', en: 'A reading.' },
    palette: { origin: 'interpreted', note: { es: 'Inventada.', en: 'Made up.' } },
  },
  fonts: { sans: 'barlow', mono: 'dm-mono' },
  colors: {
    bg: ['#f2f2f2', '#121212'],
    fg: ['#111111', '#f2f2f2'],
    fgMuted: ['#555555', '#aaaaaa'],
    surface: ['#ffffff', '#1c1c1c'],
    surfaceAlt: ['#e8e8e8', '#262626'],
    border: ['#111111', '#f2f2f2'],
    primary: ['#1a5f9e', '#3d8fd6'],
    primaryFg: 'auto',
    accent: ['#6e570e', '#d8c06a'],
    accentFg: 'auto',
    info: ['#1a5f9e', '#3d8fd6'],
    infoFg: 'auto',
    success: ['#2d6b3c', '#5fb67a'],
    successFg: 'auto',
    warning: '#e8b545',
    warningFg: '#111111',
    danger: ['#a3271d', '#f07a6a'],
    dangerFg: 'auto',
    focus: ['#1a5f9e', '#3d8fd6'],
  },
  type: { weightBody: 400, weightLabel: 600, weightDisplay: 800 },
  shape: { borderWidth: 3, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: hardShadow(4),
});
```

`src/study/color.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { lightDark, normalizeHex, withAlpha } from './color';

describe('study color helpers', () => {
  it('normalizes hex to lowercase and rejects anything else', () => {
    expect(normalizeHex('#ABC')).toBe('#abc');
    expect(normalizeHex('#262626FF')).toBe('#262626ff');
    expect(() => normalizeHex('red')).toThrow('not a #hex color: red');
    expect(() => normalizeHex('#12345')).toThrow('not a #hex color: #12345');
  });

  it('collapses light-dark() when both schemes match', () => {
    expect(lightDark('#fff', '#fff')).toBe('#fff');
    expect(lightDark('#fff', '#000')).toBe('light-dark(#fff, #000)');
  });

  it('withAlpha expands short hex and replaces any alpha', () => {
    expect(withAlpha('#abc', 0.5)).toBe('#aabbcc80');
    expect(withAlpha('#112233ff', 0.07)).toBe('#11223312');
    expect(() => withAlpha('#112233', 1.5)).toThrow(/alpha must be within 0\.\.1/);
  });
});
```

`src/study/compile.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { REQUIRED_TOKENS } from '../lib/themes/contract';
import { parseThemeTokens } from '../lib/themes/color';
import { compileTheme, compileTokens } from './compile';
import { FIXTURE } from './__fixtures__/fixture';
import type { StudyThemeInput } from './types';

const withColors = (patch: Partial<StudyThemeInput['colors']>): StudyThemeInput => ({
  ...FIXTURE,
  colors: { ...FIXTURE.colors, ...patch },
});

describe('compileTokens', () => {
  it('declares every required token', () => {
    const tokens = compileTokens(FIXTURE);
    expect(REQUIRED_TOKENS.filter((t) => !tokens.has(t))).toEqual([]);
  });

  it('emits light-dark() only when the schemes differ (Review Focus 2)', () => {
    const tokens = compileTokens(withColors({ bg: ['#F2F2F2', '#121212'], warning: '#E8B545' }));
    expect(tokens.get('--nbc-bg')).toBe('light-dark(#f2f2f2, #121212)');
    expect(tokens.get('--nbc-warning')).toBe('#e8b545');
    expect(compileTokens(withColors({ surface: ['#ffffff', '#ffffff'] })).get('--nbc-surface')).toBe('#ffffff');
    expect(tokens.get('--nbc-scheme')).toBe('light');
    expect(compileTokens({ ...FIXTURE, nativeScheme: 'dark' }).get('--nbc-scheme')).toBe('dark');
  });

  it('accepts 3-, 4- and 8-digit hex in any case (Review Focus 3)', () => {
    const tokens = compileTokens(withColors({ surfaceAlt: ['#EEE', '#262626ff'] }));
    expect(tokens.get('--nbc-surface-alt')).toBe('light-dark(#eee, #262626ff)');
  });

  it('rejects a color that is not #hex', () => {
    expect(() => compileTokens(withColors({ bg: 'red' as never }))).toThrow(/not a #hex color: red/);
  });

  it('resolves auto inks per scheme to the theme ink with the most contrast', () => {
    const tokens = compileTokens(FIXTURE);
    expect(tokens.get('--nbc-primary-fg')).toBe('light-dark(#f2f2f2, #111111)');
    expect(tokens.get('--nbc-warning-fg')).toBe('#111111');
  });

  it('fails when no theme ink reaches 4.5:1', () => {
    expect(() => compileTokens(withColors({ primary: '#767676' }))).toThrow(
      /fixture: --nbc-primary-fg auto \(light\): best ink #111111 reaches 4\.\d\d:1 on --nbc-primary, needs 4\.5/,
    );
  });

  it('fills default to their solid color; texture defaults to none', () => {
    const tokens = compileTokens(FIXTURE);
    expect(tokens.get('--nbc-primary-fill')).toBe('var(--nbc-primary)');
    expect(tokens.get('--nbc-danger-fill')).toBe('var(--nbc-danger)');
    expect(tokens.get('--nbc-surface-fill')).toBe('var(--nbc-surface)');
    expect(tokens.get('--nbc-texture')).toBe('none');
  });

  it('applies the engine defaults for optional groups', () => {
    const tokens = compileTokens(FIXTURE);
    expect(tokens.get('--nbc-label-transform')).toBe('none');
    expect(tokens.get('--nbc-label-spacing')).toBe('normal');
    expect(tokens.get('--nbc-display-spacing')).toBe('-0.02em');
    expect(tokens.get('--nbc-display-stretch')).toBe('100%');
    expect(tokens.get('--nbc-border-style')).toBe('solid');
    expect(tokens.get('--nbc-focus-width')).toBe('3px');
    expect(tokens.get('--nbc-focus-offset')).toBe('2px');
    expect(tokens.get('--nbc-duration')).toBe('120ms');
    expect(tokens.get('--nbc-ease')).toBe('cubic-bezier(0.2, 0.9, 0.3, 1)');
    expect(tokens.get('--nbc-rotate')).toBe('0deg');
    expect(tokens.get('--nbc-radius')).toBe('0px');
  });

  it('uses the system stacks for system fonts', () => {
    const serif = compileTokens({ ...FIXTURE, fonts: 'system-serif' });
    expect(serif.get('--nbc-font-sans')).toBe("'Times New Roman', Times, serif");
    expect(serif.get('--nbc-font-display')).toBe("'Times New Roman', Times, serif");
    expect(serif.get('--nbc-font-mono')).toBe("'Courier New', Courier, monospace");
    expect(compileTokens(FIXTURE).get('--nbc-font-display')).toBe("'Barlow', system-ui, -apple-system, 'Segoe UI', sans-serif");
  });
});

describe('compileTheme', () => {
  it('round-trips: parsing the CSS gives back exactly the compiled tokens', () => {
    const compiled = compileTheme(FIXTURE);
    expect(parseThemeTokens(compiled.css, 'fixture')).toEqual(compiled.tokens);
  });

  it('is deterministic', () => {
    expect(compileTheme(FIXTURE).css).toBe(compileTheme(FIXTURE).css);
  });

  it('starts with the banner and the layer statement; tokens live in nbc.theme', () => {
    const { css } = compileTheme(FIXTURE, { banner: 'neobrutalistcomponents v9 — study theme: fixture' });
    expect(css.startsWith('/* neobrutalistcomponents v9 — study theme: fixture')).toBe(true);
    expect(css).toContain('@layer nbc.tokens, nbc.theme, nbc.base, nbc.components, nbc.flourish;');
    expect(css).toMatch(/@layer nbc\.theme \{\n\[data-theme="fixture"\] \{\n {2}--nbc-scheme: light;/);
  });

  it('writes a fonts stylesheet, or a comment for system fonts', () => {
    const google = compileTheme(FIXTURE);
    expect(google.fontsHref).toBe(
      'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap',
    );
    expect(google.fontsCss).toContain(`@import url('${google.fontsHref}');`);
    const system = compileTheme({ ...FIXTURE, fonts: 'system-sans' });
    expect(system.fontsHref).toBeNull();
    expect(system.fontsCss).toMatch(/^\/\* The fixture theme uses system fonts only/);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/study/color.test.ts src/study/compile.test.ts`
Expected: FAIL — `Failed to resolve import "./color"` / `"./compile"`.

- [ ] **Step 3: Write the color helpers**

`src/study/color.ts`:

```ts
/** Color helpers for the study compiler and families. */
const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Lowercased #hex; throws on anything the token contract can't resolve. */
export function normalizeHex(color: string): string {
  if (!HEX.test(color)) throw new Error(`not a #hex color: ${color}`);
  return color.toLowerCase();
}

/** `light-dark(light, dark)`, or the single color when both schemes match. */
export function lightDark(light: string, dark: string): string {
  return light === dark ? light : `light-dark(${light}, ${dark})`;
}

/** #rgb, #rgba, #rrggbb or #rrggbbaa → #rrggbb plus the given alpha byte. */
export function withAlpha(color: string, alpha: number): string {
  if (!(alpha >= 0 && alpha <= 1)) throw new Error(`alpha must be within 0..1, got ${alpha}`);
  let h = normalizeHex(color).slice(1);
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  return `#${h.slice(0, 6)}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
}
```

- [ ] **Step 4: Write the compiler (tokens only — Task 3 adds families and signatures)**

`src/study/compile.ts`:

```ts
/**
 * Study theme compiler: data → CSS. A pure function — the same input always
 * produces byte-identical output, shaped like a hand-written core theme:
 * the token block in nbc.theme (flourishes join in Task 3).
 */
import { LAYER_STATEMENT } from '../lib/themes/contract';
import { contrastRatio, resolveColor, resolveStops } from '../lib/themes/color';
import { SYSTEM_STACKS, fontStack, googleFontsUrl } from './fonts';
import type { FontKey } from './fonts';
import { lightDark, normalizeHex } from './color';
import { COLOR_VARS } from './types';
import type { ColorToken, SchemeColor, StudyFonts, StudyThemeInput } from './types';

/** Values for optional groups. Equal to the neutral defaults in src/lib/tokens.css. */
export const ENGINE_DEFAULTS = {
  labelTransform: 'none',
  labelSpacing: 'normal',
  displayTransform: 'none',
  displaySpacing: '-0.02em',
  displayStretch: '100%',
  borderStyle: 'solid',
  rotate: 0,
  focus: { width: 3, offset: 2 },
  motion: { duration: 120, durationSlow: 220, ease: 'cubic-bezier(0.2, 0.9, 0.3, 1)' },
} as const;

/** Each ink token, the color it sits on and that color's fill (if any). */
const INKS = {
  primaryFg: { base: 'primary', fill: '--nbc-primary-fill' },
  accentFg: { base: 'accent' },
  infoFg: { base: 'info' },
  successFg: { base: 'success' },
  warningFg: { base: 'warning' },
  dangerFg: { base: 'danger', fill: '--nbc-danger-fill' },
} as const satisfies Partial<Record<ColorToken, { base: ColorToken; fill?: string }>>;
type InkKey = keyof typeof INKS;

export interface CompileOptions {
  /** First line of the stylesheet's header comment. */
  readonly banner?: string;
  /** Contents of the theme's signature CSS. */
  readonly signature?: string;
}

export interface CompiledTheme {
  readonly id: string;
  /** Every custom property of the theme block, in output order. */
  readonly tokens: ReadonlyMap<string, string>;
  readonly css: string;
  readonly fontsCss: string;
  readonly fontsHref: string | null;
}

const px = (n: number) => `${n}px`;

function schemeValue(color: SchemeColor): string {
  return typeof color === 'string'
    ? normalizeHex(color)
    : lightDark(normalizeHex(color[0]), normalizeHex(color[1]));
}

/** The registry keys a theme loads, in sans, display, mono order. */
export function fontKeys(fonts: StudyFonts): FontKey[] {
  if (typeof fonts === 'string') return [];
  return [fonts.sans, fonts.display, fonts.mono].filter((k): k is FontKey => k !== undefined);
}

function fontTokens(fonts: StudyFonts): [string, string][] {
  if (typeof fonts === 'string') {
    const stack = SYSTEM_STACKS[fonts];
    return [
      ['--nbc-font-sans', stack.sans],
      ['--nbc-font-display', stack.sans],
      ['--nbc-font-mono', stack.mono],
    ];
  }
  const sans = fontStack(fonts.sans);
  return [
    ['--nbc-font-sans', sans],
    ['--nbc-font-display', fonts.display ? fontStack(fonts.display) : sans],
    ['--nbc-font-mono', fonts.mono ? fontStack(fonts.mono) : SYSTEM_STACKS['system-sans'].mono],
  ];
}

/** Per scheme, the theme text ink (fg light / fg dark) with the most contrast on every stop it sits on. */
function pickInk(tokens: Map<string, string>, theme: StudyThemeInput, key: InkKey): string {
  const spec: { base: ColorToken; fill?: string } = INKS[key];
  const fg = theme.colors.fg;
  const inks = [...new Set(typeof fg === 'string' ? [normalizeHex(fg)] : fg.map(normalizeHex))];
  const [light, dark] = (['light', 'dark'] as const).map((scheme) => {
    const page = resolveColor(tokens, '--nbc-bg', scheme);
    const grounds = [
      ...resolveStops(tokens, COLOR_VARS[spec.base], scheme),
      ...(spec.fill ? resolveStops(tokens, spec.fill, scheme) : []),
    ];
    let best = { ink: inks[0], ratio: -1 };
    for (const ink of inks) {
      const ratio = Math.min(...grounds.map((ground) => contrastRatio(ink, ground, page)));
      if (ratio > best.ratio) best = { ink, ratio };
    }
    if (best.ratio < 4.5) {
      throw new Error(
        `${theme.id}: ${COLOR_VARS[key]} auto (${scheme}): best ink ${best.ink} reaches ${best.ratio.toFixed(2)}:1 on ${COLOR_VARS[spec.base]}, needs 4.5`,
      );
    }
    return best.ink;
  });
  return lightDark(light, dark);
}

/** Every token of the theme block, in contract order. Texture is 'none' here; families set it (Task 3). */
export function compileTokens(theme: StudyThemeInput): Map<string, string> {
  const { colors, type, shape, elevation } = theme;
  const focus = theme.focus ?? ENGINE_DEFAULTS.focus;
  const motion = theme.motion ?? ENGINE_DEFAULTS.motion;
  const tokens = new Map<string, string>();

  tokens.set('--nbc-scheme', theme.nativeScheme);
  for (const [name, value] of fontTokens(theme.fonts)) tokens.set(name, value);
  tokens.set('--nbc-weight-body', String(type.weightBody));
  tokens.set('--nbc-weight-label', String(type.weightLabel));
  tokens.set('--nbc-weight-display', String(type.weightDisplay));
  tokens.set('--nbc-label-transform', type.labelTransform ?? ENGINE_DEFAULTS.labelTransform);
  tokens.set('--nbc-label-spacing', type.labelSpacing ?? ENGINE_DEFAULTS.labelSpacing);
  tokens.set('--nbc-display-transform', type.displayTransform ?? ENGINE_DEFAULTS.displayTransform);
  tokens.set('--nbc-display-spacing', type.displaySpacing ?? ENGINE_DEFAULTS.displaySpacing);

  // Placeholders keep auto inks in contract order until their grounds are known.
  for (const key of Object.keys(COLOR_VARS) as ColorToken[]) {
    const value = colors[key];
    tokens.set(COLOR_VARS[key], value === 'auto' ? '' : schemeValue(value));
  }
  tokens.set('--nbc-primary-fill', theme.fills?.primary ?? 'var(--nbc-primary)');
  tokens.set('--nbc-danger-fill', theme.fills?.danger ?? 'var(--nbc-danger)');
  tokens.set('--nbc-surface-fill', theme.fills?.surface ?? 'var(--nbc-surface)');
  tokens.set('--nbc-texture', 'none');
  for (const key of Object.keys(INKS) as InkKey[]) {
    if (colors[key] === 'auto') tokens.set(COLOR_VARS[key], pickInk(tokens, theme, key));
  }

  tokens.set('--nbc-border-width', px(shape.borderWidth));
  tokens.set('--nbc-border-style', shape.borderStyle ?? ENGINE_DEFAULTS.borderStyle);
  tokens.set('--nbc-radius', px(shape.radius));
  tokens.set('--nbc-radius-control', px(shape.radiusControl));
  tokens.set('--nbc-radius-button', px(shape.radiusButton));
  tokens.set('--nbc-radius-small', px(shape.radiusSmall));

  tokens.set('--nbc-shadow', elevation.shadow);
  tokens.set('--nbc-shadow-lg', elevation.shadowLg);
  tokens.set('--nbc-shadow-press', elevation.shadowPress);
  tokens.set('--nbc-press', px(elevation.press));
  tokens.set('--nbc-press-active', px(elevation.pressActive));
  tokens.set('--nbc-rotate', `${elevation.rotate ?? ENGINE_DEFAULTS.rotate}deg`);
  tokens.set('--nbc-focus-width', px(focus.width));
  tokens.set('--nbc-focus-offset', px(focus.offset));

  tokens.set('--nbc-duration', `${motion.duration}ms`);
  tokens.set('--nbc-duration-slow', `${motion.durationSlow}ms`);
  tokens.set('--nbc-ease', motion.ease);
  tokens.set('--nbc-display-stretch', type.displayStretch ?? ENGINE_DEFAULTS.displayStretch);
  return tokens;
}

export function renderTokenBlock(id: string, tokens: ReadonlyMap<string, string>): string {
  const lines = [...tokens].map(([name, value]) => `  ${name}: ${value};`);
  return `@layer nbc.theme {\n[data-theme="${id}"] {\n${lines.join('\n')}\n}\n}`;
}

function fontsOutput(theme: StudyThemeInput): Pick<CompiledTheme, 'fontsCss' | 'fontsHref'> {
  const keys = fontKeys(theme.fonts);
  if (!keys.length) {
    return { fontsHref: null, fontsCss: `/* The ${theme.id} theme uses system fonts only: nothing to load. */\n` };
  }
  const fontsHref = googleFontsUrl(keys);
  return { fontsHref, fontsCss: `/* Optional: loads the families the ${theme.id} theme expects. */\n@import url('${fontsHref}');\n` };
}

export function compileTheme(theme: StudyThemeInput, options: CompileOptions = {}): CompiledTheme {
  const tokens = compileTokens(theme);
  const header = `/* ${options.banner ?? `study theme: ${theme.id}`} — generated from src/study, do not edit */\n${LAYER_STATEMENT}\n`;
  const css = `${header}\n${renderTokenBlock(theme.id, tokens)}\n`;
  return { id: theme.id, tokens, css, ...fontsOutput(theme) };
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/study/color.test.ts src/study/compile.test.ts && npx tsc -p tsconfig.json`
Expected: PASS (16 tests); typecheck clean.

- [ ] **Step 6: Commit**

```bash
git add src/study/color.ts src/study/compile.ts src/study/__fixtures__/fixture.ts src/study/color.test.ts src/study/compile.test.ts
git commit -m "feat(study): token compiler with auto inks and engine defaults

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 3: Detail families — infrastructure, lint and scoping

**Files:**
- Create: `src/study/css.ts`, `src/study/lint.ts`, `src/study/families/types.ts`, `src/study/families/params.ts`, `src/study/families/index.ts`
- Modify: `src/study/compile.ts` (add families, texture, parameters, signature, flourish block)
- Test: `src/study/lint.test.ts`, `src/study/families.test.ts`

**Interfaces:**
- Consumes (Tasks 1–2): `compileTokens`, `renderTokenBlock`, `CompileOptions`, `CompiledTheme`, `fontKeys`, `COLOR_VARS`, `ColorToken`, `L10n`, `FamilyUse`, `StudyThemeInput`, `lightDark`, `withAlpha`, `FIXTURE`; `resolveColor`, `Scheme` from `src/lib/themes/color.ts`.
- Produces:
  - `stripComments(css)`, `topLevelBlocks(css): Block[]`, `styleRules(css): StyleRule[]`, `interface Block { prelude: string; body: string }` (`src/study/css.ts`).
  - `lintFlourishCss(css, where): string[]`, `lintSignature(css, where): string[]`, `signatureLines(css): number`, `SIGNATURE_MAX_LINES = 60` (`src/study/lint.ts`).
  - `type ParamSpec`, `type ParamValues`, `interface FillContext { color(token: ColorToken, scheme: Scheme): string }`, `interface FamilyDefinition { name; description; touches; params; css; texture? }`, `defineFamily(def)` returning a callable helper with `.definition` (`src/study/families/types.ts`).
  - `resolveParams(def, given, where): ParamValues`, `paramDeclarations(def, values): [string, string][]` (`src/study/families/params.ts`).
  - `FAMILIES: Readonly<Record<string, FamilyDefinition>>` (empty until Task 4) (`src/study/families/index.ts`).
  - `scopePrelude(id)`; `CompileOptions.families?: Readonly<Record<string, FamilyDefinition>>` (`src/study/compile.ts`).

- [ ] **Step 1: Write the failing tests**

`src/study/lint.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { lintFlourishCss, lintSignature } from './lint';

describe('lintFlourishCss', () => {
  it('accepts token colors, color-mix of tokens and pseudo-element geometry', () => {
    const css = `/* fine */
.nbc-card__footer::before {
  content: '';
  inline-size: 40px;
  block-size: 24px;
  border: 3px solid var(--nbc-primary);
  background: color-mix(in srgb, var(--nbc-accent) 30%, transparent);
}
:scope {
  background: var(--nbc-texture), var(--nbc-bg);
}
@media (prefers-reduced-motion: no-preference) {
  .nbc-button { transition-duration: var(--nbc-duration-slow); }
}
@keyframes fx-pulse { to { opacity: 0.5; } }`;
    expect(lintFlourishCss(css, 'fine')).toEqual([]);
  });

  it.each([
    ['.nbc-card { color: #ff0000; }', /literal color/],
    ['.nbc-card { background: rgb(0 0 0 / 50%); }', /literal color/],
    ['.nbc-card { border-color: rebeccapurple; }', /literal color/],
    ['.nbc-card { --fx-x: oklch(70% 0.1 200); }', /literal color/],
    ['.nbc-button { padding-inline: 4px; }', /control geometry/],
    ['.nbc-input__control { min-height: 50px; }', /control geometry/],
    ['.nbc-card__title { font: 700 20px serif; }', /control geometry/],
    ['.nbc-card::before, .nbc-card { block-size: 4px; }', /control geometry/],
    ['.nbc-card { &:hover { color: var(--nbc-fg); } }', /nesting/],
    ['[data-theme="x"] .nbc-card { color: var(--nbc-fg); }', /data-theme/],
    ['@layer nbc.flourish { .nbc-card { color: var(--nbc-fg); } }', /@layer/],
    ['.nbc-card { background: url("data:image/svg+xml,<svg/>"); }', /data: URIs/],
    ['@import "x.css";', /@import/],
  ])('rejects %s', (css, message) => {
    expect(lintFlourishCss(css, 'bad').join('\n')).toMatch(message);
  });
});

describe('lintSignature', () => {
  it('limits signatures to 60 non-blank, non-comment lines', () => {
    const line = '.nbc-card { color: var(--nbc-fg); }';
    expect(lintSignature(`${Array(60).fill(line).join('\n')}\n/* a comment */\n\n`, 'sig')).toEqual([]);
    expect(lintSignature(Array(61).fill(line).join('\n'), 'sig').join('\n')).toMatch(/61 lines, the limit is 60/);
  });
});
```

`src/study/families.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { LAYER_STATEMENT } from '../lib/themes/contract';
import { parseThemeTokens } from '../lib/themes/color';
import { stripComments, topLevelBlocks } from './css';
import { compileTheme, scopePrelude } from './compile';
import { defineFamily } from './families/types';
import { lightDark, withAlpha } from './color';
import { FIXTURE } from './__fixtures__/fixture';
import type { StudyThemeInput } from './types';

const stripes = defineFamily({
  name: 'stripes',
  description: { es: 'Rayas de prueba.', en: 'Test stripes.' },
  touches: ['nbc-card'],
  params: {
    gap: { type: 'length', default: 12, min: 4, max: 64, description: { es: 'Separación.', en: 'Gap.' } },
    strength: { type: 'number', default: 0.06, min: 0, max: 0.12, description: { es: 'Intensidad.', en: 'Strength.' } },
    ink: { type: 'token', default: 'fg', description: { es: 'Tinta.', en: 'Ink.' } },
    mode: { type: 'enum', default: 'flat', values: ['flat', 'spin'], description: { es: 'Modo.', en: 'Mode.' } },
  },
  css: `.nbc-card__title::after { content: ''; block-size: 2px; background: var(--fx-stripes-ink); animation: fx-spin var(--nbc-duration) linear; }
@keyframes fx-spin { to { rotate: 1turn; } }`,
  texture: (values, ctx) => {
    const a = Number(values.strength);
    const c = lightDark(withAlpha(ctx.color('fg', 'light'), a), withAlpha(ctx.color('fg', 'dark'), a));
    return [`repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px ${values.gap}px)`];
  },
});
const REGISTRY = { stripes: stripes.definition };
const themed: StudyThemeInput = { ...FIXTURE, families: [stripes({ gap: 16 })] };
const blocks = (css: string) => topLevelBlocks(stripComments(css).replace(LAYER_STATEMENT, ''));

describe('families', () => {
  it('declares parameters as --fx-<family>-<param> on the theme root', () => {
    const { tokens } = compileTheme(themed, { families: REGISTRY });
    expect(tokens.get('--fx-stripes-gap')).toBe('16px');
    expect(tokens.get('--fx-stripes-strength')).toBe('0.06');
    expect(tokens.get('--fx-stripes-ink')).toBe('var(--nbc-fg)');
    expect(tokens.get('--fx-stripes-mode')).toBe('flat');
  });

  it('builds --nbc-texture from the families, with hex stops resolved per scheme', () => {
    const { tokens } = compileTheme(themed, { families: REGISTRY });
    expect(tokens.get('--nbc-texture')).toBe(
      'repeating-linear-gradient(0deg, light-dark(#1111110f, #f2f2f20f) 0 1px, transparent 1px 16px)',
    );
  });

  it('wraps family rules in the donut scope and namespaces keyframes outside it (Review Focus 1)', () => {
    const { css } = compileTheme(themed, { families: REGISTRY });
    const top = blocks(css);
    expect(top.map((b) => b.prelude)).toEqual(['@layer nbc.theme', '@layer nbc.flourish']);
    expect(topLevelBlocks(top[0].body).map((b) => b.prelude)).toEqual(['[data-theme="fixture"]']);
    const inner = topLevelBlocks(top[1].body);
    expect(inner.map((b) => b.prelude)).toEqual([scopePrelude('fixture'), '@keyframes nbc-fixture-stripes-fx-spin']);
    expect(scopePrelude('fixture')).toBe('@scope ([data-theme="fixture"]) to ([data-theme]:not([data-theme="fixture"]))');
    expect(inner[0].body).toContain('animation: nbc-fixture-stripes-fx-spin var(--nbc-duration) linear;');
    expect(inner[0].body).not.toMatch(/\[data-theme/);
  });

  it('keeps the token block parseable and exact', () => {
    const compiled = compileTheme(themed, { families: REGISTRY });
    expect(parseThemeTokens(compiled.css, 'fixture')).toEqual(compiled.tokens);
  });

  it.each([
    [{ gap: 2 }, /fixture\/stripes: "gap" must be a number within 4\.\.64, got 2/],
    [{ strength: 0.5 }, /"strength" must be a number within 0\.\.0\.12, got 0\.5/],
    [{ ink: 'red' }, /"ink" must be a color token name, got red/],
    [{ mode: 'wild' }, /"mode" must be one of flat, spin, got wild/],
    [{ size: 3 }, /unknown parameter "size" \(known: gap, strength, ink, mode\)/],
  ])('rejects bad parameters %o (Review Focus 4)', (params, message) => {
    expect(() => compileTheme({ ...FIXTURE, families: [{ family: 'stripes', params }] }, { families: REGISTRY })).toThrow(message);
  });

  it('rejects an unknown family', () => {
    expect(() => compileTheme({ ...FIXTURE, families: [{ family: 'nope', params: {} }] }, { families: REGISTRY })).toThrow(
      /fixture: unknown family "nope"/,
    );
  });

  it('adds the signature after the families, and lints it', () => {
    const { css } = compileTheme(themed, { families: REGISTRY, signature: '.nbc-button--primary { border-radius: 9px 3px; }' });
    expect(css).toMatch(/\/\* signature \*\/\n\s+\.nbc-button--primary \{ border-radius: 9px 3px; \}/);
    expect(css.indexOf('/* family: stripes */')).toBeLessThan(css.indexOf('/* signature */'));
    expect(() => compileTheme(FIXTURE, { signature: '.nbc-button { color: #fff; }' })).toThrow(/literal color/);
  });

  it('emits no flourish layer for a theme without families or signature', () => {
    expect(compileTheme(FIXTURE).css).not.toContain('@layer nbc.flourish');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/study/lint.test.ts src/study/families.test.ts`
Expected: FAIL — `Failed to resolve import "./lint"`, `"./css"`, `"./families/types"`.

- [ ] **Step 3: Write the CSS reader**

`src/study/css.ts`:

```ts
/**
 * Minimal CSS reading for the study compiler and lint — enough for flat
 * family and signature files (style rules, conditional at-rules, keyframes).
 * Not a general parser.
 */
export const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

export interface Block {
  readonly prelude: string;
  readonly body: string;
}

export interface Declaration {
  readonly property: string;
  readonly value: string;
}

export interface StyleRule {
  readonly selector: string;
  readonly declarations: readonly Declaration[];
  /** The rule body contains blocks (CSS nesting). */
  readonly nested: boolean;
}

/** Top-level `prelude { body }` blocks of comment-free CSS. Throws on stray statements or unbalanced braces. */
export function topLevelBlocks(css: string): Block[] {
  const blocks: Block[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;
  let open = -1;
  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '{') {
      if (depth === 0) open = i;
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth < 0) throw new Error('unbalanced "}" in CSS');
      if (depth === 0) {
        blocks.push({ prelude: css.slice(start, open).trim(), body: css.slice(open + 1, i) });
        start = i + 1;
      }
    } else if (ch === ';' && depth === 0) {
      throw new Error(`unexpected top-level statement: ${css.slice(start, i + 1).trim()}`);
    }
  }
  if (depth !== 0) throw new Error('unbalanced "{" in CSS');
  const rest = css.slice(start).trim();
  if (rest) throw new Error(`CSS outside any block: ${rest.slice(0, 40)}`);
  return blocks;
}

/** Splits on `separator` outside quotes and parentheses. */
function splitOutside(input: string, separator: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let buf = '';
  for (const ch of input) {
    if (quote) {
      if (ch === quote) quote = null;
      buf += ch;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(') depth += 1;
    else if (ch === ')') depth -= 1;
    if (ch === separator && depth === 0) {
      parts.push(buf);
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf.trim()) parts.push(buf);
  return parts;
}

export function parseDeclarations(body: string): Declaration[] {
  return splitOutside(body, ';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const idx = d.indexOf(':');
      if (idx === -1) throw new Error(`not a declaration: ${d}`);
      return { property: d.slice(0, idx).trim().toLowerCase(), value: d.slice(idx + 1).trim() };
    });
}

/** Every style rule, descending into conditional at-rules. Keyframes are skipped. */
export function styleRules(css: string): StyleRule[] {
  const rules: StyleRule[] = [];
  for (const block of topLevelBlocks(stripComments(css))) {
    if (/^@keyframes\b/.test(block.prelude)) continue;
    if (block.prelude.startsWith('@')) {
      rules.push(...styleRules(block.body));
      continue;
    }
    const nested = block.body.includes('{');
    rules.push({ selector: block.prelude, declarations: nested ? [] : parseDeclarations(block.body), nested });
  }
  return rules;
}
```

- [ ] **Step 4: Write the lint**

`src/study/lint.ts`:

```ts
/**
 * Lint for family and signature CSS (spec D3/D4): colors only from tokens,
 * control geometry untouched, flat rules, scoping left to the compiler.
 */
import { stripComments, styleRules } from './css';

export const SIGNATURE_MAX_LINES = 60;

/** CSS Color 4 named colors. `transparent`, `currentColor` and `inherit` are allowed and not listed. */
const NAMED_COLORS = [
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue',
  'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk',
  'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki',
  'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue',
  'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
  'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod',
  'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender',
  'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow',
  'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
  'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon',
  'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue',
  'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin',
  'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen',
  'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple',
  'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell',
  'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal',
  'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen',
];
const NAMED = new RegExp(`(?<![\\w-])(?:${NAMED_COLORS.join('|')})(?![\\w-])`, 'i');
const HEX = /#[0-9a-f]{3,8}\b/i;
const COLOR_FN = /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const GEOMETRY = new Set([
  'height', 'min-height', 'max-height', 'block-size', 'min-block-size', 'max-block-size', 'font', 'font-size', 'line-height',
]);
const isGeometry = (property: string) => GEOMETRY.has(property) || property === 'padding' || property.startsWith('padding-');
const PSEUDO = /::(?:before|after)$/;

/** Drops var(…) references (innermost first) so their names can't look like colors. */
function withoutVars(value: string): string {
  let current = value;
  let previous;
  do {
    previous = current;
    current = current.replace(/var\([^()]*\)/g, '');
  } while (current !== previous);
  return current;
}

export function lintFlourishCss(css: string, where: string): string[] {
  const problems: string[] = [];
  const clean = stripComments(css);
  if (/@(?:layer|import|scope)\b/.test(clean)) {
    problems.push(`${where}: @layer, @import and @scope are added by the compiler — remove them`);
  }
  if (/\[data-theme/.test(clean)) problems.push(`${where}: no [data-theme] selectors — the compiler scopes the file to its theme`);
  if (/url\(\s*["']?data:/i.test(clean)) problems.push(`${where}: no data: URIs`);
  let rules;
  try {
    rules = styleRules(clean);
  } catch (error) {
    return [...problems, `${where}: ${(error as Error).message}`];
  }
  for (const rule of rules) {
    if (rule.nested) {
      problems.push(`${where}: "${rule.selector}" uses CSS nesting — write flat rules`);
      continue;
    }
    const onlyPseudo = rule.selector.split(',').every((s) => PSEUDO.test(s.trim()));
    for (const { property, value } of rule.declarations) {
      if (isGeometry(property) && !onlyPseudo) {
        problems.push(`${where}: "${rule.selector}" sets ${property} — control geometry is invariant (allowed only in ::before/::after)`);
      }
      const bare = withoutVars(value);
      if (HEX.test(bare) || COLOR_FN.test(bare) || NAMED.test(bare)) {
        problems.push(`${where}: "${rule.selector}" ${property}: ${value} — literal color; use var(--nbc-*) tokens`);
      }
    }
  }
  return problems;
}

export function signatureLines(css: string): number {
  return stripComments(css).split('\n').filter((line) => line.trim()).length;
}

export function lintSignature(css: string, where: string): string[] {
  const problems = lintFlourishCss(css, where);
  const lines = signatureLines(css);
  if (lines > SIGNATURE_MAX_LINES) problems.push(`${where}: ${lines} lines, the limit is ${SIGNATURE_MAX_LINES}`);
  return problems;
}
```

Note on `'@import "x.css";'`: the first check reports `@import`; `styleRules` then throws on the top-level statement and adds a second problem. Both are expected.

- [ ] **Step 5: Write the family types, parameters and (empty) registry**

`src/study/families/types.ts`:

```ts
import type { Scheme } from '../../lib/themes/color';
import type { ColorToken, FamilyUse, L10n } from '../types';

/** Lengths are px, angles deg. Token parameters name a color token — never a literal color. */
export type ParamSpec =
  | { readonly type: 'length' | 'number' | 'angle'; readonly default: number; readonly min: number; readonly max: number; readonly description: L10n }
  | { readonly type: 'enum'; readonly default: string; readonly values: readonly string[]; readonly description: L10n }
  | { readonly type: 'token'; readonly default: ColorToken; readonly description: L10n };

export type ParamValues = Readonly<Record<string, string | number>>;

export interface FillContext {
  /** Resolved #hex of a color token of the theme being compiled. */
  color: (token: ColorToken, scheme: Scheme) => string;
}

export interface FamilyDefinition {
  readonly name: string;
  readonly description: L10n;
  /** Component roots the family's CSS touches (listed on the Method page). */
  readonly touches: readonly string[];
  readonly params: Readonly<Record<string, ParamSpec>>;
  /** Contents of family.css. */
  readonly css: string;
  /** Layers added to --nbc-texture. Colors must be #hex with alpha, or light-dark() of those. */
  readonly texture?: (values: ParamValues, ctx: FillContext) => readonly string[];
}

type ValueOf<S extends ParamSpec> = S extends { type: 'token' }
  ? ColorToken
  : S extends { type: 'enum'; values: readonly (infer V)[] }
    ? V
    : number;
export type ParamsOf<P extends Record<string, ParamSpec>> = { readonly [K in keyof P]?: ValueOf<P[K]> };

export interface Family<P extends Record<string, ParamSpec>> {
  (params?: ParamsOf<P>): FamilyUse;
  readonly definition: FamilyDefinition;
}

/** Declares a family and returns its typed helper: `concrete({ grain: 0.06 })`. */
export function defineFamily<const P extends Record<string, ParamSpec>>(
  definition: Omit<FamilyDefinition, 'params'> & { readonly params: P },
): Family<P> {
  const use = (params: ParamsOf<P> = {}): FamilyUse => ({
    family: definition.name,
    params: { ...params } as Readonly<Record<string, string | number>>,
  });
  return Object.assign(use, { definition: definition as FamilyDefinition });
}
```

`src/study/families/params.ts`:

```ts
import { COLOR_VARS } from '../types';
import type { ColorToken } from '../types';
import type { FamilyDefinition, ParamValues } from './types';

/** Fills defaults and validates every parameter; `where` prefixes errors (`<theme>/<family>`). */
export function resolveParams(def: FamilyDefinition, given: Readonly<Record<string, string | number>>, where: string): ParamValues {
  for (const key of Object.keys(given)) {
    if (!(key in def.params)) {
      throw new Error(`${where}: unknown parameter "${key}" (known: ${Object.keys(def.params).join(', ')})`);
    }
  }
  const values: Record<string, string | number> = {};
  for (const [key, spec] of Object.entries(def.params)) {
    const value = given[key] ?? spec.default;
    if (spec.type === 'enum') {
      if (typeof value !== 'string' || !spec.values.includes(value)) {
        throw new Error(`${where}: "${key}" must be one of ${spec.values.join(', ')}, got ${String(value)}`);
      }
    } else if (spec.type === 'token') {
      if (typeof value !== 'string' || !(value in COLOR_VARS)) {
        throw new Error(`${where}: "${key}" must be a color token name, got ${String(value)}`);
      }
    } else if (typeof value !== 'number' || !Number.isFinite(value) || value < spec.min || value > spec.max) {
      throw new Error(`${where}: "${key}" must be a number within ${spec.min}..${spec.max}, got ${String(value)}`);
    }
    values[key] = value;
  }
  return values;
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** `--fx-<family>-<param>` declarations, in parameter order. */
export function paramDeclarations(def: FamilyDefinition, values: ParamValues): [string, string][] {
  return Object.entries(def.params).map(([key, spec]) => {
    const value = values[key];
    const css =
      spec.type === 'length'
        ? `${value}px`
        : spec.type === 'angle'
          ? `${value}deg`
          : spec.type === 'token'
            ? `var(${COLOR_VARS[value as ColorToken]})`
            : String(value);
    return [`--fx-${def.name}-${kebab(key)}`, css];
  });
}
```

`src/study/families/index.ts`:

```ts
import type { FamilyDefinition } from './types';

/** Every family a study theme may use, by name. */
export const FAMILIES: Readonly<Record<string, FamilyDefinition>> = {};
```

- [ ] **Step 6: Extend the compiler with families, texture, parameters and the signature**

In `src/study/compile.ts`, add these imports below the existing ones (`resolveColor` is already imported from Task 2):

```ts
import { stripComments, topLevelBlocks } from './css';
import { lintFlourishCss, lintSignature } from './lint';
import { FAMILIES } from './families';
import { paramDeclarations, resolveParams } from './families/params';
import type { FamilyDefinition, FillContext } from './families/types';
```

Replace `CompileOptions` with:

```ts
export interface CompileOptions {
  /** First line of the stylesheet's header comment. */
  readonly banner?: string;
  /** Contents of the theme's signature CSS. */
  readonly signature?: string;
  /** Family registry. Defaults to the study's families. */
  readonly families?: Readonly<Record<string, FamilyDefinition>>;
}
```

Add above `compileTheme`:

```ts
export const scopePrelude = (id: string) =>
  `@scope ([data-theme="${id}"]) to ([data-theme]:not([data-theme="${id}"]))`;

interface FlourishPart {
  readonly label: string;
  readonly rules: readonly string[];
  readonly keyframes: readonly string[];
}

/** Splits a flourish file into rules (scoped) and keyframes (top level, renamed nbc-<id>-<prefix>-<name>). */
function flourishPart(css: string, id: string, prefix: string, label: string): FlourishPart {
  const blocks = topLevelBlocks(stripComments(css));
  const names = blocks
    .map((b) => b.prelude.match(/^@keyframes\s+([\w-]+)$/)?.[1])
    .filter((n): n is string => n !== undefined);
  const rename = (text: string) =>
    names.reduce((t, n) => t.replace(new RegExp(`(?<![\\w-])${n}(?![\\w-])`, 'g'), `nbc-${id}-${prefix}-${n}`), text);
  const rules: string[] = [];
  const keyframes: string[] = [];
  for (const block of blocks) {
    const text = rename(`${block.prelude} {${block.body}}`);
    (/^@keyframes\b/.test(block.prelude) ? keyframes : rules).push(text);
  }
  return { label, rules, keyframes };
}

const indent = (text: string) =>
  text
    .split('\n')
    .map((line) => (line.trim() ? `  ${line}` : line))
    .join('\n');

function renderFlourishBlock(id: string, parts: readonly FlourishPart[]): string {
  const rules = parts.filter((p) => p.rules.length).map((p) => `  /* ${p.label} */\n${indent(p.rules.join('\n'))}`);
  const keyframes = parts.flatMap((p) => p.keyframes);
  if (!rules.length && !keyframes.length) return '';
  const scoped = rules.length ? `${scopePrelude(id)} {\n${rules.join('\n\n')}\n}` : '';
  return `@layer nbc.flourish {\n${[scoped, ...keyframes].filter(Boolean).join('\n\n')}\n}`;
}
```

Replace `compileTheme` with:

```ts
export function compileTheme(theme: StudyThemeInput, options: CompileOptions = {}): CompiledTheme {
  const registry = options.families ?? FAMILIES;
  const uses = (theme.families ?? []).map((use) => {
    const def = registry[use.family];
    if (!def) throw new Error(`${theme.id}: unknown family "${use.family}"`);
    return { def, values: resolveParams(def, use.params, `${theme.id}/${use.family}`) };
  });

  const signature = options.signature?.trim() ? options.signature : undefined;
  const problems = [
    ...uses.flatMap(({ def }) => lintFlourishCss(def.css, `family ${def.name}`)),
    ...(signature ? lintSignature(signature, `${theme.id} signature`) : []),
  ];
  if (problems.length) throw new Error(`${theme.id}: flourish CSS problems:\n- ${problems.join('\n- ')}`);

  const tokens = compileTokens(theme);
  const ctx: FillContext = { color: (token, scheme) => resolveColor(tokens, COLOR_VARS[token], scheme) };
  const layers = uses.flatMap(({ def, values }) => def.texture?.(values, ctx) ?? []);
  if (layers.length) tokens.set('--nbc-texture', layers.join(', '));
  for (const { def, values } of uses) {
    for (const [name, value] of paramDeclarations(def, values)) tokens.set(name, value);
  }

  const parts = [
    ...uses.map(({ def }) => flourishPart(def.css, theme.id, def.name, `family: ${def.name}`)),
    ...(signature ? [flourishPart(signature, theme.id, 'signature', 'signature')] : []),
  ];
  const flourish = renderFlourishBlock(theme.id, parts);
  const header = `/* ${options.banner ?? `study theme: ${theme.id}`} — generated from src/study, do not edit */\n${LAYER_STATEMENT}\n`;
  const css = `${header}\n${renderTokenBlock(theme.id, tokens)}\n${flourish ? `\n${flourish}\n` : ''}`;
  return { id: theme.id, tokens, css, ...fontsOutput(theme) };
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run src/study && npx tsc -p tsconfig.json && npx eslint src/study`
Expected: PASS (all study tests, including Task 2's — the token block is unchanged for themes without families); typecheck and lint clean.

- [ ] **Step 8: Commit**

```bash
git add src/study/css.ts src/study/lint.ts src/study/families src/study/compile.ts src/study/lint.test.ts src/study/families.test.ts
git commit -m "feat(study): detail families, flourish lint and donut scoping

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---
### Task 4: Families `concrete` and `grid`

**Files:**
- Create: `src/study/families/concrete/family.css`, `src/study/families/concrete/family.ts`, `src/study/families/grid/family.css`, `src/study/families/grid/family.ts`
- Modify: `src/study/families/index.ts`
- Test: `src/study/families-builtin.test.ts`

**Interfaces:**
- Consumes (Tasks 2–3): `defineFamily`, `FamilyDefinition`, `lightDark`, `withAlpha`, `compileTheme`, `lintFlourishCss`, `FIXTURE`, `ColorToken`, `LANGS`; `resolveStops` from `src/lib/themes/color.ts`.
- Produces: `concrete(params?)` with params `{ grain?: number (0–0.12, default 0.06); formwork?: number (0–0.12, default 0.05); board?: number px (8–64, default 18); ink?: ColorToken (default 'fg') }`; `grid(params?)` with params `{ cell?: number px (8–96, default 24); strength?: number (0–0.12, default 0.08); line?: ColorToken (default 'border') }`; `FAMILIES = { concrete, grid }` (definitions). Theme files import helpers from `src/study/families` (`import { concrete, grid } from '../../families';`).

- [ ] **Step 1: Write the failing test**

`src/study/families-builtin.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { resolveStops } from '../lib/themes/color';
import { compileTheme } from './compile';
import { lintFlourishCss } from './lint';
import { FAMILIES, concrete, grid } from './families';
import { FIXTURE } from './__fixtures__/fixture';
import { LANGS } from './types';

describe('built-in families', () => {
  it('registers concrete and grid under their own names', () => {
    expect(Object.keys(FAMILIES).sort()).toEqual(['concrete', 'grid']);
    for (const [name, def] of Object.entries(FAMILIES)) expect(def.name).toBe(name);
  });

  it('ships lint-clean CSS and bilingual documentation', () => {
    for (const def of Object.values(FAMILIES)) {
      expect(lintFlourishCss(def.css, def.name)).toEqual([]);
      for (const lang of LANGS) {
        expect(def.description[lang].trim(), `${def.name} description.${lang}`).not.toBe('');
        for (const [key, spec] of Object.entries(def.params)) expect(spec.description[lang].trim(), `${def.name}.${key}`).not.toBe('');
      }
    }
  });

  it('texture stops are resolvable, translucent hex in both schemes', () => {
    for (const use of [concrete(), grid(), concrete({ formwork: 0 }), concrete({ grain: 0 }), grid({ line: 'accent' })]) {
      const { tokens } = compileTheme({ ...FIXTURE, families: [use] });
      for (const scheme of ['light', 'dark'] as const) {
        const stops = resolveStops(tokens as Map<string, string>, '--nbc-texture', scheme);
        expect(stops.length).toBeGreaterThan(0);
        for (const stop of stops) expect(stop).toMatch(/^#[0-9a-f]{8}$/);
      }
    }
  });

  it('concrete with both strengths at 0 adds no texture', () => {
    expect(compileTheme({ ...FIXTURE, families: [concrete({ grain: 0, formwork: 0 })] }).tokens.get('--nbc-texture')).toBe('none');
  });

  it('grid draws both axes at the cell size; concrete marks boards at the board width', () => {
    const g = compileTheme({ ...FIXTURE, families: [grid({ cell: 32 })] }).tokens.get('--nbc-texture')!;
    expect(g.match(/0 0 \/ 32px 32px/g)).toHaveLength(2);
    const c = compileTheme({ ...FIXTURE, families: [concrete({ board: 22 })] }).tokens.get('--nbc-texture')!;
    expect(c).toContain('transparent 1px 22px)');
  });

  it('layers from several families join in the order the theme lists them', () => {
    const { tokens } = compileTheme({ ...FIXTURE, families: [grid(), concrete({ grain: 0 })] });
    const texture = tokens.get('--nbc-texture')!;
    expect(texture.indexOf('linear-gradient(to right')).toBeLessThan(texture.indexOf('repeating-linear-gradient'));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/study/families-builtin.test.ts`
Expected: FAIL — `concrete` / `grid` are not exported from `./families`.

- [ ] **Step 3: Write the families**

`src/study/families/concrete/family.css`:

```css
/* Concrete: the page itself is cast. --nbc-texture already sits behind every
   slab (cards, dialogs, tables, alerts); this pours it behind the theme root
   and the card footers too. */
:scope {
  background: var(--nbc-texture), var(--nbc-bg);
}
.nbc-card__footer {
  background: var(--nbc-texture), var(--nbc-surface-alt);
}
```

`src/study/families/concrete/family.ts`:

```ts
import { defineFamily } from '../types';
import { lightDark, withAlpha } from '../../color';
import type { ColorToken } from '../../types';
import css from './family.css?raw';

export const concrete = defineFamily({
  name: 'concrete',
  description: {
    es: 'Hormigón visto: las marcas horizontales del encofrado de tablas y un moteado fino, detrás de la página y de cada losa.',
    en: 'Exposed concrete: the horizontal marks of board formwork and a fine speckle, behind the page and every slab.',
  },
  touches: ['nbc-root', 'nbc-card', 'nbc-dialog', 'nbc-table', 'nbc-alert'],
  params: {
    grain: {
      type: 'number', default: 0.06, min: 0, max: 0.12,
      description: { es: 'Opacidad del moteado (0 lo quita).', en: 'Speckle opacity (0 removes it).' },
    },
    formwork: {
      type: 'number', default: 0.05, min: 0, max: 0.12,
      description: { es: 'Opacidad de las marcas de tabla (0 las quita).', en: 'Board-mark opacity (0 removes them).' },
    },
    board: {
      type: 'length', default: 18, min: 8, max: 64,
      description: { es: 'Ancho de cada tabla del encofrado, en px.', en: 'Width of each formwork board, in px.' },
    },
    ink: {
      type: 'token', default: 'fg',
      description: { es: 'Token de color de marcas y moteado.', en: 'Color token of the marks and speckle.' },
    },
  },
  css,
  texture: (values, ctx) => {
    const ink = values.ink as ColorToken;
    const tint = (alpha: number) => lightDark(withAlpha(ctx.color(ink, 'light'), alpha), withAlpha(ctx.color(ink, 'dark'), alpha));
    const grain = Number(values.grain);
    const formwork = Number(values.formwork);
    const layers: string[] = [];
    if (formwork > 0) layers.push(`repeating-linear-gradient(0deg, ${tint(formwork)} 0 1px, transparent 1px ${values.board}px)`);
    if (grain > 0) {
      layers.push(`radial-gradient(${tint(grain)} 0.6px, transparent 1px) 0 0 / 7px 7px`);
      layers.push(`radial-gradient(${tint(grain)} 0.5px, transparent 0.9px) 3px 4px / 11px 13px`);
    }
    return layers;
  },
});
```

`src/study/families/grid/family.css`:

```css
/* Grid: the module runs through every slab via --nbc-texture; this carries
   it into card footers too, so header, body and footer share one drawing. */
.nbc-card__footer {
  background: var(--nbc-texture), var(--nbc-surface-alt);
}
```

`src/study/families/grid/family.ts`:

```ts
import { defineFamily } from '../types';
import { lightDark, withAlpha } from '../../color';
import type { ColorToken } from '../../types';
import css from './family.css?raw';

export const grid = defineFamily({
  name: 'grid',
  description: {
    es: 'Una retícula modular dibujada sobre cada losa: la medida del sistema, a la vista.',
    en: 'A modular grid drawn on every slab: the measure of the system, made visible.',
  },
  touches: ['nbc-card', 'nbc-dialog', 'nbc-table', 'nbc-alert'],
  params: {
    cell: {
      type: 'length', default: 24, min: 8, max: 96,
      description: { es: 'Tamaño del módulo, en px.', en: 'Module size, in px.' },
    },
    strength: {
      type: 'number', default: 0.08, min: 0, max: 0.12,
      description: { es: 'Opacidad de las líneas.', en: 'Line opacity.' },
    },
    line: {
      type: 'token', default: 'border',
      description: { es: 'Token de color de las líneas.', en: 'Color token of the lines.' },
    },
  },
  css,
  texture: (values, ctx) => {
    const line = values.line as ColorToken;
    const alpha = Number(values.strength);
    const c = lightDark(withAlpha(ctx.color(line, 'light'), alpha), withAlpha(ctx.color(line, 'dark'), alpha));
    const size = `${values.cell}px ${values.cell}px`;
    return [
      `linear-gradient(to right, ${c} 1px, transparent 1px) 0 0 / ${size}`,
      `linear-gradient(to bottom, ${c} 1px, transparent 1px) 0 0 / ${size}`,
    ];
  },
});
```

Replace `src/study/families/index.ts` with:

```ts
import { concrete } from './concrete/family';
import { grid } from './grid/family';
import type { FamilyDefinition } from './types';

/** Every family a study theme may use, by name. */
export const FAMILIES: Readonly<Record<string, FamilyDefinition>> = {
  concrete: concrete.definition,
  grid: grid.definition,
};

export { concrete, grid };
```

Why the texture lands where it does: core component CSS already paints `background: var(--nbc-texture), var(--nbc-surface-fill)` on cards, dialogs and tables (`src/lib/Card/Card.css:12`, `Dialog.css:12`, `Table.css:17`), so a family only adds the places core CSS leaves untextured. The shorthand `background` is required wherever layers carry `0 0 / 7px 7px` position/size — `background-image` would reject them.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/study && npx tsc -p tsconfig.json && npx eslint src/study`
Expected: PASS; typecheck and lint clean.

- [ ] **Step 5: Commit**

```bash
git add src/study/families src/study/families-builtin.test.ts
git commit -m "feat(study): concrete and grid detail families

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 5: Validation, theme registry and the study contract

**Files:**
- Create: `src/study/validate.ts`, `src/study/registry.ts`, `src/study/contract.ts`
- Modify: `src/lib/themes/color.ts` (add `composite`)
- Test: `src/study/validate.test.ts`, `src/study/contract.test.ts`, `src/study/study.test.ts`

**Interfaces:**
- Consumes (Tasks 1–4): every type in `types.ts`, `FONTS`, `compileTheme`, `FIXTURE`; `NEO_THEMES` (`src/lib/themes/index.ts`); `COLOR_TOKENS`, `CONTRAST_PAIRS`, `REQUIRED_TOKENS` (`src/lib/themes/contract.ts`); `contrastRatio`, `resolveColor`, `resolveStops` (`src/lib/themes/color.ts`).
- Produces:
  - `composite(top: string, bottom: string): string` in `src/lib/themes/color.ts` — `top` over `bottom` over white, as opaque `#rrggbb`.
  - `ID_PATTERN`, `markers(text): number[]`, `referenceProblems(ref, where)`, `fichaProblems(ficha, sourceCount, where)`, `themeProblems(theme)`, `coreFichaProblems(id, ficha)` — each returns `string[]` (empty = valid) (`src/study/validate.ts`).
  - `interface RegisteredTheme { path: string; theme: StudyThemeInput; signature?: string }`, `STUDY_THEMES: readonly RegisteredTheme[]` (sorted by path), `registryProblems(entries?): string[]` (`src/study/registry.ts`).
  - `THEME_CSS_BUDGET = 12288`, `contractProblems(id, tokens, css): string[]` (`src/study/contract.ts`).

- [ ] **Step 1: Write the failing tests**

`src/study/validate.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { FIXTURE } from './__fixtures__/fixture';
import { themeProblems } from './validate';
import { registryProblems } from './registry';
import type { StudyThemeInput } from './types';

const ref = FIXTURE.reference;
const problems = (patch: Partial<StudyThemeInput>) => themeProblems({ ...FIXTURE, ...patch }).join('\n');

describe('themeProblems', () => {
  it('accepts the fixture', () => {
    expect(themeProblems(FIXTURE)).toEqual([]);
  });

  it.each([
    [{ id: 'Bad_ID' }, /id must match/],
    [{ id: 'classic' }, /collides with a core theme id/],
    [{ scene: 'origins' as never }, /scene must be one of japan, germany, usa, latam/],
    [{ name: { es: '', en: 'Fixture' } }, /fixture\.name\.es: empty/],
    [{ reference: { ...ref, sources: [ref.sources[0]] } }, /needs at least 2, has 1/],
    [{ reference: { ...ref, sources: [ref.sources[1], { ...ref.sources[1], title: 'Other' }] } }, /at least one source must not be on wikipedia\.org/],
    [{ reference: { ...ref, sources: [{ ...ref.sources[0], url: 'http://example.org/one' as never }, ref.sources[1]] } }, /not https/],
    [{ reference: { ...ref, sources: [{ ...ref.sources[0], accessed: '5/10/2026' }, ref.sources[1]] } }, /accessed must be YYYY-MM-DD/],
    [{ reference: { ...ref, date: [1981, 1971] } }, /not a year or an ordered range/],
    [{ reference: { ...ref, original: { text: 'Testwerk', lang: 'German' } } }, /BCP 47/],
    [{ ficha: { ...FIXTURE.ficha, documented: { es: 'Un hecho [1]. Otro [3].', en: 'A fact [1]. Another [3].' } } }, /marker \[3\] has no source/],
    [{ ficha: { ...FIXTURE.ficha, documented: { es: 'Un hecho [1]. Otro [2].', en: 'A fact [1]. Another.' } } }, /markers differ between es/],
    [{ ficha: { ...FIXTURE.ficha, documented: { es: 'Un hecho [1].', en: 'A fact [1].' } } }, /source \[2\] is never cited/],
    [{ reference: { ...ref, archiveUrl: 'https://archive.org/x' as never } }, /web\.archive\.org/],
    [{ fonts: { sans: 'comic-sans' as never } }, /unknown font "comic-sans"/],
  ])('rejects %o', (patch, message) => {
    expect(problems(patch as Partial<StudyThemeInput>)).toMatch(message);
  });

  it('checks image credits: license whitelist, Commons source, avif name, alt text', () => {
    const image = {
      file: 'fixture.avif', width: 1600, height: 1067, author: 'Someone',
      license: 'CC-BY-SA-4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fixture.jpg',
      alt: { es: 'Una foto.', en: 'A photo.' },
    } as const;
    expect(themeProblems({ ...FIXTURE, reference: { ...ref, image } })).toEqual([]);
    expect(problems({ reference: { ...ref, image: { ...image, license: 'CC-BY-NC-4.0' as never } } })).toMatch(/license "CC-BY-NC-4\.0" is not allowed/);
    expect(problems({ reference: { ...ref, image: { ...image, sourceUrl: 'https://flickr.com/x' as never } } })).toMatch(/Commons file page/);
    expect(problems({ reference: { ...ref, image: { ...image, file: 'Fixture.JPG' } } })).toMatch(/kebab-case \.avif/);
    expect(problems({ reference: { ...ref, image: { ...image, alt: { es: '', en: 'A photo.' } } } })).toMatch(/image\.alt\.es: empty/);
  });
});

describe('registryProblems (Review Focus 5)', () => {
  it('reports a theme outside themes/<scene>/<id>.ts, duplicates and missing signatures', () => {
    const entries = [
      { path: './themes/japan/fixture.ts', theme: FIXTURE },
      { path: './themes/germany/fixture.ts', theme: FIXTURE },
      { path: './themes/germany/fixture.ts', theme: { ...FIXTURE, id: 'other', signature: './other.css' } },
    ];
    const report = registryProblems(entries).join('\n');
    expect(report).toMatch(/\.\/themes\/japan\/fixture\.ts: a theme with id "fixture" and scene "germany" must live at \.\/themes\/germany\/fixture\.ts/);
    expect(report).toMatch(/fixture: duplicate id/);
    expect(report).toMatch(/other: signature \.\/other\.css not found next to the theme file/);
  });
});
```

`src/study/contract.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { composite } from '../lib/themes/color';
import { compileTheme } from './compile';
import { contractProblems, THEME_CSS_BUDGET } from './contract';
import { FIXTURE } from './__fixtures__/fixture';

describe('composite', () => {
  it('paints translucent over opaque, flattening onto white', () => {
    expect(composite('#00000080', '#ffffff')).toBe('#7f7f7f');
    expect(composite('#ff0000', '#00ff00')).toBe('#ff0000');
    expect(composite('#0000ff00', '#123456')).toBe('#123456');
  });
});

describe('contractProblems', () => {
  it('passes the fixture', () => {
    const { tokens, css } = compileTheme(FIXTURE);
    expect(contractProblems('fixture', tokens, css)).toEqual([]);
  });

  it('reports a missing token', () => {
    const tokens = new Map(compileTheme(FIXTURE).tokens);
    tokens.delete('--nbc-focus');
    expect(contractProblems('fixture', tokens, '')).toEqual(['fixture: missing --nbc-focus']);
  });

  it('reports a failing contrast pair with both colors and the ratio', () => {
    const { tokens, css } = compileTheme({ ...FIXTURE, colors: { ...FIXTURE.colors, fgMuted: ['#9a9a9a', '#aaaaaa'] } });
    expect(contractProblems('fixture', tokens, css).join('\n')).toMatch(
      /fixture\/light: --nbc-fg-muted #9a9a9a on --nbc-surface #ffffff = 2\.\d\d < 4\.5/,
    );
  });

  it('reports a texture that drags text below 4.5:1', () => {
    const { tokens, css } = compileTheme(FIXTURE);
    const dark = new Map(tokens);
    dark.set('--nbc-texture', 'linear-gradient(#111111cc 1px, transparent 1px) 0 0 / 8px 8px');
    expect(contractProblems('fixture', dark, css).join('\n')).toMatch(/--nbc-fg on texture #111111cc/);
  });

  it('reports a stylesheet over budget', () => {
    const { tokens } = compileTheme(FIXTURE);
    expect(contractProblems('fixture', tokens, 'x'.repeat(THEME_CSS_BUDGET + 1))).toEqual([
      `fixture: theme CSS is ${THEME_CSS_BUDGET + 1} bytes, the budget is ${THEME_CSS_BUDGET}`,
    ]);
  });
});
```

`src/study/study.test.ts` (the suite every real study theme must pass; Tasks 7 and 9–12 extend it):

```ts
/**
 * Every study theme in src/study/themes: valid ficha, compiles, meets the
 * token contract in both schemes, ships its image within budget.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STUDY_THEMES, registryProblems } from './registry';
import { themeProblems } from './validate';
import { compileTheme } from './compile';
import { contractProblems } from './contract';

const DIR = dirname(fileURLToPath(import.meta.url));
const IMAGE_BUDGET = 250_000;

describe('study registry', () => {
  it('every theme lives at themes/<scene>/<id>.ts, ids are unique, signatures exist', () => {
    expect(registryProblems()).toEqual([]);
  });
});

for (const { theme, signature } of STUDY_THEMES) {
  describe(`study theme "${theme.id}"`, () => {
    it('passes validation: id, bilingual text, sources, markers, image credit', () => {
      expect(themeProblems(theme)).toEqual([]);
    });

    it('compiles and meets the token contract in both schemes', () => {
      const compiled = compileTheme(theme, { signature });
      expect(contractProblems(theme.id, compiled.tokens, compiled.css)).toEqual([]);
    });

    it.runIf(theme.reference.image !== undefined)('ships its image within budget', () => {
      const file = join(DIR, 'images', theme.reference.image!.file);
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size).toBeLessThanOrEqual(IMAGE_BUDGET);
    });
  });
}
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/study/validate.test.ts src/study/contract.test.ts src/study/study.test.ts`
Expected: FAIL — `Failed to resolve import "./validate"`, `"./registry"`, `"./contract"`; `composite` is not exported.

- [ ] **Step 3: Add `composite` to the library's color tooling**

Append to `src/lib/themes/color.ts` (it is not part of the published API; `over` and `toRGBA` are already defined in the file):

```ts
/** `top` painted over `bottom` (both #hex, alpha allowed), flattened onto white: an opaque #rrggbb. */
export function composite(top: string, bottom: string): string {
  const [r, g, b] = over(toRGBA(top), over(toRGBA(bottom), [255, 255, 255, 1]));
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
}
```

- [ ] **Step 4: Write validation, registry and contract**

`src/study/validate.ts`:

```ts
/**
 * Mechanical checks of a study theme and of the core fichas (spec D1, D7, D8).
 * Every function returns a list of problems; empty means valid.
 */
import { NEO_THEMES } from '../lib/themes';
import { FONTS } from './fonts';
import { IMAGE_LICENSES, LANGS, PALETTE_ORIGINS, REFERENCE_KINDS, SCENES, THEME_SCENES } from './types';
import type { CoreFicha, Ficha, L10n, Reference, StudyThemeInput } from './types';

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
  let independent = 0;
  ref.sources.forEach((source, i) => {
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
  if (ref.sources.length >= 2 && independent === 0) {
    problems.push(`${where}.sources: at least one source must not be on wikipedia.org`);
  }
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

`src/study/registry.ts`:

```ts
/**
 * Every study theme file, loaded eagerly — for tests and scripts/build-study.mjs
 * only. The site never imports this (it would bundle every ficha).
 */
import type { StudyThemeInput } from './types';

const modules = import.meta.glob<{ default: StudyThemeInput }>('./themes/*/*.ts', { eager: true });
const signatures = import.meta.glob<string>('./themes/*/*.css', { eager: true, query: '?raw', import: 'default' });

export interface RegisteredTheme {
  /** Glob key, e.g. './themes/japan/nakagin.ts'. */
  readonly path: string;
  readonly theme: StudyThemeInput;
  /** Contents of the signature file, when the theme declares one and it exists. */
  readonly signature?: string;
}

export const STUDY_THEMES: readonly RegisteredTheme[] = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, module]) => {
    const theme = module.default;
    const key = theme.signature ? `${path.slice(0, path.lastIndexOf('/'))}/${theme.signature.replace(/^\.\//, '')}` : undefined;
    return { path, theme, signature: key ? signatures[key] : undefined };
  });

export function registryProblems(entries: readonly RegisteredTheme[] = STUDY_THEMES): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const { path, theme, signature } of entries) {
    const expected = `./themes/${theme.scene}/${theme.id}.ts`;
    if (path !== expected) {
      problems.push(`${path}: a theme with id "${theme.id}" and scene "${theme.scene}" must live at ${expected}`);
    }
    if (seen.has(theme.id)) problems.push(`${theme.id}: duplicate id`);
    seen.add(theme.id);
    if (theme.signature && signature === undefined) {
      problems.push(`${theme.id}: signature ${theme.signature} not found next to the theme file`);
    }
  }
  return problems;
}
```

`src/study/contract.ts`:

```ts
/**
 * The token contract, applied to a compiled study theme (spec D3, D6):
 * required tokens, resolvable colors, every WCAG pair in both schemes,
 * texture over every ground, and the size budget.
 */
import { COLOR_TOKENS, CONTRAST_PAIRS, REQUIRED_TOKENS } from '../lib/themes/contract';
import { composite, contrastRatio, resolveColor, resolveStops } from '../lib/themes/color';
import type { Scheme } from '../lib/themes/color';

export const THEME_CSS_BUDGET = 12 * 1024;
const SCHEMES: readonly Scheme[] = ['light', 'dark'];

export function contractProblems(id: string, compiledTokens: ReadonlyMap<string, string>, css: string): string[] {
  const tokens = compiledTokens as Map<string, string>;
  const missing = REQUIRED_TOKENS.filter((t) => !tokens.has(t)).map((t) => `${id}: missing ${t}`);
  if (missing.length) return missing;

  const problems: string[] = [];
  for (const scheme of SCHEMES) {
    for (const name of COLOR_TOKENS) {
      try {
        resolveColor(tokens, name, scheme);
      } catch (error) {
        problems.push(`${id}/${scheme}: ${name}: ${(error as Error).message}`);
      }
    }
  }
  if (problems.length) return problems;

  for (const scheme of SCHEMES) {
    const page = resolveColor(tokens, '--nbc-bg', scheme);
    for (const pair of CONTRAST_PAIRS) {
      const fg = resolveColor(tokens, pair.fg, scheme);
      for (const bg of resolveStops(tokens, pair.bg, scheme)) {
        const ratio = contrastRatio(fg, bg, page);
        if (ratio < pair.min) {
          problems.push(`${id}/${scheme}: ${pair.fg} ${fg} on ${pair.bg} ${bg} = ${ratio.toFixed(2)} < ${pair.min} (${pair.why})`);
        }
      }
    }
    if (tokens.get('--nbc-texture') !== 'none') {
      // Each ground keeps the text pairs CONTRAST_PAIRS demands of it.
      const grounds: [string, readonly string[]][] = [
        ...resolveStops(tokens, '--nbc-surface-fill', scheme).map((c): [string, readonly string[]] => [c, ['--nbc-fg', '--nbc-fg-muted']]),
        [resolveColor(tokens, '--nbc-surface-alt', scheme), ['--nbc-fg']],
        [page, ['--nbc-fg', '--nbc-fg-muted']],
      ];
      for (const stop of resolveStops(tokens, '--nbc-texture', scheme)) {
        for (const [ground, inks] of grounds) {
          const textured = composite(stop, composite(ground, page));
          for (const ink of inks) {
            const ratio = contrastRatio(resolveColor(tokens, ink, scheme), textured);
            if (ratio < 4.5) problems.push(`${id}/${scheme}: ${ink} on texture ${stop} over ${ground} = ${ratio.toFixed(2)} < 4.5`);
          }
        }
      }
    }
  }

  const bytes = new TextEncoder().encode(css).length;
  if (bytes > THEME_CSS_BUDGET) problems.push(`${id}: theme CSS is ${bytes} bytes, the budget is ${THEME_CSS_BUDGET}`);
  return problems;
}
```

`src/study/themes/` does not exist yet: `import.meta.glob` returns `{}` and the per-theme loop in `study.test.ts` defines no tests; the registry test still runs.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run && npx tsc -p tsconfig.json && npx eslint src/study src/lib/themes/color.ts`
Expected: PASS (whole suite, including the existing 649 library tests); typecheck and lint clean.

- [ ] **Step 6: Commit**

```bash
git add src/study/validate.ts src/study/registry.ts src/study/contract.ts src/lib/themes/color.ts src/study/validate.test.ts src/study/contract.test.ts src/study/study.test.ts
git commit -m "feat(study): ficha validation, theme registry and the study contract

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 6: Image pipeline (Wikimedia Commons → AVIF)

**Files:**
- Create: `src/study/commons.ts`, `scripts/fetch-image.mjs`, `src/study/images/NOTICE`
- Modify: `package.json` (devDependency `sharp`, script `fetch:image`)
- Test: `src/study/commons.test.ts`

**Interfaces:**
- Consumes (Task 1): `ImageLicense`.
- Produces: `licenseFromCommons(shortName): ImageLicense | null`, `plainText(html): string`, `commonsApiUrl(fileTitle, width?): string`, `fileTitleFromUrl(url): string` (`src/study/commons.ts`); the CLI `npm run fetch:image -- <commons file page URL> <kebab-name>`, which writes `src/study/images/<kebab-name>.avif` and prints the `image: { … }` block for a ficha (alt text left empty on purpose — validation fails until it is written in both languages).

- [ ] **Step 1: Write the failing test**

`src/study/commons.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { commonsApiUrl, fileTitleFromUrl, licenseFromCommons, plainText } from './commons';

describe('Commons helpers', () => {
  it.each([
    ['CC BY-SA 4.0', 'CC-BY-SA-4.0'],
    ['CC BY 2.0', 'CC-BY-2.0'],
    ['cc by-sa 3.0', 'CC-BY-SA-3.0'],
    ['CC0', 'CC0-1.0'],
    ['Public domain', 'PD'],
    ['CC BY-NC 2.0', null],
    ['CC BY-ND 4.0', null],
    ['Fair use', null],
    ['GFDL', null],
    ['', null],
  ])('maps the license "%s" to %s', (shortName, expected) => {
    expect(licenseFromCommons(shortName)).toBe(expected);
  });

  it('turns Commons HTML metadata into plain text', () => {
    expect(plainText('<a href="//commons.wikimedia.org/wiki/User:X">Jan&nbsp;Smit</a>  &amp; <i>Ana</i>')).toBe('Jan Smit & Ana');
  });

  it('extracts the file title from a Commons file page URL', () => {
    expect(fileTitleFromUrl('https://commons.wikimedia.org/wiki/File:Nakagin_Capsule_Tower_%282%29.jpg')).toBe(
      'File:Nakagin_Capsule_Tower_(2).jpg',
    );
    expect(() => fileTitleFromUrl('https://flickr.com/photos/x')).toThrow(/not a Commons file page URL/);
  });

  it('asks the API for metadata and a ≤1600px thumbnail', () => {
    const url = new URL(commonsApiUrl('File:Example.jpg'));
    expect(url.origin + url.pathname).toBe('https://commons.wikimedia.org/w/api.php');
    expect(url.searchParams.get('titles')).toBe('File:Example.jpg');
    expect(url.searchParams.get('iiprop')).toBe('url|size|extmetadata');
    expect(url.searchParams.get('iiurlwidth')).toBe('1600');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/study/commons.test.ts`
Expected: FAIL — `Failed to resolve import "./commons"`.

- [ ] **Step 3: Write the helpers, the script and the notice**

`src/study/commons.ts`:

```ts
/** Pure helpers for scripts/fetch-image.mjs (Wikimedia Commons API). */
import type { ImageLicense } from './types';

/** Commons `LicenseShortName` → our license id; null when not allowed (NC, ND, fair use, GFDL-only, unknown). */
export function licenseFromCommons(shortName: string): ImageLicense | null {
  const s = shortName.trim().toLowerCase().replace(/\s+/g, ' ');
  if (s === 'cc0' || s === 'cc0 1.0' || s === 'cc-zero') return 'CC0-1.0';
  if (s === 'public domain' || s === 'pd') return 'PD';
  const m = s.match(/^cc by(-sa)? (2\.0|2\.5|3\.0|4\.0)$/);
  return m ? (`CC-BY${m[1] ? '-SA' : ''}-${m[2]}` as ImageLicense) : null;
}

/** Plain text from Commons HTML metadata: tags stripped, entities decoded, whitespace collapsed. */
export function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** API URL returning the file's metadata and a thumbnail at most `width` px wide. */
export function commonsApiUrl(fileTitle: string, width = 1600): string {
  const params = new URLSearchParams({
    action: 'query',
    titles: fileTitle,
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: String(width),
    format: 'json',
    formatversion: '2',
    origin: '*',
  });
  return `https://commons.wikimedia.org/w/api.php?${params}`;
}

/** 'https://commons.wikimedia.org/wiki/File:Foo_%282%29.jpg' → 'File:Foo_(2).jpg' */
export function fileTitleFromUrl(url: string): string {
  const m = url.match(/^https:\/\/commons\.wikimedia\.org\/wiki\/(File:[^?#]+)$/);
  if (!m) throw new Error(`not a Commons file page URL: ${url}`);
  return decodeURIComponent(m[1]);
}
```

`scripts/fetch-image.mjs`:

```js
// Downloads a Wikimedia Commons photo for a study ficha. Author and license
// come from the Commons API — never typed by hand. Converts to AVIF, at most
// 1600 px wide and 250 000 bytes, into src/study/images/<name>.avif, and
// prints the `image: { … }` block to paste into the ficha.
//
//   npm run fetch:image -- https://commons.wikimedia.org/wiki/File:Example.jpg nakagin
import { runnerImport } from 'vite';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/study/images');
const BUDGET = 250_000;
const HEADERS = { 'User-Agent': 'neobrutalistcomponents-study/1.0 (https://github.com/sssamuelll/neobrutalistcomponents)' };

const fail = (message) => {
  console.error(`fetch-image: ${message}`);
  process.exit(1);
};

const [pageUrl, name] = process.argv.slice(2);
if (!pageUrl || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name ?? '')) {
  fail('usage: npm run fetch:image -- <commons file page URL> <kebab-case-name>');
}

const { commonsApiUrl, fileTitleFromUrl, licenseFromCommons, plainText } = (
  await runnerImport(join(ROOT, 'src/study/commons.ts'), { configFile: false, logLevel: 'silent' })
).module;

const title = fileTitleFromUrl(pageUrl);
const response = await fetch(commonsApiUrl(title), { headers: HEADERS });
if (!response.ok) fail(`Commons API answered ${response.status}`);
const info = (await response.json()).query?.pages?.[0]?.imageinfo?.[0];
if (!info) fail(`no image info for ${title}`);

const meta = info.extmetadata ?? {};
const shortName = meta.LicenseShortName?.value ?? '';
const license = licenseFromCommons(shortName);
if (!license) fail(`license "${shortName}" is not allowed (CC0, public domain, CC BY, CC BY-SA only)`);
const author = plainText(meta.Artist?.value ?? '');
if (!author) fail(`${title} states no author`);

const image = await fetch(info.thumburl ?? info.url, { headers: HEADERS });
if (!image.ok) fail(`image download answered ${image.status}`);
const input = Buffer.from(await image.arrayBuffer());

let out;
for (let quality = 55; quality >= 23; quality -= 8) {
  out = await sharp(input).resize({ width: 1600, withoutEnlargement: true }).avif({ quality, effort: 6 }).toBuffer({ resolveWithObject: true });
  if (out.data.length <= BUDGET) break;
}
if (out.data.length > BUDGET) fail(`could not bring ${name}.avif under ${BUDGET} bytes`);

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, `${name}.avif`), out.data);
console.log(`fetch-image: src/study/images/${name}.avif (${out.info.width}×${out.info.height}, ${out.data.length} bytes)\n`);
console.log(`image: {
  file: '${name}.avif',
  width: ${out.info.width},
  height: ${out.info.height},
  alt: { es: '', en: '' }, // describe what the photo shows, in both languages
  author: ${JSON.stringify(author)},
  license: '${license}',
  sourceUrl: '${pageUrl}',
},`);
```

`src/study/images/NOTICE`:

```
Images in this folder are photographs from Wikimedia Commons. Each keeps its
own license (CC0, public domain, CC BY or CC BY-SA); its author, license and
file page are recorded in the ficha of the theme that uses it and shown under
the image on the site. They are not covered by the repository's MIT license
and are never included in the npm package (package.json "files" ships only
dist/ and skills/).
```

In `package.json`, add the script `"fetch:image": "node scripts/fetch-image.mjs"` and install sharp:

```bash
npm install --save-dev sharp
```

- [ ] **Step 4: Run the tests and a real download to verify**

Run: `npx vitest run src/study/commons.test.ts && npx eslint scripts/fetch-image.mjs src/study/commons.ts`
Expected: PASS; lint clean.

Run (network; checks the whole pipeline on a public-domain file, then removes the output):
`npm run fetch:image -- "https://commons.wikimedia.org/wiki/File:Unit%C3%A9_d%27habitation_de_Marseille_(1).jpg" smoke-test; ls -l src/study/images/smoke-test.avif; rm src/study/images/smoke-test.avif`
Expected: the printed block shows an allowed license and a non-empty author; the file is ≤ 250 000 bytes. If that exact file name no longer exists on Commons, use any file listed in the research dossier.

- [ ] **Step 5: Commit**

```bash
git add src/study/commons.ts src/study/commons.test.ts scripts/fetch-image.mjs src/study/images/NOTICE package.json package-lock.json
git commit -m "feat(study): Commons image pipeline with license whitelist

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 7: Fichas of the five core themes

**Files:**
- Create: `src/study/core-fichas.ts`, `src/study/images/vt100.avif`, `src/study/images/riso.avif`
- Modify: `src/study/study.test.ts`

**Interfaces:**
- Consumes (Tasks 1, 5, 6): `CoreFicha`, `coreFichaProblems`, `npm run fetch:image`; `NEO_THEMES`, `THEME_INFO`, `NeoBuiltinTheme` (`src/lib/themes/index.ts`).
- Produces: `CORE_FICHAS: Record<NeoBuiltinTheme, CoreFicha>` (`src/study/core-fichas.ts`) — consumed by Task 8's catalog and build script.

Content rule for this task and Tasks 9–12: every fact, date, name and URL below was verified in the research dossier (`docs/superpowers/plans/2026-10-05-neobrutalism-study-engine.research.md`). Transcribe it exactly; do not add claims. Three core references ship without an image: the Unité d'habitation in Marseille (France has no freedom of panorama, dossier A5), Neue Grafik (cover rights contested, dossier A6) and the Pokémon cards (copyrighted art, dossier A9).

- [ ] **Step 1: Write the failing test**

Add to `src/study/study.test.ts` — the imports at the top (merge `coreFichaProblems` into the existing `./validate` import), the `describe` block at the end:

```ts
import { NEO_THEMES, THEME_INFO } from '../lib/themes';
import { CORE_FICHAS } from './core-fichas';
import { coreFichaProblems, themeProblems } from './validate';
```

```ts
describe('core fichas', () => {
  for (const id of NEO_THEMES) {
    const core = CORE_FICHAS[id];
    it(`${id}: valid ficha, and its English tagline is THEME_INFO's`, () => {
      expect(coreFichaProblems(id, core)).toEqual([]);
      expect(core.tagline.en).toBe(THEME_INFO[id].tagline);
    });
    it.runIf(core.reference.image !== undefined)(`${id}: ships its image within budget`, () => {
      const file = join(DIR, 'images', core.reference.image!.file);
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size).toBeLessThanOrEqual(IMAGE_BUDGET);
    });
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/study/study.test.ts`
Expected: FAIL — `Failed to resolve import "./core-fichas"`.

- [ ] **Step 3: Fetch the two free images**

Run:

```bash
npm run fetch:image -- https://commons.wikimedia.org/wiki/File:DEC_VT100_terminal.jpg vt100
npm run fetch:image -- "https://commons.wikimedia.org/wiki/File:Impress%C3%A3o_em_risografia_em_dua_cores,_2014.jpg" riso
```

Expected: `vt100.avif` 1600×1420, author `Jason Scott`, `CC-BY-2.0`; `riso.avif` 1500×1000 (the original is narrower than 1600 px and is not enlarged), author `Mario Felipe`, `CC-BY-2.0`. These are the values in the file below, read from the Commons API on 2026-10-05. If the script prints different ones, the script wins: use its values and record the difference for Task 13.

- [ ] **Step 4: Write the core fichas**

`src/study/core-fichas.ts`:

```ts
/**
 * Fichas of the five core themes. These themes predate the study: each ficha
 * names the theme's closest documented reference and says so.
 */
import type { NeoBuiltinTheme } from '../lib/themes';
import type { CoreFicha } from './types';

export const CORE_FICHAS: Record<NeoBuiltinTheme, CoreFicha> = {
  classic: {
    scene: 'origins',
    tagline: { es: 'Esta decisión es definitiva.', en: 'This decision is final.' },
    reference: {
      title: { es: 'Unité d’habitation de Marsella', en: 'Unité d’habitation, Marseille' },
      original: { text: 'Unité d’habitation de Marseille (Cité radieuse)', lang: 'fr' },
      authors: ['Le Corbusier'],
      date: [1945, 1952],
      place: { es: 'Marsella, Francia', en: 'Marseille, France' },
      kind: 'architecture',
      sources: [
        {
          title: 'Le Corbusier, Unité d’habitation, Marseille, France, 1945-1952',
          url: 'https://www.fondationlecorbusier.fr/oeuvre-architecture/realisations-unite-dhabitation-marseille-france-1945-1952/',
          publisher: 'Fondation Le Corbusier',
          accessed: '2026-10-05',
        },
        {
          title: 'Du béton brut au brutalisme',
          url: 'https://passerelles.essentiels.bnf.fr/fr/article/471c3dd1-bbab-41dc-ad1f-3a6da99c1a65-beton-brut-brutalisme',
          publisher: 'Bibliothèque nationale de France (Passerelles)',
          accessed: '2026-10-05',
        },
        { title: 'Brutalism', url: 'https://www.tate.org.uk/art/art-terms/b/brutalism', publisher: 'Tate', accessed: '2026-10-05' },
      ],
    },
    ficha: {
      documented: {
        es: 'El bloque de viviendas de Le Corbusier en Marsella, encargado en 1945 e inaugurado en 1952, se levanta sobre pilotis y se hormigonó in situ [1]. En la entrega dijo que había llegado a admirar las huellas que el encofrado dejaba en el hormigón crudo: juntas de tabla, veta, nudos [2]. La palabra brutalismo nace de su expresión béton brut, hormigón crudo [2][3].',
        en: 'Le Corbusier’s housing block in Marseille, commissioned in 1945 and inaugurated in 1952, stands on pilotis and was cast in place in reinforced concrete [1]. At its handover he said he had come to admire the marks the formwork left on the raw concrete: board joints, wood grain, knots [2]. The word brutalism grew out of his term béton brut, raw concrete [2][3].',
      },
      reading: {
        es: 'Este tema es anterior al estudio; el béton brut es su referencia más cercana. La página es gris hormigón, cada superficie es una losa blanca con borde de tinta de 3 px y doble sombra, y el amarillo solar del color principal es del tema, no de Marsella.',
        en: 'This theme predates the study; béton brut is its closest reference. The page is concrete grey, every surface a white slab with a 3 px ink edge and a double shadow, and the sun-yellow primary is the theme’s own, not Marseille’s.',
      },
      palette: {
        origin: 'interpreted',
        note: {
          es: 'El gris hormigón, el blanco y la tinta son una lectura del hormigón crudo; el amarillo y el cobalto son del tema.',
          en: 'Concrete grey, white and ink are a reading of raw concrete; the yellow and cobalt accents are the theme’s own.',
        },
      },
    },
    facets: { border: 'standard', shadow: 'double', corners: 'square' },
    predatesStudy: true,
  },
  swiss: {
    scene: 'origins',
    tagline: { es: 'Precisión, no simpleza.', en: 'Precision, not plainness.' },
    reference: {
      title: { es: 'Neue Grafik (revista)', en: 'Neue Grafik (journal)' },
      original: { text: 'Neue Grafik / New Graphic Design / Graphisme actuel', lang: 'de' },
      authors: ['Josef Müller-Brockmann', 'Richard Paul Lohse', 'Hans Neuburg', 'Carlo Vivarelli'],
      date: [1958, 1965],
      place: { es: 'Suiza', en: 'Switzerland' },
      kind: 'graphic',
      sources: [
        {
          title: 'Neue Grafik/New Graphic Design/Graphisme Actuel 1958–1965',
          url: 'https://www.lars-mueller-publishers.com/neue-grafiknew-graphic-designgraphisme-actuel-1958-1965',
          publisher: 'Lars Müller Publishers',
          year: 2014,
          accessed: '2026-10-05',
        },
        { title: 'Neue Grafik', url: 'https://fontsinuse.com/uses/15395/neue-grafik', publisher: 'Fonts In Use', year: 2017, accessed: '2026-10-05' },
        { title: 'Neue Grafik', url: 'https://en.wikipedia.org/wiki/Neue_Grafik', publisher: 'Wikipedia', accessed: '2026-10-05' },
      ],
    },
    ficha: {
      documented: {
        es: 'Neue Grafik fue una revista trilingüe, en alemán, inglés y francés, editada por Josef Müller-Brockmann, Richard Paul Lohse, Hans Neuburg y Carlo Vivarelli; publicó 18 números entre 1958 y 1965 [1][3]. Lars Müller Publishers, que la reeditó en facsímil en 2014, la llama la plataforma programática del diseño gráfico suizo [1]. La portada solo tipográfica de Vivarelli componía la cabecera y el número en Akzidenz-Grotesk Medium [2].',
        en: 'Neue Grafik was a trilingual journal, in German, English and French, edited by Josef Müller-Brockmann, Richard Paul Lohse, Hans Neuburg and Carlo Vivarelli; it ran to 18 issues between 1958 and 1965 [1][3]. Lars Müller Publishers, which reprinted it in facsimile in 2014, calls it the programmatic platform of Swiss graphic design [1]. Vivarelli’s all-type cover set the masthead and issue number in Akzidenz-Grotesk Medium [2].',
      },
      reading: {
        es: 'Este tema es anterior al estudio; Neue Grafik es su referencia más cercana. Tipografía negra sobre blanco, una sola familia grotesca, filetes finos y una retícula estricta dejan que mande el contenido; el rojo oscuro es del tema, porque la revista era en blanco y negro [2].',
        en: 'This theme predates the study; Neue Grafik is its closest reference. Black type on white, one grotesque family, hairline rules and a strict grid let the content lead; the deep red accent is the theme’s own, as the journal was black and white [2].',
      },
      palette: {
        origin: 'interpreted',
        note: {
          es: 'El negro sobre blanco sigue a la revista; el rojo oscuro es del tema.',
          en: 'Black on white follows the journal; the deep red accent is the theme’s own.',
        },
      },
    },
    facets: { border: 'hairline', shadow: 'none', corners: 'square' },
    predatesStudy: true,
  },
  tech: {
    scene: 'usa',
    tagline: { es: 'Sofisticación de terminal.', en: 'Terminal sophistication.' },
    reference: {
      title: { es: 'Terminal de vídeo DEC VT100', en: 'DEC VT100 video terminal' },
      authors: ['Digital Equipment Corporation'],
      date: 1978,
      place: { es: 'Estados Unidos', en: 'United States' },
      kind: 'object',
      sources: [
        { title: 'VT100 terminal', url: 'https://www.computerhistory.org/collections/catalog/102647895', publisher: 'Computer History Museum', accessed: '2026-10-05' },
        { title: 'DEC VT100', url: 'https://www.york.ac.uk/computer-science/about/news/50-years/exhibition/dec-vt100/', publisher: 'University of York, Department of Computer Science', accessed: '2026-10-05' },
        { title: 'Digital VT100 User Guide: Installation, Interface Information and Specifications', url: 'https://vt100.net/docs/vt100-ug/chapter2.html', publisher: 'Digital Equipment Corporation (VT100.net)', accessed: '2026-10-05' },
        { title: 'Digital VT100 User Guide: Operator Information', url: 'https://vt100.net/docs/vt100-ug/chapter1.html', publisher: 'Digital Equipment Corporation (VT100.net)', accessed: '2026-10-05' },
        { title: 'Phosphors', url: 'https://www.rp-photonics.com/phosphors.html', publisher: 'RP Photonics Encyclopedia', accessed: '2026-10-05' },
      ],
      image: {
        file: 'vt100.avif',
        width: 1600,
        height: 1420,
        alt: { es: 'Un terminal VT100, con texto blanco sobre la pantalla oscura.', en: 'A VT100 terminal, with white text on its dark screen.' },
        author: 'Jason Scott',
        license: 'CC-BY-2.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:DEC_VT100_terminal.jpg',
      },
    },
    ficha: {
      documented: {
        es: 'Digital Equipment Corporation presentó el VT100 en 1978 [1][2]. Su pantalla de 12 pulgadas usaba fósforo P4 y mostraba 24 líneas de 80 caracteres: caracteres claros sobre fondo oscuro, o al revés [3][4]. Fue uno de los primeros terminales compatibles con los códigos de escape ANSI, y DEC vendió más de seis millones de terminales de la serie VT, en buena parte gracias a él [2].',
        en: 'Digital Equipment Corporation introduced the VT100 in 1978 [1][2]. Its 12-inch screen used P4 phosphor and showed 24 lines of 80 characters, light characters on a dark background or the reverse [3][4]. It was one of the first terminals to support ANSI escape codes, and DEC sold more than six million VT-series terminals, largely thanks to it [2].',
      },
      reading: {
        es: 'Este tema es anterior al estudio; el VT100 es su referencia más cercana. La tipografía monoespaciada, la retícula fija y unos atributos limitados a negrita, subrayado e inverso vienen del terminal. El verde fósforo no: el P4 es el fósforo blanco de la televisión en blanco y negro, así que el verde del tema es una interpretación [3][5].',
        en: 'This theme predates the study; the VT100 is its closest reference. Monospace type, a fixed grid and attributes limited to bold, underline and reverse come from the terminal. The phosphor green does not: P4 is the white phosphor of black-and-white television, so the theme’s green is an interpretation [3][5].',
      },
      palette: {
        origin: 'interpreted',
        note: {
          es: 'La pantalla del VT100 era blanca sobre negro; el verde fósforo y el magenta son del tema.',
          en: 'The VT100 screen was white on black; the phosphor green and the magenta are the theme’s own.',
        },
      },
    },
    facets: { border: 'hairline', shadow: 'hard', corners: 'soft' },
    predatesStudy: true,
  },
  y2k: {
    scene: 'japan',
    tagline: { es: 'Energía de carta holográfica.', en: 'Holographic trading-card energy.' },
    reference: {
      title: { es: 'Cartas holográficas del juego de cartas Pokémon', en: 'Holofoil cards of the Pokémon Trading Card Game' },
      original: { text: 'ポケットモンスターカードゲーム', lang: 'ja' },
      authors: ['Creatures Inc.', 'Media Factory'],
      date: 1996,
      place: { es: 'Japón', en: 'Japan' },
      kind: 'object',
      sources: [
        { title: 'History', url: 'https://corporate.pokemon.co.jp/en/aboutus/history/', publisher: 'The Pokémon Company', accessed: '2026-10-05' },
        {
          title: 'CGC Cards Certifies Several Cosmos Holo Test Print Pokémon Cards',
          url: 'https://www.cgcgrading.com/news/articles/cgc-cards-certifies-several-cosmos-holo-test-print-pok-mon-cards-28XHoZDfzI6Mfwm2GXrCQH/',
          publisher: 'CGC',
          year: 2023,
          accessed: '2026-10-05',
        },
      ],
    },
    ficha: {
      documented: {
        es: 'El juego de cartas Pokémon salió en Japón en octubre de 1996, desarrollado por Creatures Inc. [1]. Media Factory, su editorial japonesa, marcó las cartas más raras con un fondo holográfico; la primera serie japonesa usó un patrón de lámina conocido como Cosmos [2].',
        en: 'The Pokémon Trading Card Game launched in Japan in October 1996, developed by Creatures Inc. [1]. Media Factory, its Japanese publisher, marked the rarest cards with a holofoil background; the first Japanese set used a foil pattern known as Cosmos [2].',
      },
      reading: {
        es: 'Este tema es anterior al estudio y es el menos brutalista de los cinco; se queda por continuidad. Sus degradados holográficos, sus colores pastel de caramelo y su tipografía de píxel toman el brillo de las cartas raras y de las pantallas de finales de los noventa, sin perder los bordes duros del contrato.',
        en: 'This theme predates the study and is the least brutalist of the five; it stays for continuity. Its holographic gradients, pastel candy colours and pixel display type borrow the shimmer of rare cards and late-1990s screens, while keeping the contract’s hard edges.',
      },
      palette: {
        origin: 'interpreted',
        note: {
          es: 'Una lectura iridiscente de la lámina holográfica; ninguna fuente documenta sus colores.',
          en: 'An iridescent reading of holofoil; no source documents its colours.',
        },
      },
    },
    facets: { border: 'standard', shadow: 'double', corners: 'round' },
    predatesStudy: true,
  },
  riso: {
    scene: 'japan',
    tagline: { es: 'Dos tintas, un poco desplazadas.', en: 'Two inks, slightly off.' },
    reference: {
      title: { es: 'El risógrafo (RISOGRAPH)', en: 'The Risograph (RISOGRAPH)' },
      authors: ['Riso Kagaku Corporation', 'Noboru Hayama'],
      date: 1980,
      place: { es: 'Tokio, Japón', en: 'Tokyo, Japan' },
      kind: 'object',
      sources: [
        { title: 'RISO’s History 1975 - 1988', url: 'https://www.riso.co.jp/english/company/history/s50.html', publisher: 'RISO KAGAKU CORPORATION', accessed: '2026-10-05' },
        { title: 'RISO’s History', url: 'https://www.riso.co.jp/english/company/history/index.html', publisher: 'RISO KAGAKU CORPORATION', accessed: '2026-10-05' },
        { title: 'RISO Consumables: Digital Duplicator', url: 'https://www.riso.co.jp/english/product/digital_dup/consumables/index.html', publisher: 'RISO KAGAKU CORPORATION', accessed: '2026-10-05' },
        { title: 'Riso Printing', url: 'https://gradlab.mica.edu/RisoPrinting', publisher: 'MICA GradLab (Maryland Institute College of Art)', accessed: '2026-10-05' },
      ],
      image: {
        file: 'riso.avif',
        width: 1500,
        height: 1000,
        alt: {
          es: 'Una impresión en risografía a dos tintas, rosa rojizo y negro, sostenida ante la cámara.',
          en: 'A two-colour risograph print, pinkish red and black, held up to the camera.',
        },
        author: 'Mario Felipe',
        license: 'CC-BY-2.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Impress%C3%A3o_em_risografia_em_dua_cores,_2014.jpg',
      },
    },
    ficha: {
      documented: {
        es: 'Noboru Hayama fundó RISO en Tokio en 1946 como servicio de impresión con mimeógrafo [2]. La marca RISOGRAPH llegó en junio de 1980, y el RISOGRAPH 007, un duplicador totalmente automático, en 1984 [1]. RISO vende tintas vegetales en 21 colores estándar y 50 a medida [3]; son semitransparentes, así que los colores que se superponen se mezclan [4].',
        en: 'Noboru Hayama founded RISO in Tokyo in 1946 as a mimeograph printing service [2]. The RISOGRAPH brand followed in June 1980, and the fully automatic RISOGRAPH 007 duplicator in 1984 [1]. RISO sells vegetable-based inks in 21 standard and 50 custom colours [3]; they are semi-transparent, so overlapping colours mix [4].',
      },
      reading: {
        es: 'Este tema es anterior al estudio; el risógrafo es su referencia más cercana. Imprime en dos tintas planas ligeramente desregistradas, sobre papel cálido sin estucar y con grano. El rosa y el azul siguen las aproximaciones hexadecimales que los talleres publican para las tintas RISO [4].',
        en: 'This theme predates the study; the Risograph is its closest reference. It prints in two spot inks set slightly out of register, on warm uncoated paper with a grain. The pink and the blue follow the hex approximations print labs publish for RISO inks [4].',
      },
      palette: {
        origin: 'documented',
        note: {
          es: 'Fluorescent Pink #FF48B0 y Blue #0078BF son aproximaciones de taller de las tintas RISO, no valores que publique RISO.',
          en: 'Fluorescent Pink #FF48B0 and Blue #0078BF are print-lab approximations of RISO inks, not values RISO publishes.',
        },
      },
    },
    facets: { border: 'standard', shadow: 'double', corners: 'soft' },
    predatesStudy: true,
  },
};
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/study && npx tsc -p tsconfig.json && npx eslint src/study`
Expected: PASS — five `core fichas` checks, plus image checks for tech and riso (classic, swiss and y2k have no image); typecheck and lint clean.

- [ ] **Step 6: Commit**

```bash
git add src/study/core-fichas.ts src/study/study.test.ts src/study/images/vt100.avif src/study/images/riso.avif
git commit -m "feat(study): fichas of the five core themes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 8: Catalog, build script and package wiring

**Files:**
- Create: `src/study/catalog.ts`, `src/study/build.ts`, `scripts/build-study.mjs`
- Modify: `package.json` (scripts, `./study` export), `.gitignore`, `eslint.config.js`, `scripts/check-package.mjs`
- Test: `src/study/catalog.test.ts`

**Interfaces:**
- Consumes (Tasks 1–7): `compileTheme`, `fontKeys`, `CompiledTheme`, `FONTS`, `STUDY_THEMES`, `registryProblems`, `themeProblems`, `coreFichaProblems`, `contractProblems`, `CORE_FICHAS`; `NEO_THEMES`, `THEME_INFO`, `NeoBuiltinTheme`, `NeoThemeInfo` (`src/lib/themes/index.ts`); `resolveColor`.
- Produces:
  - `interface CatalogEntry`, `interface CatalogReference`, `PREVIEW_TOKENS`, `borderFacet(px)`, `cornerFacet(px)`, `decadeOf(date)`, `studyEntry(theme, compiled)`, `coreEntry(id, info, core, fontsHref)`, `renderSiteModule(entries): string`, `renderPackageModule(entries): { js: string; dts: string }` (`src/study/catalog.ts`).
  - Generated, git-ignored: `src/study/.generated/themes/<id>.css`, `<id>.fonts.css`, and `src/study/.generated/catalog.ts` exporting `CATALOG: readonly CatalogEntry[]` (core entries first, then study themes by path). Plan 2's site imports this module.
  - Package: `dist/themes/<id>.css` + `<id>.fonts.css` for every study theme; `dist/study.js` exporting `STUDY_CATALOG` (frozen, no `vars`) and `dist/study.d.ts` (`StudyThemeId`, `StudyScene`, `StudyText`, `StudyCatalogEntry`, `STUDY_CATALOG`); export `"./study"`.
  - npm script `gen:study`, run automatically before `dev`, `test`, `test:watch`, `typecheck` and `build:site`; `build:lib` runs `build-study.mjs --dist`.

- [ ] **Step 1: Write the failing test**

`src/study/catalog.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { compileTheme } from './compile';
import {
  PREVIEW_TOKENS,
  borderFacet,
  cornerFacet,
  decadeOf,
  renderPackageModule,
  renderSiteModule,
  studyEntry,
} from './catalog';
import { FIXTURE } from './__fixtures__/fixture';

const entry = studyEntry(FIXTURE, compileTheme(FIXTURE));
/** Evaluates the generated npm module without a module loader. */
const load = (js: string) =>
  new Function(js.replace('export const STUDY_CATALOG = ', 'return '))() as readonly Record<string, unknown>[];

describe('catalog', () => {
  it('summarizes a study theme without its ficha prose', () => {
    expect(entry).toMatchObject({
      id: 'fixture',
      scene: 'germany',
      nativeScheme: 'light',
      predatesStudy: false,
      swatch: ['#1a5f9e', '#6e570e', '#111111', '#f2f2f2'],
      fonts: ['Barlow', 'DM Mono'],
      fontsHref: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap',
      facets: { scene: 'germany', decade: 1970, kind: 'architecture', scheme: 'light', border: 'standard', shadow: 'hard', corners: 'square' },
    });
    expect(entry.reference).not.toHaveProperty('sources');
    expect(entry).not.toHaveProperty('ficha');
    expect(Object.keys(entry.vars!)).toEqual([...PREVIEW_TOKENS]);
  });

  it('buckets facets', () => {
    expect([1, 2, 3, 4].map(borderFacet)).toEqual(['hairline', 'standard', 'standard', 'heavy']);
    expect([0, 6, 15, 16, 999].map(cornerFacet)).toEqual(['square', 'soft', 'soft', 'round', 'round']);
    expect(decadeOf(1995)).toBe(1990);
    expect(decadeOf([1977, 1986])).toBe(1970);
  });

  it('renders an npm module that survives non-ASCII text and quotes, without vars', () => {
    const tricky = {
      ...entry,
      reference: { ...entry.reference, title: { es: 'Torre "Nakagin"', en: "Kurokawa's tower" }, original: { text: '中銀カプセルタワー', lang: 'ja' } },
    };
    const { js, dts } = renderPackageModule([tricky]);
    const catalog = load(js);
    const reference = catalog[0].reference as { title: { es: string }; original: { text: string } };
    expect(reference.original.text).toBe('中銀カプセルタワー');
    expect(reference.title.es).toBe('Torre "Nakagin"');
    expect(catalog[0]).not.toHaveProperty('vars');
    expect(Object.isFrozen(catalog)).toBe(true);
    expect(dts).toContain('export type StudyThemeId = "fixture";');
    expect(dts).toContain('export declare const STUDY_CATALOG: readonly StudyCatalogEntry[];');
  });

  it('types StudyThemeId as never when there are no study themes', () => {
    expect(renderPackageModule([{ ...entry, predatesStudy: true }]).dts).toContain('export type StudyThemeId = never;');
  });

  it('renders the site module with vars', () => {
    const ts = renderSiteModule([entry]);
    expect(ts).toContain("import type { CatalogEntry } from '../catalog';");
    expect(ts).toContain('export const CATALOG: readonly CatalogEntry[] = [');
    expect(ts).toContain('"--nbc-primary-fill": "var(--nbc-primary)"');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/study/catalog.test.ts`
Expected: FAIL — `Failed to resolve import "./catalog"`.

- [ ] **Step 3: Write the catalog**

`src/study/catalog.ts`:

```ts
/**
 * The theme catalog: one entry per theme, core and study, with what pickers,
 * the atlas and agents need — never the ficha prose. scripts/build-study.mjs
 * renders it twice: a TS module for the site (with `vars`) and the npm
 * `./study` module (without).
 */
import { resolveColor } from '../lib/themes/color';
import type { NeoBuiltinTheme, NeoThemeInfo } from '../lib/themes';
import { fontKeys } from './compile';
import type { CompiledTheme } from './compile';
import { FONTS } from './fonts';
import { REFERENCE_KINDS, SCENES, SHADOW_KINDS } from './types';
import type { BorderFacet, CoreFicha, CornerFacet, Facets, L10n, Reference, Scene, StudyThemeInput } from './types';

export interface CatalogReference {
  readonly title: L10n;
  readonly original?: { readonly text: string; readonly lang: string };
  readonly authors: readonly string[];
  readonly date: number | readonly [number, number];
  readonly place: L10n;
  readonly kind: Reference['kind'];
}

export interface CatalogEntry {
  readonly id: string;
  readonly scene: Scene;
  readonly nativeScheme: 'light' | 'dark';
  readonly name: L10n;
  readonly tagline: L10n;
  readonly reference: CatalogReference;
  /** Light scheme: primary, accent, fg, bg. */
  readonly swatch: readonly string[];
  /** Family names the theme expects. */
  readonly fonts: readonly string[];
  /** Google Fonts stylesheet, or null for system fonts. */
  readonly fontsHref: string | null;
  readonly facets: Facets;
  readonly predatesStudy: boolean;
  /** Study themes: the tokens an atlas card paints with, without loading the stylesheet. Core themes: null. */
  readonly vars: Readonly<Record<string, string>> | null;
}

/** Tokens copied into `vars`. */
export const PREVIEW_TOKENS = [
  '--nbc-scheme',
  '--nbc-font-sans',
  '--nbc-font-display',
  '--nbc-weight-body',
  '--nbc-weight-label',
  '--nbc-weight-display',
  '--nbc-label-transform',
  '--nbc-label-spacing',
  '--nbc-display-transform',
  '--nbc-display-spacing',
  '--nbc-bg',
  '--nbc-fg',
  '--nbc-fg-muted',
  '--nbc-surface',
  '--nbc-surface-alt',
  '--nbc-border-color',
  '--nbc-primary',
  '--nbc-primary-fg',
  '--nbc-accent',
  '--nbc-accent-fg',
  '--nbc-focus',
  '--nbc-primary-fill',
  '--nbc-surface-fill',
  '--nbc-texture',
  '--nbc-border-width',
  '--nbc-border-style',
  '--nbc-radius',
  '--nbc-radius-control',
  '--nbc-radius-button',
  '--nbc-radius-small',
  '--nbc-shadow',
  '--nbc-shadow-lg',
  '--nbc-shadow-press',
  '--nbc-press',
  '--nbc-press-active',
] as const;

const BORDER_FACETS: readonly BorderFacet[] = ['hairline', 'standard', 'heavy'];
const CORNER_FACETS: readonly CornerFacet[] = ['square', 'soft', 'round'];

export const borderFacet = (px: number): BorderFacet => (px <= 1 ? 'hairline' : px <= 3 ? 'standard' : 'heavy');
export const cornerFacet = (px: number): CornerFacet => (px === 0 ? 'square' : px < 16 ? 'soft' : 'round');
export const decadeOf = (date: Reference['date']): number => Math.floor((typeof date === 'number' ? date : date[0]) / 10) * 10;

function summary(reference: Reference): CatalogReference {
  return {
    title: reference.title,
    ...(reference.original ? { original: reference.original } : {}),
    authors: reference.authors,
    date: reference.date,
    place: reference.place,
    kind: reference.kind,
  };
}

export function studyEntry(theme: StudyThemeInput, compiled: CompiledTheme): CatalogEntry {
  const tokens = compiled.tokens as Map<string, string>;
  const light = (name: string) => resolveColor(tokens, name, 'light');
  return {
    id: theme.id,
    scene: theme.scene,
    nativeScheme: theme.nativeScheme,
    name: theme.name,
    tagline: theme.tagline,
    reference: summary(theme.reference),
    swatch: [light('--nbc-primary'), light('--nbc-accent'), light('--nbc-fg'), light('--nbc-bg')],
    fonts: fontKeys(theme.fonts).map((key) => FONTS[key].family),
    fontsHref: compiled.fontsHref,
    facets: {
      scene: theme.scene,
      decade: decadeOf(theme.reference.date),
      kind: theme.reference.kind,
      scheme: theme.nativeScheme,
      border: borderFacet(theme.shape.borderWidth),
      shadow: theme.elevation.kind,
      corners: cornerFacet(theme.shape.radiusButton),
    },
    predatesStudy: false,
    vars: Object.fromEntries(PREVIEW_TOKENS.map((name) => [name, tokens.get(name) ?? ''])),
  };
}

export function coreEntry(id: NeoBuiltinTheme, info: NeoThemeInfo, core: CoreFicha, fontsHref: string | null): CatalogEntry {
  return {
    id,
    scene: core.scene,
    nativeScheme: info.nativeScheme,
    name: { es: info.name, en: info.name },
    tagline: core.tagline,
    reference: summary(core.reference),
    swatch: info.swatch,
    fonts: info.fonts,
    fontsHref,
    facets: { scene: core.scene, decade: decadeOf(core.reference.date), kind: core.reference.kind, scheme: info.nativeScheme, ...core.facets },
    predatesStudy: true,
    vars: null,
  };
}

export function renderSiteModule(entries: readonly CatalogEntry[]): string {
  return [
    '// Generated by scripts/build-study.mjs from src/study — do not edit.',
    "import type { CatalogEntry } from '../catalog';",
    '',
    `export const CATALOG: readonly CatalogEntry[] = ${JSON.stringify(entries, null, 2)};`,
    '',
  ].join('\n');
}

const union = (values: readonly string[]) => values.map((v) => `'${v}'`).join(' | ');

export function renderPackageModule(entries: readonly CatalogEntry[]): { js: string; dts: string } {
  const slim = entries.map((entry) => ({ ...entry, vars: undefined }));
  const studyIds = entries.filter((entry) => !entry.predatesStudy).map((entry) => JSON.stringify(entry.id));
  const js = [
    '// neobrutalistcomponents/study — the theme catalog of the neobrutalism study (data only).',
    `export const STUDY_CATALOG = Object.freeze(${JSON.stringify(slim, null, 2)});`,
    '',
  ].join('\n');
  const kind = union(REFERENCE_KINDS);
  const dts = [
    '/** neobrutalistcomponents/study — the theme catalog of the neobrutalism study. */',
    `export type StudyThemeId = ${studyIds.length ? studyIds.join(' | ') : 'never'};`,
    `export type StudyScene = ${union(SCENES)};`,
    'export interface StudyText {',
    '  readonly es: string;',
    '  readonly en: string;',
    '}',
    'export interface StudyCatalogEntry {',
    '  readonly id: string;',
    '  readonly scene: StudyScene;',
    "  readonly nativeScheme: 'light' | 'dark';",
    '  readonly name: StudyText;',
    '  readonly tagline: StudyText;',
    '  readonly reference: {',
    '    readonly title: StudyText;',
    '    readonly original?: { readonly text: string; readonly lang: string };',
    '    readonly authors: readonly string[];',
    '    readonly date: number | readonly [number, number];',
    '    readonly place: StudyText;',
    `    readonly kind: ${kind};`,
    '  };',
    '  /** Light scheme: primary, accent, fg, bg. */',
    '  readonly swatch: readonly string[];',
    '  readonly fonts: readonly string[];',
    '  readonly fontsHref: string | null;',
    '  readonly facets: {',
    '    readonly scene: StudyScene;',
    '    readonly decade: number;',
    `    readonly kind: ${kind};`,
    "    readonly scheme: 'light' | 'dark';",
    `    readonly border: ${union(BORDER_FACETS)};`,
    `    readonly shadow: ${union(SHADOW_KINDS)};`,
    `    readonly corners: ${union(CORNER_FACETS)};`,
    '  };',
    '  /** True for the five core themes, which predate the study. */',
    '  readonly predatesStudy: boolean;',
    '}',
    'export declare const STUDY_CATALOG: readonly StudyCatalogEntry[];',
    '',
  ].join('\n');
  return { js, dts };
}
```

`src/study/build.ts`:

```ts
/** Everything scripts/build-study.mjs needs, behind one import (one module graph). */
export { STUDY_THEMES, registryProblems } from './registry';
export { themeProblems, coreFichaProblems } from './validate';
export { compileTheme } from './compile';
export { contractProblems } from './contract';
export { coreEntry, studyEntry, renderSiteModule, renderPackageModule } from './catalog';
export { CORE_FICHAS } from './core-fichas';
export { NEO_THEMES, THEME_INFO } from '../lib/themes';
```

- [ ] **Step 4: Write the build script**

`scripts/build-study.mjs`:

```js
// Compiles the study themes (src/study/themes/<scene>/<id>.ts) and the theme
// catalog. Fails on any validation or contract problem. Output is a pure
// function of the sources; nothing it writes is committed.
//
//   node scripts/build-study.mjs          → src/study/.generated/ (site, tests, typecheck)
//   node scripts/build-study.mjs --dist   → also dist/themes/<id>.css|.fonts.css, dist/study.js|.d.ts
import { runnerImport } from 'vite';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GEN = join(ROOT, 'src/study/.generated');
const DIST = process.argv.includes('--dist');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const study = (await runnerImport(join(ROOT, 'src/study/build.ts'), { configFile: false, logLevel: 'silent' })).module;

function fail(problems) {
  console.error(`build-study: ${problems.length} problem(s)\n- ${problems.join('\n- ')}`);
  process.exit(1);
}

const problems = [
  ...study.registryProblems(),
  ...study.STUDY_THEMES.flatMap(({ theme }) => study.themeProblems(theme)),
  ...study.NEO_THEMES.flatMap((id) =>
    study.CORE_FICHAS[id] ? study.coreFichaProblems(id, study.CORE_FICHAS[id]) : [`${id}: no core ficha`],
  ),
];
if (problems.length) fail(problems);

rmSync(GEN, { recursive: true, force: true });
const outDirs = [join(GEN, 'themes'), ...(DIST ? [join(ROOT, 'dist/themes')] : [])];
for (const dir of outDirs) mkdirSync(dir, { recursive: true });

const entries = [];
for (const { theme, signature } of study.STUDY_THEMES) {
  let compiled;
  try {
    compiled = study.compileTheme(theme, { signature, banner: `neobrutalistcomponents v${pkg.version} — study theme: ${theme.id}` });
  } catch (error) {
    fail([error.message]);
  }
  const contract = study.contractProblems(theme.id, compiled.tokens, compiled.css);
  if (contract.length) fail(contract);
  for (const dir of outDirs) {
    writeFileSync(join(dir, `${theme.id}.css`), compiled.css);
    writeFileSync(join(dir, `${theme.id}.fonts.css`), compiled.fontsCss);
  }
  entries.push(study.studyEntry(theme, compiled));
}

const coreFontsHref = (id) =>
  readFileSync(join(ROOT, `src/lib/themes/${id}/fonts.css`), 'utf8').match(/@import url\('([^']+)'\)/)?.[1] ?? null;
const core = study.NEO_THEMES.map((id) => study.coreEntry(id, study.THEME_INFO[id], study.CORE_FICHAS[id], coreFontsHref(id)));
const catalog = [...core, ...entries];
writeFileSync(join(GEN, 'catalog.ts'), study.renderSiteModule(catalog));
if (DIST) {
  const { js, dts } = study.renderPackageModule(catalog);
  writeFileSync(join(ROOT, 'dist/study.js'), js);
  writeFileSync(join(ROOT, 'dist/study.d.ts'), dts);
}
console.log(`build-study: ${entries.length} study theme(s), ${core.length} core fichas → src/study/.generated/${DIST ? ' + dist/' : ''}`);
```

- [ ] **Step 5: Wire the package**

`package.json` — scripts (replace `dev`, `build:lib`, `test`, `test:watch`, `typecheck` lines and add the `pre*` hooks and `gen:study`; leave the others as they are):

```json
"gen:study": "node scripts/build-study.mjs",
"predev": "npm run gen:study",
"dev": "vite --config vite.site.config.ts",
"build:lib": "vite build && tsc -p tsconfig.lib.json && node scripts/build-themes.mjs && node scripts/build-study.mjs --dist && node scripts/gen-llms.mjs --dist",
"prebuild:site": "npm run gen:study",
"build:site": "vite build --config vite.site.config.ts",
"pretest": "npm run gen:study",
"test": "vitest run",
"pretest:watch": "npm run gen:study",
"test:watch": "vitest",
"pretypecheck": "npm run gen:study",
"typecheck": "tsc -p tsconfig.json && tsc -p tsconfig.node.json",
```

`package.json` — `exports`, add after `"./themes/*"`:

```json
"./study": {
  "types": "./dist/study.d.ts",
  "default": "./dist/study.js"
},
```

`.gitignore` — add under `.superpowers/`:

```
src/study/.generated/
```

`eslint.config.js` — add `'src/study/.generated'` to the `ignores` array.

`scripts/check-package.mjs` — replace the whole file with:

```js
// Verifies the built package before publishing: every `exports` target exists,
// the core stylesheet carries the cascade layers and the component rules,
// every theme stylesheet (core and study) is scoped to its theme and keeps its
// light-dark() colors, study themes stay within budget, and the ./study
// catalog matches the theme files. Run after `npm run build:lib`.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LAYER = '@layer nbc.tokens, nbc.theme, nbc.base, nbc.components, nbc.flourish;';
const STUDY_BUDGET = 12 * 1024;
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const coreThemes = readdirSync(join(ROOT, 'src/lib/themes'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const themeIds = readdirSync(join(ROOT, 'dist/themes'))
  .filter((f) => f.endsWith('.css') && !f.endsWith('.fonts.css'))
  .map((f) => f.slice(0, -'.css'.length))
  .sort();
const { STUDY_CATALOG } = await import(pathToFileURL(join(ROOT, 'dist/study.js')).href);
const studyIds = STUDY_CATALOG.filter((entry) => !entry.predatesStudy).map((entry) => entry.id);

const failures = [];
const check = (ok, message) => ok || failures.push(message);

check(STUDY_CATALOG.length === coreThemes.length + studyIds.length, 'dist/study.js must list every core theme plus every study theme');
check(
  [...coreThemes, ...studyIds].sort().join() === themeIds.join(),
  `dist/themes (${themeIds.join(', ')}) does not match core + study themes`,
);

const targets = Object.entries(pkg.exports).flatMap(([key, value]) => {
  const paths = typeof value === 'string' ? [value] : Object.values(value);
  if (!key.includes('*')) return paths;
  // ./themes/* → every theme stylesheet and its fonts file
  return paths.flatMap((p) => themeIds.flatMap((t) => [p.replace('*', `${t}.css`), p.replace('*', `${t}.fonts.css`)]));
});
for (const target of targets) check(existsSync(join(ROOT, target)), `missing export target ${target}`);

for (const file of [pkg.main, pkg.module, pkg.types]) check(existsSync(join(ROOT, file)), `missing ${file}`);

const styles = readFileSync(join(ROOT, 'dist/styles.css'), 'utf8');
check(/@layer nbc\.tokens/.test(styles), 'dist/styles.css has no nbc.tokens layer');
check(/@layer nbc\.components/.test(styles), 'dist/styles.css has no nbc.components layer');
check(styles.includes('.nbc-button'), 'dist/styles.css has no .nbc-button rules');
check(!styles.includes('lightningcss-'), 'dist/styles.css has lowered light-dark() (--lightningcss-* vars): set build.cssTarget');
check(styles.includes('light-dark('), 'dist/styles.css lost its light-dark() colors');
check(!/\[data-theme=["']?(classic|tech|swiss|y2k|riso)/.test(styles), 'dist/styles.css contains theme-specific selectors');

for (const theme of themeIds) {
  const css = readFileSync(join(ROOT, `dist/themes/${theme}.css`), 'utf8');
  check(css.startsWith('/*') && css.includes(LAYER), `${theme}.css lacks the layer statement`);
  check(new RegExp(`\\[data-theme=["']?${theme}["']?\\]`).test(css), `${theme}.css is not scoped to [data-theme="${theme}"]`);
  check(!css.includes("@import '"), `${theme}.css still has unresolved @imports`);
  check(!css.includes('lightningcss-'), `${theme}.css has lowered light-dark() (--lightningcss-* vars)`);
  check(css.includes('light-dark('), `${theme}.css lost its light-dark() colors`);
}
for (const id of studyIds) {
  const bytes = statSync(join(ROOT, `dist/themes/${id}.css`)).size;
  check(bytes <= STUDY_BUDGET, `${id}.css is ${bytes} bytes, the budget is ${STUDY_BUDGET}`);
}

const studyJs = readFileSync(join(ROOT, 'dist/study.js'), 'utf8');
const studyDts = readFileSync(join(ROOT, 'dist/study.d.ts'), 'utf8');
check(studyDts.includes('export type StudyThemeId'), 'dist/study.d.ts lacks StudyThemeId');
check(!studyJs.includes('"vars"'), 'dist/study.js leaks the site-only preview vars');

const js = readFileSync(join(ROOT, 'dist/index.js'), 'utf8');
check(/^["']use client["'];/.test(js), 'dist/index.js is not marked "use client"');
check(!/import\s+["'][^"']+\.css["']/.test(js), 'dist/index.js imports CSS');

const dts = readFileSync(join(ROOT, 'dist/index.d.ts'), 'utf8');
check(!dts.includes('.css'), 'dist/index.d.ts references a .css file');

if (failures.length) {
  console.error(`check-package: ${failures.length} problem(s)\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`check-package: ${targets.length} export targets, ${coreThemes.length} core + ${studyIds.length} study themes — ok`);
```

- [ ] **Step 6: Run everything to verify**

Run: `npx vitest run src/study/catalog.test.ts`
Expected: PASS.

Run: `npm run gen:study && ls src/study/.generated && git status --short src/study`
Expected: `build-study: 0 study theme(s), 5 core fichas → src/study/.generated/`; `.generated` holds `catalog.ts` and an empty `themes/`; git shows no `.generated` files.

Run: `npm run lint && npm run typecheck && npm test && npm run build:lib && npm run check:package`
Expected: all pass; `check-package: … 5 core + 0 study themes — ok`; publint clean.

- [ ] **Step 7: Commit**

```bash
git add src/study/catalog.ts src/study/build.ts src/study/catalog.test.ts scripts/build-study.mjs scripts/check-package.mjs package.json .gitignore eslint.config.js
git commit -m "feat(study): theme catalog, build script and ./study export

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 9: Proof theme `classifieds` (USA)

**Files:**
- Create: `src/study/themes/usa/classifieds.ts`, `src/study/themes/usa/classifieds.css`
- Modify: `src/study/study.test.ts`

**Interfaces:**
- Consumes (Tasks 1–8): `defineTheme` and the elevation helpers, the font registry, the study suite in `study.test.ts`, `npm run build:lib` and `check:package`.
- Produces: the study theme `classifieds`; `dist/themes/classifieds.css` and `classifieds.fonts.css` after `build:lib`.

Flat brutalism: system fonts only (`'system-serif'`, so `classifieds.fonts.css` is just a comment), no shadows, no image — the ficha links the Wayback Machine capture instead (`archiveUrl`). The palette is documented: `#0000EE` and `#551A8B` are the HTML standard's default link colours (dossier A4). Inks are explicit rather than `'auto'` because the documented look is white text on link blue.

- [ ] **Step 1: Write the failing test**

Add to `src/study/study.test.ts`, below the `study registry` describe:

```ts
/** The proof themes of sub-project 1. Each proof-theme task adds its id. */
const PROOF_THEMES = ['classifieds'];

describe('proof themes', () => {
  it('are all in the registry', () => {
    expect(STUDY_THEMES.map(({ theme }) => theme.id).sort()).toEqual([...PROOF_THEMES].sort());
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/study/study.test.ts`
Expected: FAIL — `proof themes › are all in the registry`: `'classifieds'` is missing.

- [ ] **Step 3: Write the theme**

`src/study/themes/usa/classifieds.ts`:

```ts
import { defineTheme, flat } from '../../define';

export default defineTheme({
  id: 'classifieds',
  scene: 'usa',
  nativeScheme: 'light',
  name: { es: 'Clasificados', en: 'Classifieds' },
  tagline: { es: 'Texto, enlaces azules y nada más.', en: 'Text, blue links, nothing else.' },
  reference: {
    title: { es: 'craigslist (sitio web de anuncios clasificados)', en: 'craigslist (classified-ads website)' },
    authors: ['Craig Newmark'],
    date: 1995,
    place: { es: 'San Francisco, Estados Unidos', en: 'San Francisco, United States' },
    kind: 'web',
    sources: [
      { title: 'about > mission and history', url: 'https://www.craigslist.org/about/mission_and_history', publisher: 'craigslist', accessed: '2026-10-05' },
      { title: 'Why Craigslist Is Such a Mess', url: 'https://www.wired.com/2009/08/ff-craigslist/', publisher: 'Wired', year: 2009, accessed: '2026-10-05' },
      {
        title: 'On Web Brutalism and Contemporary Web Design',
        url: 'https://quod.lib.umich.edu/d/dialectic/14932326.0001.107/--on-web-brutalism-and-contemporary-web-design?rgn=main&view=fulltext',
        publisher: 'Dialectic (AIGA / Michigan Publishing)',
        year: 2017,
        accessed: '2026-10-05',
      },
      { title: 'HTML Living Standard — 15 Rendering', url: 'https://html.spec.whatwg.org/multipage/rendering.html', publisher: 'WHATWG', accessed: '2026-10-05' },
      { title: 'craigslist.org, capture of 2 December 1998', url: 'https://web.archive.org/web/19981202212015/http://www.craigslist.org/', publisher: 'Internet Archive', year: 1998, accessed: '2026-10-05' },
      { title: 'Help On Mosaic v0.13', url: 'https://stuff.mit.edu/afs/sipb/project/www/doc/Mosaic-2.4/help-on-version-0.13.html', publisher: 'NCSA (mirror at MIT SIPB)', accessed: '2026-10-05' },
    ],
    archiveUrl: 'https://web.archive.org/web/19981202212015/http://www.craigslist.org/',
  },
  ficha: {
    documented: {
      es: 'Craig Newmark empezó craigslist a principios de 1995 como una lista de correo de eventos en San Francisco; sus anuncios pasaron después a un sitio web [1]. En 2009 Wired describió su aspecto como un diseño de los primeros días de la web, página tras página de enlaces azules [2], y en 2017 la revista Dialectic de AIGA lo llamó quizá el sitio web brutalista más conocido [3]. La página archivada más antigua, de diciembre de 1998, no define colores de enlace propios, así que los enlaces salían con los colores por defecto del navegador [5].',
      en: 'Craig Newmark started craigslist in early 1995 as an e-mail list of San Francisco events; its posts later moved to a website [1]. In 2009 Wired described its look as a design from the Web’s earliest days, page after page of blue links [2], and in 2017 the AIGA journal Dialectic called it perhaps the best-known brutalist website [3]. The earliest archived page, from December 1998, sets no link colours of its own, so links appeared in the browser’s defaults [5].',
    },
    reading: {
      es: 'El tema es esa página por defecto del navegador convertida en componentes: papel blanco, texto negro con serifa, un borde negro finísimo y ninguna sombra. Las acciones principales toman el azul de enlace no visitado #0000EE y el acento es el morado de visitado #551A8B [4][6]. Un botón fantasma se dibuja como un enlace subrayado que se vuelve rojo al pulsarlo, como un enlace activo; el rojo del tema es más oscuro que el #FF0000 del estándar para que el texto blanco de los botones de peligro siga siendo legible [4].',
      en: 'The theme is that default browser page made into components: white paper, black serif text, a hairline black edge and no shadows. Primary actions take the unvisited-link blue #0000EE and the accent is the visited purple #551A8B [4][6]. A ghost button is drawn as an underlined link that turns red while pressed, like an active link; the theme’s red is darker than the standard’s #FF0000 so that white text on danger buttons stays legible [4].',
    },
    palette: {
      origin: 'documented',
      note: {
        es: '#0000EE y #551A8B son los colores de enlace por defecto del estándar HTML actual; Mosaic ya dibujaba los enlaces no visitados en azul y los visitados en morado oscuro. El esquema oscuro es del tema.',
        en: '#0000EE and #551A8B are the default link colours of today’s HTML standard; Mosaic already drew unvisited links blue and visited ones dark purple. The dark scheme is the theme’s own.',
      },
    },
  },
  fonts: 'system-serif',
  colors: {
    bg: ['#ffffff', '#111111'],
    fg: ['#000000', '#eeeeee'],
    fgMuted: ['#555555', '#aaaaaa'],
    surface: ['#ffffff', '#111111'],
    surfaceAlt: ['#eeeeee', '#222222'],
    border: ['#000000', '#eeeeee'],
    primary: ['#0000ee', '#8ab4f8'],
    primaryFg: ['#ffffff', '#000000'],
    accent: ['#551a8b', '#c58af9'],
    accentFg: ['#ffffff', '#000000'],
    info: ['#0000ee', '#8ab4f8'],
    infoFg: ['#ffffff', '#000000'],
    success: ['#006600', '#6dd58c'],
    successFg: ['#ffffff', '#000000'],
    warning: '#ffcc00',
    warningFg: '#000000',
    danger: ['#cc0000', '#ff8080'],
    dangerFg: ['#ffffff', '#000000'],
    focus: ['#0000ee', '#8ab4f8'],
  },
  type: { weightBody: 400, weightLabel: 400, weightDisplay: 700, displaySpacing: 'normal' },
  shape: { borderWidth: 1, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' },
  signature: './classifieds.css',
});
```

`src/study/themes/usa/classifieds.css`:

```css
/* Classifieds: a secondary action is just a link — blue and underlined,
   red while pressed, the way browsers draw an active link. */
.nbc-button--ghost {
  color: var(--nbc-primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.nbc-button--ghost:active {
  color: var(--nbc-danger);
}
```

- [ ] **Step 4: Run the tests and the package build to verify**

Run: `npx vitest run src/study && npx tsc -p tsconfig.json && npx eslint src/study`
Expected: PASS, including `study theme "classifieds"` (validation and the contract in both schemes).

Run: `npm run build:lib && npm run check:package && wc -c dist/themes/classifieds.css`
Expected: check-package ok; `dist/themes/classifieds.css` far under 12288 bytes (about 2–3 KB).

- [ ] **Step 5: Commit**

```bash
git add src/study/themes/usa/classifieds.ts src/study/themes/usa/classifieds.css src/study/study.test.ts
git commit -m "feat(study): proof theme classifieds (USA)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 10: Proof theme `nakagin` (Japan)

**Files:**
- Create: `src/study/themes/japan/nakagin.ts`, `src/study/images/nakagin.avif`
- Modify: `src/study/study.test.ts`

**Interfaces:**
- Consumes (Tasks 1–8): `defineTheme` and the elevation helpers, the `concrete` and `grid` families, the font registry, the study suite in `study.test.ts`, `npm run build:lib` and `check:package`.
- Produces: the study theme `nakagin`; `dist/themes/nakagin.css` and `nakagin.fonts.css` after `build:lib`.

Japanese fonts (Zen Kaku Gothic New, Dela Gothic One, M PLUS 1 Code; Google Fonts serves them in `unicode-range` slices), the `grid` family at a 32 px module, pill buttons for the capsules' round windows. Facts from dossier A1: 140 capsules (one page also says 144 — use 140), built 1970–72, demolished 2022.

- [ ] **Step 1: Write the failing test**

In `src/study/study.test.ts`, extend the list:

```ts
const PROOF_THEMES = ['classifieds', 'nakagin'];
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/study/study.test.ts`
Expected: FAIL — `proof themes › are all in the registry`: `'nakagin'` is missing.

- [ ] **Step 3: Fetch the image**

Run: `npm run fetch:image -- "https://commons.wikimedia.org/wiki/File:Capsules_of_the_Nakagin_Capsule_Tower_dllu.jpg" nakagin`
Expected: `src/study/images/nakagin.avif`, 1600×1158, author `Dllu`, license `CC-BY-SA-4.0` — the values already in the theme file below, read from the Commons API on 2026-10-05. If the script prints different ones, the script wins: use its values and record the difference for Task 13.

- [ ] **Step 4: Write the theme**

`src/study/themes/japan/nakagin.ts`:

```ts
import { defineTheme, hardShadow } from '../../define';
import { grid } from '../../families';

export default defineTheme({
  id: 'nakagin',
  scene: 'japan',
  nativeScheme: 'light',
  name: { es: 'Nakagin', en: 'Nakagin' },
  tagline: { es: 'Cápsulas apiladas, una ventana redonda.', en: 'Stacked capsules, one round window.' },
  reference: {
    title: { es: 'Torre de cápsulas Nakagin', en: 'Nakagin Capsule Tower' },
    original: { text: '中銀カプセルタワービル', lang: 'ja' },
    authors: ['Kisho Kurokawa'],
    date: [1970, 1972],
    place: { es: 'Ginza, Tokio, Japón', en: 'Ginza, Tokyo, Japan' },
    kind: 'architecture',
    sources: [
      { title: 'The Many Lives of the Nakagin Capsule Tower', url: 'https://www.moma.org/calendar/exhibitions/5830', publisher: 'The Museum of Modern Art', year: 2025, accessed: '2026-10-05' },
      { title: 'Demolition of iconic Nakagin Capsule Tower begins in Tokyo', url: 'https://www.dezeen.com/2022/04/12/nakagin-capsule-tower-demolition-begins-tokyo/', publisher: 'Dezeen', year: 2022, accessed: '2026-10-05' },
      { title: 'Nakagin Capsule Tower', url: 'https://en.wikipedia.org/wiki/Nakagin_Capsule_Tower', publisher: 'Wikipedia', accessed: '2026-10-05' },
    ],
    image: {
      file: 'nakagin.avif',
      width: 1600,
      height: 1158,
      alt: {
        es: 'Primer plano de las cápsulas grises apiladas de la torre, cada una con una ventana redonda.',
        en: 'Close-up of the tower’s stacked grey capsules, each with one round window.',
      },
      author: 'Dllu',
      license: 'CC-BY-SA-4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Capsules_of_the_Nakagin_Capsule_Tower_dllu.jpg',
    },
  },
  ficha: {
    documented: {
      es: 'La torre de Kisho Kurokawa en Ginza, construida entre 1970 y 1972, colgaba 140 cápsulas prefabricadas de dos núcleos de hormigón y acero [2][3]. Cada cápsula era una habitación de unos 2,5 × 4 metros con una sola ventana redonda en un extremo [2][3]. El MoMA la considera la obra construida que define el Metabolismo, el movimiento japonés de los años sesenta de edificios pensados para transformarse con el tiempo [1]. Se demolió en 2022 porque su estructura se había deteriorado [2]; algunas cápsulas se restauraron y una forma hoy parte de la colección del MoMA [1].',
      en: 'Kisho Kurokawa’s tower in Ginza, built from 1970 to 1972, hung 140 prefabricated capsules on two concrete-and-steel cores [2][3]. Each capsule was a single room of about 2.5 × 4 metres with one round window at its end [2][3]. MoMA calls it the defining built work of Metabolism, the 1960s Japanese movement of buildings meant to change over time [1]. It was demolished in 2022 because its structure had decayed [2]; some capsules were restored, and one is now in MoMA’s collection [1].',
    },
    reading: {
      es: 'El tema lee la torre como un sistema de módulos idénticos: una retícula de 32 px dibujada sobre cada losa, tarjetas cuadradas apiladas con sombra dura y botones redondeados como la única ventana de la cápsula. La paleta es el gris pálido de las cápsulas sobre el hormigón de los núcleos, con el vidrio oscuro de la ventana como color principal. Una gótica japonesa para el texto y la pesada Dela Gothic One para los títulos dan el registro del Tokio de los setenta; ninguna de las dos está documentada en el edificio.',
      en: 'The theme reads the tower as a system of identical modules: a 32 px grid drawn on every slab, square cards stacked with a hard shadow, and buttons rounded like the capsule’s single window. The palette is the pale grey of the capsules on the concrete of the cores, with the window’s dark glass as the primary colour. A Japanese gothic for text and the heavy Dela Gothic One for titles set a 1970s Tokyo register; neither typeface is documented on the building.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'Leída en fotografías: cápsulas gris pálido, núcleos de hormigón, vidrio oscuro. Ninguna fuente documenta los colores.',
        en: 'Read from photographs: pale grey capsules, concrete cores, dark glass. No source documents the colours.',
      },
    },
  },
  fonts: { sans: 'zen-kaku-gothic-new', display: 'dela-gothic-one', mono: 'm-plus-1-code' },
  colors: {
    bg: ['#d9d8d3', '#16181b'],
    fg: ['#17191c', '#ecebe6'],
    fgMuted: ['#4a4d52', '#a9adb3'],
    surface: ['#f3f2ee', '#202327'],
    surfaceAlt: ['#e6e5e0', '#2b2f34'],
    border: ['#17191c', '#ecebe6'],
    primary: ['#20303b', '#c9d6df'],
    primaryFg: 'auto',
    accent: ['#2a6475', '#7fb8c9'],
    accentFg: 'auto',
    info: ['#2a6475', '#7fb8c9'],
    infoFg: 'auto',
    success: ['#2f6b3a', '#7cc48a'],
    successFg: 'auto',
    warning: ['#e0a526', '#e8b84a'],
    warningFg: 'auto',
    danger: ['#b3261e', '#ff8a7a'],
    dangerFg: 'auto',
    focus: ['#2a6475', '#7fb8c9'],
  },
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 400, labelSpacing: '0.02em', displaySpacing: '0em' },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 999, radiusSmall: 0 },
  elevation: hardShadow(5),
  families: [grid({ cell: 32, strength: 0.07 })],
});
```

- [ ] **Step 5: Run the tests and the package build to verify**

Run: `npx vitest run src/study && npx tsc -p tsconfig.json && npx eslint src/study`
Expected: PASS, including `study theme "nakagin"` (validation and the contract in both schemes, image budget).

Run: `npm run build:lib && npm run check:package && wc -c dist/themes/nakagin.css`
Expected: check-package ok; `dist/themes/nakagin.css` far under 12288 bytes (about 2–3 KB).

- [ ] **Step 6: Commit**

```bash
git add src/study/themes/japan/nakagin.ts src/study/images/nakagin.avif src/study/study.test.ts
git commit -m "feat(study): proof theme nakagin (Japan)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 11: Proof theme `maeusebunker` (Germany)

**Files:**
- Create: `src/study/themes/germany/maeusebunker.ts`, `src/study/images/maeusebunker.avif`
- Modify: `src/study/study.test.ts`

**Interfaces:**
- Consumes (Tasks 1–8): `defineTheme` and the elevation helpers, the `concrete` and `grid` families, the font registry, the study suite in `study.test.ts`, `npm run build:lib` and `check:package`.
- Produces: the study theme `maeusebunker`; `dist/themes/maeusebunker.css` and `maeusebunker.fonts.css` after `build:lib`.

The first study theme that is dark by default, and the first real use of `concrete`. Facts from dossier A2: the date span follows the project site (construction from July 1971, opened 27 February 1982); the pipes are light blue to mark the fresh-air intake, and the project site rejects the battleship reading, so the tagline does not use it. Primary is the pipes' light blue with a dark ink in both schemes; focus stays dark blue in the light scheme, because light blue on light concrete would fail the 3:1 focus pair.

- [ ] **Step 1: Write the failing test**

In `src/study/study.test.ts`, extend the list:

```ts
const PROOF_THEMES = ['classifieds', 'maeusebunker', 'nakagin'];
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/study/study.test.ts`
Expected: FAIL — `proof themes › are all in the registry`: `'maeusebunker'` is missing.

- [ ] **Step 3: Fetch the image**

Run: `npm run fetch:image -- "https://commons.wikimedia.org/wiki/File:2019-06-16-Zentrale-Tierlaboratorien-Forschungseinrichtung-f-experimentelle-Medizin-Maeusebunker-Krahmerstr-Berlin-Lichterfelde_03.jpg" maeusebunker`
Expected: `src/study/images/maeusebunker.avif`, 1600×1470, author `Gunnar Klack`, license `CC-BY-SA-4.0` — the values already in the theme file below, read from the Commons API on 2026-10-05. If the script prints different ones, the script wins: use its values and record the difference for Task 13.

- [ ] **Step 4: Write the theme**

`src/study/themes/germany/maeusebunker.ts`:

```ts
import { defineTheme, hardShadow } from '../../define';
import { concrete } from '../../families';

export default defineTheme({
  id: 'maeusebunker',
  scene: 'germany',
  nativeScheme: 'dark',
  name: { es: 'Mäusebunker', en: 'Mäusebunker' },
  tagline: { es: 'Paneles de hormigón, aire azul claro.', en: 'Concrete panels, light-blue air.' },
  reference: {
    title: {
      es: 'Mäusebunker (antiguos laboratorios centrales de animales de la Universidad Libre de Berlín)',
      en: 'Mäusebunker (former Central Animal Laboratories of the Free University of Berlin)',
    },
    original: { text: 'Zentrale Tierlaboratorien der Freien Universität Berlin', lang: 'de' },
    authors: ['Gerd Hänska', 'Magdalena Hänska', 'Kurt Schmersow'],
    date: [1971, 1982],
    place: { es: 'Lichterfelde, Berlín, Alemania', en: 'Lichterfelde, Berlin, Germany' },
    kind: 'architecture',
    sources: [
      { title: 'Bestand', url: 'https://www.modellverfahren-maeusebunker.de/bestand', publisher: 'Modellverfahren Mäusebunker (Landesdenkmalamt Berlin)', accessed: '2026-10-05' },
      {
        title: 'Neu unter Denkmalschutz: „Mäusebunker“ im Rahmen des Modellverfahrens Mäusebunker unter Schutz gestellt',
        url: 'https://www.berlin.de/landesdenkmalamt/aktivitaeten/kurzmeldungen/2023/maeusebunker-unter-denkmalschutz-1328090.php',
        publisher: 'Landesdenkmalamt Berlin',
        year: 2023,
        accessed: '2026-10-05',
      },
      { title: 'Brutalist Mäusebunker building saved from demolition in Berlin', url: 'https://www.dezeen.com/2023/07/18/brutalist-mausebunker-saved-berlin/', publisher: 'Dezeen', year: 2023, accessed: '2026-10-05' },
    ],
    image: {
      file: 'maeusebunker.avif',
      width: 1600,
      height: 1470,
      alt: {
        es: 'La fachada de hormigón del Mäusebunker, con hileras de tubos de ventilación azul claro y ventanas triangulares.',
        en: 'The Mäusebunker’s concrete façade, with rows of light-blue ventilation pipes and triangular windows.',
      },
      author: 'Gunnar Klack',
      license: 'CC-BY-SA-4.0',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:2019-06-16-Zentrale-Tierlaboratorien-Forschungseinrichtung-f-experimentelle-Medizin-Maeusebunker-Krahmerstr-Berlin-Lichterfelde_03.jpg',
    },
  },
  ficha: {
    documented: {
      es: 'Gerd y Magdalena Hänska proyectaron el edificio para criar animales de laboratorio para la Universidad Libre de Berlín; la obra empezó en 1971 y se inauguró en febrero de 1982 [1][2]. Su fachada es de paneles prefabricados de hormigón de una planta de alto, unos con buhardillas triangulares y otros con salidas para tubos de ventilación [1]. Los tubos están pintados de azul claro para señalar la toma de aire fresco; el sitio del proyecto rechaza la lectura popular de un acorazado con cañones [1]. Desde 2023 es monumento protegido [2][3].',
      en: 'Gerd and Magdalena Hänska designed the building to breed laboratory animals for the Free University of Berlin; construction began in 1971 and it opened in February 1982 [1][2]. Its façade is made of storey-high precast concrete panels, some with triangular dormer windows, others with outlets for ventilation pipes [1]. The pipes are painted light blue to mark the fresh-air intake; the project site rejects the popular reading of a battleship with cannons [1]. It has been a listed monument since 2023 [2][3].',
    },
    reading: {
      es: 'El tema está vaciado en ese hormigón: textura de encofrado detrás de la página y de cada losa, bordes de tinta de 3 px y una sombra desplazada de 6 px para la masa del edificio. Las acciones principales toman el azul claro de los tubos, y el acento ocre alude al código de colores del interior que describe el sitio del proyecto [1]. Es oscuro por defecto, leído aquí como el edificio de noche, y sus etiquetas van en una grotesca condensada, en mayúsculas y espaciada como la rotulación técnica: una interpretación.',
      en: 'The theme is cast in that concrete: board-marked texture behind the page and every slab, 3 px ink edges and a heavy 6 px offset shadow for the building’s mass. Primary actions take the pipes’ light blue, and the ochre accent nods to the interior colour code the project site describes [1]. It is dark by default, read here as the building at night, and its labels use a condensed grotesque, uppercase and spaced like technical lettering — an interpretation.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'El azul claro de los tubos y el código de colores interior están documentados con palabras en el sitio del proyecto; los valores hexadecimales son la lectura del tema a partir de fotografías.',
        en: 'The pipes’ light blue and the interior colour code are documented in words by the project site; the hex values are the theme’s reading of photographs.',
      },
    },
  },
  fonts: { sans: 'barlow', display: 'barlow-condensed', mono: 'dm-mono' },
  colors: {
    bg: ['#cfccc5', '#1c1d1e'],
    fg: ['#141516', '#e9e7e2'],
    fgMuted: ['#4b4a47', '#a7a39b'],
    surface: ['#e4e1db', '#27282a'],
    surfaceAlt: ['#d7d4ce', '#323335'],
    border: ['#141516', '#e9e7e2'],
    primary: '#8cc3ea',
    primaryFg: 'auto',
    accent: ['#6e570e', '#d8c06a'],
    accentFg: 'auto',
    info: ['#1a5f9e', '#3d8fd6'],
    infoFg: 'auto',
    success: ['#2d6b3c', '#5fb67a'],
    successFg: 'auto',
    warning: '#e8b545',
    warningFg: 'auto',
    danger: ['#a3271d', '#f07a6a'],
    dangerFg: 'auto',
    focus: ['#1a5f9e', '#8cc3ea'],
  },
  type: {
    weightBody: 400,
    weightLabel: 600,
    weightDisplay: 800,
    labelTransform: 'uppercase',
    labelSpacing: '0.06em',
    displayTransform: 'uppercase',
    displaySpacing: '0.01em',
  },
  shape: { borderWidth: 3, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: hardShadow(6),
  families: [concrete({ grain: 0.07, formwork: 0.05, board: 22 })],
});
```

- [ ] **Step 5: Run the tests and the package build to verify**

Run: `npx vitest run src/study && npx tsc -p tsconfig.json && npx eslint src/study`
Expected: PASS, including `study theme "maeusebunker"` (validation and the contract in both schemes, image budget).

Run: `npm run build:lib && npm run check:package && wc -c dist/themes/maeusebunker.css`
Expected: check-package ok; `dist/themes/maeusebunker.css` far under 12288 bytes (about 2–3 KB).

- [ ] **Step 6: Commit**

```bash
git add src/study/themes/germany/maeusebunker.ts src/study/images/maeusebunker.avif src/study/study.test.ts
git commit -m "feat(study): proof theme maeusebunker (Germany)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 12: Proof theme `sesc-pompeia` (Latin America)

**Files:**
- Create: `src/study/themes/latam/sesc-pompeia.ts`, `src/study/themes/latam/sesc-pompeia.css`, `src/study/images/sesc-pompeia.avif`
- Modify: `src/study/study.test.ts`

**Interfaces:**
- Consumes (Tasks 1–8): `defineTheme` and the elevation helpers, the `concrete` and `grid` families, the font registry, the study suite in `study.test.ts`, `npm run build:lib` and `check:package`.
- Produces: the study theme `sesc-pompeia`; `dist/themes/sesc-pompeia.css` and `sesc-pompeia.fonts.css` after `build:lib`.

The signature-CSS case: the irregular red-framed openings fit no family. The opening is a `::before` on card and dialog footers (both are `display: flex; justify-content: flex-end`), so `margin-inline-end: auto` parks it in the free space left of the actions and it never overlaps text. Facts from dossier A3; the walkway count (8 vs 4) and the factory's age are disputed, so the ficha states neither. Source [5] backs the reading's claim about Chivo's foundry (Omnibus-Type, Buenos Aires), checked on 2026-10-05.

- [ ] **Step 1: Write the failing test**

In `src/study/study.test.ts`, extend the list:

```ts
const PROOF_THEMES = ['classifieds', 'maeusebunker', 'nakagin', 'sesc-pompeia'];
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/study/study.test.ts`
Expected: FAIL — `proof themes › are all in the registry`: `'sesc-pompeia'` is missing.

- [ ] **Step 3: Fetch the image**

Run: `npm run fetch:image -- "https://commons.wikimedia.org/wiki/File:SESC_Pompeia_-_S%C3%A3o_Paulo_-_20220726142122.jpg" sesc-pompeia`
Expected: `src/study/images/sesc-pompeia.avif`, 1600×2133, author `Joalpe`, license `CC-BY-SA-4.0` — the values already in the theme file below, read from the Commons API on 2026-10-05. If the script prints different ones, the script wins: use its values and record the difference for Task 13.

- [ ] **Step 4: Write the theme**

`src/study/themes/latam/sesc-pompeia.ts`:

```ts
import { defineTheme, hardShadow } from '../../define';
import { concrete } from '../../families';

export default defineTheme({
  id: 'sesc-pompeia',
  scene: 'latam',
  nativeScheme: 'light',
  name: { es: 'SESC Pompéia', en: 'SESC Pompéia' },
  tagline: { es: 'Agujeros en el hormigón, enmarcados en rojo.', en: 'Holes in the concrete, framed in red.' },
  reference: {
    title: { es: 'SESC Pompéia', en: 'SESC Pompéia' },
    original: { text: 'Centro de Lazer Fábrica da Pompéia', lang: 'pt' },
    authors: ['Lina Bo Bardi', 'André Vainer', 'Marcelo Carvalho Ferraz'],
    date: [1977, 1986],
    place: { es: 'Pompeia, São Paulo, Brasil', en: 'Pompeia, São Paulo, Brazil' },
    kind: 'architecture',
    sources: [
      { title: 'Numa velha fábrica de tambores. Sesc Pompeia comemora 25 anos', url: 'https://vitruvius.com.br/revistas/read/minhacidade/08.093/1897', publisher: 'Vitruvius (Minha Cidade 093.01)', year: 2008, accessed: '2026-10-05' },
      { title: 'Clássicos da Arquitetura: SESC Pompéia / Lina Bo Bardi', url: 'https://www.archdaily.com/pt/01-153205/classicos-da-arquitetura-sesc-pompeia-slash-lina-bo-bardi', publisher: 'ArchDaily Brasil', year: 2013, accessed: '2026-10-05' },
      {
        title: 'Lina’s Red: Explore the Use of the Color as Prominent Element in Lina Bo Bardi’s Works',
        url: 'https://www.archdaily.com/1005415/linas-red-explore-the-use-of-the-color-as-prominent-element-in-lina-bo-bardis-works',
        publisher: 'ArchDaily',
        year: 2023,
        accessed: '2026-10-05',
      },
      { title: 'As janelas do Conjunto Esportivo do Sesc Pompeia', url: 'https://portal.sescsp.org.br/online/artigo/13584_AS+JANELAS+DO+CONJUNTO+ESPORTIVO+DO+SESC+POMPEIA', publisher: 'Sesc São Paulo', year: 2019, accessed: '2026-10-05' },
      { title: 'Omnibus-Type', url: 'https://thepunch.studio/foundry/omnibus-type', publisher: 'The Punch', accessed: '2026-10-05' },
    ],
    image: {
      file: 'sesc-pompeia.avif',
      width: 1600,
      height: 2133,
      alt: {
        es: 'Las aberturas irregulares de la torre deportiva de hormigón, con celosías rojas, sobre la antigua fábrica de ladrillo.',
        en: 'The concrete sports tower’s irregular openings, fitted with red lattices, above the old brick factory.',
      },
      author: 'Joalpe',
      license: 'CC-BY-SA-4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:SESC_Pompeia_-_S%C3%A3o_Paulo_-_20220726142122.jpg',
    },
  },
  ficha: {
    documented: {
      es: 'Lina Bo Bardi, con André Vainer y Marcelo Ferraz, convirtió una antigua fábrica de tambores de São Paulo en un centro de ocio entre 1977 y 1986, y le añadió un bloque deportivo de hormigón visto [1]. Una de sus torres tiene agujeros irregulares, como cuevas, en lugar de ventanas [1], moldeados con piezas de poliestireno en muros encofrados con tablas horizontales [2]. Las aberturas dejan entrar el viento, el sol y la lluvia en las canchas [4], y el rojo marca barandillas, conductos y marcos contra el hormigón gris [3].',
      en: 'Lina Bo Bardi, with André Vainer and Marcelo Ferraz, turned a former drum factory in São Paulo into a leisure centre between 1977 and 1986, adding a sports block in exposed concrete [1]. One of its towers has irregular, cave-like holes instead of windows [1], cast with styrofoam moulds into walls formed against horizontal timber boards [2]. The openings let wind, sun and rain into the courts [4], and red marks the handrails, ducts and frames against the grey concrete [3].',
    },
    reading: {
      es: 'El tema toma el hormigón de las torres —textura de encofrado en la página y en cada losa— y el rojo de Lina como color principal. Su CSS propio abre un hueco irregular, enmarcado en rojo, en el pie de cada tarjeta y de cada diálogo, y da a los botones principales el mismo contorno recortado a mano. El texto va en Chivo, de la fundidora porteña Omnibus-Type [5]: una tipografía latinoamericana para un edificio latinoamericano, no una documentada en Pompéia.',
      en: 'The theme takes the towers’ concrete — board-marked texture on the page and every slab — and Lina’s red as its primary colour. Its signature cuts one irregular opening, framed in red, into every card and dialog footer, and gives primary buttons the same hand-cut outline. Text is set in Chivo, by the Buenos Aires foundry Omnibus-Type [5]: a Latin American typeface for a Latin American building, not one documented at Pompéia.',
    },
    palette: {
      origin: 'interpreted',
      note: {
        es: 'El gris del hormigón y el rojo sobre él están documentados con palabras; los valores hexadecimales son la lectura del tema a partir de fotografías.',
        en: 'The concrete grey and the red against it are documented in words; the hex values are the theme’s reading of photographs.',
      },
    },
  },
  fonts: { sans: 'chivo', mono: 'chivo-mono' },
  colors: {
    bg: ['#d5d1ca', '#1d1c1b'],
    fg: ['#1b1a19', '#eeebe5'],
    fgMuted: ['#4d4a46', '#aaa49b'],
    surface: ['#efece6', '#292826'],
    surfaceAlt: ['#e2ded7', '#353331'],
    border: ['#1b1a19', '#eeebe5'],
    primary: ['#b81d17', '#ff6a5c'],
    primaryFg: 'auto',
    accent: ['#285a7a', '#7fb0d6'],
    accentFg: 'auto',
    info: ['#285a7a', '#7fb0d6'],
    infoFg: 'auto',
    success: ['#2e6a35', '#74c27f'],
    successFg: 'auto',
    warning: ['#e2a72e', '#ecb54a'],
    warningFg: 'auto',
    danger: ['#8f1d14', '#ff9a8c'],
    dangerFg: 'auto',
    focus: ['#285a7a', '#7fb0d6'],
  },
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 900, labelSpacing: '0em', displaySpacing: '-0.03em' },
  shape: { borderWidth: 3, radius: 0, radiusControl: 0, radiusButton: 6, radiusSmall: 0 },
  elevation: hardShadow(5),
  families: [concrete({ grain: 0.05, formwork: 0.04, board: 16 })],
  signature: './sesc-pompeia.css',
});
```

`src/study/themes/latam/sesc-pompeia.css`:

```css
/* SESC Pompéia: the sports tower has irregular, cave-like holes instead of
   windows, and red frames the building's details against the concrete.
   Every card and dialog footer gets one opening, in the free space before
   its actions; primary buttons get the same hand-cut outline. */
.nbc-card__footer::before,
.nbc-dialog__footer::before {
  content: '';
  flex: none;
  inline-size: 44px;
  block-size: 26px;
  margin-inline-end: auto;
  border: 4px solid var(--nbc-primary);
  border-radius: 46% 54% 38% 62% / 58% 40% 60% 42%;
  background: var(--nbc-bg);
}
.nbc-button--primary {
  border-radius: 14px 6px 12px 5px / 6px 12px 5px 14px;
}
```

- [ ] **Step 5: Run the tests and the package build to verify**

Run: `npx vitest run src/study && npx tsc -p tsconfig.json && npx eslint src/study`
Expected: PASS, including `study theme "sesc-pompeia"` (validation and the contract in both schemes, image budget).

Run: `npm run build:lib && npm run check:package && wc -c dist/themes/sesc-pompeia.css`
Expected: check-package ok; `dist/themes/sesc-pompeia.css` far under 12288 bytes (about 2–3 KB).

- [ ] **Step 6: Commit**

```bash
git add src/study/themes/latam/sesc-pompeia.ts src/study/themes/latam/sesc-pompeia.css src/study/images/sesc-pompeia.avif src/study/study.test.ts
git commit -m "feat(study): proof theme sesc-pompeia (Latin America)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

---

### Task 13: Verify the package and look at the themes

**Files:**
- Modify: `docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md` (§8 Implementation notes)
- Create (not committed, git-ignored): `.superpowers/study-sheet.mjs`, `.superpowers/sheets/*.html`, `.screenshots/study-*.png`

**Interfaces:**
- Consumes: everything above; `ThemeSampler` (`src/site/docs/ThemeSampler.tsx`); Playwright's `chromium` (already a devDependency).
- Produces: a verified package and a contact sheet per study theme for the owner. Plan 2 starts from this state.

- [ ] **Step 1: Run the whole gate**

Run: `npm run check`
Expected: lint, typecheck, every test, `build:lib`, `build:site` and `check:package` pass; `check-package: … 5 core + 4 study themes — ok`.

- [ ] **Step 2: Check what npm would ship**

Run: `npm pack --dry-run 2>&1 | grep -E "dist/(themes/(classifieds|maeusebunker|nakagin|sesc-pompeia)|study)" ; npm pack --dry-run 2>&1 | grep -c "src/study" || true`
Expected: eight theme files (`.css` + `.fonts.css` × 4), `dist/study.js`, `dist/study.d.ts`; the count of `src/study` paths is `0` (no images, no fichas).

Run: `node -e "import('./dist/study.js').then(({ STUDY_CATALOG }) => console.log(STUDY_CATALOG.filter((e) => !e.predatesStudy).map((e) => e.id).join(' ')))"`
Expected: `maeusebunker nakagin sesc-pompeia classifieds`.

- [ ] **Step 3: Render a contact sheet per study theme**

`.superpowers/study-sheet.mjs` (git-ignored scratch tool):

```js
// Renders ThemeSampler with each study theme's shipped stylesheet, light and
// dark side by side, and screenshots it. Needs `npm run build:lib` first.
import { runnerImport } from 'vite';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const site = { configFile: join(ROOT, 'vite.site.config.ts'), logLevel: 'silent' };
const { createElement } = await import('react');
const { renderToStaticMarkup } = await import('react-dom/server');
const { ThemeSampler } = (await runnerImport(join(ROOT, 'src/site/docs/ThemeSampler.tsx'), site)).module;
const { STUDY_CATALOG } = await import(pathToFileURL(join(ROOT, 'dist/study.js')).href);

const markup = renderToStaticMarkup(createElement(ThemeSampler));
mkdirSync(join(ROOT, '.superpowers/sheets'), { recursive: true });
mkdirSync(join(ROOT, '.screenshots'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 760 } });
for (const { id } of STUDY_CATALOG.filter((e) => !e.predatesStudy)) {
  const pane = (mode) => `<div class="nbc-root pane" data-theme="${id}" data-mode="${mode}">${markup}</div>`;
  const html = `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="../../dist/styles.css">
<link rel="stylesheet" href="../../dist/themes/${id}.css">
<link rel="stylesheet" href="../../dist/themes/${id}.fonts.css">
<style>body{margin:0}.grid{display:grid;grid-template-columns:1fr 1fr}.pane{padding:32px;min-block-size:100vh;box-sizing:border-box}</style>
<div class="grid">${pane('light')}${pane('dark')}</div>`;
  const file = join(ROOT, `.superpowers/sheets/${id}.html`);
  writeFileSync(file, html);
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(ROOT, `.screenshots/study-${id}.png`) });
  console.log(`.screenshots/study-${id}.png`);
}
await browser.close();
```

Run: `npm run build:lib && node .superpowers/study-sheet.mjs`
Expected: four PNGs in `.screenshots/`.

- [ ] **Step 4: Review the sheets against the fichas**

Open each PNG and check, for light and dark: borders and shadows render (no white page, no missing edges — the 1.0.1 failure mode); the theme's fonts loaded (Japanese gothic for `nakagin`, Barlow for `maeusebunker`, Chivo for `sesc-pompeia`, Times for `classifieds`); textures are visible but quiet; `sesc-pompeia`'s red opening sits left in the card footer and the primary button has its hand-cut outline; `classifieds`' ghost button reads as a blue underlined link. Fix anything off in the theme file (palette within the contract, family parameters) and rerun Steps 1 and 3. Record every change you make and why in the next step.

- [ ] **Step 5: Write the implementation notes**

Append to `docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md`, under `## 8. Implementation notes`, one bullet per decision taken while building that the spec did not state (e.g. `fonts: 'system-serif'` as the spelling of system fonts; the texture check's per-ground pairs; any palette change from Step 4, with the before/after hex and the ratio that forced it).

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/specs/2026-10-05-neobrutalism-study-engine-design.md src/study
git commit -m "docs(spec): implementation notes for the study engine

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KSJBMWKyZ84zmowVqRPUEt"
```

Show the owner the four sheets (send the PNGs) before Plan 2 is written: they are the first look at the study's visual direction.
