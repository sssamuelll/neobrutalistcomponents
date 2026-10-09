import { describe, expect, it } from 'vitest';
import { animates, lintMotion } from './lint';

const GOOD = `@keyframes hourglass {
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
}
@media (prefers-reduced-motion: no-preference) {
  .nbc-progress__bar { animation: hourglass 1s steps(4) infinite; }
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
