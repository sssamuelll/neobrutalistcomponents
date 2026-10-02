# neobrutalistcomponents

**Components that hold their shape.** Sixteen brutalist React components on one token contract. Five themes, light and dark, and the same geometry in every one — documented for people and for the agents that build with them.

```bash
npm install neobrutalistcomponents
```

```tsx
import { NeoProvider, Button } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/classic.css';
import 'neobrutalistcomponents/themes/classic.fonts.css'; // optional: loads the theme's fonts

export function App() {
  return (
    <NeoProvider theme="classic" mode="system">
      <Button>Save changes</Button>
    </NeoProvider>
  );
}
```

**Docs and live playground:** https://sssamuelll.github.io/neobrutalistcomponents — the whole site re-renders in the theme you pick.

## What's inside

| Group | Components |
| --- | --- |
| Actions | `Button` (with `asChild`) |
| Forms | `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup` + `Radio`, `Switch` |
| Display | `Card`, `Badge`, `Alert`, `Progress`, `Table`, `Kbd` |
| Overlays | `Tabs`, `Dialog`, `Tooltip` |

## Themes

| Theme | Voice | Native scheme | Fonts |
| --- | --- | --- | --- |
| `classic` | This decision is final. Concrete, ink, sun-yellow, a double-stack shadow. | light | Bricolage Grotesque, Geist Mono |
| `tech` | Terminal sophistication. Phosphor on graphite; green-bar paper in light. | dark | Martian Mono, Geist Mono |
| `swiss` | Precision, not plainness. Hairlines, black, white, one oxblood. | light | Inter Tight, JetBrains Mono |
| `y2k` | Holographic trading-card energy. Foil, pills, chromatic shadows. | light | Sixtyfour, M PLUS Rounded 1c, VT323 |
| `riso` | Two inks, slightly off. Grain, fluorescent pink, Riso blue. | light | Archivo, IBM Plex Mono |

Every theme ships a full light **and** dark scheme. Leave `mode` unset for the native one, or pass `light`, `dark` or `system`. Providers nest — an inner provider is a self-contained island.

## Why it stays deterministic

- **One token contract.** Every visual decision is a `--nbc-*` custom property; every built-in theme defines all of them, in both schemes, and a test enforces WCAG AA contrast for every text/background pair.
- **Invariant geometry.** Controls share one height scale (32 / 40 / 48px) in every theme. Switching themes never moves your layout.
- **Cascade layers.** The library lives in `@layer nbc.*`, so any plain rule in your CSS wins — no `!important`, no specificity fights.
- **Donut-scoped themes.** Theme flourishes use `@scope … to (…)`, so nested islands never leak into each other.
- **Built on the platform.** Native `<dialog>`, the Popover API with CSS anchor positioning, `field-sizing: content`, `appearance: base-select`, `light-dark()`. No runtime dependencies. RSC-ready (`'use client'`).

## For agents

`llms.txt` and `llms-full.txt` (every component, prop, rule and example source) ship inside the package and on the site, generated from the same metadata the docs render. A Claude Code skill lives in `skills/neobrutalist-ui/`:

```bash
cp -R node_modules/neobrutalistcomponents/skills/neobrutalist-ui ~/.claude/skills/
```

## Upgrading from 0.2

See [MIGRATION.md](./MIGRATION.md). Short version: import `styles.css` + a theme, Input's `variant="error"`/`errorMessage`/`helperText` became `error`/`description`, Button defaults to `type="button"`, `useTheme()` returns `{ theme, mode }`, ESM only.

## Development

```bash
npm install
npm run dev          # docs site at localhost:5173
npm test             # unit + a11y + token contract + docs drift
npm run e2e          # Playwright + axe over every route × theme
npm run check        # lint, typecheck, test, build, package check
npm run screenshots  # local visual review into .screenshots/
```

## License

MIT — see `LICENSE`.
