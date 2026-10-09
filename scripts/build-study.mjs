// Compiles the study themes (src/study/themes/<scene>/<id>.ts) and the theme
// catalog. Fails on any validation or contract problem. Output is a pure
// function of the sources; nothing it writes is committed.
//
//   node scripts/build-study.mjs          → src/study/.generated/ (site, tests, typecheck)
//   node scripts/build-study.mjs --dist   → also dist/themes/<id>.css|.fonts.css, dist/study.js|.d.ts
import { runnerImport } from 'vite';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GEN = join(ROOT, 'src/study/.generated');
const DIST = process.argv.includes('--dist');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const study = (await runnerImport(join(ROOT, 'src/study/build.ts'), { configFile: false, logLevel: 'silent' })).module;

function fail(problems) {
  console.error(`build-study: ${problems.length} problem(s)\n- ${problems.join('\n- ')}`);
  process.exit(1);
}

const problems = [
  ...study.registryProblems(),
  ...study.STUDY_THEMES.flatMap(({ theme }) => study.themeProblems(theme)),
  ...study.NEO_THEMES.flatMap((id) =>
    study.CORE_FICHAS[id] ? study.coreFichaProblems(id, study.CORE_FICHAS[id]) : [`${id}: no core ficha`],
  ),
];
if (problems.length) fail(problems);

rmSync(GEN, { recursive: true, force: true });
const outDirs = [join(GEN, 'themes'), ...(DIST ? [join(ROOT, 'dist/themes')] : [])];
for (const dir of outDirs) mkdirSync(dir, { recursive: true });

const entries = [];
for (const { theme, signature, motionCss } of study.STUDY_THEMES) {
  let compiled;
  try {
    compiled = study.compileTheme(theme, { signature, motionCss, banner: `neobrutalistcomponents v${pkg.version} — study theme: ${theme.id}` });
  } catch (error) {
    fail([error.message]);
  }
  const contract = study.contractProblems(theme.id, compiled.tokens, compiled.css);
  if (contract.length) fail(contract);
  for (const dir of outDirs) {
    writeFileSync(join(dir, `${theme.id}.css`), compiled.css);
    writeFileSync(join(dir, `${theme.id}.fonts.css`), compiled.fontsCss);
  }
  entries.push(study.studyEntry(theme, compiled));
}

const coreFontsHref = (id) =>
  readFileSync(join(ROOT, `src/lib/themes/${id}/fonts.css`), 'utf8').match(/@import url\('([^']+)'\)/)?.[1] ?? null;
const core = study.NEO_THEMES.map((id) => study.coreEntry(id, study.THEME_INFO[id], study.CORE_FICHAS[id], coreFontsHref(id)));
const catalog = [...core, ...entries];
writeFileSync(join(GEN, 'catalog.ts'), study.renderSiteModule(catalog));
if (DIST) {
  const { js, dts } = study.renderPackageModule(catalog);
  writeFileSync(join(ROOT, 'dist/study.js'), js);
  writeFileSync(join(ROOT, 'dist/study.d.ts'), dts);
}
console.log(`build-study: ${entries.length} study theme(s), ${core.length} core fichas → src/study/.generated/${DIST ? ' + dist/' : ''}`);
