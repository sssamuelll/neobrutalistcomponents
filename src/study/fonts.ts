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
  jost: { family: 'Jost', axes: 'wght@500;700;900', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  'dm-mono': { family: 'DM Mono', axes: 'wght@400;500', fallback: 'mono', license: 'OFL-1.1', scripts: ['latin', 'latin-ext'] },
  'm-plus-1-code': { family: 'M PLUS 1 Code', axes: 'wght@400;500;700', fallback: 'mono', license: 'OFL-1.1', scripts: ['latin', 'japanese'] },
  'zen-kaku-gothic-new': { family: 'Zen Kaku Gothic New', axes: 'wght@400;500;700;900', fallback: 'sans', license: 'OFL-1.1', scripts: ['latin', 'japanese'] },
} as const satisfies Record<string, FontEntry>;

export type FontKey = keyof typeof FONTS;

/**
 * Licences of the families the five core themes load (the library's
 * themes/<id>.fonts.css), for the Credits page. Checked against the
 * google/fonts repository, which files every family under ofl/ or apache/.
 */
export const CORE_FONT_LICENSES: Readonly<Record<string, FontEntry['license']>> = {
  'Bricolage Grotesque': 'OFL-1.1',
  'Geist Mono': 'OFL-1.1',
  'Martian Mono': 'OFL-1.1',
  'Inter Tight': 'OFL-1.1',
  'JetBrains Mono': 'OFL-1.1',
  Sixtyfour: 'OFL-1.1',
  'M PLUS Rounded 1c': 'OFL-1.1',
  VT323: 'OFL-1.1',
  Archivo: 'OFL-1.1',
  'IBM Plex Mono': 'OFL-1.1',
};

/** A family's licence by its CSS name: the registry for study themes, the list above for core ones. */
export function fontLicense(family: string): FontEntry['license'] | undefined {
  const registered = (Object.values(FONTS) as FontEntry[]).find((font) => font.family === family);
  if (registered) return registered.license;
  return Object.hasOwn(CORE_FONT_LICENSES, family) ? CORE_FONT_LICENSES[family] : undefined;
}

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
