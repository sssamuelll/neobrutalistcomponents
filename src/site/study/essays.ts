/**
 * Essays load on demand: each language is its own chunk of HTML rendered at
 * build time (vite-plugin-essays.ts), with a small sources module beside it.
 */
import type { EssaySlug } from '../../study/essays';
import type { Lang, Source } from '../../study/types';
import { useLazy } from './lazy';
import type { Lazy } from './lazy';

const texts = import.meta.glob<string>('../../study/essays/*/*.md', { import: 'default' });
const sourceModules = import.meta.glob<readonly Source[]>('../../study/essays/*/sources.ts', { import: 'default' });

export interface Essay {
  readonly html: string;
  readonly sources: readonly Source[];
}

export async function loadEssay(slug: EssaySlug, lang: Lang): Promise<Essay> {
  const [html, sources] = await Promise.all([
    texts[`../../study/essays/${slug}/${lang}.md`](),
    sourceModules[`../../study/essays/${slug}/sources.ts`](),
  ]);
  return { html, sources };
}

export const useEssay = (slug: EssaySlug, lang: Lang): Lazy<Essay> => useLazy(`${slug}:${lang}`, () => loadEssay(slug, lang));
