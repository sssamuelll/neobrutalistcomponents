# The Rooms Page as a World Map — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The Rooms page (`#/es/scenes`, `#/en/scenes`) becomes a serious dot map of the world where each room is a region, with a legend table as its keyboard and screen-reader path.

**Architecture:** A Node script turns Natural Earth 1:110m (via the `world-atlas` devDependency) into a committed TS module of SVG paths on a dot grid in the Equal Earth projection. `WorldMap` draws that module; `RoomLegend` lists the rooms from the catalog; `Scenes` holds the one piece of state (the active room) and wraps both in a plate whose colours follow light or dark through `light-dark()`, never the theme's palette.

**Tech Stack:** React 19, TypeScript, Vitest + Testing Library (jsdom), Playwright + axe, plain CSS in `src/site/site.css`, Node ESM scripts.

**Spec:** `docs/superpowers/specs/2026-10-09-rooms-world-map-design.md`

## Global Constraints

- Geography: Natural Earth 1:110m countries from `world-atlas@2.0.2`, a **devDependency only**; no map library ships to the browser.
- Projection: Equal Earth. Antarctica and the French Southern and Antarctic Lands are dropped.
- The generated module `src/site/study/world-map.generated.ts` is committed and stays **under 20 KB**.
- Rooms on the map: exactly `THEME_SCENES` (`japan`, `germany`, `usa`, `latam`, `italy`). Origins appears only in the legend, marked "sin lugar" / "no place".
- Plate colours are fixed per scheme and follow only light or dark: light plate `#f2efe6`, land `#cdc7b9`, ink `#1b1b1b`, muted `#6b665c`; dark plate `#121212`, land `#3a3a3a`, ink `#ece6d6`, muted `#8a857a`. Room hues light/dark: `japan #b0413e/#f08a84`, `germany #3d5a8a/#8fb0e6`, `usa #a8742a/#e0b066`, `latam #3f7a5a/#7cc49b`, `italy #9a4a5a/#e38fa0`.
- Contrast on the plate: every room hue ≥ 3:1 (WCAG 1.4.11); ink and muted text ≥ 4.5:1; in both schemes.
- The map's SVG is `aria-hidden="true"` and its links have `tabIndex={-1}`; the legend is the accessible path.
- Below 640 px: labels and leader lines hidden; the map scales to the width.
- No transitions under `prefers-reduced-motion`.
- All new copy in Spanish (Venezuelan/neutral, never voseo) and English.

## Review Focus

1. **Russia and Alaska vanish.** Their rings cross the antimeridian; a naive generator drops or smears them. Expected: both have dots. Pinned by the generator's self-check in Task 1.
2. **Focus ring and highlighted row on the fixed plate.** The site's focus colour comes from the theme and may have no contrast on the plate; a darkened row background can push muted text under 4.5:1. Expected: the focus ring uses the plate's ink, the active row's text turns to ink, and axe passes with a legend link focused. Pinned in Task 4 (CSS) and Task 5 (e2e).
3. **A room with no works yet** (a new scene before its first theme). Expected: the legend shows 0 works and "—" for years instead of `Infinity–-Infinity`. Pinned in Task 3.
4. **Links announced twice / map in the tab order.** Expected: the map's links are `tabIndex=-1` inside an `aria-hidden` SVG, and every room is reachable from the legend. Pinned in Tasks 3 and 4.
5. **A room added without regenerating the map.** Expected: typecheck fails because `MAP_ROOMS` is `Record<ThemeScene, MapRoom>`, and the data test names the missing room. Pinned in Task 1.

---

### Task 1: The map data — generator, generated module, data tests

**Files:**
- Modify: `package.json` (devDependency, `gen:map` script)
- Create: `scripts/build-world-map.mjs`
- Create (generated, committed): `src/site/study/world-map.generated.ts`
- Test: `src/site/study/world-map.test.ts`

**Interfaces:**
- Produces, in `src/site/study/world-map.generated.ts`:
  - `interface MapRoom { readonly path: string; readonly dots: number; readonly anchor: readonly [number, number]; readonly label: readonly [number, number]; readonly coords: string }`
  - `const MAP_SIZE: readonly [cols: number, rows: number]` (grid units: one unit = one dot)
  - `const MAP_GRATICULE: string` (SVG path, grid units)
  - `const MAP_LAND: string` (SVG path of row runs of land in no room)
  - `const MAP_ROOMS: Readonly<Record<ThemeScene, MapRoom>>`

- [ ] **Step 1: Write the failing test**

`src/site/study/world-map.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { THEME_SCENES } from '../../study/types';
import { MAP_LAND, MAP_ROOMS, MAP_SIZE } from './world-map.generated';

const [cols, rows] = MAP_SIZE;
const onMap = ([x, y]: readonly [number, number]) => x >= 0 && x <= cols && y >= 0 && y <= rows;

describe('the world map data', () => {
  it('has one entry per room with a place, and no other', () => {
    expect(Object.keys(MAP_ROOMS).sort()).toEqual([...THEME_SCENES].sort());
  });

  it.each(THEME_SCENES)('%s has dots, and its anchor and label lie on the map', (scene) => {
    const room = MAP_ROOMS[scene];
    expect(room.dots).toBeGreaterThan(0);
    expect(room.path).toMatch(/^M\d/);
    expect(onMap(room.anchor), `${scene} anchor`).toBe(true);
    expect(onMap(room.label), `${scene} label`).toBe(true);
    expect(room.coords).toMatch(/^\d+°[NS] \d+°[EW]$/);
  });

  it('draws land outside the rooms', () => {
    expect(MAP_LAND).toMatch(/^M\d/);
  });

  it('stays under 20 KB', () => {
    expect(readFileSync(new URL('./world-map.generated.ts', import.meta.url)).byteLength).toBeLessThan(20 * 1024);
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/site/study/world-map.test.ts`
Expected: FAIL — `Failed to resolve import "./world-map.generated"`.

