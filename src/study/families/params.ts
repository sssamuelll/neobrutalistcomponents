import { COLOR_VARS } from '../types';
import type { ColorToken } from '../types';
import type { FamilyDefinition, ParamValues } from './types';

/** Fills defaults and validates every parameter; `where` prefixes errors (`<theme>/<family>`). */
export function resolveParams(def: FamilyDefinition, given: Readonly<Record<string, string | number>>, where: string): ParamValues {
  for (const key of Object.keys(given)) {
    if (!(key in def.params)) {
      throw new Error(`${where}: unknown parameter "${key}" (known: ${Object.keys(def.params).join(', ')})`);
    }
  }
  const values: Record<string, string | number> = {};
  for (const [key, spec] of Object.entries(def.params)) {
    const value = given[key] ?? spec.default;
    if (spec.type === 'enum') {
      if (typeof value !== 'string' || !spec.values.includes(value)) {
        throw new Error(`${where}: "${key}" must be one of ${spec.values.join(', ')}, got ${String(value)}`);
      }
    } else if (spec.type === 'token') {
      if (typeof value !== 'string' || !(value in COLOR_VARS)) {
        throw new Error(`${where}: "${key}" must be a color token name, got ${String(value)}`);
      }
    } else if (typeof value !== 'number' || !Number.isFinite(value) || value < spec.min || value > spec.max) {
      throw new Error(`${where}: "${key}" must be a number within ${spec.min}..${spec.max}, got ${String(value)}`);
    }
    values[key] = value;
  }
  return values;
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** `--fx-<family>-<param>` declarations, in parameter order. */
export function paramDeclarations(def: FamilyDefinition, values: ParamValues): [string, string][] {
  return Object.entries(def.params).map(([key, spec]) => {
    const value = values[key];
    const css =
      spec.type === 'length'
        ? `${value}px`
        : spec.type === 'angle'
          ? `${value}deg`
          : spec.type === 'token'
            ? `var(${COLOR_VARS[value as ColorToken]})`
            : String(value);
    return [`--fx-${def.name}-${kebab(key)}`, css];
  });
}
