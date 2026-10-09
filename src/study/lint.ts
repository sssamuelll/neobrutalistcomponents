/**
 * Lint for family and signature CSS (spec D3/D4): colors only from tokens,
 * control geometry untouched, flat rules, scoping left to the compiler.
 */
import { animationUses, keyframeRules, nestedKeyframeNames, splitOutside, stripComments, styleRules } from './css';
import type { Declaration } from './css';

export const SIGNATURE_MAX_LINES = 60;

/** CSS Color 4 named colors. `transparent`, `currentColor` and `inherit` are allowed and not listed. */
const NAMED_COLORS = [
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue',
  'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk',
  'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki',
  'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue',
  'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
  'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod',
  'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender',
  'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow',
  'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
  'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon',
  'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue',
  'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin',
  'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen',
  'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple',
  'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell',
  'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal',
  'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen',
];
const NAMED = new RegExp(`(?<![\\w-])(?:${NAMED_COLORS.join('|')})(?![\\w-])`, 'i');
const HEX = /#[0-9a-f]{3,8}\b/i;
const COLOR_FN = /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const GEOMETRY = new Set([
  'height', 'min-height', 'max-height', 'block-size', 'min-block-size', 'max-block-size', 'font', 'font-size', 'line-height',
  'zoom', 'box-sizing', 'all',
]);
const IMAGE = /(?<![\w-])(?:url|image-set|-webkit-image-set|image|cross-fade|element)\(/i;
const isGeometry = (property: string) => GEOMETRY.has(property) || property === 'padding' || property.startsWith('padding-');
const PSEUDO = /::(?:before|after)$/;

/** Quoted strings (content: "Black") are text, not colors. */
const withoutStrings = (value: string) => value.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, "''");

