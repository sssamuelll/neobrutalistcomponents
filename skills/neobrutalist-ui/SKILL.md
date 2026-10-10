---
name: neobrutalist-ui
description: Build React interfaces with the neobrutalistcomponents library — pick a theme, compose screens from its 16 components, and follow its composition rules. Use when a project depends on neobrutalistcomponents or the user asks for a brutalist / neobrutalist UI in React.
---

# Building with neobrutalistcomponents

The library is deterministic by design: one token contract, invariant control heights, closed variant sets. Follow these steps and two agents given the same brief produce the same screen.

## 1. Setup (once)

```tsx
import { NeoProvider } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/<theme>.css';
import 'neobrutalistcomponents/themes/<theme>.fonts.css'; // unless fonts are self-hosted

<NeoProvider theme="<theme>" mode="system">{app}</NeoProvider>
```

## 2. Pick the theme

| Theme | Choose for | Avoid for |
| --- | --- | --- |
| classic | SaaS products, dashboards, marketing — the default | quiet/regulated contexts |
| tech | developer tools, consoles, monitoring (dark native) | non-technical consumer audiences |
| swiss | dense admin, finance, docs, editorial | playful brands |
| y2k | playful consumer apps, creative tools, events | dense tables, long forms |
| riso | editorial, portfolios, newsletters, indie products | long transactional forms |

Pick one per product. Apps: `mode="system"`. Marketing pages: leave `mode` unset.

### Study themes

Each reads one documented work — a building, a magazine, a terminal, a website. Choose one when the brief names that work, its place or its period, and set it up exactly like a core theme with its id. Their pages cite the sources: https://sssamuelll.github.io/neobrutalistcomponents/#/en/atlas

<!-- study-themes:start -->
| Theme | Reference | Scene | Native scheme |
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

## 3. Compose

- Actions → `Button` (`primary` | `secondary` | `danger` | `ghost`; `size` sm/md/lg). One primary per region, placed last. Links that look like buttons: `<Button asChild><a href>…</a></Button>`.
- Text input → `Input` (one line) or `Textarea` (more). Choice from a list → `Select` (many options) or `RadioGroup` (2–5 visible options). Yes/no in a form → `Checkbox`; setting that applies instantly → `Switch`.
- Every field: `label` always, `description` for help, `error="what to do"` when invalid.
- Grouping → `Card` (+ `Card.Header/Title/Description/Content/Footer`). Never nest cards. Clickable card → `variant="interactive"` with a link inside `Card.Title`.
- Inline status → `Badge`. Block message → `Alert` (add `role="alert"`/`"status"` only when it appears dynamically).
- Numbers over time / quotas → `Progress`. Rows of records → `Table` (`numeric` cells for figures).
- Shortcuts → `Kbd`. Sections in one place → `Tabs`. Confirmations and focused tasks → controlled `Dialog` (`open` + `onOpenChange`). Naming icon-only buttons → `Tooltip` (still pass `aria-label`).

## 4. Rules

1. Never hard-code colors, fonts, borders or shadows; custom CSS reads `var(--nbc-*)` tokens.
2. Space only with `--nbc-space-xs/sm/md/lg/xl/2xl/3xl` (4/8/12/16/24/32/48px).
3. Controls in one row share one `size`.
4. Labels are verbs naming the outcome ("Save changes", "Delete project"), sentence case.
5. Destructive actions: `danger` button inside a `Dialog` confirmation.
6. Layout is yours: CSS grid/flex outside the components.
7. Override with plain CSS (the library is in cascade layers); never `!important`.

## 5. Reference

Full props, rules and example code for every component:
`node_modules/neobrutalistcomponents/dist/llms-full.txt` (or https://sssamuelll.github.io/neobrutalistcomponents/llms-full.txt).
