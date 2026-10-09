/**
 * The study's data model. A study theme is one documented reference work
 * (a building, a poster, a typeface, a website…) read through the token
 * contract. Types and constants only — no runtime logic.
 */
import type { FontKey } from './fonts';

export const SCENES = ['japan', 'germany', 'usa', 'latam', 'italy', 'origins'] as const;
export type Scene = (typeof SCENES)[number];

/** Scenes that host study themes. `origins` holds history and core themes only. */
export const THEME_SCENES = ['japan', 'germany', 'usa', 'latam', 'italy'] as const;
export type ThemeScene = (typeof THEME_SCENES)[number];

export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];

/** Every user-facing study string, in both languages. */
export type L10n = { readonly [K in Lang]: string };

export type Hex = `#${string}`;
/** One color for both schemes, or `[light, dark]`. */
export type SchemeColor = Hex | readonly [light: Hex, dark: Hex];
/** Text-on-color tokens may let the compiler pick the ink with the most contrast. */
export type InkColor = SchemeColor | 'auto';

export interface StudyColors {
  readonly bg: SchemeColor;
  readonly fg: SchemeColor;
  readonly fgMuted: SchemeColor;
  readonly surface: SchemeColor;
  readonly surfaceAlt: SchemeColor;
  readonly border: SchemeColor;
  readonly primary: SchemeColor;
  readonly primaryFg: InkColor;
  readonly accent: SchemeColor;
  readonly accentFg: InkColor;
  readonly info: SchemeColor;
  readonly infoFg: InkColor;
  readonly success: SchemeColor;
  readonly successFg: InkColor;
  readonly warning: SchemeColor;
  readonly warningFg: InkColor;
  readonly danger: SchemeColor;
  readonly dangerFg: InkColor;
  readonly focus: SchemeColor;
}
export type ColorToken = keyof StudyColors;

/** The custom property behind each color key, in contract order. */
export const COLOR_VARS = {
  bg: '--nbc-bg',
  fg: '--nbc-fg',
  fgMuted: '--nbc-fg-muted',
  surface: '--nbc-surface',
  surfaceAlt: '--nbc-surface-alt',
  border: '--nbc-border-color',
  primary: '--nbc-primary',
  primaryFg: '--nbc-primary-fg',
  accent: '--nbc-accent',
  accentFg: '--nbc-accent-fg',
  info: '--nbc-info',
  infoFg: '--nbc-info-fg',
  success: '--nbc-success',
  successFg: '--nbc-success-fg',
  warning: '--nbc-warning',
  warningFg: '--nbc-warning-fg',
  danger: '--nbc-danger',
  dangerFg: '--nbc-danger-fg',
  focus: '--nbc-focus',
} as const satisfies Record<ColorToken, `--nbc-${string}`>;

/**
 * Gradient or solid fills. Colors inside must be #hex or light-dark(#hex, #hex):
 * the contract checks every stop. Each defaults to its solid color.
 */
export interface StudyFills {
  readonly primary?: string;
  readonly danger?: string;
  readonly surface?: string;
}

export type TextTransform = 'none' | 'uppercase' | 'lowercase';

export interface StudyType {
  readonly weightBody: number;
  readonly weightLabel: number;
  readonly weightDisplay: number;
  /** Default 'none'. */
  readonly labelTransform?: TextTransform;
  /** CSS letter-spacing. Default 'normal'. */
  readonly labelSpacing?: string;
  /** Default 'none'. */
  readonly displayTransform?: TextTransform;
  /** CSS letter-spacing. Default '-0.02em'. */
  readonly displaySpacing?: string;
  /** font-stretch for display text. Default '100%'. */
  readonly displayStretch?: string;
}

/** All values in px. */
export interface StudyShape {
  readonly borderWidth: number;
  /** Default 'solid'. */
  readonly borderStyle?: 'solid' | 'dashed' | 'double';
  /** Surfaces (cards, dialogs, tables). */
  readonly radius: number;
  /** Fields. */
  readonly radiusControl: number;
  /** Buttons; 999 for pills. */
  readonly radiusButton: number;
  /** Badges, kbd, checkboxes. */
  readonly radiusSmall: number;
}

export const SHADOW_KINDS = ['none', 'hard', 'double', 'soft'] as const;
export type ShadowKind = (typeof SHADOW_KINDS)[number];

/** Build with the helpers in ./elevation (flat, hardShadow, doubleStack). */
export interface StudyElevation {
  readonly kind: ShadowKind;
  readonly shadow: string;
  readonly shadowLg: string;
  readonly shadowPress: string;
  /** px a control travels when hovered. */
  readonly press: number;
  /** px a control travels when pressed. */
  readonly pressActive: number;
  /** deg. Default 0. */
  readonly rotate?: number;
}

