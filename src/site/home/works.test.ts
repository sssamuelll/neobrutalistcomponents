import { describe, expect, it } from 'vitest';
import { NEO_THEMES } from 'neobrutalistcomponents';
import { CATALOG, ENTRIES } from '../study/data';
import { startYear } from '../study/format';
import { chipLabel, formatAuthors, ribbonOrder, roomRows, tokensCss } from './works';

const entry = (id: string) => ENTRIES.get(id)!;

describe('ribbonOrder', () => {
  it('puts the house themes first, then every work from the oldest', () => {
    const order = ribbonOrder(CATALOG);
    expect(order).toHaveLength(CATALOG.length);
    expect(order.slice(0, NEO_THEMES.length).map((e) => e.id)).toEqual([...NEO_THEMES]);
    expect(order[NEO_THEMES.length].id).toBe('loteria');
    const starts = order.slice(NEO_THEMES.length).map((e) => startYear(e.reference.date));
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});

describe('chipLabel', () => {
  it('names the work, its years and what the chip does', () => {
    expect(chipLabel(entry('dragon-quest'), 'es', 'usar este tema')).toBe('Dragon Quest, 1986: usar este tema');
    expect(chipLabel(entry('nakagin'), 'en', 'use this theme')).toBe('Nakagin, 1970–1972: use this theme');
  });

  it('gives a house theme no year', () => {
    expect(chipLabel(entry('classic'), 'en', 'use this theme')).toBe('Classic: use this theme');
  });
});

describe('formatAuthors', () => {
  it('lists one or two authors, then «y equipo» / «and team»', () => {
    expect(formatAuthors(['Kisho Kurokawa'], 'es', '—')).toBe('Kisho Kurokawa');
    expect(formatAuthors(['Otl Aicher', 'Gerhard Joksch'], 'es', '—')).toBe('Otl Aicher y Gerhard Joksch');
    expect(formatAuthors(['Otl Aicher', 'Gerhard Joksch'], 'en', '—')).toBe('Otl Aicher and Gerhard Joksch');
    expect(formatAuthors(entry('dragon-quest').reference.authors, 'es', '—')).toBe('Yuji Horii, Koichi Nakamura y equipo');
    expect(formatAuthors(entry('dragon-quest').reference.authors, 'en', '—')).toBe('Yuji Horii, Koichi Nakamura and team');
  });

  it('names an anonymous work with the text it is given', () => {
    expect(formatAuthors([], 'es', 'Anónimo / vernáculo')).toBe('Anónimo / vernáculo');
  });
});

describe('roomRows', () => {
  it('shows five works of the room around the active one', () => {
    const rows = roomRows(entry('win95'), CATALOG);
    expect(rows.map((row) => row.entry.id)).toEqual(['win31', 'classifieds', 'win95', 'palm-os', 'aqua']);
    expect(rows.filter((row) => row.current).map((row) => row.entry.id)).toEqual(['win95']);
  });

  it('starts at the room’s first work and stops at its last', () => {
    expect(roomRows(entry('lettera-22'), CATALOG).map((row) => row.entry.id)).toEqual(['lettera-22', 'carlton']);
  });

  it('gives a house theme the oldest work of each room', () => {
    const rows = roomRows(entry('classic'), CATALOG);
    expect(rows.map((row) => row.entry.id)).toEqual(['tokyo-1964', 'bauhaus-dessau', 'whaam', 'loteria', 'lettera-22']);
    expect(rows.some((row) => row.current)).toBe(false);
  });
});

describe('tokensCss', () => {
  it('writes the tokens as one rule scoped like NeoProvider scopes a theme', () => {
    const css = tokensCss('nakagin', new Map([['--nbc-bg', '#d9d8d3'], ['--nbc-fg', '#16181b']]));
    expect(css).toBe("[data-theme='nakagin'] {\n  --nbc-bg: #d9d8d3;\n  --nbc-fg: #16181b;\n}\n");
  });
});
