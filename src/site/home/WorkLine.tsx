import type { CatalogEntry } from '../../study/catalog';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';
import { years } from '../study/format';
import { formatAuthors } from './works';

/** One line under the ribbon naming the active theme; a polite live region, so a picked work is announced. */
export function WorkLine({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const house = entry.predatesStudy;
  return (
    <p className="monument__work" aria-live="polite">
      <strong>{entry.name[lang]}</strong>
      {' · '}
      {house ? t('houseTheme') : `${formatAuthors(entry.reference.authors, lang, t('anonymous'))} · ${years(entry.reference.date)}`}
      {' · '}
      <a href={toHash(lang, `/theme/${entry.id}`)}>
        {t(house ? 'seeTheme' : 'seeWork')}
        <span aria-hidden="true"> →</span>
      </a>
    </p>
  );
}
