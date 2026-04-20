# neobrutalistcomponents v0.1.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relaunch the dormant `neobrutalistcomponents` library as a polished v0.1.0 — 3 deeply-refined React components (`Button`, `Input`, `Card`) with 4 swappable themes (`classic`, `tech`, `swiss`, `y2k`), a custom single-page landing with live theme switcher, tests, CI, and npm publication.

**Architecture:** CSS-variable tokens define a contract; each theme is a stylesheet that redefines those tokens under a `[data-theme="..."]` selector; components reference only `var(--nbc-*)`. An optional `NeoProvider` React wrapper sets `data-theme` and exposes `useTheme`. The lib ships from `src/lib/`; a separate site at `src/site/` is built independently for GitHub Pages.

**Tech Stack:** React 19 · TypeScript 5.8 (strict) · Vite 6 (lib + app modes) · Vitest + Testing Library + vitest-axe · GitHub Actions · npm

**Source spec:** `docs/superpowers/specs/2026-04-20-neobrutalistcomponents-v0.1-design.md`

---

## File structure at end of plan

```
.
├── .github/workflows/
│   ├── ci.yml
│   ├── deploy-pages.yml
│   └── publish.yml
├── LICENSE
├── README.md
├── docs/superpowers/{specs,plans}/...
├── src/
│   ├── lib/
│   │   ├── index.ts
│   │   ├── tokens.css
│   │   ├── NeoProvider.tsx
│   │   ├── NeoProvider.test.tsx
│   │   ├── Button/{Button.tsx, Button.css, Button.test.tsx, index.ts}
│   │   ├── Input/{Input.tsx, Input.css, Input.test.tsx, index.ts}
│   │   ├── Card/{Card.tsx, Card.css, Card.test.tsx, index.ts}
│   │   └── themes/{classic,tech,swiss,y2k}.css, index.ts
│   ├── site/
│   │   ├── App.tsx
│   │   ├── site.css
│   │   └── sections/{Nav,Hero,ThemesExplain,ButtonShowcase,InputShowcase,CardShowcase,BYOTheme,QuickStart,Footer,CodeBlock}.tsx
│   ├── main.tsx
│   └── test-setup.ts
├── vite.config.ts               # lib build
├── vite.site.config.ts          # site build
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── package.json
```

---

## Phase 1 · Foundation & housekeeping

### Task 1.1 · Initialize git and commit baseline

**Files:**
- Modify: `.gitignore` (already has `node_modules`, `dist`, `.superpowers/`)

- [ ] **Step 1: Verify `.gitignore` covers required entries**

Run:
```bash
cat .gitignore
```
Expected to contain lines: `node_modules`, `dist`, `.superpowers/`, `.DS_Store`. If `.superpowers/` is missing, add it now:

```bash
grep -q '^\.superpowers/$' .gitignore || printf '\n.superpowers/\n' >> .gitignore
```

- [ ] **Step 2: `git init`**

```bash
git init -b main
```

- [ ] **Step 3: Untrack the existing `dist/` directory from the tree (but keep the folder locally since it's in .gitignore it just won't be re-added)**

Nothing to remove yet (no commits). Just confirm `dist/` will be ignored:
```bash
git status --ignored | head -30
```
Expected: `dist/` appears under "Ignored files".

- [ ] **Step 4: Stage the current source (excluding ignored files) and commit the baseline**

```bash
git add .gitignore README.md eslint.config.js index.html package.json package-lock.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts public src docs
git commit -m "chore: baseline snapshot before v0.1 rewrite"
```

Expected: commit succeeds; `git log --oneline` shows one commit.

---

### Task 1.2 · Remove self-reference from package.json and delete stale App.tsx

**Files:**
- Modify: `package.json`
- Delete: `src/App.tsx`, `src/App.css`

- [ ] **Step 1: Remove the self-referencing dependency**

Edit `package.json` — remove the line:
```
"neobrutalistcomponents": "file:../neobrutalistcomponents/dist"
```
from the `dependencies` block. Leave `react`, `react-dom`, `vite-plugin-dts`.

After edit, `dependencies` should read:
```json
"dependencies": {
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "vite-plugin-dts": "^4.5.4"
}
```

- [ ] **Step 2: Delete the current demo App**

```bash
rm src/App.tsx src/App.css
```

(These will be replaced by the site in Phase 8. We remove them now so nothing imports the stale package self-reference.)

- [ ] **Step 3: Update `src/main.tsx` to a placeholder mounting empty root (temporary — replaced in Phase 8)**

Edit `src/main.tsx` to:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div>neobrutalistcomponents — site coming in Phase 8</div>
  </StrictMode>,
);
```

- [ ] **Step 4: Reinstall dependencies so the lockfile reflects the removed self-ref**

```bash
rm -rf node_modules package-lock.json
npm install
```

Expected: no warnings about the missing `neobrutalistcomponents` package.

- [ ] **Step 5: Confirm dev server still boots**

```bash
npm run dev
```
Browse to the printed URL; the placeholder text should appear without errors. Kill with `Ctrl-C`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/main.tsx
git rm src/App.tsx src/App.css
git commit -m "chore: remove self-referencing dependency and stale demo App"
```

---

### Task 1.3 · Add LICENSE (MIT)

**Files:**
- Create: `LICENSE`

- [ ] **Step 1: Write the MIT license text**

Create `LICENSE` with the following content (replace `Samuel Ballesteros` if you prefer a different copyright holder, and keep the current year `2026`):

```
MIT License

Copyright (c) 2026 Samuel Ballesteros

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Commit**

```bash
git add LICENSE
git commit -m "chore: add MIT license"
```

---

### Task 1.4 · Replace default README with a real one

**Files:**
- Overwrite: `README.md`

- [ ] **Step 1: Replace the Vite-template content**

Overwrite `README.md` with:

````markdown
# neobrutalistcomponents

Brutalist React components. Four flavors. One switch.

```bash
npm install neobrutalistcomponents
```

```tsx
import { NeoProvider, Button } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/themes/classic.css';

export function App() {
  return (
    <NeoProvider theme="classic">
      <Button>Click me</Button>
    </NeoProvider>
  );
}
```

**Themes:** `classic` · `tech` · `swiss` · `y2k` — import only the ones you use.

**Components in v0.1:** `Button`, `Input`, `Card`.

**Live demo:** https://samueldarioballesteros.github.io/neobrutalistcomponents (deployed after Phase 10).

## Development

```bash
npm install      # once
npm run dev      # run the landing/playground
npm run test     # run component tests
npm run build    # build lib + site
```

## License

MIT — see `LICENSE`.
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: replace template README with real library README"
```

---

## Phase 2 · Test infrastructure

### Task 2.1 · Install test dependencies

**Files:**
- Modify: `package.json` (devDependencies grow)

- [ ] **Step 1: Install Vitest + Testing Library + jsdom + axe**

```bash
npm install -D vitest@^2 @vitejs/plugin-react jsdom @testing-library/react@^16 @testing-library/jest-dom @testing-library/user-event vitest-axe
```

Note: `@vitejs/plugin-react` is already a devDependency; the command is idempotent.

- [ ] **Step 2: Verify the devDependencies in `package.json`**

Open `package.json` and confirm the following entries exist under `devDependencies` (exact minor versions may differ by resolution):
- `vitest`
- `jsdom`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `vitest-axe`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add test dependencies (vitest, RTL, axe)"
```

---

### Task 2.2 · Vitest config and setup file

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test-setup.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    css: true,
    include: ['src/lib/**/*.test.{ts,tsx}'],
  },
});
```

- [ ] **Step 2: Create `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';
```

- [ ] **Step 3: Add test scripts to `package.json`**

Replace the `scripts` block in `package.json` with:

