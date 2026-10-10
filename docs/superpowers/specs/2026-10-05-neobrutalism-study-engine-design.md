# neobrutalistcomponents · The Study — sub-project 1: engine and framework — Design

**Date:** 2026-10-05
**Owner:** Samuel Ballesteros (SDB)
**Author:** Claude, brainstormed with the owner in an interactive session. Every section below was presented and approved one at a time.
**Status:** Draft for owner review. Builds on `2026-10-01-neobrutalistcomponents-v1-2026-refresh-design.md`, which stays authoritative for the library itself.

---

## 1. Intent (in the owner's words)

> "yo quiero que neobrutalistcomponents se convierta en un estudio sobre el neobrutalismo en las interfaces graficas. quiero que exploremos la escena japonesa, y la alemana, asi como la estadounidense, y la latinoamericana, que tengamos cientos de themas si es posible."

Decisions the owner took during brainstorming:

| Question | Owner's answer |
|---|---|
| How do we reach "hundreds" of themes? | **Only anchored themes.** Every theme comes from one documented reference work (a building, a poster, a typeface, a website…) and carries its own study card ("ficha"). The number of themes follows the references, never the other way round. Expect 100–150 across the four scenes; a scene that can't support 25 solid references gets fewer. |
| Language of the study | **Bilingual, Spanish and English**, with a language switch. |
| Images of references | **Free-licensed images plus links.** Wikimedia Commons / public domain where they exist; a link to the source or the Wayback Machine where they don't. |
| How themes are built | **Approach A: themes as data plus shared detail families**, compiled to CSS. (Rejected: hand-written CSS per theme — 50–100k lines to maintain; runtime JS theming — breaks the pure-CSS, zero-runtime principle.) |
| Scope of this first spec | Engine, bilingual study site, fichas for the five existing themes, four proof themes. Approved as proposed. |
| Technical docs | Stay in English in both languages (approved). |

What was *said* vs. what is *assumed* (assumptions were stated to the owner and not corrected):
- Said: the project becomes a study of neobrutalism in GUIs; four scenes (Japan, Germany, USA, Latin America); hundreds of themes if possible.
- Assumed: the library keeps being published on npm. The study wraps it and gives it meaning; it does not replace it.
- Assumed: every study theme is installable and meets the same token contract as the core themes, including WCAG AA in both light and dark.
- Assumed: the audience is designers and developers choosing an aesthetic with judgement; the study is also the owner's authored work.

### 1.1 The honesty constraint

"Neobrutalism" as a UI label is mostly a 2020s Western web phenomenon. It descends from web brutalism (brutalistwebsites.com, 2014) and, further back, from architectural Brutalism. There is no documented "Japanese neobrutalist UI scene" as such, and the study must not invent one. What *is* documented, and what each scene studies, is the lineage of a region that feeds a brutalist interface vocabulary — e.g. Ulm and DIN signage in Germany, Metabolism and dense web portals in Japan, Paulista brutalism, concrete poetry and chicha posters in Latin America, accidental web brutalism and startup neobrutalism in the USA. Every theme is presented as **a reading** of its reference, never as "the official style of X". The rules that enforce this are in D7.

### 1.2 Amended 2026-10-09: a gallery of interfaces

