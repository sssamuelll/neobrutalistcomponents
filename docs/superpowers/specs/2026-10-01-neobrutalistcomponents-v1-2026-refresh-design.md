# neobrutalistcomponents · v1.0 — "2026 refresh" Design

**Date:** 2026-10-01
**Owner:** Samuel Ballesteros (SDB)
**Author:** Claude (autonomous session — owner explicitly delegated every decision and authorized plan → implementation without review gates; review happens on the PR)
**Status:** Approved by delegation · supersedes `2026-04-20-neobrutalistcomponents-v0.1-design.md` where they conflict

---

## 1. Intent (in the owner's words)

> "neobrutalist components fue creado para ser mi default para escoger interfaces hermosas y deterministas pero lo he dejado muy atrás, y necesita ser refrescado y acercado a lo que es 2026."

Translated into success criteria:

| Word | What it has to mean in the code |
|---|---|
| **default** | Broad enough to build real screens (auth, settings, dashboards, pricing, marketing) without reaching for a second UI lib. 3 components is a demo, not a default. |
| **hermosas** (beautiful) | Every theme is distinct, refined, contemporary, and works in **light and dark**. The docs site itself is the proof — it renders entirely in the selected theme. |
| **deterministas** (deterministic) | Same inputs → same pixels. A closed token contract fully specifies the look. Control heights are invariant across themes (switching theme never shifts layout vertically). One way to do each thing. Machine-readable docs so AI agents pick and compose components predictably. |
| **2026** | Modern CSS platform (cascade layers, `light-dark()`, `:has()`, `@starting-style`, native `<dialog>`, popover, anchor positioning, `field-sizing`, customizable `<select>`), current toolchain, agent-native documentation (`llms.txt`, a Claude Code skill). |

What was *said* vs. what is *assumed*:
- Said: refresh everything, bring it to 2026, decide alone, plan and execute.
- Assumed: the owner uses AI agents heavily to build UIs (evidence: the whole repo was built through superpowers flows; the machine runs Claude Code, Codex, Gemini CLI, opencode). "Deterministic default" therefore includes "deterministic for agents", which is why machine-readable docs are in scope.
- Assumed: breaking changes are acceptable (npm package has three 0.x releases, no known dependents). Shipped as **1.0.0** with a migration guide.
- Assumed: the owner wants to review before anything public changes → work lands as a **PR**, not merged, not published to npm.

---

## 2. Decisions

### D1 — Version and compatibility
- `1.0.0`. Breaking. `MIGRATION.md` documents every 0.2 → 1.0 change.
- **ESM-only** output. Node ≥ 20.19 can `require()` ESM; every 2026 bundler is ESM-first. Drops the CJS build.
- Peer: `react@^19`, `react-dom@^19`.

### D2 — Toolchain
| Tool | From | To | Note |
|---|---|---|---|
| Vite | 6 | 8 | Rolldown-based |
| Vitest | 2 | 5 | |
| @vitejs/plugin-react | 4 | 6 | |
| TypeScript | 5.8 | **6.0** | TS 7 (Go port) is out, but `typescript-eslint` peers `<6.1.0` |
| ESLint | 9 | 10 | flat config |
| jsdom | 29 | 30 | |
| Declarations | vite-plugin-dts | `tsc --emitDeclarationOnly` | one fewer dependency, deterministic |
| Package lint | — | `publint` | CI gate |
| E2E smoke | — | Playwright | site routes × themes, no console errors, axe |
| CI Node | 20 | 22 | |

### D3 — CSS architecture: cascade layers
Every stylesheet starts with the same order declaration:

```css
@layer nbc.base, nbc.theme, nbc.components, nbc.flourish;
```

