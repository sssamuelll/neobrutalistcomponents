import { describe, expect, it } from 'vitest';
import { LAYER_STATEMENT } from '../lib/themes/contract';
import { parseThemeTokens } from '../lib/themes/color';
import { stripComments, topLevelBlocks } from './css';
import { compileTheme, scopePrelude } from './compile';
import { defineFamily } from './families/types';
import { lightDark, withAlpha } from './color';
import { FIXTURE } from './__fixtures__/fixture';
import type { StudyThemeInput } from './types';

const stripes = defineFamily({
  name: 'stripes',
  description: { es: 'Rayas de prueba.', en: 'Test stripes.' },
  touches: ['nbc-card'],
  params: {
    gap: { type: 'length', default: 12, min: 4, max: 64, description: { es: 'Separación.', en: 'Gap.' } },
    strength: { type: 'number', default: 0.06, min: 0, max: 0.12, description: { es: 'Intensidad.', en: 'Strength.' } },
    ink: { type: 'token', default: 'fg', description: { es: 'Tinta.', en: 'Ink.' } },
    mode: { type: 'enum', default: 'flat', values: ['flat', 'spin'], description: { es: 'Modo.', en: 'Mode.' } },
  },
  css: `.nbc-card__title::after { content: ''; block-size: 2px; background: var(--fx-stripes-ink); animation: fx-spin var(--nbc-duration) linear; }
@keyframes fx-spin { to { rotate: 1turn; } }`,
  texture: (values, ctx) => {
    const a = Number(values.strength);
    const c = lightDark(withAlpha(ctx.color('fg', 'light'), a), withAlpha(ctx.color('fg', 'dark'), a));
    return [`repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px ${values.gap}px)`];
  },
});
const REGISTRY = { stripes: stripes.definition };
const themed: StudyThemeInput = { ...FIXTURE, families: [stripes({ gap: 16 })] };
const blocks = (css: string) => topLevelBlocks(stripComments(css).replace(LAYER_STATEMENT, ''));

