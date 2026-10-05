/**
 * Lint for family and signature CSS (spec D3/D4): colors only from tokens,
 * control geometry untouched, flat rules, scoping left to the compiler.
 */
import { keyframeRules, stripComments, styleRules } from './css';
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

function declarationProblems(where: string, selector: string, declarations: readonly Declaration[], allowGeometry: boolean): string[] {
  const problems: string[] = [];
  for (const { property, value } of declarations) {
    if (property.startsWith('--') && !property.startsWith('--fx-')) {
      problems.push(`${where}: "${selector}" declares ${property} — only --fx-* custom properties; theme tokens come from the theme's data`);
    }
    if (isGeometry(property) && !allowGeometry) {
      problems.push(`${where}: "${selector}" sets ${property} — control geometry is invariant (allowed only in ::before/::after)`);
    }
    if (IMAGE.test(value)) {
      problems.push(`${where}: "${selector}" ${property}: ${value} — no images (url(), image-set()); textures are gradients of tokens`);
    }
    const bare = withoutVarNames(withoutStrings(value));
    if (HEX.test(bare) || COLOR_FN.test(bare) || NAMED.test(bare)) {
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

export function lintSignature(css: string, where: string): string[] {
  const problems = lintFlourishCss(css, where);
  const lines = signatureLines(css);
  if (lines > SIGNATURE_MAX_LINES) problems.push(`${where}: ${lines} lines, the limit is ${SIGNATURE_MAX_LINES}`);
  return problems;
}