- [ ] **Step 3: Add the devDependency and the script entry**

Run: `npm install --save-dev world-atlas@2.0.2`

In `package.json` `scripts`, next to `"gen:llms"`, add:

```json
    "gen:map": "node scripts/build-world-map.mjs",
```

- [ ] **Step 4: Write the generator**

`scripts/build-world-map.mjs`:

```js
// Draws the Rooms page's world map as a grid of dots, from Natural Earth
// 1:110m (public domain, via world-atlas) in the Equal Earth projection.
// Run it when rooms change; its output is committed.
//
//   node scripts/build-world-map.mjs   → src/site/study/world-map.generated.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/site/study/world-map.generated.ts');
const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/countries-110m.json'), 'utf8'));

/**
 * Each room: its Natural Earth countries, where its leader line starts
 * (lon, lat), and its label's offset from there in grid units. Keys follow
 * THEME_SCENES; a new room needs a line here and a run of `npm run gen:map`.
 */
const ROOMS = {
  japan: { countries: ['Japan'], anchor: [139.7, 35.7], offset: [-36.5, -11.5] },
  germany: { countries: ['Germany'], anchor: [12, 51], offset: [-33.7, -8.7] },
  usa: { countries: ['United States of America'], anchor: [-98, 39], offset: [-36.5, -5.8] },
  latam: {
    countries: [
      'Mexico', 'Guatemala', 'Belize', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama',
      'Cuba', 'Dominican Rep.', 'Haiti', 'Puerto Rico', 'Jamaica', 'Bahamas', 'Trinidad and Tobago',
      'Colombia', 'Venezuela', 'Ecuador', 'Peru', 'Bolivia', 'Brazil', 'Paraguay', 'Uruguay', 'Argentina',
      'Chile', 'Guyana', 'Suriname',
    ],
    anchor: [-47, -23],
    offset: [-48.1, 3.8],
  },
  italy: { countries: ['Italy'], anchor: [9, 45.5], offset: [-32.7, 8.7] },
};
const DROPPED = new Set(['Antarctica', 'Fr. S. Antarctic Lands']);
/** Grid columns. One unit is one dot's pitch; rows follow from the projection's aspect. */
const COLS = 173;

function fail(message) {
  console.error(`build-world-map: ${message}`);
  process.exit(1);
}

const range = (from, to, step) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);
const r1 = (n) => Math.round(n * 10) / 10;

// TopoJSON: quantized, delta-encoded arcs → [lon, lat] rings.
const [sx, sy] = topo.transform.scale;
const [tx, ty] = topo.transform.translate;
const arcs = topo.arcs.map((arc) => {
  let x = 0;
  let y = 0;
  return arc.map(([dx, dy]) => [(x += dx) * sx + tx, (y += dy) * sy + ty]);
});
const ring = (indices) =>
  indices.flatMap((i, n) => {
    const points = i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
    return n ? points.slice(1) : points;
  });

// Equal Earth (Šavrič, Patterson & Jenny, 2018).
const [A1, A2, A3, A4] = [1.340264, -0.081106, 0.000893, 0.003796];
const M = Math.sqrt(3) / 2;
function equalEarth(lon, lat) {
  const th = Math.asin(M * Math.sin((lat * Math.PI) / 180));
  const t2 = th * th;
  const t6 = t2 * t2 * t2;
  return [
    (((lon * Math.PI) / 180) * Math.cos(th)) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))),
    th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2)),
  ];
}
const [XMAX] = equalEarth(180, 0);
const [, YMAX] = equalEarth(0, 90);
const ROWS = Math.round((COLS * YMAX) / XMAX);
const project = (lon, lat) => {
  const [x, y] = equalEarth(lon, lat);
  return [((x / XMAX + 1) / 2) * COLS, (1 - (y / YMAX + 1) / 2) * ROWS];
};

/** A ring that crosses the antimeridian: move its minority side across, then clamp to ±180°. */
function unwrap(points) {
  if (!points.some(([lon], i) => i > 0 && Math.abs(lon - points[i - 1][0]) > 180)) return points;
  const east = points.filter(([lon]) => lon > 0).length > points.length / 2;
  return points.map(([lon, lat]) => [Math.max(-180, Math.min(180, east && lon < 0 ? lon + 360 : !east && lon > 0 ? lon - 360 : lon)), lat]);
}

const roomOf = new Map(Object.entries(ROOMS).flatMap(([room, { countries }]) => countries.map((name) => [name, room])));
const names = new Set(topo.objects.countries.geometries.map((g) => g.properties.name));
const unknown = [...roomOf.keys()].filter((name) => !names.has(name));
if (unknown.length) fail(`not in Natural Earth 1:110m: ${unknown.join(', ')}`);

const shapes = [];
for (const g of topo.objects.countries.geometries) {
  const name = g.properties.name;
  if (DROPPED.has(name)) continue;
  for (const polygon of g.type === 'MultiPolygon' ? g.arcs : [g.arcs]) {
    const points = unwrap(ring(polygon[0])).map(([lon, lat]) => project(lon, lat));
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    shapes.push({ name, room: roomOf.get(name) ?? null, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], points });
  }
}

function inside(points, x, y) {
  let hit = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[j];
    if (y1 > y !== y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) hit = !hit;
  }
  return hit;
}

/** grid[row][col]: the shape whose land holds the cell's centre, or null for sea. */
const grid = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: COLS }, (_, col) => {
    const [x, y] = [col + 0.5, row + 0.5];
    return shapes.find(({ box: [x0, y0, x1, y1], points }) => x >= x0 && x <= x1 && y >= y0 && y <= y1 && inside(points, x, y)) ?? null;
  }),
);
const dotsWhere = (test) => grid.flat().filter((shape) => shape && test(shape)).length;

// Self-checks: the antimeridian rings survived, and every room has dots.
if (!dotsWhere((s) => s.name === 'Russia')) fail('Russia has no dots: its antimeridian ring was lost');
const [alaskaX] = project(-150, 64);
if (!grid.some((row) => row.some((s, col) => s?.room === 'usa' && col < alaskaX))) fail('Alaska has no dots: its antimeridian ring was lost');
for (const room of Object.keys(ROOMS)) if (!dotsWhere((s) => s.room === room)) fail(`${room} has no dots`);

/** Row runs of the cells that pass `test`, as an SVG path: M col row h len v1 h-len z. */
function runs(test) {
  let d = '';
  grid.forEach((row, r) => {
    for (let c = 0; c < COLS; ) {
      if (!row[c] || !test(row[c])) {
        c += 1;
        continue;
      }
      let end = c;
      while (end < COLS && row[end] && test(row[end])) end += 1;
      d += `M${c} ${r}h${end - c}v1h${c - end}z`;
      c = end;
    }
  });
  return d;
}

const line = (points) => `M${points.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}`;
const graticule = [
  ...[-60, -30, 0, 30, 60].map((lat) => line(range(-180, 180, 10).map((lon) => project(lon, lat)))),
  ...range(-180, 180, 30).map((lon) => line(range(-90, 90, 10).map((lat) => project(lon, lat)))),
].join('');

const dms = ([lon, lat]) => `${Math.abs(Math.round(lat))}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(Math.round(lon))}°${lon >= 0 ? 'E' : 'W'}`;
const rooms = Object.entries(ROOMS).map(([room, { anchor, offset }]) => {
  const [ax, ay] = project(...anchor);
  return `  ${room}: { path: '${runs((s) => s.room === room)}', dots: ${dotsWhere((s) => s.room === room)}, anchor: [${r1(ax)}, ${r1(ay)}], label: [${r1(ax + offset[0])}, ${r1(ay + offset[1])}], coords: '${dms(anchor)}' },`;
});

writeFileSync(
  OUT,
  `// Generated by scripts/build-world-map.mjs from Natural Earth 1:110m (public
