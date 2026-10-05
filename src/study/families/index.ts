import { concrete } from './concrete/family';
import { grid } from './grid/family';
import type { FamilyDefinition } from './types';

/** Every family a study theme may use, by name. */
export const FAMILIES: Readonly<Record<string, FamilyDefinition>> = {
  concrete: concrete.definition,
  grid: grid.definition,
};

export { concrete, grid };
