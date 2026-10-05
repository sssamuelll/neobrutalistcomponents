# Changelog

## 1.1.0 — 2026-10-05

The library becomes a study of neobrutalism in interfaces, in Spanish and English, and its first study themes ship on the same token contract.

### Added
- Four study themes, one per scene, each read from a documented work: `nakagin` (Nakagin Capsule Tower, Tokyo), `maeusebunker` (Mäusebunker, Berlin), `sesc-pompeia` (SESC Pompéia, São Paulo) and `classifieds` (craigslist, San Francisco). Use them like the core themes: `themes/<id>.css` plus `themes/<id>.fonts.css`.
- `neobrutalistcomponents/study`: the study's theme catalog as data (`STUDY_CATALOG`, `StudyThemeId`) for theme pickers.
- `llms.txt`, `llms-full.txt` and the `neobrutalist-ui` skill list the study themes with their references.
- Docs site in Spanish and English (`#/es/…`, `#/en/…`): the study's essays, four scenes and their origins, an atlas of every theme with facets and search, a page per theme with its reference, sources, specimen and contrast tables, the method and the credits.

### Changed
- The site's Themes page became the atlas and a page per theme. Old addresses (`#/themes`, `#/components/…`) redirect.
- Study theme stylesheets load only when a page shows them; atlas cards paint from catalog data.

## 1.0.1 — 2026-10-05

### Fixed
- Production CSS lost every token color: Vite's minifier lowered `light-dark()` into variables that the token-driven `color-scheme` never switched on, so borders, shadows and backgrounds vanished in `dist/styles.css` and on the docs site. CSS is now built for browsers with native `light-dark()` (Chrome/Edge 123, Firefox 128, Safari 17.5); `check-package` and the E2E suite guard against it.

## 1.0.0 — 2026-10-02

A rebuild for 2026. See [MIGRATION.md](./MIGRATION.md).

### Added
- 13 components: Textarea, Select, Checkbox, RadioGroup + Radio, Switch, Badge, Alert, Progress, Table, Kbd, Tabs, Dialog, Tooltip.
- New theme: **riso** (two-ink risograph zine).
- Light and dark for every theme via `light-dark()`; `NeoProvider mode` (`light` | `dark` | `system`).
- `Button asChild`, automatic icon-only buttons.
- Token contract with enforced WCAG AA contrast in both schemes.
- `themes/<name>.fonts.css` one-line font loaders.
- `llms.txt`, `llms-full.txt` and a Claude Code skill (`skills/neobrutalist-ui`).
- Docs site rebuilt: live examples with their exact source, token explorer, full-screen blocks.

### Changed
- CSS architecture: cascade layers (`nbc.tokens < nbc.theme < nbc.base < nbc.components < nbc.flourish`) and donut-`@scope`d theme flourishes.
- Themes refreshed: classic (concrete + cobalt), tech (light "green-bar paper"), swiss, y2k (Frutiger-Aero body font).
- Unified field API (`label`, `description`, `error`).
- Button defaults to `type="button"`.
- `useTheme()` returns `{ theme, mode }`.
- ESM only; Vite 8, TypeScript 6, React 19.3; bundle marked `'use client'`.

## 0.2.1
- Patch release. See git history.