```json
"scripts": {
  "dev": "vite --config vite.site.config.ts",
  "build:lib": "tsc -b && vite build",
  "build:site": "vite build --config vite.site.config.ts",
  "build": "npm run build:lib && npm run build:site",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "test": "vitest run",
  "test:watch": "vitest",
  "typecheck": "tsc --noEmit",
  "preview": "vite preview",
  "prepublishOnly": "npm run build:lib"
}
```

Note: `dev` now points at the site config (created in Phase 8). Running `npm run dev` before Phase 8 will fail — use `vite` directly until then if you need the dev server.

- [ ] **Step 4: Write a trivial sanity test to confirm the setup works**

Create `src/lib/_sanity.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('test setup sanity', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run tests to verify the infrastructure**

```bash
npm run test
```

Expected: 1 passing test, exit code 0.

- [ ] **Step 6: Delete the sanity test (not needed long-term)**

```bash
rm src/lib/_sanity.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts src/test-setup.ts package.json
git commit -m "test: wire up vitest with jsdom, jest-dom, and axe"
```

---

## Phase 3 · Tokens & themes

### Task 3.1 · Base tokens

**Files:**
- Create: `src/lib/tokens.css`

- [ ] **Step 1: Write `src/lib/tokens.css`**

```css
:root {
  /* Spacing — invariant across themes */
  --nbc-space-xs: 4px;
  --nbc-space-sm: 8px;
  --nbc-space-md: 12px;
  --nbc-space-lg: 18px;
  --nbc-space-xl: 24px;

  /* Font sizes — invariant across themes */
  --nbc-fs-xs: 12px;
  --nbc-fs-sm: 14px;
  --nbc-fs-md: 16px;
  --nbc-fs-lg: 18px;

  /* Typography — safe defaults (theme files override) */
  --nbc-font-sans: system-ui, sans-serif;
  --nbc-font-mono: ui-monospace, monospace;
  --nbc-weight-label: 600;
  --nbc-label-transform: none;
  --nbc-label-spacing: normal;

  /* Color (semantic) */
  --nbc-fg: #111;
  --nbc-fg-muted: #666;
  --nbc-bg: #fff;
  --nbc-surface: #fff;
  --nbc-primary: #111;
  --nbc-primary-fg: #fff;
  --nbc-danger: #c00;
  --nbc-danger-fg: #fff;
  --nbc-border-color: #111;
  --nbc-focus: #06f;

  /* Shape */
  --nbc-border-width: 2px;
  --nbc-border-style: solid;
  --nbc-radius: 0;

  /* Effects */
  --nbc-shadow: 3px 3px 0 var(--nbc-border-color);
  --nbc-shadow-lg: 6px 6px 0 var(--nbc-border-color);
  --nbc-rotate: 0deg;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/tokens.css
git commit -m "feat(lib): add base token contract with safe defaults"
```

---

### Task 3.2 · Theme type + index

**Files:**
- Create: `src/lib/themes/index.ts`

- [ ] **Step 1: Write the theme-name type**

```ts
export type NeoTheme = 'classic' | 'tech' | 'swiss' | 'y2k';

export const NEO_THEMES: readonly NeoTheme[] = ['classic', 'tech', 'swiss', 'y2k'] as const;
```

- [ ] **Step 2: Commit (not needed yet — bundle with next task's commit)**

---

### Task 3.3 · classic theme

**Files:**
- Create: `src/lib/themes/classic.css`

- [ ] **Step 1: Write the theme CSS**

```css
[data-theme="classic"] {
  --nbc-font-sans: 'Inter', system-ui, sans-serif;
  --nbc-font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --nbc-weight-label: 800;
  --nbc-label-transform: none;
  --nbc-label-spacing: -0.01em;

  --nbc-fg: #111;
  --nbc-fg-muted: #666;
  --nbc-bg: #f5f0e8;
  --nbc-surface: #fff;
  --nbc-primary: #ffd500;
  --nbc-primary-fg: #111;
  --nbc-danger: #ff5a5a;
  --nbc-danger-fg: #fff;
  --nbc-border-color: #111;
  --nbc-focus: #ffd500;

  --nbc-border-width: 3px;
  --nbc-border-style: solid;
  --nbc-radius: 0;

  --nbc-shadow: 5px 5px 0 var(--nbc-border-color);
  --nbc-shadow-lg: 8px 8px 0 var(--nbc-border-color);
  --nbc-rotate: 0deg;
}
```

---

### Task 3.4 · tech theme

**Files:**
- Create: `src/lib/themes/tech.css`

- [ ] **Step 1: Write the theme CSS**

```css
[data-theme="tech"] {
  --nbc-font-sans: 'JetBrains Mono', ui-monospace, monospace;
  --nbc-font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --nbc-weight-label: 600;
  --nbc-label-transform: uppercase;
  --nbc-label-spacing: 0.08em;

  --nbc-fg: #00ff88;
  --nbc-fg-muted: #4d7f66;
  --nbc-bg: #0a0a0a;
  --nbc-surface: #0f0f0f;
  --nbc-primary: #0a0a0a;
  --nbc-primary-fg: #00ff88;
  --nbc-danger: #ff3355;
  --nbc-danger-fg: #0a0a0a;
  --nbc-border-color: #00ff88;
  --nbc-focus: #00ff88;

  --nbc-border-width: 1px;
  --nbc-border-style: solid;
  --nbc-radius: 0;

  --nbc-shadow: 0 0 0 1px #00ff88, 4px 4px 0 #00ff88;
  --nbc-shadow-lg: 0 0 0 1px #00ff88, 8px 8px 0 #00ff88;
  --nbc-rotate: 0deg;
}
```

---

### Task 3.5 · swiss theme

**Files:**
- Create: `src/lib/themes/swiss.css`

- [ ] **Step 1: Write the theme CSS**

```css
[data-theme="swiss"] {
  --nbc-font-sans: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --nbc-font-mono: ui-monospace, monospace;
  --nbc-weight-label: 700;
  --nbc-label-transform: uppercase;
  --nbc-label-spacing: 0.15em;

  --nbc-fg: #111;
  --nbc-fg-muted: #666;
  --nbc-bg: #fff;
  --nbc-surface: #fff;
  --nbc-primary: #fff;
  --nbc-primary-fg: #111;
  --nbc-danger: #111;
  --nbc-danger-fg: #fff;
  --nbc-border-color: #111;
  --nbc-focus: #111;

  --nbc-border-width: 2px;
  --nbc-border-style: solid;
  --nbc-radius: 0;

  --nbc-shadow: none;
  --nbc-shadow-lg: none;
  --nbc-rotate: 0deg;
}
```

---

### Task 3.6 · y2k theme

**Files:**
- Create: `src/lib/themes/y2k.css`

- [ ] **Step 1: Write the theme CSS**

```css
[data-theme="y2k"] {
  --nbc-font-sans: 'Comic Sans MS', 'Chalkboard SE', cursive;
  --nbc-font-mono: ui-monospace, monospace;
  --nbc-weight-label: 700;
  --nbc-label-transform: none;
  --nbc-label-spacing: normal;

  --nbc-fg: #3a0068;
  --nbc-fg-muted: #7a5b92;
  --nbc-bg: #fff0fb;
  --nbc-surface: #fff;
  --nbc-primary: linear-gradient(135deg, #ff6ec7, #ffd86b);
  --nbc-primary-fg: #3a0068;
  --nbc-danger: #ff3388;
  --nbc-danger-fg: #fff;
  --nbc-border-color: #3a0068;
  --nbc-focus: #ff6ec7;

  --nbc-border-width: 3px;
  --nbc-border-style: dashed;
  --nbc-radius: 14px;

  --nbc-shadow: 5px 5px 0 var(--nbc-border-color);
  --nbc-shadow-lg: 10px 10px 0 var(--nbc-border-color);
  --nbc-rotate: -1.5deg;
}
```

- [ ] **Step 2 (after all four themes): Commit the full theme set**

```bash
git add src/lib/themes/
git commit -m "feat(lib): add all 4 theme stylesheets (classic, tech, swiss, y2k)"
```

---

## Phase 4 · NeoProvider + useTheme (TDD)

### Task 4.1 · Provider test file (failing)

**Files:**
- Create: `src/lib/NeoProvider.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NeoProvider, useTheme } from './NeoProvider';

function ThemeReader() {
  const theme = useTheme();
  return <span data-testid="theme">{theme ?? 'undefined'}</span>;
}

describe('NeoProvider', () => {
  it('sets data-theme on the rendered element', () => {
    const { container } = render(<NeoProvider theme="classic">x</NeoProvider>);
    expect(container.firstChild).toHaveAttribute('data-theme', 'classic');
  });

  it('exposes theme via useTheme()', () => {
    render(
      <NeoProvider theme="tech">
        <ThemeReader />
      </NeoProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('tech');
  });

  it('useTheme() returns undefined outside any provider', () => {
    render(<ThemeReader />);
    expect(screen.getByTestId('theme')).toHaveTextContent('undefined');
  });

  it('supports nested providers — inner wins', () => {
    render(
      <NeoProvider theme="classic">
        <NeoProvider theme="y2k">
          <ThemeReader />
        </NeoProvider>
      </NeoProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('y2k');
  });

  it('renders a custom element via `as` prop', () => {
    const { container } = render(
      <NeoProvider theme="classic" as="section">x</NeoProvider>,
    );
    expect((container.firstChild as HTMLElement).tagName).toBe('SECTION');
  });

  it('forwards className to the rendered element', () => {
    const { container } = render(
      <NeoProvider theme="classic" className="mine">x</NeoProvider>,
    );
    expect(container.firstChild).toHaveClass('mine');
  });
});
```

- [ ] **Step 2: Run tests; expect failure (module not found)**

```bash
npm run test
```

Expected: tests fail because `./NeoProvider` does not exist.

---

### Task 4.2 · Implement NeoProvider

**Files:**
- Create: `src/lib/NeoProvider.tsx`

- [ ] **Step 1: Write the implementation**

```tsx
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { NeoTheme } from './themes';

const ThemeContext = createContext<NeoTheme | undefined>(undefined);

export type { NeoTheme };

export interface NeoProviderProps {
  theme: NeoTheme;
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function NeoProvider({
  theme,
  children,
  as = 'div',
  className,
}: NeoProviderProps) {
  const Tag = as as React.ElementType;
  return (
    <ThemeContext.Provider value={theme}>
      <Tag data-theme={theme} className={className}>
        {children}
      </Tag>
    </ThemeContext.Provider>
  );
}

export function useTheme(): NeoTheme | undefined {
  return useContext(ThemeContext);
}
```

- [ ] **Step 2: Run tests**

```bash
npm run test
```

Expected: all 6 NeoProvider tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/lib/NeoProvider.tsx src/lib/NeoProvider.test.tsx src/lib/themes/index.ts
git commit -m "feat(lib): add NeoProvider and useTheme hook"
```

---

## Phase 5 · Button component (TDD)

### Task 5.1 · Button tests (failing)

**Files:**
- Create: `src/lib/Button/Button.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  it('defaults to variant=primary and size=md', () => {
    render(<Button>X</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/nbc-button--primary/);
    expect(btn.className).toMatch(/nbc-button--md/);
  });

  it.each(['primary', 'secondary', 'danger', 'ghost'] as const)(
    'applies variant class for %s',
    (variant) => {
      render(<Button variant={variant}>X</Button>);
      expect(screen.getByRole('button').className).toMatch(
        new RegExp(`nbc-button--${variant}`),
      );
    },
  );

  it.each(['sm', 'md', 'lg'] as const)('applies size class for %s', (size) => {
    render(<Button size={size}>X</Button>);
    expect(screen.getByRole('button').className).toMatch(
      new RegExp(`nbc-button--${size}`),
    );
  });

  it('sets aria-busy and disables when loading', () => {
    render(<Button loading>Go</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
  });

  it('disables when disabled prop is true', () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>X</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire onClick when loading', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>X</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies full-width class when fullWidth=true', () => {
    render(<Button fullWidth>X</Button>);
    expect(screen.getByRole('button').className).toMatch(
      /nbc-button--full-width/,
    );
  });

  it('renders leftIcon and rightIcon when not loading', () => {
    render(
      <Button
        leftIcon={<span data-testid="l" />}
        rightIcon={<span data-testid="r" />}
      >
        X
      </Button>,
    );
    expect(screen.getByTestId('l')).toBeInTheDocument();
    expect(screen.getByTestId('r')).toBeInTheDocument();
  });

  it('suppresses icons while loading (spinner takes over)', () => {
    render(
      <Button loading leftIcon={<span data-testid="l" />}>
        X
      </Button>,
    );
    expect(screen.queryByTestId('l')).not.toBeInTheDocument();
  });

  it('forwards arbitrary DOM props', () => {
    render(
      <Button data-testid="btn" aria-label="save" type="submit">
        X
      </Button>,
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveAttribute('aria-label', 'save');
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('merges consumer className with internal classes', () => {
    render(<Button className="mine">X</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('mine');
    expect(btn.className).toMatch(/nbc-button/);
  });

  it('has no a11y violations in the default render', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run; expect failure (module missing)**

```bash
npm run test
```

Expected: tests in `Button.test.tsx` fail because `./Button` doesn't exist.

---

### Task 5.2 · Implement Button

**Files:**
- Create: `src/lib/Button/Button.tsx`
- Create: `src/lib/Button/Button.css`

- [ ] **Step 1: Write `Button.tsx`**

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    'nbc-button',
    `nbc-button--${variant}`,
    `nbc-button--${size}`,
    fullWidth && 'nbc-button--full-width',
    loading && 'nbc-button--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="nbc-button__spinner" aria-hidden="true" />}
      {!loading && leftIcon && (
        <span className="nbc-button__icon" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children != null && <span className="nbc-button__label">{children}</span>}
      {!loading && rightIcon && (
        <span className="nbc-button__icon" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Write `Button.css`**

```css
.nbc-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--nbc-space-sm);
  font-family: var(--nbc-font-sans);
  font-weight: var(--nbc-weight-label);
  text-transform: var(--nbc-label-transform);
  letter-spacing: var(--nbc-label-spacing);
  border-width: var(--nbc-border-width);
  border-style: var(--nbc-border-style);
  border-color: var(--nbc-border-color);
  border-radius: var(--nbc-radius);
  box-shadow: var(--nbc-shadow);
  transform: rotate(var(--nbc-rotate));
  cursor: pointer;
  transition: none;
  line-height: 1.2;
  user-select: none;
}

.nbc-button:focus-visible {
  outline: 3px solid var(--nbc-focus);
  outline-offset: 2px;
}

.nbc-button:hover:not(:disabled) {
  transform: translate(3px, 3px) rotate(var(--nbc-rotate));
  box-shadow: 2px 2px 0 var(--nbc-border-color);
}

.nbc-button:disabled,
.nbc-button--loading {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.nbc-button--primary {
  background: var(--nbc-primary);
  color: var(--nbc-primary-fg);
}
.nbc-button--secondary {
  background: var(--nbc-surface);
  color: var(--nbc-fg);
}
.nbc-button--danger {
  background: var(--nbc-danger);
  color: var(--nbc-danger-fg);
}
.nbc-button--ghost {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
  color: var(--nbc-fg);
}

/* Sizes */
.nbc-button--sm {
  font-size: var(--nbc-fs-sm);
  padding: var(--nbc-space-xs) var(--nbc-space-md);
}
.nbc-button--md {
  font-size: var(--nbc-fs-md);
  padding: var(--nbc-space-sm) var(--nbc-space-lg);
}
.nbc-button--lg {
  font-size: var(--nbc-fs-lg);
  padding: var(--nbc-space-md) var(--nbc-space-xl);
}

/* Full width */
.nbc-button--full-width {
  width: 100%;
}

/* Spinner */
.nbc-button__spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: nbc-button-spin 0.7s linear infinite;
}

@keyframes nbc-button-spin {
  to { transform: rotate(360deg); }
}

.nbc-button__icon,
.nbc-button__label {
  display: inline-flex;
  align-items: center;
}
```

- [ ] **Step 3: Create Button barrel `src/lib/Button/index.ts`**

```ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
```

- [ ] **Step 4: Run tests**

```bash
npm run test
```

Expected: all Button tests pass. All NeoProvider tests still pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/Button/
git commit -m "feat(lib): add Button component with 4 variants, 3 sizes, loading, icons, fullWidth"
```

---

## Phase 6 · Input component (TDD)

### Task 6.1 · Input tests (failing)

**Files:**
- Create: `src/lib/Input/Input.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="type here" />);
    expect(screen.getByPlaceholderText('type here')).toBeInTheDocument();
  });

  it('renders a label and associates it via htmlFor', () => {
    render(<Input label="Email" id="e1" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'e1');
  });

  it('auto-generates an id when none is provided', () => {
    render(<Input label="Username" />);
    const input = screen.getByLabelText('Username');
    expect(input.id).toBeTruthy();
  });

  it('renders helperText when variant=default', () => {
    render(<Input label="X" helperText="we never share" />);
    expect(screen.getByText('we never share')).toBeInTheDocument();
  });

  it('sets aria-invalid when variant=error', () => {
    render(<Input label="X" variant="error" />);
    expect(screen.getByLabelText('X')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders errorMessage and hides helperText when variant=error', () => {
    render(
      <Input
        label="X"
        variant="error"
        helperText="neutral hint"
        errorMessage="bad input"
      />,
    );
    expect(screen.getByText('bad input')).toBeInTheDocument();
    expect(screen.queryByText('neutral hint')).not.toBeInTheDocument();
  });

  it('ignores errorMessage when variant=default', () => {
    render(
      <Input
        label="X"
        helperText="neutral hint"
        errorMessage="should not show"
      />,
    );
    expect(screen.queryByText('should not show')).not.toBeInTheDocument();
    expect(screen.getByText('neutral hint')).toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg'] as const)(
    'applies size class for %s on the wrapper',
    (size) => {
      const { container } = render(<Input label="X" size={size} />);
      expect(container.firstChild).toHaveClass(`nbc-input-wrap--${size}`);
    },
  );

  it('renders left and right icons', () => {
    render(
      <Input
        label="X"
        leftIcon={<span data-testid="l" />}
        rightIcon={<span data-testid="r" />}
      />,
    );
    expect(screen.getByTestId('l')).toBeInTheDocument();
    expect(screen.getByTestId('r')).toBeInTheDocument();
  });

  it('links aria-describedby to the helperText element when present', () => {
    render(<Input label="X" helperText="hint" />);
    const input = screen.getByLabelText('X');
    const descId = input.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId!)).toHaveTextContent('hint');
  });

  it('links aria-describedby to the errorMessage element when variant=error', () => {
    render(<Input label="X" variant="error" errorMessage="bad" />);
    const input = screen.getByLabelText('X');
    const descId = input.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId!)).toHaveTextContent('bad');
  });

  it('omits aria-describedby when no helper/error text is present', () => {
    render(<Input label="X" />);
    expect(screen.getByLabelText('X')).not.toHaveAttribute('aria-describedby');
  });

  it('forwards arbitrary input props', () => {
    render(
      <Input label="X" type="email" data-testid="em" placeholder="you@" />,
    );
    const input = screen.getByTestId('em');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'you@');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Input label="Email" helperText="we never share" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run; expect failure (module missing)**

```bash
npm run test
```

Expected: Input tests fail because `./Input` is not implemented.

---

### Task 6.2 · Implement Input

**Files:**
- Create: `src/lib/Input/Input.tsx`
- Create: `src/lib/Input/Input.css`
- Create: `src/lib/Input/index.ts`

- [ ] **Step 1: Write `Input.tsx`**

```tsx
import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './Input.css';

export type InputVariant = 'default' | 'error';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  variant = 'default',
  size = 'md',
  label,
  helperText,
  errorMessage,
  leftIcon,
  rightIcon,
  id: idProp,
  className,
  ...rest
}: InputProps) {
  const autoId = useId();
  const id = idProp ?? `nbc-input-${autoId}`;
  const isError = variant === 'error';

  const descText: ReactNode = isError ? errorMessage : helperText;
  const descId = descText != null && descText !== '' ? `${id}-desc` : undefined;

  const wrapClasses = [
    'nbc-input-wrap',
    `nbc-input-wrap--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapClasses}>
      {label != null && (
        <label className="nbc-input__label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`nbc-input__field nbc-input__field--${variant}`}>
        {leftIcon && (
          <span className="nbc-input__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className="nbc-input"
          aria-invalid={isError || undefined}
          aria-describedby={descId}
          {...rest}
        />
        {rightIcon && (
          <span className="nbc-input__icon" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {descText != null && descText !== '' && (
        <span
          id={descId}
          className={`nbc-input__desc nbc-input__desc--${isError ? 'error' : 'helper'}`}
        >
          {descText}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write `Input.css`**

```css
.nbc-input-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--nbc-space-xs);
  font-family: var(--nbc-font-sans);
  color: var(--nbc-fg);
}