// domain) in the Equal Earth projection. Do not edit: run \`npm run gen:map\`.
import type { ThemeScene } from '../../study/types';

export interface MapRoom {
  /** Row runs of the room's cells, in grid units (one unit = one dot). */
  readonly path: string;
  readonly dots: number;
  /** Where the leader line starts. */
  readonly anchor: readonly [number, number];
  /** Where the label's first line starts. */
  readonly label: readonly [number, number];
  /** The anchor as text, e.g. "36°N 140°E". */
  readonly coords: string;
}

export const MAP_SIZE = [${COLS}, ${ROWS}] as const;
export const MAP_GRATICULE = '${graticule}';
export const MAP_LAND = '${runs((s) => !s.room)}';
export const MAP_ROOMS: Readonly<Record<ThemeScene, MapRoom>> = {
${rooms.join('\n')}
};
`,
);
console.log(`build-world-map: ${COLS}×${ROWS} grid, ${dotsWhere(() => true)} dots → src/site/study/world-map.generated.ts`);
```

- [ ] **Step 5: Generate the module**

Run: `npm run gen:map`
Expected: `build-world-map: 173×84 grid, <about 3,400> dots → src/site/study/world-map.generated.ts`. If it stops with "not in Natural Earth" or "has no dots", fix the room table; never weaken the check.

- [ ] **Step 6: Run the tests to make sure they pass**

Run: `npx vitest run src/site/study/world-map.test.ts && npx tsc -p tsconfig.json --noEmit && npx eslint scripts/build-world-map.mjs src/site/study/world-map.test.ts`
Expected: all PASS, no type or lint errors. If the size test fails, round the graticule to whole units (`Math.round`) before anything else.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json scripts/build-world-map.mjs src/site/study/world-map.generated.ts src/site/study/world-map.test.ts
git commit -m "feat(site): the world map's dots, generated from Natural Earth in Equal Earth"
```

---

### Task 2: The plate's colours and their contrast

**Files:**
- Create: `src/site/study/map-colors.ts`
- Test: `src/site/study/map-colors.test.ts`

**Interfaces:**
- Consumes: `lightDark(light: string, dark: string): string` from `src/study/color.ts`; `THEME_SCENES`, `ThemeScene` from `src/study/types.ts`; `contrastRatio(fg: string, bg: string): number` from `src/lib/themes/color.ts` (test only).
- Produces:
  - `interface Plate { readonly plate: string; readonly land: string; readonly ink: string; readonly muted: string; readonly graticule: string }`
  - `const PLATE: Readonly<Record<'light' | 'dark', Plate>>`
  - `const ROOM_HUES: Readonly<Record<ThemeScene, readonly [light: string, dark: string]>>`
  - `function plateStyle(): CSSProperties` — custom properties `--map-plate`, `--map-land`, `--map-ink`, `--map-muted`, `--map-graticule` and `--map-room-<scene>`, each `light-dark(light, dark)`.

- [ ] **Step 1: Write the failing test**

`src/site/study/map-colors.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../../lib/themes/color';
import { THEME_SCENES } from '../../study/types';
import { PLATE, ROOM_HUES, plateStyle } from './map-colors';

