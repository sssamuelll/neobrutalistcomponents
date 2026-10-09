# Lettering and Motion: Phase 2 (retrofit of the 16 themes) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every one of the 16 current study themes documents its work's real lettering, loads a free face chosen for a stated resemblance, and moves only as its work moved, with every claim sourced; then `lettering` becomes required and the pending list is deleted.

**Architecture:** Five batches, one branch and one PR each, in the order the owner chose (Japan and Latin America first). Task 1 amends the engine for what the retrofit meets (works with no lettering, a motion specimen on the theme page, a loop limit, a link checker, wider e2e). Each theme then follows one protocol (R1–R8): a research dossier by a Sonnet subagent, a mechanical check that every quoted source says what the dossier claims, then the theme data written by the controller. Each batch ends with a fresh Opus review of its claims and the full gates.

**Tech Stack:** TypeScript theme data, Vitest, Playwright + axe, Node 22 `fetch` for the link checker, Google Fonts (OFL-1.1 / Apache-2.0).

**Spec:** `docs/superpowers/specs/2026-10-09-lettering-and-motion-design.md` (phase 2 of §2), resting on `2026-10-05-neobrutalism-study-engine-design.md` §1.1 and D7.

## Global Constraints

- §1.1: "Every theme still reads one documented work. Its ficha still separates sourced fact from reading."
- D7: ≥2 sources per theme, at least one not on wikipedia.org; fichas paraphrase, never quote.
- New sources are appended to the end of `reference.sources`, so existing `[n]` markers keep their numbers.
- `lettering.documented` and `motion.documented` cite at least one source each, with the same markers in es and en (enforced since #25).
- "If the work did not move, the theme does not move": no `ficha.motion` ⇒ `motion: { duration: 0, durationSlow: 0, ease: 'linear' }` (enforced in Task 22).
- Motion files: at most 40 lines; animated properties only `transform`, `opacity`, `clip-path`, `background-position`, `outline`; every animation and transition inside `@media (prefers-reduced-motion: no-preference)`; keyframes at the top level; only loading indicators may loop forever (Task 1).
- Faces: Google Fonts, OFL-1.1 or Apache-2.0, `css2` URL answering 200, licence folder in google/fonts matching the registry; `axes` lists only the weights the theme uses; a theme loads at most 3 families.
- A `lettered` or poster face goes into `fonts.display` only; `fonts.sans` stays a face built for running text.
- Contrast pairs and axe stay green in both schemes (the e2e suite).
- Site strings in Venezuelan Spanish (tú, never vos); ficha prose is impersonal.
- Research subagents run on Sonnet; the batch reviewer on Opus (the owner: "solo opus y sonnets").
- No merge without the owner's word.
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

## Rulings taken while planning

1. **`lettering.original.kind: 'none'`.** Buildings and objects (Nakagin, the Mäusebunker, the Carlton) may carry no lettering, and forcing one would invent a claim. The spec's four kinds do not cover this. `{ kind: 'none' }` has no name and no `documented`; the page says "None of the sources we consulted documents lettering on the work", which is a claim about our research, not about the world. Cost if wrong: one more kind in the type.
2. **A motion specimen on the theme page.** The theme page's sampler shows a card, fields and buttons, but no dialog, progress bar, tooltip or switch, so motion hooked to those would never be seen. The «Movimiento» section renders those four components inside the theme. Cost if wrong: four small components on pages with motion.
3. **Only loading indicators loop forever.** WCAG 2.2.2 asks for a pause control on auto-playing motion longer than five seconds. Aqua's default button pulsed for as long as a dialog stayed open; here it pulses a fixed number of times and the reading says so. Cost if wrong: less literal fidelity on one or two themes.
4. **Material's elevation change stays instant.** Its raised button lifts by changing its shadow, and `box-shadow` is not one of the five animatable properties. The ripple carries the motion. The existing signature transition goes, and signatures then lose transitions too (Task 18). Cost if wrong: Material reads a little stiffer.
5. **Dossiers stay out of git** (`.superpowers/retrofit/`, ignored). The ficha's sources are the published record; the dossier is working evidence. Cost if wrong: provenance of a claim lives only in the source list.

## Review Focus

1. A ficha sentence that its cited source does not support, or stretches. Pinned by R3 (every dossier quote found on its page by `check-links`) and by the batch reviewer comparing each claim with its quote (Tasks 4, 8, 14, 19, 23).
2. A substitute face missing glyphs the page needs (á, ñ, ¿; Japanese for Nakagin), so text falls back mid-word. Pinned by R4 (`scripts` must cover the page's languages) and R7 (screenshots of the ES page).
3. A wider display face pushing a theme page past 360 px. Pinned by Task 1: the 360 px e2e covers every study theme page.
4. Motion hooked to a component the visitor never sees. Pinned by Task 1's motion specimen and its test.
5. Auto-playing motion that never stops. Pinned by Task 1's loop lint; and motion that still runs under `prefers-reduced-motion: reduce`, pinned by Task 1's e2e over every theme with a motion file.

---

## File structure

| File | Responsibility |
|---|---|
| `src/study/types.ts` | `LetteringFace`, `'none'` kind, `documented` optional for none; Task 22: `lettering` required on study themes |
| `src/study/validate.ts` | none-kind rules; Task 22: static ⇒ 0 ms, pending list deleted |
| `src/study/lint.ts` | loop limit (Task 1); signatures lose transitions (Task 18) |
| `src/site/study/FichaExtras.tsx`, `MotionSpecimen.tsx` (+ tests) | none sentence; motion specimen |
| `src/site/i18n.ts`, `src/site/site.css` | strings and layout for the above |
| `e2e/site.spec.ts` | every study theme at 360 px; reduced-motion check for every motion file |
| `scripts/check-links.mjs`, `package.json` | link, quote and font-licence checker (`npm run check:links`) |
| `src/study/fonts.ts` | new faces, one per need |
| `src/study/themes/<scene>/<id>.ts`, `<id>.motion.css` | the retrofit itself |
| `src/study/study.test.ts`, `src/study/lettering.test.ts` | Task 22 removes the pending machinery |

---

## The retrofit protocol (R1–R8)

Every theme task (2, 3, 5–7, 9–13, 15–18, 20, 21) applies these steps in order, with the theme's own questions and hypotheses. Hypotheses are what the planner believes; they are questions to verify, never text to copy.

**R1. Dossier.** Dispatch one research subagent (Agent tool, `subagent_type: general-purpose`, `model: sonnet`) with the prompt below, filled in. Save its JSON to `.superpowers/retrofit/<id>.dossier.json`.

```
You are researching one work for a design museum's study theme. Facts only, from pages you actually opened. Never invent a URL or a quote: a quote you did not read on the page is a failure, and saying "not found" is a success.

Work: <title>, <authors>, <date>, <place>. Theme file: src/study/themes/<scene>/<id>.ts in D:/Desktop/projects/neobrutalistcomponents — read it first (reference, sources, ficha).

L1. What typeface(s) or lettering did the work itself set its text in? Name, designer, year, and kind: bitmap | outline | lettered | system | none (none = no source you found documents lettering on the work).
L2. For each fact in L1: the source URL and a verbatim quote of at most 25 words copied from that page that supports it.
L3. Two to four free candidates on Google Fonts (OFL-1.1 or Apache-2.0) that resemble the original — or, for kind none, that suit the theme's reading of the work — each with: the family name exactly as fonts.google.com shows it, the weights needed, the licence, one sentence on the specific resemblance (proportion, construction, x-height, width, terminals, bitmap grid) and one on the main difference. Each must cover Latin with Spanish accents<, and Japanese>.
M1. Did the work move? List each documented motion (what moved, when, timing if stated: ms, frames, count, steps) with URL and a verbatim quote of at most 25 words. A building, object, poster or painting does not move: answer "moved": false.
M2. For each motion, the library hook that can carry it, from: button press (.nbc-button:active), primary button (.nbc-button--primary), dialog opening (.nbc-dialog[open] .nbc-dialog__panel), tooltip appearing (.nbc-tooltip:popover-open), switch toggling (.nbc-switch__thumb), indeterminate progress (.nbc-progress--indeterminate .nbc-progress__bar). If none fits, say so; do not stretch.
<THEME QUESTIONS>

Prefer primary sources (the maker's guidelines and manuals, the designer, museums, archives) over blogs; give at least one non-Wikipedia source per fact. Do not cite an archive.org item you have not opened. Return only this JSON:
{ "id": "<id>",
  "lettering": { "kind": "", "name": "", "designer": "", "year": 0, "claims": [{ "text": "", "url": "https://", "quote": "" }] },
  "candidates": [{ "family": "", "weights": [400], "license": "OFL-1.1", "resembles": "", "differs": "" }],
  "motion": { "moved": false, "claims": [{ "text": "", "url": "https://", "quote": "", "timing": "" }], "mapping": [{ "motion": "", "selector": "" }] },
  "doubts": [""] }
```

**R2. Read it.** Reject the dossier, and re-dispatch once with the gaps named, if any claim lacks a URL or quote, or a fact has only Wikipedia behind it. A second weak dossier means the fact is not established: write the theme without it.

**R3. Verify mechanically.** `node scripts/check-links.mjs --dossier=.superpowers/retrofit/<id>.dossier.json`. Every claim must be `OK` (page answered 200 and contains the quote). Open each `HAND` line with WebFetch and confirm the quote yourself; drop every claim that is `FAIL` or that you cannot confirm. Nothing unconfirmed reaches the ficha.

**R4. Choose the face.** Pick one candidate per role (`sans` for text, `display` for headings where the work's lettering differs from its text face). Check its page on fonts.google.com for the scripts the theme needs (`latin`, plus `japanese` for Japan). Add it to `FONTS` in `src/study/fonts.ts` with only the weights the theme uses, e.g.:

```ts
  'pixelify-sans': { family: 'Pixelify Sans', axes: 'wght@400;700', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
```

A theme whose work used the system's own default (kind `system`) or carries no lettering may keep `'system-sans'` / `'system-serif'`; say so in `substitute`.

**R5. Write the theme.** In `src/study/themes/<scene>/<id>.ts`:
- `fonts` and `type`: weights, transforms and spacing the work used; `kerning: 'none'` for a bitmap original; `featureSettings` only if a source documents it.
- `reference.sources`: append the confirmed sources.
- `ficha.lettering`:
  ```ts
  lettering: {
    original: { name: 'Chicago', designer: 'Susan Kare', year: 1984, kind: 'bitmap' }, // or { kind: 'none' }
    documented: { es: '… [6].', en: '… [6].' },   // omitted for kind none
    substitute: { es: 'El tema usa <Family>: …; difiere en …', en: 'The theme uses <Family>: …; it differs in …' },
  },
  ```
  `substitute` names every family the theme loads as `sans` or `display`, says what resembles and what differs.
- Fix any sentence in `documented` / `reading` that the new lettering contradicts (e.g. "text is set in the system sans").
- Motion: either `ficha.motion` (documented with `[n]`, reading) plus `motionFile: './<id>.motion.css'` and the file itself, written to the work's timing; or, for a still work, `motion: { duration: 0, durationSlow: 0, ease: 'linear' }` and no file.
- Remove `<id>` from `LETTERING_PENDING` in `src/study/validate.ts`.
- Prose: 2–4 sentences per block, paraphrased, every claim with `[n]`, same markers in es and en, no hype (solace-wren's banlist), "we see"/"vemos" for kinships the sources do not state.

**R6. Gates.** `npm run gen:study` (validation; prints `16 study theme(s)`), `npx vitest run src/study src/site`, `node scripts/check-links.mjs --themes=<id>` (sources and fonts: no `FAIL`).

**R7. Look.** With `npm run dev` running: `node scripts/screenshots.mjs --routes=/es/theme/<id>,/en/theme/<id> --themes=classic --modes=light,dark --full`, then again with `--width=360`. Read the PNGs in `.screenshots/`: the chosen face renders (not a fallback), accents render in the face, a bitmap face is not smeared, nothing overflows, the «Tipografía» section reads well. For a theme with motion, open the page in a browser without reduced motion and set off each specimen control once.

**R8. Commit.**

```bash
git add src/study/fonts.ts src/study/validate.ts src/study/themes/<scene>/
git commit -m "feat(study): <id> — lettering<, and motion,> from <work>

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

## The batch gate (G1–G6)

Tasks 4, 8, 14, 19 and 23 apply it to their batch.

- **G1. Review.** Dispatch a fresh reviewer (Agent tool, `model: opus`) with: the batch diff (`git diff main...HEAD`), the dossiers in `.superpowers/retrofit/`, this plan's Global Constraints and Review Focus. It checks every ficha sentence against its source quote, the honesty of each face choice, motion fidelity and the motion rules, and reports Critical / Important / Minor. Fix Critical and Important with a test where the finding is mechanical, by rewriting where it is prose; ledger Minor.
- **G2.** `npm run check` → exit 0.
- **G3.** `npx playwright test` → all pass; then `git status`: revert generated churn (`git checkout public/llms.txt public/llms-full.txt` when the diff is line endings only).
- **G4.** `git push -u origin <branch>`; `gh pr create` with, per theme: the original face, the substitute and why, motion yes/no and what, sources added.
- **G5.** `gh pr checks <n> --watch` → `verify` and `e2e` pass.
- **G6.** Merge only on the owner's word: `gh pr merge <n> --merge --delete-branch`, then `git checkout main && git pull --ff-only` before the next batch branches.

---

## Batch 1: Japan and Latin America (branch `feat/retrofit-japan-latam`)

### Task 1: What the retrofit needs from the engine, the site and the tools

**Files:**
- Modify: `src/study/types.ts`, `src/study/validate.ts`, `src/study/lint.ts`
- Modify: `src/site/study/FichaExtras.tsx`, `src/site/i18n.ts`, `src/site/site.css`
- Create: `src/site/study/MotionSpecimen.tsx`
- Create: `scripts/check-links.mjs`; Modify: `package.json`
- Modify: `e2e/site.spec.ts`
- Test: `src/study/lettering.test.ts`, `src/study/motion.test.ts`, `src/site/study/FichaExtras.test.tsx`
- Modify: `docs/superpowers/specs/2026-10-09-lettering-and-motion-design.md`

**Interfaces:**
- Consumes: `Lettering`, `letteringProblems`, `letteringThemeProblems`, `prose`, `lintMotion`, `animationUses`, `FichaExtras` (phase 1).
- Produces: `LetteringFace`; `Lettering.original: LetteringFace | { kind: 'none' }`; `Lettering.documented?: L10n`; `LETTERING_KINDS` with `'none'`; `MotionSpecimen` (no props); i18n keys `letteringNone`, `motionTry`, `motionPress`, `motionHint`, `motionOpen`, `motionSwitch`, `motionLoading`, `motionDialogTitle`, `motionDialogBody`, `motionClose`; `npm run check:links` with `--themes=<ids>` and `--dossier=<file>`.

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull --ff-only && git checkout -b feat/retrofit-japan-latam
```

- [ ] **Step 2: Write the failing tests**

Append to `src/study/lettering.test.ts`:

```ts
describe('works with no documented lettering', () => {
  const none = { original: { kind: 'none' as const }, substitute: FIXTURE.ficha.lettering!.substitute };

  it('take kind none, with no name and no documented text', () => {
    expect(themeProblems({ ...FIXTURE, ficha: { ...FIXTURE.ficha, lettering: none } })).toEqual([]);
  });

  it('cannot document lettering they do not have', () => {
    const lettering = { ...none, documented: { es: 'Algo [1].', en: 'Something [1].' } };
    expect(problems({ ficha: { ...FIXTURE.ficha, lettering } })).toMatch(/lettering\.documented: a work with no documented lettering/);
  });

  it('a face still needs its documented text', () => {
    expect(problems(withLettering({ documented: undefined }))).toMatch(/lettering\.documented: missing/);
  });
});
```

In `src/study/motion.test.ts`, change the selector in `GOOD` from `.nbc-progress__bar` to `.nbc-progress--indeterminate .nbc-progress__bar` (an indeterminate bar is a loader), and append:

```ts
describe('only loading indicators loop forever (WCAG 2.2.2)', () => {
  const guard = (body: string) => `@media (prefers-reduced-motion: no-preference) {\n${body}\n}`;

  it('rejects an infinite animation on anything else', () => {
    expect(lintMotion(guard('.nbc-button--primary { animation: pulse 1s infinite; }'), 'm').join('\n')).toMatch(/loops forever/);
    expect(lintMotion(guard('.nbc-button--primary { animation-iteration-count: infinite; }'), 'm').join('\n')).toMatch(/loops forever/);
  });

  it('accepts a counted animation, and a loader that loops', () => {
    expect(lintMotion(guard('.nbc-button--primary { animation: pulse 1s 4; }'), 'm')).toEqual([]);
    expect(lintMotion(GOOD, 'm')).toEqual([]);
  });
});
```

Append to `src/site/study/FichaExtras.test.tsx`:

```tsx
describe('FichaExtras, retrofit additions', () => {
  it('says when no source documents lettering on the work', () => {
    renderExtras({ ...FIXTURE.ficha, lettering: { original: { kind: 'none' }, substitute: { es: 'El tema usa Barlow.', en: 'The theme uses Barlow.' } } });
    expect(screen.getByText('Ninguna fuente que consultamos documenta rotulación en la obra.')).toBeInTheDocument();
    expect(screen.queryByText(/La obra usaba/)).not.toBeInTheDocument();
  });

  it('shows the motion specimen with the motion section, and not without it', () => {
    const motion = { documented: { es: 'Se mueve [1].', en: 'It moves [1].' }, reading: { es: 'Lo imita.', en: 'It imitates that.' } };
    const { container, unmount } = renderExtras({ ...FIXTURE.ficha, motion }, 'en');
    expect(screen.getByRole('button', { name: 'Open dialog' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Switch' })).toBeInTheDocument();
    expect(container.querySelector('.nbc-progress--indeterminate')).not.toBeNull();
    unmount();
    renderExtras(FIXTURE.ficha, 'en');
    expect(screen.queryByRole('button', { name: 'Open dialog' })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run to verify they fail**

Run: `npx vitest run src/study/lettering.test.ts src/study/motion.test.ts src/site/study/FichaExtras.test.tsx`
Expected: FAIL — `kind: 'none'` is a type error and a validation problem; `loops forever` is never reported; the none sentence and the specimen are absent.

- [ ] **Step 4: The none kind in types and validation**

`src/study/types.ts`: replace the kinds and the `Lettering` interface with:

```ts
export const LETTERING_KINDS = ['bitmap', 'outline', 'lettered', 'system', 'none'] as const;
export type LetteringKind = (typeof LETTERING_KINDS)[number];

/** The face a work set its text in. */
export interface LetteringFace {
  readonly name: string;
  readonly designer?: string;
  readonly year?: number;
  readonly kind: Exclude<LetteringKind, 'none'>;
  /** The original is itself freely licensed and loaded as is (Roboto). Waives "substitute differs from original". */
  readonly free?: true;
}

/** What the work set its text in, and the free face the theme uses in its place. */
export interface Lettering {
  /** The work's face, or { kind: 'none' } when no source we consulted documents lettering on the work. */
  readonly original: LetteringFace | { readonly kind: 'none' };
  /** What the work used; every claim carries a [n] marker. Required for a face, absent for 'none'. */
  readonly documented?: L10n;
  /** The free face the theme loads and why; names it. */
  readonly substitute: L10n;
}
```

`src/study/validate.ts`, `letteringProblems` becomes:

```ts
function letteringProblems(lettering: Lettering | undefined, where: string): string[] {
  if (!lettering) return [];
  const { original } = lettering;
  const at = `${where}.lettering`;
  const problems = l10nProblems(lettering.substitute, `${at}.substitute`);
  if (!(LETTERING_KINDS as readonly string[]).includes(original.kind)) problems.push(`${at}.original.kind: unknown "${original.kind}"`);
  if (original.kind === 'none') {
    if (lettering.documented) problems.push(`${at}.documented: a work with no documented lettering has nothing to document — drop it`);
    return problems;
  }
  problems.push(...l10nProblems(lettering.documented, `${at}.documented`));
  if (!original.name?.trim()) problems.push(`${at}.original.name: empty`);
  if (original.year !== undefined && !(Number.isInteger(original.year) && original.year >= 1400 && original.year <= 2100)) {
    problems.push(`${at}.original.year: ${original.year} is not a year`);
  }
  return problems;
}
```

In `prose`, keep only blocks that exist:

```ts
    ...(ficha.lettering ? [ficha.lettering.documented, ficha.lettering.substitute].filter((block): block is L10n => block !== undefined) : []),
```

In `letteringThemeProblems`, guard the original-equals-substitute check:

```ts
  if (original.kind !== 'none' && !original.free && families.some((family) => family.toLowerCase() === original.name.trim().toLowerCase())) {
```

- [ ] **Step 5: The loop limit**

`src/study/lint.ts`, before `lintMotion`:

```ts
/** Only loading indicators may loop forever: other auto-playing motion longer than five seconds needs a pause control (WCAG 2.2.2). */
const LOADERS = ['.nbc-progress--indeterminate', '.nbc-button--loading', '.nbc-button__spinner'];
```

and inside `lintMotion`, in the loop over `animationUses(css).filter(isRealAnimation)`, after the guard check:

```ts
    if (/\binfinite\b/.test(use.value) && !LOADERS.some((loader) => use.selector.includes(loader))) {
      problems.push(`${where}: "${use.selector}" loops forever — only loading indicators may (WCAG 2.2.2); give it a count`);
    }
```

- [ ] **Step 6: The none sentence and the motion specimen**

`src/site/i18n.ts`, after `letteringFree`:

```ts
  letteringNone: { es: 'Ninguna fuente que consultamos documenta rotulación en la obra.', en: 'None of the sources we consulted documents lettering on the work.' },
  motionTry: { es: 'Cada control dispara su movimiento.', en: 'Each control sets off its motion.' },
  motionPress: { es: 'Pulsar', en: 'Press' },
  motionHint: { es: 'Un aviso breve', en: 'A short hint' },
  motionOpen: { es: 'Abrir diálogo', en: 'Open dialog' },
  motionSwitch: { es: 'Interruptor', en: 'Switch' },
  motionLoading: { es: 'Cargando', en: 'Loading' },
  motionDialogTitle: { es: 'Un diálogo', en: 'A dialog' },
  motionDialogBody: { es: 'Así se abre un diálogo en este tema.', en: 'This is how a dialog opens in this theme.' },
  motionClose: { es: 'Cerrar', en: 'Close' },
```

Create `src/site/study/MotionSpecimen.tsx`:

```tsx
import { useState } from 'react';
import { Button, Dialog, Progress, Switch, Tooltip } from 'neobrutalistcomponents';
import { useT } from '../i18n';

/** The components a motion file can animate, so a visitor can set each motion off. Rendered inside the theme. */
export function MotionSpecimen() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <div className="site-themepage__motion">
      <p className="site-p site-themepage__lettering">{t('motionTry')}</p>
      <div className="site-themepage__motion-row">
        <Tooltip content={t('motionHint')}>
          <Button variant="primary">{t('motionPress')}</Button>
        </Tooltip>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          {t('motionOpen')}
        </Button>
        <Switch label={t('motionSwitch')} />
      </div>
      <Progress label={t('motionLoading')} />
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>{t('motionDialogTitle')}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>
          <p>{t('motionDialogBody')}</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button onClick={() => setOpen(false)}>{t('motionClose')}</Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}
```

`src/site/study/FichaExtras.tsx`: import `MotionSpecimen`; render the lettering block as

```tsx
          <h2 className="site-h2">{t('lettering')}</h2>
          {original && original.kind !== 'none' ? (
            <>
              <p className="site-p site-themepage__lettering">
                {t('letteringOriginal')}: {facts}.
              </p>
              {lettering.documented ? <p className="site-p">{lettering.documented[lang]}</p> : null}
            </>
          ) : (
            <p className="site-p site-themepage__lettering">{t('letteringNone')}</p>
          )}
          <p className="site-p">
            {t('letteringSubstitute')}
            {original && original.kind !== 'none' && original.free ? ` ${t('letteringFree')}` : ''}: {lettering.substitute[lang]}
          </p>
```

with `facts` computed only for a face (`original && original.kind !== 'none' ? [original.name, original.designer, original.year].filter(Boolean).join(', ') : ''`), and add `<MotionSpecimen />` after `motion.reading` in the motion block.

`src/site/site.css`, after the `.site-themepage__lettering` rule group:

```css
.site-themepage__motion {
  display: grid;
  gap: var(--nbc-space-md);
  margin-block: var(--nbc-space-md) var(--nbc-space-xl);
}
.site-themepage__motion-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--nbc-space-md);
}
```


- [ ] **Step 7: Run to verify they pass**

Run: `npx vitest run src/study src/site && npx tsc -p tsconfig.json && npx eslint src --max-warnings 0`
Expected: all pass, no type or lint errors.

- [ ] **Step 8: The e2e additions**

In `e2e/site.spec.ts`, add `import { readdirSync } from 'node:fs';` to the imports. In the `theme and component pages at 360px` describe, replace the literal list with every study theme page plus the three existing pages:

```ts
  const STUDY_PAGES = CATALOG.filter((entry) => !entry.predatesStudy).map((entry) => `#/en/theme/${entry.id}`);
  for (const hash of ['#/es/theme/tech', '#/es/theme/maeusebunker', '#/en/components/button', ...STUDY_PAGES]) {
```

and append:

```ts
/** Study themes with a motion file, read from disk (the registry needs Vite). */
const MOTION_THEMES = readdirSync('src/study/themes', { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.motion.css'))
  .map((file) => file.split(/[\\/]/).pop()!.replace(/\.motion\.css$/, ''));

test.describe('a theme with motion stays still under prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const id of MOTION_THEMES) {
    test(`${id}: no animation runs when its specimen is set off`, async ({ page }) => {
      await page.goto(`?theme=classic#/en/theme/${id}`);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('main [role="status"]')).toHaveCount(0);
      const specimen = page.locator('.site-themepage__motion');
      await specimen.getByRole('button', { name: 'Press' }).hover();
      await specimen.getByRole('switch', { name: 'Switch' }).click();
      await specimen.getByRole('button', { name: 'Open dialog' }).click();
      const running = await page.evaluate(() =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === 'running')
          .map((animation) => ('animationName' in animation ? (animation as CSSAnimation).animationName : `transition ${(animation as CSSTransition).transitionProperty}`))
          .filter((name) => !name.startsWith('site-')),
      );
      expect(running).toEqual([]);
    });
  }
});
```

Run: `npx playwright test -g "360px|reduced-motion"`
Expected: the 360 px tests pass for all 16 study theme pages (no theme has a motion file yet, so the reduced-motion describe has no tests). A 360 px failure here is a finding in today's site: fix it in this task before going on.

- [ ] **Step 9: The link checker**

Create `scripts/check-links.mjs`:

```js
// Checks the study's links before a ficha ships. Needs the network; not part of CI.
//
//   node scripts/check-links.mjs                        every theme's sources and fonts
//   node scripts/check-links.mjs --themes=a,b           only these themes
//   node scripts/check-links.mjs --dossier=<file.json>  each claim's quote is on its page
//
// OK: answered 200 (and a dossier quote is on the page). HAND: the site refuses
// scripts (401, 403, 429) or serves a PDF: open it yourself. FAIL: anything else.
// Exits 1 on any FAIL.
import { runnerImport } from 'vite';
import { readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const load = async (file) => (await runnerImport(join(ROOT, file), { configFile: false, logLevel: 'silent' })).module;
const UA = { 'user-agent': 'Mozilla/5.0 (neobrutalistcomponents link check)' };

async function get(url) {
  try {
    const res = await fetch(url, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(20_000) });
    const type = res.headers.get('content-type') ?? '';
    return { status: res.status, type, text: res.ok && !type.includes('pdf') ? await res.text() : '' };
  } catch (error) {
    return { status: 0, type: '', text: '', error: error.message };
  }
}

const verdict = (status) => (status === 200 ? 'OK' : [401, 403, 429].includes(status) ? 'HAND' : 'FAIL');
const normalize = (text) =>
  text
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;|&rsquo;|&lsquo;|[’‘]/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;|[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .toLowerCase();

const lines = [];
const report = (state, status, label, url) => lines.push(`${state.padEnd(4)} ${String(status).padEnd(3)} ${label}  ${url}`);

const dossierPath = arg('dossier');
if (dossierPath) {
  const dossier = JSON.parse(readFileSync(dossierPath, 'utf8'));
  const claims = [...(dossier.lettering?.claims ?? []), ...(dossier.motion?.claims ?? [])];
  for (const { url, quote, text } of claims) {
    const res = await get(url);
    const label = `"${(quote ?? '').slice(0, 60)}"`;
    if (res.type.includes('pdf') || url.toLowerCase().endsWith('.pdf')) report('HAND', res.status, `${label} (PDF)`, url);
    else if (res.status !== 200) report(verdict(res.status), res.status, label, url);
    else if (!quote || !normalize(res.text).includes(normalize(quote))) report('FAIL', 200, `${label} not on the page (claim: ${text})`, url);
    else report('OK', 200, label, url);
  }
} else {
  const { STUDY_THEMES } = await load('src/study/registry.ts');
  const { FONTS, googleFontsUrl } = await load('src/study/fonts.ts');
  const wanted = arg('themes')?.split(',');
  const themes = STUDY_THEMES.map(({ theme }) => theme).filter((theme) => !wanted || wanted.includes(theme.id));
  for (const theme of themes) {
    for (const source of theme.reference.sources) {
      const res = await get(source.url);
      report(verdict(res.status), res.status, `${theme.id} source`, source.url);
    }
    if (theme.reference.archiveUrl) {
      const res = await get(theme.reference.archiveUrl);
      report(verdict(res.status), res.status, `${theme.id} archive`, theme.reference.archiveUrl);
    }
  }
  const keys = [...new Set(themes.flatMap(({ fonts }) => (typeof fonts === 'string' ? [] : [fonts.sans, fonts.display, fonts.mono].filter(Boolean))))];
  for (const key of keys) {
    const font = FONTS[key];
    const css = await get(googleFontsUrl([key]));
    report(verdict(css.status), css.status, `font ${key} css2`, googleFontsUrl([key]));
    const dir = font.family.toLowerCase().replace(/[^a-z0-9]/g, '');
    const expected = font.license === 'OFL-1.1' ? 'ofl' : 'apache';
    let found = null;
    for (const folder of ['ofl', 'apache', 'ufl']) {
      if ((await get(`https://raw.githubusercontent.com/google/fonts/main/${folder}/${dir}/METADATA.pb`)).status === 200) {
        found = folder;
        break;
      }
    }
    report(found === expected ? 'OK' : 'FAIL', found ?? '-', `font ${key} licence: registry ${font.license}, google/fonts ${found ?? 'not found'}`, `https://github.com/google/fonts/tree/main/${found ?? expected}/${dir}`);
  }
}

console.log(lines.join('\n'));
const failed = lines.filter((line) => line.startsWith('FAIL')).length;
console.log(`\ncheck-links: ${lines.length} checked, ${failed} FAIL, ${lines.filter((line) => line.startsWith('HAND')).length} HAND`);
process.exit(failed ? 1 : 0);
```

In `package.json` scripts, after `"check:package"`: `"check:links": "node scripts/check-links.mjs",`.

Run: `npm run check:links > .superpowers/retrofit/baseline-links.txt; tail -3 .superpowers/retrofit/baseline-links.txt`
Expected: every current source and font `OK` or `HAND`. Each `FAIL` is a broken source in today's catalog: note it in the ledger and fix it in the task of the theme that owns it (replace the URL with the same document's current address, or a Wayback snapshot of it).

- [ ] **Step 10: Amend the spec**

In `docs/superpowers/specs/2026-10-09-lettering-and-motion-design.md`, §3.1, after the line describing `kind`, add:

```md
*Amended during phase 2:* `none` joins the kinds, for works on which no source we consulted documents lettering (buildings, objects). It has no name and no `documented`; the page says so in those words. §4.2 gains a loop limit: only loading indicators may loop forever (WCAG 2.2.2). The theme page shows a motion specimen (a button with a tooltip, a dialog, a switch, an indeterminate progress bar) under «Movimiento».
```

- [ ] **Step 11: Commit**

```bash
git add src e2e scripts/check-links.mjs package.json docs/superpowers/specs/2026-10-09-lettering-and-motion-design.md
git commit -m "feat(study): what the retrofit needs — works without lettering, a motion specimen, a loop limit, a link checker

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 2: nakagin — Nakagin Capsule Tower (Kisho Kurokawa, Tokyo, 1972)

**Files:** `src/study/themes/japan/nakagin.ts`, `src/study/fonts.ts` (only if the face changes), `src/study/validate.ts`.

**Hypotheses (verify):** no source documents lettering on the tower → `{ kind: 'none' }`; the theme keeps Zen Kaku Gothic New (sans), Dela Gothic One (display), M PLUS 1 Code (mono), and `substitute` explains that they are a reading of Japanese type of the period and the tower's capsule grid, not a likeness. A building does not move → 0 ms.

**Theme questions for R1:** Does any source document a sign, nameplate (中銀カプセルタワービル) or lettering on the building or in Kurokawa's drawings and brochures? If a sign is documented with a photograph, describe its letterforms (gothic, mincho, hand-drawn).

- [ ] Apply R1–R8. Expected: `nakagin` leaves `LETTERING_PENDING`; `npm run gen:study` passes.

### Task 3: sesc-pompeia — SESC Pompéia (Lina Bo Bardi, São Paulo, 1977–1986)

**Files:** `src/study/themes/latam/sesc-pompeia.ts`, `src/study/fonts.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** Lina Bo Bardi drew the centre's lettering and visual identity by hand (the "SESC Fábrica da Pompéia" logotype), kind `lettered`; the theme keeps Chivo for running text and may add a display face whose construction resembles her lettering. A building does not move → 0 ms.

**Theme questions for R1:** Who drew the logotype and signage of SESC Fábrica da Pompéia, and when? Describe the letterforms (weight, width, hand or constructed, irregularities). Is there a primary source (Instituto Bardi, Sesc São Paulo, a museum catalogue)?

- [ ] Apply R1–R8. Expected: `sesc-pompeia` leaves `LETTERING_PENDING`.

### Task 4: Batch 1 gate

- [ ] Apply G1–G6 to `feat/retrofit-japan-latam`. PR title: `feat(study): lettering for Japan and Latin America, and what the retrofit needs`.

---

## Batch 2: Germany and Italy (branch `feat/retrofit-germany-italy`)

Branch from the updated `main`: `git checkout -b feat/retrofit-germany-italy`.

### Task 5: maeusebunker — Mäusebunker (Gerd and Magdalena Hänska, Berlin, 1971–1981)

**Files:** `src/study/themes/germany/maeusebunker.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** no documented lettering → `{ kind: 'none' }`; Barlow and Barlow Condensed stay as a reading (DIN-like grotesques of German signage of the period), stated as a reading. Still → 0 ms (today it uses the engine default, 120 ms).

**Theme questions for R1:** Does any source document lettering or signage on the building (institute name, entrance signs)? If so, its letterforms.

- [ ] Apply R1–R8.

### Task 6: bauhaus-dessau — Bauhaus building (Walter Gropius, Dessau, 1925–1926)

**Files:** `src/study/themes/germany/bauhaus-dessau.ts`, `src/study/fonts.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** the vertical "BAUHAUS" lettering on the building, attributed to Herbert Bayer, installed 1926, constructed sans-serif capitals → kind `lettered`; the theme moves from `system-sans` to a free geometric sans for `display` (and `sans` if one suits running text). Already 0 ms.

**Theme questions for R1:** Who designed the vertical BAUHAUS letters on the Dessau building and when were they installed? Were they reconstructed later (1976, 2006)? Describe the letterforms (geometric construction, stroke, proportions). Primary sources: Stiftung Bauhaus Dessau, Bauhaus-Archiv.

- [ ] Apply R1–R8.

### Task 7: carlton — Carlton bookcase (Ettore Sottsass, Memphis, 1981)

**Files:** `src/study/themes/italy/carlton.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** the object carries no lettering → `{ kind: 'none' }`; the theme may keep `system-sans` (then `substitute` says so and why). An object does not move → 0 ms, replacing today's 200 ms overshoot curve; remove any wording in the ficha that relies on the bounce.

**Theme questions for R1:** Does the Carlton carry any lettering or label? Did Memphis's 1981 catalogue or exhibition graphics use a documented typeface? (Only relevant to `substitute` as a reading; the work itself is the bookcase.)

- [ ] Apply R1–R8.

### Task 8: Batch 2 gate

- [ ] Apply G1–G6. PR title: `feat(study): lettering for Germany and Italy`.

---

## Batch 3: USA desktops, 1981–1995 (branch `feat/retrofit-usa-desktops`)

### Task 9: xerox-star — Xerox 8010 Star (Xerox PARC, 1981)

**Files:** `src/study/themes/usa/xerox-star.ts`, `src/study/fonts.ts`, `src/study/validate.ts`, possibly `xerox-star.motion.css`.

**Hypotheses (verify):** the Star drew its text in Xerox's own bitmap screen fonts (names to establish), with a serif for documents; kind `bitmap`. Likely no documented animation → 0 ms (today 150 ms).

**Theme questions for R1:** Which fonts did the Star's screen and documents use (names, designers if known)? Primary sources: Xerox Star documentation, Johnson et al. "The Xerox Star: A Retrospective" (1989), the Star functional specification. Did any window, icon or menu animate?

- [ ] Apply R1–R8.

### Task 10: mac-os-classic — Mac OS System 7 (Apple, 1991)

**Files:** `src/study/themes/usa/mac-os-classic.ts`, `mac-os-classic.motion.css` (if motion is confirmed), `src/study/fonts.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** Chicago (Susan Kare, 1984, bitmap; TrueType version in System 7) for menus, titles and buttons; Geneva for small text → `bitmap`; the ficha's reading "Chicago has no free version; text is set in the system sans" is replaced. Motion: zooming rectangles when the Finder opens a window; a chosen menu item blinks (count set in a control panel). Map: zoom → `.nbc-dialog[open] .nbc-dialog__panel` (stepped `transform: scale()` from small), blink → none of the hooks fits a menu; do not stretch it onto another control.

**Theme questions for R1:** Primary sources for Chicago and Geneva in System 7 (Inside Macintosh, Macintosh HIG, Kare). For motion: documentation of the Finder's zoom rectangles (how many frames or steps, duration) and of menu blinking (setting, count).

- [ ] Apply R1–R8.

### Task 11: nextstep — NeXTSTEP (NeXT, 1988–1989)

**Files:** `src/study/themes/usa/nextstep.ts`, `src/study/fonts.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** Helvetica throughout the interface, rendered by Display PostScript → `outline`; the substitute is a free grotesque chosen for Helvetica's proportions, with its differences named. Likely no documented animation → 0 ms (today 150 ms).

**Theme questions for R1:** Which typeface did NeXTSTEP's menus, titles and panels use, at what sizes? Primary sources: NeXTSTEP User Interface Guidelines, NeXT documentation. Did windows or panels animate (miniaturize, menus)?

- [ ] Apply R1–R8.

### Task 12: amiga-os — AmigaOS Workbench (Commodore-Amiga, the version the theme reads)

**Files:** `src/study/themes/usa/amiga-os.ts`, `src/study/fonts.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** Topaz, the ROM bitmap font (8 px), kind `bitmap`; DM Mono is replaced by a free pixel face if one matches Topaz's grid, or kept with its differences named. Likely no motion that the hooks can carry (busy pointer, screen dragging) → 0 ms (today 150 ms).

**Theme questions for R1:** Read the theme file to fix the Workbench version it reads. Who designed Topaz and when? Its pixel grid and widths. Did any Workbench element animate in a way one of the hooks can carry?

- [ ] Apply R1–R8.

### Task 13: win95 — Windows 95 (Microsoft, 1995)

**Files:** `src/study/themes/usa/win95.ts`, `win95.motion.css` (if motion is confirmed), `src/study/fonts.ts`, `src/study/validate.ts`. Note `win95.css` is the largest signature (36 lines): it may not hold animation (`lintSignature`).

**Hypotheses (verify):** MS Sans Serif, bitmap, 8 pt, bold in title bars → `bitmap`. Motion: windows animate to and from the taskbar when minimized and maximized (a caption rectangle that travels); the progress bar fills in discrete blocks. Map: caption animation → `.nbc-dialog[open] .nbc-dialog__panel`; blocks belong to a determinate bar, not to the indeterminate hook, so they are only mapped if a source documents an indeterminate state. Button presses are instant: tokens stay 0 ms.

**Theme questions for R1:** Primary sources for MS Sans Serif in Windows 95 (Microsoft's interface guidelines, "The Windows Interface Guidelines for Software Design", 1995). For motion: documentation of the minimize/maximize animation (setting name, what moves, duration) and of the progress bar's blocks.

- [ ] Apply R1–R8.

### Task 14: Batch 3 gate

- [ ] Before G1, confirm the reduced-motion e2e now runs for every theme of this batch with a motion file: `npx playwright test -g "reduced-motion" --list` lists at least one test.
- [ ] Apply G1–G6. PR title: `feat(study): lettering and motion for the American desktops, 1981–1995`.

---

## Batch 4: USA, 2001–2014 (branch `feat/retrofit-usa-2000s`)

### Task 15: win-xp — Windows XP, Luna (Microsoft, 2001)

**Files:** `src/study/themes/usa/win-xp.ts`, `win-xp.motion.css`, `src/study/fonts.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** Tahoma (Matthew Carter) for the interface, Trebuchet MS (Vincent Connare) bold in Luna's title bars → `outline`. Motion: menus and tooltips fade or slide in (visual-effects settings); the marquee progress bar of Common Controls 6. Map: tooltip fade → `.nbc-tooltip:popover-open` (opacity), marquee → `.nbc-progress--indeterminate .nbc-progress__bar` (stepped `background-position` or `transform`, may loop: it is a loader).

**Theme questions for R1:** Primary sources for Tahoma and Trebuchet MS in Luna (Microsoft typography pages, Windows XP guidelines). For motion: the names and behaviour of the fade/slide settings, and the marquee style's blocks and timing.

- [ ] Apply R1–R8.

### Task 16: aqua — Mac OS X Aqua (Apple, 2000–2001)

**Files:** `src/study/themes/usa/aqua.ts`, `aqua.motion.css`, `src/study/fonts.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** Lucida Grande 13 pt (Charles Bigelow and Kris Holmes), already cited in the ficha → `outline`; the substitute is a free humanist sans close to Lucida's open forms and large x-height. Motion: the default button pulses (already cited); sheets slide out of the title bar; the Genie effect. Map: pulse → `.nbc-button--primary` (opacity or background-position, a fixed count, ruling 3); sheet → `.nbc-dialog[open] .nbc-dialog__panel` (translate from the top edge); Genie has no hook.

**Theme questions for R1:** Primary sources for the pulsing default button's rhythm, the sheet's motion and Lucida Grande in the Aqua HIG.

- [ ] Apply R1–R8.

### Task 17: iphone-os — iPhone OS 1 (Apple, 2007)

**Files:** `src/study/themes/usa/iphone-os.ts`, `iphone-os.motion.css`, `src/study/fonts.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** Helvetica (already cited) → `outline`; same Helvetica-proportioned substitute as NeXTSTEP if the dossier supports it. Motion: switches slide; alerts appear by growing into place; "slide to unlock" shines. Map: switch → `.nbc-switch__thumb` (transition `transform`), alert → `.nbc-dialog[open] .nbc-dialog__panel` (scale), the shine has no hook.

**Theme questions for R1:** Primary sources (iPhone Human Interface Guidelines 2008, Apple's 2007 keynote and press pages) for Helvetica on iPhone, the switch, the alert's appearance and their timing.

- [ ] Apply R1–R8.

### Task 18: material-design — Material Design (Google, 2014)

**Files:** `src/study/themes/usa/material-design.ts`, `material-design.css`, `material-design.motion.css`, `src/study/fonts.ts`, `src/study/validate.ts`, `src/study/lint.ts`, `src/study/motion.test.ts`.

**Hypotheses (verify):** Roboto (Christian Robertson; redrawn 2014), loaded as is → `free: true`, `outline`; the theme moves from `system-sans` to Roboto. Motion: the ink ripple from the touch point; the standard curve. Map: ripple → `.nbc-button:active::after` (scale and opacity); elevation stays instant (ruling 4).

**Theme questions for R1:** Primary sources (the 2014 Material Design spec on material.io or its Wayback snapshot) for Roboto, the ripple, the standard curve's values and durations. Roboto's current licence in google/fonts.

- [ ] Apply R1–R8, moving the `transition` out of `material-design.css` (box-shadow is not animatable here; transform goes to the motion file only if the spec documents a translate).
- [ ] **Then signatures lose transitions.** Append to `src/study/motion.test.ts`, in `signatures carry no motion`:

```ts
  it('lintSignature rejects transitions too', () => {
    expect(lintSignature('.nbc-button { transition: transform 1s; }', 's').join('\n')).toMatch(/motion belongs in the motion file/);
    expect(lintSignature('.nbc-button { transition: none; }', 's')).toEqual([]);
  });
```

Run: `npx vitest run src/study/motion.test.ts` — Expected: FAIL. In `lintNoMotion` (`src/study/lint.ts`), change `use.property.includes('animation')` to `/animation|transition/.test(use.property)`. Run again — Expected: PASS; `npm run gen:study` — Expected: passes (no signature transitions remain). Commit with the theme.

### Task 19: Batch 4 gate

- [ ] Apply G1–G6. PR title: `feat(study): lettering and motion for the American interfaces, 2001–2014`.

---

## Batch 5: USA graphic and web, and the close (branch `feat/retrofit-usa-graphic-web`)

### Task 20: whaam — Whaam! (Roy Lichtenstein, 1963)

**Files:** `src/study/themes/usa/whaam.ts`, `src/study/fonts.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** comic-book hand lettering in the caption box and the "WHAAM!" onomatopoeia → `lettered`; a free comic display face for `display` only, body stays readable. A painting does not move → 0 ms (today 100 ms).

**Theme questions for R1:** Primary sources (Tate's catalogue entry, the source panel from *All-American Men of War* #89, 1962) for the lettering: who lettered the source comic, how Lichtenstein redrew it.

- [ ] Apply R1–R8.

### Task 21: classifieds — Craigslist (San Francisco, from 1995)

**Files:** `src/study/themes/usa/classifieds.ts`, `src/study/validate.ts`.

**Hypotheses (verify):** the page set no typeface, so it shows in the browser's default serif → kind `system` with a name such as "The browser's default serif"; `fonts` stays `'system-serif'`. Already 0 ms. The D7 brand rule stands: the theme's name stays "Classifieds".

**Theme questions for R1:** From the Wayback snapshot in `archiveUrl` and later ones: does the HTML set any font (`<font face>`, CSS `font-family`)? Quote the markup.

- [ ] Apply R1–R8.

### Task 22: Lettering becomes required; still works use 0 ms

**Files:**
- Modify: `src/study/types.ts`, `src/study/validate.ts`, `src/study/__fixtures__/fixture.ts`
- Modify: `src/study/lettering.test.ts`, `src/study/study.test.ts`, `src/study/compile.test.ts`, `src/study/validate.test.ts`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: every theme has lettering (Tasks 2–21).
- Produces: `StudyThemeInput.ficha: Ficha & { readonly lettering: Lettering }`; no `LETTERING_PENDING`.

- [ ] **Step 1: Write the failing test**

Append to `src/study/lettering.test.ts`:

```ts
describe('a still work uses 0 ms', () => {
  it('a theme without ficha.motion sets duration and durationSlow to 0', () => {
    expect(problems({ motion: { duration: 120, durationSlow: 220, ease: 'linear' } })).toMatch(/fixture\.motion: the work did not move/);
    expect(problems({ motion: undefined })).toMatch(/fixture\.motion: the work did not move/);
  });
});
```

Run: `npx vitest run src/study/lettering.test.ts` — Expected: FAIL (no such problem).

- [ ] **Step 2: Implement**

`src/study/validate.ts`, in `themeProblems` after the motion coupling check:

```ts
  if (!theme.ficha.motion && (theme.motion?.duration !== 0 || theme.motion?.durationSlow !== 0)) {
    problems.push(`${id}.motion: the work did not move — set duration and durationSlow to 0`);
  }
```

Delete `LETTERING_PENDING` and its uses; `letteringThemeProblems` starts with `if (!ficha.lettering) return [`${id}.ficha.lettering: missing`];` and drops the pending branch. `src/study/types.ts`: `readonly ficha: Ficha & { readonly lettering: Lettering };` in `StudyThemeInput`.

`src/study/__fixtures__/fixture.ts`: add `motion: { duration: 0, durationSlow: 0, ease: 'linear' },` after `elevation`.

`src/study/compile.test.ts:58`: `const tokens = compileTokens({ ...FIXTURE, motion: undefined });` (the engine defaults still apply to themes built outside the study).

`src/study/lettering.test.ts`: delete the tests "a theme without lettering fails, unless its id is pending" and "a pending theme that already has lettering must leave the list"; add

```ts
  it('a theme without lettering fails', () => {
    expect(themeProblems({ ...FIXTURE, ficha: { ...FIXTURE.ficha, lettering: undefined as never } }).join('\n')).toMatch(/fixture\.ficha\.lettering: missing/);
  });
```

and drop `LETTERING_PENDING` from its import; replace `withoutLettering` uses accordingly. `src/study/study.test.ts`: delete the `LETTERING_CEILING` constant and the `lettering pending list` describe, and `LETTERING_PENDING` from the import.

- [ ] **Step 3: Run**

Run: `npx vitest run src && npx tsc -p tsconfig.json && npm run gen:study`
Expected: PASS; `build-study: 16 study theme(s)`. A failure in `validate.test.ts` from the new 0 ms rule on a patch that sets non-zero motion: add `ficha: { ...FIXTURE.ficha, motion: … }`-free expectations by matching with `toMatch` (they already do) — only `toEqual([])` cases with motion need `duration: 0`.

- [ ] **Step 4: Changelog and commit**

`CHANGELOG.md`, under Unreleased / Added: `- Study: the sixteen themes document their work's lettering and load a free face chosen for a stated resemblance; themes whose work moved animate as it did (Mac OS System 7, Windows 95, Windows XP, Aqua, iPhone OS, Material Design, as confirmed), the rest stand still. Every study theme now requires lettering.`

```bash
git add src CHANGELOG.md
git commit -m "feat(study): lettering is required; a still work uses 0 ms

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

### Task 23: Batch 5 gate

- [ ] Apply G1–G6. PR title: `feat(study): lettering for Whaam! and Classifieds; lettering required`.
- [ ] After merge, tell the owner phase 2 is done and that release 1.3.0 waits for phase 3 (spec §7).

---

## Self-review

- **Spec coverage:** §2 phase 2 → Tasks 2–21; §3.1–3.4 applied per theme by R4–R5 (registry, validation, site already from phase 1); §4.1 "Present when the reference animated and a source documents it… Absent for static works. Their motion tokens use 0 ms" → R5 per theme and Task 22's rule; §4.2 motion file rules → R5 and phase 1's lint, plus the loop limit (Task 1); §5.1 the sixteen ids → Tasks 2, 3, 5–7, 9–13, 15–18, 20, 21 (16); §5.3 sources verified → R3 and `check-links`; §6 testing → Task 1 e2e (360 px, reduced motion) and every gate.
- **Placeholders:** the theme tasks carry questions and hypotheses, not prose: the prose depends on research the plan cannot do in advance. Every mechanical step (engine, tools, tests, gates) shows its code and command.
- **Types:** `LetteringFace`, `Lettering.original`, `Lettering.documented?`, `MotionSpecimen`, `LOADERS`, `lintNoMotion`, `check-links` flags `--themes`/`--dossier` match across tasks.