describe('families', () => {
  it('declares parameters as --fx-<family>-<param> on the theme root', () => {
    const { tokens } = compileTheme(themed, { families: REGISTRY });
    expect(tokens.get('--fx-stripes-gap')).toBe('16px');
    expect(tokens.get('--fx-stripes-strength')).toBe('0.06');
    expect(tokens.get('--fx-stripes-ink')).toBe('var(--nbc-fg)');
    expect(tokens.get('--fx-stripes-mode')).toBe('flat');
  });

  it('builds --nbc-texture from the families, with hex stops resolved per scheme', () => {
    const { tokens } = compileTheme(themed, { families: REGISTRY });
    expect(tokens.get('--nbc-texture')).toBe(
      'repeating-linear-gradient(0deg, light-dark(#1111110f, #f2f2f20f) 0 1px, transparent 1px 16px)',
    );
  });

  it('wraps family rules in the donut scope and namespaces keyframes outside it (Review Focus 1)', () => {
    const { css } = compileTheme(themed, { families: REGISTRY });
    const top = blocks(css);
    expect(top.map((b) => b.prelude)).toEqual(['@layer nbc.theme', '@layer nbc.flourish']);
    expect(topLevelBlocks(top[0].body).map((b) => b.prelude)).toEqual(['[data-theme="fixture"]']);
    const inner = topLevelBlocks(top[1].body);
    expect(inner.map((b) => b.prelude)).toEqual([scopePrelude('fixture'), '@keyframes nbc-fixture-stripes-fx-spin']);
    expect(scopePrelude('fixture')).toBe('@scope ([data-theme="fixture"]) to ([data-theme]:not([data-theme="fixture"]))');
    expect(inner[0].body).toContain('animation: nbc-fixture-stripes-fx-spin var(--nbc-duration) linear;');
    expect(inner[0].body).not.toMatch(/\[data-theme/);
  });

  it('keeps the token block parseable and exact', () => {
    const compiled = compileTheme(themed, { families: REGISTRY });
    expect(parseThemeTokens(compiled.css, 'fixture')).toEqual(compiled.tokens);
  });

  it.each([
    [{ gap: 2 }, /fixture\/stripes: "gap" must be a number within 4\.\.64, got 2/],
    [{ strength: 0.5 }, /"strength" must be a number within 0\.\.0\.12, got 0\.5/],
    [{ ink: 'red' }, /"ink" must be a color token name, got red/],
    [{ mode: 'wild' }, /"mode" must be one of flat, spin, got wild/],
    [{ size: 3 }, /unknown parameter "size" \(known: gap, strength, ink, mode\)/],
  ])('rejects bad parameters %o (Review Focus 4)', (params, message) => {
    expect(() => compileTheme({ ...FIXTURE, families: [{ family: 'stripes', params }] }, { families: REGISTRY })).toThrow(message);
  });

  it('rejects an unknown family', () => {
    expect(() => compileTheme({ ...FIXTURE, families: [{ family: 'nope', params: {} }] }, { families: REGISTRY })).toThrow(
      /fixture: unknown family "nope"/,
    );
  });

  it('adds the signature after the families, and lints it', () => {
    const { css } = compileTheme(themed, { families: REGISTRY, signature: '.nbc-button--primary { border-radius: 9px 3px; }' });
    expect(css).toMatch(/\/\* signature \*\/\n\s+\.nbc-button--primary \{ border-radius: 9px 3px; \}/);
    expect(css.indexOf('/* family: stripes */')).toBeLessThan(css.indexOf('/* signature */'));
    expect(() => compileTheme(FIXTURE, { signature: '.nbc-button { color: #fff; }' })).toThrow(/literal color/);
  });

  it('emits no flourish layer for a theme without families or signature', () => {
    expect(compileTheme(FIXTURE).css).not.toContain('@layer nbc.flourish');
  });
});

describe('keyframe namespacing', () => {
  const spinner = defineFamily({
    name: 'spinner',
    description: { es: 'Prueba.', en: 'Test.' },
    touches: ['nbc-card'],
    params: {},
    css: `.nbc-card__title::after { content: ''; transform: scale(1.05) rotate(2deg); animation: rotate var(--nbc-duration) linear, scale 1s; }
.nbc-card__description::after { content: ''; animation-name: scale; }
@keyframes rotate { to { rotate: 360deg; } }
@keyframes "scale" { from { scale: 1; } to { scale: 1.05; } }`,
  });

  it('renames keyframe names and animation references only — never properties or functions of the same name', () => {
    const { css } = compileTheme({ ...FIXTURE, families: [spinner()] }, { families: { spinner: spinner.definition } });
    expect(css).toContain('@keyframes nbc-fixture-spinner-rotate {');
    expect(css).toContain('@keyframes nbc-fixture-spinner-scale {');
    expect(css).toContain('rotate: 360deg;');
    expect(css).toContain('scale: 1.05;');
    expect(css).toContain('transform: scale(1.05) rotate(2deg);');
    expect(css).toContain('animation: nbc-fixture-spinner-rotate var(--nbc-duration) linear, nbc-fixture-spinner-scale 1s;');
    expect(css).toContain('animation-name: nbc-fixture-spinner-scale;');
  });
});

describe('family and parameter names are checked as own keys', () => {
  const compileWith = (families: StudyThemeInput['families']) => () =>
    compileTheme({ ...FIXTURE, families }, { families: REGISTRY });

  it('rejects a token name that only exists on Object.prototype', () => {
    expect(compileWith([{ family: 'stripes', params: { ink: 'constructor' } }])).toThrow(/"ink" must be a color token name, got constructor/);
  });

  it('rejects a parameter key that only exists on Object.prototype', () => {
    expect(compileWith([{ family: 'stripes', params: { toString: 1 } }])).toThrow(/unknown parameter "toString"/);
  });

  it('rejects a family name that only exists on Object.prototype', () => {
    expect(compileWith([{ family: 'constructor', params: {} }])).toThrow(/fixture: unknown family "constructor"/);
  });

  it('rejects a family listed twice', () => {
    expect(compileWith([stripes(), stripes({ gap: 16 })])).toThrow(/fixture: family "stripes" is listed twice/);
  });
});
