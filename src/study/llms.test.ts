import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATALOG } from './.generated/catalog';

// The committed agent docs (CI regenerates them and fails on any diff).
const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const llms = read('public/llms.txt');
const full = read('public/llms-full.txt');
const skill = read('skills/neobrutalist-ui/SKILL.md');
const study = CATALOG.filter((entry) => !entry.predatesStudy);

describe('agent docs carry the study catalog', () => {
  it('llms.txt links every study theme page with its reference, in the language-prefixed routes', () => {
    for (const entry of study) {
      expect(llms).toContain(`/#/en/theme/${entry.id})`);
      // Without its closing parenthesis: a title's parenthesis may enclose its original title too.
      expect(llms).toContain(entry.reference.title.en.replace(/\)$/, ''));
    }
    expect(llms).toContain('/#/en/components/button)');
    expect(llms).not.toMatch(/\/#\/(?!en\/)/);
  });

  it('llms-full.txt lists every study theme with its scene, scheme and stylesheets', () => {
    for (const entry of study) expect(full).toContain(`| \`${entry.id}\` |`);
    expect(full).toContain('`themes/nakagin.css`, `themes/nakagin.fonts.css`');
    expect(full).toContain("import { STUDY_CATALOG } from 'neobrutalistcomponents/study'");
  });

  it('the skill gains a generated table of the study themes', () => {
    const section = skill.slice(skill.indexOf('<!-- study-themes:start -->'), skill.indexOf('<!-- study-themes:end -->'));
    for (const entry of study) expect(section).toContain(`| \`${entry.id}\` |`);
  });

  it('names a reference with its original title, never in a second parenthesis', () => {
    for (const [name, text] of [['llms.txt', llms], ['llms-full.txt', full], ['SKILL.md', skill]]) {
      expect(text, name).not.toMatch(/\) \(/);
      // A title that already ends in a parenthesis takes the original inside it.
      expect(text, name).toContain(
        'Mäusebunker (former Central Animal Laboratories of the Free University of Berlin; Zentrale Tierlaboratorien der Freien Universität Berlin)',
      );
      expect(text, name).toContain('Nakagin Capsule Tower (中銀カプセルタワービル)');
    }
  });
});
