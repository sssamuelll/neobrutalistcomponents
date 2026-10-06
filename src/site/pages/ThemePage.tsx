import { Button, NeoProvider } from 'neobrutalistcomponents';
import type { NeoMode } from 'neobrutalistcomponents';
import type { Scheme } from '../../lib/themes/color';
import type { CatalogEntry } from '../../study/catalog';
import { PALETTE_TEXT, SCENE_TEXT, useLang, useT } from '../i18n';
import { useSitePrefsContext } from '../prefsContext';
import { toHash } from '../router';
import { CodeBlock } from '../docs/CodeBlock';
import { ThemeSampler } from '../docs/ThemeSampler';
import { TokenTables } from '../docs/TokenTables';
import { CATALOG, ENTRIES } from '../study/data';
import { imageUrl, useThemeDetail } from '../study/detail';
import type { ThemeDetail } from '../study/detail';
import { LICENSE_URLS, licenseName, sceneHref, startYear, years } from '../study/format';
import { loadThemeStylesheet, useThemeStylesheet } from '../study/loader';
import { SourceList } from '../study/SourceList';
import { NotFound } from './NotFound';

function schemeFor(native: 'light' | 'dark', mode: NeoMode | 'native'): Scheme {
  if (mode === 'light' || mode === 'dark') return mode;
  if (mode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return native;
}

const installCode = (id: string, fonts: boolean) => `import { NeoProvider } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/${id}.css';
import 'neobrutalistcomponents/themes/${id}.fonts.css'; // ${fonts ? 'optional: loads the theme’s fonts' : 'system fonts: nothing to load'}

export function App() {
  return <NeoProvider theme="${id}">{/* your app */}</NeoProvider>;
}`;

/** Themes of the same scene, by the reference's start year. */
const siblingsOf = (entry: CatalogEntry) =>
  CATALOG.filter((e) => e.scene === entry.scene).sort(
    (a, b) => startYear(a.reference.date) - startYear(b.reference.date) || (a.id < b.id ? -1 : 1),
  );

function Reference({ entry, detail }: { entry: CatalogEntry; detail: ThemeDetail }) {
  const lang = useLang();
  const t = useT();
  const { reference } = detail;
  return (
    <dl className="site-band__facts">
      <div>
        <dt>{t('refLabel')}</dt>
        <dd>
          {reference.title[lang]}
          {reference.original ? (
            <>
              {' '}
              (<span lang={reference.original.lang}>{reference.original.text}</span>)
            </>
          ) : null}
        </dd>
      </div>
      <div>
        <dt>{t('byLabel')}</dt>
        <dd>{reference.authors.length ? reference.authors.join(', ') : t('anonymous')}</dd>
      </div>
      <div>
        <dt>{t('whenWhere')}</dt>
        <dd>
          {years(reference.date)}, {reference.place[lang]}
        </dd>
      </div>
      <div>
        <dt>{t('sceneLabel')}</dt>
        <dd>
          <a href={sceneHref(lang, entry.scene)}>{SCENE_TEXT[entry.scene].name[lang]}</a>
        </dd>
      </div>
      <div>
        <dt>{t('typefacesLabel')}</dt>
        <dd>{entry.fonts.length ? entry.fonts.join(', ') : t('systemFonts')}</dd>
      </div>
      <div>
        <dt>{t('schemeLabel')}</dt>
        <dd>{t(entry.nativeScheme === 'dark' ? 'modeDark' : 'modeLight')}</dd>
      </div>
    </dl>
  );
}

function Figure({ detail }: { detail: ThemeDetail }) {
  const lang = useLang();
  const t = useT();
  const { image, archiveUrl, sources } = detail.reference;
  const url = image ? imageUrl(image.file) : undefined;
  if (image && url) {
    return (
      <figure className="site-themepage__figure">
        <img src={url} alt={image.alt[lang]} width={image.width} height={image.height} loading="lazy" decoding="async" />
        <figcaption>
          {t('photoBy')} {image.author},{' '}
          <a href={LICENSE_URLS[image.license]} target="_blank" rel="noreferrer">
            {licenseName(image.license, lang)}
          </a>
          , {t('via')}{' '}
          <a href={image.sourceUrl} target="_blank" rel="noreferrer">
            Wikimedia Commons
          </a>
          ; {t('converted')}.
        </figcaption>
      </figure>
    );
  }
  const href = archiveUrl ?? sources[0].url;
  return (
    <div className="site-themepage__noimage">
      <p className="site-p">{t('noImage')}</p>
      <a href={href} target="_blank" rel="noreferrer">
        {t(archiveUrl ? 'seeArchive' : 'seeSource')}
      </a>
    </div>
  );
}

function Ficha({ detail }: { detail: ThemeDetail }) {
  const lang = useLang();
  const t = useT();
  const { ficha, reference } = detail;
  return (
    <section className="site-themepage__ficha" aria-labelledby="ficha-documented">
      <h2 className="site-h2" id="ficha-documented">
        {t('documented')}
      </h2>
      <p className="site-p">{ficha.documented[lang]}</p>
      <h2 className="site-h2">{t('reading')}</h2>
      <p className="site-p">{ficha.reading[lang]}</p>
      <p className="site-p site-themepage__palette">
        {t('palette')}, {PALETTE_TEXT[ficha.palette.origin][lang]}: {ficha.palette.note[lang]}
      </p>
      <h2 className="site-h2">{t('sources')}</h2>
      <SourceList sources={reference.sources} />
    </section>
  );
}

function ThemeView({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const { prefs, update } = useSitePrefsContext();
  const status = useThemeStylesheet(entry.id);
  const data = useThemeDetail(entry);
  const inUse = prefs.theme === entry.id;

  if (status === 'error' || data.status === 'error') {
    return (
      <div className="site-page">
        <p className="site-lead" role="alert">
          {t('themeLoadError')}
        </p>
        <p className="site-p">
          <a href={toHash(lang, '/atlas')}>{t('backToAtlas')}</a>
        </p>
      </div>
    );
  }
  if (status !== 'ready' || data.status !== 'ready') {
    return (
      <p className="site-page site-lead" role="status">
        {t('loadingTheme')}
      </p>
    );
  }

  const detail = data.value;
  const siblings = siblingsOf(entry);
  const index = siblings.indexOf(entry);
  const previous = siblings[index - 1];
  const next = siblings[index + 1];
  const mode = prefs.mode === 'native' ? undefined : prefs.mode;

  return (
    <NeoProvider theme={entry.id} mode={mode} className="site-themepage">
      <div className="site-themepage__inner">
        <p className="site-doc__crumbs">
          <a href={toHash(lang, '/atlas')}>{t('backToAtlas')}</a>
        </p>

        <div className="site-themepage__intro">
          <header className="site-themepage__head">
            <h1 className="site-themepage__title">{entry.name[lang]}</h1>
            <p className="site-lead">{entry.tagline[lang]}</p>
            {entry.predatesStudy ? <p className="site-themepage__note">{t('predatesStudy')}</p> : null}
          </header>
          <div className="site-themepage__facts">
            <Reference entry={entry} detail={detail} />
            <div className="site-themepage__actions">
              <Button disabled={inUse} onClick={() => void loadThemeStylesheet(entry.id).then(() => update({ theme: entry.id }))}>
                {t(inUse ? 'inUse' : 'useAcrossSite')}
              </Button>
            </div>
          </div>
          <Figure detail={detail} />
        </div>

        <Ficha detail={detail} />

        <section aria-labelledby="theme-specimen">
          <h2 className="site-h2" id="theme-specimen">
            {t('specimenHeading')}
          </h2>
          <div className="site-themepage__specimens">
            {(['light', 'dark'] as const).map((scheme) => (
              <NeoProvider key={scheme} theme={entry.id} mode={scheme} className="site-themepage__specimen">
                <p className="site-themepage__label">{t(scheme === 'dark' ? 'modeDark' : 'modeLight')}</p>
                <ThemeSampler />
              </NeoProvider>
            ))}
          </div>
        </section>

        <section aria-labelledby="theme-tokens">
          <h2 className="site-h2" id="theme-tokens">
            {t('tokensHeading')}
          </h2>
          <TokenTables tokens={detail.tokens} scheme={schemeFor(entry.nativeScheme, prefs.mode)} />
        </section>

        <section aria-labelledby="theme-install">
          <h2 className="site-h2" id="theme-install">
            {t('installHeading')}
          </h2>
          {entry.predatesStudy ? null : <p className="site-p">{t('installStudyNote')}</p>}
          <CodeBlock code={installCode(entry.id, entry.fonts.length > 0)} label="TSX" />
        </section>

        <nav className="site-pager" aria-label={t('themeNav')}>
          {previous ? (
            <a href={toHash(lang, `/theme/${previous.id}`)} rel="prev">
              <span className="site-pager__dir">{t('previousTheme')}</span> {previous.name[lang]}
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a href={toHash(lang, `/theme/${next.id}`)} rel="next">
              <span className="site-pager__dir">{t('nextTheme')}</span> {next.name[lang]}
            </a>
          ) : null}
        </nav>
      </div>
    </NeoProvider>
  );
}

/** One theme's page: its reference and ficha, a live specimen in both schemes, its numbers and how to install it. */
export function ThemePage({ id }: { id: string }) {
  const entry = ENTRIES.get(id);
  return entry ? <ThemeView key={entry.id} entry={entry} /> : <NotFound />;
}
