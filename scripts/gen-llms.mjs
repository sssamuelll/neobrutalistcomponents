// Generates public/llms.txt and public/llms-full.txt from the docs metadata
// (src/docs/meta/*.ts), the shared guide (src/docs/guide.ts), the theme
// registry and the live example sources. Output is deterministic: the same
// sources always produce byte-identical files (CI checks for a clean diff).
//
//   node scripts/gen-llms.mjs          → public/
//   node scripts/gen-llms.mjs --dist   → also copies into dist/ (npm package)
import { runnerImport } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = async (id) => (await runnerImport(join(ROOT, id), { configFile: false, logLevel: 'silent' })).module;

const [{ COMPONENTS }, guide, themes, contract] = await Promise.all([
  load('src/docs/meta/index.ts'),
  load('src/docs/guide.ts'),
  load('src/lib/themes/index.ts'),
  load('src/lib/themes/contract.ts'),
]);
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const { SITE_URL, REPO_URL, TAGLINE, INSTALL_CODE, SETUP_CODE, BYO_THEME_CODE, THEME_GUIDE, GLOBAL_RULES, FONTS_NOTE } =
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
  `- [Getting started](${SITE_URL}/#/start): install, setup, fonts, bring-your-own theme`,
  `- [Themes and tokens](${SITE_URL}/#/themes): the five themes, every token, live contrast ratios`,
  `- [Blocks](${SITE_URL}/#/blocks): complete screens composed from the components`,
  '',
  ...groups.flatMap((group) => [
    `## ${group}`,
    '',
    ...COMPONENTS.filter((c) => c.group === group).map((c) => `- [${c.name}](${SITE_URL}/#/components/${c.slug}): ${c.summary}`),
    '',
  ]),
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

if (process.argv.includes('--dist')) {
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  copyFileSync(join(out, 'llms.txt'), join(ROOT, 'dist/llms.txt'));
  copyFileSync(join(out, 'llms-full.txt'), join(ROOT, 'dist/llms-full.txt'));
}
console.log(`gen-llms: ${COMPONENTS.length} components → public/llms.txt, public/llms-full.txt`);
