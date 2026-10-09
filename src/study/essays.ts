/**
 * Essays of the study: Markdown in src/study/essays/<slug>/{es,en}.md with a
 * shared sources.ts. Pure checks, shared by the tests and nothing else.
 */
import { markers, sourceProblems } from './validate';
import type { Source } from './types';

/** Every essay the site renders, by slug. */
export const ESSAY_SLUGS = ['home', 'origins', 'method', 'scene-japan', 'scene-germany', 'scene-usa', 'scene-latam', 'scene-italy'] as const;
export type EssaySlug = (typeof ESSAY_SLUGS)[number];

export function essayProblems(slug: string, es: string | undefined, en: string | undefined, sources: readonly Source[]): string[] {
  const problems: string[] = [];
  for (const [lang, text] of [['es', es], ['en', en]] as const) {
    if (!text?.trim()) {
      problems.push(`${slug}.${lang}: missing or empty`);
      continue;
    }
    if (/<[a-z!/]/i.test(text)) problems.push(`${slug}.${lang}: raw HTML is not allowed in essays`);
    if (/^#\s/m.test(text)) problems.push(`${slug}.${lang}: use ## and ### — the page owns the h1`);
    if (/\[\d+\]\(/.test(text)) problems.push(`${slug}.${lang}: a link label may not be a bare number (it reads as a source marker)`);
    if (/\]\((?!https:\/\/)/.test(text)) problems.push(`${slug}.${lang}: links must be https (others are dropped from the page)`);
    for (const n of markers(text)) if (n < 1 || n > sources.length) problems.push(`${slug}.${lang}: marker [${n}] has no source`);
  }
  if (problems.length) return problems;
  const cited = (text: string) => [...new Set(markers(text))].sort((a, b) => a - b);
  const [inEs, inEn] = [cited(es!), cited(en!)];
  if (inEs.join() !== inEn.join()) problems.push(`${slug}: markers differ between es [${inEs}] and en [${inEn}]`);
  for (let n = 1; n <= sources.length; n += 1) if (!inEs.includes(n)) problems.push(`${slug}: source [${n}] is never cited`);
  problems.push(...sourceProblems(sources, slug));
  return problems;
}