describe('the map plate', () => {
  it.each(['light', 'dark'] as const)('%s: ink and muted text reach 4.5:1, every room hue 3:1', (scheme) => {
    const { plate, ink, muted } = PLATE[scheme];
    expect(contrastRatio(ink, plate)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(muted, plate)).toBeGreaterThanOrEqual(4.5);
    for (const scene of THEME_SCENES) {
      const hue = ROOM_HUES[scene][scheme === 'light' ? 0 : 1];
      expect(contrastRatio(hue, plate), `${scene} on the ${scheme} plate`).toBeGreaterThanOrEqual(3);
    }
  });

  it('writes one custom property per plate colour and per room, through light-dark()', () => {
    const style = plateStyle() as Record<string, string>;
    expect(style['--map-plate']).toBe('light-dark(#f2efe6, #121212)');
    expect(style['--map-room-japan']).toBe('light-dark(#b0413e, #f08a84)');
    expect(Object.keys(style).filter((key) => key.startsWith('--map-room-')).sort()).toEqual(THEME_SCENES.map((scene) => `--map-room-${scene}`).sort());
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/site/study/map-colors.test.ts`
Expected: FAIL — `Failed to resolve import "./map-colors"`.

- [ ] **Step 3: Write the module**

`src/site/study/map-colors.ts`:

```ts
/**
 * The world map's plate. It follows the page's light or dark scheme through
 * light-dark(), never the theme's palette: room hues on a theme's own
 * background would vanish on some themes (Whaam!'s yellow, Amiga's blue).
 * map-colors.test.ts holds these values to the contrast rules.
 */
import type { CSSProperties } from 'react';
import { lightDark } from '../../study/color';
import { THEME_SCENES } from '../../study/types';
import type { ThemeScene } from '../../study/types';

export interface Plate {
  readonly plate: string;
  readonly land: string;
  readonly ink: string;
  readonly muted: string;
  readonly graticule: string;
}

export const PLATE: Readonly<Record<'light' | 'dark', Plate>> = {
  light: { plate: '#f2efe6', land: '#cdc7b9', ink: '#1b1b1b', muted: '#6b665c', graticule: '#00000014' },
  dark: { plate: '#121212', land: '#3a3a3a', ink: '#ece6d6', muted: '#8a857a', graticule: '#ffffff10' },
};

export const ROOM_HUES: Readonly<Record<ThemeScene, readonly [light: string, dark: string]>> = {
  japan: ['#b0413e', '#f08a84'],
  germany: ['#3d5a8a', '#8fb0e6'],
  usa: ['#a8742a', '#e0b066'],
  latam: ['#3f7a5a', '#7cc49b'],
  italy: ['#9a4a5a', '#e38fa0'],
};

/** The plate's custom properties, for the figure's style attribute. */
export function plateStyle(): CSSProperties {
  const vars: Record<string, string> = {};
  for (const key of ['plate', 'land', 'ink', 'muted', 'graticule'] as const) vars[`--map-${key}`] = lightDark(PLATE.light[key], PLATE.dark[key]);
  for (const scene of THEME_SCENES) vars[`--map-room-${scene}`] = lightDark(...ROOM_HUES[scene]);
  return vars as CSSProperties;
}
```

- [ ] **Step 4: Run the tests to make sure they pass**

Run: `npx vitest run src/site/study/map-colors.test.ts && npx tsc -p tsconfig.json --noEmit`
Expected: PASS. If a hue fails, adjust that hue until it passes (spec §3.5: the test is the rule); never lower the threshold.

- [ ] **Step 5: Commit**

```bash
git add src/site/study/map-colors.ts src/site/study/map-colors.test.ts
git commit -m "feat(site): the map plate's colours, held to 3:1 and 4.5:1 in both schemes"
```

---

### Task 3: The rooms' facts and the legend

**Files:**
- Modify: `src/site/study/format.ts` (add `yearSpan`)
- Modify: `src/site/study/format.test.ts` (test `yearSpan`)
- Create: `src/site/study/rooms.ts`
- Modify: `src/site/i18n.ts` (new keys, `workCount`, `scenesLead`)
- Create: `src/site/study/RoomLegend.tsx`
- Test: `src/site/study/RoomLegend.test.tsx`

**Interfaces:**
- Consumes: `CATALOG` from `src/site/study/data.ts`; `startYear`, `sceneHref` from `src/site/study/format.ts`; `SCENES`, `Scene`, `ThemeScene` from `src/study/types.ts`; `SCENE_TEXT`, `useLang`, `useT` from `src/site/i18n.ts`.
- Produces:
  - `yearSpan(starts: readonly number[]): string` in `format.ts` — `'—'` for none, `'1981'` for one year, `'1963–2014'` for a span.
  - `roomFacts(scene: Scene): { works: number; years: string }` in `rooms.ts`.
  - `isPlaced(scene: Scene): scene is ThemeScene` in `rooms.ts`.
  - `workCount(lang: Lang, n: number): string` in `i18n.ts` — `'1 obra' | 'n obras'`, `'1 work' | 'n works'`.
  - UI keys: `mapCaption`, `mapLegend`, `colRoom`, `colWorks`, `colYears`, `noPlace`.
  - `RoomLegend({ active, onActive }: { active: ThemeScene | null; onActive: (scene: ThemeScene | null) => void })`, rendering `table.world-map__legend`; rows carry `data-active="true"` when active.

- [ ] **Step 1: Write the failing tests**

Append to `src/site/study/format.test.ts` (keep its existing imports; add `yearSpan` to the import from `./format`):

```ts
describe('yearSpan', () => {
  it('reads a room with no works, one year, or a span', () => {
    expect(yearSpan([])).toBe('—');
    expect(yearSpan([1981])).toBe('1981');
    expect(yearSpan([1981, 1981])).toBe('1981');
    expect(yearSpan([2014, 1963, 1995])).toBe('1963–2014');
  });
});
```

`src/site/study/RoomLegend.test.tsx`:

```tsx
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SCENES } from '../../study/types';
import type { ThemeScene } from '../../study/types';
import { LangContext } from '../i18n';
import { CATALOG } from './data';
import { RoomLegend } from './RoomLegend';

function renderLegend(active: ThemeScene | null = null) {
  const onActive = vi.fn();
  render(
    <LangContext value="es">
      <RoomLegend active={active} onActive={onActive} />
    </LangContext>,
  );
  return onActive;
}

describe('the room legend', () => {
  it('lists every room, Origins last and without a place, with works that add up to the catalog', () => {
    renderLegend();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(SCENES.length);
    expect(rows.at(-1)).toHaveTextContent('Orígenes');
    expect(rows.at(-1)).toHaveTextContent('sin lugar');
    const works = rows.map((row) => Number(within(row).getAllByRole('cell')[0].textContent));
    expect(works.reduce((a, b) => a + b, 0)).toBe(CATALOG.length);
  });

  it('activates a room when its row is pointed at or its link focused, and clears it after', () => {
    const onActive = renderLegend();
    const link = screen.getByRole('link', { name: 'Japón' });
    fireEvent.pointerEnter(link.closest('tr')!);
    expect(onActive).toHaveBeenLastCalledWith('japan');
    fireEvent.pointerLeave(link.closest('tr')!);
    expect(onActive).toHaveBeenLastCalledWith(null);
    fireEvent.focus(link);
    expect(onActive).toHaveBeenLastCalledWith('japan');
    fireEvent.blur(link);
    expect(onActive).toHaveBeenLastCalledWith(null);
  });

  it('never activates Origins, which is not on the map', () => {
    const onActive = renderLegend();
    fireEvent.focus(screen.getByRole('link', { name: 'Orígenes' }));
    expect(onActive).not.toHaveBeenCalled();
  });

  it('marks the active room’s row', () => {
    renderLegend('italy');
    expect(screen.getByRole('link', { name: 'Italia' }).closest('tr')).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('link', { name: 'Japón' }).closest('tr')).not.toHaveAttribute('data-active');
  });
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `npx vitest run src/site/study/format.test.ts src/site/study/RoomLegend.test.tsx`
Expected: FAIL — `yearSpan` is not exported; `./RoomLegend` cannot be resolved.

- [ ] **Step 3: Add `yearSpan`**

In `src/site/study/format.ts`, after `startYear`:

```ts
/** First–last of a room's start years: '1963–2014', one year alone, '—' for a room with no works yet. */
export function yearSpan(starts: readonly number[]): string {
  if (!starts.length) return '—';
  const first = Math.min(...starts);
  const last = Math.max(...starts);
  return first === last ? String(first) : `${first}–${last}`;
}
```

- [ ] **Step 4: Add `rooms.ts`**

`src/site/study/rooms.ts`:

```ts
import type { Scene, ThemeScene } from '../../study/types';
import { CATALOG } from './data';
import { startYear, yearSpan } from './format';

/** Rooms with a place on the map: every scene but Origins. */
export const isPlaced = (scene: Scene): scene is ThemeScene => scene !== 'origins';

/** A room's works in the catalog: how many, and the span of their start years. */
export function roomFacts(scene: Scene): { works: number; years: string } {
  const starts = CATALOG.filter((entry) => entry.scene === scene).map((entry) => startYear(entry.reference.date));
  return { works: starts.length, years: yearSpan(starts) };
}
```

- [ ] **Step 5: Add the copy**

In `src/site/i18n.ts`, inside `UI`, after `scenesLead`, replace `scenesLead` and add the new keys (the lead no longer counts rooms, which go out of date):

```ts
  scenesLead: {
    es: 'Lecturas regionales de una misma idea, y el lugar donde empezó.',
    en: 'Regional readings of one idea, and the place where it began.',
  },
  mapCaption: { es: 'Proyección Equal Earth', en: 'Equal Earth projection' },
  mapLegend: { es: 'Las salas, con sus obras y sus años', en: 'The rooms, with their works and years' },
  colRoom: { es: 'Sala', en: 'Room' },
  colWorks: { es: 'Obras', en: 'Works' },
  colYears: { es: 'Años', en: 'Years' },
  noPlace: { es: 'sin lugar', en: 'no place' },
```

After `themeCount`:

```ts
export function workCount(lang: Lang, n: number): string {
  if (lang === 'es') return n === 1 ? '1 obra' : `${n} obras`;
  return n === 1 ? '1 work' : `${n} works`;
}
```

- [ ] **Step 6: Write the legend**

`src/site/study/RoomLegend.tsx`:

```tsx
import { SCENES } from '../../study/types';
import type { ThemeScene } from '../../study/types';
import { SCENE_TEXT, useLang, useT } from '../i18n';
import { sceneHref } from './format';
import { isPlaced, roomFacts } from './rooms';

/** The rooms as a table: the map's legend, and its keyboard and screen-reader path. */
export function RoomLegend({ active, onActive }: { active: ThemeScene | null; onActive: (scene: ThemeScene | null) => void }) {
  const lang = useLang();
  const t = useT();
  return (
    <table className="world-map__legend">
      <caption className="site-visually-hidden">{t('mapLegend')}</caption>
      <thead>
        <tr>
          <th scope="col">{t('colRoom')}</th>
          <th scope="col">{t('colWorks')}</th>
          <th scope="col">{t('colYears')}</th>
        </tr>
      </thead>
      <tbody>
        {SCENES.map((scene) => {
          const { works, years } = roomFacts(scene);
          const enter = isPlaced(scene) ? () => onActive(scene) : undefined;
          const leave = isPlaced(scene) ? () => onActive(null) : undefined;
          return (
            <tr key={scene} data-active={active === scene || undefined} onPointerEnter={enter} onPointerLeave={leave}>
              <th scope="row">
                <a href={sceneHref(lang, scene)} onFocus={enter} onBlur={leave}>
                  {SCENE_TEXT[scene].name[lang]}
                </a>
                <span className="world-map__summary">{SCENE_TEXT[scene].summary[lang]}</span>
              </th>
              <td>{works}</td>
              <td>{isPlaced(scene) ? years : `${years} · ${t('noPlace')}`}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 7: Run the tests to make sure they pass**

Run: `npx vitest run src/site/study/format.test.ts src/site/study/RoomLegend.test.tsx && npx tsc -p tsconfig.json --noEmit && npx eslint src/site/study`
Expected: PASS, no type or lint errors.

- [ ] **Step 8: Commit**

```bash
git add src/site/study/format.ts src/site/study/format.test.ts src/site/study/rooms.ts src/site/i18n.ts src/site/study/RoomLegend.tsx src/site/study/RoomLegend.test.tsx
git commit -m "feat(site): the rooms legend, with works and years from the catalog"
```

---

### Task 4: The map, the page and its styles

**Files:**
- Create: `src/site/study/WorldMap.tsx`
- Modify: `src/site/pages/Scenes.tsx` (whole file)
- Modify: `src/site/site.css` (append a `World map (Rooms)` block)
- Test: `src/site/pages/Scenes.test.tsx`

**Interfaces:**
- Consumes: `MAP_SIZE`, `MAP_GRATICULE`, `MAP_LAND`, `MAP_ROOMS` (Task 1); `plateStyle()` (Task 2); `RoomLegend`, `roomFacts`, `workCount`, `mapCaption` (Task 3); `sceneHref`; `THEME_SCENES`, `ThemeScene`.
- Produces: `WorldMap({ active, onActive }: { active: ThemeScene | null; onActive: (scene: ThemeScene | null) => void })`. DOM contract used by tests and e2e: `figure.world-map[data-active=<scene>]`, `svg.world-map__svg[aria-hidden=true]`, `a.world-map__room[data-scene=<scene>][tabindex=-1][data-active=true]`, `.world-map__label`, `table.world-map__legend`.

- [ ] **Step 1: Write the failing test**

`src/site/pages/Scenes.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { THEME_SCENES } from '../../study/types';
import { LangContext } from '../i18n';
import { Scenes } from './Scenes';

function renderPage() {
  render(
    <LangContext value="es">
      <Scenes />
    </LangContext>,
  );
}
const figure = () => document.querySelector('figure.world-map')!;
const region = (scene: string) => document.querySelector(`.world-map__room[data-scene="${scene}"]`)!;

describe('the rooms page', () => {
  it('draws one region per room with a place, each a link to its room, out of the tab order and hidden from assistive technology', () => {
    renderPage();
    expect(document.querySelector('.world-map__svg')).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelectorAll('.world-map__room')).toHaveLength(THEME_SCENES.length);
    for (const scene of THEME_SCENES) {
      expect(region(scene)).toHaveAttribute('href', `#/es/scene/${scene}`);
      expect(region(scene)).toHaveAttribute('tabindex', '-1');
    }
  });

  it('pointing at a region highlights it and its legend row; leaving clears both', () => {
    renderPage();
    fireEvent.pointerEnter(region('japan'));
    expect(figure()).toHaveAttribute('data-active', 'japan');
    expect(region('japan')).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('link', { name: 'Japón' }).closest('tr')).toHaveAttribute('data-active', 'true');
    fireEvent.pointerLeave(region('japan'));
    expect(figure()).not.toHaveAttribute('data-active');
    expect(region('japan')).not.toHaveAttribute('data-active');
  });

  it('focusing a room in the legend highlights its region only', () => {
    renderPage();
    fireEvent.focus(screen.getByRole('link', { name: 'Italia' }));
    expect(region('italy')).toHaveAttribute('data-active', 'true');
    expect(region('japan')).not.toHaveAttribute('data-active');
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npx vitest run src/site/pages/Scenes.test.tsx`
Expected: FAIL — no `figure.world-map` (the page still renders cards).

- [ ] **Step 3: Write the map**

`src/site/study/WorldMap.tsx`:

```tsx
import { THEME_SCENES } from '../../study/types';
import type { ThemeScene } from '../../study/types';
import { SCENE_TEXT, useLang, workCount } from '../i18n';
import { sceneHref } from './format';
import { roomFacts } from './rooms';
import { MAP_GRATICULE, MAP_LAND, MAP_ROOMS, MAP_SIZE } from './world-map.generated';

const [COLS, ROWS] = MAP_SIZE;

/** One dot per grid cell: a square 0.6 units wide, centred in its 1-unit cell. */
function Dots({ id, fill }: { id: string; fill: string }) {
  return (
    <pattern id={id} width="1" height="1" patternUnits="userSpaceOnUse">
      <rect x="0.2" y="0.2" width="0.6" height="0.6" style={{ fill }} />
    </pattern>
  );
}

/**
 * The rooms on a dot map. For pointer and touch only: hidden from assistive
 * technology and out of the tab order, because the legend carries the same
 * links and highlights the same regions on focus.
 */
export function WorldMap({ active, onActive }: { active: ThemeScene | null; onActive: (scene: ThemeScene | null) => void }) {
  const lang = useLang();
  return (
    <svg className="world-map__svg" viewBox={`0 0 ${COLS} ${ROWS}`} aria-hidden="true" focusable="false">
      <defs>
        <Dots id="world-map-land" fill="var(--map-land)" />
        {THEME_SCENES.map((scene) => (
          <Dots key={scene} id={`world-map-${scene}`} fill={`var(--map-room-${scene})`} />
        ))}
      </defs>
      <path className="world-map__graticule" d={MAP_GRATICULE} />
      <path d={MAP_LAND} fill="url(#world-map-land)" />
      {THEME_SCENES.map((scene) => {
        const room = MAP_ROOMS[scene];
        const { works, years } = roomFacts(scene);
        const [ax, ay] = room.anchor;
        const [lx, ly] = room.label;
        return (
          <a
            key={scene}
            className="world-map__room"
            data-scene={scene}
            data-active={active === scene || undefined}
            href={sceneHref(lang, scene)}
            tabIndex={-1}
            onPointerEnter={() => onActive(scene)}
            onPointerLeave={() => onActive(null)}
          >
            <path d={room.path} fill={`url(#world-map-${scene})`} />
            <g className="world-map__label">
              <line x1={ax} y1={ay} x2={lx} y2={ly + 0.7} />
              <circle cx={ax} cy={ay} r="0.6" />
              <text x={lx} y={ly}>
                {SCENE_TEXT[scene].name[lang]}
              </text>
              <text className="world-map__facts" x={lx} y={ly + 2.6}>
                {`${workCount(lang, works)} · ${years} · ${room.coords}`}
              </text>
            </g>
          </a>
        );
      })}
    </svg>
  );
}
```

- [ ] **Step 4: Rewrite the page**

`src/site/pages/Scenes.tsx` (whole file):

```tsx
import { useState } from 'react';
import type { ThemeScene } from '../../study/types';
import { useT } from '../i18n';
import { plateStyle } from '../study/map-colors';
import { RoomLegend } from '../study/RoomLegend';
import { WorldMap } from '../study/WorldMap';

const PLATE_STYLE = plateStyle();

/** Every room of the study on a world map, with Origins in the legend. */
export function Scenes() {
  const t = useT();
  const [active, setActive] = useState<ThemeScene | null>(null);
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleScenes')}</h1>
        <p className="site-lead">{t('scenesLead')}</p>
      </header>
      <figure className="world-map" style={PLATE_STYLE} data-active={active ?? undefined}>
        <WorldMap active={active} onActive={setActive} />
        <RoomLegend active={active} onActive={setActive} />
        <figcaption className="world-map__caption">
          {t('mapCaption')} ·{' '}
          <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">
            Natural Earth 1:110m
          </a>
        </figcaption>
      </figure>
    </div>
  );
}
```

- [ ] **Step 5: Add the styles**

Append to `src/site/site.css`:

```css
/* ============================================================
   World map (Rooms). The plate's colours come from plateStyle()
   (src/site/study/map-colors.ts), never from the theme's palette.
   ============================================================ */

.world-map {
  margin: 0;
  padding: var(--nbc-space-lg);
  background: var(--map-plate);
  color: var(--map-ink);
  border: 1px solid var(--map-land);
  font-family: var(--nbc-font-mono);
}

/* The site's focus colour belongs to the theme and may vanish on the plate. */
.world-map :focus-visible {
  outline: 2px solid var(--map-ink);
  outline-offset: 2px;
}

.world-map__svg {
  display: block;
  inline-size: 100%;
  block-size: auto;
}

.world-map__graticule {
  fill: none;
  stroke: var(--map-graticule);
  stroke-width: 0.6px;
  vector-effect: non-scaling-stroke;
}

.world-map__room {
  cursor: pointer;
}

.world-map[data-active] .world-map__room:not([data-active]) {
  opacity: 0.35;
}

.world-map__label line,
.world-map__label circle {
  fill: none;
  stroke: var(--map-muted);
  stroke-width: 1px;
  vector-effect: non-scaling-stroke;
}

/* Sizes are in grid units: one unit is one dot. */
.world-map__label text {
  fill: var(--map-ink);
  font-size: 2px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.world-map__label .world-map__facts {
  fill: var(--map-muted);
  font-size: 1.7px;
}

.world-map__legend {
  inline-size: 100%;
  margin-block-start: var(--nbc-space-lg);
  border-collapse: collapse;
  font-size: var(--nbc-fs-sm);
}

.world-map__legend th,
.world-map__legend td {
  padding: var(--nbc-space-xs) var(--nbc-space-sm);
  border-block-start: 1px solid var(--map-land);
  text-align: start;
  vertical-align: top;
  font-weight: 400;
}

.world-map__legend thead th {
  border-block-start: none;
  color: var(--map-muted);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.world-map__legend td:nth-child(2),
.world-map__legend thead th:nth-child(2) {
  text-align: end;
}

.world-map__legend td:nth-child(3) {
  color: var(--map-muted);
}

.world-map__legend a {
  color: var(--map-ink);
  font-weight: 600;
}

.world-map__summary {
  display: block;
  color: var(--map-muted);
}

/* The active row darkens a little, so its muted text turns to ink to keep 4.5:1. */
.world-map__legend tbody tr[data-active],
.world-map__legend tbody tr:hover,
.world-map__legend tbody tr:focus-within {
  background: color-mix(in srgb, var(--map-ink) 6%, var(--map-plate));
}

.world-map__legend tbody tr:is([data-active], :hover, :focus-within) :is(.world-map__summary, td) {
  color: var(--map-ink);
}

.world-map__caption {
  margin-block-start: var(--nbc-space-md);
  color: var(--map-muted);
  font-size: var(--nbc-fs-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.world-map__caption a {
  color: inherit;
}

@media (prefers-reduced-motion: no-preference) {
  .world-map__room,
  .world-map__legend tbody tr {
    transition: opacity 150ms ease, background-color 150ms ease;
  }
}

@media (max-width: 639px) {
  .world-map {
    padding: var(--nbc-space-md);
  }

  .world-map__label {
    display: none;
  }
}
```

- [ ] **Step 6: Run the tests to make sure they pass**

Run: `npx vitest run src/site/pages/Scenes.test.tsx src/site/study && npx tsc -p tsconfig.json --noEmit && npx eslint src/site`
Expected: PASS, no type or lint errors.

- [ ] **Step 7: Look at it**

Run: `npm run build:site && npx vite preview --config vite.site.config.ts --port 4176 --strictPort` (in the background), then open `http://localhost:4176/?theme=classic#/es/scenes` and `http://localhost:4176/?theme=tech#/en/scenes` at 1280 and 360 px wide. Expected: the map matches the approved mockup (light plate in `classic`, dark panel in a dark-native theme), labels inside the frame at 1280 px and hidden at 360 px, no sideways scroll, hovering a region dims the others and highlights its row. Stop the preview server afterwards.

- [ ] **Step 8: Commit**

```bash
git add src/site/study/WorldMap.tsx src/site/pages/Scenes.tsx src/site/pages/Scenes.test.tsx src/site/site.css
git commit -m "feat(site): the Rooms page is a world map, with the legend as its accessible path"
```

---

### Task 5: End to end, changelog, gates

**Files:**
- Modify: `e2e/site.spec.ts` (the `scenes:` test; one new test)
- Modify: `CHANGELOG.md` (an `Unreleased` section above `## 1.2.0`)

**Interfaces:**
- Consumes: the DOM contract of Task 4.

- [ ] **Step 1: Rewrite the Rooms e2e test and add the focused-row check**

In `e2e/site.spec.ts`, add `THEME_SCENES` to the existing import from `'../src/study/types'` (it already imports `SCENES`), then replace the test that starts with `test('scenes: an index, then each scene lists its references in date order with their themes'` and ends before `test('a study page whose essay cannot load` with:

```ts
test('rooms: a world map with its legend, then each room lists its references in date order with their themes', async ({ page }) => {
  await page.goto('#/en/scenes');
  await expect(page.locator('main h1')).toHaveText('Rooms');
  await expect(page.locator('.world-map__legend tbody tr')).toHaveCount(SCENES.length);
  await expect(page.locator('.world-map__room')).toHaveCount(THEME_SCENES.length);
  await page.locator('.world-map__room[data-scene="italy"] .world-map__label text').first().click();
  await expect(page).toHaveURL(/#\/en\/scene\/italy$/);
  await page.goto('#/en/scenes');
  await page.locator('.world-map__legend').getByRole('link', { name: 'Japan' }).click();
  await expect(page).toHaveURL(/#\/en\/scene\/japan$/);
  await expect(page).toHaveTitle('Japan — neobrutalistcomponents');
  await expect(page.locator('.study-timeline__year')).toHaveText(['1970', '1980', '1996']);
  await expect(page.locator('.study-timeline .site-card h3')).toHaveText(['Nakagin', 'Riso', 'Y2K']);
  await expect(page.locator('nav .study-scenes__card')).toHaveCount(SCENES.length - 1);
  await page.goto('#/en/origins');
  await expect(page.locator('.study-essay__text h2').first()).toHaveText('Béton brut');
  await expect(page.locator('.study-timeline .site-card h3')).toHaveText(['Classic', 'Swiss']);
});

test('rooms: a focused legend row keeps its text and focus ring readable on the plate', async ({ page }) => {
  for (const theme of ['classic', 'tech', 'whaam']) {
    await page.goto(`?theme=${theme}#/en/scenes`);
    await page.locator('.world-map__legend').getByRole('link', { name: 'Japan' }).focus();
    const results = await new AxeBuilder({ page }).include('.world-map').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.map((v) => `${theme} ${v.id}`)).toEqual([]);
  }
});
```

- [ ] **Step 2: Run the Rooms e2e tests**

Run: `npx playwright test -g "rooms:|#/(es|en)/scenes" --reporter=line`
Expected: PASS (the two new tests, plus `/scenes` in the main-pages sweep at 1280 and 360 px in both languages).

- [ ] **Step 3: Record the change**

In `CHANGELOG.md`, above `## 1.2.0 — 2026-10-09`:

```markdown
## Unreleased

### Changed
- Docs site: the Rooms page is a world map. Each room is a region on a dot map of Natural Earth's 1:110m geography in the Equal Earth projection; the legend beneath it lists rooms, works and years, and is the keyboard and screen-reader path. Pointing at a region or a row highlights both.
- Docs site: the home page shows the study's essay again, between the hero and the collection, and loads each work's theme as it nears the screen (453 KB on arrival instead of 1,057 KB).
```

- [ ] **Step 4: Run every gate**

Run: `npm run check > /tmp/check.log 2>&1; echo "exit=$?"; grep -E "Tests |All good" /tmp/check.log`
Expected: `exit=0`, all unit tests pass, publint "All good".

Run: `npx playwright test --reporter=line > /tmp/e2e.log 2>&1; echo "exit=$?"; grep -E "passed|failed" /tmp/e2e.log`
Expected: `exit=0`, no failures. If the machine is short of memory, run it in CI instead (open the PR) and say so.

Then: `git status --short` must show only the files of this task; revert generated noise (line-ending-only changes in `public/llms*.txt`) with `git checkout -- public/llms.txt public/llms-full.txt`.

- [ ] **Step 5: Commit**

```bash
git add e2e/site.spec.ts CHANGELOG.md
git commit -m "test(e2e): the Rooms map and its legend; changelog for the site's unreleased changes"
```