- `nbc.base` — token defaults, mode rules, `.nbc-root` painting.
- `nbc.theme` — `[data-theme="x"] { --nbc-*: … }` blocks.
- `nbc.components` — theme-agnostic component rules, reading only `var(--nbc-*)`.
- `nbc.flourish` — theme-specific component rules (the personality that tokens can't express).

Consequence: **any unlayered consumer CSS beats the library with zero specificity fights.** `.my-button { background: red }` just works.

### D4 — Themes are self-contained folders
```
src/lib/themes/<name>/index.css     ← @imports below, in fixed order
src/lib/themes/<name>/tokens.css    ← the token block (+ light/dark values)
src/lib/themes/<name>/<Component>.css ← flourishes, only where needed
```
- The component's base CSS contains **no** theme selectors. Importing one theme ships only that theme's personality.
- `scripts/build-themes.mjs` inlines each `index.css` into `dist/themes/<name>.css` (deterministic `@import` inliner, no extra deps).
- A BYO theme is the same shape as a built-in one.

### D5 — Color modes via `light-dark()`
- Every color token is a hex literal or `light-dark(<hex>, <hex>)`.
- Each theme declares its **native** scheme (`classic`, `swiss`, `y2k`, `riso`: light · `tech`: dark) via `color-scheme`.
- `NeoProvider mode="light" | "dark" | "system"` overrides it via `data-mode`. Omitted → the theme's native scheme. **Default is deterministic** (no OS-dependent rendering unless you opt in with `"system"`).

### D6 — Five themes
Four refreshed, one new. Identity briefs (component authors follow these when writing flourishes):

| Theme | One line | Signature moves | Type |
|---|---|---|---|
| **classic** | "This decision is final." | Warm paper, 3px ink borders, double-stack shadow (ink core + coral offset), sun-yellow primary, primary button micro-tilt. Dark: ink canvas, cream borders, yellow/coral stack. | Bricolage Grotesque (display) · Geist (body) · Geist Mono |
| **tech** | Terminal sophistication. | Graphite + phosphor green, magenta secondary, 1px lines, 2px radius, `> ` and `$ ` prompts, blinking caret, inverted text-selection focus, stepped motion, 24px grid texture. Light: "paper terminal" (green-black ink on pale mint). | Geist Mono · JetBrains Mono |
| **swiss** | Precision, not plainness. | 1px hairlines everywhere, no drop shadows, one oxblood accent, uppercase tracked labels, tabular numerals, `— ` label rules, inset focus lines. Dark: true black, white hairlines, brighter oxblood. | Inter Tight · JetBrains Mono |
| **y2k** | Holographic trading-card energy. | Holo gradient fills, chromatic-aberration shadows (cyan/magenta offsets), pill buttons, glossy bevel highlights, −0.8° tilt, sticker badges. Dark: "midnight holo". | Sixtyfour (display) · VT323 (body) |
| **riso** *(new)* | Risograph zine. | Off-white paper with grain texture, fluorescent pink + riso blue inks, **misregistered** two-ink shadows, ink-colored text instead of black, condensed heavy uppercase display. Dark: "night print" (inks glowing on dark paper). | Archivo (condensed, variable width) · IBM Plex Mono |

### D7 — Token contract v1
Required tokens (enforced by `src/lib/themes/contract.test.ts` for every theme, both modes):

**Typography** — `--nbc-font-sans`, `--nbc-font-display`, `--nbc-font-mono`, `--nbc-weight-body`, `--nbc-weight-label`, `--nbc-weight-display`, `--nbc-label-transform`, `--nbc-label-spacing`, `--nbc-display-transform`, `--nbc-display-spacing`.

**Color (solid only)** — `--nbc-bg`, `--nbc-fg`, `--nbc-fg-muted`, `--nbc-surface`, `--nbc-surface-alt`, `--nbc-border-color`, `--nbc-primary`, `--nbc-primary-fg`, `--nbc-accent`, `--nbc-accent-fg`, `--nbc-info`, `--nbc-info-fg`, `--nbc-success`, `--nbc-success-fg`, `--nbc-warning`, `--nbc-warning-fg`, `--nbc-danger`, `--nbc-danger-fg`, `--nbc-focus`.

**Fills (backgrounds; may be gradients; default to their solid)** — `--nbc-primary-fill`, `--nbc-danger-fill`, `--nbc-surface-fill`, `--nbc-texture` (`none` by default).

**Shape** — `--nbc-border-width`, `--nbc-border-style`, `--nbc-radius` (containers), `--nbc-radius-control` (fields), `--nbc-radius-button`, `--nbc-radius-small` (badge, checkbox, kbd).

**Elevation / interaction** — `--nbc-shadow`, `--nbc-shadow-lg`, `--nbc-shadow-press`, `--nbc-press` (hover translate), `--nbc-press-active`, `--nbc-rotate`, `--nbc-focus-width`, `--nbc-focus-offset`.

**Motion** — `--nbc-duration`, `--nbc-duration-slow`, `--nbc-ease`.

**Invariant (base only, never per theme)** — `--nbc-space-{xs,sm,md,lg,xl,2xl,3xl}`, `--nbc-fs-{xs,sm,md,lg,xl,2xl,3xl,4xl}`, `--nbc-control-h-{sm,md,lg}` = **32 / 40 / 48 px**.

**Contrast gates** (WCAG 2.2 AA, computed in the test from the hex values, both modes, alpha composited over `--nbc-bg`):
- ≥ 4.5 : `fg/bg`, `fg/surface`, `fg-muted/surface`, `fg-muted/bg`, `primary-fg/primary`, `primary-fg/each stop of primary-fill`, `accent-fg/accent`, `{info,success,warning,danger}-fg/{same}`, `danger/surface` (error text).
- ≥ 3 : `border-color/bg`, `focus/bg` (non-text UI, SC 1.4.11).

### D8 — Geometry is deterministic
- All controls share `--nbc-control-h-*` as `min-height` and `box-sizing: border-box`. A `Button size="md"` and an `Input size="md"` are the same height in every theme.
- Checkbox / Radio / Switch indicator sizes derive from the same scale.
- WCAG 2.2 SC 2.5.8: smallest target (`sm` = 32px) ≥ 24px.

### D9 — Component surface (16 public components)

| Group | Component | Native element | New? |
|---|---|---|---|
| Actions | `Button` | `button` (or child via `asChild`) | refreshed |
| Forms | `Input` | `input` | refreshed |
| | `Textarea` | `textarea` (`field-sizing: content`) | new |
| | `Select` | `select` (progressive `appearance: base-select`) | new |
| | `Checkbox` | `input[type=checkbox]` | new |
| | `RadioGroup` + `Radio` | `fieldset` + `input[type=radio]` | new |
| | `Switch` | `input[type=checkbox][role=switch]` | new |
| Display | `Card` (+ Header/Title/Description/Content/Footer) | `div` / `article` / `section` / `li` | refreshed |
| | `Badge` | `span` | new |
| | `Alert` | `div` | new |
| | `Progress` | `div[role=progressbar]` | new |
| | `Table` (+ Caption/Head/Body/Row/HeaderCell/Cell) | `table` | new |
| | `Kbd` | `kbd` | new |
| Overlays / nav | `Tabs` (+ List/Tab/Panel) | ARIA tabs pattern | new |
| | `Dialog` (+ Header/Title/Description/Content/Footer) | native `dialog` (`showModal`) | new |
| | `Tooltip` | `[popover=manual][role=tooltip]` + CSS anchor positioning | new |

Explicitly **not** in 1.0: Toast, Menu/Popover, Combobox, DatePicker, Avatar, Skeleton, layout primitives, icon package (#10), Storybook (#11; the site covers it).

### D10 — API conventions (one way to do each thing)
- Every component extends its native element's props and spreads `...rest` onto that element. `ref` is a plain prop (React 19) and lands on the native element.
- `className` lands on the **outermost** element. Field components (Input, Textarea, Select, Checkbox, Switch, RadioGroup) put it on the wrapper; their `ref` lands on the native control.
- `size: 'sm' | 'md' | 'lg'` everywhere a size exists (Checkbox/Switch/Radio/Badge/Kbd: `'sm' | 'md'`).
- **Field API (unified):** `label`, `description`, `error` (`ReactNode | boolean`; truthy → `aria-invalid`, message replaces description). Replaces 0.2's `variant="error"` + `errorMessage` + `helperText`.
- Required fields: native `required` → label gets a `*` marker (`aria-hidden`).
- Compound components use static members (`Card.Title`, `Tabs.Tab`, `Dialog.Title`, `Table.Row`).
- `Button asChild` renders its single child element (e.g. `<a>`, a router `Link`) with the button's classes and inner structure. When disabled it sets `aria-disabled` instead of `disabled`.
- Icon-only buttons are automatic: no `children` + exactly one icon → square button (consumer supplies `aria-label`).
- BEM classes `nbc-<block>[__elem][--mod]` are public, stable styling hooks.
- No runtime dependencies.

### D11 — Behaviour built on the platform
- **Dialog**: native `<dialog>` + `showModal()` → focus trap, Esc, top layer, `inert` background for free. Controlled `open` / `onOpenChange`. Backdrop click closes (configurable). Scroll lock via `html:has(.nbc-dialog[open])`. Enter/exit via `@starting-style` + `transition-behavior: allow-discrete`.
- **Tooltip**: `popover="manual"` (top layer, never clipped by `overflow: hidden`) + CSS anchor positioning with `position-try-fallbacks: flip-block`; JS fallback positioning when `anchor-name` is unsupported. Opens on hover (delay) and focus; Esc closes; `aria-describedby`.
- **Tabs**: roving tabindex, ←/→/Home/End, automatic activation.
- **Select**: native everywhere; `@supports (appearance: base-select)` upgrades the picker to a fully themed brutalist list.
- **Textarea**: `field-sizing: content` auto-grow with `rows` as minimum.
- **Card interactive**: stretched-link pattern + `:has(:focus-visible)` ring. No clickable `div`s.

### D12 — Accessibility baseline
- axe on every component test.
- Focus rings use `outline` (survives `forced-colors`). Swiss's inset look = negative `outline-offset`, not `box-shadow`.
- `@media (prefers-reduced-motion: reduce)`: infinite animations off, press translations off, durations → 0.
- `@media (forced-colors: active)`: borders on, shadows off, focus visible.

### D13 — Agent-native docs ("deterministic for agents")
- `src/docs/meta/<Component>.ts` — pure-data metadata per component: summary, when to use / not to use, props (name, type, default, description), accessibility notes, composition rules.
- `src/docs/examples/<Component>/<example>.tsx` — live examples; the site renders them **and** shows their source via `?raw`, so code samples can never drift from what renders.
- **Docs-drift test**: parses each `<Component>Props` interface with the TypeScript compiler API and fails if `meta.props` doesn't list exactly the component's own props.
- `scripts/gen-llms.mjs` (uses Vite's `runnerImport`) → `public/llms.txt`, `public/llms-full.txt`; also copied into the npm package.
- `skills/neobrutalist-ui/SKILL.md` — a Claude Code skill (also readable by any agent) with theme-selection guidance, composition rules and the component cheat-sheet. Shipped in the npm package.

### D14 — The site is the documentation
- Hash router (zero deps). Routes: `/` (home), `/components/:name`, `/themes` (token explorer + live contrast ratios), `/blocks` (real screens: sign-in, pricing, settings, dashboard), `/start` (install, fonts, BYO theme), `/agents` (llms.txt, skill).
- The **entire site** renders inside `NeoProvider` with the selected theme + mode. Theme/mode switch uses the View Transitions API (skipped under reduced motion), persists to `localStorage`, deep-links via `?theme=tech&mode=dark`.

### D15 — Fonts
- The library still never loads fonts by itself.
- New optional convenience: `neobrutalistcomponents/themes/<name>.fonts.css` — a one-line Google Fonts `@import` with exactly that theme's families.

---

## 3. Package shape

```
dist/
  index.js                 ESM bundle (no CSS import)
  index.d.ts (+ per-file .d.ts)
  styles.css               base + all component CSS (layers nbc.base, nbc.components)
  themes/<name>.css        tokens + flourishes (layers nbc.theme, nbc.flourish)
  themes/<name>.fonts.css  optional font loader
  llms.txt, llms-full.txt
skills/neobrutalist-ui/SKILL.md
```

`exports`: `.`, `./styles.css`, `./neobrutalistcomponents.css` (alias kept for 0.2 users), `./themes/*.css`, `./llms.txt`, `./llms-full.txt`, `./package.json`.

Consumer setup:
```tsx
import { NeoProvider, Button } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/classic.css';
import 'neobrutalistcomponents/themes/classic.fonts.css'; // optional

<NeoProvider theme="classic" mode="system">…</NeoProvider>
```

---

## 4. Testing strategy

| Gate | What | Where |
|---|---|---|
| Unit + a11y | RTL + user-event + axe per component | `src/lib/**/*.test.tsx` |
| Token contract | required tokens present, hex-only colors, contrast pairs both modes | `src/lib/themes/contract.test.ts` |
| Docs drift | meta props ≡ TS interface own props; every exported component has meta + ≥1 example | `src/docs/drift.test.ts` |
| Package | `publint`; built `dist/` contains every export target | `npm run check:package` |
| E2E smoke | every route × every theme renders, no console errors, axe clean (color-contrast included) | `e2e/site.spec.ts` (Playwright) |

Pixel-baseline visual regression stays out (font rendering differs macOS ↔ Linux CI); the E2E smoke plus a manual screenshot review across 5 themes × 2 modes covers this pass.

---

## 5. Risks & mitigations
- **Vite 8 lib mode CSS extraction changed** → verify `dist/styles.css` content in the package check.
- **jsdom lacks `HTMLDialogElement.showModal` / popover** → minimal polyfills in `test-setup.ts`, real behaviour covered by Playwright.
- **Anchor positioning not in every browser** → feature-detected JS fallback.
- **`appearance: base-select` Chromium-only** → strictly additive inside `@supports`.
- **Machine has 8 GB RAM** → at most 3 parallel component agents; each runs only its own test folder.

## 6. Out of scope for this pass
Publishing to npm, merging to `main` (would redeploy Pages), closing GitHub issues, Toast/Menu/Combobox, icon package, pixel baselines.
