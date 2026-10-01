// Wraps theme flourish files in a donut @scope so a theme's personality never
// leaks into a nested provider island of a different theme:
//
//   @scope ([data-theme="tech"]) to ([data-theme]:not([data-theme="tech"])) { … }
//
// @keyframes stay at the top level (they are not allowed inside @scope).
// Idempotent: files that already contain @scope are left untouched.
//   node scripts/scope-flourishes.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const THEMES = join(resolve(dirname(fileURLToPath(import.meta.url)), '..'), 'src/lib/themes');
const SKIP = new Set(['index.css', 'tokens.css', 'fonts.css']);
// --skip=Alert,Table leaves those components' files alone (e.g. still being written).
const skipArg = process.argv.find((a) => a.startsWith('--skip='));
for (const c of skipArg ? skipArg.slice(7).split(',') : []) SKIP.add(`${c}.css`);

export const scopePrelude = (theme) => `@scope ([data-theme="${theme}"]) to ([data-theme]:not([data-theme="${theme}"]))`;

/** Splits CSS into top-level chunks: comments, rules/at-rule blocks. */
function topLevelChunks(css) {
  const chunks = [];
  let i = 0;
  while (i < css.length) {
    if (/\s/.test(css[i])) {
      i += 1;
      continue;
    }
    if (css.startsWith('/*', i)) {
      const end = css.indexOf('*/', i) + 2;
      chunks.push({ kind: 'comment', text: css.slice(i, end) });
      i = end;
      continue;
    }
    let depth = 0;
    let quote = null;
    let j = i;
    for (; j < css.length; j += 1) {
      const ch = css[j];
      if (quote) {
        if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '{') depth += 1;
      else if (ch === '}') {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    const text = css.slice(i, j + 1);
    chunks.push({ kind: /^@keyframes\b/.test(text) ? 'keyframes' : 'rule', text });
    i = j + 1;
  }
  return chunks;
}

const indent = (text) =>
  text
    .split('\n')
    .map((line) => (line.trim() ? `  ${line}` : ''))
    .join('\n');

let changed = 0;
for (const theme of readdirSync(THEMES)) {
  const dir = join(THEMES, theme);
  if (!statSync(dir).isDirectory()) continue;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.css') || SKIP.has(name)) continue;
    const file = join(dir, name);
    const css = readFileSync(file, 'utf8');
    if (css.includes('@scope')) continue;
    const chunks = topLevelChunks(css);
    const lead = [];
    while (chunks[0]?.kind === 'comment') lead.push(chunks.shift().text);
    // Inside @scope every selector is relative to the scope root (an implicit
    // `:scope ` prefix), so the old `[data-theme="x"] ` prefix must go.
    const prefix = new RegExp(`\\[data-theme=["']${theme}["']\\]\\s+`, 'g');
    const scoped = chunks.filter((c) => c.kind !== 'keyframes').map((c) => c.text.replace(prefix, ''));
    const keyframes = chunks.filter((c) => c.kind === 'keyframes').map((c) => c.text);
    const out = [
      ...lead,
      `${scopePrelude(theme)} {\n${indent(scoped.join('\n\n'))}\n}`,
      ...keyframes,
    ].join('\n\n');
    writeFileSync(file, out + '\n');
    changed += 1;
  }
}
console.log(`scope-flourishes: wrapped ${changed} file(s)`);
