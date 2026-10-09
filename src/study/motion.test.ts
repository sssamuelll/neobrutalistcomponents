import { describe, expect, it } from 'vitest';
import { FIXTURE } from './__fixtures__/fixture';
import { compileTheme } from './compile';
import { animates, lintMotion, lintSignature } from './lint';
import { collectThemes, registryProblems } from './registry';

const GOOD = `@keyframes hourglass {
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
}
@media (prefers-reduced-motion: no-preference) {
  .nbc-progress--indeterminate .nbc-progress__bar { animation: hourglass 1s steps(4) infinite; }
  .nbc-button { transition: transform 80ms steps(2); }
}`;

describe('lintMotion', () => {
  it('accepts a guarded step animation', () => {
    expect(lintMotion(GOOD, 'm')).toEqual([]);
    expect(animates(GOOD)).toBe(true);
  });

  it('accepts animation: none outside the guard', () => {
    expect(lintMotion('.nbc-card { animation: none; }', 'm')).toEqual([]);
  });

  it.each([
    ['unguarded', '.nbc-card { animation: x 1s; }', /outside @media \(prefers-reduced-motion: no-preference\)/],
    ['guarded the wrong way round', '@media (prefers-reduced-motion: reduce) { .nbc-card { animation: x 1s; } }', /outside @media/],
    ['guarded by something else', '@media (min-width: 600px) { .nbc-card { animation-name: x; } }', /outside @media/],
    ['keyframes on width', '@keyframes x { to { width: 10px; } }', /@keyframes x animates width/],
    ['keyframes on a colour property', '@keyframes x { to { background-color: var(--nbc-fg); } }', /animates background-color/],
    ['transition on width', '@media (prefers-reduced-motion: no-preference) { .nbc-card { transition: width 1s; } }', /transition names width/],
    ['transition on all', '.nbc-card { transition-property: all; }', /transition names all/],
    ['a literal colour', '@keyframes x { to { outline: 2px solid #f00; } }', /literal color/],
  ])('rejects %s', (_name, css, message) => {
    expect(lintMotion(css, 'm').join('\n')).toMatch(message);
  });

  it('limits the file to 40 non-blank, non-comment lines', () => {
    const line = '.nbc-card { opacity: 1; }';
    expect(lintMotion(`${Array(40).fill(line).join('\n')}\n/* note */\n`, 'm')).toEqual([]);
    expect(lintMotion(Array(41).fill(line).join('\n'), 'm').join('\n')).toMatch(/41 lines, the limit is 40/);
  });

  it('a file with keyframes but no animation animates nothing', () => {
    expect(animates('@keyframes x { to { opacity: 0; } }')).toBe(false);
    expect(animates('.nbc-card { animation: none; }')).toBe(false);
  });
});

describe('compileTheme with motion CSS', () => {
  it('hoists and namespaces the keyframes and keeps the guarded rule scoped to the theme', () => {
    const { css } = compileTheme(FIXTURE, { motionCss: GOOD });
    expect(css).toContain('@keyframes nbc-fixture-motion-hourglass');
    expect(css).toMatch(/animation: nbc-fixture-motion-hourglass 1s steps\(4\) infinite/);
    expect(css).toMatch(/@scope \(\[data-theme="fixture"\]\)[\s\S]*prefers-reduced-motion: no-preference/);
  });

  it('refuses motion CSS that breaks the lint', () => {
    expect(() => compileTheme(FIXTURE, { motionCss: '.nbc-card { animation: x 1s; }' })).toThrow(/outside @media/);
  });
});

