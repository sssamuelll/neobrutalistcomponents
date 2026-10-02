# neobrutalistcomponents v1.0 "2026 refresh" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the 3-component v0.2 library into a 16-component, 5-theme, light/dark, agent-documented v1.0 design system with a fully themed docs site.

**Architecture:** Cascade-layered CSS driven by a closed `--nbc-*` token contract; themes are self-contained folders (tokens + per-component flourishes) inlined at build time; components are thin React 19 wrappers over native elements; docs metadata + live examples are a single source of truth for the site, `llms.txt` and an agent skill.

**Tech Stack:** React 19.3, TypeScript 6.0, Vite 8 (lib + site), Vitest 5 + Testing Library + vitest-axe, Playwright + @axe-core/playwright, ESLint 10, publint.

**Spec:** `docs/superpowers/specs/2026-10-01-neobrutalistcomponents-v1-2026-refresh-design.md`

**Execution method (chosen autonomously — owner delegated):** hybrid. Tasks 1–7 (toolchain, foundation, exemplar components) run natively because every later task copies their patterns. Tasks 8–20 (new components) are dispatched to subagents in parallel batches of ≤ 3 (8 GB RAM machine) on disjoint files; the controller integrates shared files after each batch. Tasks 21–27 run natively. A fresh reviewer subagent checks the whole branch before the PR.

## Global Constraints

- Package version `1.0.0`, ESM-only, `"type": "module"`, no runtime dependencies, peers `react@^19`, `react-dom@^19`.
- Node ≥ 20.19 (`engines`), CI on Node 22.
- TypeScript `~6.0.3` (not 7 — `typescript-eslint` peers `<6.1.0`).
- Every CSS file in `src/lib` starts with exactly: `@layer nbc.tokens, nbc.theme, nbc.base, nbc.components, nbc.flourish;`
- Component CSS reads only `var(--nbc-*)`; no hex literals, no `[data-theme]` selectors in `src/lib/<Component>/*.css`.
- Theme-specific rules live only in `src/lib/themes/<theme>/<Component>.css`, every selector prefixed `[data-theme="<theme>"]`.
- Theme color tokens are hex literals or `light-dark(<hex>, <hex>)`.
- Control heights: `--nbc-control-h-sm: 32px`, `--nbc-control-h-md: 40px`, `--nbc-control-h-lg: 48px`, invariant across themes.
- Class names: BEM `nbc-<block>[__elem][--mod]`.
- Props: extend the native element's `ComponentProps<'el'>`; spread `...rest` on the native element; `className` on the outermost element.
- Field API: `label`, `description`, `error: ReactNode | boolean`.
- Sizes: `'sm' | 'md' | 'lg'` (Checkbox, Radio, Switch, Badge, Kbd: `'sm' | 'md'`); default `'md'`.
- Every component test file includes an axe assertion.
- Commit messages: Conventional Commits, ending with the `Co-Authored-By` + `Claude-Session` trailers.
- Never `npm publish`, never merge to `main`, never push tags.

## Review Focus

1. **Theme switch with an element nested in two providers** (`<NeoProvider theme="classic" mode="dark"><NeoProvider theme="tech">`) — inner island must render tech in its native dark scheme, not inherit classic's mode. Test: NeoProvider test "nested provider without mode uses its own theme's native scheme".
2. **Consumer CSS override without `!important`** — `.mine { background: red }` must beat `.nbc-button--primary`. Test: layer-order assertion in `src/lib/styles.test.ts` (every CSS file in `src/lib` begins with the layer statement; entry files import with `layer(...)`).
3. **Button inside a `<form>` with no `type`** — must not submit the form. Test: Button test "defaults to type=button".
4. **Controlled Dialog closed by Esc / backdrop / native form `method="dialog"`** — every path must call `onOpenChange(false)` exactly once and never leave `open` prop and DOM state disagreeing. Tests in Dialog task.
5. **Ids containing characters invalid in CSS idents or IDREFs** (React `useId` output, Tabs values with spaces) — anchor names and `aria-controls` must stay valid. Tests in Tabs ("value with spaces") and Tooltip ("anchor name is a valid dashed ident").

---

## File map

