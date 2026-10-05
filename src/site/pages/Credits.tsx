import type { CatalogEntry } from '../../study/catalog';
import type { Reference } from '../../study/types';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';
import { FONT_LICENSE_URLS, fontCredits, specimenUrl } from '../study/credits';
import { CATALOG } from '../study/data';
import { loadThemeData } from '../study/detail';
import { LICENSE_URLS, commonsTitle, licenseName } from '../study/format';
import { useLazy } from '../study/lazy';

const FONTS = fontCredits(CATALOG);

const loadReferences = (): Promise<{ entry: CatalogEntry; reference: Reference }[]> =>
  Promise.all(CATALOG.map(async (entry) => ({ entry, reference: (await loadThemeData(entry)).reference })));

function ThemeLinks({ entries }: { entries: readonly CatalogEntry[] }) {
  const lang = useLang();
  return entries.map((entry, i) => (
    <span key={entry.id}>
      {i ? ', ' : ''}
      <a href={toHash(lang, `/theme/${entry.id}`)}>{entry.name[lang]}</a>
    </span>
  ));
}

function Photographs() {
  const lang = useLang();
  const t = useT();
  const references = useLazy('credits:references', loadReferences);
  if (references.status === 'error') return <p className="site-p">{t('loadError')}</p>;
  if (references.status === 'loading') {
    return (
      <p className="site-p" role="status">
        {t('loading')}
      </p>
    );
  }
  return (
    <div className="site-props">
      <table aria-labelledby="credits-photographs">
        <thead>
          <tr>
            <th scope="col">{t('colTheme')}</th>
            <th scope="col">{t('colAuthor')}</th>
            <th scope="col">{t('colLicense')}</th>
            <th scope="col">{t('colSource')}</th>
          </tr>
        </thead>
        <tbody>
          {references.value.map(({ entry, reference: { image } }) =>
            image ? (
              <tr key={entry.id}>
                <th scope="row">
                  <a href={toHash(lang, `/theme/${entry.id}`)}>{entry.name[lang]}</a>
                </th>
                <td>{image.author}</td>
                <td className="study-nowrap">
                  <a href={LICENSE_URLS[image.license]} target="_blank" rel="noreferrer">
                    {licenseName(image.license, lang)}
                  </a>
                </td>
                <td>
                  <a href={image.sourceUrl} target="_blank" rel="noreferrer">
                    {commonsTitle(image.sourceUrl)}
                  </a>
                </td>
              </tr>
            ) : null,
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Every photograph and every typeface the study uses, with its licence, generated from data. */
export function Credits() {
  const t = useT();
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleCredits')}</h1>
        <p className="site-lead">{t('creditsLead')}</p>
      </header>

      <section aria-labelledby="credits-photographs">
        <h2 className="site-h2" id="credits-photographs">
          {t('photographsHeading')}
        </h2>
        <Photographs />
      </section>

      <section aria-labelledby="credits-fonts">
        <h2 className="site-h2" id="credits-fonts">
          {t('fontsHeading')}
        </h2>
        <div className="site-props">
          <table aria-labelledby="credits-fonts">
            <thead>
              <tr>
                <th scope="col">{t('colFamily')}</th>
                <th scope="col">{t('colLicense')}</th>
                <th scope="col">{t('colUsedBy')}</th>
              </tr>
            </thead>
            <tbody>
              {FONTS.map((font) => (
                <tr key={font.family}>
                  <th scope="row">
                    <a href={specimenUrl(font.family)} target="_blank" rel="noreferrer">
                      {font.family}
                    </a>
                  </th>
                  <td>
                    <a href={FONT_LICENSE_URLS[font.license]} target="_blank" rel="noreferrer">
                      {font.license}
                    </a>
                  </td>
                  <td>
                    <ThemeLinks entries={font.usedBy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
