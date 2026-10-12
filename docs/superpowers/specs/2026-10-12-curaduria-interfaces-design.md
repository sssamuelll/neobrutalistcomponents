# neobrutalistcomponents · Curating the gallery to graphical interfaces — Design

**Date:** 2026-10-12
**Owner:** Samuel Ballesteros (SDB)
**Author:** Claude, brainstormed with the owner in an interactive session. Each section below was presented and approved one at a time.
**Status:** Draft for owner review. Sub-project 1 of 4 (§2). Changes what the study collects; the token contract, the components and the ficha format stay as they are.

---

## 1. Intent (in the owner's words)

> "necesito curar la galeria, y que solo queden trabajos que tengan sentido de existir dentro de ella. quiero no manejar una coleccion infinita de themes, quiero mas bien que profundisemos en la historia de las interfaces graficas. es un objeto de estudio. por lo que hay que tomarlo con muchisima seriedad"
> "al final quiero ser el imdb de las interfaces"

Decisions the owner took, in order:

| Question | Owner's answer |
|---|---|
| What decides whether a work stays | **Only interfaces:** software someone operated on a screen. Precursors (Bauhaus, Aicher, Swiss typography) are told in essays with sources, never as themes. Video games are out. |
| How the gallery is walked | **By era, by movement and by region** — the long-term aim is an IMDb of interfaces. Eras and movements belong to sub-projects 2–3; this one keeps regions. |
| Ficha versus theme | **Separate them** (sub-project 2): the catalog may grow large; only canonical works, ones that fixed a visual language, are painted as themes. |
| Order | **Curation first.** |
| The five core themes | **Stay as a room of their own**, presented as the library's readings, not as history. |
| Retired themes in npm | **Deprecated in 1.4, removed in 2.0.** |
| §3, §4, §5 below | Approved as presented ("perfecto"). |

What was *assumed* and is stated here for the owner to correct:
- The neobrutalism study's centre ("El neobrutalismo es el centro de la colección") is replaced: the object is the history of the graphical interface, and neobrutalism is its most recent chapter.
- The existing rigour holds unchanged: two sources per ficha with at least one outside Wikipedia, Commons images under CC0 / public domain / CC BY / CC BY-SA, WCAG 2.2 contrast in both schemes.

## 2. The four sub-projects

Each gets its own spec, plan and implementation.

1. **Curation** (this document): retire the works that are not interfaces, give the core themes their room, rewrite the gallery essay.
2. **Data model:** separate ficha from theme; add era, movement and region as axes; make people and companies linkable entities. Ships as **2.0.0** together with the removal in §4.3, so the package breaks once.
3. **Navigation:** views by era, movement and region; person and company pages; the world map's future.
4. **Content:** research the missing fichas a serious history needs (Sketchpad, NLS, the Alto, Lisa, the 1984 Macintosh, Windows 1.0, Motif, GEOS, Newton, Metro, iOS 7…). The real constraint is that Commons holds few freely licensed screenshots.

## 3. What hangs, and where

### 3.1 The United States room — 14 works, stays

`xerox-star` (1981), `atari-gem` (1985), `amiga-os` (1988), `nextstep` (1989), `mac-os-classic` (1991), `win31` (1992), `win95` (1995), `classifieds` (1995), `palm-os` (1996), `beos` (2000), `aqua` (2000), `win-xp` (2001), `iphone-os` (2007), `material-design` (2014).

### 3.2 The house — the 5 core themes, stays

