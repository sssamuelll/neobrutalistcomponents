import { Button } from 'neobrutalistcomponents';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';
import { CodeBlock } from '../docs/CodeBlock';
import { CATALOG, STUDY_ENTRIES } from '../study/data';
import { Essay } from '../study/Essay';
import { SceneCards } from '../study/SceneCards';
import { ThemeTile } from '../study/ThemeCard';

/** The study's own themes first, then the library's; at most twelve tiles however large the catalog grows. */
const MOSAIC = [...STUDY_ENTRIES, ...CATALOG.filter((entry) => entry.predatesStudy)].slice(0, 12);

const USE_CODE = `import { NeoProvider } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/nakagin.css';

export function App() {
  return <NeoProvider theme="nakagin">{/* your app */}</NeoProvider>;
}`;

/** The study's home: the thesis, its scenes, a way into the atlas and how to use the themes. */
export function StudyHome() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="site-page study-home">
      <section className="study-hero" aria-labelledby="study-title">
        <div className="study-hero__copy">
          <h1 className="site-h1 study-hero__title" id="study-title">
            {t('studyTitle')}
          </h1>
          <p className="site-lead">{t('studyLead')}</p>
          <div className="study-hero__actions">
            <Button asChild size="lg">
              <a href={toHash(lang, '/atlas')}>{t('openAtlas')}</a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href={toHash(lang, '/method')}>{t('readMethod')}</a>
            </Button>
          </div>
        </div>
        <ul className="study-mosaic" aria-label={t('mosaicLabel')}>
          {MOSAIC.map((entry) => (
            <ThemeTile key={entry.id} entry={entry} />
          ))}
        </ul>
      </section>

      <div className="study-section">
        <Essay slug="home" />
      </div>

      <section className="study-section" aria-labelledby="study-scenes">
        <h2 className="site-h2" id="study-scenes">
          {t('scenesHeading')}
        </h2>
        <SceneCards />
      </section>

      <section className="study-section study-use" aria-labelledby="study-use">
        <div>
          <h2 className="site-h2" id="study-use">
            {t('useHeading')}
          </h2>
          <p className="site-p">{t('useBody')}</p>
        </div>
        <CodeBlock code={USE_CODE} label="TSX" />
      </section>
    </div>
  );
}
