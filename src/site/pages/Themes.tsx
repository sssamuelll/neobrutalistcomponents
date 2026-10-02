import { NEO_THEMES, NeoProvider, THEME_INFO } from 'neobrutalistcomponents';
import type { NeoBuiltinTheme, NeoMode } from 'neobrutalistcomponents';
import { COLOR_TOKENS, CONTRAST_PAIRS } from '../../lib/themes/contract';
import { contrastRatio, resolveColor, resolveStops } from '../../lib/themes/color';
import type { Scheme } from '../../lib/themes/color';
import { THEME_GUIDE } from '../../docs/guide';
import { THEME_TOKENS } from '../docs/themeTokens';
import { ThemeSampler } from '../docs/ThemeSampler';
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
  const page = resolveColor(tokens, '--nbc-bg', scheme);

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

        <div className="site-band__tables">
          <div className="site-props">
            <table>
              <caption>
                Color tokens, {scheme} scheme
              </caption>
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">Swatch</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {COLOR_TOKENS.map((t) => (
                  <tr key={t}>
                    <th scope="row">
                      <code>{t}</code>
                    </th>
                    <td>
                      <span className="site-swatch-cell" style={{ background: `var(${t})` }} />
                    </td>
                    <td>
                      <code>{resolveColor(tokens, t, scheme)}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="site-props">
            <table>
              <caption>Contrast, {scheme} scheme (WCAG 2.2)</caption>
              <thead>
                <tr>
                  <th scope="col">Pair</th>
                  <th scope="col">Ratio</th>
                  <th scope="col">Needs</th>
                </tr>
              </thead>
              <tbody>
                {CONTRAST_PAIRS.map((pair) => {
                  const fg = resolveColor(tokens, pair.fg, scheme);
                  const ratio = Math.min(
                    ...resolveStops(tokens, pair.bg, scheme).map((bg) => contrastRatio(fg, bg, page)),
                  );
                  return (
                    <tr key={`${pair.fg}-${pair.bg}`}>
                      <th scope="row">
                        <span className="site-pair" style={{ color: `var(${pair.fg})`, background: `var(${pair.bg})` }}>
                          Aa
                        </span>{' '}
                        {pair.why}
                      </th>
                      <td className="site-num">{ratio.toFixed(2)}</td>
                      <td className="site-num">{pair.min}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
    </div>
  );
}
