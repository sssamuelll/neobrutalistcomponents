import { useRef } from 'react';
import type { CatalogEntry } from '../../study/catalog';
import { PALETTE_TEXT, sourceCount, useLang, useT } from '../i18n';
import { toHash } from '../router';
import { useThemeDetail } from '../study/detail';
import type { ThemeDetail } from '../study/detail';
import { years } from '../study/format';
import { PhotoFigure } from '../study/PhotoFigure';
import { useNearViewport } from '../study/useNearViewport';

/** No free image: the theme's own colours, labelled with what the ficha says about the palette, and the work's lettering. */
function DocumentaryPlate({ entry, detail }: { entry: CatalogEntry; detail: ThemeDetail }) {
  const lang = useLang();
  const t = useT();
  const { palette, lettering } = detail.ficha;
  const original = lettering?.original;
  return (
    <figure className="work-card__plate">
      <ul className="work-card__swatches" aria-label={t('swatchesLabel')}>
        {entry.swatch.map((color, i) => (
          <li key={i}>
            <span className="work-card__swatch" style={{ background: color }} aria-hidden="true" />
            <code>{color}</code>
          </li>
        ))}
      </ul>
      <p className="site-p">
        {t('palette')}, {PALETTE_TEXT[palette.origin][lang]}: {palette.note[lang]}
      </p>
      {original ? (
        <p className="site-p">
          {original.kind === 'none' ? t('letteringNone') : `${t('letteringOriginal')} ${typeof original.name === 'string' ? original.name : original.name[lang]}.`}
        </p>
      ) : null}
      <figcaption>{t('plateLabel')}</figcaption>
    </figure>
  );
}

function WorkCardView({ entry, detail, pending }: { entry: CatalogEntry; detail: ThemeDetail | null; pending: boolean }) {
  const lang = useLang();
  const t = useT();
  const house = entry.predatesStudy;
  const image = detail?.reference.image;
  const media = house ? null : detail ? (
    image ? <PhotoFigure image={image} className="work-card__figure" /> : <DocumentaryPlate entry={entry} detail={detail} />
  ) : pending ? (
    <div className="work-card__placeholder" aria-hidden="true" />
  ) : null;

  return (
    <section className={media ? 'work-card' : 'work-card work-card--text'} aria-labelledby="work-card-title">
      {media ? <div className="work-card__media">{media}</div> : null}
      <div className="work-card__text">
        <p className="work-card__kicker">{t('workKicker')}</p>
        <h2 className="site-h2 work-card__title" id="work-card-title">
          {entry.name[lang]}
        </h2>
        {house ? (
          <p className="work-card__house">{t('houseTheme')}</p>
        ) : (
          <dl className="work-card__facts">
            <div>
              <dt>{t('byLabel')}</dt>
              <dd>{entry.reference.authors.length ? entry.reference.authors.join(', ') : t('anonymous')}</dd>
            </div>
            <div>
              <dt>{t('whenWhere')}</dt>
              <dd>
                {years(entry.reference.date)}, {entry.reference.place[lang]}
              </dd>
            </div>
          </dl>
        )}
        <p className="site-lead">{entry.tagline[lang]}</p>
        {detail && !house ? <p className="work-card__sources">{sourceCount(lang, detail.reference.sources.length)}</p> : null}
        <p className="work-card__more">
          <a href={toHash(lang, `/theme/${entry.id}`)}>
            {t(house ? 'seeTheme' : 'fullRecord')}
            <span aria-hidden="true"> →</span>
          </a>
        </p>
      </div>
    </section>
  );
}

function LoadedWorkCard({ entry }: { entry: CatalogEntry }) {
  const data = useThemeDetail(entry);
  return <WorkCardView entry={entry} detail={data.status === 'ready' ? data.value : null} pending={data.status === 'loading'} />;
}

/** The active theme's provenance: photo or documentary plate, authors, date and place, sources. Its ficha loads near the viewport. */
export function WorkCard({ entry }: { entry: CatalogEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref);
  return (
    <div ref={ref} className="work-card-slot">
      {near && !entry.predatesStudy ? <LoadedWorkCard entry={entry} /> : <WorkCardView entry={entry} detail={null} pending={!entry.predatesStudy} />}
    </div>
  );
}
