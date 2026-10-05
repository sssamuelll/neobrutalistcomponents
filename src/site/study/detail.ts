/**
 * The full data of one theme for its page, loaded on demand: a study theme's
 * data file and generated stylesheet are separate chunks; a core theme's ficha
 * comes from core-fichas.ts and its tokens from the core stylesheet.
 */
import { parseThemeTokens } from '../../lib/themes/color';
import type { NeoBuiltinTheme } from '../../lib/themes';
import type { CatalogEntry } from '../../study/catalog';
import type { Ficha, Reference, StudyThemeInput } from '../../study/types';
import { THEME_TOKENS } from '../docs/themeTokens';
import { useLazy } from './lazy';
import type { Lazy } from './lazy';

const themeModules = import.meta.glob<StudyThemeInput>('../../study/themes/*/*.ts', { import: 'default' });
const themeStyles = import.meta.glob<string>(
  ['../../study/.generated/themes/*.css', '!../../study/.generated/themes/*.fonts.css'],
  { query: '?raw', import: 'default' },
);
const images = import.meta.glob<string>('../../study/images/*.avif', { eager: true, query: '?url', import: 'default' });

export interface ThemeDetail {
  readonly reference: Reference;
  readonly ficha: Ficha;
  /** The theme block's tokens, parsed exactly like the contract tests parse them. */
  readonly tokens: Map<string, string>;
}

/** A theme's reference and ficha: its own lazy chunk for a study theme, core-fichas.ts for a core one. */
export async function loadThemeData(entry: CatalogEntry): Promise<Pick<ThemeDetail, 'reference' | 'ficha'>> {
  if (entry.predatesStudy) {
    const { CORE_FICHAS } = await import('../../study/core-fichas');
    const core = CORE_FICHAS[entry.id as NeoBuiltinTheme];
    return { reference: core.reference, ficha: core.ficha };
  }
  const theme = await themeModules[`../../study/themes/${entry.scene}/${entry.id}.ts`]();
  return { reference: theme.reference, ficha: theme.ficha };
}

export async function loadDetail(entry: CatalogEntry): Promise<ThemeDetail> {
  const tokens = entry.predatesStudy
    ? Promise.resolve(THEME_TOKENS[entry.id as NeoBuiltinTheme])
    : themeStyles[`../../study/.generated/themes/${entry.id}.css`]().then((css) => parseThemeTokens(css, entry.id));
  const [data, parsed] = await Promise.all([loadThemeData(entry), tokens]);
  return { ...data, tokens: parsed };
}

export const useThemeDetail = (entry: CatalogEntry): Lazy<ThemeDetail> => useLazy(entry.id, () => loadDetail(entry));

export const imageUrl = (file: string): string | undefined => images[`../../study/images/${file}`];
