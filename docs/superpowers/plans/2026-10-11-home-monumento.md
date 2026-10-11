# The home page as a monument — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the docs site's home page with the «Monumento» design: a plate holding a fitted title in the active theme's lettering, a drifting ribbon of every theme that repaints the site, a wall of real components, the work's card with its provenance, and «Llévatelo». Add a phone header with a menu sheet, a slim desktop bar on the home, and an About page for the old home essay.

**Architecture:** New focused files in `src/site/home/` hold the home's pieces. Their pure logic lives in `.ts` files (`works.ts`, `fit.ts`, `drift.ts`) so it can be unit-tested and so `react-refresh/only-export-components` stays clean. Theme switching reuses the existing `useSitePrefs` (View Transition, localStorage, `?theme=`) and loader. Chips paint with the catalog's inline `vars`, exactly like the Archivo's `ThemeCard` islands, and load a `text=` subset of their fonts.

**Tech Stack:** React 19, TypeScript, Vite, Vitest + Testing Library (jsdom), Playwright + axe, plain CSS in `src/site/site.css`.

**Spec:** `docs/superpowers/specs/2026-10-11-home-monumento-design.md`

## Global Constraints

- No new dependency.
- Every new site string goes in `UI` in `src/site/i18n.ts` with both `es` and `en` (enforced by `src/site/i18n.test.ts`). Spanish is neutral Latin American; never voseo.
- Phone means `max-width: 639px`. The slim desktop bar applies from `min-width: 640px`.
- Ribbon drift: 40 px/s. Touch resume: 3000 ms. Chips at least 44 px tall.
- Title cascade: each letter fades and rises 0.2 em, 18 ms apart. None under `prefers-reduced-motion: reduce`.
- Title: `font-family: var(--nbc-font-display)`, `font-weight: var(--nbc-weight-display)`, `font-stretch: 75%`, always upper case.
- Chip fonts come from Google Fonts with `&text=` limited to the chip's label. Never request a subset for a family whose full stylesheet is already loaded.
- Accessibility: one `<h1>` per page; heading levels never skip; axe clean at 360 px and 1280 px; no horizontal page scroll at 360 px.
- Lint runs with `--max-warnings 0`:
  - `react-refresh/only-export-components` is on, so `.tsx` files export components (and constants) only.
  - `eslint-plugin-react-hooks` 7 is on: never call `setState` synchronously in an effect body, and never read a ref during render.
- Commit messages carry **no** `Co-Authored-By` or other attribution lines.
- Commands:
  - one test file: `npx vitest run <path>`;
  - lint: `npm run lint`;
  - types: `npm run typecheck`;
  - everything: `npm run check`;
  - end-to-end: `npx playwright test`.

## Rulings already taken (spec gaps found while planning)

1. **Documentary plate swatches.** A ficha records its palette as `{ origin, note }`, not as a list of colours. The plate therefore shows the theme's own swatch (`entry.swatch`: primary, accent, fg, bg) with hex codes. It labels them with the ficha's palette origin («documentada», «muestreada» or «interpretada») and its note, so it never calls interpreted colours documented.
2. **«Copiar CSS».** The package's `themes/{id}.css` is assembled at build time from many files and is not available in the browser for house themes. The button copies the theme's token rule, built from `loadDetail(entry).tokens`, the same data the theme page's token tables show. The import lines next to it still give the full file.
3. **Room table window.** The USA room has 15 works. The table shows five rows around the active work.
4. **Hidden desktop header on the home** uses `visibility: hidden`, so its links are out of the tab order until it appears.
5. **«Copy buttons are full width» on phones** applies to «Copiar CSS». The code blocks keep their copy icon in their own bar.
6. **`GalleryPiece`** was only used by the old home. It is deleted, with its strings.

## Review Focus

1. A visitor already in a study theme (its full fonts loaded) opens the home. The ribbon must not add a `text=` subset for that family, because a subset declared after the full face would hide every glyph it lacks. The test is in Task 4.
2. A chip whose theme stylesheet fails to load: the site stays in its theme and nothing throws an unhandled rejection. The test is in Task 7.
3. Keyboard users in the ribbon: the duplicate copy is untabbable and hidden, and focus inside the ribbon holds the drift. The tests are in Tasks 6 and 7.
4. Long work data at 360 px: a dark pixel theme (`dragon-quest`) and a long author list (`maeusebunker`) on a phone must pass axe without sideways scroll. The test is in Task 12.
5. A 390×844 phone shows the whole plate, bottom bar included, on its first screen. The test is in Task 12.

---

### Task 1: Shared pieces moved out of the old pages

**Files:**
- Create: `src/site/install.ts`, `src/site/install.test.ts`
- Create: `src/site/study/useNearViewport.ts`
- Create: `src/site/study/PhotoFigure.tsx`, `src/site/study/PhotoFigure.test.tsx`
- Create: `src/site/study/ThemeCard.test.tsx`
- Modify: `src/site/pages/ThemePage.tsx` (drop `installCode` and the image branch of `Figure`)
- Modify: `src/site/pages/StudyHome.tsx` (import `useNearViewport` instead of defining it)
- Modify: `src/site/study/ThemeCard.tsx` (export `Island`, add `withFonts`)
- Modify: `src/site/ThemeSwitcher.tsx` (extract `ModeSelect`), `src/site/ThemeSwitcher.test.tsx`

**Interfaces:**
- Produces:
  - `INSTALL_COMMAND: string` and `installCode(id: string, fonts: boolean): string` from `src/site/install.ts`;
  - `useNearViewport(ref: RefObject<Element | null>): boolean` from `src/site/study/useNearViewport.ts`;
  - `PhotoFigure({ image: ImageCredit; className?: string })`;
  - `Island({ entry: CatalogEntry; className: string; children: ReactNode; withFonts?: boolean })`;
  - `ModeSelect({ mode: ModePref; onChange: (mode: ModePref) => void })` from `src/site/ThemeSwitcher.tsx`.

- [ ] **Step 1: Write the failing tests**

`src/site/install.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { INSTALL_COMMAND, installCode } from './install';

describe('install lines', () => {
  it('installs the package by its name', () => {
    expect(INSTALL_COMMAND).toBe('npm install neobrutalistcomponents');
  });

  it('imports the styles, the theme and its fonts, and names the theme in the provider', () => {
    const code = installCode('dragon-quest', true);
    expect(code).toContain("import 'neobrutalistcomponents/styles.css';");
    expect(code).toContain("import 'neobrutalistcomponents/themes/dragon-quest.css';");
    expect(code).toContain("import 'neobrutalistcomponents/themes/dragon-quest.fonts.css'; // optional: loads the theme’s fonts");
    expect(code).toContain('<NeoProvider theme="dragon-quest">');
  });

  it('says when a theme has no fonts to load', () => {
    expect(installCode('carlton', false)).toContain('// system fonts: nothing to load');
  });
});
```

`src/site/study/PhotoFigure.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LangContext } from '../i18n';
import { PhotoFigure } from './PhotoFigure';

const image = {
  file: 'nakagin.avif',
  width: 1200,
  height: 800,
  alt: { es: 'Las cápsulas de la torre.', en: 'The tower’s capsules.' },
  author: 'Dllu',
  license: 'CC-BY-SA-4.0',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nakagin.jpg',
} as const;

describe('PhotoFigure', () => {
  it('shows the photograph with its author, licence and Commons page', () => {
    render(
      <LangContext value="es">
        <PhotoFigure image={image} className="x" />
      </LangContext>,
    );
    expect(screen.getByRole('img', { name: 'Las cápsulas de la torre.' })).toBeInTheDocument();
    expect(screen.getByText(/Foto: Dllu/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CC BY-SA 4.0' })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-sa/4.0/');
    expect(screen.getByRole('link', { name: 'Wikimedia Commons' })).toHaveAttribute('href', image.sourceUrl);
  });

  it('renders nothing when the file is not in the build', () => {
    const { container } = render(
      <LangContext value="es">
        <PhotoFigure image={{ ...image, file: 'missing.avif' }} />
      </LangContext>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
```

`src/site/study/ThemeCard.test.tsx`:
```tsx
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SitePrefsContext } from '../prefsContext';
import { ENTRIES } from './data';
import { Island } from './ThemeCard';

const fontLinks = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[data-nbc-fonts]')].map((link) => link.href);
const ctx = { prefs: { theme: 'classic', mode: 'native' as const }, update: () => undefined };
const show = (id: string, withFonts?: boolean) =>
  render(
    <SitePrefsContext value={ctx}>
      <Island entry={ENTRIES.get(id)!} className="x" withFonts={withFonts}>
        <span>chip</span>
      </Island>
    </SitePrefsContext>,
  );

afterEach(() => {
  for (const link of document.head.querySelectorAll('link')) link.remove();
});

describe('Island', () => {
  it('paints with the catalog tokens and leaves the fonts alone when told to', () => {
    const { container } = show('dragon-quest', false);
    expect(container.firstElementChild).toHaveAttribute('data-theme', 'dragon-quest');
    expect(fontLinks()).toEqual([]);
  });

  it('loads the theme’s full fonts by default', () => {
    show('win95');
    expect(fontLinks()).toEqual([ENTRIES.get('win95')!.fontsHref]);
  });
});
```
(jsdom has no `IntersectionObserver`, so an island loads its fonts at once. `dragon-quest` and `win95` share a font URL, so the first test must not have loaded it. That is why the second test checks `win95` after `dragon-quest` loaded nothing.)

