import type { Scheme } from '../../lib/themes/color';
import type { ColorToken, FamilyUse, L10n } from '../types';

/** Lengths are px, angles deg. Token parameters name a color token — never a literal color. */
export type ParamSpec =
  | { readonly type: 'length' | 'number' | 'angle'; readonly default: number; readonly min: number; readonly max: number; readonly description: L10n }
  | { readonly type: 'enum'; readonly default: string; readonly values: readonly string[]; readonly description: L10n }
  | { readonly type: 'token'; readonly default: ColorToken; readonly description: L10n };

export type ParamValues = Readonly<Record<string, string | number>>;

export interface FillContext {
  /** Resolved #hex of a color token of the theme being compiled. */
  color: (token: ColorToken, scheme: Scheme) => string;
}

export interface FamilyDefinition {
  readonly name: string;
  readonly description: L10n;
  /** Component roots the family's CSS touches (listed on the Method page). */
  readonly touches: readonly string[];
  readonly params: Readonly<Record<string, ParamSpec>>;
  /** Contents of family.css. */
  readonly css: string;
  /** Layers added to --nbc-texture. Colors must be #hex with alpha, or light-dark() of those. */
  readonly texture?: (values: ParamValues, ctx: FillContext) => readonly string[];
}

type ValueOf<S extends ParamSpec> = S extends { type: 'token' }
  ? ColorToken
  : S extends { type: 'enum'; values: readonly (infer V)[] }
    ? V
    : number;
export type ParamsOf<P extends Record<string, ParamSpec>> = { readonly [K in keyof P]?: ValueOf<P[K]> };

export interface Family<P extends Record<string, ParamSpec>> {
  (params?: ParamsOf<P>): FamilyUse;
  readonly definition: FamilyDefinition;
}

/** Declares a family and returns its typed helper: `concrete({ grain: 0.06 })`. */
export function defineFamily<const P extends Record<string, ParamSpec>>(
  definition: Omit<FamilyDefinition, 'params'> & { readonly params: P },
): Family<P> {
  const use = (params: ParamsOf<P> = {}): FamilyUse => ({
    family: definition.name,
    params: { ...params } as Readonly<Record<string, string | number>>,
  });
  return Object.assign(use, { definition: definition as FamilyDefinition });
}