```
package.json · vite.config.ts (lib) · vite.site.config.ts · vitest.config.ts · playwright.config.ts
tsconfig.json (typecheck, all) · tsconfig.lib.json (d.ts emit) · tsconfig.node.json · eslint.config.js
scripts/build-themes.mjs     inline theme @imports → dist/themes/*.css (+ copy *.fonts.css)
scripts/gen-llms.mjs         meta + examples → public/llms.txt, public/llms-full.txt
scripts/check-package.mjs    asserts every export target exists in dist
scripts/screenshots.mjs      local review: every route × theme × mode → .screenshots/
src/lib/
  index.ts                   public API (imports ./styles.css)
  css.d.ts                   declare module '*.css'
  styles.css                 layer order + @import base + every component CSS
  tokens.css                 :root defaults (layer nbc.tokens)
  base.css                   scheme/mode, .nbc-root, reduced-motion, forced-colors (layer nbc.base)
  styles.test.ts             CSS conventions test
  NeoProvider.tsx / .test.tsx
  internal/cx.ts · Slot.tsx · useControllableState.ts · Field.tsx · Field.css · icons.tsx · (+ tests)
  themes/index.ts            NeoTheme, NEO_THEMES, NeoMode, NEO_MODES, THEME_INFO
  themes/contract.ts         REQUIRED_TOKENS, CONTRAST_PAIRS
  themes/contract.test.ts
  themes/<theme>/index.css · tokens.css · fonts.css · <Component>.css      (theme ∈ classic tech swiss y2k riso)
  <Component>/<Component>.tsx · .css · .test.tsx · index.ts
src/docs/
  types.ts                   ComponentMeta, PropDoc
  meta/<Component>.ts · meta/index.ts
  examples/<Component>/<Example>.tsx
  drift.test.ts
src/site/                    themed docs site (Task 23)
src/main.tsx                 site entry
e2e/site.spec.ts             Playwright smoke + axe
skills/neobrutalist-ui/SKILL.md
README.md · MIGRATION.md · CHANGELOG.md · CONTRIBUTING.md · .github/workflows/*.yml
```

---

### Task 1: Toolchain upgrade (green on the old components)

