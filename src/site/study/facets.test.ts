import { describe, expect, it } from 'vitest';
import { CATALOG } from './data';
import { applyFilters, facetLabel, facetOptions, filtersFromQuery, filtersToQuery } from './facets';

const ids = (filters: Parameters<typeof applyFilters>[1]) => applyFilters(CATALOG, filters).map((entry) => entry.id);

describe('atlas facets', () => {
  it('filters by scene, decade and shape', () => {
    expect(ids({ scene: 'usa' })).toEqual(expect.arrayContaining(['xerox-star', 'win95', 'material-design']));
    expect(ids({ scene: 'usa' })).not.toContain('classic');
    expect(ids({ decade: '1980' })).toEqual(expect.arrayContaining(['xerox-star', 'atari-gem', 'amiga-os', 'nextstep', 'riso']));
    expect(ids({ shadow: 'none' })).toEqual(expect.arrayContaining(['classifieds', 'swiss']));
    expect(ids({ scene: 'usa', border: 'hairline' })).toEqual(expect.arrayContaining(['classifieds', 'win95']));
  });

  it('searches names, works, original names, authors and places, folding accents', () => {
    expect(ids({ q: 'ポケットモンスター' })).toEqual(['y2k']);
    expect(ids({ q: 'nextstep' })).toEqual(['nextstep']);
    expect(ids({ q: 'verplank' })).toEqual(['xerox-star']);
    expect(ids({ q: 'le corbusier' })).toEqual(['classic']);
    expect(ids({ q: 'japon' })).toEqual(['y2k', 'riso']);
    expect(ids({ q: 'nothing like this' })).toEqual([]);
  });

  it('orders facet options meaningfully', () => {
    const decades = facetOptions(CATALOG, 'decade');
    expect(decades).toEqual([...decades].sort((a, b) => Number(a) - Number(b)));
    expect(facetOptions(CATALOG, 'scene').indexOf('usa')).toBeLessThan(facetOptions(CATALOG, 'scene').indexOf('origins'));
  });

  it('round-trips filters through the URL and drops values no theme has', () => {
    const query = filtersToQuery({ scene: 'usa', q: 'rojo' });
    expect(String(query)).toBe('scene=usa&q=rojo');
    expect(filtersFromQuery(query, CATALOG)).toEqual({ scene: 'usa', q: 'rojo' });
    expect(filtersFromQuery(new URLSearchParams('scene=japan'), CATALOG)).toEqual({});
    expect(filtersFromQuery(new URLSearchParams('scene=mars&decade=1066'), CATALOG)).toEqual({});
  });

  it('labels values in both languages', () => {
    expect([facetLabel('es', 'scene', 'latam'), facetLabel('en', 'decade', '1970'), facetLabel('es', 'shadow', 'none')]).toEqual([
      'Latinoamérica',
      '1970s',
      'Sin sombra',
    ]);
  });
});
