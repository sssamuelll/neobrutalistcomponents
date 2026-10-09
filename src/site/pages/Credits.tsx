import type { CatalogEntry } from '../../study/catalog';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';
import { TableScroll } from '../docs/TableScroll';
import { FONT_LICENSE_URLS, fontCredits, specimenUrl } from '../study/credits';
import type { FontCredit } from '../study/credits';
import { CATALOG } from '../study/data';
import { LICENSE_URLS, commonsTitle, licenseName } from '../study/format';

function ThemeLinks({ entries }: { entries: readonly CatalogEntry[] }) {
  const lang = useLang();
  return entries.map((entry, i) => (
    <span key={entry.id}>
      {i ? ', ' : ''}
      <a href={toHash(lang, `/theme/${entry.id}`)}>{entry.name[lang]}</a>
    </span>
  ));
}

/** The themes with a photograph, from the catalog: no theme's data chunk is loaded for its credit. */
const PHOTOGRAPHED = CATALOG.filter((entry) => entry.image);

function Photographs() {
  const lang = useLang();
  const t = useT();
  return (
    <TableScroll label={t('photographsHeading')}>
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
          {PHOTOGRAPHED.map(({ id, name, image }) =>
            image ? (
              <tr key={id}>
                <th scope="row">
                  <a href={toHash(lang, `/theme/${id}`)}>{name[lang]}</a>
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
    </TableScroll>
  );
}

/** Computed on this page, never at boot: a family without a recorded licence (fonts.test.ts stops it in CI) fails this table only. */
function typefaceCredits(): FontCredit[] | null {
  try {
    return fontCredits(CATALOG);
  } catch {
    return null;
  }
}

function Typefaces() {
  const t = useT();
  const fonts = typefaceCredits();
  if (!fonts) {
    return (
      <p className="site-p" role="alert">
        {t('fontsUnavailable')}
      </p>
    );
  }
  return (
    <TableScroll label={t('fontsHeading')}>
      <table aria-labelledby="credits-fonts">
        <thead>
          <tr>
            <th scope="col">{t('colFamily')}</th>
            <th scope="col">{t('colLicense')}</th>
            <th scope="col">{t('colUsedBy')}</th>
          </tr>
        </thead>
        <tbody>
          {fonts.map((font) => (
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
    </TableScroll>
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
        <Typefaces />
      </section>
    </div>
  );
}
