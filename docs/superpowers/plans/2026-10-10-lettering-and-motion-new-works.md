# Lettering and Motion: Phase 3 (thirteen new works) and release 1.3.0 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thirteen new study themes, each reading one documented work, built to the phase-2 bar from the start (sourced lettering, motion only where documented), then release 1.3.0.

**Architecture:** Four room batches, one branch and one PR each (Japan, Latin America, Italy and Germany, USA), then a release task. Every theme is built by one protocol (N1–N11): a Sonnet research dossier that now also covers the reference, the documented facts, the palette and a free image; mechanical verification with `check-links`; the controller writes the theme file from a fixed template, picks faces against the originals, and checks contrast, image, screenshots and motion. Each batch ends with a fresh Opus review, the gates and CI. No engine change is planned; any the work needs gets its own TDD task and a ledgered ruling.

**Tech Stack:** TypeScript theme data, Vitest, Playwright + axe, `scripts/check-links.mjs`, `scripts/fetch-image.mjs` (Wikimedia Commons → AVIF), Google Fonts (OFL-1.1 / Apache-2.0).

**Spec:** `docs/superpowers/specs/2026-10-09-lettering-and-motion-design.md` §5.2 and §7, resting on `2026-10-05-neobrutalism-study-engine-design.md` §1.1, D7 and D8. The phase-2 plan (`2026-10-09-lettering-and-motion-retrofit.md`) holds the protocol this one extends.

## Global Constraints