After release 1.1.0 the owner widened the study (#20, #21, #22). The site is now a gallery of the history of interfaces, with neobrutalism at the centre of the collection. Software interfaces (Xerox Star, NeXTSTEP, Windows 95, Aqua, iPhone OS 1), buildings and objects (the Bauhaus building in Dessau, Sottsass's Carlton) and graphic works (Lichtenstein's *Whaam!*) hang beside the neobrutalist themes, in date order, grouped into rooms by region. Italy joins as a fifth room.

What does not change is §1.1. Every theme still reads one documented work. Its ficha still separates sourced fact from reading. No work is presented as a forerunner of neobrutalism unless a source documents the link. D7's brand rule carries its own amendment.

---

## 2. The programme

The full study is five sub-projects. Each gets its own spec → plan → implementation.

1. **Engine and framework** — this spec.
2. **Pilot scene** — research → the owner curates the reference list → ~25 themes → the scene essay. The owner picks which scene.
3. **–5. The other three scenes**, same process.

---

## 3. Decisions

### D1 — Scenes and anchored themes
- Scene ids: `japan`, `germany`, `usa`, `latam`, plus `origins`.
- `origins` hosts the history of Brutalism outside the four scenes — Le Corbusier's *béton brut*, the British "New Brutalism" (Alison and Peter Smithson, Reyner Banham), the International Typographic Style, brutalist websites (2014). It gets an essay and **no new themes**. The existing `classic` and `swiss` themes live there (D13).
- A study theme has exactly one reference work. No reference, no theme.
- Theme ids match `/^[a-z][a-z0-9-]{1,31}$/`, are unique across the whole catalog and must not collide with the five core ids. Ids are romanized from the reference (`nakagin`, `maeusebunker`, `sesc-pompeia`).

### D2 — A theme is a data file
Each study theme is one TypeScript file, `src/study/themes/<scene>/<id>.ts`, default-exporting `defineTheme({...})`. Shape (the plan pins exact types):

```ts
type L10n = { es: string; en: string };
type Hex = `#${string}`;                         // #rgb, #rgba, #rrggbb, #rrggbbaa
type SchemeColor = Hex | readonly [light: Hex, dark: Hex];

defineTheme({
  id: 'nakagin',
  scene: 'japan',                                // not 'origins'
  nativeScheme: 'light',
  name: { es: 'Nakagin', en: 'Nakagin' },
  tagline: { es: '…', en: '…' },
  reference: { … },                              // D7
  ficha: { … },                                  // D7
  fonts: { sans: 'zen-kaku-gothic-new', mono: 'm-plus-1-code' },   // D5, or 'system'
  colors: {
    bg: ['#d9d7d2', '#1b1c1e'],
    fg: ['#16181a', '#eceae6'],
    fgMuted, surface, surfaceAlt, border,
    primary: '#f2efe8', primaryFg: 'auto',
    accent, accentFg, info, infoFg, success, successFg,
    warning, warningFg, danger, dangerFg, focus,
  },
  fills: { primary?, danger?, surface? },        // default: the solid color
  type: { weightBody, weightLabel, weightDisplay, labelTransform?, labelSpacing?, displayTransform?, displaySpacing? },
  shape: { borderWidth: 2, borderStyle?: 'solid', radius: 0, radiusControl: 0, radiusButton: 999, radiusSmall: 0 },
  elevation: hardShadow(4),                      // helpers: hardShadow, doubleStack, flat
  focus?: { width, offset },
  motion?: { duration, durationSlow, ease },
  families: [concrete({ grain: 0.06 }), grid({ cell: 24 })],        // D3
  signature: './nakagin.css',                    // D4, optional
});
```

Rules:
- Every color token is written explicitly, as `#hex` or `[light, dark]`. The compiler emits `light-dark(a, b)` when the two differ.
- Any `*Fg` color may be `'auto'`. Per scheme, the compiler picks whichever of the theme's two text inks (`fg` in light and `fg` in dark) has the higher contrast against the color it sits on, checking every stop of a fill. If the best ink is below 4.5:1, compilation fails and names the token and the ratio.
- Optional groups (`type` transforms and spacing, `focus`, `motion`) default to the documented engine defaults, which equal the neutral defaults in `src/lib/tokens.css`. **The compiled CSS always declares every token in `REQUIRED_TOKENS`.** The core principle "no hidden defaults in the output" holds; only the data file is lean.
- `--nbc-scheme` comes from `nativeScheme`.
- Compilation is a pure function: the same data always produces byte-identical CSS.

### D3 — Detail families
- A family is a folder `src/study/families/<name>/` containing:
  - `family.css` — the rules;
  - `family.ts` — a typed helper (`concrete({ grain })`), the parameter schema (type, default, bilingual description), the list of components it touches, and an optional `texture()` function that contributes layers to `--nbc-texture`.
- Parameter types: `length`, `number`, `angle`, `enum`, and `token` (the name of a color token). **Family parameters never take literal colors.** Every color a family uses comes from the theme's tokens, so the contract already covers it.
- The compiler writes parameters as `--fx-<family>-<param>` on the theme root and inlines `family.css` inside the theme's donut scope, exactly like the core flourishes: `@layer nbc.flourish { @scope ([data-theme="<id>"]) to ([data-theme]:not([data-theme="<id>"])) { … } }`. Keyframes stay outside the scope and are renamed `nbc-<id>-<family>-<name>`.
- A lint (unit test) runs over every `family.css` and signature file:
  - **No literal colors** — no hex, `rgb()`, `hsl()`, `oklch()` or named colors other than `transparent`, `currentColor` and `inherit`. Colors come from `var(--nbc-*)`, `var(--fx-*)` or `color-mix()` of those.
  - **No geometry changes on real elements** — `height`, `min-height`, `max-height`, `block-size` (and its min/max), every `padding` property, `font-size` and `line-height` are forbidden outside `::before` / `::after` rules. The 32 / 40 / 48 px control heights stay invariant in every theme.
- **What is painted behind text keeps AA.** A family that textures a surface does it through `--nbc-texture` built by its `texture()` function, as gradients whose stops are hex with alpha (no data URIs in study themes). When several families contribute, their layers are joined in the order the families are listed. A study theme cannot set `--nbc-texture` directly; it defaults to `none`. The contract test composites every texture stop over each ground and requires the contract's text pairs for that ground to stay ≥ 4.5:1, in both schemes: `--nbc-surface-fill` (fg, fg-muted), `--nbc-surface-alt` (fg), `--nbc-bg` (fg, fg-muted). (Core themes keep their current tests; riso's SVG noise is not resolvable and is out of this rule.)
- Families arrive with the themes that need them. This sub-project ships only **`concrete`** (board-formwork stripes and speckle, gradients only) and **`grid`** (a modular grid on the page and on surfaces), plus the elevation helpers `hardShadow`, `doubleStack` and `flat`. The long-term set is expected to reach 20–30 families as scenes land.

