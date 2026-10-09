/**
 * Every study theme file, loaded eagerly — for tests and scripts/build-study.mjs
 * only. The site never imports this (it would bundle every ficha).
 */
import { animates } from './lint';
import type { StudyThemeInput } from './types';

type ThemeModules = Readonly<Record<string, { readonly default?: unknown }>>;
type ThemeStyles = Readonly<Record<string, string>>;

// Everything under themes/, at any depth: stray files are reported, never ignored.
const MODULES: ThemeModules = import.meta.glob<{ default?: unknown }>('./themes/**/*.ts', { eager: true });
const STYLES: ThemeStyles = import.meta.glob<string>('./themes/**/*.css', { eager: true, query: '?raw', import: 'default' });

const THEME_PATH = /^\.\/themes\/[^/]+\/[^/]+\.ts$/;

/** Plain code-unit order: unlike localeCompare, identical on every machine and locale. */
const byCodeUnit = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

export interface RegisteredTheme {
  /** Glob key, e.g. './themes/japan/nakagin.ts'. */
  readonly path: string;
  readonly theme: StudyThemeInput;
  /** Contents of the signature file, when the theme declares one and it exists. */
  readonly signature?: string;
  /** Contents of the motion file, when the theme declares one and it exists. */
  readonly motionCss?: string;
}

/** The glob key of a file a theme declares, next to the theme file. */
const siblingPath = (path: string, relative: string | undefined) =>
  relative ? `${path.slice(0, path.lastIndexOf('/'))}/${relative.replace(/^\.\//, '')}` : undefined;
const signaturePath = (path: string, theme: StudyThemeInput) => siblingPath(path, theme.signature);
const motionPath = (path: string, theme: StudyThemeInput) => siblingPath(path, theme.motionFile);

const isTheme = (value: unknown): value is StudyThemeInput =>
  typeof value === 'object' && value !== null && typeof (value as { id?: unknown }).id === 'string';

/** Sorts glob results into themes, reporting every file that is not a theme or a declared signature. */
export function collectThemes(modules: ThemeModules, styles: ThemeStyles): { themes: RegisteredTheme[]; problems: string[] } {
  const problems: string[] = [];
  const themes: RegisteredTheme[] = [];
  for (const path of Object.keys(modules).sort(byCodeUnit)) {
    if (!THEME_PATH.test(path)) {
      problems.push(`${path}: theme files live at ./themes/<scene>/<id>.ts — move it or remove it`);
      continue;
    }
    const theme = modules[path].default;
    if (!isTheme(theme)) {
      problems.push(`${path}: no default export — a theme file must \`export default defineTheme({ … })\``);
      continue;
    }
    const key = signaturePath(path, theme);
    const motionKey = motionPath(path, theme);
    themes.push({ path, theme, signature: key ? styles[key] : undefined, motionCss: motionKey ? styles[motionKey] : undefined });
  }
  const declared = new Set(themes.flatMap(({ path, theme }) => [signaturePath(path, theme), motionPath(path, theme)]));
  for (const path of Object.keys(styles).sort(byCodeUnit)) {
    if (!declared.has(path)) problems.push(`${path}: no theme declares this file as its signature`);
  }
  return { themes, problems };
}

const COLLECTED = collectThemes(MODULES, STYLES);

export const STUDY_THEMES: readonly RegisteredTheme[] = COLLECTED.themes;

export function registryProblems(
  entries: readonly RegisteredTheme[] = STUDY_THEMES,
  fileProblems: readonly string[] = COLLECTED.problems,
): string[] {
  const problems = [...fileProblems];
  const seen = new Set<string>();
  for (const { path, theme, signature, motionCss } of entries) {
    const expected = `./themes/${theme.scene}/${theme.id}.ts`;
    if (path !== expected) {
      problems.push(`${path}: a theme with id "${theme.id}" and scene "${theme.scene}" must live at ${expected}`);
    }
    if (seen.has(theme.id)) problems.push(`${theme.id}: duplicate id`);
    seen.add(theme.id);
    if (theme.signature && signature === undefined) {
      problems.push(`${theme.id}: signature ${theme.signature} not found next to the theme file`);
    }
    if (theme.motionFile && motionCss === undefined) {
      problems.push(`${theme.id}: motion file ${theme.motionFile} not found next to the theme file`);
    } else if (motionCss !== undefined && !animates(motionCss)) {
      problems.push(`${theme.id}: ${theme.motionFile} animates nothing — drop the file and ficha.motion`);
    }
  }
  return problems;
}
