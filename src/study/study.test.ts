/**
 * Every study theme in src/study/themes: valid ficha, compiles, meets the
 * token contract in both schemes, ships its image within budget.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NEO_THEMES, THEME_INFO } from '../lib/themes';
import { CORE_FICHAS } from './core-fichas';
import { STUDY_THEMES, registryProblems } from './registry';
import { coreFichaProblems, themeProblems } from './validate';
import { compileTheme } from './compile';
import { contractProblems } from './contract';

const DIR = dirname(fileURLToPath(import.meta.url));
const IMAGE_BUDGET = 250_000;

describe('study registry', () => {
  it('every theme lives at themes/<scene>/<id>.ts, ids are unique, signatures exist', () => {
    expect(registryProblems()).toEqual([]);
  });
});

/** The proof themes of sub-project 1. Each proof-theme task adds its id. */
const PROOF_THEMES = ['amiga-os', 'aqua', 'bauhaus-dessau', 'carlton', 'classifieds', 'iphone-os', 'mac-os-classic', 'maeusebunker', 'material-design', 'nakagin', 'nextstep', 'sesc-pompeia', 'whaam', 'win-xp', 'win95', 'xerox-star'];

describe('proof themes', () => {
  it('are all in the registry', () => {
    expect(STUDY_THEMES.map(({ theme }) => theme.id).sort()).toEqual([...PROOF_THEMES].sort());
  });
});

for (const { theme, signature, motionCss } of STUDY_THEMES) {
  describe(`study theme "${theme.id}"`, () => {
    it('passes validation: id, bilingual text, sources, markers, image credit', () => {
      expect(themeProblems(theme)).toEqual([]);
    });

    it('compiles and meets the token contract in both schemes', () => {
      const compiled = compileTheme(theme, { signature, motionCss });
      expect(contractProblems(theme.id, compiled.tokens, compiled.css)).toEqual([]);
    });

    it.runIf(theme.reference.image !== undefined)('ships its image within budget', () => {
      const file = join(DIR, 'images', theme.reference.image!.file);
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size).toBeLessThanOrEqual(IMAGE_BUDGET);
    });
  });
}

describe('core fichas', () => {
  for (const id of NEO_THEMES) {
    const core = CORE_FICHAS[id];
    it(`${id}: valid ficha, and its English tagline is THEME_INFO's`, () => {
      expect(coreFichaProblems(id, core)).toEqual([]);
      expect(core.tagline.en).toBe(THEME_INFO[id].tagline);
    });
    it.runIf(core.reference.image !== undefined)(`${id}: ships its image within budget`, () => {
      const file = join(DIR, 'images', core.reference.image!.file);
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size).toBeLessThanOrEqual(IMAGE_BUDGET);
    });
  }
});
