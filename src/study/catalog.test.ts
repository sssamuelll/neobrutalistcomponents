import { describe, expect, it } from 'vitest';
import { compileTheme } from './compile';
import {
  PREVIEW_TOKENS,
  borderFacet,
  cornerFacet,
  decadeOf,
  renderPackageModule,
  renderSiteModule,
  studyEntry,
} from './catalog';
import { FIXTURE } from './__fixtures__/fixture';

const entry = studyEntry(FIXTURE, compileTheme(FIXTURE));
/** Evaluates the generated npm module without a module loader. */
const load = (js: string) =>
  new Function(js.replace('export const STUDY_CATALOG = ', 'return '))() as readonly Record<string, unknown>[];

describe('catalog', () => {
  it('summarizes a study theme without its ficha prose', () => {
    expect(entry).toMatchObject({
      id: 'fixture',
      scene: 'germany',
      nativeScheme: 'light',
      predatesStudy: false,
      swatch: ['#1a5f9e', '#6e570e', '#111111', '#f2f2f2'],
      fonts: ['Barlow', 'DM Mono'],
      fontsHref: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap',
      facets: { scene: 'germany', decade: 1970, kind: 'architecture', scheme: 'light', border: 'standard', shadow: 'hard', corners: 'square' },
    });
    expect(entry.reference).not.toHaveProperty('sources');
    expect(entry).not.toHaveProperty('ficha');
    expect(Object.keys(entry.vars!)).toEqual([...PREVIEW_TOKENS]);
  });

  it('buckets facets', () => {
    expect([1, 2, 3, 4].map(borderFacet)).toEqual(['hairline', 'standard', 'standard', 'heavy']);
    expect([0, 6, 15, 16, 999].map(cornerFacet)).toEqual(['square', 'soft', 'soft', 'round', 'round']);
    expect(decadeOf(1995)).toBe(1990);
    expect(decadeOf([1977, 1986])).toBe(1970);
  });

  it('renders an npm module that survives non-ASCII text and quotes, without vars', () => {
    const tricky = {
      ...entry,
      reference: { ...entry.reference, title: { es: 'Torre "Nakagin"', en: "Kurokawa's tower" }, original: { text: '中銀カプセルタワー', lang: 'ja' } },
    };
    const { js, dts } = renderPackageModule([tricky]);
    const catalog = load(js);
    const reference = catalog[0].reference as { title: { es: string }; original: { text: string } };
    expect(reference.original.text).toBe('中銀カプセルタワー');
    expect(reference.title.es).toBe('Torre "Nakagin"');
    expect(catalog[0]).not.toHaveProperty('vars');
    expect(Object.isFrozen(catalog)).toBe(true);
    expect(dts).toContain('export type StudyThemeId = "fixture";');
    expect(dts).toContain('export declare const STUDY_CATALOG: readonly StudyCatalogEntry[];');
  });

  it('keeps the photograph credit for the site, never for the npm module', () => {
    const image = {
      file: 'fixture.avif',
      width: 1600,
      height: 1200,
      alt: { es: 'Foto', en: 'Photo' },
      author: 'Ana',
      license: 'CC-BY-SA-4.0' as const,
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fixture.jpg' as const,
    };
    const withImage = studyEntry({ ...FIXTURE, reference: { ...FIXTURE.reference, image } }, compileTheme(FIXTURE));
    expect(withImage.image).toEqual({ author: 'Ana', license: 'CC-BY-SA-4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fixture.jpg' });
    expect(entry.image).toBeNull();
    expect(load(renderPackageModule([withImage]).js)[0]).not.toHaveProperty('image');
  });

  it('types StudyThemeId as never when there are no study themes', () => {
    expect(renderPackageModule([{ ...entry, predatesStudy: true }]).dts).toContain('export type StudyThemeId = never;');
  });

  it('renders the site module with vars', () => {
    const ts = renderSiteModule([entry]);
    expect(ts).toContain("import type { CatalogEntry } from '../catalog';");
    expect(ts).toContain('export const CATALOG: readonly CatalogEntry[] = [');
    expect(ts).toContain('"--nbc-primary-fill": "var(--nbc-primary)"');
  });
});
