import { Button, Input, Select } from 'neobrutalistcomponents';
import { themeCount, useLang, useT } from '../i18n';
import { replaceHash, toHash } from '../router';
import { CATALOG } from '../study/data';
import { FACET_KEYS, FACET_LABELS, applyFilters, facetLabel, facetOptions, filtersFromQuery, filtersToQuery } from '../study/facets';
import type { FacetKey, Filters } from '../study/facets';
import { ThemeCard } from '../study/ThemeCard';

/** Every theme, filtered by facets and search; the filters live in the URL. */
export function Atlas({ query }: { query: URLSearchParams }) {
  const lang = useLang();
  const t = useT();
  const filters = filtersFromQuery(query, CATALOG);
  const results = applyFilters(CATALOG, filters);
  const active = Object.keys(filters).length > 0;
  const update = (next: Filters) => replaceHash(toHash(lang, '/atlas', filtersToQuery(next)));
  const set = (key: FacetKey | 'q', value: string) => update({ ...filters, [key]: value || undefined });

  return (
    <div className="site-page site-atlas">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleAtlas')}</h1>
        <p className="site-lead">{t('atlasLead')}</p>
      </header>

      <form className="site-atlas__filters" role="search" aria-label={t('filters')} onSubmit={(e) => e.preventDefault()}>
        <div className="site-atlas__search">
          <Input
            type="search"
            label={t('search')}
            placeholder={t('searchPlaceholder')}
            value={query.get('q') ?? ''}
            onChange={(e) => set('q', e.target.value)}
          />
        </div>
        {FACET_KEYS.map((key) => (
          <Select key={key} label={t(FACET_LABELS[key])} value={filters[key] ?? ''} onChange={(e) => set(key, e.target.value)}>
            <option value="">{t('any')}</option>
            {facetOptions(CATALOG, key).map((value) => (
              <option key={value} value={value}>
                {facetLabel(lang, key, value)}
              </option>
            ))}
          </Select>
        ))}
      </form>

      <div className="site-atlas__status">
        <p className="site-p" aria-live="polite">
          {themeCount(lang, results.length)}
        </p>
        {active ? (
          <Button variant="ghost" size="sm" onClick={() => update({})}>
            {t('clearFilters')}
          </Button>
        ) : null}
      </div>

      {results.length ? (
        <ul className="site-cards">
          {results.map((entry) => (
            <ThemeCard key={entry.id} entry={entry} heading="h2" />
          ))}
        </ul>
      ) : (
        <p className="site-lead site-atlas__empty">{t('noResults')}</p>
      )}
    </div>
  );
}
