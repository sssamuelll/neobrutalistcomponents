/**
 * Mechanical checks of a study theme and of the core fichas (spec D1, D7, D8).
 * Every function returns a list of problems; empty means valid.
 */
import { NEO_THEMES } from '../lib/themes';
import { FONTS } from './fonts';
import type { FontKey } from './fonts';
import { hasImage, hasUnresolvableColor } from './lint';
import { IMAGE_LICENSES, LANGS, LETTERING_KINDS, PALETTE_ORIGINS, REFERENCE_KINDS, SCENES, SHADOW_KINDS, THEME_SCENES } from './types';
import type { CoreFicha, Ficha, L10n, Lettering, MotionFicha, Reference, Source, StudyThemeInput } from './types';

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

/** Checks every source (https, title, ISO access date) and that at least one is not on wikipedia.org. */
export function sourceProblems(sources: readonly Source[], where: string): string[] {
  const problems: string[] = [];
  let independent = 0;
  sources.forEach((source, i) => {
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
  if (sources.length > 0 && independent === 0) {
    problems.push(`${where}.sources: at least one source must not be on wikipedia.org`);
  }
  return problems;
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
  problems.push(...sourceProblems(ref.sources, where));
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

/**
 * Themes that predate the lettering requirement. Phase 2 of the lettering and
 * motion spec removes each id as it writes that theme's lettering; the list
 * never grows, and new themes are never in it.
 */
export const LETTERING_PENDING: readonly string[] = [
  'amiga-os', 'aqua', 'classifieds', 'iphone-os', 'mac-os-classic',
  'material-design', 'nextstep', 'whaam', 'win-xp', 'win95', 'xerox-star',
];

function letteringProblems(lettering: Lettering | undefined, where: string): string[] {
  if (!lettering) return [];
  const { original } = lettering;
  const at = `${where}.lettering`;
  const problems = l10nProblems(lettering.substitute, `${at}.substitute`);
  if (!(LETTERING_KINDS as readonly string[]).includes(original.kind)) problems.push(`${at}.original.kind: unknown "${original.kind}"`);
  if (original.kind === 'none') {
    if (lettering.documented) problems.push(`${at}.documented: a work with no documented lettering has nothing to document — drop it`);
    return problems;
  }
  problems.push(...l10nProblems(lettering.documented, `${at}.documented`));
  if (typeof original.name === 'string') {
    if (!original.name.trim()) problems.push(`${at}.original.name: empty`);
  } else {
    problems.push(...l10nProblems(original.name, `${at}.original.name`));
  }
  if (original.year !== undefined && !(Number.isInteger(original.year) && original.year >= 1400 && original.year <= 2100)) {
    problems.push(`${at}.original.year: ${original.year} is not a year`);
  }
  return problems;
}

function motionProblems(motion: MotionFicha | undefined, where: string): string[] {
  if (!motion) return [];
  return [...l10nProblems(motion.documented, `${where}.motion.documented`), ...l10nProblems(motion.reading, `${where}.motion.reading`)];
}

/** Every prose block of a ficha, for the marker checks. */
function prose(ficha: Ficha): L10n[] {
  return [
    ficha.documented,
    ficha.reading,
    ...(ficha.lettering ? [ficha.lettering.documented, ficha.lettering.substitute].filter((block): block is L10n => block !== undefined) : []),
    ...(ficha.motion ? [ficha.motion.documented, ficha.motion.reading] : []),
  ];
}

export function fichaProblems(ficha: Ficha, sourceCount: number, where: string): string[] {
  const problems = [
    ...l10nProblems(ficha.documented, `${where}.documented`),
    ...l10nProblems(ficha.reading, `${where}.reading`),
    ...l10nProblems(ficha.palette?.note, `${where}.palette.note`),
    ...letteringProblems(ficha.lettering, where),
    ...motionProblems(ficha.motion, where),
  ];
  if (!(PALETTE_ORIGINS as readonly string[]).includes(String(ficha.palette?.origin))) problems.push(`${where}.palette.origin: unknown`);
  if (problems.length) return problems;
  const cited = LANGS.map((lang) => new Set(prose(ficha).flatMap((block) => markers(block[lang]))));
  LANGS.forEach((lang, i) => {
    for (const n of cited[i]) if (n < 1 || n > sourceCount) problems.push(`${where} (${lang}): marker [${n}] has no source`);
  });
  const [es, en] = cited.map((set) => [...set].sort((a, b) => a - b));
  if (es.join() !== en.join()) problems.push(`${where}: markers differ between es [${es}] and en [${en}]`);
  for (let n = 1; n <= sourceCount; n += 1) if (!cited[0].has(n)) problems.push(`${where}: source [${n}] is never cited`);
  if (markers(ficha.documented.es).length === 0) problems.push(`${where}.documented: cites no source`);
  const claims: [string, L10n | undefined][] = [['lettering.documented', ficha.lettering?.documented], ['motion.documented', ficha.motion?.documented]];
  for (const [name, block] of claims) {
    if (!block) continue;
    const [es, en] = LANGS.map((lang) => [...new Set(markers(block[lang]))].sort((a, b) => a - b));
    if (es.length === 0) problems.push(`${where}.${name}: cites no source`);
    else if (es.join() !== en.join()) problems.push(`${where}.${name}: markers differ between es [${es}] and en [${en}]`);
  }
  return problems;
}

const SPACING = /^(normal|0|-?(\d+(\.\d+)?|\.\d+)(em|rem|px))$/;
const STRETCH = /^\d+(\.\d+)?%$/;
const FEATURES = /^(normal|"[A-Za-z0-9]{4}"(\s+\d+)?(\s*,\s*"[A-Za-z0-9]{4}"(\s+\d+)?)*)$/;
const KERNINGS = ['auto', 'normal', 'none'];
const RENDERINGS = ['auto', 'optimizeSpeed', 'optimizeLegibility', 'geometricPrecision'];
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
  if (type.featureSettings !== undefined && !FEATURES.test(type.featureSettings)) {
    problems.push(`${id}.type.featureSettings: "${type.featureSettings}" must be normal or OpenType tags in quotes, like "tnum", "ss01" 1`);
  }
  if (type.kerning !== undefined && !KERNINGS.includes(type.kerning)) {
    problems.push(`${id}.type.kerning: "${type.kerning}" must be one of ${KERNINGS.join(', ')}`);
  }
  if (type.textRendering !== undefined && !RENDERINGS.includes(type.textRendering)) {
    problems.push(`${id}.type.textRendering: "${type.textRendering}" must be one of ${RENDERINGS.join(', ')}`);
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
    if (fill === undefined) continue;
    if (!isSingleValue(fill)) problems.push(`${id}.fills.${key}: "${fill}" is not a single CSS value`);
    if (hasImage(fill)) problems.push(`${id}.fills.${key}: "${fill}" — no images; a fill is a color or a gradient`);
    if (hasUnresolvableColor(fill)) {
      problems.push(`${id}.fills.${key}: "${fill}" — named colors and color functions are out: the contract cannot check them; use #hex, light-dark() or var()`);
    }
  }
  return problems;
}

function letteringThemeProblems(theme: StudyThemeInput): string[] {
  const { id, ficha, fonts } = theme;
  const pending = LETTERING_PENDING.includes(id);
  if (!ficha.lettering) return pending ? [] : [`${id}.ficha.lettering: missing`];
  const problems = pending ? [`${id}: has lettering — remove it from LETTERING_PENDING`] : [];
  if (typeof fonts === 'string') return problems;
  const { original, substitute } = ficha.lettering;
  const families = [fonts.sans, fonts.display].filter((key): key is FontKey => key !== undefined && key in FONTS).map((key) => FONTS[key].family);
  for (const lang of LANGS) {
    for (const family of families) {
      if (!substitute[lang]?.includes(family)) problems.push(`${id}.ficha.lettering.substitute.${lang}: does not name ${family}, the face the theme loads`);
    }
  }
  const names = original.kind === 'none' ? [] : typeof original.name === 'string' ? [original.name] : LANGS.map((lang) => (original.name as L10n)[lang]);
  if (original.kind !== 'none' && !original.free && families.some((family) => names.some((name) => family.toLowerCase() === name.trim().toLowerCase()))) {
    problems.push(`${id}.ficha.lettering: the substitute is the original face "${original.name}"`);
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
  problems.push(...letteringThemeProblems(theme));
  if (Boolean(theme.motionFile) !== Boolean(theme.ficha.motion)) {
    problems.push(`${id}: ${theme.ficha.motion ? 'ficha.motion has no motionFile' : 'motionFile has no ficha.motion'} — they go together`);
  }
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
