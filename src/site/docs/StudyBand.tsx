import { NeoProvider } from 'neobrutalistcomponents';
import type { NeoMode } from 'neobrutalistcomponents';
import type { Scheme } from '../../lib/themes/color';
import type { ImageLicense, Reference, Scene } from '../../study/types';
import { useSitePrefsContext } from '../prefsContext';
import { ThemeSampler } from './ThemeSampler';
import { TokenTables } from './TokenTables';
import type { StudyPreview } from './studyThemes';

const SCENE_NAMES: Record<Scene, string> = {
  japan: 'Japan',
  germany: 'Germany',
  usa: 'United States',
  latam: 'Latin America',
  origins: 'Origins',
};

const LICENSE_URLS: Record<ImageLicense, string> = {
  'CC0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
  PD: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
  'CC-BY-2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'CC-BY-2.5': 'https://creativecommons.org/licenses/by/2.5/',
  'CC-BY-3.0': 'https://creativecommons.org/licenses/by/3.0/',
  'CC-BY-4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC-BY-SA-2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
  'CC-BY-SA-2.5': 'https://creativecommons.org/licenses/by-sa/2.5/',
  'CC-BY-SA-3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC-BY-SA-4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
};

/** 'CC-BY-SA-4.0' → 'CC BY-SA 4.0' */
const licenseName = (license: ImageLicense) =>
  license === 'PD' ? 'public domain' : license === 'CC0-1.0' ? 'CC0' : license.replace(/^CC-/, 'CC ').replace(/-(\d)/, ' $1');

const years = (date: Reference['date']) => (typeof date === 'number' ? String(date) : `${date[0]}–${date[1]}`);

function schemeFor(native: 'light' | 'dark', mode: NeoMode | 'native'): Scheme {
  if (mode === 'light' || mode === 'dark') return mode;
  if (mode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return native;
}

/** One proof theme of the study: its reference, its ficha, a live sample and its numbers. */
export function StudyBand({ preview }: { preview: StudyPreview }) {
  const { prefs } = useSitePrefsContext();
  const { theme, entry, tokens, imageUrl } = preview;
  const { reference, ficha } = theme;
  const image = reference.image;

  return (
    <NeoProvider
      as="section"
      theme={theme.id}
      mode={prefs.mode === 'native' ? undefined : prefs.mode}
      className="site-band site-study"
      aria-labelledby={`theme-${theme.id}`}
    >
      {entry.fontsHref ? <link rel="stylesheet" href={entry.fontsHref} precedence="study-fonts" /> : null}
      <div className="site-band__inner">
        <header className="site-band__head">
          <h2 className="site-band__title" id={`theme-${theme.id}`}>
            {theme.name.en}
          </h2>
          <p className="site-band__tagline">{theme.tagline.en}</p>
          <dl className="site-band__facts">
            <div>
              <dt>Reference</dt>
              <dd>
                {reference.title.en}
                {reference.original ? (
                  <>
                    {' '}
                    (<span lang={reference.original.lang}>{reference.original.text}</span>)
                  </>
                ) : null}
              </dd>
            </div>
            <div>
              <dt>By</dt>
              <dd>{reference.authors.length ? reference.authors.join(', ') : 'Anonymous / vernacular'}</dd>
            </div>
            <div>
              <dt>When and where</dt>
              <dd>
                {years(reference.date)}, {reference.place.en}
              </dd>
            </div>
            <div>
              <dt>Scene</dt>
              <dd>{SCENE_NAMES[theme.scene]}</dd>
            </div>
            <div>
              <dt>Fonts</dt>
              <dd>{entry.fonts.length ? entry.fonts.join(', ') : 'System fonts'}</dd>
            </div>
            <div>
              <dt>Native scheme</dt>
              <dd>{theme.nativeScheme}</dd>
            </div>
          </dl>
        </header>

        {image && imageUrl ? (
          <figure className="site-study__figure">
            <img src={imageUrl} alt={image.alt.en} width={image.width} height={image.height} loading="lazy" decoding="async" />
            <figcaption>
              Photo: {image.author},{' '}
              <a href={LICENSE_URLS[image.license]} target="_blank" rel="noreferrer">
                {licenseName(image.license)}
              </a>
              , via{' '}
              <a href={image.sourceUrl} target="_blank" rel="noreferrer">
                Wikimedia Commons
              </a>
              ; resized and converted to AVIF.
            </figcaption>
          </figure>
        ) : reference.archiveUrl ? (
          <p className="site-study__noimage">
            No free image of this reference.{' '}
            <a href={reference.archiveUrl} target="_blank" rel="noreferrer">
              See the archived page in the Wayback Machine
            </a>
            .
          </p>
        ) : null}
        <div className="site-study__text">
          <h3 className="site-h3">What is documented</h3>
          <p className="site-p">{ficha.documented.en}</p>
          <h3 className="site-h3">The reading</h3>
          <p className="site-p">{ficha.reading.en}</p>
          <p className="site-p site-study__palette">
            Palette, {ficha.palette.origin}: {ficha.palette.note.en}
          </p>
          <h3 className="site-h3">Sources</h3>
          <ol className="site-study__sources">
            {reference.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                </a>
                {source.publisher ? `, ${source.publisher}` : ''}
                {source.year ? ` (${source.year})` : ''}
              </li>
            ))}
          </ol>
        </div>

        <ThemeSampler />

        <TokenTables tokens={tokens} scheme={schemeFor(theme.nativeScheme, prefs.mode)} />
      </div>
    </NeoProvider>
  );
}
