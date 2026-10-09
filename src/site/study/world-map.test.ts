import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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
    expect(readFileSync(join(process.cwd(), 'src/site/study/world-map.generated.ts')).byteLength).toBeLessThan(20 * 1024);
  });
});
