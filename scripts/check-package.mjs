// Verifies the built package before publishing: every `exports` target exists,
// the core stylesheet carries the cascade layers and the component rules, and
// every theme stylesheet is scoped to its theme. Run after `npm run build:lib`.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const themes = readdirSync(join(ROOT, 'src/lib/themes'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const failures = [];
const check = (ok, message) => ok || failures.push(message);

const targets = Object.entries(pkg.exports).flatMap(([key, value]) => {
  const paths = typeof value === 'string' ? [value] : Object.values(value);
  if (!key.includes('*')) return paths;
  // ./themes/* → every theme stylesheet and its optional fonts file
  return paths.flatMap((p) => themes.flatMap((t) => [p.replace('*', `${t}.css`), p.replace('*', `${t}.fonts.css`)]));
});
for (const target of targets) check(existsSync(join(ROOT, target)), `missing export target ${target}`);

for (const file of [pkg.main, pkg.module, pkg.types]) check(existsSync(join(ROOT, file)), `missing ${file}`);

const styles = readFileSync(join(ROOT, 'dist/styles.css'), 'utf8');
check(/@layer nbc\.tokens/.test(styles), 'dist/styles.css has no nbc.tokens layer');
check(/@layer nbc\.components/.test(styles), 'dist/styles.css has no nbc.components layer');
check(styles.includes('.nbc-button'), 'dist/styles.css has no .nbc-button rules');
check(!styles.includes('lightningcss-'), 'dist/styles.css has lowered light-dark() (--lightningcss-* vars): set build.cssTarget');
check(styles.includes('light-dark('), 'dist/styles.css lost its light-dark() colors');
check(!/\[data-theme=["']?(classic|tech|swiss|y2k|riso)/.test(styles), 'dist/styles.css contains theme-specific selectors');

for (const theme of themes) {
  const css = readFileSync(join(ROOT, `dist/themes/${theme}.css`), 'utf8');
  check(css.startsWith('/*') && css.includes('@layer nbc.tokens, nbc.theme, nbc.base, nbc.components, nbc.flourish;'), `${theme}.css lacks the layer statement`);
  check(new RegExp(`\\[data-theme=["']?${theme}`).test(css), `${theme}.css is not scoped to [data-theme="${theme}"]`);
  check(!css.includes('@import \''), `${theme}.css still has unresolved @imports`);
}

const js = readFileSync(join(ROOT, 'dist/index.js'), 'utf8');
check(/^["']use client["'];/.test(js), 'dist/index.js is not marked "use client"');
check(!/import\s+["'][^"']+\.css["']/.test(js), 'dist/index.js imports CSS');

const dts = readFileSync(join(ROOT, 'dist/index.d.ts'), 'utf8');
check(!dts.includes('.css'), 'dist/index.d.ts references a .css file');

if (failures.length) {
  console.error(`check-package: ${failures.length} problem(s)\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`check-package: ${targets.length} export targets, ${themes.length} themes — ok`);
