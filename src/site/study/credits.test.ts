import { describe, expect, it } from 'vitest';
import { CATALOG } from './data';
import { fontCredits } from './credits';

describe('fontCredits', () => {
  it('lists every family once, in order, with its licence and the themes that use it', () => {
    const credits = fontCredits(CATALOG);
    const families = credits.map((credit) => credit.family);
    expect(families).toEqual([...families].sort());
    expect(new Set(families).size).toBe(families.length);
    expect(families).toHaveLength(new Set(CATALOG.flatMap((entry) => entry.fonts)).size);
    expect(credits.find((credit) => credit.family === 'Geist Mono')?.usedBy.map((entry) => entry.id)).toEqual(['classic', 'tech']);
    expect(credits.every((credit) => credit.license === 'OFL-1.1')).toBe(true);
  });

  it('refuses a family with no recorded licence', () => {
    expect(() => fontCredits([{ ...CATALOG[0], fonts: ['Comic Sans MS'] }])).toThrow(/no licence recorded for the font "Comic Sans MS"/);
  });
});
