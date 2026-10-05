import { describe, expect, it } from 'vitest';
import { ESSAY_SLUGS, essayProblems } from './essays';
import type { Source } from './types';

const texts = import.meta.glob<string>('./essays/*/*.md', { eager: true, query: '?raw', import: 'default' });
const sources = import.meta.glob<readonly Source[]>('./essays/*/sources.ts', { eager: true, import: 'default' });

describe('the essays of the study', () => {
  it('are exactly the ones the site renders, each with es, en and sources', () => {
    const slugs = (paths: string[]) => [...new Set(paths.map((path) => path.split('/')[2]))].sort();
    expect(slugs(Object.keys(texts))).toEqual([...ESSAY_SLUGS].sort());
    expect(Object.keys(texts)).toHaveLength(ESSAY_SLUGS.length * 2);
    expect(slugs(Object.keys(sources))).toEqual([...ESSAY_SLUGS].sort());
  });

  it.each(ESSAY_SLUGS)('%s passes the essay checks', (slug) => {
    const problems = essayProblems(
      slug,
      texts[`./essays/${slug}/es.md`],
      texts[`./essays/${slug}/en.md`],
      sources[`./essays/${slug}/sources.ts`] ?? [],
    );
    expect(problems).toEqual([]);
  });
});
