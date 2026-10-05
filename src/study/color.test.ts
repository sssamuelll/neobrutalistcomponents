import { describe, expect, it } from 'vitest';
import { lightDark, normalizeHex, withAlpha } from './color';

describe('study color helpers', () => {
  it('normalizes hex to lowercase and rejects anything else', () => {
    expect(normalizeHex('#ABC')).toBe('#abc');
    expect(normalizeHex('#262626FF')).toBe('#262626ff');
    expect(() => normalizeHex('red')).toThrow('not a #hex color: red');
    expect(() => normalizeHex('#12345')).toThrow('not a #hex color: #12345');
  });

  it('collapses light-dark() when both schemes match', () => {
    expect(lightDark('#fff', '#fff')).toBe('#fff');
    expect(lightDark('#fff', '#000')).toBe('light-dark(#fff, #000)');
  });

  it('withAlpha expands short hex and replaces any alpha', () => {
    expect(withAlpha('#abc', 0.5)).toBe('#aabbcc80');
    expect(withAlpha('#112233ff', 0.07)).toBe('#11223312');
    expect(() => withAlpha('#112233', 1.5)).toThrow(/alpha must be within 0\.\.1/);
  });
});
