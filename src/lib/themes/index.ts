export type NeoBuiltinTheme = 'classic' | 'tech' | 'swiss' | 'y2k' | 'riso';

/** A built-in theme id, or the name of your own `[data-theme="…"]` block. */
export type NeoTheme = NeoBuiltinTheme | (string & {});

export const NEO_THEMES = ['classic', 'tech', 'swiss', 'y2k', 'riso'] as const satisfies readonly NeoBuiltinTheme[];

/**
 * `light` / `dark` force a scheme; `system` follows `prefers-color-scheme`.
 * Leave `mode` unset to render the theme in its native scheme.
 */
export type NeoMode = 'light' | 'dark' | 'system';

export const NEO_MODES = ['light', 'dark', 'system'] as const satisfies readonly NeoMode[];

export interface NeoThemeInfo {
  id: NeoBuiltinTheme;
  name: string;
  tagline: string;
  /** Scheme the theme renders in when `mode` is not set. */
  nativeScheme: 'light' | 'dark';
  /** Font families the theme expects (load them yourself, or import `themes/<id>.fonts.css`). */
  fonts: readonly string[];
  /** Representative colors, light scheme first — for pickers and previews. */
  swatch: readonly string[];
}

export const THEME_INFO: Record<NeoBuiltinTheme, NeoThemeInfo> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    tagline: 'This decision is final.',
    nativeScheme: 'light',
    fonts: ['Bricolage Grotesque', 'Geist', 'Geist Mono'],
    swatch: ['#ffd23f', '#ff6b4a', '#14110f', '#f4efe6'],
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    tagline: 'Terminal sophistication.',
    nativeScheme: 'dark',
    fonts: ['Geist Mono', 'JetBrains Mono'],
    swatch: ['#3dff8c', '#ff4fd0', '#0b0e0c', '#c9f7dc'],
  },
  swiss: {
    id: 'swiss',
    name: 'Swiss',
    tagline: 'Precision, not plainness.',
    nativeScheme: 'light',
    fonts: ['Inter Tight', 'JetBrains Mono'],
    swatch: ['#9b1322', '#0a0a0a', '#fafafa', '#ffffff'],
  },
  y2k: {
    id: 'y2k',
    name: 'Y2K',
    tagline: 'Holographic trading-card energy.',
    nativeScheme: 'light',
    fonts: ['Sixtyfour', 'VT323'],
    swatch: ['#ff6ec7', '#a78bfa', '#7ee8fa', '#ffd86b'],
  },
  riso: {
    id: 'riso',
    name: 'Riso',
    tagline: 'Two inks, slightly off.',
    nativeScheme: 'light',
    fonts: ['Archivo', 'IBM Plex Mono'],
    swatch: ['#ff48b0', '#0078bf', '#ffe800', '#f6f1e7'],
  },
};
