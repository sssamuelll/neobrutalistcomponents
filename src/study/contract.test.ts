import { describe, expect, it } from 'vitest';
import { composite } from '../lib/themes/color';
import { compileTheme } from './compile';
import { contractProblems, THEME_CSS_BUDGET } from './contract';
import { FIXTURE } from './__fixtures__/fixture';

describe('composite', () => {
  it('paints translucent over opaque, flattening onto white', () => {
    expect(composite('#00000080', '#ffffff')).toBe('#7f7f7f');
    expect(composite('#ff0000', '#00ff00')).toBe('#ff0000');
    expect(composite('#0000ff00', '#123456')).toBe('#123456');
  });
});

describe('contractProblems', () => {
  it('passes the fixture', () => {
    const { tokens, css } = compileTheme(FIXTURE);
    expect(contractProblems('fixture', tokens, css)).toEqual([]);
  });

  it('reports a missing token', () => {
    const tokens = new Map(compileTheme(FIXTURE).tokens);
    tokens.delete('--nbc-focus');
    expect(contractProblems('fixture', tokens, '')).toEqual(['fixture: missing --nbc-focus']);
  });

  it('reports a failing contrast pair with both colors and the ratio', () => {
    const { tokens, css } = compileTheme({ ...FIXTURE, colors: { ...FIXTURE.colors, fgMuted: ['#9a9a9a', '#aaaaaa'] } });
    expect(contractProblems('fixture', tokens, css).join('\n')).toMatch(
      /fixture\/light: --nbc-fg-muted #9a9a9a on --nbc-surface #ffffff = 2\.\d\d < 4\.5/,
    );
  });

  it('reports a texture that drags text below 4.5:1', () => {
    const { tokens, css } = compileTheme(FIXTURE);
    const dark = new Map(tokens);
    dark.set('--nbc-texture', 'linear-gradient(#111111cc 1px, transparent 1px) 0 0 / 8px 8px');
    expect(contractProblems('fixture', dark, css).join('\n')).toMatch(/--nbc-fg on texture #111111cc/);
  });

  it('reports a stylesheet over budget', () => {
    const { tokens } = compileTheme(FIXTURE);
    expect(contractProblems('fixture', tokens, 'x'.repeat(THEME_CSS_BUDGET + 1))).toEqual([
      `fixture: theme CSS is ${THEME_CSS_BUDGET + 1} bytes, the budget is ${THEME_CSS_BUDGET}`,
    ]);
  });
});
