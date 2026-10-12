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
    expect(order[NEO_THEMES.length].id).toBe('xerox-star');
    const starts = order.slice(NEO_THEMES.length).map((e) => startYear(e.reference.date));
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});

describe('chipLabel', () => {
  it('names the work, its years and what the chip does', () => {
    expect(chipLabel(entry('aqua'), 'es', 'usar este tema')).toBe('Mac OS X Aqua, 2000: usar este tema');
    const span = { ...entry('xerox-star'), reference: { ...entry('xerox-star').reference, date: [1981, 1982] as const } };
    expect(chipLabel(span, 'en', 'use this theme')).toBe('Xerox Star, 1981–1982: use this theme');
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
    expect(formatAuthors(entry('xerox-star').reference.authors, 'es', '—')).toBe('David Canfield Smith, Charles Irby y equipo');
    expect(formatAuthors(entry('xerox-star').reference.authors, 'en', '—')).toBe('David Canfield Smith, Charles Irby and team');
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
    expect(roomRows(entry('xerox-star'), CATALOG).map((row) => row.entry.id)).toEqual([
      'xerox-star',
      'atari-gem',
      'amiga-os',
      'nextstep',
      'mac-os-classic',
    ]);
    expect(roomRows(entry('material-design'), CATALOG).map((row) => row.entry.id)).toEqual([
      'aqua',
      'beos',
      'win-xp',
      'iphone-os',
      'material-design',
    ]);
  });

  it('gives a house theme the oldest work of each open room', () => {
    const rows = roomRows(entry('classic'), CATALOG);
    expect(rows.map((row) => row.entry.id)).toEqual(['xerox-star']);
    expect(rows.some((row) => row.current)).toBe(false);
  });
});

describe('tokensCss', () => {
  it('writes the tokens as one rule scoped like NeoProvider scopes a theme', () => {
    const css = tokensCss('xerox-star', new Map([['--nbc-bg', '#d9d8d3'], ['--nbc-fg', '#16181b']]));
    expect(css).toBe("[data-theme='xerox-star'] {\n  --nbc-bg: #d9d8d3;\n  --nbc-fg: #16181b;\n}\n");
  });
});
