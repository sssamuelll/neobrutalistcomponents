import { describe, expect, it } from 'vitest';
import { ESSAY_SLUGS } from '../../study/essays';
import { loadEssay } from './essays';

describe('loadEssay', () => {
  it('loads every essay as rendered HTML with its sources, in both languages', async () => {
    for (const slug of ESSAY_SLUGS) {
      for (const lang of ['es', 'en'] as const) {
        const { html, sources } = await loadEssay(slug, lang);
        expect(html, `${slug}.${lang}`).toMatch(/^<(h2|p)>/);
        expect(html, `${slug}.${lang}`).not.toMatch(/<h1|\n# /);
        expect(Array.isArray(sources)).toBe(true);
      }
    }
  });

  it('marks citations', async () => {
    const { html } = await loadEssay('origins', 'en');
    expect(html).toContain('<span class="study-cite">[13]</span>');
  });
});