### D4 — Signature CSS
- A theme may add one CSS file for a trait no family can express (Pompéia's irregular red windows, for instance).
- At most **60 non-blank, non-comment lines**, checked by a test.
- Same lint as families, same scoping by the compiler.

### D5 — Fonts
- A registry, `src/study/fonts.ts`, lists the families study themes may use. Each entry: key, CSS family name, Google Fonts axis spec, fallback stack, license (`OFL-1.1` or `Apache-2.0`), and the scripts it covers (`latin`, `japanese`, …).
- Themes name fonts by key, so a typo fails compilation.
- At most three families per theme (`sans`, `display`, `mono`), or `'system'` for system fonts only.
- Every theme ships `<id>.fonts.css`. It holds the Google Fonts `@import`, or only a comment for `'system'` themes, so the import path is always valid.
- Japanese families work because Google Fonts serves them split by `unicode-range`; only the slices a page uses are downloaded.

### D6 — Compiler and outputs
- `scripts/build-study.mjs` loads theme files with Vite's `runnerImport`, as `scripts/gen-llms.mjs` already does.
- Library outputs (`npm run build:lib`):
  - `dist/themes/<id>.css` and `dist/themes/<id>.fonts.css`. Both are covered by the existing `./themes/*` export; that export does not change.
  - A new subpath export **`neobrutalistcomponents/study`**: a data-only catalog for theme pickers, and the `StudyThemeId` type. Each entry carries id, scene, native scheme, bilingual name and tagline, reference metadata (bilingual title, original name, authors, date, bilingual place, kind), four swatch colors, font names, the atlas facets (D10) and `predatesStudy`. The five core themes are in it too.
  - The catalog is generated as a TypeScript module and built as a second library entry. Long ficha prose is **not** in the npm package.
- Site and tests: the same script writes the theme CSS and the catalog into `src/study/.generated/` (git-ignored). It runs before `dev`, `test`, `typecheck`, `build:lib`, `build:site` and `e2e`. Nothing generated is committed.
- Budget: each `dist/themes/<id>.css` ≤ **12 KB as shipped** (theme files are not minified, like the core ones — so the budget is stricter than a minified one), checked by `check:package`, which also extends its existing guard (no `lightningcss-` output, `light-dark(` present) to every theme file. At ~150 themes the package grows by roughly 1–1.5 MB unpacked; an app only ever imports the themes it uses.
- The five core themes are untouched: still hand-written in `src/lib/themes/`, still shipped as `dist/themes/<name>.css` next to `styles.css` (the core stylesheet carries no theme). Study themes follow exactly the same import pattern: `styles.css` plus one theme file.

### D7 — The ficha
**Amended 2026-10-09 (lettering and motion).** A ficha may carry a `lettering` block (required of new themes) and a `motion` block (only where a source documents the work's movement). Both follow the marker rules below. See `2026-10-09-lettering-and-motion-design.md`.

Lives in the theme file, in two parts.

`reference`:
- `title: L10n`, and `original?: { text, lang }` — the name in its own language and script, with a BCP 47 tag (`{ text: '中銀カプセルタワー', lang: 'ja' }`).
- `authors: string[]` — empty means anonymous or vernacular; the page then says so and describes the practice.
- `date: number | [from, to]`, `place: L10n`.
- `kind`: `architecture | graphic | type | web | software | signage | object`.
- `sources: Source[]` — each `{ title, url (https), publisher?, year?, accessed (YYYY-MM-DD) }`.
- `image?: ImageCredit` (D8) and `archiveUrl?` (a `web.archive.org` link, mainly for web references).

`ficha`:
- `documented: L10n` — two to four sentences of fact. Every claim carries a source marker `[n]` pointing into `sources`.
- `reading: L10n` — two to four sentences of interpretation: what the theme takes from the reference (palette, type, edges, shadows, families) and why. Shown under a heading that says it is a reading.
- `palette: { origin: 'documented' | 'sampled' | 'interpreted', note: L10n }` — documented (e.g. 1990s browser link colors), sampled from a named photo, or interpreted.

Rigor rules (tests enforce the mechanical ones):
- At least **two sources**, at least one **not on wikipedia.org** (a museum, archive, institution, book, journal or the author's foundation).
- Every `[n]` resolves to a source, every source is cited at least once, and the set of markers is identical in Spanish and English.
- Fichas never quote verbatim; they paraphrase. Essays may quote, only with a locatable source.
- An influence between works is stated only when a source documents it. Otherwise it goes in `reading`, phrased as a kinship we see.
- A live commercial brand never names a theme ("Classifieds", not "Craigslist"). Brands may be cited in the ficha as facts.
  - Amended 2026-10-09 (owner's decision, release 1.2.0): a product from the history of software may name its theme when the product itself is the reference work (Windows 95, Windows XP, Mac OS X's Aqua, iPhone OS 1, Material Design). A live service or store still does not ("Classifieds").
- The five core themes carry `predatesStudy: true`. Their page says the theme predates the study and names its closest reference.

### D8 — Images
- `scripts/fetch-image.mjs <commons file URL> <id>`: reads author, license and title from the Wikimedia Commons API (`extmetadata`) instead of having them typed by hand, downloads the original, converts it to AVIF at most 1600 px wide (target ≤ 250 KB) into `src/study/images/`, and prints the `ImageCredit` to paste into the theme file.
- `ImageCredit`: `{ file, width, height, alt: L10n, author, license, sourceUrl }`.
- License whitelist: `CC0-1.0`, `PD`, `CC-BY-{1.0,2.0,2.5,3.0,4.0}`, `CC-BY-SA-{1.0,2.0,2.5,3.0,4.0}`. NC, ND and fair use are rejected by a test.
- Every image shows its credit beneath it: author, license with a link, "via Wikimedia Commons". A Credits page lists them all.
- Images live only in the site, never in the npm package, which stays MIT-only. A `NOTICE` in `src/study/images/` states that each image keeps its original license.
- No free image → the ficha links the source or the Wayback Machine and shows the theme's palette instead. Never a stand-in image.

### D9 — Bilingual content
- Every user-facing study string is an `L10n` pair. A test rejects empty strings in either language.
- Long essays are Markdown: `src/study/essays/<slug>/es.md` and `en.md`, sharing `sources.ts`. A Vite plugin renders them to HTML at build time with a site-only Markdown dependency (never in the library). Raw HTML inside essays is not allowed.
- A test checks that both languages exist for every essay and that their `[n]` markers match the shared sources.
- Essays in this sub-project: study home (the thesis), Origins, Method. Each scene gets a **short but real introduction** — two paragraphs with sources, no placeholder text. The full scene essay arrives with its scene's sub-project.
- Site chrome strings come from a small `{ es, en }` dictionary (`src/site/i18n.ts`); no i18n library.

### D10 — Site structure
Routes carry the language: `#/es/…` and `#/en/…`.
- First visit: the browser language (`es*` → `es`, anything else → `en`). After that the choice is remembered with the other site preferences.
- Old routes redirect: `#/` → `#/<lang>/`, `#/components[/<slug>]`, `#/blocks`, `#/start`, `#/agents` → the same path under `#/<lang>/`, and `#/themes` → `#/<lang>/atlas`. Links in `llms.txt`, the README and the skill keep working; the generated files switch to the new `#/en/…` URLs.
- `<html lang>` follows the language. Original-language names render with their own `lang` attribute (`ja`, `pt`, `de`).
- Technical docs (components, props, Start, Agents, Blocks) stay in English in both languages, with a short notice in the Spanish version.

Pages:

| Page | Route | Content |
|---|---|---|
| Study (home) | `#/<lang>/` | The thesis: what neobrutalism is in interfaces and where it comes from; the four scenes and Origins; a way into the atlas; a short "use these themes in your app" block. |
| Scene | `#/<lang>/scene/<scene>` | The introduction (full essay later), a timeline of its references by date, and its themes. |
| Theme | `#/<lang>/theme/<id>` | The whole main area renders inside the theme. Reference with image and credit, "documented", "reading", palette origin; a component specimen in light and dark side by side; the token table (inherits the current Themes page explorer); install snippet; "use across the site"; previous / next within the scene, ordered by reference start year, then id. |
| Atlas | `#/<lang>/atlas` | Every theme as a card. Facets: scene; decade (from the reference's start year); reference kind; native scheme; border (from `borderWidth`: hairline ≤ 1 px, standard 2–3 px, heavy ≥ 4 px); shadow (from the elevation helper: `flat` → none, `hardShadow` → hard, `doubleStack` → double; `soft` is reserved for blurred shadows); corners (from `radiusButton`: 0 → square, 1–15 px → soft, ≥ 16 px → round). Core themes get their facet values in `core-fichas.ts`. Search across names, reference titles, original names, authors and places in both languages. Facets and query live in the URL. |
| Origins | `#/<lang>/origins` | Essay, plus `classic` and `swiss`. |
| Method | `#/<lang>/method` | How a theme is made from a reference, the token contract, the rigor rules, and the families list generated from their metadata. |
| Credits | `#/<lang>/credits` | Every image and every font with its license, generated from data. |
| The library | `#/<lang>/library` | Today's home content: the specimen, "Built on the platform", agents. Links to Components, Blocks, Start and Agents, which stay as they are. |

- Top bar: Study, Scenes, Atlas, Library, Components, plus language, theme and mode controls. On phones it stays non-sticky (1.0.1 fix).
- The current Themes page is replaced by the atlas and the theme pages.
- The site theme switcher shows the five core themes, the study theme in use (if any) and a link to the atlas. `?theme=<id>` accepts any catalog id; an unknown id falls back to `classic`.
- `NeoProvider`'s `mode` must flip a study theme exactly like a core theme.

### D11 — Performance with ~150 themes
- A study theme's CSS is fetched only when needed — on its page, or when chosen for the whole site — by inserting a `<link>`. It never enters the main CSS bundle. The themed area is revealed once the stylesheet has loaded (a short neutral loading state before), so it never flashes unstyled.
- Atlas cards are painted from catalog data: colors, border, shadow and radius applied as inline custom properties. No theme stylesheet loads for the atlas. A card's font loads when the card nears the viewport.
- The catalog loads eagerly. Each theme's full data (ficha prose, tokens) is a separate lazy chunk.
- Essays are pre-rendered HTML; no Markdown renderer ships to the browser.
- Images are lazy-loaded with explicit dimensions (no layout shift).
- Every page works at 360 px wide.

### D12 — Agents
`llms.txt`, `llms-full.txt` and `skills/neobrutalist-ui/SKILL.md` gain the study catalog — reference, scene, native scheme and import paths — so an agent can pick a theme by its reference. Same generator, same drift check in CI.

### D13 — Proof themes and core fichas

Four proof themes, one per scene, each chosen to stress a different part of the engine:

| Scene | Theme id | Reference | What it stresses |
|---|---|---|---|
| Japan | `nakagin` | Nakagin Capsule Tower (中銀カプセルタワー), Kisho Kurokawa, Tokyo, 1972 | Japanese fonts (heavy, served in slices); the capsules' round windows as geometry; `grid` |
| Germany | `maeusebunker` | Mäusebunker (former Central Animal Laboratories of the FU Berlin), Gerd Hänska, Magdalena Hänska and Kurt Schmersow, Berlin, 1971–81 | `concrete` as a family shared across scenes; the blue ventilation shafts as accent |
| Latin America | `sesc-pompeia` | SESC Pompéia, Lina Bo Bardi, São Paulo, 1977–86 | Signature CSS: the irregular red-framed windows fit no family |
| USA | `classifieds` | Craigslist, San Francisco, from 1995 — the theme is named "Classifieds" / "Clasificados" (D7: no live brand names a theme) | Flat brutalism: system fonts, no shadows, nothing to download; a ficha with no image, linking the Wayback Machine |

Facts above were spot-checked during brainstorming; the ficha work re-verifies them against cited sources. Known discrepancy to resolve: the Risograph's introduction is dated 1980 by some sources and 1986 (RISOGRAPH 007) by others.

Fichas for the five core themes (proposed; the owner confirms on review):

| Theme | Scene | Closest reference |
|---|---|---|
| `classic` | origins | *Béton brut* — Le Corbusier, Unité d'habitation, Marseille, 1952 |
| `swiss` | origins | *Neue Grafik* (1958–65), the International Typographic Style's journal |
| `tech` | usa | DEC VT100 terminal, 1978 |
| `riso` | japan | Riso Kagaku's Risograph |
| `y2k` | japan | The holofoil cards of the Pokémon Trading Card Game, Japan, 1996 (the theme's own tagline is "holographic trading-card energy"). The ficha says plainly it is the least brutalist of the five, kept for continuity |

### D14 — Release
- Version **1.1.0**: new `./study` export and new theme files; no breaking change. `CHANGELOG.md` entry and a README section.
- Work happens on branch `study/engine` with a PR and green CI. Merging and pushing the tag that publishes to npm happen only on the owner's word. The site deploys from `main` as today.
- Roles: Claude researches with sources, writes fichas, scene introductions and the Origins and Method essays, and designs the four proof themes. The owner reviews the content on the PR; any claim that isn't well supported is fixed or removed.

---

## 4. Package shape (additions)

```
src/study/
  themes/<scene>/<id>.ts          one file per study theme (+ optional <id>.css signature)
  families/<name>/family.{css,ts} detail families
  fonts.ts                        font registry
  core-fichas.ts                  fichas for the five core themes
  essays/<slug>/{es,en}.md, sources.ts
  images/                         AVIF images + NOTICE (site only)
  define.ts                       defineTheme, helpers, types
  compile.ts                      data → CSS (pure)
  .generated/                     git-ignored: theme CSS + catalog module
scripts/
  build-study.mjs                 compiler driver (runnerImport)
  fetch-image.mjs                 Commons → AVIF + ImageCredit
dist/
  themes/<id>.css, <id>.fonts.css (study themes, alongside core ones)
  study.js, study.d.ts            catalog + StudyThemeId   → export "./study"
```

---

## 5. Testing strategy

Unit (Vitest):
- **Contract on data**: every required token present after compilation; colors in contract format; all `CONTRAST_PAIRS` in light and dark; `auto` resolution; native scheme; texture-over-surface check (D3).
- **Compiler**: parsing the compiled CSS with `parseThemeTokens` gives back exactly the resolved data; compiling twice is byte-identical; no rule escapes the donut scope; ≤ 12 KB.
- **Families and signatures**: parameter schemas; the lint (no literal colors, no geometry); signature ≤ 60 lines.
- **Fonts**: every key exists; licenses in the whitelist; ≤ 3 families.
- **Fichas and essays**: no empty strings in either language; ≥ 2 sources, ≥ 1 not on wikipedia.org; https URLs; ISO access dates; `[n]` markers resolve, cover every source, and match across languages; image license whitelist, complete credit, file exists and within budget; unique ids; `original.lang` present.
- **Site**: dictionary complete in both languages; old routes redirect; initial language detection.

Browser (Playwright + axe):
- axe on every theme page, in its native scheme and the opposite one, alternating language between themes so both are covered. Nine themes in this sub-project; sharded across CI machines once the count grows.
- Main pages in both languages, at desktop width and at 360 px.
- Behaviour: atlas facets and search are reflected in the URL; searching "中銀" finds Nakagin; a study theme's CSS is requested only on its page; "use across the site" applies the theme and survives a reload; `mode` flips a study theme.
- The 1.0.1 production-CSS regression check extends to study themes (minified output keeps `light-dark()` and token colors).

Visual review: contact sheets of each new theme — light and dark, desktop and mobile — via `scripts/screenshots.mjs`, reviewed by Claude before they reach the owner.

---

## 6. Risks and mitigations

| Risk | Mitigation |
|---|---|
| A factual error in a ficha or essay | ≥ 2 sources with one non-Wikipedia; paraphrase only in fichas; owner review on the PR; unsupported claims removed. |
| No free image for a reference | The no-image path is first-class (link + palette); `classifieds` exercises it. |
| Families make themes look alike | Signature CSS as an escape hatch; visual review; a near-duplicate detector is planned for the scene sub-projects. |
| Japanese fonts slow the theme page | `unicode-range` slices from Google Fonts; fonts load only on the theme page or near-viewport atlas cards. |
| Package growth | Per-theme files, 12 KB budget, prose kept out of the package. |
| e2e time at ~150 themes | One page per theme × two schemes, CI sharding. |
| The study overclaims a "scene" | §1.1 framing; influence only with sources; themes are always "a reading". |

---

## 7. Out of scope for this sub-project
- The full scene essays and the ~25 themes per scene (sub-projects 2–5).
- Translating the technical documentation.
- Replacing hash routes with path routes (SEO).
- Migrating the five core themes into the engine.
- A near-duplicate theme detector.

---

## 8. Implementation notes (decisions taken while building)

Plan 1 of 2 (`docs/superpowers/plans/2026-10-05-neobrutalism-study-engine.md`), built 2026-10-05.

- **System fonts are spelled `'system-sans'` or `'system-serif'`** (D5 said `'system'`): `classifieds` needs the serif stack of 1990s browsers (Times, Courier), so "system" alone was ambiguous.
- **Families expose `texture()`, not `fills()`** (D3): fills were never needed; the only thing a family paints behind text is `--nbc-texture`. `concrete` also pours the texture behind the theme root (`:scope`) and card footers, `grid` into card footers — the places core CSS leaves untextured.
- **The texture check applies every `CONTRAST_PAIRS` pair whose ground the texture covers** (surface fill, surface, surface-alt, page), error text and the 3:1 border and focus pairs included. A first draft hand-listed fg/fg-muted per ground; the final review showed it skipped error text, which sat at 4.49:1 on `maeusebunker`'s dark speckle — its dark danger went from `#f07a6a` to `#f58a7c` (5.13:1).
- **The 12 KB budget is measured on the shipped file.** Study theme files are not minified, like the core ones; the four proof themes ship at 2.4–3.4 KB.
- **The flourish lint is stricter than the core themes' own CSS**: no padding anywhere outside `::before`/`::after` (riso's card titles use `padding-inline`; study families may not).
- **`CoreFicha` carries a bilingual `tagline`** whose `en` must equal `THEME_INFO[id].tagline`; the catalog needs Spanish taglines for the core themes too.
- **Core facets** (set by hand in `core-fichas.ts`): classic standard/double/square, tech hairline/hard/soft, swiss hairline/none/square, y2k standard/double/round, riso standard/double/soft.
- **Catalog order**: core themes first, then study themes by file path (germany, japan, latam, usa).
- **Images**: every `fetch:image` output matched the values written in the plan (read from the Commons API beforehand). The plan's smoke-test file (an Unité d'habitation photo) is no longer on Commons — the script stopped with "no image info", as it should — so the smoke test used the VT100 photo.
- **`maeusebunker`**: primary is the pipes' light blue (`#8cc3ea`) with a dark ink in both schemes; focus stays dark blue in the light scheme because light blue on light concrete fails the 3:1 focus pair. The tagline avoids the battleship image the project site rejects.
- **`classifieds`** sets its inks explicitly (white on link blue, black on the dark scheme's light blue) instead of `'auto'`, to keep the documented look.
- **Open design question for curation**: in `sesc-pompeia`, primary (Lina's red) and danger are both red and differ only in value (`#b81d17` vs `#8f1d14`; dark `#ff6a5c` vs `#ff9a8c`). Contrast passes, but a destructive button reads close to a primary one.
- **Package**: `npm pack` lists 72 files, 104.9 kB packed, 433.7 kB unpacked; no `src/study` path (no images, no fichas).
- **Hardening from the final review** (each with a test that failed first):
  - Family and signature CSS may declare only `--fx-*` custom properties (no redeclared tokens, no component sizing vars like `--_h`); `var()` fallbacks are scanned for colours; `@keyframes` frames are linted; `url()`, `image-set()` and other image functions are rejected; `zoom`, `box-sizing` and `all` count as geometry; quoted strings are not read as colours.
  - Keyframes are renamed only in their prelude (quoted names too) and in `animation` / `animation-name` values, never in properties or functions of the same name.
  - `themeProblems` checks every number and string the compiler writes (ranges, spacing and easing syntax, single-value shadows and fills), and the contract fails any stylesheet that does not parse back to exactly its tokens — for every real theme.
  - Fills may not contain named colours, colour functions or images, so every stop stays checkable.
  - The registry globs `themes/**` and reports stray files, modules without a default export and undeclared stylesheets; it orders by code unit, not by locale.
  - Family and parameter names are checked as own keys (`Object.hasOwn`), and a family listed twice is an error.
  - Ficha wording: `maeusebunker` (only titles use the condensed face), `tech` (the VT100 also blinked; the manual chapter is now cited), and possible quotes from Lars Müller, MoMA, Wired and Dialectic paraphrased. A regression test retires the flagged phrases.
- **`dist/study.js` is written by `build-study.mjs`** rather than built as a second library entry (D6): same ESM module and declarations for consumers, one fewer build step.


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
