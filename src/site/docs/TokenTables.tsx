import { COLOR_TOKENS, CONTRAST_PAIRS } from '../../lib/themes/contract';
import { contrastRatio, resolveColor, resolveStops } from '../../lib/themes/color';
import type { Scheme } from '../../lib/themes/color';

/**
 * A theme's color tokens and WCAG contrast ratios in one scheme, computed with
 * the same parser and color tools the contract tests use.
 */
export function TokenTables({ tokens, scheme }: { tokens: Map<string, string>; scheme: Scheme }) {
  const page = resolveColor(tokens, '--nbc-bg', scheme);
  return (
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
  );
}
