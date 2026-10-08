import { useMemo } from 'react';
import { Button, NeoProvider } from 'neobrutalistcomponents';
import { useLang, useT, SCENE_TEXT } from '../i18n';
import { toHash } from '../router';
import { CATALOG } from '../study/data';
import type { CatalogEntry } from '../../study/catalog';
import { startYear, years, sceneHref } from '../study/format';
import { GalleryPiece } from '../study/GalleryPiece';
import { useThemeStylesheet } from '../study/loader';

function TimelineWork({ entry, index, total }: { entry: CatalogEntry; index: number; total: number }) {
  const lang = useLang();
  const t = useT();
  useThemeStylesheet(entry.id);

  return (
    <article className="gallery-work" aria-label={entry.name[lang]}>
      <div className="gallery-work__inner">
        <div className="gallery-work__info">
          <div className="gallery-work__meta">
            <span className="gallery-work__num">
              {t('workNo')} {String(index + 1).padStart(2, '0')} / {total}
            </span>
            <span className="gallery-work__year">{years(entry.reference.date)}</span>
          </div>
          
          <h2 className="site-h2 gallery-work__title">
            <a href={toHash(lang, `/theme/${entry.id}`)}>{entry.name[lang]}</a>
          </h2>
          <p className="site-lead gallery-work__tagline">{entry.tagline[lang]}</p>
          
          <dl className="site-parts gallery-work__facts">
            <div className="site-parts__item">
              <dt>{t('byLabel')}</dt>
              <dd>{entry.reference.authors.join(', ')}</dd>
            </div>
            <div className="site-parts__item">
              <dt>{t('whenWhere')}</dt>
              <dd>{entry.reference.place[lang]}</dd>
            </div>
            <div className="site-parts__item">
              <dt>{t('mediumLabel')}</dt>
              <dd>{t('mediumValue')}</dd>
            </div>
            <div className="site-parts__item">
              <dt>{t('roomLabel')}</dt>
              <dd><a href={sceneHref(lang, entry.scene)}>{SCENE_TEXT[entry.scene].name[lang]}</a></dd>
            </div>
          </dl>

          <div className="gallery-work__actions">
            <Button asChild variant="secondary">
              <a href={toHash(lang, `/theme/${entry.id}`)}>{t('fullRecord')}</a>
            </Button>
          </div>
        </div>
        
        <NeoProvider theme={entry.id} className="gallery-work__stage">
          <GalleryPiece />
        </NeoProvider>
      </div>
    </article>
  );
}

export function StudyHome() {
  const lang = useLang();
  const t = useT();

  const works = useMemo(() => {
    return [...CATALOG].sort((a, b) => startYear(a.reference.date) - startYear(b.reference.date));
  }, []);

  return (
    <div className="site-page gallery-home">
      <header className="study-hero gallery-hero" aria-labelledby="study-title">
        <div className="study-hero__copy">
          <p className="site-h3" style={{ color: 'var(--nbc-primary)' }}>{t('galleryKicker')}</p>
          <h1 className="site-h1 study-hero__title" id="study-title">
            {t('studyTitle')}
          </h1>
          <p className="site-lead">{t('studyLead')}</p>
          <div className="study-hero__actions">
            <Button asChild size="lg">
              <a href="#collection">{t('galleryVisit')}</a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href={toHash(lang, '/atlas')}>{t('galleryWall')}</a>
            </Button>
          </div>
        </div>
      </header>

      <section id="collection" className="gallery-collection" aria-labelledby="collection-heading">
        <div className="gallery-collection__intro">
          <h2 className="site-h2" id="collection-heading">{t('collectionHeading')}</h2>
          <p className="site-p">{t('collectionLead')}</p>
        </div>
        
        <div className="gallery-chronology">
          {works.map((entry, index) => (
            <TimelineWork key={entry.id} entry={entry} index={index} total={works.length} />
          ))}
        </div>
      </section>
    </div>
  );
}