.nbc-input__label {
  font-weight: var(--nbc-weight-label);
  font-size: var(--nbc-fs-sm);
  color: var(--nbc-fg);
  text-transform: var(--nbc-label-transform);
  letter-spacing: var(--nbc-label-spacing);
}

.nbc-input__field {
  display: flex;
  align-items: center;
  background: var(--nbc-surface);
  border-width: var(--nbc-border-width);
  border-style: var(--nbc-border-style);
  border-color: var(--nbc-border-color);
  border-radius: var(--nbc-radius);
  box-shadow: var(--nbc-shadow);
  gap: var(--nbc-space-xs);
  padding: 0 var(--nbc-space-sm);
}

.nbc-input__field--error {
  border-color: var(--nbc-danger);
  box-shadow: 4px 4px 0 var(--nbc-danger);
}

.nbc-input__field:focus-within {
  outline: 3px solid var(--nbc-focus);
  outline-offset: 2px;
}

.nbc-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
}

.nbc-input::placeholder {
  color: var(--nbc-fg-muted);
  opacity: 1;
}

.nbc-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nbc-input-wrap--sm .nbc-input {
  font-size: var(--nbc-fs-sm);
  padding: var(--nbc-space-xs) 0;
}
.nbc-input-wrap--md .nbc-input {
  font-size: var(--nbc-fs-md);
  padding: var(--nbc-space-sm) 0;
}
.nbc-input-wrap--lg .nbc-input {
  font-size: var(--nbc-fs-lg);
  padding: var(--nbc-space-md) 0;
}

