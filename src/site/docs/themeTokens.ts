import { NEO_THEMES } from 'neobrutalistcomponents';
import type { NeoBuiltinTheme } from 'neobrutalistcomponents';
import { parseThemeTokens } from '../../lib/themes/color';

// The same token sources and parser the contract test uses — the numbers on
// the Themes page are the numbers CI enforces.
const sources = import.meta.glob<string>('../../lib/themes/*/tokens.css', { eager: true, query: '?raw', import: 'default' });

export const THEME_TOKENS = Object.fromEntries(
  NEO_THEMES.map((id) => [id, parseThemeTokens(sources[`../../lib/themes/${id}/tokens.css`], id)]),
) as Record<NeoBuiltinTheme, Map<string, string>>;
