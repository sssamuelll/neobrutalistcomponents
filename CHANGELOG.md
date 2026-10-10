# Changelog

## 1.3.0 — 2026-10-10

Lettering and motion: every study theme documents the letters of its work, and the works that moved move. Thirteen new works, in every room.

### Added
- Thirteen study themes, each read from one documented work, with its lettering. Use them like the others: `themes/<id>.css` plus `themes/<id>.fonts.css`.
  - Japan: `tokyo-1964` (Yusaku Kamekura's poster for the Tokyo 1964 Olympics, 1961), `super-mario-bros` (Super Mario Bros., 1985), `dragon-quest` (Dragon Quest, 1986).
  - Latin America: `loteria` (the Mexican lotería deck, 1887), `create-two-three-many-vietnams` (Alfredo Rostgaard's OSPAAAL poster, 1967), `caracas-signage` (the Caracas metro's signage, 1983).
  - Italy: `lettera-22` (the Olivetti Lettera 22, 1950).
  - Germany: `din-1451` (DIN 1451, 1931–36), `munich-72` (the visual design of the Munich 1972 Olympics, 1966–72).
  - United States: `atari-gem` (GEM on the Atari ST, 1985), `win31` (Windows 3.1, 1992), `palm-os` (Palm OS on the Pilot, 1996), `beos` (BeOS 5, 2000).
  - Dragon Quest prints a dialog's text in steps, and GEM grows the dialog from a small box, as their sources describe; the timings are the themes'.
- Study: the sixteen themes document their work's lettering. Thirteen load a free face: the original where it is free (Roboto), otherwise one chosen for a stated resemblance or, where nothing documents the letters, for the reading; Carlton, Xerox Star and Classifieds keep the system's font. The six whose work moved (Mac OS System 7, Windows 95, Windows XP, Aqua, iPhone OS, Material Design) animate that movement on the components that can carry it, with timings each ficha marks as the theme's where no source gives one; the rest stand still apart from loading indicators. Every study theme now requires lettering, and a still work uses 0 ms. The theme page shows a motion specimen; `npm run check:links` checks sources, font licences and research quotes.
- Study: the ficha gains `lettering` (the original face, what was documented, the free substitute) and `motion` (documented movement), validated like the rest of the ficha. Themes may declare a `<id>.motion.css`, linted to 40 lines, five animatable properties and a `prefers-reduced-motion: no-preference` guard. `StudyType` gains `featureSettings`, `kerning` and `textRendering`. The theme page shows both sections.

### Changed
- Docs site: the Rooms page is a world map. Each room is a region on a dot map of Natural Earth's 1:110m geography in the Equal Earth projection; the legend beneath it lists rooms, works and years, and is the keyboard and screen-reader path. Pointing at a region or a row highlights both.
- Docs site: the home page shows the study's essay again, between the hero and the collection, and loads each work's theme as it nears the screen (453 KB on arrival instead of 1,057 KB).

### Fixed
- Docs site: fixed heavy weights (600, 700, `bold`) in the site's styles now follow the theme's label weight, so a single-weight face is never given a faked bold.
- Study: `mac-os-classic` turns ligatures off; Pixelify Sans drew fi and fl almost like an A.
- Study: a palette note's citation markers count as citations and must point to a source.
- Study: images under CC BY 1.0 and CC BY-SA 1.0 are accepted, like later versions.
- `npm run check:links` reads a new work's facts and palette quotes, and names the cause of a failed fetch.

## 1.2.0 — 2026-10-09

Twelve study themes and a fifth scene, Italy. The study now reads interfaces from the history of software too, not only neobrutalist ones.

### Added
- Twelve study themes, each read from one documented work. Use them like the others: `themes/<id>.css` plus `themes/<id>.fonts.css`.
  - United States: `whaam` (Roy Lichtenstein's *Whaam!*, 1963), `xerox-star` (Xerox Star, 1981), `amiga-os` (Amiga Workbench 1.3, 1988), `nextstep` (NeXTSTEP, 1989), `mac-os-classic` (Mac OS System 7, 1991), `win95` (Windows 95, 1995), `aqua` (Mac OS X's Aqua, 2000), `win-xp` (Windows XP's Luna, 2001), `iphone-os` (iPhone OS 1, 2007) and `material-design` (Material Design 1, 2014).
  - Germany: `bauhaus-dessau` (the Bauhaus building in Dessau, 1925–26).
  - Italy: `carlton` (Ettore Sottsass's Carlton room divider for Memphis, Milan, 1981).
- Docs site: an Italy scene, with an essay on the Torre Velasca, Olivetti's Elea 9003, Superstudio and Memphis.

### Changed
- `neobrutalistcomponents/study`: `StudyScene` gains `'italy'`. Code that switches exhaustively over scenes needs a case for it.
- Docs site: the home page is a gallery of every theme in date order, each shown in its own theme. Scenes are called rooms ("Salas").

### Fixed
- Docs site: the home page's kicker meets text contrast in every theme, and the home no longer scrolls sideways on a 360 px phone.
- Theme pages, `llms.txt`, `llms-full.txt` and the skill no longer wrap a reference's original title in a second parenthesis: "Mäusebunker (former Central Animal Laboratories of the Free University of Berlin; Zentrale Tierlaboratorien der Freien Universität Berlin)".
- The README's study table is generated from the catalog, like the skill's, and CI checks it for drift.
- Docs site: a theme page downloads its stylesheet once; the token tables read the theme's data chunk instead of a second copy of the stylesheet.
- Docs site: the Start page no longer scrolls sideways on a 360 px phone. The phone sweep now covers the components index, Blocks, Start and Agents, in both languages.
- Docs site: links in the docs examples open the site's pages in the reader's language, and an address without a language shows its page at once instead of a blank frame.
- Docs site: a new query on a theme, scene or component page no longer scrolls back to the top or resets the title.
- Docs site: no heading level is skipped on the atlas and on Blocks.
- Docs site: a section that fails to load is announced as an alert, and a theme page that fails to load links back to the atlas.
- Docs site: the theme switcher's titles follow the page's language.
- Docs site: Spanish decade labels keep the full year from 2000 on ("Años 2000", "Años 2010").
- Docs site: a typeface without a recorded licence can no longer stop the site from starting; only the Credits page's typefaces table would fail.

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
