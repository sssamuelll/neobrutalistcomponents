import { describe, expect, it } from 'vitest';
import { aroundOriginal, commonsTitle, licenseName, startYear, years } from './format';

describe('study formatting', () => {
  it('puts a reference’s original title in a parenthesis, inside the one its title may already end with', () => {
    expect(aroundOriginal('Nakagin Capsule Tower')).toEqual({ before: 'Nakagin Capsule Tower (', after: ')' });
    expect(aroundOriginal('Mäusebunker (former Central Animal Laboratories of the Free University of Berlin)')).toEqual({
      before: 'Mäusebunker (former Central Animal Laboratories of the Free University of Berlin; ',
      after: ')',
    });
  });

  it('names licences the way their owners write them', () => {
    expect([licenseName('CC-BY-SA-4.0', 'en'), licenseName('CC-BY-2.0', 'es'), licenseName('CC0-1.0', 'en')]).toEqual(['CC BY-SA 4.0', 'CC BY 2.0', 'CC0']);
    expect([licenseName('PD', 'es'), licenseName('PD', 'en')]).toEqual(['dominio público', 'public domain']);
  });

  it('prints a year or a span, and sorts by the start', () => {
    expect([years(1978), years([1970, 1972])]).toEqual(['1978', '1970–1972']);
    expect([startYear(1978), startYear([1970, 1972])]).toEqual([1978, 1970]);
  });

  it('reads the file title out of a Commons file page', () => {
    expect(commonsTitle('https://commons.wikimedia.org/wiki/File:SESC_Pompeia_-_S%C3%A3o_Paulo_-_20220726142122.jpg')).toBe(
      'SESC Pompeia - São Paulo - 20220726142122.jpg',
    );
    expect(commonsTitle('https://commons.wikimedia.org/wiki/File:Broken_%E0%A4%A.jpg')).toBe('Broken %E0%A4%A.jpg');
  });
});
