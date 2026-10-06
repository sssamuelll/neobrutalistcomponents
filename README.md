# neobrutalistcomponents

**Components that hold their shape.** Sixteen brutalist React components on one token contract. Five core themes plus the themes of a study of neobrutalism, light and dark, and the same geometry in every one — documented for people and for the agents that build with them.

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

## Core themes

| Theme | Voice | Native scheme | Fonts |
| --- | --- | --- | --- |
| `classic` | This decision is final. Concrete, ink, sun-yellow, a double-stack shadow. | light | Bricolage Grotesque, Geist Mono |
| `tech` | Terminal sophistication. Phosphor on graphite; green-bar paper in light. | dark | Martian Mono, Geist Mono |
| `swiss` | Precision, not plainness. Hairlines, black, white, one oxblood. | light | Inter Tight, JetBrains Mono |
| `y2k` | Holographic trading-card energy. Foil, pills, chromatic shadows. | light | Sixtyfour, M PLUS Rounded 1c, VT323 |
| `riso` | Two inks, slightly off. Grain, fluorescent pink, Riso blue. | light | Archivo, IBM Plex Mono |

Every theme ships a full light **and** dark scheme. Leave `mode` unset for the native one, or pass `light`, `dark` or `system`. Providers nest — an inner provider is a self-contained island.

## The study

The site is also a study of neobrutalism in interfaces, in Spanish and English: [the study](https://sssamuelll.github.io/neobrutalistcomponents/#/en/) follows the style from *béton brut* to today's product design through four scenes — Japan, Germany, the United States and Latin America — and their origins. Each study theme reads one documented work, and its page cites the sources.

<!-- study-themes:start -->
| Theme | Reads | Scene | Native scheme |
| --- | --- | --- | --- |
| `maeusebunker` | Mäusebunker (former Central Animal Laboratories of the Free University of Berlin; Zentrale Tierlaboratorien der Freien Universität Berlin), Gerd Hänska, Magdalena Hänska, Kurt Schmersow, Lichterfelde, Berlin, Germany, 1971–1982 | Germany | dark |
| `nakagin` | Nakagin Capsule Tower (中銀カプセルタワービル), Kisho Kurokawa, Ginza, Tokyo, Japan, 1970–1972 | Japan | light |
| `sesc-pompeia` | SESC Pompéia (Centro de Lazer Fábrica da Pompéia), Lina Bo Bardi, André Vainer, Marcelo Carvalho Ferraz, Pompeia, São Paulo, Brazil, 1977–1986 | Latin America | light |
| `classifieds` | craigslist (classified-ads website), Craig Newmark, San Francisco, United States, 1995 | United States | light |
<!-- study-themes:end -->

Study themes are used exactly like the core ones:

```tsx
import 'neobrutalistcomponents/themes/nakagin.css';
import 'neobrutalistcomponents/themes/nakagin.fonts.css'; // optional: loads the theme's fonts

<NeoProvider theme="nakagin">{/* your app */}</NeoProvider>
```

Their catalog also ships as data for theme pickers: `import { STUDY_CATALOG } from 'neobrutalistcomponents/study'`.

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