- §1.1: one documented work per theme; the ficha separates sourced fact from reading.
- D7: ≥2 sources, at least one not on wikipedia.org; fichas paraphrase, never quote; a fact with only Wikipedia behind it is not established (R2).
- D7 brand rule: "a product from the history of software may name its theme when the product itself is the reference work … A live service or store still does not."
- D8: images only from Wikimedia Commons through `npm run fetch:image`, licences `CC0-1.0`, `PD`, `CC-BY-*`, `CC-BY-SA-*`; at most 1600 px and 250 000 bytes; no free image → no image, never a stand-in.
- Every theme has `ficha.lettering`; `documented` and `motion.documented` cite at least one source with the same markers in es and en.
- No `ficha.motion` ⇒ `motion: { duration: 0, durationSlow: 0, ease: 'linear' }` (enforced). A motion file follows the lint (40 lines, five properties, guard, top-level keyframes, only loaders loop) and animates something the motion specimen shows; a timing no verifiable source gives is said to be the theme's.
- Signatures (≤60 lines) carry no animation or transition.
- Faces: Google Fonts, OFL-1.1 or Apache-2.0, only the weights used; no synthetic bold (a single-weight face gets weights of 400 wherever it is used); `fonts.sans` may be a pixel face for a bitmap interface after a 16 px legibility check (phase-2 ruling).
- Colours pass the token contract and axe in both schemes (`study.test.ts`, e2e).
- The theme's id goes into `PROOF_THEMES` in `src/study/study.test.ts`.
- Site strings in Venezuelan Spanish (tú, never vos); ficha prose impersonal.
- Research on Sonnet subagents, batch review on Opus.
- Merge each batch when CI is green and the review has no Critical left (owner's standing authorization for phase 2; confirm it holds for phase 3). Release 1.3.0 is published only on the owner's word.
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

## Open question for the owner (before Task 7)

The Caracas Metro is a live public service, and D7 forbids a live service from naming a theme. Options: (a) a descriptive name without the brand, e.g. «Señalética de Caracas» / "Caracas signage"; (b) amend D7 for public, non-commercial services. The plan assumes (a) until the owner says otherwise.

## Review Focus

1. A theme named after a live service or store (D7). Pinned by N6 (name check) and the batch reviewer.
2. A new palette that passes in one scheme and fails in the other, or fails axe on the theme page. Pinned by `study.test.ts` (contract, both schemes) and the 360 px e2e over every study page.
3. An image credited by hand or under a licence outside D8. Pinned by N8 (`fetch:image` only) and `validate.ts`'s licence check.
4. A face that covers Japanese but not Spanish accents, or the reverse, falling back mid-word. Pinned by N4 (subsets) and N10 (screenshots of the ES page).
5. Motion that the specimen never shows, or that loops. Pinned by the motion e2e (computed styles, both modes) and the lint.

---

## File structure

| File | Responsibility |
|---|---|
| `src/study/themes/<scene>/<id>.ts` | each new theme (template below) |
| `src/study/themes/<scene>/<id>.css`, `<id>.motion.css` | optional signature; motion file when the work moved |
| `src/study/images/<id>.avif` | image from `fetch:image`, when a free one exists |
| `src/study/fonts.ts` | faces the new themes need |
| `src/study/study.test.ts` | `PROOF_THEMES` gains each id |
| `public/llms-full.txt` | regenerated; committed when its content changes |
| `package.json`, `CHANGELOG.md` | Task 19 (release) |

## The new-work protocol (N1–N11)

**N1. Dossier.** Dispatch one research subagent (Agent tool, `subagent_type: general-purpose`, `model: sonnet`, in the background; batches run in parallel) with this prompt, filled in. It writes `.superpowers/retrofit/<id>.dossier.json`.

```
You are researching one work for a design museum's study theme. Facts only, from pages you actually opened. Never invent a URL or a quote: a quote you did not read on the page is a failure, and saying "not found" is a success. Copy quotes character for character from the page's own text (a script will search the raw page, alt text and PDFs for them), never from a summary. Do not leave downloaded files in the repository.

Work: <title>, <authors>, <date>, <place>. Repository: D:/Desktop/projects/neobrutalistcomponents. Read src/study/themes/usa/win95.ts and src/study/themes/latam/sesc-pompeia.ts to see what a finished theme holds.

R1. Reference: the title in English and Spanish, the name in its own language and script (with a BCP 47 tag), the authors (people or firms; empty if anonymous), the date or date range, the place, and the kind: architecture | graphic | type | web | software | signage | object.
R2. Documented facts: three to five facts a reader should know about the work (what it is, who made it, when, what it looked like, how it was used), each with URL and a verbatim quote of at most 25 words. At least two different sources overall, at least one not Wikipedia.
R3. Palette: are the work's colours documented in a source (values or names)? If not, name one free photograph (on Wikimedia Commons) from which colours could be sampled, or say there is none.
R4. Image: the best photograph or scan of the work on Wikimedia Commons under CC0, PD, CC BY or CC BY-SA (give the File: page URL and its licence as Commons states it). If none exists, say so; do not suggest anything under NC, ND or fair use.
L1–L3, M1–M2: as below.
L1. What typeface(s) or lettering did the work itself use? Name, designer, year, and kind: bitmap | outline | lettered | system | none.
L2. For each fact: URL and verbatim quote (≤25 words).
L3. Two to four free candidates on Google Fonts (OFL-1.1 or Apache-2.0), each with: the family name exactly as fonts.google.com shows it, weights, licence, the specific resemblance, the main difference. Coverage: Latin with Spanish accents<, and Japanese>.
M1. Did the work move? Each documented motion with timing if stated, URL and verbatim quote. A building, object, poster or printed card does not move: "moved": false.
M2. For each motion, the hook: button press (.nbc-button:active), primary button (.nbc-button--primary), dialog opening (.nbc-dialog[open]), tooltip appearing (.nbc-tooltip:popover-open), switch toggling (.nbc-switch__thumb), indeterminate progress (.nbc-progress--indeterminate .nbc-progress__bar). If none fits, say so; do not stretch.
<WORK QUESTIONS>

Write JSON:
{ "id": "<id>",
  "reference": { "title": { "es": "", "en": "" }, "original": { "text": "", "lang": "" }, "authors": [], "date": 0, "place": { "es": "", "en": "" }, "kind": "" },
  "facts": [{ "text": "", "url": "https://", "quote": "" }],
  "palette": { "documented": [{ "colour": "", "url": "", "quote": "" }], "photo": "" },
  "image": { "commons": "", "license": "" },
  "lettering": { "kind": "", "name": "", "designer": "", "year": 0, "claims": [{ "text": "", "url": "https://", "quote": "" }] },
  "candidates": [{ "family": "", "weights": [400], "license": "", "resembles": "", "differs": "" }],
  "motion": { "moved": false, "claims": [], "mapping": [] },
  "doubts": [""] }
Then reply with at most six lines.
```

**N2. Read it.** As phase-2 R2: re-dispatch once with the gaps named if a fact lacks URL or quote or rests on Wikipedia alone; a second weak dossier means the fact is left out.

**N3. Verify.** `node scripts/check-links.mjs --dossier=.superpowers/retrofit/<id>.dossier.json` (it reads `facts`, `lettering.claims` and `motion.claims` — extend it in Task 1 to read `facts` and `palette.documented`). Open every HAND page by hand. Look at every photograph a claim rests on yourself (download to the scratchpad, Read the image).

**N4. Faces.** Render a specimen of the candidates next to the original when the original is installed or shown in a source image (as in phase 2: `.superpowers/retrofit/scratch/spec*.html`, Playwright screenshot, Read). Check subsets in google/fonts `METADATA.pb`. Add to `FONTS` with only the weights used.

**N5. Palette.** `palette.origin`: `documented` (values or names in a source, cited in `palette.note`), `sampled` (named photograph), or `interpreted`. Write all nineteen colour tokens for light and dark; `primaryFg`/`accentFg`/… may be `'auto'`.

**N6. Theme file.** `src/study/themes/<scene>/<id>.ts`:

```ts
import { defineTheme, flat } from '../../define'; // or hardShadow / doubleStack

export default defineTheme({
  id: '<id>',
  scene: '<japan|latam|italy|germany|usa>',
  nativeScheme: 'light',
  name: { es: '<name>', en: '<name>' }, // D7: no live service or store
  tagline: { es: '<one line>', en: '<one line>' },
  reference: {
    title: { es: '…', en: '…' },
    original: { text: '…', lang: '…' }, // when the name has its own script or language
    authors: ['…'],
    date: 1986, // or [from, to]
    place: { es: '…', en: '…' },
    kind: 'software',
    sources: [
      { title: '…', url: 'https://…', publisher: '…', year: 1986, accessed: 'YYYY-MM-DD' },
    ],
    // image: { … } from fetch:image, or archiveUrl for web works
  },
  ficha: {
    documented: { es: '… [1] … [2].', en: '… [1] … [2].' },
    reading: { es: '…', en: '…' },
    palette: { origin: 'interpreted', note: { es: '…', en: '…' } },
    lettering: {
      original: { name: '…', designer: '…', year: 1986, kind: 'bitmap' }, // or { kind: 'none' }; name may be { es, en }
      documented: { es: '… [n].', en: '… [n].' },
      substitute: { es: 'El tema usa …; vemos …; difiere en ….', en: 'The theme uses …; we see …; it differs in ….' },
    },
    // motion: { documented: { es, en }, reading: { es, en } } — only with motionFile
  },
  fonts: { sans: '…', display: '…' },
  colors: { bg: ['#…', '#…'], fg: …, fgMuted: …, surface: …, surfaceAlt: …, border: …, primary: …, primaryFg: 'auto', accent: …, accentFg: 'auto', info: …, infoFg: 'auto', success: …, successFg: 'auto', warning: …, warningFg: 'auto', danger: …, dangerFg: 'auto', focus: … },
  type: { weightBody: 400, weightLabel: 700, weightDisplay: 700 },
  shape: { borderWidth: 2, radius: 0, radiusControl: 0, radiusButton: 0, radiusSmall: 0 },
  elevation: flat(),
  motion: { duration: 0, durationSlow: 0, ease: 'linear' }, // still work; else the work's documented timing
  // signature: './<id>.css', motionFile: './<id>.motion.css',
});
```

**N7. Signature and motion.** Optional signature (≤60 lines, tokens only, no motion). Motion file only with `ficha.motion`, hooked to the specimen's components.

**N8. Image.** `npm run fetch:image -- <Commons File: URL> <id>` and paste its `image` block, writing the `alt` text (es, en) yourself from what the photograph shows. No free image → none, and for web works an `archiveUrl`.

**N9. Register.** Add `'<id>'` to `PROOF_THEMES` in `src/study/study.test.ts` (alphabetical).

**N10. Gates.** `npm run gen:study`; `npx vitest run src/study src/site --maxWorkers=2`; `node scripts/check-links.mjs --themes=<id>` (0 FAIL); with the dev server: screenshots of `/es/theme/<id>` at 1280 and 360 px after fonts load (wait for `main h1`, then 3 s), read them; with motion, `npx playwright test -g "motion under"`.

**N11. Commit** per theme: `feat(study): <id> — <work>`.

## The batch gate

As phase 2's G1–G6, with what phase 2 learned:
- G1 Opus review of `git diff main...HEAD` with the dossiers; tell the reviewer the error classes phase 2 found (false "none", wrong source, Wikipedia-only, near-verbatim, substitute misdescribed, synthetic bold, motion on an invisible element, readings that deny or overstate).
- G2 `npm run check` (re-run a lone timeout once; a test that times out twice is a finding).
- G3 full Playwright run, or CI's e2e when the machine is short on memory (ledger it).
- G4 `git diff --ignore-cr-at-eol --stat public/`: commit `llms-full.txt` when its content changed, revert line-ending churn.
- G5 PR with the per-theme table; G6 CI green → merge (on the owner's authorization), `git checkout main && git pull --ff-only`.

---

### Task 1: Dossier verification reads facts and palettes

**Files:** Modify `scripts/check-links.mjs`.

- [ ] **Step 1:** In the dossier branch, collect claims from `dossier.facts`, `dossier.palette?.documented`, `dossier.lettering?.claims` and `dossier.motion?.claims`:

```js
  const claims = [
    ...(dossier.facts ?? []),
    ...(dossier.palette?.documented ?? []).map((c) => ({ ...c, text: c.colour })),
    ...(dossier.lettering?.claims ?? []),
    ...(dossier.motion?.claims ?? []),
  ];
```

- [ ] **Step 2:** Run it on a phase-2 dossier: `node scripts/check-links.mjs --dossier=.superpowers/retrofit/aqua.dossier.json` — Expected: same counts as before (no `facts` there). Commit: `feat(scripts): check-links verifies a new work's facts and palette quotes`.

---

## Batch 1: Japan (branch `feat/new-works-japan`)

### Task 2: dragon-quest — Dragon Quest (Chunsoft for Enix, 1986, Famicom)

**Hypotheses (verify):** game design by Yuji Horii, art by Akira Toriyama, music by Koichi Sugiyama; command menus in black windows with white borders; kana set in an 8×8 pixel font; a blinking cursor in menus; dialogue printed letter by letter. Room `japan`, kind `software`. Face: DotGothic16 (already registered, Japanese and Latin) for text and titles. Motion: if letter-by-letter text is documented, carry it on the dialog opening (`.nbc-dialog[open] .nbc-dialog__content` revealed with `clip-path` in `steps()`); the cursor blink has no hook unless a source ties it to a control the specimen shows.

**Work questions for N1:** Who designed the menu windows and the font? Primary or reliable sources: Nintendo's "Iwata Asks", interviews with Yuji Horii, the Japanese manual, museum or archive pages (e.g. the Strong Museum, the Game Preservation Society). Is the 8×8 kana font documented, and who drew it?

- [ ] Apply N1–N11.

### Task 3: playstation — PlayStation (Sony Computer Entertainment, 1994), its system menu

**Hypotheses (verify):** the BIOS shell with the memory card manager and CD player; the start-up sequence. D7 allows the name: the product is the reference work. If no two sources (one non-Wikipedia) document the system menu's look and lettering, rule it out and take the next candidate of Task 4, ledgered.

**Work questions for N1:** What typeface did the system menu use? What did the start-up and the menus animate (timing)? Sources: Sony's own pages and manuals, the Computer History Museum, game-history archives.

- [ ] Apply N1–N11.

### Task 4: the third Japanese work

- [ ] **Step 1:** Dispatch one Sonnet subagent to compare three candidates on documentation alone (≥2 sources, one not Wikipedia; documented lettering; a free image or none): *Final Fantasy* (Square, 1987) menus, the Famicom Disk System start-up screen (Nintendo, 1986), *Super Mario Bros.* (Nintendo, 1985) title and HUD. It returns a ranked list with the evidence.
- [ ] **Step 2:** Pick the best documented one, ledger the ruling, and apply N1–N11 to it.

### Task 5: Batch 1 gate

- [ ] Apply the batch gate. PR title: `feat(study): three Japanese works — <names>`.

---

## Batch 2: Latin America (branch `feat/new-works-latam`)

### Task 6: loteria — Mexican lotería (Lotería Don Clemente; the deck's date to establish)

**Hypotheses (verify):** a printed deck of 54 cards, each with an image, a number and a name lettered on it; the theme is named "Lotería", not after the live brand. Kind `graphic`, still. Lettering kind `lettered` if the card names are drawn; the substitute is a display face for titles with a text face for running text.

**Work questions for N1:** The deck's publisher, date (1887 is often given; establish it), and illustrator; the lettering of the card names; museum records (e.g. Museo Nacional de Culturas Populares) and Commons scans in the public domain.

- [ ] Apply N1–N11.

### Task 7: the Caracas Metro signage (1983) — name per the open question

**Hypotheses (verify):** the network opened in 1983; its signage and graphic identity were designed by named Venezuelan designers (establish who); a typeface in the signs (establish which). Kind `signage`, still. Id `caracas-signage` unless the owner amends D7.

**Work questions for N1:** Who designed the Metro's signage and logo, and which typeface do the signs use? Sources: the Metro de Caracas's own pages, Venezuelan design histories, museum or university archives; Commons photographs of the signs.

- [ ] Apply N1–N11.

### Task 8: an OSPAAAL poster (Havana)

- [ ] **Step 1:** Dispatch one Sonnet subagent to choose one OSPAAAL poster held by a museum with an online record (MoMA, V&A, LACMA, the Center for the Study of Political Graphics), with designer, year, title and dimensions documented, and the lettering described or visible in a record image. It returns two or three candidates with evidence; pick one and ledger it. Id from the poster's title.
- [ ] **Step 2:** Apply N1–N11. Kind `graphic`, still; lettering kind `lettered` if hand-drawn.

### Task 9: Batch 2 gate

- [ ] Apply the batch gate. PR title: `feat(study): three Latin American works`.

---

## Batch 3: Italy and Germany (branch `feat/new-works-italy-germany`)

### Task 10: lettera-22 — Olivetti Lettera 22 (Marcello Nizzoli, 1950)

**Hypotheses (verify):** a portable typewriter, Compasso d'Oro 1954; held by MoMA; its typeface (pica or elite; establish the name) is the work's lettering, kind `outline` or `bitmap`-like strike — use the closest honest kind and say why; substitute a free typewriter face (candidates to evaluate: Courier Prime, Cutive Mono, Special Elite). Kind `object`, still.

- [ ] Apply N1–N11.

### Task 11: din-1451 — DIN 1451 (Deutsches Institut für Normung, 1931–1936)

**Hypotheses (verify):** the standard's engineering lettering used on German road signs and railways; kind `type` (the lettering is the work); lettering kind `outline`; a free face close to its Mittelschrift and Engschrift (evaluate candidates; none may be exact — say what differs). Image: a Commons photograph of a sign set in DIN 1451. Kind `type`, still.

- [ ] Apply N1–N11.

### Task 12: munich-72 — the design of the Munich 1972 Olympics (Otl Aicher and his team)

**Hypotheses (verify):** Aicher's office set the identity, the colour palette and the pictograms; the type was Univers (Adrian Frutiger); the palette is documented (light blue, green, silver…) — a `documented` palette if a source names the colours. Kind `graphic`, still. Image: only a Commons photograph under D8 (the pictograms themselves are under copyright).

- [ ] Apply N1–N11.

### Task 13: Batch 3 gate

- [ ] Apply the batch gate. PR title: `feat(study): Olivetti Lettera 22, DIN 1451 and Munich 1972`.

---

## Batch 4: USA (branch `feat/new-works-usa`)

### Task 14: win31 — Windows 3.1 (Microsoft, 1992)

**Hypotheses (verify):** the bold bitmap System font in title bars and menus, MS Sans Serif in dialogs; probably no animation (verify; still unless documented). Faces: a bold pixel face for titles, evaluated against Pixelify Sans and DotGothic16 already in the registry.

- [ ] Apply N1–N11.

### Task 15: beos — BeOS (Be Inc., the release the sources document best, 1995–2000)

**Hypotheses (verify):** Tracker windows with yellow tabs; system fonts from Bitstream (establish names); motion to establish.

- [ ] Apply N1–N11.

### Task 16: atari-gem — the GEM desktop on the Atari ST (Digital Research / Atari, 1985)

**Hypotheses (verify):** an 8×16 bitmap system font; growing and shrinking boxes when a window or dialog opens (GEM AES `form_dial` FMD_GROW/FMD_SHRINK, to verify in the AES documentation) → the dialog opening hook, as in Mac OS System 7.

- [ ] Apply N1–N11.

### Task 17: palm-os — Palm OS (Palm Computing, 1996)

**Hypotheses (verify):** bitmap system fonts on a 160×160 screen; Graffiti input; probably still. Pixel face for text after the 16 px check.

- [ ] Apply N1–N11.

### Task 18: Batch 4 gate

- [ ] Apply the batch gate. PR title: `feat(study): Windows 3.1, BeOS, Atari GEM and Palm OS`.

---

## Release

### Task 19: Release 1.3.0

**Files:** `package.json`, `CHANGELOG.md`.

- [ ] **Step 1:** Branch `release/1.3.0` from the updated `main`. Set `"version": "1.3.0"`. In `CHANGELOG.md`, turn `## Unreleased` into `## 1.3.0 — <date>`, add a line for the thirteen new works (by room), and keep the phase-1 and phase-2 entries under it.
- [ ] **Step 2:** `npm run check` → exit 0; `npm run gen:llms` and commit content changes; `node scripts/check-links.mjs` over every theme → 0 FAIL (HAND lines opened by hand).
- [ ] **Step 3:** PR `chore: release 1.3.0`; CI green; merge on the owner's word.
- [ ] **Step 4 (owner's word required):** `git tag v1.3.0 && git push origin v1.3.0` — `publish.yml` publishes to npm with provenance; poll `npm view neobrutalistcomponents version` until it reads 1.3.0; confirm the Pages deploy.

---

## Self-review

- **Spec coverage:** §5.2's thirteen works → Tasks 2–4, 6–8, 10–12, 14–17 (the Japanese third title and the OSPAAAL poster are chosen by evidence inside their tasks; Deutsche Bahn stays out per §5.2's ruling); §5.3 rules → Global Constraints and N1–N3; §6 testing → N10 and the batch gate; §7 release → Task 19, publish only on the owner's word.
- **Placeholders:** the theme template's angle brackets are the fields research fills, by design; every mechanical step shows its command.
- **Consistency:** ids `dragon-quest`, `playstation`, `loteria`, `caracas-signage`, `lettera-22`, `din-1451`, `munich-72`, `win31`, `beos`, `atari-gem`, `palm-os`, plus the two chosen in Tasks 4 and 8, all match `^[a-z][a-z0-9-]{1,31}$`.