.nbc-input__icon {
  color: var(--nbc-fg-muted);
  display: inline-flex;
  align-items: center;
}

.nbc-input__desc {
  font-size: var(--nbc-fs-xs);
  color: var(--nbc-fg-muted);
}
.nbc-input__desc--error {
  color: var(--nbc-danger);
  font-weight: var(--nbc-weight-label);
}
```

- [ ] **Step 3: Write `src/lib/Input/index.ts`**

```ts
export { Input } from './Input';
export type { InputProps, InputVariant, InputSize } from './Input';
```

- [ ] **Step 4: Run tests**

```bash
npm run test
```

Expected: all Input tests pass. Button + NeoProvider tests still pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/Input/
git commit -m "feat(lib): add Input with label, helperText, errorMessage, icons, sizes"
```

---

## Phase 7 · Card component (TDD)

### Task 7.1 · Card tests (failing)

**Files:**
- Create: `src/lib/Card/Card.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Card } from './Card';

describe('Card', () => {
  it('renders children inside the root', () => {
    render(<Card>hello</Card>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it.each(['default', 'elevated', 'interactive'] as const)(
    'applies variant class %s',
    (variant) => {
      const { container } = render(<Card variant={variant}>x</Card>);
      expect(container.firstChild).toHaveClass(`nbc-card--${variant}`);
    },
  );

  it('defaults to variant=default', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstChild).toHaveClass('nbc-card--default');
  });

  it('composes sub-components with correct semantics', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Title</Card.Title>
          <Card.Description>Desc</Card.Description>
        </Card.Header>
        <Card.Content>Body</Card.Content>
        <Card.Footer>Foot</Card.Footer>
      </Card>,
    );
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Title');
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Foot')).toBeInTheDocument();
  });

  it('forwards arbitrary props to the root element', () => {
    const { container } = render(<Card data-testid="c">x</Card>);
    expect(container.firstChild).toHaveAttribute('data-testid', 'c');
  });

  it('merges consumer className with internal classes', () => {
    const { container } = render(<Card className="mine">x</Card>);
    expect(container.firstChild).toHaveClass('mine');
    expect((container.firstChild as HTMLElement).className).toMatch(/nbc-card/);
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Heading</Card.Title>
          <Card.Description>Subtitle</Card.Description>
        </Card.Header>
        <Card.Content>Body copy.</Card.Content>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run; expect failure**

```bash
npm run test
```

Expected: Card tests fail because `./Card` is not implemented.

---

### Task 7.2 · Implement Card

**Files:**
- Create: `src/lib/Card/Card.tsx`
- Create: `src/lib/Card/Card.css`
- Create: `src/lib/Card/index.ts`

- [ ] **Step 1: Write `Card.tsx`**

```tsx
import type { HTMLAttributes } from 'react';
import './Card.css';

