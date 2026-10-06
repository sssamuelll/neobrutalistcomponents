// Generates public/llms.txt and public/llms-full.txt from the docs metadata
// (src/docs/meta/*.ts), the shared guide (src/docs/guide.ts), the theme
// registry, the study catalog (src/study/.generated/catalog.ts, written by
// build-study.mjs) and the live example sources, and rewrites the study-themes
// table of skills/neobrutalist-ui/SKILL.md. Output is deterministic: the same
// sources always produce byte-identical files (CI checks for a clean diff).
//
//   node scripts/gen-llms.mjs          → public/ and the skill
//   node scripts/gen-llms.mjs --dist   → also copies into dist/ (npm package)
import { runnerImport } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = async (id) => (await runnerImport(join(ROOT, id), { configFile: false, logLevel: 'silent' })).module;

const [{ COMPONENTS }, guide, themes, contract, { CATALOG }, { SCENE_TEXT }] = await Promise.all([
  load('src/docs/meta/index.ts'),
  load('src/docs/guide.ts'),
  load('src/lib/themes/index.ts'),
  load('src/lib/themes/contract.ts'),
  load('src/study/.generated/catalog.ts'),
  load('src/site/i18n.ts'),
]);
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const { SITE_URL, REPO_URL, TAGLINE, INSTALL_CODE, SETUP_CODE, BYO_THEME_CODE, THEME_GUIDE, GLOBAL_RULES, FONTS_NOTE, pageUrl } =
  guide;
const { NEO_THEMES, THEME_INFO } = themes;

