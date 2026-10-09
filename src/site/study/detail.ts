/**
 * The full data of one theme for its page, loaded on demand. A study theme's
 * data file is its own lazy chunk, and its tokens are compiled from that same
 * data, so its stylesheet is downloaded once, by the <link> that paints the
 * page. A core theme's ficha comes from core-fichas.ts and its tokens from the
 * core stylesheet.
 */
import type { NeoBuiltinTheme } from '../../lib/themes';
import type { CatalogEntry } from '../../study/catalog';
import { compileTokens } from '../../study/compile';
import type { Ficha, Reference, StudyThemeInput } from '../../study/types';
import { THEME_TOKENS } from '../docs/themeTokens';
import { useLazy } from './lazy';
import type { Lazy } from './lazy';

const themeModules = import.meta.glob<StudyThemeInput>('../../study/themes/*/*.ts', { import: 'default' });
const images = import.meta.glob<string>('../../study/images/*.avif', { eager: true, query: '?url', import: 'default' });

export interface ThemeDetail {
  readonly reference: Reference;
  readonly ficha: Ficha;
  /**
   * The theme block's tokens: for a study theme, compiled by the same function
   * that writes its stylesheet; for a core theme, parsed from its stylesheet
   * exactly like the contract tests parse it.
   */
  readonly tokens: Map<string, string>;
}

export async function loadDetail(entry: CatalogEntry): Promise<ThemeDetail> {
  if (entry.predatesStudy) {
    const { CORE_FICHAS } = await import('../../study/core-fichas');
    const core = CORE_FICHAS[entry.id as NeoBuiltinTheme];
    return { reference: core.reference, ficha: core.ficha, tokens: THEME_TOKENS[entry.id as NeoBuiltinTheme] };
  }
  const theme = await themeModules[`../../study/themes/${entry.scene}/${entry.id}.ts`]();
  return { reference: theme.reference, ficha: theme.ficha, tokens: compileTokens(theme) };
}

export const useThemeDetail = (entry: CatalogEntry): Lazy<ThemeDetail> => useLazy(entry.id, () => loadDetail(entry));

export const imageUrl = (file: string): string | undefined => images[`../../study/images/${file}`];
