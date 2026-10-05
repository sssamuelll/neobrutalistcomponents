/**
 * Every study theme file, loaded eagerly — for tests and scripts/build-study.mjs
 * only. The site never imports this (it would bundle every ficha).
 */
import type { StudyThemeInput } from './types';

type ThemeModules = Readonly<Record<string, { readonly default?: unknown }>>;
type ThemeStyles = Readonly<Record<string, string>>;

// Everything under themes/, at any depth: stray files are reported, never ignored.
const MODULES: ThemeModules = import.meta.glob<{ default?: unknown }>('./themes/**/*.ts', { eager: true });
const STYLES: ThemeStyles = import.meta.glob<string>('./themes/**/*.css', { eager: true, query: '?raw', import: 'default' });

const THEME_PATH = /^\.\/themes\/[^/]+\/[^/]+\.ts$/;

export interface RegisteredTheme {
  /** Glob key, e.g. './themes/japan/nakagin.ts'. */
  readonly path: string;
  readonly theme: StudyThemeInput;
  /** Contents of the signature file, when the theme declares one and it exists. */
  readonly signature?: string;
}

/** The glob key a theme's declared signature lives at, next to its file. */
const signaturePath = (path: string, theme: StudyThemeInput) =>
  theme.signature ? `${path.slice(0, path.lastIndexOf('/'))}/${theme.signature.replace(/^\.\//, '')}` : undefined;

const isTheme = (value: unknown): value is StudyThemeInput =>
  typeof value === 'object' && value !== null && typeof (value as { id?: unknown }).id === 'string';

/** Sorts glob results into themes, reporting every file that is not a theme or a declared signature. */
export function collectThemes(modules: ThemeModules, styles: ThemeStyles): { themes: RegisteredTheme[]; problems: string[] } {
  const problems: string[] = [];
  const themes: RegisteredTheme[] = [];
  for (const path of Object.keys(modules).sort((a, b) => a.localeCompare(b))) {
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
    themes.push({ path, theme, signature: key ? styles[key] : undefined });
  }
  const declared = new Set(themes.map(({ path, theme }) => signaturePath(path, theme)));
  for (const path of Object.keys(styles).sort((a, b) => a.localeCompare(b))) {
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
  for (const { path, theme, signature } of entries) {
    const expected = `./themes/${theme.scene}/${theme.id}.ts`;
    if (path !== expected) {
      problems.push(`${path}: a theme with id "${theme.id}" and scene "${theme.scene}" must live at ${expected}`);
    }
    if (seen.has(theme.id)) problems.push(`${theme.id}: duplicate id`);
    seen.add(theme.id);
    if (theme.signature && signature === undefined) {
      problems.push(`${theme.id}: signature ${theme.signature} not found next to the theme file`);
    }
  }
  return problems;
}
