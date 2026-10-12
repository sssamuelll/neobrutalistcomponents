import { describe, expect, it } from 'vitest';
import { CATALOG } from './data';
import { OPEN_SCENES, OPEN_THEME_SCENES, roomFacts } from './rooms';

describe('rooms', () => {
  it('the site catalog holds no retired work', () => {
    expect(CATALOG.some((entry) => entry.deprecated)).toBe(false);
    expect(CATALOG.filter((entry) => !entry.predatesStudy)).toHaveLength(14);
  });

  it('only rooms with works are open, in SCENES order', () => {
    expect(OPEN_SCENES).toEqual(['usa', 'origins']);
    expect(OPEN_THEME_SCENES).toEqual(['usa']);
    for (const scene of OPEN_SCENES) expect(roomFacts(scene).works).toBeGreaterThan(0);
  });
});
