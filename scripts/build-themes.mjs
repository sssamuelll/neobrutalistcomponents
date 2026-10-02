// Inlines every src/lib/themes/<name>/index.css into dist/themes/<name>.css.
//
// An entry file may contain only comments, the layer statement and lines of the
// form `@import './file.css' layer(nbc.x);`. Each import becomes
// `@layer nbc.x { <file contents> }`. Anything else is an error, so the output
// is a pure function of the source files.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const THEMES_SRC = join(ROOT, 'src/lib/themes');
const OUT = join(ROOT, 'dist/themes');
const LAYER_STATEMENT = '@layer nbc.tokens, nbc.theme, nbc.base, nbc.components, nbc.flourish;';
const IMPORT_RE = /^@import\s+['"]([^'"]+)['"]\s+layer\((nbc\.[a-z]+)\)\s*;$/;

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
mkdirSync(OUT, { recursive: true });

const themes = readdirSync(THEMES_SRC, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(THEMES_SRC, d.name, 'index.css')))
  .map((d) => d.name)
  .sort();

if (themes.length === 0) {
  console.error('build-themes: no themes found');
  process.exit(1);
}

for (const theme of themes) {
  const dir = join(THEMES_SRC, theme);
  const entry = readFileSync(join(dir, 'index.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = [];
  for (const raw of entry.split('\n')) {
    const line = raw.trim();
    if (!line || line === LAYER_STATEMENT) continue;
    const m = line.match(IMPORT_RE);
    if (!m) {
      console.error(`build-themes: ${theme}/index.css: unexpected line: ${line}`);
      process.exit(1);
    }
    const file = resolve(dir, m[1]);
    if (!existsSync(file)) {
      console.error(`build-themes: ${theme}/index.css imports missing file ${m[1]}`);
      process.exit(1);
    }
    const body = readFileSync(file, 'utf8').trim();
    blocks.push(`/* ${m[1].replace(/^\.\//, '')} */\n@layer ${m[2]} {\n${body}\n}`);
  }
  const header = `/* neobrutalistcomponents v${pkg.version} — theme: ${theme} */\n${LAYER_STATEMENT}\n\n`;
  writeFileSync(join(OUT, `${theme}.css`), header + blocks.join('\n\n') + '\n');
  if (existsSync(join(dir, 'fonts.css'))) {
    copyFileSync(join(dir, 'fonts.css'), join(OUT, `${theme}.fonts.css`));
  }
  console.log(`build-themes: ${theme} (${blocks.length} parts)`);
}
