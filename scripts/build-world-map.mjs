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