export type CardVariant = 'default' | 'elevated' | 'interactive';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

function CardRoot({
  variant = 'default',
  className,
  children,
  ...rest
}: CardProps) {
  const classes = ['nbc-card', `nbc-card--${variant}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['nbc-card__header', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={['nbc-card__title', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

function CardDescription({
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={['nbc-card__description', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['nbc-card__content', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['nbc-card__footer', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

type CardComponent = typeof CardRoot & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

export const Card = CardRoot as CardComponent;
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
```

- [ ] **Step 2: Write `Card.css`**

```css
.nbc-card {
  background: var(--nbc-surface);
  color: var(--nbc-fg);
  font-family: var(--nbc-font-sans);
  border-width: var(--nbc-border-width);
  border-style: var(--nbc-border-style);
  border-color: var(--nbc-border-color);
  border-radius: var(--nbc-radius);
  box-shadow: var(--nbc-shadow);
  overflow: hidden;
}

.nbc-card--elevated {
  box-shadow: var(--nbc-shadow-lg);
}

.nbc-card--interactive {
  cursor: pointer;
  transition: none;
}
.nbc-card--interactive:hover {
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0 var(--nbc-border-color);
}

.nbc-card__header {
  padding: var(--nbc-space-lg);
  border-bottom-width: var(--nbc-border-width);
  border-bottom-style: var(--nbc-border-style);
  border-bottom-color: var(--nbc-border-color);
}

.nbc-card__title {
  margin: 0 0 var(--nbc-space-xs);
  font-size: var(--nbc-fs-lg);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: inherit;
}

.nbc-card__description {
  margin: 0;
  font-size: var(--nbc-fs-sm);
  color: var(--nbc-fg-muted);
}

.nbc-card__content {
  padding: var(--nbc-space-lg);
  font-size: var(--nbc-fs-md);
  line-height: 1.5;
}

.nbc-card__footer {
  padding: var(--nbc-space-md) var(--nbc-space-lg);
  border-top-width: var(--nbc-border-width);
  border-top-style: var(--nbc-border-style);
  border-top-color: var(--nbc-border-color);
  display: flex;
  justify-content: flex-end;
  gap: var(--nbc-space-sm);
}
```

- [ ] **Step 3: Write `src/lib/Card/index.ts`**

```ts
export { Card } from './Card';
export type { CardProps, CardVariant } from './Card';
```

- [ ] **Step 4: Run tests**

```bash
npm run test
```

Expected: all Card tests pass. All previous tests still pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/Card/
git commit -m "feat(lib): add composable Card with default/elevated/interactive variants"
```

---

## Phase 8 · Public entry + package exports

### Task 8.1 · Library entry point

**Files:**
- Create: `src/lib/index.ts`

- [ ] **Step 1: Write the public barrel**

```ts
import './tokens.css';

export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Input } from './Input';
export type { InputProps, InputVariant, InputSize } from './Input';

export { Card } from './Card';
export type { CardProps, CardVariant } from './Card';

export { NeoProvider, useTheme } from './NeoProvider';
export type { NeoProviderProps } from './NeoProvider';

export type { NeoTheme } from './themes';
export { NEO_THEMES } from './themes';
```

Note: importing `./tokens.css` at the library entry ensures the base tokens load whenever any component is imported — no separate `core.css` import required from the consumer.

- [ ] **Step 2: Commit**

```bash
git add src/lib/index.ts
git commit -m "feat(lib): add public entry exporting all components, provider, tokens, theme type"
```

---

### Task 8.2 · Vite lib config + package.json exports

**Files:**
- Modify: `vite.config.ts`
- Create: `scripts/copy-themes.mjs`
- Modify: `package.json`

**Approach:** Vite's lib mode handles the JS entry + its imported CSS cleanly, but using CSS files as additional `lib.entry` values produces awkward JS stub emissions. Instead, we run one Vite lib build for the JS + base CSS, then a small Node script copies the four raw theme CSS files into `dist/themes/`. Predictable, minimal surface.

- [ ] **Step 1: Update `vite.config.ts`**

Replace the existing `vite.config.ts` with:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/lib'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'NeobrutalistComponents',
      formats: ['es', 'umd'],
      fileName: (format) => `neobrutalistcomponents.${format}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
        },
        assetFileNames: (asset) =>
          asset.name === 'style.css' ? 'neobrutalistcomponents.css' : 'assets/[name][extname]',
      },
    },
  },
});
```

This emits:
- `dist/neobrutalistcomponents.es.js` / `.umd.js`
- `dist/neobrutalistcomponents.css` (base tokens + all component CSS merged)
- `dist/index.d.ts` + `.d.ts` files per component

- [ ] **Step 2: Create the theme-copy script `scripts/copy-themes.mjs`**

```js
import { mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const srcDir = resolve(__dirname, '..', 'src/lib/themes');
const outDir = resolve(__dirname, '..', 'dist/themes');

mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(srcDir)) {
  if (file.endsWith('.css')) {
    copyFileSync(join(srcDir, file), join(outDir, file));
    console.log(`copied ${file}`);
  }
}
```

- [ ] **Step 3: Wire the script into `build:lib`**

In `package.json`, update the `build:lib` script to:

```json
"build:lib": "tsc -b && vite build && node scripts/copy-themes.mjs",
```

- [ ] **Step 4: Replace `package.json` lib metadata**

Set the following fields (leaving `scripts`, `dependencies`, `peerDependencies`, `devDependencies` intact except as noted):

```json
{
  "name": "neobrutalistcomponents",
  "version": "0.1.0",
  "description": "Brutalist React components. Four flavors. One switch.",
  "license": "MIT",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/neobrutalistcomponents.es.js",
      "require": "./dist/neobrutalistcomponents.umd.js"
    },
    "./neobrutalistcomponents.css": "./dist/neobrutalistcomponents.css",
    "./themes/classic.css": "./dist/themes/classic.css",
    "./themes/tech.css": "./dist/themes/tech.css",
    "./themes/swiss.css": "./dist/themes/swiss.css",
    "./themes/y2k.css": "./dist/themes/y2k.css"
  }
}
```

Drop the legacy `main` and `module` fields.

- [ ] **Step 5: Move `vite-plugin-dts` from `dependencies` to `devDependencies`**

It's a build-only tool. In `package.json`, cut it from `dependencies` and paste into `devDependencies`.

- [ ] **Step 6: Build the library**

```bash
rm -rf dist
npm run build:lib
```

Expected output in `dist/`:
- `neobrutalistcomponents.es.js`
- `neobrutalistcomponents.umd.js`
- `neobrutalistcomponents.css` (base tokens + component styles merged)
- `themes/classic.css`, `themes/tech.css`, `themes/swiss.css`, `themes/y2k.css`
- `index.d.ts` plus per-component `.d.ts` files

- [ ] **Step 7: Verify the output**

```bash
ls -la dist dist/themes
```

All expected files present. The theme CSS files should each be ≤ 1 kB (small token definitions).

- [ ] **Step 8: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 9: Update the README install snippet to reference the base CSS**

Since component styles live in `dist/neobrutalistcomponents.css` (not baked into the JS), consumers need to import it alongside any theme. Edit `README.md` to read:

```tsx
import { NeoProvider, Button } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/neobrutalistcomponents.css';
import 'neobrutalistcomponents/themes/classic.css';

