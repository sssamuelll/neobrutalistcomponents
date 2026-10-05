import { describe, expect, it } from 'vitest';
import { FIXTURE } from './__fixtures__/fixture';
import { themeProblems } from './validate';
import { registryProblems } from './registry';
import type { StudyThemeInput } from './types';

const ref = FIXTURE.reference;
const problems = (patch: Partial<StudyThemeInput>) => themeProblems({ ...FIXTURE, ...patch }).join('\n');

describe('themeProblems', () => {
  it('accepts the fixture', () => {
    expect(themeProblems(FIXTURE)).toEqual([]);
  });

  it.each([
    [{ id: 'Bad_ID' }, /id must match/],
    [{ id: 'classic' }, /collides with a core theme id/],
    [{ scene: 'origins' as never }, /scene must be one of japan, germany, usa, latam/],
    [{ name: { es: '', en: 'Fixture' } }, /fixture\.name\.es: empty/],
    [{ reference: { ...ref, sources: [ref.sources[0]] } }, /needs at least 2, has 1/],
    [{ reference: { ...ref, sources: [ref.sources[1], { ...ref.sources[1], title: 'Other' }] } }, /at least one source must not be on wikipedia\.org/],
    [{ reference: { ...ref, sources: [{ ...ref.sources[0], url: 'http://example.org/one' as never }, ref.sources[1]] } }, /not https/],
    [{ reference: { ...ref, sources: [{ ...ref.sources[0], accessed: '5/10/2026' }, ref.sources[1]] } }, /accessed must be YYYY-MM-DD/],
    [{ reference: { ...ref, date: [1981, 1971] } }, /not a year or an ordered range/],
    [{ reference: { ...ref, original: { text: 'Testwerk', lang: 'German' } } }, /BCP 47/],
    [{ ficha: { ...FIXTURE.ficha, documented: { es: 'Un hecho [1]. Otro [3].', en: 'A fact [1]. Another [3].' } } }, /marker \[3\] has no source/],
    [{ ficha: { ...FIXTURE.ficha, documented: { es: 'Un hecho [1]. Otro [2].', en: 'A fact [1]. Another.' } } }, /markers differ between es/],
    [{ ficha: { ...FIXTURE.ficha, documented: { es: 'Un hecho [1].', en: 'A fact [1].' } } }, /source \[2\] is never cited/],
    [{ reference: { ...ref, archiveUrl: 'https://archive.org/x' as never } }, /web\.archive\.org/],
    [{ fonts: { sans: 'comic-sans' as never } }, /unknown font "comic-sans"/],
  ])('rejects %o', (patch, message) => {
    expect(problems(patch as Partial<StudyThemeInput>)).toMatch(message);
  });

  it('checks image credits: license whitelist, Commons source, avif name, alt text', () => {
    const image = {
      file: 'fixture.avif', width: 1600, height: 1067, author: 'Someone',
      license: 'CC-BY-SA-4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fixture.jpg',
      alt: { es: 'Una foto.', en: 'A photo.' },
    } as const;
    expect(themeProblems({ ...FIXTURE, reference: { ...ref, image } })).toEqual([]);
    expect(problems({ reference: { ...ref, image: { ...image, license: 'CC-BY-NC-4.0' as never } } })).toMatch(/license "CC-BY-NC-4\.0" is not allowed/);
    expect(problems({ reference: { ...ref, image: { ...image, sourceUrl: 'https://flickr.com/x' as never } } })).toMatch(/Commons file page/);
    expect(problems({ reference: { ...ref, image: { ...image, file: 'Fixture.JPG' } } })).toMatch(/kebab-case \.avif/);
    expect(problems({ reference: { ...ref, image: { ...image, alt: { es: '', en: 'A photo.' } } } })).toMatch(/image\.alt\.es: empty/);
  });
});

describe('registryProblems (Review Focus 5)', () => {
  it('reports a theme outside themes/<scene>/<id>.ts, duplicates and missing signatures', () => {
    const entries = [
      { path: './themes/japan/fixture.ts', theme: FIXTURE },
      { path: './themes/germany/fixture.ts', theme: FIXTURE },
      { path: './themes/germany/fixture.ts', theme: { ...FIXTURE, id: 'other', signature: './other.css' } },
    ];
    const report = registryProblems(entries).join('\n');
    expect(report).toMatch(/\.\/themes\/japan\/fixture\.ts: a theme with id "fixture" and scene "germany" must live at \.\/themes\/germany\/fixture\.ts/);
    expect(report).toMatch(/fixture: duplicate id/);
    expect(report).toMatch(/other: signature \.\/other\.css not found next to the theme file/);
  });
});
