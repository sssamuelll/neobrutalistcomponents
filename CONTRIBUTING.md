# Contributing

Thanks for considering a contribution. This project is small and opinionated — a tight set of brutalist React components across five distinct themes, not a kitchen-sink library. Read this once before opening a PR; it'll save round-trips.

## Quick start

```bash
git clone https://github.com/sssamuelll/neobrutalistcomponents.git
cd neobrutalistcomponents
npm install
npm run dev
```

`npm run dev` serves the demo site at the URL Vite prints in the terminal (typically `http://localhost:5173`). The page reloads on any change to `src/lib/` or `src/site/`.

## Project structure

```
src/
  lib/                      # the published library
    <Component>/            # .tsx, .css (tokens only), .test.tsx, index.ts
    internal/               # Field shell, Slot/mergeProps, icons, hooks
    themes/<theme>/         # tokens.css + per-component flourishes (donut @scope), fonts.css, index.css
    themes/contract.ts      # the token contract every theme must satisfy
    tokens.css, base.css    # neutral defaults, schemes, reduced motion
    styles.css              # entry: layer order + imports
  docs/                     # metadata (meta/), live examples (examples/), blocks/, guide.ts
  site/                     # the docs site (GitHub Pages)
e2e/                        # Playwright + axe over every route × theme
scripts/                    # build-themes, gen-llms, check-package, screenshots, scope-flourishes
skills/neobrutalist-ui/     # agent skill shipped in the package
```

### Rules the tests enforce

- Component CSS uses only `var(--nbc-*)` — no hex, no `[data-theme]`.
- Theme personality lives in `src/lib/themes/<theme>/<Component>.css`, wrapped in
  `@scope ([data-theme="<theme>"]) to ([data-theme]:not([data-theme="<theme>"]))` with plain selectors; keyframes outside, named `nbc-<theme>-*`.
- Every theme defines every token in `themes/contract.ts`, and every text/background pair passes WCAG AA in light and dark.
- `src/docs/meta/<Component>.ts` lists exactly the own props of `<Component>Props` and at least two examples.

## Local gates

```bash
npm run check   # lint + typecheck + unit tests + build + package check
npm run e2e     # Playwright + axe (installs nothing; run `npx playwright install chromium` once)
npm run gen:llms  # regenerate public/llms*.txt and the study tables of SKILL.md and README.md after changing metadata, examples or study themes
```

## Testing expectations

Every component in `src/lib/` has a sibling `*.test.tsx` using `@testing-library/react`. New components are expected to follow the same pattern: a `.test.tsx` covering public props, accessibility behavior (focus, keyboard, ARIA), and any variant logic. Component tests are the gate — if a change to a component lands without updating or extending its tests, the PR is not ready.

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org/). The prefixes used in this repo:

- `feat:` — new component, new public prop, new theme
- `fix:` — bug fix in existing behavior
- `chore:` — release bumps, package metadata, tooling
- `docs:` — README, CONTRIBUTING, this file
- `ci:` — workflow changes
- `refactor:` — internal restructuring with no behavior change

Scope is optional but useful: `fix(button): handle disabled+loading combo`. PRs are squash-merged, so the PR title becomes the commit message — write it in this format from the start.

## Branch naming

Kebab-case, prefixed by intent:

- `feat/<thing>` — `feat/select-component`
- `fix/<thing>` — `fix/input-focus-ring-swiss`
- `chore/<thing>` — `chore/bump-vite-6`
- `docs/<thing>` — `docs/contributing`

Include the issue number when there is one: `chore/contributing-and-templates-12`.

## Pull request flow

1. Branch off `main`.
2. Make the change. Keep the diff focused — one concern per PR.
3. Run the four local gates listed above.
4. Open the PR. The `.github/pull_request_template.md` will pre-fill the body; tick the checklist honestly.
5. **Visual changes:** attach screenshots showing the change in all four themes (`classic`, `tech`, `swiss`, `y2k`). Side-by-side or one image per theme — either works.
6. CI must be green before merge. Don't bypass hooks (`--no-verify`) to push past failures — fix the underlying issue.

## Theme contributions

A theme is a CSS file under `src/lib/themes/` that overrides the token contract defined in `src/lib/tokens.css`, under a `[data-theme="<name>"]` selector. A new theme must:

1. Define **every** required token in the contract (see the checklist in `.github/ISSUE_TEMPLATE/theme_contribution.md`). Missing tokens fall back to the base values in `tokens.css` and usually look broken.
2. Declare its font families in the theme file (e.g. `--nbc-font-sans: 'Whatever', system-ui, sans-serif;`). The library does not load fonts — your README addition should document which families the theme expects.
3. Render correctly across all three components (`Button`, `Input`, `Card`) in their typical states (default, hover, focus, disabled, error where applicable).
4. Be visually distinct from the four existing themes. "Slight tweak of classic" is a variant, not a new theme — open it as a discussion first.

Before writing code, open a `theme_contribution.md` issue with mockups. Bikeshedding visual identity in an issue is faster than in a PR.

## Where to find the spec

The design and component contract live in `docs/superpowers/specs/`. The v0.1 spec — which explains the token system and which decisions are intentional — is `docs/superpowers/specs/2026-04-20-neobrutalistcomponents-v0.1-design.md`. Read it before changing the public API surface.

## License

MIT — see `LICENSE`. By submitting a contribution you agree it can be released under that license.
