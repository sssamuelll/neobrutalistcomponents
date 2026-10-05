import { COLOR_TOKENS, CONTRAST_PAIRS } from '../../lib/themes/contract';
import { contrastRatio, resolveColor, resolveStops } from '../../lib/themes/color';
import type { Scheme } from '../../lib/themes/color';
import { PAIR_TEXT, SCHEME_TEXT, useLang, useT } from '../i18n';

/**
 * A theme's color tokens and WCAG contrast ratios in one scheme, computed with
 * the same parser and color tools the contract tests use.
 */
export function TokenTables({ tokens, scheme }: { tokens: Map<string, string>; scheme: Scheme }) {
  const lang = useLang();
  const t = useT();
  const page = resolveColor(tokens, '--nbc-bg', scheme);
  const schemeName = SCHEME_TEXT[scheme][lang];
  return (
    <div className="site-band__tables">
      <div className="site-props">
        <table>
          <caption>{lang === 'es' ? `Tokens de color, esquema ${schemeName}` : `Color tokens, ${schemeName} scheme`}</caption>
          <thead>
            <tr>
              <th scope="col">{t('colToken')}</th>
              <th scope="col">{t('colSwatch')}</th>
              <th scope="col">{t('colValue')}</th>
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
          <caption>{lang === 'es' ? `Contraste, esquema ${schemeName} (WCAG 2.2)` : `Contrast, ${schemeName} scheme (WCAG 2.2)`}</caption>
          <thead>
            <tr>
              <th scope="col">{t('colPair')}</th>
              <th scope="col">{t('colRatio')}</th>
              <th scope="col">{t('colNeeds')}</th>
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
                    {pair.min === 3 ? (
                      // Non-text pair (control boundary, focus ring): drawn as a ring, not as text.
                      <span className="site-pair site-pair--ui" style={{ background: `var(${pair.bg})` }} aria-hidden="true">
                        <span style={{ borderColor: `var(${pair.fg})` }} />
                      </span>
                    ) : (
                      <span className="site-pair" style={{ color: `var(${pair.fg})`, background: `var(${pair.bg})` }}>
                        Aa
                      </span>
                    )}{' '}
                    {PAIR_TEXT[`${pair.fg} ${pair.bg}`][lang]}
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
  );
}
