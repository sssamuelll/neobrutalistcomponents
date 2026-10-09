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
