import { describe, expect, it } from 'vitest';
import { STUDY_THEMES } from './registry';
import { RETIRED, isRetired, retiredBanner } from './retired';
import { CATALOG } from './.generated/catalog';

describe('retired study themes', () => {
  it('are exactly the fifteen works the curation retired', () => {
    expect(Object.keys(RETIRED).sort()).toEqual([
      'bauhaus-dessau',
      'caracas-signage',
      'carlton',
      'create-two-three-many-vietnams',
      'din-1451',
      'dragon-quest',
      'lettera-22',
      'loteria',
      'maeusebunker',
      'munich-72',
      'nakagin',
      'sesc-pompeia',
      'super-mario-bros',
      'tokyo-1964',
      'whaam',
    ]);
    expect(RETIRED['dragon-quest']).toBe('video-game');
    expect(RETIRED['super-mario-bros']).toBe('video-game');
    expect(RETIRED.loteria).toBe('not-an-interface');
  });

  it('name only registered study themes', () => {
    const registered = new Set(STUDY_THEMES.map(({ theme }) => theme.id));
    for (const id of Object.keys(RETIRED)) expect(registered.has(id), id).toBe(true);
  });

  it('are the deprecated entries of the generated catalog, and only they', () => {
    expect(
      CATALOG.filter((entry) => entry.deprecated)
        .map((entry) => entry.id)
        .sort(),
    ).toEqual(Object.keys(RETIRED).sort());
    expect(CATALOG.filter((entry) => entry.predatesStudy).every((entry) => !entry.deprecated)).toBe(true);
  });

  it('give a banner that says when they go and why', () => {
    expect(isRetired('loteria')).toBe(true);
    expect(isRetired('xerox-star')).toBe(false);
    expect(retiredBanner('loteria')).toBe(
      'Deprecated in 1.4.0, removed in 2.0.0: the gallery keeps only graphical interfaces, and this work is not one.',
    );
    expect(retiredBanner('dragon-quest')).toMatch(/^Deprecated in 1\.4\.0, removed in 2\.0\.0: .*video games.*\.$/);
  });
});
