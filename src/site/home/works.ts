/** What the home says about the catalog's works. Pure: no React, no DOM. */
import type { CatalogEntry } from '../../study/catalog';
import { THEME_SCENES } from '../../study/types';
import type { Lang } from '../../study/types';
import { startYear, years } from '../study/format';

const byYear = (a: CatalogEntry, b: CatalogEntry) => startYear(a.reference.date) - startYear(b.reference.date) || (a.id < b.id ? -1 : 1);

/** The ribbon's order: the house themes as the catalog lists them, then the study's works from the oldest. */
export function ribbonOrder(catalog: readonly CatalogEntry[]): CatalogEntry[] {
  return [...catalog.filter((entry) => entry.predatesStudy), ...catalog.filter((entry) => !entry.predatesStudy).sort(byYear)];
}

/** A chip's accessible name: 'Dragon Quest, 1986: usar este tema'. House themes carry no year. */
export function chipLabel(entry: CatalogEntry, lang: Lang, use: string): string {
  const name = entry.name[lang];
  return entry.predatesStudy ? `${name}: ${use}` : `${name}, ${years(entry.reference.date)}: ${use}`;
}

/** One or two authors by name; from three on, the first two and «y equipo» / «and team». */
// ponytail: Spanish «y» never turns into «e» before an i- sound; no author in the catalog needs it yet.
export function formatAuthors(authors: readonly string[], lang: Lang, anonymous: string): string {
  const and = lang === 'es' ? 'y' : 'and';
  if (authors.length === 0) return anonymous;
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} ${and} ${authors[1]}`;
  return `${authors[0]}, ${authors[1]} ${lang === 'es' ? 'y equipo' : 'and team'}`;
}

export interface RoomRow {
  readonly entry: CatalogEntry;
  readonly current: boolean;
}

/**
 * The works the wall's table lists: `size` works of the active work's room, by date, around the
 * active one. A house theme has no room, so it gets the oldest work of each room.
 */
export function roomRows(active: CatalogEntry, catalog: readonly CatalogEntry[], size = 5): RoomRow[] {
  const works = catalog.filter((entry) => !entry.predatesStudy);
  if (active.predatesStudy) {
    return THEME_SCENES.flatMap((scene) => {
      const oldest = works.filter((entry) => entry.scene === scene).sort(byYear)[0];
      return oldest ? [{ entry: oldest, current: false }] : [];
    });
  }
  const room = works.filter((entry) => entry.scene === active.scene).sort(byYear);
  const at = room.findIndex((entry) => entry.id === active.id);
  const start = Math.max(0, Math.min(at - Math.floor(size / 2), room.length - size));
  return room.slice(start, start + size).map((entry) => ({ entry, current: entry.id === active.id }));
}

/** A theme's tokens as one CSS rule, scoped the way NeoProvider applies a theme. */
export function tokensCss(id: string, tokens: ReadonlyMap<string, string>): string {
  const lines = [...tokens].map(([name, value]) => `  ${name}: ${value};`);
  return `[data-theme='${id}'] {\n${lines.join('\n')}\n}\n`;
}