Add to `src/site/ThemeSwitcher.test.tsx`:
```tsx
import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ModeSelect } from './ThemeSwitcher';

describe('ModeSelect', () => {
  it('reports the scheme the visitor picks', () => {
    const onChange = vi.fn();
    render(
      <LangContext value="es">
        <ModeSelect mode="native" onChange={onChange} />
      </LangContext>,
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Esquema de color' }), { target: { value: 'dark' } });
    expect(onChange).toHaveBeenCalledWith('dark');
  });
});
```
(Merge the imports into the file's existing import lines.)

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/site/install.test.ts src/site/study/PhotoFigure.test.tsx src/site/study/ThemeCard.test.tsx src/site/ThemeSwitcher.test.tsx`
Expected: FAIL.
- The first two files fail to import (`./install` and `./PhotoFigure` do not exist).
- `ThemeCard.test.tsx` fails because `Island` is not exported.
- `ThemeSwitcher.test.tsx` fails because `ModeSelect` is not exported.

- [ ] **Step 3: Implement**

`src/site/install.ts`:
```ts
import { PACKAGE } from '../docs/guide';

/** The shell command that installs the library. */
export const INSTALL_COMMAND = `npm install ${PACKAGE}`;

/** A theme's import lines and provider, as the theme page and the home show them. */
export const installCode = (id: string, fonts: boolean) => `import { NeoProvider } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/${id}.css';
import 'neobrutalistcomponents/themes/${id}.fonts.css'; // ${fonts ? 'optional: loads the theme’s fonts' : 'system fonts: nothing to load'}

export function App() {
  return <NeoProvider theme="${id}">{/* your app */}</NeoProvider>;
}`;
```
In `src/site/pages/ThemePage.tsx`, delete the local `installCode` constant and add `import { installCode } from '../install';`.

`src/site/study/useNearViewport.ts`: move the `useNearViewport` function out of `src/site/pages/StudyHome.tsx` unchanged, with its imports:
```ts
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/** True once the element is within a screen's height of the viewport; at once where IntersectionObserver is missing. */
export function useNearViewport(ref: RefObject<Element | null>): boolean {
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    const element = ref.current;
    if (near || !element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: '100% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near, ref]);
  return near;
}
```
In `StudyHome.tsx`, delete the local definition and import it from `'../study/useNearViewport'`. Drop `useState` and `RefObject` from its React imports if nothing else uses them.

`src/site/study/PhotoFigure.tsx`:
```tsx
import type { ImageCredit } from '../../study/types';
import { useLang, useT } from '../i18n';
import { imageUrl } from './detail';
import { LICENSE_URLS, licenseName } from './format';

/** A work's free photograph with its credit: author, licence and Commons page. Nothing when the file is not in the build. */
export function PhotoFigure({ image, className }: { image: ImageCredit; className?: string }) {
  const lang = useLang();
  const t = useT();
  const url = imageUrl(image.file);
  if (!url) return null;
  return (
    <figure className={className}>
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
```
In `ThemePage.tsx`, replace `Figure` with:
```tsx
function Figure({ detail }: { detail: ThemeDetail }) {
  const t = useT();
  const { image, archiveUrl, sources } = detail.reference;
  if (image && imageUrl(image.file)) return <PhotoFigure image={image} className="site-themepage__figure" />;
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
```
Add `import { PhotoFigure } from '../study/PhotoFigure';`. Remove `LICENSE_URLS` and `licenseName` from the `../study/format` import if nothing else in the file uses them.

In `src/site/study/ThemeCard.tsx`:
- Change the hook to take the href:
  ```tsx
  /** Loads a fonts stylesheet once its island comes near the viewport. */
  function useFontsNearViewport(ref: RefObject<HTMLElement | null>, href: string | null) {
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
  ```
- Make `Island` exported and give it `withFonts`:
  ```tsx
  /**
   * A theme's own island: study themes paint with their catalog tokens set
   * inline, so no stylesheet is fetched; core themes are always loaded.
   * `withFonts={false}` leaves font loading to the caller (the home's ribbon loads subsets).
   */
  export function Island({ entry, className, children, withFonts = true }: { entry: CatalogEntry; className: string; children: ReactNode; withFonts?: boolean }) {
    const { prefs } = useSitePrefsContext();
    const ref = useRef<HTMLElement>(null);
    useFontsNearViewport(ref, withFonts && !entry.predatesStudy ? entry.fontsHref : null);
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
  ```

In `src/site/ThemeSwitcher.tsx`, extract the select:
```tsx
/** The colour-scheme select: the theme's own scheme, light, dark or the system's. */
export function ModeSelect({ mode, onChange }: { mode: ModePref; onChange: (mode: ModePref) => void }) {
  const t = useT();
  return (
    <label className="site-switcher__mode">
      <span className="site-visually-hidden">{t('colorScheme')}</span>
      <select value={mode} onChange={(e) => onChange(e.target.value as ModePref)}>
        {MODES.map((m) => (
          <option key={m.value} value={m.value}>
            {t(m.label)}
          </option>
        ))}
      </select>
    </label>
  );
}
```
In `ThemeSwitcher`, replace the `<label className="site-switcher__mode">…</label>` block with `<ModeSelect mode={prefs.mode} onChange={(mode) => onChange({ mode })} />`.

- [ ] **Step 4: Run them to see them pass**

Run: `npx vitest run src/site/install.test.ts src/site/study/PhotoFigure.test.tsx src/site/study/ThemeCard.test.tsx src/site/ThemeSwitcher.test.tsx src/site/pages/StudyHome.test.tsx`
Expected: PASS. The old home test still passes, because only the hook moved.

- [ ] **Step 5: Lint, types, commit**

Run: `npm run lint && npm run typecheck`
Expected: no output from eslint and no errors.
```bash
git add src/site/install.ts src/site/install.test.ts src/site/study/useNearViewport.ts src/site/study/PhotoFigure.tsx src/site/study/PhotoFigure.test.tsx src/site/study/ThemeCard.tsx src/site/study/ThemeCard.test.tsx src/site/pages/ThemePage.tsx src/site/pages/StudyHome.tsx src/site/ThemeSwitcher.tsx src/site/ThemeSwitcher.test.tsx
git commit -m "refactor(site): share the install lines, the photo credit, theme islands and the scheme select"
```

---

### Task 2: CodeBlock copies in the page's language and selects itself when the clipboard fails

**Files:**
- Modify: `src/site/docs/CodeBlock.tsx`
- Create: `src/site/docs/CodeBlock.test.tsx`

**Interfaces:**
- Produces: `CodeBlock({ code: string; label?: string; copyLabel?: string; copiedLabel?: string; selectLabel?: string })`. The defaults keep today's English labels: `Copy ${label.toLowerCase()}`, `Copied`, `Select and copy`.

- [ ] **Step 1: Write the failing test**

`src/site/docs/CodeBlock.test.tsx`:
```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';

const setClipboard = (value: unknown) => Object.defineProperty(navigator, 'clipboard', { value, configurable: true });

afterEach(() => {
  setClipboard(undefined);
});

describe('CodeBlock', () => {
  it('copies the code and says so in the labels it was given', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    render(<CodeBlock code="npm install x" label="Shell" copyLabel="Copiar Shell" copiedLabel="Copiado" selectLabel="Selecciona y copia" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copiar Shell' }));
    expect(await screen.findByRole('button', { name: 'Copiado' })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith('npm install x');
  });

  it('selects its own text and asks to copy by hand when the clipboard is unavailable', async () => {
    setClipboard(undefined);
    render(<CodeBlock code="npm install x" label="Shell" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy shell' }));
    expect(await screen.findByRole('button', { name: 'Select and copy' })).toHaveTextContent('Select and copy');
    expect(window.getSelection()?.toString()).toBe('npm install x');
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/site/docs/CodeBlock.test.tsx`
Expected: FAIL. The first test finds no button named «Copiar Shell». The second finds no «Select and copy».

- [ ] **Step 3: Implement**

Replace `src/site/docs/CodeBlock.tsx` with:
```tsx
import { useMemo, useRef, useState } from 'react';
import { Button } from 'neobrutalistcomponents';
import { Check, Copy } from 'lucide-react';
import { highlight } from './highlight';

interface CodeBlockProps {
  code: string;
  label?: string;
  /** Accessible name of the copy button; English by default. */
  copyLabel?: string;
  copiedLabel?: string;
  /** Shown when the clipboard refuses: the code is selected for the visitor to copy. */
  selectLabel?: string;
}

export function CodeBlock({ code, label = 'Code', copyLabel, copiedLabel = 'Copied', selectLabel = 'Select and copy' }: CodeBlockProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const pre = useRef<HTMLPreElement>(null);
  const tokens = useMemo(() => highlight(code.trim()), [code]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.trim());
      setState('copied');
      setTimeout(() => setState('idle'), 1600);
    } catch {
      if (pre.current) window.getSelection()?.selectAllChildren(pre.current);
      setState('failed');
    }
  }

  const name = state === 'copied' ? copiedLabel : state === 'failed' ? selectLabel : (copyLabel ?? `Copy ${label.toLowerCase()}`);

  return (
    <div className="site-code">
      <div className="site-code__bar">
        <span className="site-code__label">{label}</span>
        <Button size="sm" variant="ghost" leftIcon={state === 'copied' ? <Check /> : <Copy />} onClick={copy} aria-label={name}>
          {state === 'failed' ? selectLabel : null}
        </Button>
      </div>
      <pre ref={pre} className="site-code__pre" tabIndex={0}>
        <code>
          {tokens.map((t, i) =>
            t.kind === 'plain' ? (
              t.text
            ) : (
              <span key={i} className={`tok-${t.kind}`}>
                {t.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
```
(`navigator.clipboard` undefined throws a `TypeError` inside `try`, which is the failure path.)

- [ ] **Step 4: Run it to see it pass**

Run: `npx vitest run src/site/docs`
Expected: PASS, including the existing docs tests.

- [ ] **Step 5: Commit**

```bash
git add src/site/docs/CodeBlock.tsx src/site/docs/CodeBlock.test.tsx
git commit -m "feat(site): code blocks copy in the page's language and select themselves when the clipboard fails"
```

---

### Task 3: The About page holds the home's essay

**Files:**
- Modify: `src/site/router.ts`, `src/site/router.test.ts`
- Modify: `src/site/App.tsx`, `src/site/App.test.tsx`
- Modify: `src/site/Shell.tsx` (footer link)
- Modify: `src/site/i18n.ts`
- Create: `src/site/pages/About.tsx`

**Interfaces:**
- Produces:
  - `Route` gains `{ name: 'about' }`, and `routeOf('/about')` returns it;
  - `UI.titleAbout`.

- [ ] **Step 1: Write the failing tests**

In `src/site/router.test.ts`, add a row to the `routeOf` table:
```ts
    ['/about', { name: 'about' }],
```
In `src/site/App.test.tsx`, add inside `describe('App', …)`:
```tsx
  it('serves the gallery essay at /about, with its own title', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    replaceHash('#/es/about');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Sobre la galería' })).toBeInTheDocument();
    expect(document.title).toBe('Sobre la galería — neobrutalistcomponents');
    expect(await screen.findByRole('heading', { level: 2, name: 'De dónde viene el nombre' })).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/site/router.test.ts src/site/App.test.tsx`
Expected: FAIL. `/about` parses as `not-found`, and there is no heading «Sobre la galería».

- [ ] **Step 3: Implement**

`src/site/router.ts`:
- Add `| { name: 'about' }` to the `Route` union, after `{ name: 'credits' }`.
- Add `'/about': { name: 'about' },` to `SIMPLE`.

`src/site/i18n.ts`, under `// Page titles`:
```ts
  titleAbout: { es: 'Sobre la galería', en: 'About the gallery' },
```

`src/site/pages/About.tsx`:
```tsx
import { useT } from '../i18n';
import { Essay } from '../study/Essay';

/** The gallery's essay, which used to open the home page. */
export function About() {
  const t = useT();
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleAbout')}</h1>
        <p className="site-lead">{t('studyLead')}</p>
      </header>
      <Essay slug="home" />
    </div>
  );
}
```

`src/site/App.tsx`:
- Add `import { About } from './pages/About';`.
- In `Page`, add `case 'about': return <About />;` after the `credits` case.
- In `TITLES`, add `about: 'titleAbout',`.

`src/site/Shell.tsx`, in the footer `<nav>`, add before the Credits link:
```tsx
          <a href={toHash(lang, '/about')}>{t('titleAbout')}</a>
```

- [ ] **Step 4: Run them to see them pass**

Run: `npx vitest run src/site/router.test.ts src/site/App.test.tsx src/site/i18n.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/site/router.ts src/site/router.test.ts src/site/App.tsx src/site/App.test.tsx src/site/Shell.tsx src/site/i18n.ts src/site/pages/About.tsx
git commit -m "feat(site): an About page for the gallery essay"
```

---

### Task 4: What the home says about the works (pure helpers) and font subsets

**Files:**
- Create: `src/site/home/works.ts`, `src/site/home/works.test.ts`
- Modify: `src/site/study/loader.ts`, `src/site/study/loader.test.ts`
- Modify: `src/site/i18n.ts`, `src/site/i18n.test.ts`

**Interfaces:**
- Produces, from `src/site/home/works.ts`:
  - `ribbonOrder(catalog: readonly CatalogEntry[]): CatalogEntry[]`
  - `chipLabel(entry: CatalogEntry, lang: Lang, use: string): string`
  - `formatAuthors(authors: readonly string[], lang: Lang, anonymous: string): string`
  - `interface RoomRow { readonly entry: CatalogEntry; readonly current: boolean }`
  - `roomRows(active: CatalogEntry, catalog: readonly CatalogEntry[], size?: number): RoomRow[]`
  - `tokensCss(id: string, tokens: ReadonlyMap<string, string>): string`
- Produces, from `src/site/study/loader.ts`:
  - `subsetFontsHref(href: string, text: string): string`
  - `loadFontSubset(href: string | null | undefined, text: string): void`
- Produces, from `src/site/i18n.ts`:
  - `fill(template: string, values: Readonly<Record<string, string>>): string`
  - `sourceCount(lang: Lang, n: number): string`

- [ ] **Step 1: Write the failing tests**

`src/site/home/works.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { NEO_THEMES } from 'neobrutalistcomponents';
import { CATALOG, ENTRIES } from '../study/data';
import { startYear } from '../study/format';
import { chipLabel, formatAuthors, ribbonOrder, roomRows, tokensCss } from './works';

const entry = (id: string) => ENTRIES.get(id)!;

describe('ribbonOrder', () => {
  it('puts the house themes first, then every work from the oldest', () => {
    const order = ribbonOrder(CATALOG);
    expect(order).toHaveLength(CATALOG.length);
    expect(order.slice(0, NEO_THEMES.length).map((e) => e.id)).toEqual([...NEO_THEMES]);
    expect(order[NEO_THEMES.length].id).toBe('loteria');
    const starts = order.slice(NEO_THEMES.length).map((e) => startYear(e.reference.date));
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});

describe('chipLabel', () => {
  it('names the work, its years and what the chip does', () => {
    expect(chipLabel(entry('dragon-quest'), 'es', 'usar este tema')).toBe('Dragon Quest, 1986: usar este tema');
    expect(chipLabel(entry('nakagin'), 'en', 'use this theme')).toBe('Nakagin, 1970–1972: use this theme');
  });

  it('gives a house theme no year', () => {
    expect(chipLabel(entry('classic'), 'en', 'use this theme')).toBe('Classic: use this theme');
  });
});

describe('formatAuthors', () => {
  it('lists one or two authors, then «y equipo» / «and team»', () => {
    expect(formatAuthors(['Kisho Kurokawa'], 'es', '—')).toBe('Kisho Kurokawa');
    expect(formatAuthors(['Otl Aicher', 'Gerhard Joksch'], 'es', '—')).toBe('Otl Aicher y Gerhard Joksch');
    expect(formatAuthors(['Otl Aicher', 'Gerhard Joksch'], 'en', '—')).toBe('Otl Aicher and Gerhard Joksch');
    expect(formatAuthors(entry('dragon-quest').reference.authors, 'es', '—')).toBe('Yuji Horii, Koichi Nakamura y equipo');
    expect(formatAuthors(entry('dragon-quest').reference.authors, 'en', '—')).toBe('Yuji Horii, Koichi Nakamura and team');
  });

  it('names an anonymous work with the text it is given', () => {
    expect(formatAuthors([], 'es', 'Anónimo / vernáculo')).toBe('Anónimo / vernáculo');
  });
});

describe('roomRows', () => {
  it('shows five works of the room around the active one', () => {
    const rows = roomRows(entry('win95'), CATALOG);
    expect(rows.map((row) => row.entry.id)).toEqual(['win31', 'classifieds', 'win95', 'palm-os', 'aqua']);
    expect(rows.filter((row) => row.current).map((row) => row.entry.id)).toEqual(['win95']);
  });

  it('starts at the room’s first work and stops at its last', () => {
    expect(roomRows(entry('lettera-22'), CATALOG).map((row) => row.entry.id)).toEqual(['lettera-22', 'carlton']);
  });

  it('gives a house theme the oldest work of each room', () => {
    const rows = roomRows(entry('classic'), CATALOG);
    expect(rows.map((row) => row.entry.id)).toEqual(['tokyo-1964', 'bauhaus-dessau', 'whaam', 'loteria', 'lettera-22']);
    expect(rows.some((row) => row.current)).toBe(false);
  });
});

describe('tokensCss', () => {
  it('writes the tokens as one rule scoped like NeoProvider scopes a theme', () => {
    const css = tokensCss('nakagin', new Map([['--nbc-bg', '#d9d8d3'], ['--nbc-fg', '#16181b']]));
    expect(css).toBe("[data-theme='nakagin'] {\n  --nbc-bg: #d9d8d3;\n  --nbc-fg: #16181b;\n}\n");
  });
});
```

Add to `src/site/study/loader.test.ts` (merge the import):
```ts
import { loadFontSubset, subsetFontsHref } from './loader';

describe('font subsets', () => {
  it('asks Google Fonts for the label’s glyphs only, in both cases', () => {
    expect(subsetFontsHref('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap', 'Dragon')).toBe(
      'https://fonts.googleapis.com/css2?family=DotGothic16&display=swap&text=DragonRAGONd',
    );
  });

  it('adds a subset while the full family is not loaded', () => {
    loadFontSubset('https://fonts.googleapis.com/css2?family=Subset+One&display=swap', 'Ab');
    expect(links('link[data-nbc-fonts]').map((link) => link.href)).toEqual([
      'https://fonts.googleapis.com/css2?family=Subset+One&display=swap&text=AbBa',
    ]);
  });

  it('never adds a subset after the full family, whose glyphs it would hide', () => {
    const full = 'https://fonts.googleapis.com/css2?family=Subset+Two&display=swap';
    loadFonts(full);
    loadFontSubset(full, 'Ab');
    expect(links('link[data-nbc-fonts]').map((link) => link.href)).toEqual([full]);
  });
});
```

Add to `src/site/i18n.test.ts` (merge the import of `fill` and `sourceCount`):
```ts
describe('fill and sourceCount', () => {
  it('fills named slots and leaves unknown ones as written', () => {
    expect(fill('Colgar {name}', { name: 'Nakagin' })).toBe('Colgar Nakagin');
    expect(fill('Sala {room}', {})).toBe('Sala {room}');
  });

  it('counts sources in both languages', () => {
    expect([sourceCount('es', 1), sourceCount('es', 4), sourceCount('en', 1), sourceCount('en', 4)]).toEqual(['1 fuente', '4 fuentes', '1 source', '4 sources']);
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/site/home/works.test.ts src/site/study/loader.test.ts src/site/i18n.test.ts`
Expected: FAIL. `./works` does not exist. `loadFontSubset`, `subsetFontsHref`, `fill` and `sourceCount` are not exported.

- [ ] **Step 3: Implement**

`src/site/home/works.ts`:
```ts
/** What the home says about the catalog's works. Pure: no React, no DOM. */
import type { CatalogEntry } from '../../study/catalog';
import { THEME_SCENES } from '../../study/types';
import type { Lang } from '../../study/types';
import { startYear, years } from '../study/format';

const byYear = (a: CatalogEntry, b: CatalogEntry) => startYear(a.reference.date) - startYear(b.reference.date) || (a.id < b.id ? -1 : 1);

/** The ribbon's order: the house themes as the catalog lists them, then the study's works from the oldest. */
export function ribbonOrder(catalog: readonly CatalogEntry[]): CatalogEntry[] {
  return [...catalog.filter((entry) => entry.predatesStudy), ...catalog.filter((entry) => !entry.predatesStudy).sort(byYear)];
}

/** A chip's accessible name: 'Dragon Quest, 1986: usar este tema'. House themes carry no year. */
export function chipLabel(entry: CatalogEntry, lang: Lang, use: string): string {
  const name = entry.name[lang];
  return entry.predatesStudy ? `${name}: ${use}` : `${name}, ${years(entry.reference.date)}: ${use}`;
}

/** One or two authors by name; from three on, the first two and «y equipo» / «and team». */
// ponytail: Spanish «y» never turns into «e» before an i- sound; no author in the catalog needs it yet.
export function formatAuthors(authors: readonly string[], lang: Lang, anonymous: string): string {
  const and = lang === 'es' ? 'y' : 'and';
  if (authors.length === 0) return anonymous;
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} ${and} ${authors[1]}`;
  return `${authors[0]}, ${authors[1]} ${lang === 'es' ? 'y equipo' : 'and team'}`;
}

export interface RoomRow {
  readonly entry: CatalogEntry;
  readonly current: boolean;
}

/**
 * The works the wall's table lists: `size` works of the active work's room, by date, around the
 * active one. A house theme has no room, so it gets the oldest work of each room.
 */
export function roomRows(active: CatalogEntry, catalog: readonly CatalogEntry[], size = 5): RoomRow[] {
  const works = catalog.filter((entry) => !entry.predatesStudy);
  if (active.predatesStudy) {
    return THEME_SCENES.flatMap((scene) => {
      const oldest = works.filter((entry) => entry.scene === scene).sort(byYear)[0];
      return oldest ? [{ entry: oldest, current: false }] : [];
    });
  }
  const room = works.filter((entry) => entry.scene === active.scene).sort(byYear);
  const at = room.findIndex((entry) => entry.id === active.id);
  const start = Math.max(0, Math.min(at - Math.floor(size / 2), room.length - size));
  return room.slice(start, start + size).map((entry) => ({ entry, current: entry.id === active.id }));
}

/** A theme's tokens as one CSS rule, scoped the way NeoProvider applies a theme. */
export function tokensCss(id: string, tokens: ReadonlyMap<string, string>): string {
  const lines = [...tokens].map(([name, value]) => `  ${name}: ${value};`);
  return `[data-theme='${id}'] {\n${lines.join('\n')}\n}\n`;
}
```

In `src/site/study/loader.ts`, after `loadFonts`:
```ts
/** A Google Fonts stylesheet limited to the glyphs of `text`, upper and lower case included. */
export function subsetFontsHref(href: string, text: string): string {
  const glyphs = [...new Set([...text, ...text.toUpperCase(), ...text.toLowerCase()])].join('');
  return `${href}${href.includes('?') ? '&' : '?'}text=${encodeURIComponent(glyphs)}`;
}

/**
 * Loads only the glyphs a label needs, unless the full family is already in the page: an
 * @font-face declared after the full one, with the same family, would hide the glyphs it lacks.
 */
export function loadFontSubset(href: string | null | undefined, text: string): void {
  if (!href || fontLinks.has(href)) return;
  loadFonts(subsetFontsHref(href, text));
}
```

In `src/site/i18n.ts`:
- After `workCount`, add:
  ```ts
  export function sourceCount(lang: Lang, n: number): string {
    if (lang === 'es') return n === 1 ? '1 fuente' : `${n} fuentes`;
    return n === 1 ? '1 source' : `${n} sources`;
  }

  /** 'Colgar {name}' with { name: 'Nakagin' } → 'Colgar Nakagin'. A slot without a value stays as written. */
  export function fill(template: string, values: Readonly<Record<string, string>>): string {
    return template.replace(/\{(\w+)\}/g, (slot, key: string) => values[key] ?? slot);
  }
  ```

- [ ] **Step 4: Run them to see them pass**

Run: `npx vitest run src/site/home/works.test.ts src/site/study/loader.test.ts src/site/i18n.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/site/home/works.ts src/site/home/works.test.ts src/site/study/loader.ts src/site/study/loader.test.ts src/site/i18n.ts src/site/i18n.test.ts
git commit -m "feat(site): the home's view of the works, and font subsets that never hide a loaded family"
```

---

### Task 5: The fitted title

**Files:**
- Create: `src/site/home/fit.ts`, `src/site/home/fit.test.ts`
- Create: `src/site/home/useMediaQuery.ts`
- Create: `src/site/home/FitTitle.tsx`, `src/site/home/FitTitle.test.tsx`

**Interfaces:**
- Produces:
  - `type TitleLayout = 'wide' | 'phone'`
  - `interface TitleLine { readonly text: string; readonly fit: boolean }`
  - `TITLE_LINES: Record<Lang, Record<TitleLayout, readonly TitleLine[]>>`
  - `fitSizes(widthsAt100: readonly number[], fits: readonly boolean[], available: number): number[]`
  - `useMediaQuery(query: string): boolean`
  - `FitTitle({ lines: readonly TitleLine[]; label: string; className?: string })`, which renders the page's `<h1>`.

- [ ] **Step 1: Write the failing tests**

`src/site/home/fit.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { TITLE_LINES, fitSizes } from './fit';

describe('fitSizes', () => {
  it('sizes each fitted line to fill the width, from its width at 100 px', () => {
    expect(fitSizes([500, 250], [true, true], 1000)).toEqual([200, 400]);
  });

  it('gives a connector line the smallest fitted size', () => {
    expect(fitSizes([400, 100, 500], [true, false, true], 1000)).toEqual([250, 200, 200]);
  });

  it('rounds down to a tenth of a pixel, so a line never overflows', () => {
    expect(fitSizes([300], [true], 1000)).toEqual([333.3]);
  });

  it('leaves unmeasured lines at 0, for CSS to size', () => {
    expect(fitSizes([0, 0], [true, true], 1000)).toEqual([0, 0]);
  });
});

describe('TITLE_LINES', () => {
  it('reads the gallery’s name in both layouts and languages', () => {
    for (const lang of ['es', 'en'] as const) {
      expect(TITLE_LINES[lang].wide.map((line) => line.text).join(' ')).toBe(TITLE_LINES[lang].phone.map((line) => line.text).join(' '));
    }
    expect(TITLE_LINES.es.wide.map((line) => line.text)).toEqual(['Galería de las', 'Interfaces']);
    expect(TITLE_LINES.en.phone.map((line) => line.fit)).toEqual([true, false, true]);
  });
});
```

`src/site/home/FitTitle.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FitTitle } from './FitTitle';
import { TITLE_LINES } from './fit';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('FitTitle', () => {
  it('is one h1 named by its label; the letters are hidden from assistive technology', () => {
    render(<FitTitle lines={TITLE_LINES.es.wide} label="Galería de las Interfaces" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Galería de las Interfaces' })).toBeInTheDocument();
    expect(document.querySelectorAll('.fit-title__line')).toHaveLength(2);
    expect(document.querySelector('.fit-title__line')?.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets each line’s size from its measured width, the connector at the smaller size', () => {
    const at100: Record<string, number> = { 'Galería': 400, 'de las': 100, Interfaces: 500 };
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return { width: at100[this.textContent ?? ''] ?? 0 } as DOMRect;
    });
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(1000);
    render(<FitTitle lines={TITLE_LINES.es.phone} label="Galería de las Interfaces" />);
    const sizes = [...document.querySelectorAll<HTMLElement>('.fit-title__line')].map((line) => line.style.fontSize);
    expect(sizes).toEqual(['250px', '200px', '200px']);
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/site/home/fit.test.ts src/site/home/FitTitle.test.tsx`
Expected: FAIL, because `./fit` and `./FitTitle` do not exist.

- [ ] **Step 3: Implement**

`src/site/home/fit.ts`:
```ts
import type { Lang } from '../../study/types';

export type TitleLayout = 'wide' | 'phone';

/** A line of the home's title. A fitted line fills the width; a connector («DE LAS») is set at the smallest fitted size. */
export interface TitleLine {
  readonly text: string;
  readonly fit: boolean;
}

export const TITLE_LINES: Record<Lang, Record<TitleLayout, readonly TitleLine[]>> = {
  es: {
    wide: [
      { text: 'Galería de las', fit: true },
      { text: 'Interfaces', fit: true },
    ],
    phone: [
      { text: 'Galería', fit: true },
      { text: 'de las', fit: false },
      { text: 'Interfaces', fit: true },
    ],
  },
  en: {
    wide: [
      { text: 'Gallery of', fit: true },
      { text: 'Interfaces', fit: true },
    ],
    phone: [
      { text: 'Gallery', fit: true },
      { text: 'of', fit: false },
      { text: 'Interfaces', fit: true },
    ],
  },
};

/** Font sizes in px from each line's width at 100 px: fitted lines fill `available`, connectors take the smallest fitted size. */
export function fitSizes(widthsAt100: readonly number[], fits: readonly boolean[], available: number): number[] {
  const fitted = widthsAt100.map((width) => (width > 0 ? Math.floor(((100 * available) / width) * 10) / 10 : 0));
  const sized = fitted.filter((size, i) => fits[i] && size > 0);
  const smallest = sized.length ? Math.min(...sized) : 0;
  return fitted.map((size, i) => (fits[i] ? size : smallest));
}
```

`src/site/home/useMediaQuery.ts`:
```ts
import { useCallback, useSyncExternalStore } from 'react';

/** Whether a media query matches, kept in sync; false where matchMedia is missing (tests). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window.matchMedia !== 'function') return () => undefined;
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
    () => false,
  );
}
```

`src/site/home/FitTitle.tsx`:
```tsx
import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { fitSizes } from './fit';
import type { TitleLine } from './fit';

/**
 * The page's h1 as poster lines. Each line is measured at 100 px and set to fill the title's width,
 * again on resize and whenever fonts finish loading. Letters are spans so they can cascade in;
 * screen readers get the plain label instead.
 */
export function FitTitle({ lines, label, className }: { lines: readonly TitleLine[]; label: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const title = ref.current;
    if (!title) return;
    const fit = () => {
      const spans = [...title.querySelectorAll<HTMLElement>('.fit-title__line')];
      for (const span of spans) span.style.fontSize = '100px';
      const widths = spans.map((span) => span.getBoundingClientRect().width);
      const sizes = fitSizes(widths, spans.map((span) => span.dataset.fit === 'true'), title.clientWidth);
      spans.forEach((span, i) => {
        span.style.fontSize = sizes[i] > 0 ? `${sizes[i]}px` : '';
      });
    };
    fit();
    // A window resize, not a ResizeObserver on the title: fitting changes the title's height, and
    // observing it would report a loop.
    window.addEventListener('resize', fit);
    const fonts = typeof document.fonts === 'undefined' ? null : document.fonts;
    fonts?.addEventListener('loadingdone', fit);
    void fonts?.ready.then(fit);
    return () => {
      window.removeEventListener('resize', fit);
      fonts?.removeEventListener('loadingdone', fit);
    };
  }, [lines]);

  const starts = lines.map((_, i) => lines.slice(0, i).reduce((count, line) => count + [...line.text].length, 0));

  return (
    <h1 ref={ref} className={className ? `fit-title ${className}` : 'fit-title'}>
      <span className="site-visually-hidden">{label}</span>
      <span aria-hidden="true">
        {lines.map((line, i) => (
          <span key={line.text} className={line.fit ? 'fit-title__line' : 'fit-title__line fit-title__line--joint'} data-fit={String(line.fit)}>
            {[...line.text].map((char, j) => (
              <span key={j} className="fit-title__char" style={{ '--i': starts[i] + j } as CSSProperties}>
                {char === ' ' ? ' ' : char}
              </span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}
```

- [ ] **Step 4: Run them to see them pass**

Run: `npx vitest run src/site/home/fit.test.ts src/site/home/FitTitle.test.tsx`
Expected: PASS.

- [ ] **Step 5: Lint and commit**

Run: `npm run lint`
Expected: no output.
```bash
git add src/site/home/fit.ts src/site/home/fit.test.ts src/site/home/useMediaQuery.ts src/site/home/FitTitle.tsx src/site/home/FitTitle.test.tsx
git commit -m "feat(site): a title whose lines are fitted to the width, in the theme's display face"
```

---

### Task 6: The ribbon of themes

**Files:**
- Create: `src/site/home/drift.ts`, `src/site/home/drift.test.ts`
- Create: `src/site/home/ThemeRibbon.tsx`, `src/site/home/ThemeRibbon.test.tsx`
- Modify: `src/site/i18n.ts`

**Interfaces:**
- Consumes:
  - `ribbonOrder`, `chipLabel` (Task 4);
  - `loadFontSubset` (Task 4);
  - `Island` with `withFonts` (Task 1).
- Produces:
  - `DRIFT_SPEED = 40`, `TOUCH_RESUME_MS = 3000`
  - `nextScroll(left: number, elapsedMs: number, loopWidth: number, speed?: number): number`
  - `interface DriftHold { hover: boolean; focus: boolean; touchUntil: number; hidden: boolean; reduced: boolean }`
  - `isHeld(hold: DriftHold, now: number): boolean`
  - `ThemeRibbon({ active: string; onPick: (id: string) => void })`
  - `UI.ribbonLabel`, `UI.useTheme`

- [ ] **Step 1: Write the failing tests**

`src/site/home/drift.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { isHeld, nextScroll } from './drift';

const free = { hover: false, focus: false, touchUntil: 0, hidden: false, reduced: false };

describe('nextScroll', () => {
  it('advances 40 px per second', () => {
    expect(nextScroll(100, 500, 2000)).toBe(120);
  });

  it('wraps once a whole copy of the list has passed, so the loop has no seam', () => {
    expect(nextScroll(1990, 500, 2000)).toBe(10);
  });

  it('stays put before the list is measured', () => {
    expect(nextScroll(15, 500, 0)).toBe(15);
  });
});

describe('isHeld', () => {
  it('drifts only when nothing holds it', () => {
    expect(isHeld(free, 1000)).toBe(false);
  });

  it('holds under the pointer, with focus inside, on a hidden page and under reduced motion', () => {
    expect(isHeld({ ...free, hover: true }, 1000)).toBe(true);
    expect(isHeld({ ...free, focus: true }, 1000)).toBe(true);
    expect(isHeld({ ...free, hidden: true }, 1000)).toBe(true);
    expect(isHeld({ ...free, reduced: true }, 1000)).toBe(true);
  });

  it('holds while a finger is down and until 3 s after it lifts', () => {
    expect(isHeld({ ...free, touchUntil: Infinity }, 1000)).toBe(true);
    expect(isHeld({ ...free, touchUntil: 4000 }, 3999)).toBe(true);
    expect(isHeld({ ...free, touchUntil: 4000 }, 4000)).toBe(false);
  });
});
```

`src/site/home/ThemeRibbon.test.tsx`:
```tsx
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LangContext } from '../i18n';
import { SitePrefsContext } from '../prefsContext';
import { CATALOG } from '../study/data';
import { ThemeRibbon } from './ThemeRibbon';

const ctx = { prefs: { theme: 'dragon-quest', mode: 'native' as const }, update: () => undefined };
const show = (onPick = vi.fn()) =>
  render(
    <LangContext value="es">
      <SitePrefsContext value={ctx}>
        <ThemeRibbon active="dragon-quest" onPick={onPick} />
      </SitePrefsContext>
    </LangContext>,
  );

describe('ThemeRibbon', () => {
  it('offers every theme once to assistive technology, the active one pressed', () => {
    show();
    const group = screen.getByRole('group', { name: 'Temas' });
    expect(within(group).getAllByRole('button')).toHaveLength(CATALOG.length);
    expect(screen.getByRole('button', { name: 'Dragon Quest, 1986: usar este tema' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Classic: usar este tema' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('picks the theme of the chip pressed', () => {
    const onPick = vi.fn();
    show(onPick);
    fireEvent.click(screen.getByRole('button', { name: 'Nakagin, 1970–1972: usar este tema' }));
    expect(onPick).toHaveBeenCalledWith('nakagin');
  });

  it('repeats the list for the loop, hidden and out of the tab order', () => {
    show();
    const copies = document.querySelectorAll<HTMLButtonElement>('[aria-hidden="true"] button');
    expect(copies).toHaveLength(CATALOG.length);
    expect([...copies].every((button) => button.tabIndex === -1)).toBe(true);
  });

  it('loads each work’s fonts as a subset of its name', () => {
    show();
    const subsets = [...document.head.querySelectorAll<HTMLLinkElement>('link[data-nbc-fonts]')].map((link) => link.href);
    expect(subsets.length).toBeGreaterThan(0);
    expect(subsets.every((href) => href.includes('text='))).toBe(true);
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/site/home/drift.test.ts src/site/home/ThemeRibbon.test.tsx`
Expected: FAIL, because `./drift` and `./ThemeRibbon` do not exist.

- [ ] **Step 3: Implement**

`src/site/i18n.ts`, add a `// Home` block after `// Page titles`:
```ts
  // Home
  ribbonLabel: { es: 'Temas', en: 'Themes' },
  useTheme: { es: 'usar este tema', en: 'use this theme' },
```

`src/site/home/drift.ts`:
```ts
/** The ribbon's drift as pure steps: the hook in ThemeRibbon feeds it time and events. */

/** Pixels per second. */
export const DRIFT_SPEED = 40;
/** How long the ribbon waits after a finger lifts before it drifts again. */
export const TOUCH_RESUME_MS = 3000;

/** The next scroll offset: advance by speed × elapsed time, and wrap once a whole copy of the list has passed. */
export function nextScroll(left: number, elapsedMs: number, loopWidth: number, speed = DRIFT_SPEED): number {
  if (loopWidth <= 0) return left;
  const next = left + (speed * elapsedMs) / 1000;
  return next >= loopWidth ? next - loopWidth : next;
}

export interface DriftHold {
  hover: boolean;
  focus: boolean;
  /** performance.now() until which a touch holds the ribbon; Infinity while a finger is down. */
  touchUntil: number;
  hidden: boolean;
  reduced: boolean;
}

export const isHeld = (hold: DriftHold, now: number): boolean => hold.reduced || hold.hidden || hold.hover || hold.focus || now < hold.touchUntil;
```

`src/site/home/ThemeRibbon.tsx`:
```tsx
import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { useLang, useT } from '../i18n';
import { CATALOG } from '../study/data';
import { loadFontSubset } from '../study/loader';
import { Island } from '../study/ThemeCard';
import { TOUCH_RESUME_MS, isHeld, nextScroll } from './drift';
import type { DriftHold } from './drift';
import { chipLabel, ribbonOrder } from './works';

/** Advances the track's scroll on every frame unless something holds it (see isHeld). */
function useDrift(trackRef: RefObject<HTMLUListElement | null>) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof requestAnimationFrame !== 'function') return;
    const reducedQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const hold: DriftHold = { hover: false, focus: false, touchUntil: 0, hidden: document.hidden, reduced: reducedQuery?.matches ?? false };
    let position = track.scrollLeft;
    let last = performance.now();
    let frame = 0;
    // ponytail: the loop width is read every frame (one cheap layout read); cache it on resize if profiling ever shows it.
    const loopWidth = () => {
      const first = track.firstElementChild as HTMLElement | null;
      const second = track.querySelector<HTMLElement>('[data-loop-start]');
      return first && second ? second.offsetLeft - first.offsetLeft : 0;
    };
    const tick = (now: number) => {
      if (isHeld(hold, now)) position = track.scrollLeft;
      else {
        position = nextScroll(position, now - last, loopWidth());
        track.scrollLeft = position;
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const enter = () => (hold.hover = true);
    const leave = () => (hold.hover = false);
    const focusIn = () => (hold.focus = true);
    const focusOut = (event: FocusEvent) => (hold.focus = track.contains(event.relatedTarget as Node | null));
    const touchStart = () => (hold.touchUntil = Infinity);
    const touchEnd = () => (hold.touchUntil = performance.now() + TOUCH_RESUME_MS);
    const visibility = () => (hold.hidden = document.hidden);
    const motion = (event: MediaQueryListEvent) => (hold.reduced = event.matches);
    track.addEventListener('pointerenter', enter);
    track.addEventListener('pointerleave', leave);
    track.addEventListener('focusin', focusIn);
    track.addEventListener('focusout', focusOut);
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('touchcancel', touchEnd);
    document.addEventListener('visibilitychange', visibility);
    reducedQuery?.addEventListener('change', motion);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('pointerenter', enter);
      track.removeEventListener('pointerleave', leave);
      track.removeEventListener('focusin', focusIn);
      track.removeEventListener('focusout', focusOut);
      track.removeEventListener('touchstart', touchStart);
      track.removeEventListener('touchend', touchEnd);
      track.removeEventListener('touchcancel', touchEnd);
      document.removeEventListener('visibilitychange', visibility);
      reducedQuery?.removeEventListener('change', motion);
    };
  }, [trackRef]);
}

/**
 * Every theme as a chip painted in its own tokens, drifting left. The list is rendered twice so the
 * loop never shows a seam; the copy is hidden from assistive technology and from the tab order.
 */
export function ThemeRibbon({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  const lang = useLang();
  const t = useT();
  const track = useRef<HTMLUListElement>(null);
  const entries = useMemo(() => ribbonOrder(CATALOG), []);
  useDrift(track);

  useEffect(() => {
    for (const entry of entries) if (!entry.predatesStudy) loadFontSubset(entry.fontsHref, entry.name[lang]);
  }, [entries, lang]);

  const chips = (copy: boolean) =>
    entries.map((entry, i) => (
      <li key={`${copy ? 'b' : 'a'}-${entry.id}`} className="ribbon__item" aria-hidden={copy ? true : undefined} data-loop-start={copy && i === 0 ? '' : undefined}>
        <Island entry={entry} className="ribbon__island" withFonts={false}>
          <button
            type="button"
            className="ribbon__chip"
            aria-pressed={entry.id === active}
            aria-label={chipLabel(entry, lang, t('useTheme'))}
            tabIndex={copy ? -1 : undefined}
            onClick={() => onPick(entry.id)}
          >
            {entry.name[lang]}
          </button>
        </Island>
      </li>
    ));

  return (
    <div className="ribbon" role="group" aria-label={t('ribbonLabel')}>
      <ul ref={track} className="ribbon__track">
        {chips(false)}
        {chips(true)}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run them to see them pass**

Run: `npx vitest run src/site/home/drift.test.ts src/site/home/ThemeRibbon.test.tsx src/site/i18n.test.ts`
Expected: PASS.

- [ ] **Step 5: Lint and commit**

Run: `npm run lint`
Expected: no output.
```bash
git add src/site/home/drift.ts src/site/home/drift.test.ts src/site/home/ThemeRibbon.tsx src/site/home/ThemeRibbon.test.tsx src/site/i18n.ts
git commit -m "feat(site): a drifting ribbon of every theme, painted in its own tokens"
```

---

### Task 7: The monument replaces the old home

**Files:**
- Create: `src/site/home/WorkLine.tsx`, `src/site/home/WorkLine.test.tsx`
- Create: `src/site/home/Monument.tsx`
- Rewrite: `src/site/pages/StudyHome.tsx`, `src/site/pages/StudyHome.test.tsx`
- Delete: `src/site/study/GalleryPiece.tsx`
- Modify: `src/site/i18n.ts`, `src/site/site.css`

**Interfaces:**
- Consumes:
  - `FitTitle`, `TITLE_LINES`, `useMediaQuery` (Task 5);
  - `ThemeRibbon` (Task 6);
  - `formatAuthors` (Task 4);
  - `ModeSelect` (Task 1).
- Produces:
  - `MONUMENT_NAV_ID = 'monument-nav'`, exported from `src/site/home/Monument.tsx`;
  - `Monument({ entry: CatalogEntry })`;
  - `WorkLine({ entry: CatalogEntry })`;
  - `StudyHome()`, which renders `<div className="monument-home">`;
  - `UI` keys `monumentTitle`, `navGallery`, `houseTheme`, `seeWork`, `seeTheme`.

- [ ] **Step 1: Write the failing tests**

`src/site/home/WorkLine.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Lang } from '../../study/types';
import { LangContext } from '../i18n';
import { ENTRIES } from '../study/data';
import { WorkLine } from './WorkLine';

const show = (id: string, lang: Lang) =>
  render(
    <LangContext value={lang}>
      <WorkLine entry={ENTRIES.get(id)!} />
    </LangContext>,
  );

describe('WorkLine', () => {
  it('names the work, two authors and the team, its years, and links to it', () => {
    show('dragon-quest', 'es');
    const line = document.querySelector('.monument__work');
    expect(line).toHaveTextContent('Dragon Quest · Yuji Horii, Koichi Nakamura y equipo · 1986 · Ver la obra →');
    expect(line).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('link', { name: 'Ver la obra' })).toHaveAttribute('href', '#/es/theme/dragon-quest');
  });

  it('calls a house theme what it is', () => {
    show('classic', 'en');
    expect(document.querySelector('.monument__work')).toHaveTextContent('Classic · House theme · See the theme →');
    expect(screen.getByRole('link', { name: 'See the theme' })).toHaveAttribute('href', '#/en/theme/classic');
  });
});
```

Replace `src/site/pages/StudyHome.test.tsx` with:
```tsx
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { replaceHash } from '../router';
import { CATALOG } from '../study/data';

const themeLinks = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[data-nbc-theme]')];
const matchMedia = (media: string) => ({ matches: false, media, addEventListener() {}, removeEventListener() {} });

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('matchMedia', matchMedia);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  replaceHash('#/es/');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  for (const link of document.head.querySelectorAll('link')) link.remove();
});

describe('the home', () => {
  it('names the gallery in its only h1 and arrives without fetching a study stylesheet', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Galería de las Interfaces' })).toBeInTheDocument();
    expect(themeLinks()).toEqual([]);
  });

  it('lists every theme once, the active one pressed, and the gallery’s sections', () => {
    render(<App />);
    expect(within(screen.getByRole('group', { name: 'Temas' })).getAllByRole('button')).toHaveLength(CATALOG.length);
    expect(screen.getByRole('button', { name: 'Classic: usar este tema' })).toHaveAttribute('aria-pressed', 'true');
    const sections = screen.getByRole('navigation', { name: 'Secciones de la galería' });
    expect(within(sections).getByRole('link', { name: 'Archivo' })).toHaveAttribute('href', '#/es/atlas');
  });

  it('a chip loads its theme first, then repaints the site and names the new work', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Nakagin, 1970–1972: usar este tema' }));
    const link = document.head.querySelector('link[data-nbc-theme="nakagin"]');
    expect(link).not.toBeNull();
    expect(document.documentElement.dataset.theme).toBe('classic');
    act(() => {
      link!.dispatchEvent(new Event('load'));
    });
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('nakagin'));
    expect(document.querySelector('.monument__work')).toHaveTextContent('Nakagin · Kisho Kurokawa · 1970–1972 · Ver la obra');
  });

  it('a chip whose stylesheet cannot load leaves the site in its theme, without an unhandled error', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Mäusebunker, 1971–1982: usar este tema' }));
    const link = document.head.querySelector('link[data-nbc-theme="maeusebunker"]');
    await act(async () => {
      link!.dispatchEvent(new Event('error'));
    });
    expect(document.documentElement.dataset.theme).toBe('classic');
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/site/home/WorkLine.test.tsx src/site/pages/StudyHome.test.tsx`
Expected: FAIL. `./WorkLine` does not exist, and the home has no heading named «Galería de las Interfaces».

- [ ] **Step 3: Implement**

`src/site/i18n.ts`, in the `// Home` block:
```ts
  monumentTitle: { es: 'Galería de las Interfaces', en: 'Gallery of Interfaces' },
  navGallery: { es: 'Secciones de la galería', en: 'Gallery sections' },
  houseTheme: { es: 'Tema de la casa', en: 'House theme' },
  seeWork: { es: 'Ver la obra', en: 'See the work' },
  seeTheme: { es: 'Ver el tema', en: 'See the theme' },
```

`src/site/home/WorkLine.tsx`:
```tsx
import type { CatalogEntry } from '../../study/catalog';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';
import { years } from '../study/format';
import { formatAuthors } from './works';

/** One line under the ribbon naming the active theme; a polite live region, so a picked work is announced. */
export function WorkLine({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const house = entry.predatesStudy;
  return (
    <p className="monument__work" aria-live="polite">
      <strong>{entry.name[lang]}</strong>
      {' · '}
      {house ? t('houseTheme') : `${formatAuthors(entry.reference.authors, lang, t('anonymous'))} · ${years(entry.reference.date)}`}
      {' · '}
      <a href={toHash(lang, `/theme/${entry.id}`)}>
        {t(house ? 'seeTheme' : 'seeWork')}
        <span aria-hidden="true"> →</span>
      </a>
    </p>
  );
}
```

`src/site/home/Monument.tsx`:
```tsx
import type { CatalogEntry } from '../../study/catalog';
import { REPO_URL } from '../../docs/guide';
import { useLang, useT } from '../i18n';
import type { UIKey } from '../i18n';
import { useSitePrefsContext } from '../prefsContext';
import { toHash } from '../router';
import { ModeSelect } from '../ThemeSwitcher';
import { loadThemeStylesheet } from '../study/loader';
import { FitTitle } from './FitTitle';
import { TITLE_LINES } from './fit';
import { ThemeRibbon } from './ThemeRibbon';
import { useMediaQuery } from './useMediaQuery';
import { WorkLine } from './WorkLine';

/** The id of the monument's bottom bar; the shell reveals its slim bar once this has scrolled away. */
export const MONUMENT_NAV_ID = 'monument-nav';

const SECTIONS: readonly { key: UIKey; path: string }[] = [
  { key: 'navComponents', path: '/components' },
  { key: 'navScenes', path: '/scenes' },
  { key: 'navAtlas', path: '/atlas' },
  { key: 'navLibrary', path: '/library' },
];

/** The home's first screen: one plate in the active theme with the fitted title, the ribbon, the work line and the gallery's sections. */
export function Monument({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const { prefs, update } = useSitePrefsContext();
  const phone = useMediaQuery('(max-width: 639px)');
  const other = lang === 'es' ? 'en' : 'es';
  // The stylesheet loads before the switch, so the page never drops to its loading screen.
  // A theme that cannot load leaves the site as it was.
  const pick = (id: string) => {
    loadThemeStylesheet(id).then(
      () => update({ theme: id }),
      () => undefined,
    );
  };

  return (
    <header className="monument">
      <p className="monument__corner">
        <a href={toHash(other, '/')} hrefLang={other} lang={other}>
          {t('switchLanguage')}
        </a>
        <ModeSelect mode={prefs.mode} onChange={(mode) => update({ mode })} />
      </p>
      <FitTitle key={prefs.theme} lines={TITLE_LINES[lang][phone ? 'phone' : 'wide']} label={t('monumentTitle')} className="monument__title" />
      <ThemeRibbon active={prefs.theme} onPick={pick} />
      <WorkLine entry={entry} />
      <nav id={MONUMENT_NAV_ID} className="monument__nav" aria-label={t('navGallery')}>
        {SECTIONS.map((section) => (
          <a key={section.path} href={toHash(lang, section.path)}>
            {t(section.key)}
          </a>
        ))}
        <a className="monument__repo" href={REPO_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  );
}
```

Replace `src/site/pages/StudyHome.tsx` with:
```tsx
import { useSitePrefsContext } from '../prefsContext';
import { ENTRIES } from '../study/data';
import { Monument } from '../home/Monument';

/** The home page: the monument, then (in later tasks) the wall of components, the work's card and take-it. */
export function StudyHome() {
  const { prefs } = useSitePrefsContext();
  const entry = ENTRIES.get(prefs.theme) ?? ENTRIES.get('classic')!;
  return (
    <div className="monument-home">
      <Monument entry={entry} />
    </div>
  );
}
```

Delete `src/site/study/GalleryPiece.tsx`.

Remove the old home's strings from `UI`. These are the keys only the old home and `GalleryPiece` used:
- `studyTitle`;
- `galleryKicker`, `galleryVisit`, `galleryWall`, `galleryGoTo`;
- `collectionHeading`, `collectionLead`, `chronology`;
- `workNo`, `mediumLabel`, `mediumValue`, `roomLabel`, `pieceLabel`, `mainRoom`;
- every `piece*` key: `pieceWindow`, `pieceTabs`, `pieceProfile`, `pieceAlerts`, `pieceName`, `pieceOffline`, `pieceRemember`, `pieceSync`, `pieceSaved`, `pieceSavedBody`, `pieceNew`, `pieceCancel`, `pieceSave`.

Keep `fullRecord`: Task 9 uses it. Before deleting, confirm each key is unused:
```bash
for k in studyTitle galleryKicker galleryVisit galleryWall galleryGoTo collectionHeading collectionLead chronology workNo mediumLabel mediumValue roomLabel pieceLabel mainRoom pieceWindow pieceTabs pieceProfile pieceAlerts pieceName pieceOffline pieceRemember pieceSync pieceSaved pieceSavedBody pieceNew pieceCancel pieceSave; do git grep -q -E "['.]$k\b" -- src ':!src/site/i18n.ts' && echo "still used: $k"; done
```
Expected: no output. Delete only keys that are not printed.

In `src/site/site.css`:
- Delete every rule whose selector starts with `.study-hero`, `.gallery-` or `.gallery-piece`, and any `@media` block left empty.
- Confirm with `git grep -n -E "\.study-hero|\.gallery-" src/site/site.css`. Expected: no output.

Then append:
```css
/* ============================================================
   Home: the monument
   ============================================================ */
.monument-home {
  --home-gutter: clamp(16px, 3vw, 32px);
  display: grid;
  gap: clamp(64px, 9vw, 120px);
  padding: var(--home-gutter) var(--home-gutter) clamp(64px, 9vw, 120px);
}
.monument-home > :not(.monument) {
  box-sizing: border-box;
  inline-size: 100%;
  max-inline-size: 1180px;
  margin-inline: auto;
}
.monument {
  --monument-pad: clamp(16px, 3vw, 40px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2.4vw, 28px);
  min-block-size: calc(100dvh - 2 * var(--home-gutter));
  padding: var(--monument-pad);
  overflow: hidden;
  background: var(--nbc-bg);
  color: var(--nbc-fg);
  border: calc(var(--nbc-border-width) * 1.5) var(--nbc-border-style) var(--nbc-border-color);
  border-radius: var(--nbc-radius);
  box-shadow: var(--nbc-shadow-lg);
}
.monument__corner {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--nbc-space-md);
  margin: 0;
  font-size: var(--nbc-fs-sm);
  font-weight: var(--nbc-weight-label);
}
.monument__corner a {
  color: inherit;
}

.fit-title {
  margin: auto 0 0;
  font-family: var(--nbc-font-display);
  font-weight: var(--nbc-weight-display);
  font-stretch: 75%;
  letter-spacing: var(--nbc-display-spacing);
  text-transform: uppercase;
  line-height: 0.86;
}
.fit-title__line {
  display: block;
  inline-size: max-content;
  white-space: nowrap;
  font-size: clamp(40px, 9vw, 160px);
}
.fit-title__char {
  display: inline-block;
}
@media (prefers-reduced-motion: no-preference) {
  .fit-title__char {
    animation: fit-title-in 240ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: calc(var(--i) * 18ms);
  }
}
@keyframes fit-title-in {
  from {
    opacity: 0;
    transform: translateY(0.2em);
  }
}

.ribbon {
  --ribbon-ring: var(--nbc-fg);
  margin-inline: calc(-1 * var(--monument-pad));
}
.ribbon__track {
  display: flex;
  gap: 12px;
  margin: 0;
  padding: 12px var(--monument-pad);
  list-style: none;
  overflow-x: auto;
  scrollbar-width: none;
  mask-image: linear-gradient(to right, transparent, #000 48px);
}
.ribbon__track::-webkit-scrollbar {
  display: none;
}
.ribbon__item {
  flex: none;
}
.ribbon__island.nbc-root {
  display: block;
  background-color: transparent;
}
.ribbon__chip {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  min-block-size: 44px;
  padding: 8px 16px;
  font-family: var(--nbc-font-display);
  font-weight: var(--nbc-weight-display);
  font-stretch: var(--nbc-display-stretch);
  letter-spacing: var(--nbc-display-spacing);
  text-transform: var(--nbc-display-transform);
  font-size: clamp(16px, 1.6vw, 22px);
  line-height: 1.1;
  white-space: nowrap;
  color: var(--nbc-fg);
  background: var(--nbc-bg);
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
  border-radius: var(--nbc-radius-button);
  box-shadow: var(--nbc-shadow-press);
  cursor: pointer;
}
.ribbon__chip[aria-pressed='true'] {
  outline: 4px solid var(--ribbon-ring);
  outline-offset: 3px;
}
.ribbon__chip:focus-visible {
  outline: 3px dashed var(--ribbon-ring);
  outline-offset: 3px;
}

.monument__work {
  margin: 0;
  font-size: var(--nbc-fs-md);
  line-height: 1.4;
}
.monument__work strong {
  font-weight: var(--nbc-weight-label);
}

.monument__nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--nbc-border-width);
  margin-block-start: auto;
  background: var(--nbc-border-color);
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
  box-shadow: var(--nbc-shadow-press);
}
.monument__nav a {
  flex: 1 1 auto;
  box-sizing: border-box;
  padding: 12px 20px;
  text-align: center;
  text-decoration: none;
  color: var(--nbc-fg);
  background: var(--nbc-bg);
  font-family: var(--nbc-font-display);
  font-weight: var(--nbc-weight-display);
  font-stretch: 75%;
  text-transform: uppercase;
  font-size: clamp(18px, 2.2vw, 30px);
  line-height: 1;
}
@media (hover: hover) {
  .monument__nav a:hover {
    background: var(--nbc-surface-alt);
  }
}

@media (max-width: 639px) {
  .monument-home {
    --home-gutter: 16px;
  }
  .monument {
    min-block-size: calc(100dvh - 48px - 2 * var(--home-gutter));
  }
  .monument__corner {
    display: none;
  }
  .monument__nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .monument__nav a {
    display: grid;
    place-items: center;
    min-block-size: 44px;
  }
  .monument__repo {
    display: none;
  }
}
```

- [ ] **Step 4: Run them to see them pass**

Run: `npx vitest run src/site`
Expected: PASS, all site tests.

- [ ] **Step 5: Lint, types, commit**

Run: `npm run lint && npm run typecheck`
Expected: clean.
```bash
git add -A src/site
git commit -m "feat(site): the home opens on a monument: a fitted title, a ribbon of every theme and the work it shows"
```

---

### Task 8: The wall of components

**Files:**
- Create: `src/site/home/ComponentWall.tsx`, `src/site/home/ComponentWall.test.tsx`
- Create: `src/site/home/copyLabels.ts`
- Modify: `src/site/pages/StudyHome.tsx`, `src/site/i18n.ts`, `src/site/site.css`

**Interfaces:**
- Consumes:
  - `roomRows` (Task 4);
  - `fill` (Task 4);
  - `installCode` (Task 1);
  - `CodeBlock` labels (Task 2).
- Produces:
  - `ComponentWall({ entry: CatalogEntry })`;
  - `copyProps(t: (key: UIKey) => string, label: string): { label: string; copyLabel: string; copiedLabel: string; selectLabel: string }`.

- [ ] **Step 1: Write the failing test**

`src/site/home/ComponentWall.test.tsx`:
```tsx
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SLUGS } from '../../docs/slugs';
import { LangContext } from '../i18n';
import { ENTRIES } from '../study/data';
import { ComponentWall } from './ComponentWall';

const show = (id: string) =>
  render(
    <LangContext value="es">
      <ComponentWall entry={ENTRIES.get(id)!} />
    </LangContext>,
  );

describe('ComponentWall', () => {
  it('names the work it is painted in, or the house theme', () => {
    show('dragon-quest');
    expect(screen.getByRole('heading', { level: 2, name: 'Los mismos componentes, en el idioma de Dragon Quest' })).toBeInTheDocument();
  });

  it('says «en el tema» for a house theme', () => {
    show('classic');
    expect(screen.getByRole('heading', { level: 2, name: 'Los mismos componentes, en el tema Classic' })).toBeInTheDocument();
  });

  it('shows all sixteen components, each block linking to their pages', () => {
    const { container } = show('dragon-quest');
    const missing = SLUGS.filter((slug) => !container.querySelector(`a[href="#/es/components/${slug}"]`));
    expect(missing).toEqual([]);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'Secciones de los ajustes' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Sala' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Recorrido guiado' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('opens a real dialog that holds the theme’s install lines', () => {
    show('dragon-quest');
    fireEvent.click(screen.getByRole('button', { name: 'Colgar' }));
    const dialog = screen.getByRole('dialog', { name: 'Colgar Dragon Quest' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveTextContent("import 'neobrutalistcomponents/themes/dragon-quest.css';");
  });

  it('lists the room around the active work and marks it', () => {
    show('win95');
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(5);
    expect(within(rows[2]).getByText('aquí')).toBeInTheDocument();
    expect(rows[2]).toHaveTextContent('Windows 95');
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/site/home/ComponentWall.test.tsx`
Expected: FAIL, because `./ComponentWall` does not exist.

- [ ] **Step 3: Implement**

`src/site/i18n.ts`, in the `// Home` block:
```ts
  wallWork: { es: 'Los mismos componentes, en el idioma de {name}', en: 'The same components, in the language of {name}' },
  wallHouse: { es: 'Los mismos componentes, en el tema {name}', en: 'The same components, in the {name} theme' },
  wallHangTitle: { es: '¿Colgar esta obra en tu sitio?', en: 'Hang this work on your site?' },
  wallHangBody: { es: 'Instala el tema y tu app se pinta con él.', en: 'Install the theme and your app is painted with it.' },
  wallNotNow: { es: 'Ahora no', en: 'Not now' },
  wallHang: { es: 'Colgar', en: 'Hang it' },
  wallDialogTitle: { es: 'Colgar {name}', en: 'Hang {name}' },
  wallDialogBody: { es: 'Estas líneas instalan el tema en una app de React.', en: 'These lines install the theme in a React app.' },
  wallDone: { es: 'Listo', en: 'Done' },
  wallRoomCaption: { es: 'Obras de la sala {room}', en: 'Works in the {room} room' },
  wallRoomsCaption: { es: 'La obra más antigua de cada sala', en: 'The oldest work in each room' },
  colWork: { es: 'Obra', en: 'Work' },
  colYear: { es: 'Año', en: 'Year' },
  wallHere: { es: 'aquí', en: 'here' },
  wallSettings: { es: 'Ajustes de la visita', en: 'Visit settings' },
  wallTabs: { es: 'Secciones de los ajustes', en: 'Settings sections' },
  wallTabVisit: { es: 'Visita', en: 'Visit' },
  wallGuided: { es: 'Recorrido guiado', en: 'Guided tour' },
  wallShowSources: { es: 'Mostrar las fuentes', en: 'Show the sources' },
  wallPace: { es: 'Ritmo', en: 'Pace' },
  wallPaceSlow: { es: 'Lento', en: 'Slow' },
  wallPaceNormal: { es: 'Normal', en: 'Normal' },
  wallPaceFast: { es: 'Rápido', en: 'Fast' },
  wallStatus: { es: 'Estado de la sala', en: 'Room status' },
  wallRestoration: { es: 'Restauración del archivo', en: 'Archive restoration' },
  wallAlertTitle: { es: 'La sala abre a las 10:00', en: 'The room opens at 10:00' },
  wallAlertBody: { es: 'Entrada libre.', en: 'Free entry.' },
  wallGuestbook: { es: 'Libro de visitas', en: 'Guestbook' },
  wallName: { es: 'Tu nombre', en: 'Your name' },
  wallNote: { es: 'Nota para el libro de visitas', en: 'A note for the guestbook' },
  wallSearchHint: { es: 'Buscar en el archivo', en: 'Search the archive' },
  copyCode: { es: 'Copiar', en: 'Copy' },
  copied: { es: 'Copiado', en: 'Copied' },
  selectAndCopy: { es: 'Selecciona y copia', en: 'Select and copy' },
```

`src/site/home/copyLabels.ts`:
```ts
import type { UIKey } from '../i18n';

/** A CodeBlock's label and its copy button's names, in the page's language. */
export const copyProps = (t: (key: UIKey) => string, label: string) => ({
  label,
  copyLabel: `${t('copyCode')} ${label}`,
  copiedLabel: t('copied'),
  selectLabel: t('selectAndCopy'),
});
```

`src/site/home/ComponentWall.tsx`:
```tsx
import { useState } from 'react';
import { Alert, Badge, Button, Card, Checkbox, Dialog, Input, Kbd, Progress, Radio, RadioGroup, Select, Switch, Table, Tabs, Textarea, Tooltip } from 'neobrutalistcomponents';
import type { CatalogEntry } from '../../study/catalog';
import { THEME_SCENES } from '../../study/types';
import { CodeBlock } from '../docs/CodeBlock';
import { KIND_TEXT, SCENE_TEXT, fill, useLang, useT } from '../i18n';
import { installCode } from '../install';
import { toHash } from '../router';
import { CATALOG } from '../study/data';
import { years } from '../study/format';
import { isPlaced } from '../study/rooms';
import { copyProps } from './copyLabels';
import { roomRows } from './works';

/** Links from a block to the pages of the components it shows. */
function Links({ components }: { components: readonly [name: string, slug: string][] }) {
  const lang = useLang();
  return (
    <Card.Content className="wall__links">
      {components.map(([name, slug]) => (
        <a key={slug} href={toHash(lang, `/components/${slug}`)}>
          {name}
          <span aria-hidden="true"> →</span>
        </a>
      ))}
    </Card.Content>
  );
}

function HangBlock({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <Card as="article" className="wall__block wall__block--hang">
      <Card.Header>
        <Card.Title as="h3">{t('wallHangTitle')}</Card.Title>
        <Card.Description>{t('wallHangBody')}</Card.Description>
      </Card.Header>
      <Card.Footer className="wall__actions">
        <Button variant="ghost">{t('wallNotNow')}</Button>
        <Button onClick={() => setOpen(true)}>{t('wallHang')}</Button>
      </Card.Footer>
      <Links components={[['Card', 'card'], ['Button', 'button'], ['Dialog', 'dialog']]} />
      <Dialog open={open} onOpenChange={setOpen} closeLabel={t('motionClose')}>
        <Dialog.Header>
          <Dialog.Title>{fill(t('wallDialogTitle'), { name: entry.name[lang] })}</Dialog.Title>
          <Dialog.Description>{t('wallDialogBody')}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Content>
          <CodeBlock code={installCode(entry.id, entry.fonts.length > 0)} {...copyProps(t, 'TSX')} />
        </Dialog.Content>
        <Dialog.Footer>
          <Button onClick={() => setOpen(false)}>{t('wallDone')}</Button>
        </Dialog.Footer>
      </Dialog>
    </Card>
  );
}

function RoomBlock({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const caption = entry.predatesStudy ? t('wallRoomsCaption') : fill(t('wallRoomCaption'), { room: SCENE_TEXT[entry.scene].name[lang] });
  return (
    <Card as="article" className="wall__block wall__block--room">
      <Card.Header>
        <Card.Title as="h3">{caption}</Card.Title>
      </Card.Header>
      <Card.Content>
        <Table density="compact">
          <Table.Caption className="site-visually-hidden">{caption}</Table.Caption>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>{t('colWork')}</Table.HeaderCell>
              <Table.HeaderCell className="wall__room-col">{t('colRoom')}</Table.HeaderCell>
              <Table.HeaderCell align="end">{t('colYear')}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {roomRows(entry, CATALOG).map(({ entry: work, current }) => (
              <Table.Row key={work.id}>
                <Table.Cell>
                  <a href={toHash(lang, `/theme/${work.id}`)}>{work.name[lang]}</a>
                  {current ? (
                    <>
                      {' '}
                      <Badge size="sm" variant="primary">
                        {t('wallHere')}
                      </Badge>
                    </>
                  ) : null}
                </Table.Cell>
                <Table.Cell className="wall__room-col">{SCENE_TEXT[work.scene].name[lang]}</Table.Cell>
                <Table.Cell numeric>{years(work.reference.date)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card.Content>
      <Links components={[['Table', 'table'], ['Badge', 'badge']]} />
    </Card>
  );
}

function SettingsBlock({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  return (
    <Card as="article" className="wall__block wall__block--settings">
      <Card.Header>
        <Card.Title as="h3">{t('wallSettings')}</Card.Title>
      </Card.Header>
      <Card.Content>
        <Tabs defaultValue="room">
          <Tabs.List aria-label={t('wallTabs')}>
            <Tabs.Tab value="room">{t('colRoom')}</Tabs.Tab>
            <Tabs.Tab value="visit">{t('wallTabVisit')}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="room" className="wall__panel">
            <Select label={t('colRoom')} defaultValue={isPlaced(entry.scene) ? entry.scene : THEME_SCENES[0]}>
              {THEME_SCENES.map((scene) => (
                <option key={scene} value={scene}>
                  {SCENE_TEXT[scene].name[lang]}
                </option>
              ))}
            </Select>
            <Switch label={t('wallGuided')} defaultChecked />
            <Checkbox label={t('wallShowSources')} defaultChecked />
          </Tabs.Panel>
          <Tabs.Panel value="visit" className="wall__panel">
            <RadioGroup label={t('wallPace')} defaultValue="normal">
              <Radio value="slow" label={t('wallPaceSlow')} />
              <Radio value="normal" label={t('wallPaceNormal')} />
              <Radio value="fast" label={t('wallPaceFast')} />
            </RadioGroup>
          </Tabs.Panel>
        </Tabs>
      </Card.Content>
      <Links components={[['Tabs', 'tabs'], ['Select', 'select'], ['Switch', 'switch'], ['Checkbox', 'checkbox'], ['RadioGroup', 'radio-group']]} />
    </Card>
  );
}

function StatusBlock({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  return (
    <Card as="article" className="wall__block wall__block--status">
      <Card.Header>
        <Card.Title as="h3">{t('wallStatus')}</Card.Title>
      </Card.Header>
      <Card.Content className="wall__stack">
        <Progress label={t('wallRestoration')} value={72} showValue />
        <Alert variant="info" title={t('wallAlertTitle')}>
          {t('wallAlertBody')}
        </Alert>
        <p className="wall__badges">
          {entry.predatesStudy ? null : <Badge variant="neutral">{years(entry.reference.date)}</Badge>}
          <Badge variant="accent">{SCENE_TEXT[entry.scene].name[lang]}</Badge>
          <Badge variant="info">{KIND_TEXT[entry.reference.kind][lang]}</Badge>
        </p>
      </Card.Content>
      <Links components={[['Progress', 'progress'], ['Alert', 'alert']]} />
    </Card>
  );
}

function GuestbookBlock() {
  const t = useT();
  return (
    <Card as="article" className="wall__block wall__block--guestbook">
      <Card.Header>
        <Card.Title as="h3">{t('wallGuestbook')}</Card.Title>
      </Card.Header>
      <Card.Content className="wall__stack">
        <Input label={t('wallName')} />
        <Textarea label={t('wallNote')} />
        <p className="wall__search">
          <Tooltip content={t('wallSearchHint')}>
            <Button variant="secondary">{t('search')}</Button>
          </Tooltip>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </p>
      </Card.Content>
      <Links components={[['Input', 'input'], ['Textarea', 'textarea'], ['Tooltip', 'tooltip'], ['Kbd', 'kbd']]} />
    </Card>
  );
}

/** Every component of the library, working, in the active theme, saying something about the gallery. */
export function ComponentWall({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const heading = fill(t(entry.predatesStudy ? 'wallHouse' : 'wallWork'), { name: entry.name[lang] });
  return (
    <section className="wall" aria-labelledby="wall-title">
      <h2 className="site-h2 wall__title" id="wall-title">
        {heading}
      </h2>
      <div className="wall__grid">
        <HangBlock entry={entry} />
        <RoomBlock entry={entry} />
        <SettingsBlock entry={entry} />
        <StatusBlock entry={entry} />
        <GuestbookBlock />
      </div>
    </section>
  );
}
```

`src/site/pages/StudyHome.tsx`: render `<ComponentWall key={entry.id} entry={entry} />` after `<Monument entry={entry} />`, and import it from `'../home/ComponentWall'`. The key resets the uncontrolled controls when the theme changes.

Append to `src/site/site.css`:
```css
/* ---- Home: the wall of components ---- */
.wall__title {
  margin-block-start: 0;
}
.wall__grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--nbc-space-lg);
  align-items: start;
}
.wall__block--hang,
.wall__block--status {
  grid-column: span 5;
}
.wall__block--room,
.wall__block--settings {
  grid-column: span 7;
}
.wall__block--guestbook {
  grid-column: 1 / -1;
}
.wall__stack,
.wall__panel {
  display: grid;
  gap: var(--nbc-space-md);
}
.wall__panel {
  padding-block-start: var(--nbc-space-lg);
}
.wall__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--nbc-space-sm);
}
.wall__badges,
.wall__search {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--nbc-space-sm);
  margin: 0;
}
.wall__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--nbc-space-xs) var(--nbc-space-md);
  font-size: var(--nbc-fs-sm);
  font-weight: var(--nbc-weight-label);
}
@media (max-width: 899px) {
  .wall__grid > * {
    grid-column: 1 / -1;
  }
}
@media (max-width: 639px) {
  .wall__room-col {
    display: none;
  }
}
```

- [ ] **Step 4: Run it to see it pass**

Run: `npx vitest run src/site/home src/site/pages/StudyHome.test.tsx src/site/i18n.test.ts`
Expected: PASS.

- [ ] **Step 5: Lint and commit**

Run: `npm run lint && npm run typecheck`
Expected: clean.
```bash
git add src/site/home/ComponentWall.tsx src/site/home/ComponentWall.test.tsx src/site/home/copyLabels.ts src/site/pages/StudyHome.tsx src/site/i18n.ts src/site/site.css
git commit -m "feat(site): a wall of all sixteen components in the active theme, speaking about the gallery"
```

---

### Task 9: The work's card

**Files:**
- Create: `src/site/home/WorkCard.tsx`, `src/site/home/WorkCard.test.tsx`, `src/site/home/WorkCard.fallback.test.tsx`
- Modify: `src/site/pages/StudyHome.tsx`, `src/site/i18n.ts`, `src/site/site.css`

**Interfaces:**
- Consumes:
  - `useNearViewport`, `PhotoFigure` (Task 1);
  - `sourceCount` (Task 4);
  - `useThemeDetail` from `src/site/study/detail.ts`.
- Produces: `WorkCard({ entry: CatalogEntry })`.

- [ ] **Step 1: Write the failing tests**

`src/site/home/WorkCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LangContext } from '../i18n';
import { ENTRIES } from '../study/data';
import { WorkCard } from './WorkCard';

const show = (id: string) =>
  render(
    <LangContext value="es">
      <WorkCard entry={ENTRIES.get(id)!} />
    </LangContext>,
  );

describe('WorkCard', () => {
  it('shows a work’s free photograph with its credit, its facts and its sources', async () => {
    show('nakagin');
    expect(screen.getByRole('heading', { level: 2, name: 'Nakagin' })).toBeInTheDocument();
    expect(screen.getByText('Kisho Kurokawa')).toBeInTheDocument();
    expect(await screen.findByRole('img', { name: /cápsulas grises/ })).toBeInTheDocument();
    expect(screen.getByText(/Foto: Dllu/)).toBeInTheDocument();
    expect(screen.getByText('4 fuentes')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Leer la ficha completa' })).toHaveAttribute('href', '#/es/theme/nakagin');
  });

  it('shows a documentary plate when there is no free image, naming the palette’s origin', async () => {
    show('dragon-quest');
    expect(await screen.findByText('Lámina documental: no hay una imagen libre de esta obra.')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Colores del tema' }).querySelectorAll('li')).toHaveLength(ENTRIES.get('dragon-quest')!.swatch.length);
    expect(screen.getByText(/^Paleta, /)).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('calls a house theme a house theme, with no image', () => {
    show('classic');
    expect(screen.getByText('Tema de la casa')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver el tema' })).toHaveAttribute('href', '#/es/theme/classic');
    expect(screen.queryByRole('figure')).toBeNull();
  });
});
```

`src/site/home/WorkCard.fallback.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LangContext } from '../i18n';
import { ENTRIES } from '../study/data';
import { WorkCard } from './WorkCard';

vi.mock('../study/detail', async (original) => ({
  ...(await original<typeof import('../study/detail')>()),
  useThemeDetail: () => ({ status: 'error' }),
}));

describe('WorkCard when the ficha cannot load', () => {
  it('keeps what the catalog knows and the link to the work, without a broken image', () => {
    render(
      <LangContext value="es">
        <WorkCard entry={ENTRIES.get('nakagin')!} />
      </LangContext>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Nakagin' })).toBeInTheDocument();
    expect(screen.getByText('Kisho Kurokawa')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Leer la ficha completa' })).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByText(/fuentes$/)).toBeNull();
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/site/home/WorkCard.test.tsx src/site/home/WorkCard.fallback.test.tsx`
Expected: FAIL, because `./WorkCard` does not exist.

- [ ] **Step 3: Implement**

`src/site/i18n.ts`:
- In the `// Home` block add:
  ```ts
  workKicker: { es: 'La obra', en: 'The work' },
  plateLabel: { es: 'Lámina documental: no hay una imagen libre de esta obra.', en: 'Documentary plate: there is no free image of this work.' },
  swatchesLabel: { es: 'Colores del tema', en: 'The theme’s colours' },
  ```
- Change `fullRecord` to:
  ```ts
  fullRecord: { es: 'Leer la ficha completa', en: 'Read the full record' },
  ```

`src/site/home/WorkCard.tsx`:
```tsx
import { useRef } from 'react';
import type { CatalogEntry } from '../../study/catalog';
import { PALETTE_TEXT, sourceCount, useLang, useT } from '../i18n';
import { toHash } from '../router';
import { useThemeDetail } from '../study/detail';
import type { ThemeDetail } from '../study/detail';
import { years } from '../study/format';
import { PhotoFigure } from '../study/PhotoFigure';
import { useNearViewport } from '../study/useNearViewport';

/** No free image: the theme's own colours, labelled with what the ficha says about the palette, and the work's lettering. */
function DocumentaryPlate({ entry, detail }: { entry: CatalogEntry; detail: ThemeDetail }) {
  const lang = useLang();
  const t = useT();
  const { palette, lettering } = detail.ficha;
  const original = lettering?.original;
  return (
    <figure className="work-card__plate">
      <ul className="work-card__swatches" aria-label={t('swatchesLabel')}>
        {entry.swatch.map((color, i) => (
          <li key={i}>
            <span className="work-card__swatch" style={{ background: color }} aria-hidden="true" />
            <code>{color}</code>
          </li>
        ))}
      </ul>
      <p className="site-p">
        {t('palette')}, {PALETTE_TEXT[palette.origin][lang]}: {palette.note[lang]}
      </p>
      {original ? (
        <p className="site-p">
          {original.kind === 'none' ? t('letteringNone') : `${t('letteringOriginal')} ${typeof original.name === 'string' ? original.name : original.name[lang]}.`}
        </p>
      ) : null}
      <figcaption>{t('plateLabel')}</figcaption>
    </figure>
  );
}

function WorkCardView({ entry, detail, pending }: { entry: CatalogEntry; detail: ThemeDetail | null; pending: boolean }) {
  const lang = useLang();
  const t = useT();
  const house = entry.predatesStudy;
  const image = detail?.reference.image;
  const media = house ? null : detail ? (
    image ? <PhotoFigure image={image} className="work-card__figure" /> : <DocumentaryPlate entry={entry} detail={detail} />
  ) : pending ? (
    <div className="work-card__placeholder" aria-hidden="true" />
  ) : null;

  return (
    <section className={media ? 'work-card' : 'work-card work-card--text'} aria-labelledby="work-card-title">
      {media ? <div className="work-card__media">{media}</div> : null}
      <div className="work-card__text">
        <p className="work-card__kicker">{t('workKicker')}</p>
        <h2 className="site-h2 work-card__title" id="work-card-title">
          {entry.name[lang]}
        </h2>
        {house ? (
          <p className="work-card__house">{t('houseTheme')}</p>
        ) : (
          <dl className="work-card__facts">
            <div>
              <dt>{t('byLabel')}</dt>
              <dd>{entry.reference.authors.length ? entry.reference.authors.join(', ') : t('anonymous')}</dd>
            </div>
            <div>
              <dt>{t('whenWhere')}</dt>
              <dd>
                {years(entry.reference.date)}, {entry.reference.place[lang]}
              </dd>
            </div>
          </dl>
        )}
        <p className="site-lead">{entry.tagline[lang]}</p>
        {detail && !house ? <p className="work-card__sources">{sourceCount(lang, detail.reference.sources.length)}</p> : null}
        <p className="work-card__more">
          <a href={toHash(lang, `/theme/${entry.id}`)}>
            {t(house ? 'seeTheme' : 'fullRecord')}
            <span aria-hidden="true"> →</span>
          </a>
        </p>
      </div>
    </section>
  );
}

function LoadedWorkCard({ entry }: { entry: CatalogEntry }) {
  const data = useThemeDetail(entry);
  return <WorkCardView entry={entry} detail={data.status === 'ready' ? data.value : null} pending={data.status === 'loading'} />;
}

/** The active theme's provenance: photo or documentary plate, authors, date and place, sources. Its ficha loads near the viewport. */
export function WorkCard({ entry }: { entry: CatalogEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref);
  return (
    <div ref={ref} className="work-card-slot">
      {near && !entry.predatesStudy ? <LoadedWorkCard entry={entry} /> : <WorkCardView entry={entry} detail={null} pending={!entry.predatesStudy} />}
    </div>
  );
}
```

`src/site/pages/StudyHome.tsx`: render `<WorkCard key={entry.id} entry={entry} />` after the wall, imported from `'../home/WorkCard'`.

Append to `src/site/site.css`:
```css
/* ---- Home: the work's card ---- */
.work-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 48px);
  align-items: start;
}
.work-card--text {
  grid-template-columns: minmax(0, 1fr);
}
.work-card__figure {
  margin: 0;
}
.work-card__figure img {
  display: block;
  inline-size: 100%;
  block-size: auto;
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
}
.work-card__figure figcaption {
  margin-block-start: var(--nbc-space-sm);
  font-size: var(--nbc-fs-xs);
  color: var(--nbc-fg-muted);
}
.work-card__placeholder {
  aspect-ratio: 4 / 3;
  background: var(--nbc-surface-alt);
  border: var(--nbc-border-width) dashed var(--nbc-border-color);
}
.work-card__plate {
  display: grid;
  gap: var(--nbc-space-md);
  margin: 0;
  padding: var(--nbc-space-lg);
  background: var(--nbc-surface);
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
  box-shadow: var(--nbc-shadow);
}
.work-card__plate figcaption {
  font-size: var(--nbc-fs-sm);
  font-weight: var(--nbc-weight-label);
}
.work-card__swatches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
  gap: var(--nbc-space-sm);
  margin: 0;
  padding: 0;
  list-style: none;
}
.work-card__swatches li {
  display: grid;
  gap: 6px;
  font-size: var(--nbc-fs-xs);
}
.work-card__swatch {
  display: block;
  aspect-ratio: 1;
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
}
.work-card__kicker {
  margin: 0;
  font-size: var(--nbc-fs-sm);
  font-weight: var(--nbc-weight-label);
  letter-spacing: var(--nbc-label-spacing);
  text-transform: var(--nbc-label-transform);
  color: var(--nbc-fg-muted);
}
.work-card__title {
  margin-block: var(--nbc-space-xs) var(--nbc-space-lg);
}
.work-card__facts {
  display: grid;
  gap: var(--nbc-space-sm);
  margin: 0 0 var(--nbc-space-lg);
}
.work-card__facts dt {
  font-size: var(--nbc-fs-xs);
  font-weight: var(--nbc-weight-label);
  color: var(--nbc-fg-muted);
}
.work-card__facts dd {
  margin: 0;
}
.work-card__sources,
.work-card__more,
.work-card__house {
  margin: var(--nbc-space-md) 0 0;
  font-weight: var(--nbc-weight-label);
}
@media (max-width: 899px) {
  .work-card {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

- [ ] **Step 4: Run them to see them pass**

Run: `npx vitest run src/site/home src/site/pages/StudyHome.test.tsx src/site/i18n.test.ts`
Expected: PASS.

- [ ] **Step 5: Lint and commit**

Run: `npm run lint && npm run typecheck`
Expected: clean.
```bash
git add src/site/home/WorkCard.tsx src/site/home/WorkCard.test.tsx src/site/home/WorkCard.fallback.test.tsx src/site/pages/StudyHome.tsx src/site/i18n.ts src/site/site.css
git commit -m "feat(site): the home names the work it is painted in: photo or documentary plate, authors, date, sources"
```

---

### Task 10: Take it

**Files:**
- Create: `src/site/home/TakeIt.tsx`, `src/site/home/TakeIt.test.tsx`
- Modify: `src/site/pages/StudyHome.tsx`, `src/site/i18n.ts`, `src/site/site.css`

**Interfaces:**
- Consumes:
  - `INSTALL_COMMAND`, `installCode` (Task 1);
  - `tokensCss` (Task 4);
  - `copyProps` (Task 8);
  - `loadDetail` from `src/site/study/detail.ts`.
- Produces: `TakeIt({ entry: CatalogEntry })`.

- [ ] **Step 1: Write the failing test**

`src/site/home/TakeIt.test.tsx`:
```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LangContext } from '../i18n';
import { ENTRIES } from '../study/data';
import { TakeIt } from './TakeIt';

const setClipboard = (value: unknown) => Object.defineProperty(navigator, 'clipboard', { value, configurable: true });
const show = (id: string) =>
  render(
    <LangContext value="es">
      <TakeIt entry={ENTRIES.get(id)!} />
    </LangContext>,
  );

afterEach(() => {
  setClipboard(undefined);
});

describe('TakeIt', () => {
  it('gives the install command and the theme’s import lines', () => {
    show('nakagin');
    expect(screen.getByRole('heading', { level: 2, name: 'Llévatelo' })).toBeInTheDocument();
    // The code is split into highlighted tokens, so read the section's whole text.
    const section = screen.getByRole('region', { name: 'Llévatelo' });
    expect(section).toHaveTextContent('npm install neobrutalistcomponents');
    expect(section).toHaveTextContent("import 'neobrutalistcomponents/themes/nakagin.css';");
    expect(screen.getByRole('link', { name: 'Guía para agentes' })).toHaveAttribute('href', '#/es/agents');
  });

  it('copies the theme’s tokens as one CSS rule', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    show('nakagin');
    fireEvent.click(screen.getByRole('button', { name: 'Copiar CSS' }));
    expect(await screen.findByRole('button', { name: 'CSS copiado' })).toBeInTheDocument();
    const css = writeText.mock.calls[0][0] as string;
    expect(css.startsWith("[data-theme='nakagin'] {\n")).toBe(true);
    expect(css).toMatch(/^ {2}--nbc-bg: /m);
  });

  it('says so when the CSS cannot be copied', async () => {
    setClipboard(undefined);
    show('classic');
    fireEvent.click(screen.getByRole('button', { name: 'Copiar CSS' }));
    expect(await screen.findByRole('button', { name: 'No se pudo copiar el CSS' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/site/home/TakeIt.test.tsx`
Expected: FAIL, because `./TakeIt` does not exist.

- [ ] **Step 3: Implement**

`src/site/i18n.ts`, in the `// Home` block:
```ts
  takeHeading: { es: 'Llévatelo', en: 'Take it' },
  takeLead: { es: 'Instala la librería y pinta tu app con {name}.', en: 'Install the library and paint your app with {name}.' },
  copyCss: { es: 'Copiar CSS', en: 'Copy CSS' },
  cssCopied: { es: 'CSS copiado', en: 'CSS copied' },
  cssFailed: { es: 'No se pudo copiar el CSS', en: 'The CSS could not be copied' },
  agentsLink: { es: 'Guía para agentes', en: 'Guide for agents' },
```

`src/site/home/TakeIt.tsx`:
```tsx
import { useState } from 'react';
import { Button } from 'neobrutalistcomponents';
import type { CatalogEntry } from '../../study/catalog';
import { CodeBlock } from '../docs/CodeBlock';
import { fill, useLang, useT } from '../i18n';
import { INSTALL_COMMAND, installCode } from '../install';
import { toHash } from '../router';
import { loadDetail } from '../study/detail';
import { copyProps } from './copyLabels';
import { tokensCss } from './works';

/** How to take the active theme: the install command, its import lines, and its tokens as CSS. */
export function TakeIt({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const [css, setCss] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function copyCss() {
    try {
      const detail = await loadDetail(entry);
      await navigator.clipboard.writeText(tokensCss(entry.id, detail.tokens));
      setCss('copied');
    } catch {
      setCss('failed');
    }
  }

  return (
    <section className="take-it" aria-labelledby="take-it-title">
      <h2 className="site-h2" id="take-it-title">
        {t('takeHeading')}
      </h2>
      <p className="site-lead">{fill(t('takeLead'), { name: entry.name[lang] })}</p>
      <CodeBlock code={INSTALL_COMMAND} {...copyProps(t, 'Shell')} />
      <CodeBlock code={installCode(entry.id, entry.fonts.length > 0)} {...copyProps(t, 'TSX')} />
      <p className="take-it__actions">
        <Button variant="secondary" onClick={copyCss}>
          {t(css === 'copied' ? 'cssCopied' : css === 'failed' ? 'cssFailed' : 'copyCss')}
        </Button>
        <a href={toHash(lang, '/agents')}>
          {t('agentsLink')}
          <span aria-hidden="true"> →</span>
        </a>
      </p>
    </section>
  );
}
```

`src/site/pages/StudyHome.tsx`: render `<TakeIt key={entry.id} entry={entry} />` after the work card, imported from `'../home/TakeIt'`. The component's docstring now reads: «The home page: the monument, the wall of components, the work's card and take-it.»

Append to `src/site/site.css`:
```css
/* ---- Home: take it ---- */
.take-it {
  display: grid;
  gap: var(--nbc-space-lg);
}
.take-it .site-h2 {
  margin: 0;
}
.take-it__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--nbc-space-md);
  margin: 0;
  font-weight: var(--nbc-weight-label);
}
@media (max-width: 639px) {
  .take-it__actions .nbc-button {
    inline-size: 100%;
  }
}
```

- [ ] **Step 4: Run it to see it pass**

Run: `npx vitest run src/site`
Expected: PASS.

- [ ] **Step 5: Lint and commit**

Run: `npm run lint && npm run typecheck`
Expected: clean.
```bash
git add src/site/home/TakeIt.tsx src/site/home/TakeIt.test.tsx src/site/pages/StudyHome.tsx src/site/i18n.ts src/site/site.css
git commit -m "feat(site): take it: install command, import lines and the theme's tokens as CSS"
```

---

### Task 11: Header: a phone bar with a menu, and a slim desktop bar on the home

**Files:**
- Modify: `src/site/Shell.tsx`, `src/site/site.css`, `src/site/i18n.ts`
- Create: `src/site/Shell.test.tsx`

**Interfaces:**
- Consumes:
  - `MONUMENT_NAV_ID` (Task 7);
  - `ThemeSwitcher`;
  - the library's `Dialog` and `Button`.
- Produces:
  - `.site-bar--home` with `data-revealed` set once the monument's bar has scrolled above the viewport;
  - `.site-bar__menu` (phone only);
  - `.site-menu` (the sheet);
  - `UI.menuOpen`, `UI.menuClose`.

- [ ] **Step 1: Write the failing test**

`src/site/Shell.test.tsx`:
```tsx
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { replaceHash } from './router';

const observed = new Map<Element, IntersectionObserverCallback>();
class FakeObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(element: Element) {
    observed.set(element, this.callback);
  }
  disconnect() {
    for (const [element, callback] of observed) if (callback === this.callback) observed.delete(element);
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

beforeEach(() => {
  localStorage.clear();
  observed.clear();
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('the shell', () => {
  it('opens a menu sheet from the bar and closes it when a link is followed', () => {
    replaceHash('#/es/library');
    render(<App />);
    const button = screen.getByRole('button', { name: 'Menú' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    const sheet = screen.getByRole('dialog', { name: 'Menú' });
    expect(sheet).toHaveAttribute('open');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const link = within(sheet).getByRole('link', { name: 'Archivo' });
    expect(link).toHaveAttribute('href', '#/es/atlas');
    fireEvent.click(link);
    expect(sheet).not.toHaveAttribute('open');
  });

  it('on the home, reveals its bar only once the monument’s sections have scrolled away', () => {
    replaceHash('#/es/');
    render(<App />);
    const bar = document.querySelector('.site-bar')!;
    expect(bar).toHaveClass('site-bar--home');
    expect(bar).not.toHaveAttribute('data-revealed');
    const nav = document.getElementById('monument-nav')!;
    act(() =>
      observed.get(nav)!([{ isIntersecting: false, target: nav, boundingClientRect: { top: -20 } } as unknown as IntersectionObserverEntry], {} as IntersectionObserver),
    );
    expect(bar).toHaveAttribute('data-revealed');
  });

  it('keeps the ordinary bar on other pages', () => {
    replaceHash('#/es/atlas');
    render(<App />);
    expect(document.querySelector('.site-bar')).not.toHaveClass('site-bar--home');
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/site/Shell.test.tsx`
Expected: FAIL, because there is no button named «Menú».

- [ ] **Step 3: Implement**

`src/site/i18n.ts`, under `// Shell`:
```ts
  menuOpen: { es: 'Menú', en: 'Menu' },
  menuClose: { es: 'Cerrar el menú', en: 'Close the menu' },
```

In `src/site/Shell.tsx`:
- Imports: add `useEffect, useState` from `'react'`, `Button, Dialog` from `'neobrutalistcomponents'`, and `MONUMENT_NAV_ID` from `'./home/Monument'`.
- Add above `Shell`:
  ```tsx
  /** On the home page: true once the monument's bottom bar has scrolled above the viewport. */
  function usePastMonument(home: boolean): boolean {
    const [past, setPast] = useState(false);
    useEffect(() => {
      const target = home ? document.getElementById(MONUMENT_NAV_ID) : null;
      if (!target || typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(([record]) => setPast(!record.isIntersecting && record.boundingClientRect.top < 0));
      observer.observe(target);
      return () => observer.disconnect();
    }, [home]);
    return home && past;
  }
  ```
- In `Shell`, after `const englishDocs = …`:
  ```tsx
  const home = route.name === 'study';
  const pastMonument = usePastMonument(home);
  const [menuOpen, setMenuOpen] = useState(false);
  ```
- Change the header's opening tag to:
  ```tsx
      <header className={home ? 'site-bar site-bar--home' : 'site-bar'} data-revealed={pastMonument ? '' : undefined}>
  ```
- Inside the header, after `<div className="site-bar__end">…</div>`, add:
  ```tsx
        <Button variant="secondary" size="sm" className="site-bar__menu" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
          {t('menuOpen')}
        </Button>
  ```
- After `</header>`, add the sheet. A click on any link inside closes it:
  ```tsx
      <Dialog open={menuOpen} onOpenChange={setMenuOpen} size="sm" className="site-menu" closeLabel={t('menuClose')}>
        <Dialog.Header>
          <Dialog.Title>{t('menuOpen')}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content
          onClick={(event) => {
            if ((event.target as Element).closest('a')) setMenuOpen(false);
          }}
        >
          <nav className="site-menu__nav" aria-label={t('navPrimary')}>
            {NAV.map((item) => (
              <a key={item.path} href={toHash(lang, item.path)} aria-current={item.match.includes(route.name) ? 'page' : undefined}>
                {t(item.key)}
              </a>
            ))}
          </nav>
          <ThemeSwitcher prefs={prefs} onChange={onPrefsChange} />
          <p className="site-menu__end">
            <a href={toHash(other, location.path, location.query)} hrefLang={other} lang={other}>
              {t('switchLanguage')}
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </p>
        </Dialog.Content>
      </Dialog>
  ```

Append to `src/site/site.css`:
```css
/* ---- Header: the phone bar and its menu; the home's slim desktop bar ---- */
.site-bar__menu {
  display: none;
}
@media (max-width: 639px) {
  .site-bar {
    flex-wrap: nowrap;
    box-sizing: border-box;
    min-block-size: 48px;
    padding-block: 2px;
    gap: var(--nbc-space-sm);
  }
  .site-brand__name {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  .site-bar .site-nav,
  .site-bar .site-bar__end {
    display: none;
  }
  .site-bar__menu {
    display: inline-flex;
    min-block-size: 44px;
    margin-inline-start: auto;
  }
}
.site-menu__nav {
  display: grid;
  gap: var(--nbc-space-xs);
  margin-block-end: var(--nbc-space-lg);
}
.site-menu__nav a {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-block-size: 44px;
  padding: 8px 12px;
  font-weight: var(--nbc-weight-label);
  text-decoration: none;
  border: var(--nbc-border-width) var(--nbc-border-style) transparent;
  border-radius: var(--nbc-radius-control);
}
.site-menu__nav a[aria-current='page'] {
  background: var(--nbc-surface);
  border-color: var(--nbc-border-color);
}
.site-menu__end {
  display: flex;
  flex-wrap: wrap;
  gap: var(--nbc-space-lg);
  margin: var(--nbc-space-lg) 0 0;
  font-weight: var(--nbc-weight-label);
}
@media (min-width: 640px) {
  .site-bar--home {
    position: fixed;
    inset-inline: 0;
    inset-block-start: 0;
    visibility: hidden;
    transform: translateY(-100%);
    transition: transform 200ms ease, visibility 0s linear 200ms;
  }
  .site-bar--home[data-revealed] {
    visibility: visible;
    transform: none;
    transition: transform 200ms ease;
  }
  .site-bar--home .site-switcher {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .site-bar--home,
  .site-bar--home[data-revealed] {
    transition: none;
  }
}
```

- [ ] **Step 4: Run it to see it pass**

Run: `npx vitest run src/site`
Expected: PASS, all site tests.

- [ ] **Step 5: Lint and commit**

Run: `npm run lint && npm run typecheck`
Expected: clean.
```bash
git add src/site/Shell.tsx src/site/Shell.test.tsx src/site/site.css src/site/i18n.ts
git commit -m "feat(site): one 48 px bar with a menu sheet on phones; on the home, a slim bar once the monument has passed"
```

---

### Task 12: End-to-end, the changelog, and the whole check

**Files:**
- Modify: `e2e/site.spec.ts`, `CHANGELOG.md`

- [ ] **Step 1: Write the end-to-end tests**

In `e2e/site.spec.ts`:
- Add `'/about'` to `MAIN_PAGES`, after `'/credits'`.
- Replace the test `'study home: the essay, then the gallery, one work per theme in date order, each linking to its room'` with:
```ts
test('home: the monument names the gallery, offers every theme, and a chip repaints the site', async ({ page }) => {
  await page.goto('?theme=classic#/es/');
  await expect(page.getByRole('heading', { level: 1, name: 'Galería de las Interfaces' })).toBeVisible();
  await expect(page).toHaveTitle('La Galería — neobrutalistcomponents');
  const ribbon = page.getByRole('group', { name: 'Temas' });
  await expect(ribbon.getByRole('button')).toHaveCount(CATALOG.length);
  await ribbon.getByRole('button', { name: 'Dragon Quest, 1986: usar este tema' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dragon-quest');
  await expect(page).toHaveURL(/[?&]theme=dragon-quest/);
  await expect(page.locator('.monument__work')).toContainText('Dragon Quest · Yuji Horii, Koichi Nakamura y equipo · 1986');
});

test('home: the ribbon paints its chips without fetching a study stylesheet, and asks only for subsets of their fonts', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  await page.goto('?theme=classic#/en/');
  await expect(page.locator('main h1')).toBeVisible();
  await page.waitForLoadState('networkidle');
  expect(requested.filter((url) => /\/(nakagin|dragon-quest|win95|maeusebunker)-[\w-]+\.css$/.test(url))).toEqual([]);
  const studyFonts = requested.filter((url) => url.includes('fonts.googleapis.com') && /DotGothic16|Dela\+Gothic/.test(url));
  expect(studyFonts.length).toBeGreaterThan(0);
  expect(studyFonts.every((url) => url.includes('text='))).toBe(true);
});

for (const [width, lines] of [[1280, 2], [360, 3]] as const) {
  test(`home: at ${width}px the title has ${lines} lines and each fitted line is as wide as the plate`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('?theme=classic#/es/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.fit-title__line')).toHaveCount(lines);
    await expect
      .poll(() =>
        page.locator('.fit-title').evaluate((title) => {
          const inner = title.clientWidth;
          const widths = [...title.querySelectorAll<HTMLElement>('[data-fit="true"]')].map((line) => line.getBoundingClientRect().width);
          return widths.every((w) => w <= inner + 1 && w >= inner * 0.97);
        }),
      )
      .toBe(true);
  });
}

test('home: under reduced motion the ribbon stands still', async ({ page }) => {
  await page.goto('?theme=classic#/en/');
  const track = page.locator('.ribbon__track');
  const before = await track.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1200);
  expect(await track.evaluate((el) => el.scrollLeft)).toBe(before);
});

test.describe('home without reduced motion', () => {
  test.use({ reducedMotion: 'no-preference' });
  test('the ribbon drifts, and holds while the pointer is on it', async ({ page }) => {
    await page.goto('?theme=classic#/en/');
    const track = page.locator('.ribbon__track');
    const start = await track.evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(1200);
    const drifted = await track.evaluate((el) => el.scrollLeft);
    expect(drifted - start).toBeGreaterThan(20);
    await track.hover();
    const held = await track.evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(800);
    expect(await track.evaluate((el) => el.scrollLeft)).toBe(held);
  });
});

test('home: on a desktop the bar hides behind the monument and appears once it has passed', async ({ page }) => {
  await page.goto('?theme=classic#/en/');
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('.site-bar')).toBeHidden();
  await page.locator('#take-it-title').scrollIntoViewIfNeeded();
  await expect(page.locator('.site-bar')).toBeVisible();
  await expect(page.locator('.site-bar').getByRole('link', { name: 'Archive' })).toBeVisible();
});

test.describe('home and menu on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the whole plate, its sections included, fits the first screen', async ({ page }) => {
    await page.goto('?theme=classic#/es/');
    await page.evaluate(() => document.fonts.ready);
    const bottom = await page.locator('#monument-nav').evaluate((nav) => nav.getBoundingClientRect().bottom);
    expect(bottom).toBeLessThanOrEqual(844);
  });

  test('the menu opens from the bar, holds the navigation, and Escape closes it back to its button', async ({ page }) => {
    await page.goto('?theme=classic#/es/library');
    const menu = page.getByRole('button', { name: 'Menú' });
    await menu.click();
    const sheet = page.getByRole('dialog', { name: 'Menú' });
    await expect(sheet.getByRole('link', { name: 'Archivo' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
    await expect(menu).toBeFocused();
  });

  for (const theme of ['dragon-quest', 'maeusebunker']) {
    test(`the home in ${theme} passes axe and never scrolls sideways`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(`?theme=${theme}#/es/`);
      await expect(page.locator('main h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    });
  }
});

test('about: the gallery essay, in its own page', async ({ page }) => {
  await page.goto('#/es/about');
  await expect(page.locator('main h1')).toHaveText('Sobre la galería');
  await expect(page.locator('.study-essay__text h2').first()).toHaveText('De dónde viene el nombre');
});
```

- [ ] **Step 2: Run the new and the touched end-to-end tests**

Run: `npx playwright test e2e/site.spec.ts -g "home|about|menu|main pages|production CSS|language routes" > .superpowers/e2e-home.log 2>&1; tail -40 .superpowers/e2e-home.log`
Expected: all pass. If one fails, read its error in the log, fix the code (never the expectation, unless the expectation contradicts the spec), and run again.

- [ ] **Step 3: The changelog**

At the top of `CHANGELOG.md`, under `# Changelog`, add:
```markdown
## Unreleased

### Changed
- Docs site: the home page is a monument. One plate in the active theme carries the gallery's name, fitted to the width in the theme's own display face, a drifting ribbon of every theme (each chip painted in its own tokens; pressing one repaints the whole site) and the work it is painted in. Below it: a wall of all sixteen components in that theme, the work's card (photo or documentary plate, authors, date, sources) and how to take the theme.
- Docs site: on phones the header is one 48 px bar with a menu sheet. On the home, the desktop bar appears once the monument has scrolled away.

### Added
- Docs site: an About page (`#/es/about`) holds the gallery essay that used to open the home.
- Docs site: code blocks copy in the page's language and select their text when the clipboard is unavailable.
```

- [ ] **Step 4: The whole check**

Run: `npm run check > .superpowers/check.log 2>&1; tail -30 .superpowers/check.log`
Expected: lint, typecheck, every Vitest test, both builds and the package check pass.

Run: `npx playwright test > .superpowers/e2e.log 2>&1; tail -30 .superpowers/e2e.log`
Expected: every test passes. If the machine is short on memory, run it in halves with `-g "theme "` and `-g "theme " --grep-invert`, or let CI's e2e job be the full run and say so.

Run: `git status --short`
Expected: only the intended changes. Revert any generated file that changed only in line endings (`git diff --ignore-cr-at-eol --stat` shows nothing for it).

- [ ] **Step 5: Commit**

```bash
git add e2e/site.spec.ts CHANGELOG.md
git commit -m "test(e2e): the monument, the ribbon, the phone menu and the About page; changelog"
```
