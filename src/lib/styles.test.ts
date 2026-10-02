/**
 * CSS architecture conventions (spec D3/D4). These keep the cascade
 * deterministic: consumers' unlayered CSS always wins, component CSS is
 * theme-agnostic, and theme personality lives only in theme folders.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LAYER_STATEMENT } from './themes/contract';
import { NEO_THEMES } from './themes';

const LIB = dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = join(LIB, 'themes');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const rel = (file: string) => relative(LIB, file);

const allCss = walk(LIB).filter((f) => f.endsWith('.css'));
const entryFiles = [join(LIB, 'styles.css'), ...NEO_THEMES.map((t) => join(THEMES_DIR, t, 'index.css'))];
const themeFiles = allCss.filter((f) => f.startsWith(THEMES_DIR + '/'));
const componentFiles = allCss.filter(
  (f) => !themeFiles.includes(f) && !entryFiles.includes(f) && !/\/(tokens|base)\.css$/.test(f),
);

/** `@import './x.css' layer(nbc.y);` → [{ path, layer }] */
function parseImports(file: string) {
  const body = stripComments(readFileSync(file, 'utf8'));
  return [...body.matchAll(/@import\s+['"]([^'"]+)['"]\s+layer\(([\w.-]+)\)\s*;/g)].map((m) => ({
    path: resolve(dirname(file), m[1]),
    layer: m[2],
  }));
}

/** Top-level blocks (`prelude { … }`) of a comment-free stylesheet. */
function topLevelBlocks(css: string): string[] {
  const blocks: string[] = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    if (depth === 0 && start === -1 && !/\s/.test(ch)) start = i;
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        blocks.push(css.slice(start, i + 1).trim());
        start = -1;
      }
    }
  }
  return blocks;
}

describe('CSS conventions', () => {
  it('every entry file starts with the layer statement and only @imports with layer()', () => {
    for (const file of entryFiles) {
      expect(existsSync(file), `${rel(file)} exists`).toBe(true);
      const body = stripComments(readFileSync(file, 'utf8')).trim();
      const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
      expect(lines[0], `${rel(file)} first statement`).toBe(LAYER_STATEMENT);
      for (const line of lines.slice(1)) {
        expect(line, `${rel(file)}: "${line}"`).toMatch(/^@import\s+'[^']+'\s+layer\(nbc\.[a-z]+\);$/);
      }
    }
  });

  it('partials declare no layers and no imports (the entry file assigns the layer)', () => {
    for (const file of [...componentFiles, ...themeFiles.filter((f) => !entryFiles.includes(f))]) {
      if (file.endsWith('fonts.css')) continue; // fonts.css is a standalone @import url(...) of web fonts
      const body = stripComments(readFileSync(file, 'utf8'));
      expect(body, `${rel(file)} contains @layer`).not.toMatch(/@layer\b/);
      expect(body, `${rel(file)} contains @import`).not.toMatch(/@import\b/);
    }
  });

  it('every import resolves and lands in the right layer', () => {
    for (const file of entryFiles) {
      for (const { path, layer } of parseImports(file)) {
        expect(existsSync(path), `${rel(file)} imports missing ${rel(path)}`).toBe(true);
        const isTheme = path.startsWith(THEMES_DIR + '/');
        const expected = isTheme
          ? path.endsWith('/tokens.css')
            ? 'nbc.theme'
            : 'nbc.flourish'
          : path.endsWith('/tokens.css')
            ? 'nbc.tokens'
            : path.endsWith('/base.css')
              ? 'nbc.base'
              : 'nbc.components';
        expect(layer, `${rel(path)} layer`).toBe(expected);
      }
    }
  });

  it('no CSS file is orphaned (every partial is imported by an entry file)', () => {
    const imported = new Set(entryFiles.flatMap((f) => parseImports(f).map((i) => i.path)));
    const partials = allCss.filter((f) => !entryFiles.includes(f) && !f.endsWith('fonts.css'));
    for (const file of partials) {
      expect(imported.has(file), `${rel(file)} is not imported by any entry file`).toBe(true);
    }
  });

  it('component CSS is theme-agnostic: no [data-theme] selectors and no hex colors', () => {
    for (const file of componentFiles) {
      const body = stripComments(readFileSync(file, 'utf8'));
      expect(body, `${rel(file)} has a [data-theme] selector`).not.toMatch(/\[data-theme/);
      expect(body, `${rel(file)} has a hex color`).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    }
  });

  it('theme partials wrap every rule in their donut @scope; keyframes stay top-level', () => {
    for (const theme of NEO_THEMES) {
      const dir = join(THEMES_DIR, theme);
      const prelude = `@scope ([data-theme="${theme}"]) to ([data-theme]:not([data-theme="${theme}"]))`;
      for (const name of readdirSync(dir)) {
        if (['index.css', 'fonts.css', 'tokens.css'].includes(name) || !name.endsWith('.css')) continue;
        const where = `themes/${theme}/${name}`;
        const css = stripComments(readFileSync(join(dir, name), 'utf8'));
        const blocks = topLevelBlocks(css);
        const scopes = blocks.filter((b) => b.startsWith('@scope'));
        expect(scopes.length, `${where}: exactly one @scope block`).toBe(1);
        expect(scopes[0].slice(0, scopes[0].indexOf('{')).trim(), `${where}: @scope prelude`).toBe(prelude);
        expect(scopes[0], `${where}: selectors inside @scope must not repeat [data-theme]`).not.toMatch(
          /\{[^{}]*\[data-theme|^\s*\[data-theme/m,
        );
        for (const block of blocks.filter((b) => !b.startsWith('@scope'))) {
          const kf = block.match(/^@keyframes\s+([\w-]+)/);
          expect(kf, `${where}: only @keyframes may live outside @scope, found "${block.slice(0, 40)}"`).not.toBeNull();
          expect(kf![1], `${where}: keyframes name`).toMatch(new RegExp(`^nbc-${theme}-`));
        }
      }
    }
  });
});
