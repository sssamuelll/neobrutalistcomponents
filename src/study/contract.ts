/**
 * The token contract, applied to a compiled study theme (spec D3, D6):
 * required tokens, resolvable colors, every WCAG pair in both schemes,
 * texture over every ground, and the size budget.
 */
import { COLOR_TOKENS, CONTRAST_PAIRS, REQUIRED_TOKENS } from '../lib/themes/contract';
import { composite, contrastRatio, resolveColor, resolveStops } from '../lib/themes/color';
import type { Scheme } from '../lib/themes/color';

export const THEME_CSS_BUDGET = 12 * 1024;
const SCHEMES: readonly Scheme[] = ['light', 'dark'];

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
      // Each ground keeps the text pairs CONTRAST_PAIRS demands of it.
      const grounds: [string, readonly string[]][] = [
        ...resolveStops(tokens, '--nbc-surface-fill', scheme).map((c): [string, readonly string[]] => [c, ['--nbc-fg', '--nbc-fg-muted']]),
        [resolveColor(tokens, '--nbc-surface-alt', scheme), ['--nbc-fg']],
        [page, ['--nbc-fg', '--nbc-fg-muted']],
      ];
      for (const stop of resolveStops(tokens, '--nbc-texture', scheme)) {
        for (const [ground, inks] of grounds) {
          const textured = composite(stop, composite(ground, page));
          for (const ink of inks) {
            const ratio = contrastRatio(resolveColor(tokens, ink, scheme), textured);
            if (ratio < 4.5) problems.push(`${id}/${scheme}: ${ink} on texture ${stop} over ${ground} = ${ratio.toFixed(2)} < 4.5`);
          }
        }
      }
    }
  }

  const bytes = new TextEncoder().encode(css).length;
  if (bytes > THEME_CSS_BUDGET) problems.push(`${id}: theme CSS is ${bytes} bytes, the budget is ${THEME_CSS_BUDGET}`);
  return problems;
}
