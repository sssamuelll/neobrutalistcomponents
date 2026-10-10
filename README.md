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
| `bauhaus-dessau` | Bauhaus Building, Dessau (Bauhausgebäude Dessau), Walter Gropius, Dessau, Germany, 1925–1926 | Germany | light |
| `din-1451` | DIN 1451, the German standard lettering (DIN-Schrift), Ludwig Goller, Germany, 1931–1936 | Germany | light |
| `maeusebunker` | Mäusebunker (former Central Animal Laboratories of the Free University of Berlin; Zentrale Tierlaboratorien der Freien Universität Berlin), Gerd Hänska, Magdalena Hänska, Kurt Schmersow, Lichterfelde, Berlin, Germany, 1971–1982 | Germany | dark |
| `munich-72` | Visual design of the 1972 Munich Olympic Games (Visuelles Erscheinungsbild der Olympischen Spiele München 1972), Otl Aicher, Munich, Germany, 1968–1972 | Germany | light |
| `carlton` | Carlton room divider, Ettore Sottsass, Milan, Italy, 1981 | Italy | light |
| `lettera-22` | Olivetti Lettera 22 portable typewriter, Marcello Nizzoli, Giuseppe Beccio, Ivrea, Italy, 1950 | Italy | light |
| `dragon-quest` | Dragon Quest (Famicom; ドラゴンクエスト), Yuji Horii, Koichi Nakamura, Akira Toriyama, Koichi Sugiyama, Japan, 1986 | Japan | dark |
| `nakagin` | Nakagin Capsule Tower (中銀カプセルタワービル), Kisho Kurokawa, Ginza, Tokyo, Japan, 1970–1972 | Japan | light |
| `super-mario-bros` | Super Mario Bros. (Famicom; スーパーマリオブラザーズ), Shigeru Miyamoto, Japan, 1985 | Japan | light |
| `tokyo-1964` | Poster for the Tokyo 1964 Olympic Games, Yusaku Kamekura, Tokyo, Japan, 1961 | Japan | light |
| `caracas-signage` | Signage and graphic identity of the Caracas metro (Metro de Caracas), Max Pedemonte, BMPT, Caracas, Venezuela, 1983 | Latin America | light |
| `create-two-three-many-vietnams` | Create two, three… many Vietnams (OSPAAAL poster), Alfredo Rostgaard, Cuba, 1967 | Latin America | light |
| `loteria` | Mexican lotería (the Don Clemente deck), Clemente Jacques, Mexico, 1887 | Latin America | light |
| `sesc-pompeia` | SESC Pompéia (Centro de Lazer Fábrica da Pompéia), Lina Bo Bardi, André Vainer, Marcelo Carvalho Ferraz, Pompeia, São Paulo, Brazil, 1977–1986 | Latin America | light |
| `amiga-os` | Amiga Workbench 1.3, Commodore-Amiga, RJ Mical, United States, 1988 | United States | light |
| `aqua` | Mac OS X (Aqua interface), Apple Computer, Cupertino, United States, 2000 | United States | light |
| `classifieds` | craigslist (classified-ads website), Craig Newmark, San Francisco, United States, 1995 | United States | light |
| `iphone-os` | iPhone OS 1 (the original iPhone’s interface), Apple Inc., Cupertino, United States, 2007 | United States | light |
| `mac-os-classic` | Mac OS System 7 (graphical user interface), Apple Computer, Cupertino, United States, 1991 | United States | light |
| `material-design` | Material Design (version 1), Google, Mountain View, United States, 2014 | United States | light |
| `nextstep` | NeXTSTEP, NeXT Computer, Keith Ohlfs, California, United States, 1989 | United States | light |
| `whaam` | Whaam!, Roy Lichtenstein, New York, United States, 1963 | United States | light |
| `win-xp` | Windows XP (Luna visual style), Microsoft, Redmond, United States, 2001 | United States | light |
| `win95` | Windows 95 (graphical user interface), Microsoft, Redmond, United States, 1995 | United States | light |
| `xerox-star` | Xerox Star (8010 Information System), David Canfield Smith, Charles Irby, Ralph Kimball, Bill Verplank, Eric Harslem, El Segundo and Palo Alto, United States, 1981 | United States | light |
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