The `origins` scene already holds `classic`, `tech`, `swiss`, `y2k` and `riso` with the `origins` essay (béton brut, the New Brutalism, Deville's Brutalist Websites). It stays, under a new display name: **«La casa» / «The house»**. In a gallery of interface history, "Origins" promises Sketchpad. The essay now explains where the *library's* name comes from, not where the history starts. The scene id `origins` and its route stay; only the label and the essay's framing change.

### 3.3 Retired — 15 works

| Reason | Ids |
|---|---|
| Not a graphical interface (13) | `bauhaus-dessau`, `maeusebunker`, `nakagin`, `sesc-pompeia`, `carlton`, `lettera-22`, `din-1451`, `munich-72`, `tokyo-1964`, `caracas-signage`, `create-two-three-many-vietnams`, `loteria`, `whaam` |
| A video game (2) | `dragon-quest`, `super-mario-bros` |

### 3.4 Regions

Region stays an axis of the model. On the map only the United States is lit for now. The Germany, Italy, Japan and Latin America rooms switch off with their scene essays (`scene-germany`, `scene-italy`, `scene-japan`, `scene-latam`), which leave the site and stay in git history. They return when sub-project 4 brings interfaces from those regions (i-mode or BTRON in Japan, for instance). No empty room is ever shown.

### 3.5 Old URLs

A retired work's URL (`#/…/study/bauhaus-dessau`) and a switched-off room's URL fall to the existing not-found page. No public deaccession page (YAGNI); it can be added if the owner wants a record of what left.

## 4. Deprecation in npm (1.4) and removal (2.0)

### 4.1 One list

`src/study/retired.ts` maps each of the 15 ids to its reason (`not-an-interface` or `video-game`). The 15 theme files are not edited. In 2.0 the list and the files are deleted and nothing else needs cleaning.

### 4.2 What the list does in 1.4

- **Site:** the site catalog filters retired ids out. They leave the atlas, the home ribbon and wall, the rooms, the theme picker and the Credits page. Their photographs leave every page (they live in the site, never in the package). Until 2.0 deletes the files, the build may still emit their stylesheets and photographs as unlinked assets; no page references them.
- **Package:** the 15 stylesheets still compile into `dist/themes/`, each opening with `/* Deprecated in 1.4.0, removed in 2.0.0: <reason>. */`.
- **`./study` module:** retired entries carry `deprecated: true`.
- **`llms.txt` / `llms-full.txt`:** retired themes are listed apart, as retired, so no agent recommends them.
- **README:** the generated study-themes table lists only current works. **CHANGELOG:** names the 15 ids.

### 4.3 What 2.0 does

Deletes the 15 theme files, their signature and motion CSS, their images and `retired.ts`. MIGRATION.md names each retired id and says: copy the stylesheet from 1.4 into your project if you need it — each theme is self-contained. No invented "closest replacement": a Bauhaus building is not replaced by `swiss`.

### 4.4 Branch

`feat/home-monumento` is not yet in main, and its ribbon and wall read the catalog. It is finished and merged first; curation is rebased onto main after it.

## 5. Essays

| Essay | Change |
|---|---|
| `home` (es, en) | **Rewritten** from the object of study: what counts here as a graphical interface, why it is studied, how the gallery is walked. Neobrutalism becomes the latest chapter. Every historical claim carries its source. The draft is shown to the owner before it is committed — it is the site's voice. |
| `method` | Only the paragraph on what counts as a work: "un edificio, una publicación, un objeto, un sitio web" becomes interfaces. Source, image and contrast rules unchanged. |
| `scene-usa` | **Rewritten** as the essay of the United States room of interfaces, same process as `home`. *Changed while planning:* §5 was approved as "reviewed; Whaam! removed", but the essay's sections are «Brutalismo vernáculo», «La letra suelta» (Emigre, Ray Gun) and «El neobrutalismo de producto» — none is about interfaces, so a cut would leave nothing. |
| `origins` | Moves into the house (§3.2); no change of substance. |
| `scene-germany`, `scene-italy`, `scene-japan`, `scene-latam` | Leave the site (§3.4). |

New sources go through the dossier protocol: `scripts/check-links.mjs` on every URL, then a fresh Opus review of the essay against its sources before publication.

## 6. Verification

New unit tests:
- every id in `retired.ts` exists in the registry (no ghost entries);
- no retired id appears in the site catalog;
- no room without works is shown;
- every retired stylesheet in `dist/themes/` opens with the deprecation comment;
- every retired entry in the `./study` catalog has `deprecated: true`.

Existing tests that count works or name retired ids (the Japan room e2e, the timeline, the home wall, the atlas scene filter) are adjusted, each with a reason. None is deleted blindly.

Gates: `npm test`, the Playwright e2e, the site build and the library build. Then a manual pass over the site in light and dark.

## 7. Out of scope

Separating ficha from theme, eras, movements, people and companies (sub-project 2); new views and the map's future (sub-project 3); new fichas (sub-project 4).