export function App() {
  return (
    <NeoProvider theme="classic">
      <Button>Click me</Button>
    </NeoProvider>
  );
}
```

- [ ] **Step 10: Commit**

```bash
git add vite.config.ts scripts/copy-themes.mjs package.json package-lock.json README.md
git commit -m "build: emit theme CSS to dist/themes/, configure package exports"
```

---

## Phase 9 · Site / landing

### Task 9.1 · vite.site.config.ts

**Files:**
- Create: `vite.site.config.ts`

- [ ] **Step 1: Write the site-specific Vite config**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'site-dist',
    emptyOutDir: true,
  },
  base: './',
});
```

- [ ] **Step 2: Commit**

```bash
git add vite.site.config.ts
git commit -m "build: add site-mode vite config targeting site-dist/"
```

---

### Task 9.2 · site.css

**Files:**
- Create: `src/site/site.css`

- [ ] **Step 1: Write basic layout styles for the landing**

```css
:root {
  /* Site-local layout vars — independent of the library's tokens */
  --site-max-width: 960px;
  --site-gutter: 24px;
  --site-nav-height: 64px;
}

html, body, #root {
  margin: 0;
  padding: 0;
}

body {
  background: var(--nbc-bg);
  color: var(--nbc-fg);
  font-family: var(--nbc-font-sans);
  min-height: 100vh;
}

.site-root {
  min-height: 100vh;
}

.site-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--site-nav-height);
  padding: 0 var(--site-gutter);
  background: var(--nbc-surface);
  border-bottom: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
}

.site-nav__brand {
  font-weight: 900;
  letter-spacing: -0.03em;
  font-size: 18px;
  color: var(--nbc-fg);
  text-decoration: none;
}

.site-nav__version {
  font-family: var(--nbc-font-mono);
  font-size: 12px;
  color: var(--nbc-fg-muted);
  margin-left: 8px;
}

.site-nav__themes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.site-nav__theme-chip {
  font-family: var(--nbc-font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border: 2px solid var(--nbc-border-color);
  background: var(--nbc-surface);
  color: var(--nbc-fg);
  cursor: pointer;
  border-radius: var(--nbc-radius);
}
.site-nav__theme-chip[data-active="true"] {
  background: var(--nbc-primary);
  color: var(--nbc-primary-fg);
}

.site-main {
  max-width: var(--site-max-width);
  margin: 0 auto;
  padding: 48px var(--site-gutter);
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.site-section h2 {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}

.site-section p {
  font-size: 16px;
  line-height: 1.5;
  color: var(--nbc-fg-muted);
}

.site-codeblock {
  background: #0a0a0a;
  color: #ffd500;
  padding: 16px;
  font-family: var(--nbc-font-mono);
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  border: var(--nbc-border-width) var(--nbc-border-style) var(--nbc-border-color);
}

.site-showcase-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}
@media (max-width: 760px) {
  .site-showcase-grid { grid-template-columns: 1fr; }
}

.site-demo-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  padding: 16px 0;
}

.site-footer {
  padding: 32px var(--site-gutter);
  background: var(--nbc-fg);
  color: var(--nbc-bg);
  text-align: center;
  font-family: var(--nbc-font-mono);
  font-size: 12px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/site/site.css
git commit -m "feat(site): add base landing styles"
```

---

### Task 9.3 · CodeBlock helper

**Files:**
- Create: `src/site/sections/CodeBlock.tsx`

- [ ] **Step 1: Write the component**

```tsx
import type { PropsWithChildren } from 'react';

export function CodeBlock({ children }: PropsWithChildren) {
  return <pre className="site-codeblock">{children}</pre>;
}
```

---

### Task 9.4 · Nav section

**Files:**
- Create: `src/site/sections/Nav.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { NEO_THEMES } from '../../lib';
import type { NeoTheme } from '../../lib';

export function Nav({
  current,
  onChange,
}: {
  current: NeoTheme;
  onChange: (theme: NeoTheme) => void;
}) {
  return (
    <nav className="site-nav">
      <a href="/" className="site-nav__brand">
        neobrutalistcomponents
        <span className="site-nav__version">v0.1.0</span>
      </a>
      <div className="site-nav__themes">
        {NEO_THEMES.map((t) => (
          <button
            key={t}
            type="button"
            className="site-nav__theme-chip"
            data-active={t === current}
            onClick={() => onChange(t)}
          >
            {t}
          </button>
        ))}
        <a
          href="https://github.com/samueldarioballesteros/neobrutalistcomponents"
          className="site-nav__theme-chip"
          target="_blank"
          rel="noreferrer"
        >
          github ↗
        </a>
      </div>
    </nav>
  );
}
```

---

### Task 9.5 · Hero section

**Files:**
- Create: `src/site/sections/Hero.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Button } from '../../lib';
import { useState } from 'react';

export function Hero() {
  const [count, setCount] = useState(0);
  return (
    <section className="site-section">
      <h2>Brutalist components. Four flavors. One switch.</h2>
      <p>React 19 · CSS variables · SSR-safe · ~8 kB gz.</p>
      <div className="site-demo-row">
        <Button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </Button>
        <Button variant="secondary">Docs</Button>
        <Button variant="ghost">View source ↗</Button>
      </div>
    </section>
  );
}
```

---

### Task 9.6 · ThemesExplain section

**Files:**
- Create: `src/site/sections/ThemesExplain.tsx`

- [ ] **Step 1: Write the component**

```tsx
export function ThemesExplain() {
  return (
    <section className="site-section">
      <h2>4 themes, 1 library</h2>
      <p>
        Import just the themes you use. Switch them at runtime with{' '}
        <code>&lt;NeoProvider&gt;</code> or statically with a{' '}
        <code>data-theme</code> attribute anywhere in your DOM.
      </p>
    </section>
  );
}
```

---

### Task 9.7 · ButtonShowcase section