describe('registryProblems for motion files', () => {
  const motionTheme = { ...FIXTURE, motionFile: './fixture.motion.css' };
  const entry = (motionCss?: string) => [{ path: './themes/germany/fixture.ts', theme: motionTheme, motionCss }];

  it('reports a declared file that is missing, and one that animates nothing', () => {
    expect(registryProblems(entry(undefined)).join('\n')).toMatch(/fixture: motion file \.\/fixture\.motion\.css not found/);
    expect(registryProblems(entry('@keyframes x { to { opacity: 0; } }')).join('\n')).toMatch(/fixture: \.\/fixture\.motion\.css animates nothing/);
    expect(registryProblems(entry(GOOD))).toEqual([]);
  });

  it('counts a declared motion file as declared, and reports an undeclared stylesheet', () => {
    const modules = { './themes/germany/fixture.ts': { default: motionTheme } };
    const styles = { './themes/germany/fixture.motion.css': GOOD, './themes/germany/orphan.css': GOOD };
    const { themes, problems } = collectThemes(modules, styles);
    expect(themes[0].motionCss).toBe(GOOD);
    expect(problems.join('\n')).toMatch(/orphan\.css: no theme declares this file/);
    expect(problems.join('\n')).not.toMatch(/fixture\.motion\.css/);
  });
});

describe('lintMotion closes the final review findings', () => {
  const GUARD = (body: string) => `@media (prefers-reduced-motion: no-preference) {\n${body}\n}`;

  it('rejects @keyframes below the top level: the compiler only namespaces top-level ones', () => {
    const css = GUARD('@keyframes blink { to { opacity: 0; } }\n.nbc-card { animation: blink 1s; }');
    expect(lintMotion(css, 'm').join('\n')).toMatch(/@keyframes blink must be at the top level/);
  });

  it('a transition needs the guard too, and counts as motion', () => {
    expect(lintMotion('.nbc-button { transition: transform 300ms; }', 'm').join('\n')).toMatch(/sets transition outside @media/);
    const guarded = GUARD('.nbc-button { transition: transform 300ms; }');
    expect(lintMotion(guarded, 'm')).toEqual([]);
    expect(animates(guarded)).toBe(true);
    expect(lintMotion('.nbc-button { transition: none; }', 'm')).toEqual([]);
  });

  it('reads steps() and cubic-bezier() in a transition as one value each', () => {
    const css = GUARD('.nbc-button { transition: transform 80ms steps(2, end), opacity 1s cubic-bezier(.2, .8, .2, 1); }');
    expect(lintMotion(css, 'm')).toEqual([]);
  });

  it('sees the -webkit- prefixed spellings', () => {
    expect(lintMotion('.nbc-card { -webkit-animation: x 1s; }', 'm').join('\n')).toMatch(/outside @media/);
    expect(lintMotion('.nbc-card { -webkit-transition: width 1s; }', 'm').join('\n')).toMatch(/outside @media|transition names width/);
  });
});

describe("signatures carry no motion", () => {
  it('lintSignature rejects animation and @keyframes: they belong in the motion file', () => {
    expect(lintSignature('.nbc-card { animation: x 1s; }', 's').join('\n')).toMatch(/motion belongs in the motion file/);
    expect(lintSignature('@keyframes x { to { opacity: 0; } }', 's').join('\n')).toMatch(/motion belongs in the motion file/);
    expect(lintSignature('.nbc-card { color: var(--nbc-fg); }', 's')).toEqual([]);
  });
});

describe('only loading indicators loop forever (WCAG 2.2.2)', () => {
  const guard = (body: string) => `@media (prefers-reduced-motion: no-preference) {\n${body}\n}`;

  it('rejects an infinite animation on anything else', () => {
    expect(lintMotion(guard('.nbc-button--primary { animation: pulse 1s infinite; }'), 'm').join('\n')).toMatch(/loops forever/);
    expect(lintMotion(guard('.nbc-button--primary { animation-iteration-count: infinite; }'), 'm').join('\n')).toMatch(/loops forever/);
  });

  it('accepts a counted animation, and a loader that loops', () => {
    expect(lintMotion(guard('.nbc-button--primary { animation: pulse 1s 4; }'), 'm')).toEqual([]);
    expect(lintMotion(GOOD, 'm')).toEqual([]);
  });
});
