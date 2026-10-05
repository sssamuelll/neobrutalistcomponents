/**
 * Font registry for study themes. Themes name fonts by key, so a typo fails
 * type checking and compilation. Google Fonts families under OFL-1.1 or
 * Apache-2.0 only. Add a family here before a theme uses it, and check that
 * `https://fonts.googleapis.com/css2?family=<Name>:<axes>&display=swap`
 * answers 200.
 */
export interface FontEntry {
  /** CSS family name, exactly as Google Fonts serves it. */
  readonly family: string;
  /** css2 axis spec after the colon ('wght@400;700'); empty for single-style families. */
  readonly axes: string;
  readonly fallback: 'sans' | 'serif' | 'mono';
  readonly license: 'OFL-1.1' | 'Apache-2.0';
  readonly scripts: readonly ('latin' | 'latin-ext' | 'japanese')[];
}

export const FONTS = {
  barlow: { family: 'Barlow', axes: 'wght@400;500;600;700', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  'barlow-condensed': { family: 'Barlow Condensed', axes: 'wght@600;700;800', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  chivo: { family: 'Chivo', axes: 'wght@400;500;700;900', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  'chivo-mono': { family: 'Chivo Mono', axes: 'wght@400;500;700', fallback: 'mono', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  'dela-gothic-one': { family: 'Dela Gothic One', axes: '', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'japanese'] },
  'dm-mono': { family: 'DM Mono', axes: 'wght@400;500', fallback: 'mono', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  'm-plus-1-code': { family: 'M PLUS 1 Code', axes: 'wght@400;500;700', fallback: 'mono', license: 'OFL-1.1', scripts: ['latin', 'japanese'] },
  'zen-kaku-gothic-new': { family: 'Zen Kaku Gothic New', axes: 'wght@400;500;700;900', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'japanese'] },
} as const satisfies Record<string, FontEntry>;

export type FontKey = keyof typeof FONTS;

export const FALLBACKS = {
  sans: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  serif: "'Times New Roman', Times, serif",
  mono: "ui-monospace, 'SFMono-Regular', Menlo, monospace",
} as const;

/** Font tokens for themes that load nothing. */
export const SYSTEM_STACKS = {
  'system-sans': { sans: FALLBACKS.sans, mono: FALLBACKS.mono },
  'system-serif': { sans: FALLBACKS.serif, mono: "'Courier New', Courier, monospace" },
} as const;

/** CSS font-family value: the family, then its generic fallback stack. */
export function fontStack(key: FontKey): string {
  const font: FontEntry = FONTS[key];
  return `'${font.family}', ${FALLBACKS[font.fallback]}`;
}

/** Google Fonts css2 URL for the given families (deduplicated, in order). */
export function googleFontsUrl(keys: readonly FontKey[]): string {
  const families = [...new Set(keys)].map((key) => {
    const font: FontEntry = FONTS[key];
    const name = font.family.replace(/ /g, '+');
    return `family=${font.axes ? `${name}:${font.axes}` : name}`;
  });
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}
