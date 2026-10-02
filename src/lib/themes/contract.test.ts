/**
 * Token contract (spec D7): every built-in theme declares every required
 * token, colors are deterministic literals, and WCAG contrast holds in both
 * the light and the dark scheme.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NEO_THEMES, THEME_INFO } from './index';
import {
  COLOR_TOKENS,
  CONTRAST_PAIRS,
  INVARIANT_TOKENS,
  REQUIRED_TOKENS,
} from './contract';
import { contrastRatio, parseThemeTokens, resolveColor, resolveStops } from './color';

const DIR = dirname(fileURLToPath(import.meta.url));
const read = (theme: string) => readFileSync(join(DIR, theme, 'tokens.css'), 'utf8');

describe.each(NEO_THEMES)('theme "%s"', (theme) => {
  const tokens = parseThemeTokens(read(theme), theme);

  it('declares every required token', () => {
    const missing = REQUIRED_TOKENS.filter((t) => !tokens.has(t));
    expect(missing).toEqual([]);
  });

  it('does not override invariant tokens', () => {
    const overridden = INVARIANT_TOKENS.filter((t) => tokens.has(t));
    expect(overridden).toEqual([]);
  });

  it('declares its native scheme consistently with THEME_INFO', () => {
    expect(tokens.get('--nbc-scheme')).toBe(THEME_INFO[theme].nativeScheme);
  });

  it('uses only #hex or light-dark(#hex, #hex) for solid colors', () => {
    for (const name of COLOR_TOKENS) {
      for (const scheme of ['light', 'dark'] as const) {
        expect(() => resolveColor(tokens, name, scheme), `${name} (${scheme})`).not.toThrow();
      }
    }
  });

  describe.each(['light', 'dark'] as const)('%s scheme contrast', (scheme) => {
    it.each(CONTRAST_PAIRS.map((p) => [`${p.fg} on ${p.bg} ≥ ${p.min} (${p.why})`, p] as const))(
      '%s',
      (_label, pair) => {
        const page = resolveColor(tokens, '--nbc-bg', scheme);
        const fg = resolveColor(tokens, pair.fg, scheme);
        for (const bg of resolveStops(tokens, pair.bg, scheme)) {
          const ratio = contrastRatio(fg, bg, page);
          expect(
            ratio,
            `${theme}/${scheme}: ${pair.fg} ${fg} on ${pair.bg} ${bg} = ${ratio.toFixed(2)}`,
          ).toBeGreaterThanOrEqual(pair.min);
        }
      },
    );
  });
});
