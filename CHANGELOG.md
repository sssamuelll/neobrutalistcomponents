# Changelog

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
