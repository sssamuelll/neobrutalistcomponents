// Verifies the built package before publishing: every `exports` target exists,
// the core stylesheet carries the cascade layers and the component rules,
// every theme stylesheet (core and study) is scoped to its theme and keeps its
// light-dark() colors, study themes stay within budget, and the ./study
// catalog matches the theme files. Run after `npm run build:lib`.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LAYER = '@layer nbc.tokens, nbc.theme, nbc.base, nbc.components, nbc.flourish;';
const STUDY_BUDGET = 12 * 1024;
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const coreThemes = readdirSync(join(ROOT, 'src/lib/themes'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const themeIds = readdirSync(join(ROOT, 'dist/themes'))
  .filter((f) => f.endsWith('.css') && !f.endsWith('.fonts.css'))
  .map((f) => f.slice(0, -'.css'.length))
  .sort();
const { STUDY_CATALOG } = await import(pathToFileURL(join(ROOT, 'dist/study.js')).href);
const studyIds = STUDY_CATALOG.filter((entry) => !entry.predatesStudy).map((entry) => entry.id);

const failures = [];
const check = (ok, message) => ok || failures.push(message);

check(STUDY_CATALOG.length === coreThemes.length + studyIds.length, 'dist/study.js must list every core theme plus every study theme');
check(
  [...coreThemes, ...studyIds].sort().join() === themeIds.join(),
  `dist/themes (${themeIds.join(', ')}) does not match core + study themes`,
);

const targets = Object.entries(pkg.exports).flatMap(([key, value]) => {
  const paths = typeof value === 'string' ? [value] : Object.values(value);
  if (!key.includes('*')) return paths;
  // ./themes/* → every theme stylesheet and its fonts file
  return paths.flatMap((p) => themeIds.flatMap((t) => [p.replace('*', `${t}.css`), p.replace('*', `${t}.fonts.css`)]));
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

for (const theme of themeIds) {
  const css = readFileSync(join(ROOT, `dist/themes/${theme}.css`), 'utf8');
  check(css.startsWith('/*') && css.includes(LAYER), `${theme}.css lacks the layer statement`);
  check(new RegExp(`\\[data-theme=["']?${theme}["']?\\]`).test(css), `${theme}.css is not scoped to [data-theme="${theme}"]`);
  check(!css.includes("@import '"), `${theme}.css still has unresolved @imports`);
  check(!css.includes('lightningcss-'), `${theme}.css has lowered light-dark() (--lightningcss-* vars)`);
  check(css.includes('light-dark('), `${theme}.css lost its light-dark() colors`);
}
for (const id of studyIds) {
  const bytes = statSync(join(ROOT, `dist/themes/${id}.css`)).size;
  check(bytes <= STUDY_BUDGET, `${id}.css is ${bytes} bytes, the budget is ${STUDY_BUDGET}`);
}

const studyJs = readFileSync(join(ROOT, 'dist/study.js'), 'utf8');
const studyDts = readFileSync(join(ROOT, 'dist/study.d.ts'), 'utf8');
check(studyDts.includes('export type StudyThemeId'), 'dist/study.d.ts lacks StudyThemeId');
check(!studyJs.includes('"vars"'), 'dist/study.js leaks the site-only preview vars');

const js = readFileSync(join(ROOT, 'dist/index.js'), 'utf8');
check(/^["']use client["'];/.test(js), 'dist/index.js is not marked "use client"');
check(!/import\s+["'][^"']+\.css["']/.test(js), 'dist/index.js imports CSS');

const dts = readFileSync(join(ROOT, 'dist/index.d.ts'), 'utf8');
check(!dts.includes('.css'), 'dist/index.d.ts references a .css file');

if (failures.length) {
  console.error(`check-package: ${failures.length} problem(s)\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`check-package: ${targets.length} export targets, ${coreThemes.length} core + ${studyIds.length} study themes — ok`);
