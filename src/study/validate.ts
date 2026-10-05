/**
 * Mechanical checks of a study theme and of the core fichas (spec D1, D7, D8).
 * Every function returns a list of problems; empty means valid.
 */
import { NEO_THEMES } from '../lib/themes';
import { FONTS } from './fonts';
import { IMAGE_LICENSES, LANGS, PALETTE_ORIGINS, REFERENCE_KINDS, SCENES, SHADOW_KINDS, THEME_SCENES } from './types';
import type { CoreFicha, Ficha, L10n, Reference, StudyThemeInput } from './types';

export const ID_PATTERN = /^[a-z][a-z0-9-]{1,31}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const BCP47 = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

function l10nProblems(value: L10n | undefined, where: string): string[] {
  if (!value) return [`${where}: missing`];
  return LANGS.filter((lang) => !value[lang]?.trim()).map((lang) => `${where}.${lang}: empty`);
}

/** Source markers ([1], [2]…) in a text. */
export function markers(text: string): number[] {
  return [...text.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1]));
}

export function referenceProblems(ref: Reference, where: string): string[] {
  const problems = [...l10nProblems(ref.title, `${where}.title`), ...l10nProblems(ref.place, `${where}.place`)];
  if (ref.original && (!ref.original.text.trim() || !BCP47.test(ref.original.lang))) {
    problems.push(`${where}.original: needs text and a BCP 47 lang`);
  }
  if (!REFERENCE_KINDS.includes(ref.kind)) problems.push(`${where}.kind: unknown "${ref.kind}"`);
  const [from, to] = typeof ref.date === 'number' ? [ref.date, ref.date] : ref.date;
  if (!(Number.isInteger(from) && Number.isInteger(to) && from >= 1800 && to <= 2100 && from <= to)) {
    problems.push(`${where}.date: ${JSON.stringify(ref.date)} is not a year or an ordered range`);
  }
  if (ref.sources.length < 2) problems.push(`${where}.sources: needs at least 2, has ${ref.sources.length}`);
  let independent = 0;
  ref.sources.forEach((source, i) => {
    const at = `${where}.sources[${i + 1}]`;
    try {
      const url = new URL(source.url);
      if (url.protocol !== 'https:') problems.push(`${at}: not https`);
      if (!url.hostname.endsWith('wikipedia.org')) independent += 1;
    } catch {
      problems.push(`${at}: invalid URL ${source.url}`);
    }
    if (!source.title.trim()) problems.push(`${at}: empty title`);
    if (!ISO_DATE.test(source.accessed)) problems.push(`${at}: accessed must be YYYY-MM-DD`);
  });
  if (ref.sources.length >= 2 && independent === 0) {
    problems.push(`${where}.sources: at least one source must not be on wikipedia.org`);
  }
  if (ref.image) {
    const image = ref.image;
    if (!IMAGE_LICENSES.includes(image.license)) problems.push(`${where}.image: license "${image.license}" is not allowed`);
    if (!image.author.trim()) problems.push(`${where}.image: empty author`);
    if (!image.sourceUrl.startsWith('https://commons.wikimedia.org/wiki/File:')) {
      problems.push(`${where}.image: sourceUrl must be a Commons file page`);
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*\.avif$/.test(image.file)) problems.push(`${where}.image: file must be a kebab-case .avif name`);
    if (!(image.width > 0 && image.width <= 1600 && image.height > 0)) problems.push(`${where}.image: bad dimensions`);
    problems.push(...l10nProblems(image.alt, `${where}.image.alt`));
  }
  if (ref.archiveUrl && !ref.archiveUrl.startsWith('https://web.archive.org/')) {
    problems.push(`${where}.archiveUrl: must be a web.archive.org link`);
  }
  return problems;
}

export function fichaProblems(ficha: Ficha, sourceCount: number, where: string): string[] {
  const problems = [
    ...l10nProblems(ficha.documented, `${where}.documented`),
    ...l10nProblems(ficha.reading, `${where}.reading`),
    ...l10nProblems(ficha.palette?.note, `${where}.palette.note`),
  ];
  if (!(PALETTE_ORIGINS as readonly string[]).includes(String(ficha.palette?.origin))) problems.push(`${where}.palette.origin: unknown`);
  if (problems.length) return problems;
  const cited = LANGS.map((lang) => new Set([...markers(ficha.documented[lang]), ...markers(ficha.reading[lang])]));
  LANGS.forEach((lang, i) => {
    for (const n of cited[i]) if (n < 1 || n > sourceCount) problems.push(`${where} (${lang}): marker [${n}] has no source`);
  });
  const [es, en] = cited.map((set) => [...set].sort((a, b) => a - b));
  if (es.join() !== en.join()) problems.push(`${where}: markers differ between es [${es}] and en [${en}]`);
  for (let n = 1; n <= sourceCount; n += 1) if (!cited[0].has(n)) problems.push(`${where}: source [${n}] is never cited`);
  if (markers(ficha.documented.es).length === 0) problems.push(`${where}.documented: cites no source`);
  return problems;
}

const SPACING = /^(normal|0|-?(\d+(\.\d+)?|\.\d+)(em|rem|px))$/;
const STRETCH = /^\d+(\.\d+)?%$/;
const EASE =
  /^(linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end|cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)|steps\(\s*\d+\s*(,\s*(jump-start|jump-end|jump-none|jump-both|start|end)\s*)?\))$/;
const TRANSFORMS = ['none', 'uppercase', 'lowercase'];
const BORDER_STYLES = ['solid', 'dashed', 'double'];

