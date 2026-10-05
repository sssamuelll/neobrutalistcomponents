import { COLOR_VARS } from './types';
import type { ColorToken, StudyElevation } from './types';

const ref = (token: ColorToken) => `var(${COLOR_VARS[token]})`;

/** No shadows — the flat, accidental-web register. Controls still sink 1px. */
export function flat(): StudyElevation {
  return { kind: 'none', shadow: 'none', shadowLg: 'none', shadowPress: 'none', press: 1, pressActive: 1 };
}

/**
 * One hard offset shadow. `hardShadow(4)` equals the neutral contract defaults.
 * Pressing moves the control by `press` and shrinks the shadow by the same
 * amount, so the outer silhouette never moves.
 */
export function hardShadow(offset = 4, color: ColorToken = 'border'): StudyElevation {
  if (!Number.isInteger(offset) || offset < 2) throw new Error(`hardShadow: offset must be an integer ≥ 2, got ${offset}`);
  const pressShadow = Math.max(1, Math.round(offset / 4));
  const layer = (n: number) => `${n}px ${n}px 0 ${ref(color)}`;
  return {
    kind: 'hard',
    shadow: layer(offset),
    shadowLg: layer(offset * 2),
    shadowPress: layer(pressShadow),
    press: offset - pressShadow,
    pressActive: offset,
  };
}

/** Two stacked hard shadows — an ink core and a colored edge, like the classic theme. */
export function doubleStack(
  inner = 5,
  outer = 7,
  outerColor: ColorToken = 'accent',
  innerColor: ColorToken = 'border',
): StudyElevation {
  if (!Number.isInteger(inner) || inner < 2) throw new Error(`doubleStack: inner must be an integer ≥ 2, got ${inner}`);
  if (!Number.isInteger(outer) || outer <= inner) throw new Error(`doubleStack: outer must be an integer > inner, got ${outer}`);
  const press = Math.min(3, inner - 1);
  const layers = (a: number, b: number) => `${a}px ${a}px 0 ${ref(innerColor)}, ${b}px ${b}px 0 ${ref(outerColor)}`;
  return {
    kind: 'double',
    shadow: layers(inner, outer),
    shadowLg: layers(Math.round(inner * 1.6), Math.round(outer * 1.6)),
    shadowPress: layers(inner - press, outer - press),
    press,
    pressActive: inner,
  };
}
