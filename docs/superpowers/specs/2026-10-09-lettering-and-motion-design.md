# neobrutalistcomponents · The Study — lettering, motion and a wider museum — Design

**Date:** 2026-10-09
**Owner:** Samuel Ballesteros (SDB)
**Author:** Claude, brainstormed with the owner in an interactive session. Every section below was presented and approved one at a time.
**Status:** Draft for owner review. Builds on `2026-10-05-neobrutalism-study-engine-design.md` (§1.1 honesty constraint, D5 fonts, D7 ficha) and its §1.2 amendment (the study is a gallery of the history of interfaces).

---

## 1. Intent (in the owner's words)

> "ahora sí que vamos a ampliar este museo pues, métele con furia, es importante también que se tome con mucha seriedad el lettering, pues es la parte más importante de las interfaces gráficas aunque no lo parezca, hay que evaluar también animaciones, las animaciones del tema tienen que corresponder con las animaciones de la interface a la que se le rinde homenaje"

Decisions the owner took:

| Question | Owner's answer |
|---|---|
| Original faces are rarely free (Chicago, Geneva, MS Sans Serif, Lucida Grande) | **Free substitute plus an honest ficha.** The theme uses the closest free face (Google Fonts, OFL or Apache); the ficha documents the original and why the substitute resembles it. No redrawn wordmarks, no hosted commercial fonts. |
| How animation is modelled | **Own CSS plus ficha plus lint.** Each theme writes its keyframes; the ficha documents the movement with sources; the lint enforces the rules. No preset library. |
| New works | **All four proposed batches** (USA, Japan, Latin America, Italy and Germany). |

Assumed and stated (not corrected): the first rule of motion is *if the work did not move, the theme does not move*. A motion claim needs a source that documents the movement.

## 2. Scope and phases

One spec, three phases, one PR each.

1. **Engine.** Types, validator, lint, registry, site sections, generated outputs. The 16 current themes get a provisional `lettering` so they compile. No visual change.
2. **Retrofit of the 16 current themes.** Real lettering for each; real animation where the work moved. Done per room, one subagent per theme.
3. **New works, 13**, built to the new bar from the start.

Out of scope: the five core themes (they predate the study; their fichas stay), hosting any non-free font, redrawn wordmarks, a preset animation library, changes to component geometry.

## 3. Lettering

### 3.1 Data

`Ficha` gains a required block:

```ts
lettering: {
  original: { name: string; designer?: string; year?: number; kind: 'bitmap' | 'outline' | 'lettered' | 'system' };
  documented: L10n;   // what the work set its text in; every claim carries [n]
  substitute: L10n;   // which free face stands in, and why it resembles the original
}
```

`kind`: `bitmap` (Chicago, Atari GEM), `outline` (Univers, DIN), `lettered` (hand-drawn posters: OSPAAAL, lotería), `system` (works with no face of their own, such as Craigslist).

*Amended during phase 2:* `none` joins the kinds, for works on which no source we consulted documents lettering (buildings, objects). It has no name and no `documented`; the page says so in those words. §4.2 gains a loop limit: only loading indicators may loop forever (WCAG 2.2.2). The theme page shows a motion specimen (a button with a tooltip, a dialog, a switch, an indeterminate progress bar) under «Movimiento».

`StudyType` gains optional `featureSettings` (`tnum`, `smcp`, `ss01`…), `kerning` (`normal` | `none`; bitmaps do not kern) and `textRendering`. Control geometry (`font-size`, `line-height`) stays invariant.

### 3.2 Registry (D5)

New free families are added to `FONTS` as each theme needs them (bitmap and pixel faces, grotesques standing in for Franklin, Helvetica and Univers, a DIN-like face for signage, Japanese pixel faces). Each entry keeps the existing rules: OFL-1.1 or Apache-2.0, a checked `css2` URL that answers 200, its script coverage.

### 3.3 Validation

- A theme without `lettering` does not compile.
- `lettering.documented` joins `documented` and `reading` in the marker check: markers resolve into `reference.sources`, es and en markers match, every source is cited somewhere in the ficha.
- `substitute` must name a face different from `original.name`.
- The fonts the theme declares must appear in `substitute` (the ficha names what the theme actually loads).

### 3.4 Site

The work's page gains a «Tipografía» / «Typography» section beside «Documentado» and «Lectura»: the original (name, designer, year), what was documented, and the substitute with its reason.

## 4. Motion

### 4.1 Data

`Ficha` gains an optional block:

```ts
motion?: { documented: L10n; reading: L10n }   // with [n], validated like the rest
```

- Present when the reference animated and a source documents it (System 7's zoom rects, Windows 95's hourglass, Aqua's Genie, Dragon Quest's blinking cursor).
- Absent for static works (Whaam!, the Bauhaus building, posters). Their `motion` tokens use 0 ms: a poster does not ease.

### 4.2 Code

An animated theme gets `<id>.motion.css`, separate from the signature, so the signature's 60-line cap is untouched. The lint holds it to:

- at most 40 lines;
- animated properties limited to `transform`, `opacity`, `clip-path`, `background-position`, `outline`;
- every `@keyframes` and every `animation` inside `@media (prefers-reduced-motion: no-preference)`;
- colours only from tokens, as everywhere else;
- timing and `steps()` taken from the work, not from a house default.

Coupling: CSS animates ⇔ `ficha.motion` exists. Either without the other fails.

Triggers hook onto the library's component classes (`.nbc-dialog[open]`, `.nbc-button:active`, `.nbc-progress`, `.nbc-tooltip`). The compiler already namespaces keyframes per theme.

## 5. Works

### 5.1 Retrofit (phase 2)

maeusebunker, nakagin, sesc-pompeia, classifieds, win95, bauhaus-dessau, whaam, carlton, xerox-star, mac-os-classic, nextstep, amiga-os, win-xp, aqua, iphone-os, material-design. Each gets lettering and, where sourced, motion.

### 5.2 New (phase 3)

| Room | Works |
|---|---|
| USA | Windows 3.1, BeOS, Atari GEM, Palm OS |
| Japan | Dragon Quest (command menu, 1986), PlayStation (BIOS, 1994), and a third title proposed with sources during the phase |
| Latin America | Mexican lotería, OSPAAAL poster (Cuba), Caracas Metro signage |
| Italy and Germany | Olivetti Lettera 22, DIN 1451, Munich 1972 pictograms (Aicher) |

Rulings: Deutsche Bahn was dropped from the proposal (a live service may not name a theme, D7 brand rule); «Famicom» is hardware, not a work, so Japan's third title is a specific game.

### 5.3 Rules that do not change

§1.1 holds: one documented work per theme, the ficha separates fact from reading. D7 holds: ≥2 sources, one not Wikipedia, paraphrase. Every URL is checked to answer 200 before it is accepted. No source is invented (the lesson of the Gemini drafts).

## 6. Testing

- Unit: validator (lettering, motion coupling), lint (`.motion.css` rules), registry.
- Compiled CSS: each animated theme's animations all sit inside `no-preference`.
- e2e: with `reduced-motion: reduce`, no animation runs; axe and contrast on every new theme, as now.
- `npm run check` and the e2e suite before every PR.

## 7. Release and risks

- Release **1.3.0** at the end (new `./study` surface, nothing breaking). No publish without the owner's word.
- **Weight.** Each new face adds a download. Mitigation: themes already load lazily near the viewport; each loads only its own families.
- **Overclaiming motion.** Mitigation: the coupling rule and the source requirement.
- **Trademarks.** Software products may name their theme when they are the reference work; live services may not.
