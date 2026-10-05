/**
 * The theme catalog: one entry per theme, core and study, with what pickers,
 * the atlas and agents need — never the ficha prose. scripts/build-study.mjs
 * renders it twice: a TS module for the site (with `vars`) and the npm
 * `./study` module (without).
 */
import { resolveColor } from '../lib/themes/color';
import type { NeoBuiltinTheme, NeoThemeInfo } from '../lib/themes';
import { fontKeys } from './compile';
import type { CompiledTheme } from './compile';
import { FONTS } from './fonts';
import { REFERENCE_KINDS, SCENES, SHADOW_KINDS } from './types';
import type { BorderFacet, CoreFicha, CornerFacet, Facets, ImageCredit, L10n, Reference, Scene, StudyThemeInput } from './types';

export interface CatalogReference {
  readonly title: L10n;
  readonly original?: { readonly text: string; readonly lang: string };
  readonly authors: readonly string[];
  readonly date: number | readonly [number, number];
  readonly place: L10n;
  readonly kind: Reference['kind'];
}

export interface CatalogEntry {
  readonly id: string;
  readonly scene: Scene;
  readonly nativeScheme: 'light' | 'dark';
  readonly name: L10n;
  readonly tagline: L10n;
  readonly reference: CatalogReference;
  /** Light scheme: primary, accent, fg, bg. */
  readonly swatch: readonly string[];
  /** Family names the theme expects. */
  readonly fonts: readonly string[];
  /** Google Fonts stylesheet, or null for system fonts. */
  readonly fontsHref: string | null;
  readonly facets: Facets;
  readonly predatesStudy: boolean;
  /** Study themes: the tokens an atlas card paints with, without loading the stylesheet. Core themes: null. */
  readonly vars: Readonly<Record<string, string>> | null;
  /** Site only: the photograph's credit, for the Credits page (no ficha chunk to load); null without one. */
  readonly image: Pick<ImageCredit, 'author' | 'license' | 'sourceUrl'> | null;
}

const imageCredit = ({ image }: Reference): CatalogEntry['image'] =>
  image ? { author: image.author, license: image.license, sourceUrl: image.sourceUrl } : null;

/** Tokens copied into `vars`. */
export const PREVIEW_TOKENS = [
  '--nbc-scheme',
  '--nbc-font-sans',
  '--nbc-font-display',
  '--nbc-weight-body',
  '--nbc-weight-label',
  '--nbc-weight-display',
  '--nbc-label-transform',
  '--nbc-label-spacing',
  '--nbc-display-transform',
  '--nbc-display-spacing',
  '--nbc-bg',
  '--nbc-fg',
  '--nbc-fg-muted',
  '--nbc-surface',
  '--nbc-surface-alt',
  '--nbc-border-color',
  '--nbc-primary',
  '--nbc-primary-fg',
  '--nbc-accent',
  '--nbc-accent-fg',
  '--nbc-focus',
  '--nbc-primary-fill',
  '--nbc-surface-fill',
  '--nbc-texture',
  '--nbc-border-width',
  '--nbc-border-style',
  '--nbc-radius',
  '--nbc-radius-control',
  '--nbc-radius-button',
  '--nbc-radius-small',
  '--nbc-shadow',
  '--nbc-shadow-lg',
  '--nbc-shadow-press',
  '--nbc-press',
  '--nbc-press-active',
] as const;

const BORDER_FACETS: readonly BorderFacet[] = ['hairline', 'standard', 'heavy'];
const CORNER_FACETS: readonly CornerFacet[] = ['square', 'soft', 'round'];

export const borderFacet = (px: number): BorderFacet => (px <= 1 ? 'hairline' : px <= 3 ? 'standard' : 'heavy');
export const cornerFacet = (px: number): CornerFacet => (px === 0 ? 'square' : px < 16 ? 'soft' : 'round');
export const decadeOf = (date: Reference['date']): number => Math.floor((typeof date === 'number' ? date : date[0]) / 10) * 10;

function summary(reference: Reference): CatalogReference {
  return {
    title: reference.title,
    ...(reference.original ? { original: reference.original } : {}),
    authors: reference.authors,
    date: reference.date,
    place: reference.place,
    kind: reference.kind,
  };
}

