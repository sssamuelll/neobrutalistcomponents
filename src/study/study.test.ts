/**
 * Every study theme in src/study/themes: valid ficha, compiles, meets the
 * token contract in both schemes, ships its image within budget.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STUDY_THEMES, registryProblems } from './registry';
import { themeProblems } from './validate';
import { compileTheme } from './compile';
import { contractProblems } from './contract';

const DIR = dirname(fileURLToPath(import.meta.url));
const IMAGE_BUDGET = 250_000;

describe('study registry', () => {
  it('every theme lives at themes/<scene>/<id>.ts, ids are unique, signatures exist', () => {
    expect(registryProblems()).toEqual([]);
  });
});

for (const { theme, signature } of STUDY_THEMES) {
  describe(`study theme "${theme.id}"`, () => {
    it('passes validation: id, bilingual text, sources, markers, image credit', () => {
      expect(themeProblems(theme)).toEqual([]);
    });

    it('compiles and meets the token contract in both schemes', () => {
      const compiled = compileTheme(theme, { signature });
      expect(contractProblems(theme.id, compiled.tokens, compiled.css)).toEqual([]);
    });

    it.runIf(theme.reference.image !== undefined)('ships its image within budget', () => {
      const file = join(DIR, 'images', theme.reference.image!.file);
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size).toBeLessThanOrEqual(IMAGE_BUDGET);
    });
  });
}
