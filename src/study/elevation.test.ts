import { describe, expect, it } from 'vitest';
import { doubleStack, flat, hardShadow } from './elevation';

describe('elevation helpers', () => {
  it('hardShadow(4) equals the neutral contract defaults in src/lib/tokens.css', () => {
    expect(hardShadow(4)).toEqual({
      kind: 'hard',
      shadow: '4px 4px 0 var(--nbc-border-color)',
      shadowLg: '8px 8px 0 var(--nbc-border-color)',
      shadowPress: '1px 1px 0 var(--nbc-border-color)',
      press: 3,
      pressActive: 4,
    });
  });

  it('hardShadow keeps the silhouette: press + press shadow = offset', () => {
    for (const offset of [2, 3, 5, 6, 8]) {
      const e = hardShadow(offset, 'fg');
      const pressShadow = Number(e.shadowPress.split('px')[0]);
      expect(e.press + pressShadow).toBe(offset);
      expect(e.shadow).toContain('var(--nbc-fg)');
    }
  });

  it('doubleStack(5, 7) reproduces the classic theme geometry', () => {
    expect(doubleStack(5, 7)).toEqual({
      kind: 'double',
      shadow: '5px 5px 0 var(--nbc-border-color), 7px 7px 0 var(--nbc-accent)',
      shadowLg: '8px 8px 0 var(--nbc-border-color), 11px 11px 0 var(--nbc-accent)',
      shadowPress: '2px 2px 0 var(--nbc-border-color), 4px 4px 0 var(--nbc-accent)',
      press: 3,
      pressActive: 5,
    });
  });

  it('flat() has no shadows and a 1px press', () => {
    expect(flat()).toEqual({ kind: 'none', shadow: 'none', shadowLg: 'none', shadowPress: 'none', press: 1, pressActive: 1 });
  });

  it('rejects impossible geometry', () => {
    expect(() => hardShadow(1)).toThrow(/offset must be an integer ≥ 2/);
    expect(() => doubleStack(5, 5)).toThrow(/outer must be an integer > inner/);
  });
});
