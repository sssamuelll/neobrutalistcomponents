import { describe, expect, it } from 'vitest';
import { FIXTURE } from './__fixtures__/fixture';
import { compileTokens } from './compile';
import { LETTERING_PENDING, themeProblems } from './validate';
import type { Ficha, StudyThemeInput } from './types';

const problems = (patch: Partial<StudyThemeInput>) => themeProblems({ ...FIXTURE, ...patch }).join('\n');
const withLettering = (patch: Partial<NonNullable<Ficha['lettering']>>): Partial<StudyThemeInput> => ({
  ficha: { ...FIXTURE.ficha, lettering: { ...FIXTURE.ficha.lettering!, ...patch } },
});
const withoutLettering = (id: string): StudyThemeInput => {
  return { ...FIXTURE, id, ficha: { ...FIXTURE.ficha, lettering: undefined } };
};

describe('lettering in the ficha', () => {
  it('the fixture, with lettering, is valid', () => {
    expect(themeProblems(FIXTURE)).toEqual([]);
  });

  it('a theme without lettering fails, unless its id is pending', () => {
    expect(themeProblems(withoutLettering('fixture')).join('\n')).toMatch(/fixture\.ficha\.lettering: missing/);
    expect(LETTERING_PENDING).toContain('win95');
    expect(themeProblems(withoutLettering('win95'))).toEqual([]);
  });

  it('a pending theme that already has lettering must leave the list', () => {
    expect(themeProblems({ ...FIXTURE, id: 'win95' }).join('\n')).toMatch(/win95: has lettering — remove it from LETTERING_PENDING/);
  });

  it.each([
    [{ documented: { es: '', en: 'Set in a grotesque [1].' } }, /lettering\.documented\.es: empty/],
    [{ substitute: { es: 'Barlow.', en: '' } }, /lettering\.substitute\.en: empty/],
    [{ original: { name: '', kind: 'outline' as const } }, /original\.name: empty/],
    [{ original: { name: 'X', kind: 'cursive' as never } }, /original\.kind: unknown "cursive"/],
    [{ original: { name: 'X', kind: 'bitmap' as const, year: 1066.5 } }, /original\.year: 1066\.5 is not a year/],
  ])('rejects %o', (patch, message) => {
    expect(problems(withLettering(patch))).toMatch(message);
  });

  it('the markers in lettering text must resolve into the sources', () => {
    expect(problems(withLettering({ documented: { es: 'Rotulada [3].', en: 'Set [3].' } }))).toMatch(/marker \[3\] has no source/);
  });

  it('a source cited only by lettering or motion text counts as cited', () => {
    const ficha: Ficha = {
      ...FIXTURE.ficha,
      documented: { es: 'Un hecho [1].', en: 'A fact [1].' },
      lettering: { ...FIXTURE.ficha.lettering!, documented: { es: 'Rotulada [2].', en: 'Set [2].' } },
    };
    expect(themeProblems({ ...FIXTURE, ficha })).toEqual([]);
    const uncited: Ficha = { ...ficha, lettering: { ...ficha.lettering!, documented: { es: 'Rotulada.', en: 'Set.' } } };
    expect(problems({ ficha: uncited })).toMatch(/source \[2\] is never cited/);
  });

  it('the substitute must name the face the theme loads (sans and display)', () => {
    expect(problems(withLettering({ substitute: { es: 'Una fuente libre.', en: 'A free font.' } }))).toMatch(
      /substitute\.es: does not name Barlow/,
    );
    expect(problems({ fonts: { sans: 'barlow', display: 'dela-gothic-one' } })).toMatch(/does not name Dela Gothic One/);
  });

  it('system-font themes have no face to name', () => {
    expect(themeProblems({ ...FIXTURE, fonts: 'system-sans' })).toEqual([]);
  });

  it('the substitute cannot be the original face, unless the original is free', () => {
    const same = withLettering({ original: { name: 'barlow', kind: 'outline' } });
    expect(problems(same)).toMatch(/the substitute is the original face "barlow"/);
    expect(problems(withLettering({ original: { name: 'Barlow', kind: 'outline', free: true } }))).toBe('');
  });
});

describe('motion in the ficha', () => {
  const motion = { documented: { es: 'Se mueve [1].', en: 'It moves [1].' }, reading: { es: 'Lo imita.', en: 'It imitates that.' } };

  it('ficha.motion and motionFile go together', () => {
    expect(problems({ ficha: { ...FIXTURE.ficha, motion } })).toMatch(/ficha\.motion has no motionFile/);
    expect(problems({ motionFile: './fixture.motion.css' })).toMatch(/motionFile has no ficha\.motion/);
    expect(themeProblems({ ...FIXTURE, ficha: { ...FIXTURE.ficha, motion }, motionFile: './fixture.motion.css' })).toEqual([]);
  });

  it('motion text is checked like the rest of the ficha', () => {
    const ficha = { ...FIXTURE.ficha, motion: { ...motion, reading: { es: '', en: 'x' } } };
    expect(problems({ ficha, motionFile: './fixture.motion.css' })).toMatch(/motion\.reading\.es: empty/);
  });
});

describe('typography fields', () => {
  const type = (patch: Partial<StudyThemeInput['type']>) => ({ type: { ...FIXTURE.type, ...patch } });

  it('compile to tokens, with defaults equal to today', () => {
    const base = compileTokens(FIXTURE);
    expect(base.get('--nbc-font-features')).toBe('normal');
    expect(base.get('--nbc-font-kerning')).toBe('auto');
    expect(base.get('--nbc-text-rendering')).toBe('optimizeLegibility');
    const set = compileTokens({ ...FIXTURE, ...type({ featureSettings: '"tnum", "ss01" 1', kerning: 'none', textRendering: 'optimizeSpeed' }) });
    expect(set.get('--nbc-font-features')).toBe('"tnum", "ss01" 1');
    expect(set.get('--nbc-font-kerning')).toBe('none');
    expect(set.get('--nbc-text-rendering')).toBe('optimizeSpeed');
  });

  it.each([
    [{ featureSettings: 'tnum' }, /type\.featureSettings/],
    [{ featureSettings: '"tnum"; color: red' }, /type\.featureSettings/],
    [{ kerning: 'tight' as never }, /type\.kerning/],
    [{ textRendering: 'fast' as never }, /type\.textRendering/],
  ])('rejects %o', (patch, message) => {
    expect(problems(type(patch))).toMatch(message);
  });

  it('accepts normal, tags and tags with values', () => {
    expect(themeProblems({ ...FIXTURE, ...type({ featureSettings: 'normal' }) })).toEqual([]);
    expect(themeProblems({ ...FIXTURE, ...type({ featureSettings: '"smcp", "tnum" 1' }) })).toEqual([]);
  });
});
