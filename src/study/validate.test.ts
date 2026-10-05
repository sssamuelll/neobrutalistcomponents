import { describe, expect, it } from 'vitest';
import { FIXTURE } from './__fixtures__/fixture';
import { themeProblems } from './validate';
import { collectThemes, registryProblems } from './registry';
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

describe('themeProblems checks every value that is written into the CSS', () => {
  it.each([
    [{ motion: { duration: 120, durationSlow: 220, ease: 'cubic-bezier(0.2, 0.9, 0.3, 1' } }, /motion\.ease/],
    [{ type: { ...FIXTURE.type, labelSpacing: '0.1em } body { display: none' } }, /type\.labelSpacing/],
    [{ type: { ...FIXTURE.type, weightBody: 1200 } }, /type\.weightBody/],
    [{ type: { ...FIXTURE.type, displayStretch: 'wide' } }, /type\.displayStretch/],
    [{ shape: { ...FIXTURE.shape, borderWidth: -2 } }, /shape\.borderWidth/],
    [{ shape: { ...FIXTURE.shape, radiusButton: 1.5 } }, /shape\.radiusButton/],
    [{ elevation: { ...FIXTURE.elevation, shadow: '4px 4px 0 var(--nbc-fg); color: red' } }, /elevation\.shadow/],
    [{ elevation: { ...FIXTURE.elevation, press: -3 } }, /elevation\.press/],
    [{ focus: { width: 0, offset: 2 } }, /focus\.width/],
    [{ motion: { duration: -1, durationSlow: 220, ease: 'linear' } }, /motion\.duration/],
  ])('rejects %o', (patch, message) => {
    expect(problems(patch as Partial<StudyThemeInput>)).toMatch(message);
  });

  it('accepts the values the proof themes use', () => {
    expect(themeProblems({ ...FIXTURE, motion: { duration: 0, durationSlow: 0, ease: 'linear' } })).toEqual([]);
    expect(themeProblems({ ...FIXTURE, type: { ...FIXTURE.type, labelSpacing: '0.06em', displaySpacing: '-0.03em' } })).toEqual([]);
    expect(themeProblems({ ...FIXTURE, type: { ...FIXTURE.type, labelSpacing: '0em', displayStretch: '87.5%' } })).toEqual([]);
  });
});

describe('themeProblems keeps fills inside what the contract can check', () => {
  it.each([
    ['linear-gradient(light-dark(#fff, #1c1c1c), black)', /fills\.surface.*cannot check/],
    ['linear-gradient(#ffffff, rgb(17 17 17))', /fills\.surface.*cannot check/],
    ['url(https://example.org/x.png)', /fills\.surface.*no images/],
  ])('rejects fills.surface %s', (surface, message) => {
    expect(problems({ fills: { surface } })).toMatch(message);
  });

  it('accepts #hex, light-dark() and var() stops', () => {
    expect(themeProblems({ ...FIXTURE, fills: { surface: 'linear-gradient(light-dark(#ffffff, #1c1c1c), var(--nbc-surface))' } })).toEqual([]);
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

describe('collectThemes reports every stray file under themes/', () => {
  it('outside <scene>/<id>.ts, without a default export, or a stylesheet no theme declares', () => {
    const { themes, problems: report } = collectThemes(
      {
        './themes/germany/fixture.ts': { default: FIXTURE },
        './themes/stray.ts': { default: FIXTURE },
        './themes/japan/sub/deep.ts': { default: FIXTURE },
        './themes/japan/helpers.ts': {},
      },
      { './themes/germany/orphan.css': '.nbc-card { color: var(--nbc-fg); }' },
    );
    expect(themes.map((t) => t.path)).toEqual(['./themes/germany/fixture.ts']);
    const text = report.join('\n');
    expect(text).toMatch(/\.\/themes\/stray\.ts: theme files live at \.\/themes\/<scene>\/<id>\.ts/);
    expect(text).toMatch(/\.\/themes\/japan\/sub\/deep\.ts: theme files live at/);
    expect(text).toMatch(/\.\/themes\/japan\/helpers\.ts: no default export/);
    expect(text).toMatch(/\.\/themes\/germany\/orphan\.css: no theme declares this file as its signature/);
  });

  it('feeds those problems into registryProblems', () => {
    expect(registryProblems([], ['./themes/stray.ts: theme files live at ./themes/<scene>/<id>.ts'])).toEqual([
      './themes/stray.ts: theme files live at ./themes/<scene>/<id>.ts',
    ]);
  });
});
