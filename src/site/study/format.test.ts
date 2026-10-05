import { describe, expect, it } from 'vitest';
import { licenseName, startYear, years } from './format';

describe('study formatting', () => {
  it('names licences the way their owners write them', () => {
    expect([licenseName('CC-BY-SA-4.0', 'en'), licenseName('CC-BY-2.0', 'es'), licenseName('CC0-1.0', 'en')]).toEqual(['CC BY-SA 4.0', 'CC BY 2.0', 'CC0']);
    expect([licenseName('PD', 'es'), licenseName('PD', 'en')]).toEqual(['dominio público', 'public domain']);
  });

  it('prints a year or a span, and sorts by the start', () => {
    expect([years(1978), years([1970, 1972])]).toEqual(['1978', '1970–1972']);
    expect([startYear(1978), startYear([1970, 1972])]).toEqual([1978, 1970]);
  });
});
