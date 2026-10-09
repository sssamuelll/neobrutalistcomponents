import { describe, expect, it } from 'vitest';
import { CATALOG } from './data';
import { applyFilters, facetLabel, facetOptions, filtersFromQuery, filtersToQuery } from './facets';

const ids = (filters: Parameters<typeof applyFilters>[1]) => applyFilters(CATALOG, filters).map((entry) => entry.id);

describe('atlas facets', () => {
  it('filters by scene, decade and shape', () => {
    expect(ids({ scene: 'japan' })).toEqual(expect.arrayContaining(['nakagin', 'riso', 'y2k']));
    expect(ids({ scene: 'japan' })).not.toContain('classic');
    expect(ids({ decade: '1970' })).toEqual(expect.arrayContaining(['nakagin', 'maeusebunker', 'sesc-pompeia', 'tech']));
    expect(ids({ shadow: 'none' })).toEqual(expect.arrayContaining(['classifieds', 'swiss']));
    expect(ids({ scene: 'usa', border: 'hairline' })).toEqual(expect.arrayContaining(['classifieds', 'tech']));
  });

  it('searches names, works, original names, authors and places, folding accents', () => {
    expect(ids({ q: '中銀' })).toEqual(['nakagin']);
    expect(ids({ q: 'pompeia' })).toEqual(['sesc-pompeia']);
    expect(ids({ q: 'kurokawa' })).toEqual(['nakagin']);
    expect(ids({ q: 'le corbusier' })).toEqual(['classic']);
    expect(ids({ q: 'berlín' })).toEqual(['bauhaus', 'maeusebunker']);
    expect(ids({ q: 'nothing like this' })).toEqual([]);
  });

  it('orders facet options meaningfully', () => {
    const decades = facetOptions(CATALOG, 'decade');
    expect(decades).toEqual([...decades].sort((a, b) => Number(a) - Number(b)));
    expect(facetOptions(CATALOG, 'scene').indexOf('japan')).toBeLessThan(facetOptions(CATALOG, 'scene').indexOf('origins'));
  });

  it('round-trips filters through the URL and drops values no theme has', () => {
    const query = filtersToQuery({ scene: 'latam', q: 'rojo' });
    expect(String(query)).toBe('scene=latam&q=rojo');
    expect(filtersFromQuery(query, CATALOG)).toEqual({ scene: 'latam', q: 'rojo' });
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
