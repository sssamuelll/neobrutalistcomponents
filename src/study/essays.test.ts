import { describe, expect, it } from 'vitest';
import { essayProblems } from './essays';
import type { Source } from './types';

const SOURCES: Source[] = [
  { title: 'One', url: 'https://example.org/one', publisher: 'Example', accessed: '2026-10-05' },
  { title: 'Two', url: 'https://en.wikipedia.org/wiki/Two', accessed: '2026-10-05' },
];
const es = '## Hola\n\nUn hecho [1]. Otro [2].';
const en = '## Hello\n\nA fact [1]. Another [2].';

describe('essayProblems', () => {
  it('accepts a bilingual essay that cites every source', () => {
    expect(essayProblems('fixture', es, en, SOURCES)).toEqual([]);
  });

  it('accepts an essay without sources or markers', () => {
    expect(essayProblems('fixture', '## Método\n\nTexto.', '## Method\n\nText.', [])).toEqual([]);
  });

  it.each([
    [[undefined, en], /fixture\.es: missing or empty/],
    [[es, '<b>Hello</b> [1] [2]'], /fixture\.en: raw HTML is not allowed/],
    [[es, '# Hello\n\n[1] [2]'], /use ## and ###/],
    [[es, en.replace('[2]', '[3]')], /fixture\.en: marker \[3\] has no source/],
    [[es, en.replace(' Another [2].', '')], /markers differ between es \[1,2\] and en \[1\]/],
    [[es.replace(' Otro [2].', ''), en.replace(' Another [2].', '')], /source \[2\] is never cited/],
    [[es, `${en} [1952](https://example.org)`], /may not be a bare number/],
    [[es, `${en} [Tate](http://www.tate.org.uk/)`], /fixture\.en: links must be https/],
  ])('rejects %o', ([esText, enText], message) => {
    expect(essayProblems('fixture', esText, enText, SOURCES).join('\n')).toMatch(message);
  });

  it('checks the sources themselves', () => {
    const bad = [{ ...SOURCES[0], url: 'http://example.org' as never }, SOURCES[1]];
    expect(essayProblems('fixture', es, en, bad).join('\n')).toMatch(/fixture\.sources\[1\]: not https/);
  });
});
