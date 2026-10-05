/**
 * Minimal CSS reading for the study compiler and lint — enough for flat
 * family and signature files (style rules, conditional at-rules, keyframes).
 * Not a general parser.
 */
export const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

export interface Block {
  readonly prelude: string;
  readonly body: string;
}

export interface Declaration {
  readonly property: string;
  readonly value: string;
}

export interface StyleRule {
  readonly selector: string;
  readonly declarations: readonly Declaration[];
  /** The rule body contains blocks (CSS nesting). */
  readonly nested: boolean;
}

/** Top-level `prelude { body }` blocks of comment-free CSS. Throws on stray statements or unbalanced braces. */
export function topLevelBlocks(css: string): Block[] {
  const blocks: Block[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;
  let open = -1;
  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '{') {
      if (depth === 0) open = i;
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth < 0) throw new Error('unbalanced "}" in CSS');
      if (depth === 0) {
        blocks.push({ prelude: css.slice(start, open).trim(), body: css.slice(open + 1, i) });
        start = i + 1;
      }
    } else if (ch === ';' && depth === 0) {
      throw new Error(`unexpected top-level statement: ${css.slice(start, i + 1).trim()}`);
    }
  }
  if (depth !== 0) throw new Error('unbalanced "{" in CSS');
  const rest = css.slice(start).trim();
  if (rest) throw new Error(`CSS outside any block: ${rest.slice(0, 40)}`);
  return blocks;
}

/** Splits on `separator` outside quotes and parentheses. */
function splitOutside(input: string, separator: string): string[] {
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

export function parseDeclarations(body: string): Declaration[] {
  return splitOutside(body, ';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const idx = d.indexOf(':');
      if (idx === -1) throw new Error(`not a declaration: ${d}`);
      return { property: d.slice(0, idx).trim().toLowerCase(), value: d.slice(idx + 1).trim() };
    });
}

/** Every style rule, descending into conditional at-rules. Keyframes are skipped. */
export function styleRules(css: string): StyleRule[] {
  const rules: StyleRule[] = [];
  for (const block of topLevelBlocks(stripComments(css))) {
    if (/^@keyframes\b/.test(block.prelude)) continue;
    if (block.prelude.startsWith('@')) {
      rules.push(...styleRules(block.body));
      continue;
    }
    const nested = block.body.includes('{');
    rules.push({ selector: block.prelude, declarations: nested ? [] : parseDeclarations(block.body), nested });
  }
  return rules;
}

export interface KeyframeRule {
  readonly name: string;
  /** The frame selector: from, to, or a percentage. */
  readonly selector: string;
  readonly declarations: readonly Declaration[];
}

/** Every frame of every @keyframes block, descending into conditional at-rules. */
export function keyframeRules(css: string): KeyframeRule[] {
  const frames: KeyframeRule[] = [];
  for (const block of topLevelBlocks(stripComments(css))) {
    const keyframes = block.prelude.match(/^@keyframes\s+(["']?)([\w-]+)\1$/);
    if (keyframes) {
      for (const frame of topLevelBlocks(block.body)) {
        frames.push({ name: keyframes[2], selector: frame.prelude, declarations: parseDeclarations(frame.body) });
      }
    } else if (block.prelude.startsWith('@')) {
      frames.push(...keyframeRules(block.body));
    }
  }
  return frames;
}
