/**
 * The study's proof themes, for the preview on the Themes page (plan 2 of the
 * study replaces it with the atlas and a page per theme). Tokens are parsed
 * from the generated stylesheets — the bytes that ship — exactly like the core
 * themes' tokens.
 */
import { parseThemeTokens } from '../../lib/themes/color';
import { CATALOG } from '../../study/.generated/catalog';
import type { CatalogEntry } from '../../study/catalog';
import type { StudyThemeInput } from '../../study/types';

const modules = import.meta.glob<StudyThemeInput>('../../study/themes/*/*.ts', { eager: true, import: 'default' });
const styles = import.meta.glob<string>(
  ['../../study/.generated/themes/*.css', '!../../study/.generated/themes/*.fonts.css'],
  { eager: true, query: '?raw', import: 'default' },
);
const images = import.meta.glob<string>('../../study/images/*.avif', { eager: true, query: '?url', import: 'default' });

export interface StudyPreview {
  readonly theme: StudyThemeInput;
  readonly entry: CatalogEntry;
  readonly tokens: Map<string, string>;
  readonly imageUrl: string | null;
}

export const STUDY_PREVIEWS: readonly StudyPreview[] = CATALOG.filter((entry) => !entry.predatesStudy).map((entry) => {
  const theme = modules[`../../study/themes/${entry.scene}/${entry.id}.ts`];
  const css = styles[`../../study/.generated/themes/${entry.id}.css`];
  const image = theme.reference.image;
  return {
    theme,
    entry,
    tokens: parseThemeTokens(css, entry.id),
    imageUrl: image ? images[`../../study/images/${image.file}`] : null,
  };
});