**Files:** Modify `package.json`, `vite.config.ts`, `vite.site.config.ts`, `vitest.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `eslint.config.js`, `.gitignore`, `src/test-setup.ts`. Create `tsconfig.lib.json`, `src/lib/css.d.ts`. Delete `tsconfig.app.json`, `scripts/copy-themes.mjs` (replaced in Task 2).

**Interfaces — Produces:** scripts `dev`, `build`, `build:lib`, `build:site`, `test`, `test:watch`, `typecheck`, `lint`, `check:package`, `e2e`, `gen:llms`, `screenshots`, `check` (= lint + typecheck + test + build + check:package). Path alias `neobrutalistcomponents` → `src/lib/index.ts` in tsconfig, vite site config and vitest config.

- [ ] **Step 1:** `package.json` devDependencies → `vite@^8.3.2 vitest@^5.0.3 @vitejs/plugin-react@^6.1.1 typescript@~6.0.3 react@^19.3.0 react-dom@^19.3.0 @types/react@^19.3.0 @types/react-dom@^19.3.0 eslint@^10.11.0 @eslint/js@^10.0.1 typescript-eslint@^8.71.0 eslint-plugin-react-hooks@^7.1.1 eslint-plugin-react-refresh@^0.5.7 globals@^17.13.0 jsdom@^30.1.1 @testing-library/react@^16.3.3 @testing-library/dom@^10 @testing-library/jest-dom@^7.0.1 @testing-library/user-event@^14.6.7 vitest-axe@^0.1.0 axe-core@^4.13.0 publint@^0.3.25 @types/node@^24`; remove `vite-plugin-dts`. `version: "1.0.0"`, `engines.node: ">=20.19"`, `exports`:
  ```json
  ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
  "./styles.css": "./dist/styles.css",
  "./neobrutalistcomponents.css": "./dist/styles.css",
  "./themes/*": "./dist/themes/*",
  "./llms.txt": "./dist/llms.txt",
  "./llms-full.txt": "./dist/llms-full.txt",
  "./package.json": "./package.json"
  ```
  `files: ["dist", "skills"]`, `sideEffects: ["**/*.css"]`, `main/module/types` pointing at dist.
- [ ] **Step 2:** `vite.config.ts` lib mode: entry `src/lib/index.ts`, `formats: ['es']`, `fileName: 'index'`, `cssFileName: 'styles'`, externals `react`, `react-dom`, `react/jsx-runtime`, `copyPublicDir: false`, `cssCodeSplit: false`.
- [ ] **Step 3:** `tsconfig.lib.json` (extends `tsconfig.json`; `include: ["src/lib"]`, `exclude: ["src/lib/**/*.test.*"]`, `noEmit: false`, `emitDeclarationOnly: true`, `declaration: true`, `outDir: "dist"`, `rootDir: "src/lib"`). `tsconfig.json`: strict, `module: esnext`, `moduleResolution: bundler`, `jsx: react-jsx`, `noEmit`, `types: ["vitest/globals", "vite/client"]`, `paths: { "neobrutalistcomponents": ["./src/lib/index.ts"] }`, include `src`, `e2e`. `src/lib/css.d.ts`: `declare module '*.css';`
- [ ] **Step 4:** ESLint 10 flat config with `typescript-eslint`, `react-hooks` recommended (v7), `react-refresh`; ignores `dist`, `site-dist`, `.screenshots`, `playwright-report`, `test-results`.
- [ ] **Step 5:** `npm install`, then `npm run lint && npm run typecheck && npm test && npm run build:lib`. Expected: existing 38 tests pass; `dist/index.js`, `dist/styles.css`, `dist/index.d.ts` exist.
- [ ] **Step 6:** Commit `chore(toolchain): Vite 8, Vitest 5, TS 6, ESLint 10, ESM-only build`.

### Task 2: Foundation — layers, tokens, base, NeoProvider v1, theme build

**Files:** Create `src/lib/tokens.css` (rewrite), `src/lib/base.css`, `src/lib/styles.css`, `src/lib/styles.test.ts`, `src/lib/themes/index.ts` (rewrite), `src/lib/themes/contract.ts`, `scripts/build-themes.mjs`. Modify `src/lib/NeoProvider.tsx`, `src/lib/NeoProvider.test.tsx`, `src/lib/index.ts`.

**Interfaces — Produces:**
```ts
// themes/index.ts
export type NeoBuiltinTheme = 'classic' | 'tech' | 'swiss' | 'y2k' | 'riso';
export type NeoTheme = NeoBuiltinTheme | (string & {});
export const NEO_THEMES: readonly NeoBuiltinTheme[]; // in that order
export type NeoMode = 'light' | 'dark' | 'system';
export const NEO_MODES: readonly NeoMode[];
export interface NeoThemeInfo { id: NeoBuiltinTheme; name: string; tagline: string; nativeScheme: 'light' | 'dark'; swatch: string[] }
export const THEME_INFO: Record<NeoBuiltinTheme, NeoThemeInfo>;
// NeoProvider.tsx
export interface NeoProviderProps extends HTMLAttributes<HTMLElement> { theme: NeoTheme; mode?: NeoMode; as?: 'div' | 'main' | 'section' | 'article' | 'body' | 'span'; ref?: Ref<HTMLElement> }
export function NeoProvider(props): JSX.Element; // renders <as class="nbc-root …" data-theme data-mode?>
export function useTheme(): { theme: NeoTheme; mode: NeoMode | undefined } | undefined;
// themes/contract.ts
export const REQUIRED_TOKENS: readonly string[];        // every theme-level token in spec D7
export const COLOR_TOKENS: readonly string[];           // subset that must be hex / light-dark(hex,hex)
export const CONTRAST_PAIRS: readonly { fg: string; bg: string; min: 3 | 4.5 }[];
```
Layer order statement (every CSS file): `@layer nbc.tokens, nbc.theme, nbc.base, nbc.components, nbc.flourish;`

- [ ] **Step 1: failing tests.** `NeoProvider.test.tsx`: renders `data-theme`, adds `nbc-root`, omits `data-mode` when no `mode`, sets `data-mode="dark"`, `useTheme()` returns `{ theme, mode }`, nested provider exposes inner theme, `as="main"` renders `<main>`, forwards `className`/`ref`/arbitrary props. `styles.test.ts`: every `src/lib/**/*.css` starts with the layer statement; no `[data-theme` and no `#hex` in `src/lib/<Component>/*.css` and `src/lib/internal/*.css`; every theme `<Component>.css` selector line that opens a rule starts with `[data-theme="<that theme>"]`.
- [ ] **Step 2:** Run `npx vitest run src/lib/NeoProvider.test.tsx src/lib/styles.test.ts` → FAIL.
- [ ] **Step 3:** Implement. `tokens.css` (`@layer nbc.tokens { :root { … } }`) defines invariants (space xs 4 / sm 8 / md 12 / lg 16 / xl 24 / 2xl 32 / 3xl 48; fs xs 12 / sm 14 / md 16 / lg 18 / xl 22 / 2xl 28 / 3xl 36 / 4xl 48; control-h 32/40/48) and neutral defaults for every REQUIRED token plus `--nbc-scheme: light`. `base.css` (`@layer nbc.base`): `[data-theme]{color-scheme:var(--nbc-scheme)}`, `[data-theme][data-mode="light"|"dark"|"system"]` overrides, `.nbc-root{background-color:var(--nbc-bg);color:var(--nbc-fg);font-family:var(--nbc-font-sans);font-weight:var(--nbc-weight-body);accent-color:var(--nbc-primary);-webkit-font-smoothing:antialiased}`, `.nbc-root ::selection`, reduced-motion (`--nbc-press*: 0px`, durations 0, `[class*="nbc-"]` animations off with `!important`), `@media (forced-colors: active)` focus outline fallback. `styles.css`: layer statement, `@import './tokens.css' layer(nbc.tokens); @import './base.css' layer(nbc.base);` then one `@import './<C>/<C>.css' layer(nbc.components);` per component (grows per task). `build-themes.mjs`: for each `src/lib/themes/<t>/index.css`, inline `@import './x.css' layer(L);` as `@layer L {\n<content minus its own layer statement>\n}`, prepend the layer statement, write `dist/themes/<t>.css`; copy `fonts.css` → `dist/themes/<t>.fonts.css`. Exits non-zero on a missing import.
- [ ] **Step 4:** Tests PASS. Commit `feat(core): cascade layers, token contract, color modes, NeoProvider v1`.

### Task 3: Five theme token sets + contract test

**Files:** Create `src/lib/themes/{classic,tech,swiss,y2k,riso}/{index.css,tokens.css,fonts.css}`, `src/lib/themes/contract.test.ts`. Delete old `src/lib/themes/*.css`.

**Interfaces — Consumes:** `REQUIRED_TOKENS`, `COLOR_TOKENS`, `CONTRAST_PAIRS`. **Produces:** `[data-theme="<t>"]` blocks defining every required token + `--nbc-scheme`.

- [ ] **Step 1: failing test** `contract.test.ts`: for each theme, parse `tokens.css` declarations inside `[data-theme="<t>"] { … }` → map; assert every `REQUIRED_TOKENS` entry present; every `COLOR_TOKENS` entry matches `^#hex$` or `^light-dark\(#hex,\s*#hex\)$` (after resolving `var(--x)` within the map); for both schemes compute WCAG contrast for `CONTRAST_PAIRS` (alpha-composite translucent colors over `--nbc-bg`; for `primary-fill`, check `primary-fg` against every hex stop) and assert ≥ min. Message names theme, scheme, pair and ratio.
- [ ] **Step 2:** Run → FAIL (no theme folders).
- [ ] **Step 3:** Author the five token sets following spec D6 identity briefs; tune values until contrast passes in both schemes. `fonts.css` = single Google Fonts `@import url(...)` with that theme's families.
- [ ] **Step 4:** PASS. Commit `feat(themes): classic, tech, swiss, y2k refreshed + new riso, all light/dark`.

### Task 4: Internals

**Files:** Create `src/lib/internal/{cx.ts,Slot.tsx,Slot.test.tsx,useControllableState.ts,useControllableState.test.tsx,Field.tsx,Field.css,Field.test.tsx,icons.tsx}`; add `Field.css` import to `styles.css`.

**Interfaces — Produces:**
```ts
export function cx(...parts: Array<string | false | null | undefined | 0>): string;
export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T>;
export function mergeProps(slot: Record<string, unknown>, child: Record<string, unknown>): Record<string, unknown>; // className join, style merge (child wins), on* handlers chained child→slot, ref composed
export function Slot(props: { children: ReactElement } & Record<string, unknown>): ReactElement; // cloneElement(child, mergeProps(rest, child.props))
export function useControllableState<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void): [T, (v: T) => void];
export interface FieldOwnProps { label?: ReactNode; description?: ReactNode; error?: ReactNode | boolean }
export function useField(idProp: string | undefined, p: { description?: ReactNode; error?: ReactNode | boolean }): { id: string; invalid: boolean; message: ReactNode; messageId: string | undefined; isError: boolean };
export function FieldShell(p: { id: string; label?: ReactNode; required?: boolean; message?: ReactNode; messageId?: string; isError: boolean; invalid: boolean; disabled?: boolean; size: 'sm' | 'md' | 'lg'; className?: string; children: ReactNode }): JSX.Element;
// renders div.nbc-field.nbc-field--{size}[.nbc-field--invalid][.nbc-field--disabled] > label.nbc-field__label[for=id] (+ span.nbc-field__required[aria-hidden] "*") , children , p.nbc-field__message[id][.nbc-field__message--error]
export const Icon: { Check, Dash, ChevronDown, X, Info, CheckCircle, AlertTriangle, AlertOctagon } // (props: SVGProps) => svg, 1em, stroke currentColor, strokeWidth 2.5, square caps, aria-hidden
```
Rules: `useField` → `invalid = error != null && error !== false && error !== ''`; `message = invalid && error !== true ? error : description`; `messageId = message ? \`${id}-message\` : undefined`; `id = idProp ?? \`nbc-${useId() sanitized to [A-Za-z0-9_-]}\``.

- [ ] Steps: failing tests (cx falsy filtering; mergeProps joins classes, chains handlers in order child→slot, child style wins, composes refs; Slot renders child tag with merged props; useControllableState uncontrolled updates + calls onChange, controlled ignores internal set; FieldShell label association, required marker hidden from AT, message id, error class) → FAIL → implement → PASS → commit `feat(internal): Slot, mergeProps, controllable state, Field shell, icons`.

### Task 5: Docs infrastructure

**Files:** Create `src/docs/types.ts`, `src/docs/meta/index.ts`, `src/docs/drift.test.ts`.

**Interfaces — Produces:**
```ts
export interface PropDoc { name: string; type: string; default?: string; required?: boolean; description: string }
export interface SubcomponentDoc { name: string; element: string; description: string; propsInterface?: string; props?: PropDoc[] }
export type ComponentGroup = 'Actions' | 'Forms' | 'Display' | 'Overlays';
export interface ComponentMeta {
  name: string; slug: string; group: ComponentGroup; summary: string;
  whenToUse: string[]; whenNotToUse: string[];
  extends: string;                 // e.g. "ComponentProps<'button'>"
  props: PropDoc[];                // exactly the own members of `${name}Props`
  subcomponents?: SubcomponentDoc[];
  classes: string[];               // public BEM hooks
  accessibility: string[]; rules: string[];
  examples: { file: string; title: string; description?: string }[]; // src/docs/examples/<name>/<file>.tsx
}
// meta/index.ts
export const COMPONENTS: readonly ComponentMeta[]; // grouped order: Actions, Forms, Display, Overlays
```
- [ ] `drift.test.ts`: for each meta → `src/lib/<name>/<name>.tsx` exists; TS compiler API collects own property names of `interface <name>Props` (and of each `propsInterface`) and asserts set-equality with `props[].name`; every `examples[].file` exists; every `export { X } from './X'` component in `src/lib/index.ts` has meta. Commit `feat(docs): component metadata contract + drift test`.

### Tasks 6–7: Button v1, Input v1, Card v1 (native, they are the exemplars)

Each component task produces the same bundle — this is the **component definition of done** used by Tasks 6–20:

1. `src/lib/<C>/<C>.tsx` + `index.ts` (exports component + types).
2. `src/lib/<C>/<C>.css` — theme-agnostic, tokens only.
3. `src/lib/<C>/<C>.test.tsx` — behaviour + a11y (axe), written first and seen failing.
4. `src/lib/themes/<t>/<C>.css` for every theme whose identity brief calls for a flourish (selector prefix `[data-theme="<t>"]`).
5. `src/docs/meta/<C>.ts` exporting `export const <C>Meta: ComponentMeta`.
6. `src/docs/examples/<C>/*.tsx` — at least `Basic.tsx` plus one that shows the variant/size matrix or the main composition; examples import from `'neobrutalistcomponents'` and default-export a component named after the file.
7. Controller integration: export from `src/lib/index.ts`, `@import` in `styles.css`, `@import` flourish files in each `themes/<t>/index.css`, add meta to `meta/index.ts`.

**Button** — `ButtonProps extends ComponentProps<'button'>`: `variant?: 'primary'|'secondary'|'danger'|'ghost'` (primary) · `size?: 'sm'|'md'|'lg'` (md) · `loading?` · `fullWidth?` · `leftIcon?` · `rightIcon?` · `asChild?`. DOM `button.nbc-button.nbc-button--{variant}.nbc-button--{size}[--full-width][--loading][--icon-only][type=button default]` > `span.nbc-button__spinner` (loading) · `span.nbc-button__icon` · `span.nbc-button__label`. Tests: defaults (`primary`, `md`, `type="button"`), `type="submit"` respected, variant/size classes, loading → `aria-busy` + disabled + no click + icons hidden, icon-only class when no children and one icon, `asChild` renders `<a>` with classes/href and `aria-disabled` when disabled, consumer className merge, ref, axe.

**Input** — `InputProps extends Omit<ComponentProps<'input'>, 'size'>`: `size?` · `label?` · `description?` · `error?: ReactNode|boolean` · `leftIcon?` · `rightIcon?`. DOM `FieldShell` > `div.nbc-input.nbc-input--{size}[--invalid][--disabled]` > icons + `input.nbc-input__control`. Tests: label association, auto id, description → `aria-describedby`, `error="msg"` → `aria-invalid` + message replaces description, `error` true → `aria-invalid` and description kept, `required` marker `aria-hidden`, size classes, icons, ref to `<input>`, className on wrapper, axe.

**Card** — `CardProps extends HTMLAttributes<HTMLElement>`: `variant?: 'default'|'elevated'|'interactive'` · `as?: 'div'|'article'|'section'|'li'` · `ref?: Ref<HTMLElement>`. `Card.Title` `as?: 'h2'|'h3'|'h4'|'h5'|'h6'` (h3). Interactive = stretched link (`.nbc-card--interactive .nbc-card__title a::after{inset:0}`) + `:has(.nbc-card__title a:focus-visible)` ring; footer stays clickable above it. Tests: variants, `as`, title level, composition, className/ref, axe with interactive + link.

Commit per component: `feat(<c>): v1 …`.

### Tasks 8–20: New components (subagents, batches of ≤ 3)

Batch A: Textarea, Select, Checkbox · Batch B: RadioGroup, Switch, Badge · Batch C: Alert, Progress, Table · Batch D: Kbd, Tabs, Dialog · Batch E: Tooltip.

Contracts (each subagent receives its section verbatim + the definition of done + spec D6 identity table + Button/Input as reference implementations):

**Textarea** — `TextareaProps extends ComponentProps<'textarea'>` + `size?` · `label?` · `description?` · `error?` · `autoResize?: boolean` (true). DOM `FieldShell` > `textarea.nbc-textarea.nbc-textarea--{size}[--auto][--invalid]`, inline `--nbc-textarea-rows: rows ?? 3`. CSS: `.nbc-textarea--auto{field-sizing:content}`, `min-block-size: calc(var(--nbc-textarea-rows) * 1lh + padding)`. Tests: Field API parity with Input, rows var, autoResize false removes class, ref, axe.

**Select** — `SelectProps extends Omit<ComponentProps<'select'>, 'size'|'multiple'>` + `size?` · `label?` · `description?` · `error?` · `placeholder?: string`. DOM `FieldShell` > `div.nbc-select.nbc-select--{size}[--invalid][--disabled]` > `select.nbc-select__control` + `Icon.ChevronDown.nbc-select__chevron`. `placeholder` → first `<option value="" disabled>`; when uncontrolled without `defaultValue`, `defaultValue=""`. `@supports (appearance: base-select)` block themes `::picker(select)`, `option`, `option:checked`, hides the svg chevron and styles `::picker-icon`. Tests: options render, placeholder selected initially, onChange value, Field API parity, ref, axe.

**Checkbox** — `CheckboxProps extends Omit<ComponentProps<'input'>, 'type'|'size'>` + `size?: 'sm'|'md'` · `label?` · `description?` · `error?` · `indeterminate?`. DOM `div.nbc-checkbox.nbc-checkbox--{size}[--invalid][--disabled]` > `span.nbc-checkbox__box` > `input.nbc-checkbox__control[type=checkbox]` + `Icon.Check.nbc-checkbox__check` + `Icon.Dash.nbc-checkbox__dash`; `div.nbc-checkbox__text` > `label.nbc-checkbox__label[for]` + `p.nbc-checkbox__message`. Input is real, transparent, covering the box. Tests: toggles on label click, controlled `checked`, `indeterminate` sets DOM property, error → aria-invalid + described, ref, axe.

**RadioGroup + Radio** — `RadioGroupProps extends Omit<ComponentProps<'fieldset'>, 'onChange'|'defaultValue'>` + `label?` · `description?` · `error?` · `name?` · `value?` · `defaultValue?` · `onValueChange?: (v: string) => void` · `orientation?: 'vertical'|'horizontal'` (vertical) · `size?: 'sm'|'md'` · `required?`. `RadioProps extends Omit<ComponentProps<'input'>, 'type'|'size'|'name'|'checked'|'defaultChecked'|'value'>` + `value: string` · `label?` · `description?`. DOM `fieldset.nbc-radio-group[role=radiogroup].nbc-radio-group--{orientation}.nbc-radio-group--{size}` > `legend.nbc-radio-group__label` + `div.nbc-radio-group__items` + `p.nbc-radio-group__message`; Radio `div.nbc-radio` > `span.nbc-radio__box` > `input.nbc-radio__control[type=radio]` + `span.nbc-radio__dot`; `div.nbc-radio__text` > `label` + `p.nbc-radio__description`. Tests: shared auto name, uncontrolled selection, controlled + onValueChange, disabled group, error → aria-invalid on group, axe.

**Switch** — `SwitchProps extends Omit<ComponentProps<'input'>, 'type'|'size'|'role'>` + `size?: 'sm'|'md'` · `label?` · `description?`. DOM `div.nbc-switch.nbc-switch--{size}[--disabled]` > `span.nbc-switch__track` > `input.nbc-switch__control[type=checkbox][role=switch]` + `span.nbc-switch__thumb`; `div.nbc-switch__text` > `label` + `p.nbc-switch__description`. Tests: role switch, toggles, `aria-checked` reflects state (native), description linked, axe.

**Badge** — `BadgeProps extends ComponentProps<'span'>` + `variant?: 'neutral'|'primary'|'accent'|'info'|'success'|'warning'|'danger'` (neutral) · `size?: 'sm'|'md'`. DOM `span.nbc-badge.nbc-badge--{variant}.nbc-badge--{size}`. Tests: classes, children, axe.

**Alert** — `AlertProps extends Omit<ComponentProps<'div'>, 'title'>` + `variant?: 'info'|'success'|'warning'|'danger'` (info) · `title?` · `icon?: ReactNode | false` · `action?` · `onDismiss?: () => void` · `dismissLabel?: string` ('Dismiss'). DOM `div.nbc-alert.nbc-alert--{variant}` > `span.nbc-alert__icon[aria-hidden]` + `div.nbc-alert__body` > `p.nbc-alert__title` + `div.nbc-alert__description` ; `div.nbc-alert__action` ; `button.nbc-alert__dismiss[aria-label]`. Default icon per variant (Info, CheckCircle, AlertTriangle, AlertOctagon). Tests: default icon, `icon={false}`, custom icon, title, dismiss button calls handler and is labelled, role passthrough, axe.

**Progress** — `ProgressProps extends Omit<ComponentProps<'div'>, 'children'>` + `value?: number | null` · `max?: number` (100) · `label?` · `showValue?` · `size?` · `variant?: 'primary'|'success'|'warning'|'danger'`. DOM `div.nbc-progress[role=progressbar].nbc-progress--{size}.nbc-progress--{variant}[--indeterminate][aria-valuemin=0][aria-valuemax][aria-valuenow][aria-labelledby]` > `div.nbc-progress__header` (`span.nbc-progress__label` + `span.nbc-progress__value`) + `div.nbc-progress__track` > `div.nbc-progress__bar` with `--nbc-progress-value: <pct>%`. Value clamped to [0, max]. Tests: aria values, clamping, indeterminate omits valuenow, label association, showValue text "42%", axe.

**Table** — `TableProps extends ComponentProps<'table'>` + `density?: 'compact'|'comfortable'` · `striped?`. Subcomponents `Table.Caption/Head/Body/Foot/Row` (native props), `Table.HeaderCell` (`ComponentProps<'th'>` + `align?: 'start'|'center'|'end'`, `scope` default `col`), `Table.Cell` (`ComponentProps<'td'>` + `align?` + `numeric?`). DOM `div.nbc-table[.nbc-table--{density}][.nbc-table--striped]` (className here) > `table.nbc-table__table` (rest here). Tests: structure/roles, scope default, numeric class, className on wrapper and ref on table, axe.

**Kbd** — `KbdProps extends ComponentProps<'kbd'>` + `size?: 'sm'|'md'`. DOM `kbd.nbc-kbd.nbc-kbd--{size}`. Tests: renders kbd, size, axe.

**Tabs** — `TabsProps extends Omit<ComponentProps<'div'>, 'onChange'|'defaultValue'>` + `value?` · `defaultValue?` · `onValueChange?`. `Tabs.List` (`ComponentProps<'div'>`, role tablist), `Tabs.Tab` (`Omit<ComponentProps<'button'>, 'value'>` + `value: string`), `Tabs.Panel` (`ComponentProps<'div'>` + `value: string`). Ids from sanitized `useId` + sanitized value. Roving tabindex, ←/→/Home/End with automatic activation, skips disabled. When neither value nor defaultValue is given, the first enabled tab is selected after mount. Panels stay mounted, `hidden` when inactive, `tabIndex=0`. Tests: aria wiring, click selects, keyboard nav + wrap, disabled skipped, controlled, value with spaces yields valid ids, axe.

**Dialog** — `DialogProps extends Omit<ComponentProps<'dialog'>, 'open'>` + `open: boolean` · `onOpenChange: (open: boolean) => void` · `size?: 'sm'|'md'|'lg'` · `closeOnBackdrop?` (true) · `hideClose?` · `closeLabel?` ('Close'). Subcomponents `Dialog.Header/Title(h2)/Description/Content/Footer`. Native `showModal()`/`close()` synced in an effect; `cancel` → `preventDefault` + `onOpenChange(false)`; `close` event while `open` prop true → `onOpenChange(false)`; click whose target is the `<dialog>` itself (backdrop; panel is an inner div) → `onOpenChange(false)` when `closeOnBackdrop`. `aria-labelledby`/`aria-describedby` set only when Title/Description mounted. CSS: `@starting-style` enter, `transition-behavior: allow-discrete` on `display` + `overlay`, `html:has(.nbc-dialog[open]:modal){overflow:hidden}`. jsdom polyfill for `showModal/close` in `test-setup.ts`. Tests: opens/closes with prop, Esc calls onOpenChange(false) once, backdrop click closes / doesn't when disabled, close button labelled, labelledby/describedby wiring, axe while open.

**Tooltip** — `TooltipProps { content: ReactNode; children: ReactElement; side?: 'top'|'bottom'|'left'|'right' (top); delay?: number (400); disabled?: boolean; className?: string }`. Renders child via `cloneElement` + `mergeProps` (adds `aria-describedby`, pointer/focus/blur/Escape handlers, class `nbc-tooltip-anchor`, style `--nbc-anchor-name`) and a sibling `div.nbc-tooltip.nbc-tooltip--{side}[popover=manual][role=tooltip][id][data-state]`. Show = `showPopover()`; CSS anchor positioning inside `@supports (anchor-name: --a)` with `position-try-fallbacks: flip-block` / `flip-inline`; JS fallback sets `top/left` when unsupported. jsdom polyfill for `showPopover/hidePopover`. Tests: focus opens immediately, hover opens after delay (fake timers), pointer leave/blur/Escape close, describedby wiring, disabled never opens, anchor name matches `/^--[A-Za-z0-9_-]+$/`, axe.

### Task 21: Lib integration + package check

**Files:** `src/lib/index.ts`, `src/lib/styles.css`, `src/lib/themes/*/index.css`, `src/docs/meta/index.ts`, `scripts/check-package.mjs`.
- [ ] `check-package.mjs` resolves every `exports` target (expanding `./themes/*` to the 5 themes + fonts files) and fails if missing; checks `dist/styles.css` contains `.nbc-button` and `@layer`, every theme CSS contains `[data-theme="<t>"]`. Then `npx publint`. Commit `build: package exports check`.

### Task 22: llms.txt generator

**Files:** `scripts/gen-llms.mjs`, `public/llms.txt`, `public/llms-full.txt`.
- [ ] Load `src/docs/meta/index.ts` with Vite `runnerImport`; write `llms.txt` (llmstxt.org shape: title, blockquote summary, Docs list linking `#/components/<slug>`, Optional → `llms-full.txt`) and `llms-full.txt` (install, setup, themes table, token contract, composition rules, then per component: summary, when/when-not, props table, subcomponents, a11y, rules, every example's source). `build:lib` copies both into `dist/`. CI asserts regenerated files have no diff. Commit `feat(docs): llms.txt + llms-full.txt generated from metadata`.

### Task 23: Docs site rebuild

**Files:** replace `src/site/**`; modify `src/main.tsx`, `index.html`.
- Shell: sticky top bar (brand, nav: Components · Themes · Blocks · Start · Agents, theme picker with 5 swatch buttons `aria-pressed`, mode segmented control Light/Dark/System, GitHub link), component sidebar on component routes, footer.
- `prefs.ts`: theme/mode from `?theme=&mode=` → `localStorage` → defaults (`classic`, native mode); changes wrapped in `document.startViewTransition` unless reduced motion.
- `router.ts`: hash router (`#/`, `#/components`, `#/components/:slug`, `#/themes`, `#/blocks`, `#/start`, `#/agents`), 404 page.
- Pages: Home (hero, install snippet with copy, five-theme strip of mini previews, "deterministic by construction" list, blocks teaser), Component page (from meta: summary, when/when-not, live examples with code toggle + copy via `?raw`, props table, subcomponents, a11y, rules, CSS hooks), Themes (per theme: swatches for every color token, live contrast ratios computed in the browser, typography sample, all components small matrix), Blocks (SignIn, Pricing, Settings, Dashboard — real compositions), Start (install, setup, fonts, BYO theme, migration link), Agents (llms links, skill install instructions, rules).
- Site CSS uses only tokens and layout; everything inside the root `NeoProvider`.
- Commit `feat(site): themed docs site with live examples, token explorer and blocks`.

### Task 24: E2E smoke

**Files:** `playwright.config.ts`, `e2e/site.spec.ts`; devDeps `@playwright/test`, `@axe-core/playwright`.
- [ ] For each theme × routes (home, every component page, themes, blocks, start, agents): load `?theme=<t>#<route>`, assert main heading visible, zero console errors, axe (wcag2a, wcag2aa, wcag22aa) zero violations; plus one dark-mode pass per theme on home + blocks. Commit `test(e2e): Playwright smoke + axe across themes`.

### Task 25: Docs, skill, CI

**Files:** `README.md`, `MIGRATION.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `skills/neobrutalist-ui/SKILL.md`, `.github/workflows/{ci,deploy-pages,publish}.yml`, `.github/ISSUE_TEMPLATE/theme_contribution.md`.
- CI: Node 22; `npm ci`, lint, typecheck, test, build, check:package, `gen:llms` + `git diff --exit-code public/`, then Playwright job (install chromium, `npm run e2e`).
- Commit `docs: v1 README, migration guide, changelog, agent skill; ci: node 22 + e2e`.

### Task 26: Verification + visual review

- [ ] `npm run check` and `npm run e2e` green; `scripts/screenshots.mjs` → review every theme × mode for home, blocks, themes, three component pages; fix defects; re-run.

### Task 27: Whole-branch review + PR

- [ ] Fresh reviewer subagent on `git diff main...HEAD`; address findings; push branch; `gh pr create` (template sections filled, screenshots described, not merged).
