import { describe, expect, it } from 'vitest';
import { resolveStops } from '../lib/themes/color';
import { compileTheme } from './compile';
import { lintFlourishCss } from './lint';
import { FAMILIES, concrete, grid } from './families';
import { FIXTURE } from './__fixtures__/fixture';
import { LANGS } from './types';

describe('built-in families', () => {
  it('registers concrete and grid under their own names', () => {
    expect(Object.keys(FAMILIES).sort()).toEqual(['concrete', 'grid']);
    for (const [name, def] of Object.entries(FAMILIES)) expect(def.name).toBe(name);
  });

  it('ships lint-clean CSS and bilingual documentation', () => {
    for (const def of Object.values(FAMILIES)) {
      expect(lintFlourishCss(def.css, def.name)).toEqual([]);
      for (const lang of LANGS) {
        expect(def.description[lang].trim(), `${def.name} description.${lang}`).not.toBe('');
        for (const [key, spec] of Object.entries(def.params)) expect(spec.description[lang].trim(), `${def.name}.${key}`).not.toBe('');
      }
    }
  });

  it('texture stops are resolvable, translucent hex in both schemes', () => {
    for (const use of [concrete(), grid(), concrete({ formwork: 0 }), concrete({ grain: 0 }), grid({ line: 'accent' })]) {
      const { tokens } = compileTheme({ ...FIXTURE, families: [use] });
      for (const scheme of ['light', 'dark'] as const) {
        const stops = resolveStops(tokens as Map<string, string>, '--nbc-texture', scheme);
        expect(stops.length).toBeGreaterThan(0);
        for (const stop of stops) expect(stop).toMatch(/^#[0-9a-f]{8}$/);
      }
    }
  });

  it('concrete with both strengths at 0 adds no texture', () => {
    expect(compileTheme({ ...FIXTURE, families: [concrete({ grain: 0, formwork: 0 })] }).tokens.get('--nbc-texture')).toBe('none');
  });

  it('grid draws both axes at the cell size; concrete marks boards at the board width', () => {
    const g = compileTheme({ ...FIXTURE, families: [grid({ cell: 32 })] }).tokens.get('--nbc-texture')!;
    expect(g.match(/0 0 \/ 32px 32px/g)).toHaveLength(2);
    const c = compileTheme({ ...FIXTURE, families: [concrete({ board: 22 })] }).tokens.get('--nbc-texture')!;
    expect(c).toContain('transparent 1px 22px)');
  });

  it('layers from several families join in the order the theme lists them', () => {
    const { tokens } = compileTheme({ ...FIXTURE, families: [grid(), concrete({ grain: 0 })] });
    const texture = tokens.get('--nbc-texture')!;
    expect(texture.indexOf('linear-gradient(to right')).toBeLessThan(texture.indexOf('repeating-linear-gradient'));
  });
});