export function studyEntry(theme: StudyThemeInput, compiled: CompiledTheme): CatalogEntry {
  const tokens = compiled.tokens as Map<string, string>;
  const light = (name: string) => resolveColor(tokens, name, 'light');
  return {
    id: theme.id,
    scene: theme.scene,
    nativeScheme: theme.nativeScheme,
    name: theme.name,
    tagline: theme.tagline,
    reference: summary(theme.reference),
    swatch: [light('--nbc-primary'), light('--nbc-accent'), light('--nbc-fg'), light('--nbc-bg')],
    fonts: fontKeys(theme.fonts).map((key) => FONTS[key].family),
    fontsHref: compiled.fontsHref,
    facets: {
      scene: theme.scene,
      decade: decadeOf(theme.reference.date),
      kind: theme.reference.kind,
      scheme: theme.nativeScheme,
      border: borderFacet(theme.shape.borderWidth),
      shadow: theme.elevation.kind,
      corners: cornerFacet(theme.shape.radiusButton),
    },
    predatesStudy: false,
    vars: Object.fromEntries(PREVIEW_TOKENS.map((name) => [name, tokens.get(name) ?? ''])),
    image: imageCredit(theme.reference),
  };
}

export function coreEntry(id: NeoBuiltinTheme, info: NeoThemeInfo, core: CoreFicha, fontsHref: string | null): CatalogEntry {
  return {
    id,
    scene: core.scene,
    nativeScheme: info.nativeScheme,
    name: { es: info.name, en: info.name },
    tagline: core.tagline,
    reference: summary(core.reference),
    swatch: info.swatch,
    fonts: info.fonts,
    fontsHref,
    facets: { scene: core.scene, decade: decadeOf(core.reference.date), kind: core.reference.kind, scheme: info.nativeScheme, ...core.facets },
    predatesStudy: true,
    vars: null,
    image: imageCredit(core.reference),
  };
}

export function renderSiteModule(entries: readonly CatalogEntry[]): string {
  return [
    '// Generated by scripts/build-study.mjs from src/study — do not edit.',
    "import type { CatalogEntry } from '../catalog';",
    '',
    `export const CATALOG: readonly CatalogEntry[] = ${JSON.stringify(entries, null, 2)};`,
    '',
  ].join('\n');
}

const union = (values: readonly string[]) => values.map((v) => `'${v}'`).join(' | ');

export function renderPackageModule(entries: readonly CatalogEntry[]): { js: string; dts: string } {
  const slim = entries.map((entry) => ({ ...entry, vars: undefined, image: undefined }));
  const studyIds = entries.filter((entry) => !entry.predatesStudy).map((entry) => JSON.stringify(entry.id));
  const js = [
    '// neobrutalistcomponents/study — the theme catalog of the neobrutalism study (data only).',
    `export const STUDY_CATALOG = Object.freeze(${JSON.stringify(slim, null, 2)});`,
    '',
  ].join('\n');
  const kind = union(REFERENCE_KINDS);
  const dts = [
    '/** neobrutalistcomponents/study — the theme catalog of the neobrutalism study. */',
    `export type StudyThemeId = ${studyIds.length ? studyIds.join(' | ') : 'never'};`,
    `export type StudyScene = ${union(SCENES)};`,
    'export interface StudyText {',
    '  readonly es: string;',
    '  readonly en: string;',
    '}',
    'export interface StudyCatalogEntry {',
    '  readonly id: string;',
    '  readonly scene: StudyScene;',
    "  readonly nativeScheme: 'light' | 'dark';",
    '  readonly name: StudyText;',
    '  readonly tagline: StudyText;',
    '  readonly reference: {',
    '    readonly title: StudyText;',
    '    readonly original?: { readonly text: string; readonly lang: string };',
    '    readonly authors: readonly string[];',
    '    readonly date: number | readonly [number, number];',
    '    readonly place: StudyText;',
    `    readonly kind: ${kind};`,
    '  };',
    '  /** Light scheme: primary, accent, fg, bg. */',
    '  readonly swatch: readonly string[];',
    '  readonly fonts: readonly string[];',
    '  readonly fontsHref: string | null;',
    '  readonly facets: {',
    '    readonly scene: StudyScene;',
    '    readonly decade: number;',
    `    readonly kind: ${kind};`,
    "    readonly scheme: 'light' | 'dark';",
    `    readonly border: ${union(BORDER_FACETS)};`,
    `    readonly shadow: ${union(SHADOW_KINDS)};`,
    `    readonly corners: ${union(CORNER_FACETS)};`,
    '  };',
    '  /** True for the five core themes, which predate the study. */',
    '  readonly predatesStudy: boolean;',
    '}',
    'export declare const STUDY_CATALOG: readonly StudyCatalogEntry[];',
    '',
  ].join('\n');
  return { js, dts };
}