**Files:**
- Create: `src/site/sections/ButtonShowcase.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Button } from '../../lib';
import { CodeBlock } from './CodeBlock';

export function ButtonShowcase() {
  return (
    <section className="site-section">
      <h2>&lt;Button&gt;</h2>
      <p>4 variants · 3 sizes · loading · icons · fullWidth.</p>
      <div className="site-showcase-grid">
        <div>
          <div className="site-demo-row">
            <Button variant="primary">primary</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="danger">danger</Button>
            <Button variant="ghost">ghost</Button>
          </div>
          <div className="site-demo-row">
            <Button size="sm">sm</Button>
            <Button size="md">md</Button>
            <Button size="lg">lg</Button>
          </div>
          <div className="site-demo-row">
            <Button loading>loading</Button>
            <Button disabled>disabled</Button>
            <Button leftIcon="+">with icon</Button>
          </div>
          <div className="site-demo-row">
            <Button fullWidth>full width</Button>
          </div>
        </div>
        <CodeBlock>{`<Button variant="primary">Save</Button>
<Button variant="danger" size="lg">Delete</Button>
<Button loading>Submitting…</Button>
<Button leftIcon={<IconPlus />}>New</Button>
<Button fullWidth>CTA</Button>`}</CodeBlock>
      </div>
    </section>
  );
}
```

---

### Task 9.8 · InputShowcase section

**Files:**
- Create: `src/site/sections/InputShowcase.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Input } from '../../lib';
import { CodeBlock } from './CodeBlock';

export function InputShowcase() {
  return (
    <section className="site-section">
      <h2>&lt;Input&gt;</h2>
      <p>label · helperText · errorMessage · icons · 3 sizes.</p>
      <div className="site-showcase-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Email" placeholder="you@example.com" helperText="We never share." />
          <Input label="Username" defaultValue="brutalist-fan" size="lg" />
          <Input
            label="Password"
            type="password"
            variant="error"
            errorMessage="Minimum 8 characters."
          />
        </div>
        <CodeBlock>{`<Input
  label="Email"
  helperText="We never share."
  placeholder="you@example.com"
/>

<Input
  label="Password"
  type="password"
  variant="error"
  errorMessage="Minimum 8 characters."
/>`}</CodeBlock>
      </div>
    </section>
  );
}
```

---

### Task 9.9 · CardShowcase section

**Files:**
- Create: `src/site/sections/CardShowcase.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Card, Button } from '../../lib';
import { CodeBlock } from './CodeBlock';

export function CardShowcase() {
  return (
    <section className="site-section">
      <h2>&lt;Card&gt;</h2>
      <p>Composable. default · elevated · interactive.</p>
      <div className="site-showcase-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card variant="default">
            <Card.Header>
              <Card.Title>Plan Free</Card.Title>
              <Card.Description>Starter tier.</Card.Description>
            </Card.Header>
            <Card.Content>Basic features, no card required.</Card.Content>
          </Card>

          <Card variant="elevated">
            <Card.Header>
              <Card.Title>Plan Pro</Card.Title>
              <Card.Description>$29 / mo</Card.Description>
            </Card.Header>
            <Card.Content>Everything in Free, plus advanced features.</Card.Content>
            <Card.Footer>
              <Button>Subscribe</Button>
            </Card.Footer>
          </Card>

          <Card variant="interactive">
            <Card.Header>
              <Card.Title>Interactive</Card.Title>
              <Card.Description>Hover me.</Card.Description>
            </Card.Header>
            <Card.Content>Click targets wrap this yourself.</Card.Content>
          </Card>
        </div>
        <CodeBlock>{`<Card variant="elevated">
  <Card.Header>
    <Card.Title>Plan Pro</Card.Title>
    <Card.Description>$29 / mo</Card.Description>
  </Card.Header>
  <Card.Content>Everything in Free, plus advanced features.</Card.Content>
  <Card.Footer>
    <Button>Subscribe</Button>
  </Card.Footer>
</Card>`}</CodeBlock>
      </div>
    </section>
  );
}
```

---

### Task 9.10 · BYOTheme section

**Files:**
- Create: `src/site/sections/BYOTheme.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { CodeBlock } from './CodeBlock';

export function BYOTheme() {
  return (
    <section className="site-section">
      <h2>Bring your own theme</h2>
      <p>
        Define the token contract in your own CSS. Components read{' '}
        <code>var(--nbc-*)</code> and do not care where the values come from.
      </p>
      <CodeBlock>{`/* my-theme.css */
[data-theme="minimal"] {
  --nbc-font-sans: 'IBM Plex Sans', sans-serif;
  --nbc-fg: #111;
  --nbc-bg: #fff;
  --nbc-primary: #000;
  --nbc-primary-fg: #fff;
  --nbc-danger: #d00;
  --nbc-danger-fg: #fff;
  --nbc-border-color: #111;
  --nbc-border-width: 1px;
  --nbc-border-style: solid;
  --nbc-radius: 2px;
  --nbc-shadow: none;
  --nbc-shadow-lg: none;
  --nbc-rotate: 0deg;
  --nbc-focus: #000;
  --nbc-weight-label: 600;
  --nbc-label-transform: none;
  --nbc-label-spacing: normal;
}`}</CodeBlock>
    </section>
  );
}
```

---

### Task 9.11 · QuickStart section

**Files:**
- Create: `src/site/sections/QuickStart.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { CodeBlock } from './CodeBlock';

export function QuickStart() {
  return (
    <section className="site-section">
      <h2>Quick start</h2>
      <div className="site-showcase-grid">
        <div>
          <h3>Install</h3>
          <CodeBlock>npm install neobrutalistcomponents</CodeBlock>
        </div>
        <div>
          <h3>Use</h3>
          <CodeBlock>{`import { NeoProvider, Button } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/neobrutalistcomponents.css';
import 'neobrutalistcomponents/themes/classic.css';

<NeoProvider theme="classic">
  <Button>Hello</Button>
</NeoProvider>`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 9.12 · Footer section

**Files:**
- Create: `src/site/sections/Footer.tsx`

- [ ] **Step 1: Write the component**

```tsx
export function Footer() {
  return (
    <footer className="site-footer">
      MIT · Samuel Ballesteros · 2026 ·{' '}
      <a href="https://github.com/samueldarioballesteros/neobrutalistcomponents" style={{ color: 'inherit' }}>
        github
      </a>{' '}
      ·{' '}
      <a href="https://www.npmjs.com/package/neobrutalistcomponents" style={{ color: 'inherit' }}>
        npm
      </a>
    </footer>
  );
}
```

---

### Task 9.13 · App.tsx + main.tsx wiring

**Files:**
- Create: `src/site/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Write `src/site/App.tsx`**

```tsx
import { useState } from 'react';
import { NeoProvider } from '../lib';
import type { NeoTheme } from '../lib';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { ThemesExplain } from './sections/ThemesExplain';
import { ButtonShowcase } from './sections/ButtonShowcase';
import { InputShowcase } from './sections/InputShowcase';
import { CardShowcase } from './sections/CardShowcase';
import { BYOTheme } from './sections/BYOTheme';
import { QuickStart } from './sections/QuickStart';
import { Footer } from './sections/Footer';
import './site.css';

export function App() {
  const [theme, setTheme] = useState<NeoTheme>('classic');
  return (
    <NeoProvider theme={theme} className="site-root">
      <Nav current={theme} onChange={setTheme} />
      <main className="site-main">
        <Hero />
        <ThemesExplain />
        <ButtonShowcase />
        <InputShowcase />
        <CardShowcase />
        <BYOTheme />
        <QuickStart />
      </main>
      <Footer />
    </NeoProvider>
  );
}
```

- [ ] **Step 2: Update `src/main.tsx` to mount the site**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './site/App';

// Load all four themes upfront so the switcher can swap instantly.
import './lib/themes/classic.css';
import './lib/themes/tech.css';
import './lib/themes/swiss.css';
import './lib/themes/y2k.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 3: Run the dev server**

```bash
npm run dev
```

Expected: browser opens with the full landing; clicking any theme chip re-renders the whole page into that theme.

- [ ] **Step 4: Click through each theme manually**

