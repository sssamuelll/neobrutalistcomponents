import { describe, expect, it } from 'vitest';
import { REQUIRED_TOKENS } from '../lib/themes/contract';
import { parseThemeTokens } from '../lib/themes/color';
import { compileTheme, compileTokens } from './compile';
import { FIXTURE } from './__fixtures__/fixture';
import type { StudyThemeInput } from './types';

const withColors = (patch: Partial<StudyThemeInput['colors']>): StudyThemeInput => ({
  ...FIXTURE,
  colors: { ...FIXTURE.colors, ...patch },
});

describe('compileTokens', () => {
  it('declares every required token', () => {
    const tokens = compileTokens(FIXTURE);
    expect(REQUIRED_TOKENS.filter((t) => !tokens.has(t))).toEqual([]);
  });

  it('emits light-dark() only when the schemes differ (Review Focus 2)', () => {
    const tokens = compileTokens(withColors({ bg: ['#F2F2F2', '#121212'], warning: '#E8B545' }));
    expect(tokens.get('--nbc-bg')).toBe('light-dark(#f2f2f2, #121212)');
    expect(tokens.get('--nbc-warning')).toBe('#e8b545');
    expect(compileTokens(withColors({ surface: ['#ffffff', '#ffffff'] })).get('--nbc-surface')).toBe('#ffffff');
    expect(tokens.get('--nbc-scheme')).toBe('light');
    expect(compileTokens({ ...FIXTURE, nativeScheme: 'dark' }).get('--nbc-scheme')).toBe('dark');
  });

  it('accepts 3-, 4- and 8-digit hex in any case (Review Focus 3)', () => {
    const tokens = compileTokens(withColors({ surfaceAlt: ['#EEE', '#262626ff'] }));
    expect(tokens.get('--nbc-surface-alt')).toBe('light-dark(#eee, #262626ff)');
  });

  it('rejects a color that is not #hex', () => {
    expect(() => compileTokens(withColors({ bg: 'red' as never }))).toThrow(/not a #hex color: red/);
  });

  it('resolves auto inks per scheme to the theme ink with the most contrast', () => {
    const tokens = compileTokens(FIXTURE);
    expect(tokens.get('--nbc-primary-fg')).toBe('light-dark(#f2f2f2, #111111)');
    expect(tokens.get('--nbc-warning-fg')).toBe('#111111');
  });

  it('fails when no theme ink reaches 4.5:1', () => {
    expect(() => compileTokens(withColors({ primary: '#767676' }))).toThrow(
      /fixture: --nbc-primary-fg auto \(light\): best ink #111111 reaches 4\.\d\d:1 on --nbc-primary, needs 4\.5/,
    );
  });

  it('fills default to their solid color; texture defaults to none', () => {
    const tokens = compileTokens(FIXTURE);
    expect(tokens.get('--nbc-primary-fill')).toBe('var(--nbc-primary)');
    expect(tokens.get('--nbc-danger-fill')).toBe('var(--nbc-danger)');
    expect(tokens.get('--nbc-surface-fill')).toBe('var(--nbc-surface)');
    expect(tokens.get('--nbc-texture')).toBe('none');
  });

  it('applies the engine defaults for optional groups', () => {
    const tokens = compileTokens({ ...FIXTURE, motion: undefined });
    expect(tokens.get('--nbc-label-transform')).toBe('none');
    expect(tokens.get('--nbc-label-spacing')).toBe('normal');
    expect(tokens.get('--nbc-display-spacing')).toBe('-0.02em');
    expect(tokens.get('--nbc-display-stretch')).toBe('100%');
    expect(tokens.get('--nbc-border-style')).toBe('solid');
    expect(tokens.get('--nbc-focus-width')).toBe('3px');
    expect(tokens.get('--nbc-focus-offset')).toBe('2px');
    expect(tokens.get('--nbc-duration')).toBe('120ms');
    expect(tokens.get('--nbc-ease')).toBe('cubic-bezier(0.2, 0.9, 0.3, 1)');
    expect(tokens.get('--nbc-rotate')).toBe('0deg');
    expect(tokens.get('--nbc-radius')).toBe('0px');
  });

  it('uses the system stacks for system fonts', () => {
    const serif = compileTokens({ ...FIXTURE, fonts: 'system-serif' });
    expect(serif.get('--nbc-font-sans')).toBe("'Times New Roman', Times, serif");
    expect(serif.get('--nbc-font-display')).toBe("'Times New Roman', Times, serif");
    expect(serif.get('--nbc-font-mono')).toBe("'Courier New', Courier, monospace");
    expect(compileTokens(FIXTURE).get('--nbc-font-display')).toBe("'Barlow', system-ui, -apple-system, 'Segoe UI', sans-serif");
  });
});

describe('compileTheme', () => {
  it('round-trips: parsing the CSS gives back exactly the compiled tokens', () => {
    const compiled = compileTheme(FIXTURE);
    expect(parseThemeTokens(compiled.css, 'fixture')).toEqual(compiled.tokens);
  });

  it('is deterministic', () => {
    expect(compileTheme(FIXTURE).css).toBe(compileTheme(FIXTURE).css);
  });

  it('starts with the banner and the layer statement; tokens live in nbc.theme', () => {
    const { css } = compileTheme(FIXTURE, { banner: 'neobrutalistcomponents v9 — study theme: fixture' });
    expect(css.startsWith('/* neobrutalistcomponents v9 — study theme: fixture')).toBe(true);
    expect(css).toContain('@layer nbc.tokens, nbc.theme, nbc.base, nbc.components, nbc.flourish;');
    expect(css).toMatch(/@layer nbc\.theme \{\n\[data-theme="fixture"\] \{\n {2}--nbc-scheme: light;/);
  });

  it('writes a fonts stylesheet, or a comment for system fonts', () => {
    const google = compileTheme(FIXTURE);
    expect(google.fontsHref).toBe(
      'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap',
    );
    expect(google.fontsCss).toContain(`@import url('${google.fontsHref}');`);
    const system = compileTheme({ ...FIXTURE, fonts: 'system-sans' });
    expect(system.fontsHref).toBeNull();
    expect(system.fontsCss).toMatch(/^\/\* The fixture theme uses system fonts only/);
  });
});