/** A value written verbatim into the stylesheet: no declaration or block breakers, balanced parentheses. */
function isSingleValue(value: string): boolean {
  if (/[;{}]/.test(value)) return false;
  let depth = 0;
  for (const ch of value) {
    if (ch === '(') depth += 1;
    else if (ch === ')' && --depth < 0) return false;
  }
  return depth === 0;
}

/** Every number and string the compiler writes into the CSS, checked for range and shape. */
function valueProblems(theme: StudyThemeInput): string[] {
  const { id, type, shape, elevation, focus, motion, fills } = theme;
  const problems: string[] = [];
  const number = (value: number, where: string, min: number, max: number, integer = false) => {
    if (!(Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isInteger(value)))) {
      problems.push(`${id}.${where}: ${value} must be ${integer ? 'an integer' : 'a number'} within ${min}..${max}`);
    }
  };
  number(type.weightBody, 'type.weightBody', 1, 1000, true);
  number(type.weightLabel, 'type.weightLabel', 1, 1000, true);
  number(type.weightDisplay, 'type.weightDisplay', 1, 1000, true);
  for (const key of ['labelSpacing', 'displaySpacing'] as const) {
    const value = type[key];
    if (value !== undefined && !SPACING.test(value)) problems.push(`${id}.type.${key}: "${value}" must be normal, 0 or a length in em, rem or px`);
  }
  for (const key of ['labelTransform', 'displayTransform'] as const) {
    const value = type[key];
    if (value !== undefined && !TRANSFORMS.includes(value)) problems.push(`${id}.type.${key}: "${value}" must be one of ${TRANSFORMS.join(', ')}`);
  }
  if (type.displayStretch !== undefined && !STRETCH.test(type.displayStretch)) {
    problems.push(`${id}.type.displayStretch: "${type.displayStretch}" must be a percentage`);
  }
  number(shape.borderWidth, 'shape.borderWidth', 0, 12, true);
  for (const key of ['radius', 'radiusControl', 'radiusButton', 'radiusSmall'] as const) number(shape[key], `shape.${key}`, 0, 999, true);
  if (shape.borderStyle !== undefined && !BORDER_STYLES.includes(shape.borderStyle)) {
    problems.push(`${id}.shape.borderStyle: "${shape.borderStyle}" must be one of ${BORDER_STYLES.join(', ')}`);
  }
  if (!(SHADOW_KINDS as readonly string[]).includes(elevation.kind)) problems.push(`${id}.elevation.kind: unknown "${elevation.kind}"`);
  for (const key of ['shadow', 'shadowLg', 'shadowPress'] as const) {
    if (!isSingleValue(elevation[key])) problems.push(`${id}.elevation.${key}: "${elevation[key]}" is not a single CSS value`);
  }
  number(elevation.press, 'elevation.press', 0, 24);
  number(elevation.pressActive, 'elevation.pressActive', 0, 24);
  if (elevation.rotate !== undefined) number(elevation.rotate, 'elevation.rotate', -15, 15);
  if (focus) {
    number(focus.width, 'focus.width', 1, 8);
    number(focus.offset, 'focus.offset', 0, 8);
  }
  if (motion) {
    number(motion.duration, 'motion.duration', 0, 5000);
    number(motion.durationSlow, 'motion.durationSlow', 0, 5000);
    if (!EASE.test(motion.ease)) problems.push(`${id}.motion.ease: "${motion.ease}" must be an easing keyword, cubic-bezier() or steps()`);
  }
  for (const key of ['primary', 'danger', 'surface'] as const) {
    const fill = fills?.[key];
    if (fill !== undefined && !isSingleValue(fill)) problems.push(`${id}.fills.${key}: "${fill}" is not a single CSS value`);
  }
  return problems;
}

export function themeProblems(theme: StudyThemeInput): string[] {
  const { id } = theme;
  const problems: string[] = [];
  if (!ID_PATTERN.test(id)) problems.push(`${id}: id must match ${ID_PATTERN}`);
  if ((NEO_THEMES as readonly string[]).includes(id)) problems.push(`${id}: collides with a core theme id`);
  if (!(THEME_SCENES as readonly string[]).includes(theme.scene)) {
    problems.push(`${id}: scene must be one of ${THEME_SCENES.join(', ')}`);
  }
  problems.push(...l10nProblems(theme.name, `${id}.name`), ...l10nProblems(theme.tagline, `${id}.tagline`));
  problems.push(...referenceProblems(theme.reference, `${id}.reference`));
  problems.push(...fichaProblems(theme.ficha, theme.reference.sources.length, `${id}.ficha`));
  if (typeof theme.fonts !== 'string') {
    for (const key of [theme.fonts.sans, theme.fonts.display, theme.fonts.mono]) {
      if (key !== undefined && !(key in FONTS)) problems.push(`${id}: unknown font "${key}"`);
    }
  }
  problems.push(...valueProblems(theme));
  return problems;
}

export function coreFichaProblems(id: string, core: CoreFicha): string[] {
  const problems = [
    ...l10nProblems(core.tagline, `${id}.tagline`),
    ...referenceProblems(core.reference, `${id}.reference`),
    ...fichaProblems(core.ficha, core.reference.sources.length, `${id}.ficha`),
  ];
  if (!(SCENES as readonly string[]).includes(core.scene)) problems.push(`${id}: unknown scene "${core.scene}"`);
  if (core.predatesStudy !== true) problems.push(`${id}: core fichas must set predatesStudy: true`);
  return problems;
}
