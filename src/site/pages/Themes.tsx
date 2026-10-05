import { NEO_THEMES, NeoProvider, THEME_INFO } from 'neobrutalistcomponents';
import type { NeoBuiltinTheme, NeoMode } from 'neobrutalistcomponents';
import type { Scheme } from '../../lib/themes/color';
import { THEME_GUIDE } from '../../docs/guide';
import { THEME_TOKENS } from '../docs/themeTokens';
import { ThemeSampler } from '../docs/ThemeSampler';
import { TokenTables } from '../docs/TokenTables';
import { StudyBand } from '../docs/StudyBand';
import { STUDY_PREVIEWS } from '../docs/studyThemes';
import { useSitePrefsContext } from '../prefsContext';

function schemeFor(theme: NeoBuiltinTheme, mode: NeoMode | 'native'): Scheme {
  if (mode === 'light' || mode === 'dark') return mode;
  if (mode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return THEME_INFO[theme].nativeScheme;
}

function ThemeBand({ id }: { id: NeoBuiltinTheme }) {
  const { prefs, update } = useSitePrefsContext();
  const info = THEME_INFO[id];
  const tokens = THEME_TOKENS[id];
  const scheme = schemeFor(id, prefs.mode);

  return (
    <NeoProvider
      as="section"
      theme={id}
      mode={prefs.mode === 'native' ? undefined : prefs.mode}
      className="site-band"
      aria-labelledby={`theme-${id}`}
    >
      <div className="site-band__inner">
        <header className="site-band__head">
          <h2 className="site-band__title" id={`theme-${id}`}>
            {info.name}
          </h2>
          <p className="site-band__tagline">{info.tagline}</p>
          <dl className="site-band__facts">
            <div>
              <dt>Best for</dt>
              <dd>{THEME_GUIDE[id].bestFor}</dd>
            </div>
            <div>
              <dt>Fonts</dt>
              <dd>{info.fonts.join(', ')}</dd>
            </div>
            <div>
              <dt>Native scheme</dt>
              <dd>{info.nativeScheme}</dd>
            </div>
          </dl>
          {prefs.theme !== id && (
            <button type="button" className="site-band__use" onClick={() => update({ theme: id })}>
              Use {info.name} for the whole site
            </button>
          )}
        </header>

        <ThemeSampler />

        <TokenTables tokens={tokens} scheme={scheme} />
      </div>
    </NeoProvider>
  );
}

export function Themes() {
  return (
    <div className="site-themes">
      <header className="site-page site-page__head">
        <h1 className="site-h1">Themes</h1>
        <p className="site-lead">
          Five themes on one contract. Each band below is its own provider island, rendered in the scheme you picked
          above. Every ratio is computed from the same token sources the test suite checks.
        </p>
      </header>
      {NEO_THEMES.map((id) => (
        <ThemeBand key={id} id={id} />
      ))}
      <section className="site-page site-study-intro" aria-labelledby="study-preview-title">
        <h2 className="site-h2" id="study-preview-title">
          From the study: four proof themes
        </h2>
        <p className="site-p">
          A study of neobrutalism in interfaces is on its way, across four scenes: Japan, Germany, the United States and
          Latin America. Each theme reads one documented work and cites its sources. These first four, one per scene,
          ship in the next release.
        </p>
      </section>
      {STUDY_PREVIEWS.map((preview) => (
        <StudyBand key={preview.theme.id} preview={preview} />
      ))}
    </div>
  );
}
