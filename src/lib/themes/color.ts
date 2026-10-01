/**
 * Minimal, dependency-free color tooling for the token contract test and the
 * docs site's token explorer. Not part of the published API.
 *
 * Supports exactly what the contract allows in themes: `#rgb[a]` / `#rrggbb[aa]`,
 * `light-dark(<color>, <color>)` and `var(--token)` indirection.
 */

export type Scheme = 'light' | 'dark';
type RGBA = [number, number, number, number];

/** Splits `a; b; c` respecting quotes and parentheses (data URIs contain `;`). */
function splitTopLevel(input: string, separator: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let buf = '';
  for (const ch of input) {
    if (quote) {
      if (ch === quote) quote = null;
      buf += ch;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(') depth += 1;
    else if (ch === ')') depth -= 1;
    if (ch === separator && depth === 0) {
      parts.push(buf);
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf.trim()) parts.push(buf);
  return parts;
}

/** Extracts the custom properties declared in `[data-theme="<theme>"] { … }` blocks. */
export function parseThemeTokens(css: string, theme: string): Map<string, string> {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens = new Map<string, string>();
  const opener = new RegExp(`\\[data-theme=(["'])${theme}\\1\\]\\s*\\{`, 'g');
  for (const match of src.matchAll(opener)) {
    let i = (match.index ?? 0) + match[0].length;
    let depth = 1;
    const start = i;
    let quote: string | null = null;
    for (; i < src.length && depth > 0; i += 1) {
      const ch = src[i];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '{') depth += 1;
      else if (ch === '}') depth -= 1;
    }
    const body = src.slice(start, i - 1);
    for (const decl of splitTopLevel(body, ';')) {
      const idx = decl.indexOf(':');
      if (idx === -1) continue;
      const name = decl.slice(0, idx).trim();
      if (!name.startsWith('--')) continue;
      tokens.set(name, decl.slice(idx + 1).trim().replace(/\s+/g, ' '));
    }
  }
  return tokens;
}

const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function resolveValue(tokens: Map<string, string>, value: string, scheme: Scheme, seen: Set<string>): string {
  const v = value.trim();
  const ref = v.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (ref) {
    const name = ref[1];
    if (seen.has(name)) throw new Error(`circular reference through ${name}`);
    const next = tokens.get(name);
    if (next === undefined) throw new Error(`${name} is not declared`);
    return resolveValue(tokens, next, scheme, new Set([...seen, name]));
  }
  const ld = v.match(/^light-dark\((.*)\)$/i);
  if (ld) {
    const args = splitTopLevel(ld[1], ',');
    if (args.length !== 2) throw new Error(`light-dark() needs two arguments: ${v}`);
    return resolveValue(tokens, args[scheme === 'light' ? 0 : 1], scheme, seen);
  }
  if (HEX.test(v)) return v.toLowerCase();
  throw new Error(`not a #hex, light-dark() or var() color: ${v}`);
}

/** Resolves a solid color token to a hex string for the given scheme. */
export function resolveColor(tokens: Map<string, string>, name: string, scheme: Scheme): string {
  const value = tokens.get(name);
  if (value === undefined) throw new Error(`${name} is not declared`);
  return resolveValue(tokens, value, scheme, new Set([name]));
}

/**
 * Every color a background token can paint: the color itself, or each stop
 * of a gradient. Throws when a stop isn't a contract-legal color.
 */
export function resolveStops(tokens: Map<string, string>, name: string, scheme: Scheme): string[] {
  const value = tokens.get(name);
  if (value === undefined) throw new Error(`${name} is not declared`);
  try {
    return [resolveValue(tokens, value, scheme, new Set([name]))];
  } catch {
    // Not a single color: collect gradient stops.
  }
  const stops: string[] = [];
  const colorLike = /light-dark\([^()]*(?:\([^()]*\)[^()]*)*\)|var\(\s*--[\w-]+\s*\)|#[0-9a-f]{3,8}\b/gi;
  for (const m of value.matchAll(colorLike)) {
    stops.push(resolveValue(tokens, m[0], scheme, new Set([name])));
  }
  if (stops.length === 0) throw new Error(`${name} has no resolvable colors: ${value}`);
  return stops;
}

function toRGBA(hex: string): RGBA {
  let h = hex.slice(1);
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
  return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
}

function over(top: RGBA, bottom: RGBA): RGBA {
  const a = top[3] + bottom[3] * (1 - top[3]);
  const mix = (i: number) => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / a;
  return [mix(0), mix(1), mix(2), a];
}

function luminance([r, g, b]: RGBA): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * WCAG 2.x contrast ratio. Translucent colors are composited: `bg` over
 * `page`, then `fg` over the result.
 */
export function contrastRatio(fg: string, bg: string, page = '#ffffff'): number {
  const base = over(toRGBA(bg), toRGBA(page));
  const front = over(toRGBA(fg), base);
  const [l1, l2] = [luminance(front), luminance(base)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}
