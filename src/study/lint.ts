/**
 * Lint for family and signature CSS (spec D3/D4): colors only from tokens,
 * control geometry untouched, flat rules, scoping left to the compiler.
 */
import { stripComments, styleRules } from './css';

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
]);
const isGeometry = (property: string) => GEOMETRY.has(property) || property === 'padding' || property.startsWith('padding-');
const PSEUDO = /::(?:before|after)$/;

/** Drops var(…) references (innermost first) so their names can't look like colors. */
function withoutVars(value: string): string {
  let current = value;
  let previous;
  do {
    previous = current;
    current = current.replace(/var\([^()]*\)/g, '');
  } while (current !== previous);
  return current;
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
  try {
    rules = styleRules(clean);
  } catch (error) {
    return [...problems, `${where}: ${(error as Error).message}`];
  }
  for (const rule of rules) {
    if (rule.nested) {
      problems.push(`${where}: "${rule.selector}" uses CSS nesting — write flat rules`);
      continue;
    }
    const onlyPseudo = rule.selector.split(',').every((s) => PSEUDO.test(s.trim()));
    for (const { property, value } of rule.declarations) {
      if (isGeometry(property) && !onlyPseudo) {
        problems.push(`${where}: "${rule.selector}" sets ${property} — control geometry is invariant (allowed only in ::before/::after)`);
      }
      const bare = withoutVars(value);
      if (HEX.test(bare) || COLOR_FN.test(bare) || NAMED.test(bare)) {
        problems.push(`${where}: "${rule.selector}" ${property}: ${value} — literal color; use var(--nbc-*) tokens`);
      }
    }
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
