/** Everything scripts/build-study.mjs needs, behind one import (one module graph). */
export { STUDY_THEMES, registryProblems } from './registry';
export { themeProblems, coreFichaProblems } from './validate';
export { compileTheme } from './compile';
export { contractProblems } from './contract';
export { coreEntry, studyEntry, renderSiteModule, renderPackageModule } from './catalog';
export { CORE_FICHAS } from './core-fichas';
export { NEO_THEMES, THEME_INFO } from '../lib/themes';
