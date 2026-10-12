import { SCENES } from '../../study/types';
import type { Scene, ThemeScene } from '../../study/types';
import { CATALOG } from './data';
import { startYear, yearSpan } from './format';

/** Rooms with a place on the map: every scene but Origins. */
export const isPlaced = (scene: Scene): scene is ThemeScene => scene !== 'origins';

/** Rooms open to visitors: the ones with at least one work, in SCENES order. */
export const OPEN_SCENES: readonly Scene[] = SCENES.filter((scene) => CATALOG.some((entry) => entry.scene === scene));

/** Open rooms with a place on the map. */
export const OPEN_THEME_SCENES: readonly ThemeScene[] = OPEN_SCENES.filter(isPlaced);

/** A room's works in the catalog: how many, and the span of their start years. */
export function roomFacts(scene: Scene): { works: number; years: string } {
  const starts = CATALOG.filter((entry) => entry.scene === scene).map((entry) => startYear(entry.reference.date));
  return { works: starts.length, years: yearSpan(starts) };
}
