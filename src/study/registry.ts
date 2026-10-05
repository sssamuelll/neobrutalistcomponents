/**
 * Every study theme file, loaded eagerly — for tests and scripts/build-study.mjs
 * only. The site never imports this (it would bundle every ficha).
 */
import type { StudyThemeInput } from './types';

const modules = import.meta.glob<{ default: StudyThemeInput }>('./themes/*/*.ts', { eager: true });
const signatures = import.meta.glob<string>('./themes/*/*.css', { eager: true, query: '?raw', import: 'default' });

export interface RegisteredTheme {
  /** Glob key, e.g. './themes/japan/nakagin.ts'. */
  readonly path: string;
  readonly theme: StudyThemeInput;
  /** Contents of the signature file, when the theme declares one and it exists. */
  readonly signature?: string;
}

export const STUDY_THEMES: readonly RegisteredTheme[] = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, module]) => {
    const theme = module.default;
    const key = theme.signature ? `${path.slice(0, path.lastIndexOf('/'))}/${theme.signature.replace(/^\.\//, '')}` : undefined;
    return { path, theme, signature: key ? signatures[key] : undefined };
  });

export function registryProblems(entries: readonly RegisteredTheme[] = STUDY_THEMES): string[] {
  const problems: string[] = [];
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
