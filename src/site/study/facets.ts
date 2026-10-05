/** Atlas filtering: facets and free-text search over the catalog. Pure functions. */
import { REFERENCE_KINDS, SCENES, SHADOW_KINDS } from '../../study/types';
import type { Lang } from '../../study/types';
import type { CatalogEntry } from '../../study/catalog';
import { BORDER_TEXT, CORNER_TEXT, KIND_TEXT, SCENE_TEXT, SHADOW_TEXT, UI, decadeLabel } from '../i18n';
import type { UIKey } from '../i18n';

export const FACET_KEYS = ['scene', 'decade', 'kind', 'scheme', 'border', 'shadow', 'corners'] as const;
export type FacetKey = (typeof FACET_KEYS)[number];
export type Filters = { readonly [K in FacetKey]?: string } & { readonly q?: string };

export const FACET_LABELS: Record<FacetKey, UIKey> = {
  scene: 'facetScene',
  decade: 'facetDecade',
  kind: 'facetKind',
  scheme: 'facetScheme',
  border: 'facetBorder',
  shadow: 'facetShadow',
  corners: 'facetCorners',
};

const ORDER: Record<FacetKey, readonly string[] | null> = {
  scene: SCENES,
  decade: null,
  kind: REFERENCE_KINDS,
  scheme: ['light', 'dark'],
  border: ['hairline', 'standard', 'heavy'],
  shadow: SHADOW_KINDS,
  corners: ['square', 'soft', 'round'],
};

export const facetValue = (entry: CatalogEntry, key: FacetKey): string => String(entry.facets[key]);

/** The values a facet takes in these entries, in a meaningful order (decades ascending). */
export function facetOptions(entries: readonly CatalogEntry[], key: FacetKey): string[] {
  const present = new Set(entries.map((entry) => facetValue(entry, key)));
  const order = ORDER[key];
  return order ? order.filter((value) => present.has(value)) : [...present].sort((a, b) => Number(a) - Number(b));
}

export function facetLabel(lang: Lang, key: FacetKey, value: string): string {
  switch (key) {
    case 'scene':
      return SCENE_TEXT[value as keyof typeof SCENE_TEXT].name[lang];
    case 'decade':
      return decadeLabel(lang, Number(value));
    case 'kind':
      return KIND_TEXT[value as keyof typeof KIND_TEXT][lang];
    case 'scheme':
      return UI[value === 'dark' ? 'modeDark' : 'modeLight'][lang];
    case 'border':
      return BORDER_TEXT[value as keyof typeof BORDER_TEXT][lang];
    case 'shadow':
      return SHADOW_TEXT[value as keyof typeof SHADOW_TEXT][lang];
    case 'corners':
      return CORNER_TEXT[value as keyof typeof CORNER_TEXT][lang];
  }
}

/** Filters from the atlas URL; values no entry has are dropped, so a stale link still shows themes. */
export function filtersFromQuery(query: URLSearchParams, entries: readonly CatalogEntry[]): Filters {
  const filters: { [K in FacetKey]?: string } & { q?: string } = {};
  for (const key of FACET_KEYS) {
    const value = query.get(key);
    if (value && facetOptions(entries, key).includes(value)) filters[key] = value;
  }
  const q = query.get('q')?.trim();
  if (q) filters.q = q;
  return filters;
}

export function filtersToQuery(filters: Filters): URLSearchParams {
  const query = new URLSearchParams();
  for (const key of FACET_KEYS) {
    const value = filters[key];
    if (value) query.set(key, value);
  }
  if (filters.q?.trim()) query.set('q', filters.q);
  return query;
}

/** Lower case, accents folded: "Pompéia" and "pompeia" match. Other scripts stay as written. */
const fold = (text: string) => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();

/** Everything a search can hit, in both languages. */
export function searchText(entry: CatalogEntry): string {
  const { reference } = entry;
  return fold(
    [
      entry.id,
      entry.name.es,
      entry.name.en,
      reference.title.es,
      reference.title.en,
      reference.original?.text ?? '',
      ...reference.authors,
      reference.place.es,
      reference.place.en,
    ].join(' '),
  );
}

export function matches(entry: CatalogEntry, filters: Filters): boolean {
  for (const key of FACET_KEYS) {
    const wanted = filters[key];
    if (wanted && facetValue(entry, key) !== wanted) return false;
  }
  const terms = fold(filters.q ?? '').split(/\s+/).filter(Boolean);
  const text = searchText(entry);
  return terms.every((term) => text.includes(term));
}

export const applyFilters = (entries: readonly CatalogEntry[], filters: Filters): CatalogEntry[] =>
  entries.filter((entry) => matches(entry, filters));
