import { describe, expect, it } from 'vitest';
import { NEO_THEMES, THEME_INFO } from '../lib/themes';
import { FONTS, fontLicense, fontStack, googleFontsUrl } from './fonts';
import type { FontEntry } from './fonts';

describe('font registry', () => {
  it('lists only OFL-1.1 or Apache-2.0 families, with kebab keys and weight axes', () => {
    for (const [key, font] of Object.entries(FONTS) as [string, FontEntry][]) {
      expect(['OFL-1.1', 'Apache-2.0'], key).toContain(font.license);
      expect(['sans', 'serif', 'mono'], key).toContain(font.fallback);
      expect(key).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(font.axes, key).toMatch(/^$|^wght@\d{3}(;\d{3})*$/);
    }
  });

  it('builds a font stack with the generic fallback', () => {
    expect(fontStack('dm-mono')).toBe("'DM Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace");
  });

  it('builds one deduplicated Google Fonts URL, in order', () => {
    expect(googleFontsUrl(['zen-kaku-gothic-new', 'dela-gothic-one', 'zen-kaku-gothic-new'])).toBe(
      'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Dela+Gothic+One&display=swap',
    );
  });
});

describe('fontLicense', () => {
  it('knows the licence of every family a core theme loads', () => {
    for (const id of NEO_THEMES) {
      for (const family of THEME_INFO[id].fonts) expect(fontLicense(family), `${id}: ${family}`).toBe('OFL-1.1');
    }
  });

  it('reads study families from the registry and knows nothing else', () => {
    expect(fontLicense('Dela Gothic One')).toBe('OFL-1.1');
    expect(fontLicense('Comic Sans MS')).toBeUndefined();
    expect(fontLicense('toString')).toBeUndefined();
  });
});
