/**
 * Wording the final review of plan 1 flagged in fichas: statements that were
 * false, and phrases that could be verbatim quotes of a source (spec D7:
 * fichas paraphrase, never quote).
 */
import { describe, expect, it } from 'vitest';
import { CORE_FICHAS } from './core-fichas';
import { STUDY_THEMES } from './registry';
import { LANGS } from './types';
import type { Ficha } from './types';

const fichas: { id: string; ficha: Ficha }[] = [
  ...STUDY_THEMES.map(({ theme }) => ({ id: theme.id, ficha: theme.ficha })),
  ...Object.entries(CORE_FICHAS).map(([id, core]) => ({ id, ficha: core.ficha })),
];
const texts = fichas.flatMap(({ id, ficha }) =>
  LANGS.flatMap((lang) => [ficha.documented[lang], ficha.reading[lang]].map((text) => ({ where: `${id}.${lang}`, text }))),
);

const RETIRED = [
  // False: only titles use the condensed face.
  /labels use a condensed grotesque/i,
  /sus etiquetas van en una grotesca condensada/i,
  // False: the VT100 also had blink.
  /attributes limited to/i,
  /atributos limitados a/i,
  // Near-verbatim or possibly verbatim source phrases.
  /programmatic platform/i,
  /plataforma programática/i,
  /page after page of blue links/i,
  /página tras página de enlaces azules/i,
  /defining built work/i,
  /obra construida que define/i,
  /best-known brutalist website/i,
  /sitio web brutalista más conocido/i,
];

describe('ficha wording flagged in review', () => {
  it.each(RETIRED.map((pattern) => [pattern.source, pattern] as const))('no ficha says /%s/', (_source, pattern) => {
    expect(texts.filter(({ text }) => pattern.test(text)).map(({ where }) => where)).toEqual([]);
  });

  it('tech cites the VT100 manual chapter that lists its character attributes', () => {
    expect(CORE_FICHAS.tech.reference.sources.map((s) => s.url)).toContain('https://vt100.net/docs/vt100-ug/chapter3.html');
  });
});