/** px. Default { width: 3, offset: 2 }. */
export interface StudyFocus {
  readonly width: number;
  readonly offset: number;
}

/** ms. Default { duration: 120, durationSlow: 220, ease: 'cubic-bezier(0.2, 0.9, 0.3, 1)' }. */
export interface StudyMotion {
  readonly duration: number;
  readonly durationSlow: number;
  readonly ease: string;
}

export type StudyFonts =
  | 'system-sans'
  | 'system-serif'
  | { readonly sans: FontKey; readonly display?: FontKey; readonly mono?: FontKey };

export interface Source {
  /** As published, in its original language. */
  readonly title: string;
  readonly url: `https://${string}`;
  readonly publisher?: string;
  readonly year?: number;
  /** YYYY-MM-DD */
  readonly accessed: string;
}

export const IMAGE_LICENSES = [
  'CC0-1.0',
  'PD',
  'CC-BY-2.0',
  'CC-BY-2.5',
  'CC-BY-3.0',
  'CC-BY-4.0',
  'CC-BY-SA-2.0',
  'CC-BY-SA-2.5',
  'CC-BY-SA-3.0',
  'CC-BY-SA-4.0',
] as const;
export type ImageLicense = (typeof IMAGE_LICENSES)[number];

export interface ImageCredit {
  /** File name inside src/study/images/ (kebab-case, .avif). */
  readonly file: string;
  readonly width: number;
  readonly height: number;
  readonly alt: L10n;
  /** As stated on the Commons file page (read by scripts/fetch-image.mjs). */
  readonly author: string;
  readonly license: ImageLicense;
  readonly sourceUrl: `https://commons.wikimedia.org/wiki/File:${string}`;
}

export const REFERENCE_KINDS = ['architecture', 'graphic', 'type', 'web', 'software', 'signage', 'object'] as const;
export type ReferenceKind = (typeof REFERENCE_KINDS)[number];

export interface Reference {
  readonly title: L10n;
  /** The name in its own language and script; `lang` is a BCP 47 tag. */
  readonly original?: { readonly text: string; readonly lang: string };
  /** Empty = anonymous or vernacular. */
  readonly authors: readonly string[];
  readonly date: number | readonly [from: number, to: number];
  readonly place: L10n;
  readonly kind: ReferenceKind;
  readonly sources: readonly Source[];
  readonly image?: ImageCredit;
  readonly archiveUrl?: `https://web.archive.org/${string}`;
}

export const PALETTE_ORIGINS = ['documented', 'sampled', 'interpreted'] as const;
export type PaletteOrigin = (typeof PALETTE_ORIGINS)[number];

export interface Ficha {
  /** 2–4 sentences of fact; every claim carries a [n] marker into reference.sources. */
  readonly documented: L10n;
  /** 2–4 sentences of interpretation: what the theme takes from the reference, and why. */
  readonly reading: L10n;
  readonly palette: { readonly origin: PaletteOrigin; readonly note: L10n };
}

/** A family applied to a theme. Build with the family helpers (concrete(), grid()…). */
export interface FamilyUse {
  readonly family: string;
  readonly params: Readonly<Record<string, string | number>>;
}

export interface StudyThemeInput {
  readonly id: string;
  readonly scene: ThemeScene;
  readonly nativeScheme: 'light' | 'dark';
  readonly name: L10n;
  readonly tagline: L10n;
  readonly reference: Reference;
  readonly ficha: Ficha;
  readonly fonts: StudyFonts;
  readonly colors: StudyColors;
  readonly fills?: StudyFills;
  readonly type: StudyType;
  readonly shape: StudyShape;
  readonly elevation: StudyElevation;
  readonly focus?: StudyFocus;
  readonly motion?: StudyMotion;
  readonly families?: readonly FamilyUse[];
  /** Path of the theme's signature CSS, relative to its file — './<id>.css'. */
  readonly signature?: string;
}

export type BorderFacet = 'hairline' | 'standard' | 'heavy';
export type CornerFacet = 'square' | 'soft' | 'round';

export interface Facets {
  readonly scene: Scene;
  /** Decade of the reference's start year, e.g. 1970. */
  readonly decade: number;
  readonly kind: ReferenceKind;
  readonly scheme: 'light' | 'dark';
  readonly border: BorderFacet;
  readonly shadow: ShadowKind;
  readonly corners: CornerFacet;
}

/** The ficha of a core theme (classic, tech, swiss, y2k, riso). */
export interface CoreFicha {
  readonly scene: Scene;
  /** `en` must equal THEME_INFO[id].tagline. */
  readonly tagline: L10n;
  readonly reference: Reference;
  readonly ficha: Ficha;
  readonly facets: Pick<Facets, 'border' | 'shadow' | 'corners'>;
  readonly predatesStudy: true;
}