/** Drops each var()'s custom-property name but keeps its fallback, so a fallback color is still caught. */
const withoutVarNames = (value: string) => value.replace(/var\(\s*--[\w-]+\s*/g, 'var(');

/** Color syntax the contract tool cannot resolve: named colors and color functions (rgb(), oklch()…). Hex is resolvable. */
export function hasUnresolvableColor(value: string): boolean {
  const bare = withoutVarNames(withoutStrings(value));
  return COLOR_FN.test(bare) || NAMED.test(bare);
}

/** url(), image-set() and the other image functions. */
export function hasImage(value: string): boolean {
  return IMAGE.test(value);
}

function declarationProblems(where: string, selector: string, declarations: readonly Declaration[], allowGeometry: boolean): string[] {
  const problems: string[] = [];
  for (const { property, value } of declarations) {
    if (property.startsWith('--') && !property.startsWith('--fx-')) {
      problems.push(`${where}: "${selector}" declares ${property} — only --fx-* custom properties; theme tokens come from the theme's data`);
    }
    if (isGeometry(property) && !allowGeometry) {
      problems.push(`${where}: "${selector}" sets ${property} — control geometry is invariant (allowed only in ::before/::after)`);
    }
    if (hasImage(value)) {
      problems.push(`${where}: "${selector}" ${property}: ${value} — no images (url(), image-set()); textures are gradients of tokens`);
    }
    if (HEX.test(withoutVarNames(withoutStrings(value))) || hasUnresolvableColor(value)) {
      problems.push(`${where}: "${selector}" ${property}: ${value} — literal color; use var(--nbc-*) tokens`);
    }
  }
  return problems;
}

export function lintFlourishCss(css: string, where: string): string[] {
  const problems: string[] = [];
  const clean = stripComments(css);
  if (/@(?:layer|import|scope)\b/.test(clean)) {
    problems.push(`${where}: @layer, @import and @scope are added by the compiler — remove them`);
  }
  if (/\[data-theme/.test(clean)) problems.push(`${where}: no [data-theme] selectors — the compiler scopes the file to its theme`);
  if (/url\(\s*["']?data:/i.test(clean)) problems.push(`${where}: no data: URIs`);
  let rules;
  let frames;
  try {
    rules = styleRules(clean);
    frames = keyframeRules(clean);
  } catch (error) {
    return [...problems, `${where}: ${(error as Error).message}`];
  }
  for (const rule of rules) {
    if (rule.nested) {
      problems.push(`${where}: "${rule.selector}" uses CSS nesting — write flat rules`);
      continue;
    }
    const onlyPseudo = rule.selector.split(',').every((s) => PSEUDO.test(s.trim()));
    problems.push(...declarationProblems(where, rule.selector, rule.declarations, onlyPseudo));
  }
  for (const frame of frames) {
    problems.push(...declarationProblems(where, `@keyframes ${frame.name} ${frame.selector}`, frame.declarations, false));
  }
  return problems;
}

export function signatureLines(css: string): number {
  return stripComments(css).split('\n').filter((line) => line.trim()).length;
}

/** Signatures carry no animation (families are repo code, reviewed in the repo): motion lives in the motion file, where the lint can hold it. */
export function lintNoMotion(css: string, where: string): string[] {
  const problems: string[] = [];
  for (const use of animationUses(css)) {
    if (use.property.includes('animation') && use.value.trim() !== 'none') {
      problems.push(`${where}: "${use.selector}" sets ${use.property} — motion belongs in the motion file`);
    }
  }
  if (/@keyframes/.test(stripComments(css))) problems.push(`${where}: @keyframes — motion belongs in the motion file`);
  return problems;
}

export function lintSignature(css: string, where: string): string[] {
  const problems = [...lintFlourishCss(css, where), ...lintNoMotion(css, where)];
  const lines = signatureLines(css);
  if (lines > SIGNATURE_MAX_LINES) problems.push(`${where}: ${lines} lines, the limit is ${SIGNATURE_MAX_LINES}`);
  return problems;
}

export const MOTION_MAX_LINES = 40;

/** What a motion file may animate or transition. */
const ANIMATABLE = ['transform', 'opacity', 'clip-path', 'background-position', 'outline'];
const FRAME_PROPERTIES = [...ANIMATABLE, 'animation-timing-function'];
const TRANSITIONABLE = [...ANIMATABLE, 'none'];

/** `animation: none` and `animation-name: none` stop an animation; they need no guard. */
const isRealAnimation = ({ value }: { value: string }) => value.trim() !== 'none';

/** A motion file animates when it sets at least one animation other than none. */
export const animates = (css: string): boolean => animationUses(css).some(isRealAnimation);

/** Only loading indicators may loop forever: other auto-playing motion longer than five seconds needs a pause control (WCAG 2.2.2). */
const LOADERS = ['.nbc-progress--indeterminate', '.nbc-button--loading', '.nbc-button__spinner'];

/** True when every selector of the list names a loader outside :not(). */
const onlyLoaders = (selector: string) =>
  splitOutside(selector, ',').every((part) => {
    const bare = part.replace(/:not\([^)]*\)/gi, '');
    return LOADERS.some((loader) => bare.includes(loader));
  });

/**
 * Seconds an animation or transition value runs, in total: duration × count per
 * layer, the longest layer wins. Infinity when it loops or hides its count in var().
 * ponytail: delays and a count set in a separate longhand are not added up; the
 * reviewer of each motion file reads those.
 */
function runSeconds(property: string, value: string): number {
  if (/var\(/i.test(value)) return Infinity;
  let longest = 0;
  for (const layer of splitOutside(value, ',')) {
    const tokens = layer.trim().toLowerCase().split(/\s+/);
    if (tokens.includes('infinite')) return Infinity;
    if (property.endsWith('iteration-count')) continue;
    const times = tokens.filter((t) => /^\d*\.?\d+m?s$/.test(t)).map((t) => (t.endsWith('ms') ? parseFloat(t) / 1000 : parseFloat(t)));
    const count = tokens.map(Number).find((n) => Number.isFinite(n)) ?? 1;
    longest = Math.max(longest, (times[0] ?? 0) * count);
  }
  return longest;
}

export function lintMotion(css: string, where: string): string[] {
  const problems = lintFlourishCss(css, where);
  const lines = signatureLines(css);
  if (lines > MOTION_MAX_LINES) problems.push(`${where}: ${lines} lines, the limit is ${MOTION_MAX_LINES}`);
  for (const use of animationUses(css).filter(isRealAnimation)) {
    if (!use.guarded) {
      problems.push(`${where}: "${use.selector}" sets ${use.property} outside @media (prefers-reduced-motion: no-preference)`);
    }
    const seconds = runSeconds(use.property, use.value);
    if (seconds > 5 && !onlyLoaders(use.selector)) {
      problems.push(
        seconds === Infinity
          ? `${where}: "${use.selector}" loops forever — only loading indicators may (WCAG 2.2.2); give it a count`
          : `${where}: "${use.selector}" runs ${seconds}s, longer than five seconds — only loading indicators may (WCAG 2.2.2)`,
      );
    }
  }
  for (const name of nestedKeyframeNames(css)) {
    problems.push(`${where}: @keyframes ${name} must be at the top level — the compiler namespaces only top-level keyframes`);
  }
  for (const frame of keyframeRules(css)) {
    for (const { property } of frame.declarations) {
      if (!FRAME_PROPERTIES.includes(property)) {
        problems.push(`${where}: @keyframes ${frame.name} animates ${property} — only ${ANIMATABLE.join(', ')}`);
      }
    }
  }
  for (const rule of styleRules(css)) {
    for (const { property, value } of rule.declarations) {
      if (!/^(-webkit-)?transition(-property)?$/.test(property)) continue;
      const names = splitOutside(value, ',').map((part) => part.trim().split(/\s+/)[0]);
      for (const name of names.filter((n) => !TRANSITIONABLE.includes(n))) {
        problems.push(`${where}: "${rule.selector}" transition names ${name} — only ${ANIMATABLE.join(', ')}`);
      }
    }
  }
  return problems;
}
