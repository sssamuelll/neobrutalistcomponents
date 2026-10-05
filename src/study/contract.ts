/**
 * The token contract, applied to a compiled study theme (spec D3, D6):
 * required tokens, resolvable colors, every WCAG pair in both schemes,
 * texture over every ground, and the size budget.
 */
import { COLOR_TOKENS, CONTRAST_PAIRS, REQUIRED_TOKENS } from '../lib/themes/contract';
import { composite, contrastRatio, parseThemeTokens, resolveColor, resolveStops } from '../lib/themes/color';
import type { Scheme } from '../lib/themes/color';

export const THEME_CSS_BUDGET = 12 * 1024;
const SCHEMES: readonly Scheme[] = ['light', 'dark'];
/** Grounds --nbc-texture is painted over: card, dialog and table slabs, footers, the page. */
const TEXTURED_GROUNDS = ['--nbc-surface-fill', '--nbc-surface', '--nbc-surface-alt', '--nbc-bg'];

export function contractProblems(id: string, compiledTokens: ReadonlyMap<string, string>, css: string): string[] {
  const tokens = compiledTokens as Map<string, string>;
  const missing = REQUIRED_TOKENS.filter((t) => !tokens.has(t)).map((t) => `${id}: missing ${t}`);
  if (missing.length) return missing;

  const problems: string[] = [];
  for (const scheme of SCHEMES) {
    for (const name of COLOR_TOKENS) {
      try {
        resolveColor(tokens, name, scheme);
      } catch (error) {
        problems.push(`${id}/${scheme}: ${name}: ${(error as Error).message}`);
      }
    }
  }
  if (problems.length) return problems;

  for (const scheme of SCHEMES) {
    const page = resolveColor(tokens, '--nbc-bg', scheme);
    for (const pair of CONTRAST_PAIRS) {
      const fg = resolveColor(tokens, pair.fg, scheme);
      for (const bg of resolveStops(tokens, pair.bg, scheme)) {
        const ratio = contrastRatio(fg, bg, page);
        if (ratio < pair.min) {
          problems.push(`${id}/${scheme}: ${pair.fg} ${fg} on ${pair.bg} ${bg} = ${ratio.toFixed(2)} < ${pair.min} (${pair.why})`);
        }
      }
    }
    if (tokens.get('--nbc-texture') !== 'none') {
      // Every pair the contract demands on a ground the texture is painted over.
      for (const stop of resolveStops(tokens, '--nbc-texture', scheme)) {
        for (const pair of CONTRAST_PAIRS.filter((p) => TEXTURED_GROUNDS.includes(p.bg))) {
          const fg = resolveColor(tokens, pair.fg, scheme);
          for (const ground of resolveStops(tokens, pair.bg, scheme)) {
            const ratio = contrastRatio(fg, composite(stop, composite(ground, page)));
            if (ratio < pair.min) {
              problems.push(
                `${id}/${scheme}: ${pair.fg} on texture ${stop} over ${pair.bg} ${ground} = ${ratio.toFixed(2)} < ${pair.min} (${pair.why})`,
              );
            }
          }
        }
      }
    }
  }

  const parsed = parseThemeTokens(css, id);
  if (parsed.size !== tokens.size || [...tokens].some(([name, value]) => parsed.get(name) !== value)) {
    problems.push(`${id}: theme CSS does not parse back to its tokens — a value broke the stylesheet`);
  }

  const bytes = new TextEncoder().encode(css).length;
  if (bytes > THEME_CSS_BUDGET) problems.push(`${id}: theme CSS is ${bytes} bytes, the budget is ${THEME_CSS_BUDGET}`);
  return problems;
}