Cycle `classic` → `tech` → `swiss` → `y2k`. Confirm:
- Fonts change.
- Colors change.
- Borders/shadows change.
- `y2k` rotates buttons slightly and uses dashed borders.
- No console errors.
- No layout collapses.

- [ ] **Step 5: Kill the dev server and commit**

```bash
git add src/site/ src/main.tsx
git commit -m "feat(site): add landing page with live theme switcher across 9 sections"
```

---

### Task 9.14 · Build the site to confirm the site config works

- [ ] **Step 1: Build the site**

```bash
rm -rf site-dist
npm run build:site
```

Expected: `site-dist/` contains `index.html`, asset files, no errors.

- [ ] **Step 2: Preview the built site**

```bash
npx vite preview --config vite.site.config.ts --outDir site-dist
```

Expected: the built page loads correctly; theme switcher still works.

- [ ] **Step 3: Add `site-dist/` to `.gitignore`**

```bash
grep -q '^site-dist$' .gitignore || printf '\nsite-dist\n' >> .gitignore
```

- [ ] **Step 4: Commit `.gitignore` change**

```bash
git add .gitignore
git commit -m "chore: ignore site-dist build output"
```

---

## Phase 10 · CI / GitHub Actions

### Task 10.1 · PR CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add lint/typecheck/test/build workflow on PR and main"
```

---

### Task 10.2 · Deploy-pages workflow

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: Deploy Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build:site
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site-dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "ci: deploy site to GitHub Pages on push to main"
```

---

### Task 10.3 · npm publish workflow

**Files:**
- Create: `.github/workflows/publish.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build:lib
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/publish.yml
git commit -m "ci: publish to npm when a v* tag is pushed"
```

---

## Phase 11 · Release

### Task 11.1 · Final local verification

- [ ] **Step 1: Clean slate**

```bash
rm -rf dist site-dist node_modules
npm ci
```

- [ ] **Step 2: Run the full pipeline locally**

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

Expected: all green.

- [ ] **Step 3: Inspect the built library**

```bash
ls -la dist dist/themes
```

Confirm the files listed in Task 8.2 Step 4 are all present.

- [ ] **Step 4: Commit any remaining changes (e.g. lockfile drift)**

```bash
git status
# if changes:
git add -A && git commit -m "chore: refresh lockfile"
```

---

### Task 11.2 · Push to GitHub and enable Pages

- [ ] **Step 1: Create a GitHub repo (empty, public)**

Via the `gh` CLI (if available):
```bash
gh repo create samueldarioballesteros/neobrutalistcomponents --public --source=. --remote=origin --push
```

Or manually: create `samueldarioballesteros/neobrutalistcomponents` on github.com, then:
```bash
git remote add origin git@github.com:samueldarioballesteros/neobrutalistcomponents.git
git push -u origin main
```

- [ ] **Step 2: Enable GitHub Pages with the GitHub Actions source**

In the repo Settings → Pages, set "Build and deployment" source to **GitHub Actions**. The `deploy-pages.yml` workflow will now run automatically on the next push to `main`.

- [ ] **Step 3: Trigger a deploy and verify**

Push a trivial commit or re-run the workflow from the Actions tab. Wait for it to finish; open the printed Pages URL.

Expected: landing loads correctly; theme switcher works.

---

### Task 11.3 · Configure npm auth and publish v0.1.0

- [ ] **Step 1: Add `NPM_TOKEN` secret to the GitHub repo**

In GitHub: Settings → Secrets and variables → Actions → New repository secret. Name: `NPM_TOKEN`. Value: a "Automation" token created on npmjs.com (requires an npm account).

- [ ] **Step 2: Verify the package name is available**

```bash
npm view neobrutalistcomponents
```

If the package exists and is owned by someone else, choose a scoped name (e.g., `@samueldario/neobrutalistcomponents`) and update `package.json`'s `name` field plus the README install command.

- [ ] **Step 3: Tag and push**

```bash
git tag v0.1.0
git push origin v0.1.0
```

Expected: the `publish.yml` workflow runs, passes CI, and publishes the package.

- [ ] **Step 4: Verify publication**

```bash
npm view neobrutalistcomponents@0.1.0
```

Expected: output lists the version, license MIT, exports map, and file list including `themes/*.css`.

---

### Task 11.4 · Smoke-test the published package

- [ ] **Step 1: Create a throwaway consumer project**

```bash
cd /tmp
mkdir nbc-smoke && cd nbc-smoke
npm create vite@latest . -- --template react-ts
npm install
npm install neobrutalistcomponents
```

- [ ] **Step 2: Replace `src/App.tsx` with a minimal integration**

```tsx
import { NeoProvider, Button, Input, Card } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/neobrutalistcomponents.css';
import 'neobrutalistcomponents/themes/classic.css';
import 'neobrutalistcomponents/themes/tech.css';
import { useState } from 'react';

export default function App() {
  const [theme, setTheme] = useState<'classic' | 'tech'>('classic');
  return (
    <NeoProvider theme={theme}>
      <button onClick={() => setTheme(theme === 'classic' ? 'tech' : 'classic')}>
        toggle theme ({theme})
      </button>
      <Card>
        <Card.Header>
          <Card.Title>Smoke test</Card.Title>
        </Card.Header>
        <Card.Content>
          <Input label="Name" placeholder="…" />
          <Button>Submit</Button>
        </Card.Content>
      </Card>
    </NeoProvider>
  );
}
```

- [ ] **Step 3: Run**

```bash
npm run dev
```

Expected: renders; theme toggle visibly changes the components.

- [ ] **Step 4: Clean up**

```bash
cd .. && rm -rf nbc-smoke
```

---

## Self-review checklist

Spec coverage — every spec section has at least one task:

| Spec § | Task | Status |
| --- | --- | --- |
| §3.1 Repository layout | 3.x + 4.x + 5.x + 6.x + 7.x + 8.1 + 9.x | ✓ |
| §3.2 Layering | 3.1 + 3.2-3.6 + 4.2 + 5.2 + 6.2 + 7.2 | ✓ |
| §3.3 Token flow | 3.1 + 3.3-3.6 + 5.2 + 6.2 + 7.2 | ✓ |
| §3.4 Bundle output | 8.2 | ✓ |
| §4.1 Two-level tokens | 3.1 + 3.3-3.6 | ✓ |
| §4.2 Contract | 3.3-3.6 | ✓ |
| §4.3 Gradients, sub-tokens, BYO | 3.6 (gradient), 9.10 (BYO showcase) | ✓ |
| §4.4 Theme identity | 3.3-3.6 | ✓ |
| §5.1 Button API | 5.1-5.2 | ✓ |
| §5.2 Input API | 6.1-6.2 | ✓ |
| §5.3 Card API | 7.1-7.2 | ✓ |
| §5.4 NeoProvider/useTheme | 4.1-4.2 | ✓ |
| §6 Landing + playground | 9.1-9.14 | ✓ |
| §7.1 Vite configs | 8.2, 9.1 | ✓ |
| §7.2 package.json exports | 8.2 | ✓ |
| §7.3 TypeScript strict | Already `strict: true` in baseline tsconfigs | ✓ |
| §8 Testing stack + coverage | 2.x + 4.x + 5.x + 6.x + 7.x | ✓ |
| §9 CI workflows | 10.1-10.3 | ✓ |
| §10 Migration phases A-F | 1.x / 2.x / 3.x-7.x / 2.x / 9.x / 10.x-11.x | ✓ |
| §11 Success criteria | 11.1-11.4 end-to-end verification | ✓ |

Type consistency: `ButtonProps`, `InputProps`, `CardProps`, `NeoProviderProps`, `NeoTheme` are declared in Tasks 5.2 / 6.2 / 7.2 / 4.2 / 3.2 and re-exported consistently in Task 8.1.

Placeholder scan: spot-checked. No "TBD", no "handle edge cases", no "similar to Task N" without code.