const fence = (lang, code) => '```' + lang + '\n' + code.trim() + '\n```';
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const table = (head, rows) =>
  [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join(
    '\n',
  );
const list = (items) => items.map((i) => `- ${i}`).join('\n');
const groups = [...new Set(COMPONENTS.map((c) => c.group))];

// The study's own themes (the five core themes are listed from THEME_INFO).
const study = CATALOG.filter((entry) => !entry.predatesStudy);
const years = (date) => (typeof date === 'number' ? String(date) : `${date[0]}–${date[1]}`);
// 'Title (original)'. A title that already ends in a parenthesis takes the
// original inside it — 'Mäusebunker (former …; Zentrale …)' — never a second one.
const titled = ({ title, original }) => {
  if (!original) return title.en;
  return title.en.endsWith(')') ? `${title.en.slice(0, -1)}; ${original.text})` : `${title.en} (${original.text})`;
};
const reference = ({ reference: r }) => [titled(r), r.authors.join(', '), r.place.en, years(r.date)].filter(Boolean).join(', ');
const scene = (entry) => SCENE_TEXT[entry.scene].name.en;
const stylesheets = (entry) => `\`themes/${entry.id}.css\`, \`themes/${entry.id}.fonts.css\``;

// ---------------------------------------------------------------- llms.txt
const index = [
  `# ${pkg.name}`,
  '',
  `> ${TAGLINE} React 19, zero runtime dependencies, cascade-layered CSS driven by a closed --nbc-* token contract.`,
  '',
  `Version ${pkg.version}. Install with \`${INSTALL_CODE}\`, import \`${pkg.name}/styles.css\` plus one theme stylesheet, and wrap the app in \`<NeoProvider theme="…">\`.`,
  '',
  '## Docs',
  '',
  `- [Getting started](${pageUrl('/start')}): install, setup, fonts, bring-your-own theme`,
  `- [Atlas](${pageUrl('/atlas')}): every theme, with its reference, every token and live contrast ratios`,
  `- [Blocks](${pageUrl('/blocks')}): complete screens composed from the components`,
  '',
  ...groups.flatMap((group) => [
    `## ${group}`,
    '',
    ...COMPONENTS.filter((c) => c.group === group).map((c) => `- [${c.name}](${pageUrl(`/components/${c.slug}`)}): ${c.summary}`),
    '',
  ]),
  '## Study themes',
  '',
  `Themes of the [neobrutalism study](${pageUrl('/')}), each read from one documented work. Same contract and geometry as the five core themes; import \`${pkg.name}/themes/<id>.css\`.`,
  '',
  ...study.map((entry) => `- [${entry.name.en}](${pageUrl(`/theme/${entry.id}`)}): \`${entry.id}\` — ${reference(entry)}. ${scene(entry)}, ${entry.nativeScheme} native.`),
  '',
  '## Optional',
  '',
  `- [Full reference](${SITE_URL}/llms-full.txt): every component, prop, rule and example in one file`,
  `- [Source](${REPO_URL})`,
  '',
].join('\n');

// ----------------------------------------------------------- llms-full.txt
const example = (c, ex) => {
  const code = readFileSync(join(ROOT, 'src/docs/examples', c.name, `${ex.file}.tsx`), 'utf8');
  return [`#### ${ex.title}`, ex.description ? `\n${ex.description}\n` : '', fence('tsx', code)].join('\n');
};

const component = (c) =>
  [
    `### ${c.name}`,
    '',
    c.summary,
    '',
    `Extends \`${c.extends}\` — every native prop is forwarded.`,
    '',
    '**Use it for**',
    '',
    list(c.whenToUse),
    '',
    '**Do not use it for**',
    '',
    list(c.whenNotToUse),
    '',
    '**Props**',
    '',
    table(
      ['Prop', 'Type', 'Default', 'Description'],
      c.props.map((p) => [`\`${p.name}\`${p.required ? ' (required)' : ''}`, `\`${p.type}\``, p.default ? `\`${p.default}\`` : '—', p.description]),
    ),
    ...(c.subcomponents?.length
      ? [
          '',
          '**Parts**',
          '',
          ...c.subcomponents.flatMap((s) => [
            `- \`${s.name}\` (\`<${s.element}>\`): ${s.description}`,
            ...(s.props ?? []).map(
              (p) => `  - \`${p.name}\`${p.required ? ' (required)' : ''}: \`${p.type}\`${p.default ? ` = \`${p.default}\`` : ''} — ${p.description}`,
            ),
          ]),
        ]
      : []),
    '',
    '**Accessibility**',
    '',
    list(c.accessibility),
    '',
    '**Rules**',
    '',
    list(c.rules),
    '',
    `**CSS hooks:** ${c.classes.map((k) => `\`.${k}\``).join(', ')}`,
    '',
    '**Examples**',
    '',
    ...c.examples.map((ex) => example(c, ex) + '\n'),
  ].join('\n');

const tokenGroups = [
  ['Typography', contract.TYPOGRAPHY_TOKENS],
  ['Color (solid; #hex or light-dark(#hex, #hex))', contract.COLOR_TOKENS],
  ['Fills (backgrounds; may be gradients)', contract.FILL_TOKENS],
  ['Shape', contract.SHAPE_TOKENS],
  ['Elevation and interaction', contract.ELEVATION_TOKENS],
  ['Motion', contract.MOTION_TOKENS],
  ['Invariant (never themed)', contract.INVARIANT_TOKENS],
];

const full = [
  `# ${pkg.name} v${pkg.version} — full reference`,
  '',
  `> ${TAGLINE}`,
  '',
  'This file is generated from the library’s metadata and example sources; it describes the code exactly.',
  '',
  '## Install',
  '',
  fence('sh', INSTALL_CODE),
  '',
  '## Setup',
  '',
  fence('tsx', SETUP_CODE),
  '',
  `\`NeoProvider\` props: \`theme\` (built-in id or your own), \`mode\` ('light' | 'dark' | 'system'; omit for the theme's native scheme), \`as\` ('div' | 'main' | 'section' | 'article' | 'span'). \`useTheme()\` returns \`{ theme, mode }\`.`,
  '',
  FONTS_NOTE,
  '',
  '## Themes',
  '',
  table(
    ['Theme', 'Tagline', 'Native scheme', 'Fonts', 'Best for', 'Avoid for'],
    NEO_THEMES.map((id) => [
      `\`${id}\``,
      THEME_INFO[id].tagline,
      THEME_INFO[id].nativeScheme,
      THEME_INFO[id].fonts.join(', '),
      THEME_GUIDE[id].bestFor,
      THEME_GUIDE[id].avoid,
    ]),
  ),
  '',
  '## Study themes',
  '',
  `Each study theme reads one documented work; its page (${pageUrl('/atlas')}) cites the sources. Same token contract and geometry as the core themes: import its stylesheet, and its fonts file unless you self-host the fonts (system-font themes ship an empty one). The catalog is also data: \`import { STUDY_CATALOG } from '${pkg.name}/study'\`.`,
  '',
  table(
    ['Theme', 'Reference', 'Scene', 'Native scheme', 'Fonts', 'Stylesheets'],
    study.map((entry) => [
      `\`${entry.id}\``,
      reference(entry),
      scene(entry),
      entry.nativeScheme,
      entry.fonts.length ? entry.fonts.join(', ') : 'system fonts',
      stylesheets(entry),
    ]),
  ),
  '',
  '## Composition rules',
  '',
  list(GLOBAL_RULES),
  '',
  '## Token contract',
  '',
  'Every built-in theme defines every token below, in light and dark. Custom CSS should read these instead of literal values.',
  '',
  ...tokenGroups.flatMap(([title, tokens]) => [`- **${title}:** ${tokens.map((t) => `\`${t}\``).join(', ')}`]),
  '',
  '## Bring your own theme',
  '',
  fence('css', BYO_THEME_CODE),
  '',
  '## Components',
  '',
  ...COMPONENTS.map(component),
].join('\n');

const out = join(ROOT, 'public');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'llms.txt'), index);
writeFileSync(join(out, 'llms-full.txt'), full.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');

// The skill's study-themes table, between its markers.
const SKILL = join(ROOT, 'skills/neobrutalist-ui/SKILL.md');
const START = '<!-- study-themes:start -->';
const END = '<!-- study-themes:end -->';
const skill = readFileSync(SKILL, 'utf8');
const [from, to] = [skill.indexOf(START), skill.indexOf(END)];
if (from < 0 || to < from) throw new Error(`gen-llms: ${START} … ${END} not found in SKILL.md`);
const studyTable = table(
  ['Theme', 'Reference', 'Scene', 'Native scheme'],
  study.map((entry) => [`\`${entry.id}\``, reference(entry), scene(entry), entry.nativeScheme]),
);
writeFileSync(SKILL, `${skill.slice(0, from + START.length)}\n${studyTable}\n${skill.slice(to)}`);

if (process.argv.includes('--dist')) {
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  copyFileSync(join(out, 'llms.txt'), join(ROOT, 'dist/llms.txt'));
  copyFileSync(join(out, 'llms-full.txt'), join(ROOT, 'dist/llms-full.txt'));
}
console.log(`gen-llms: ${COMPONENTS.length} components, ${study.length} study themes → public/llms.txt, public/llms-full.txt, SKILL.md`);
