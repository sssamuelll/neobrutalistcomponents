import { describe, expect, it } from 'vitest';
import { CONTRAST_PAIRS } from '../lib/themes/contract';
import { LANGS, REFERENCE_KINDS, SCENES, SHADOW_KINDS } from '../study/types';
import type { L10n } from '../study/types';
import {
  BORDER_TEXT,
  CORNER_TEXT,
  KIND_TEXT,
  PAIR_TEXT,
  PALETTE_TEXT,
  SCENE_TEXT,
  SCHEME_TEXT,
  SHADOW_TEXT,
  UI,
  decadeLabel,
  themeCount,
} from './i18n';

const entries = (record: Record<string, L10n>, prefix: string) => Object.entries(record).map(([k, v]) => [`${prefix}.${k}`, v] as const);

describe('site dictionary', () => {
  it('has every string in both languages', () => {
    const all = [
      ...entries(UI, 'UI'),
      ...Object.entries(SCENE_TEXT).flatMap(([k, v]) => [[`scene.${k}.name`, v.name] as const, [`scene.${k}.summary`, v.summary] as const]),
      ...entries(KIND_TEXT, 'kind'),
      ...entries(SCHEME_TEXT, 'scheme'),
      ...entries(BORDER_TEXT, 'border'),
      ...entries(SHADOW_TEXT, 'shadow'),
      ...entries(CORNER_TEXT, 'corners'),
      ...entries(PALETTE_TEXT, 'palette'),
      ...entries(PAIR_TEXT, 'pair'),
    ];
    const empty = all.flatMap(([where, value]) => LANGS.filter((lang) => !value[lang]?.trim()).map((lang) => `${where}.${lang}`));
    expect(empty).toEqual([]);
  });

  it('covers every scene, kind, shadow and contrast pair', () => {
    expect(Object.keys(SCENE_TEXT).sort()).toEqual([...SCENES].sort());
    expect(Object.keys(KIND_TEXT).sort()).toEqual([...REFERENCE_KINDS].sort());
    expect(Object.keys(SHADOW_TEXT).sort()).toEqual([...SHADOW_KINDS].sort());
    expect(CONTRAST_PAIRS.map((p) => `${p.fg} ${p.bg}`).filter((key) => !PAIR_TEXT[key])).toEqual([]);
    expect(CONTRAST_PAIRS.map((p) => PAIR_TEXT[`${p.fg} ${p.bg}`].en)).toEqual(CONTRAST_PAIRS.map((p) => p.why));
  });

  it('counts and names decades in both languages', () => {
    expect([themeCount('es', 1), themeCount('es', 9), themeCount('en', 1), themeCount('en', 9)]).toEqual(['1 tema', '9 temas', '1 theme', '9 themes']);
    expect([decadeLabel('es', 1970), decadeLabel('en', 1990)]).toEqual(['Años 70', '1990s']);
  });
});
