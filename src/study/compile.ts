/**
 * Study theme compiler: data → CSS. A pure function — the same input always
 * produces byte-identical output, shaped like a hand-written core theme:
 * the token block in nbc.theme (flourishes join in Task 3).
 */
import { LAYER_STATEMENT } from '../lib/themes/contract';
import { contrastRatio, resolveColor, resolveStops } from '../lib/themes/color';
import { SYSTEM_STACKS, fontStack, googleFontsUrl } from './fonts';
import type { FontKey } from './fonts';
import { lightDark, normalizeHex } from './color';
import { COLOR_VARS } from './types';
import type { ColorToken, SchemeColor, StudyFonts, StudyThemeInput } from './types';
import { stripComments, topLevelBlocks } from './css';
import { lintFlourishCss, lintMotion, lintSignature } from './lint';
import { FAMILIES } from './families';
import { paramDeclarations, resolveParams } from './families/params';
import type { FamilyDefinition, FillContext } from './families/types';

/** Values for optional groups. Equal to the neutral defaults in src/lib/tokens.css. */
export const ENGINE_DEFAULTS = {
  labelTransform: 'none',
  labelSpacing: 'normal',
  displayTransform: 'none',
  displaySpacing: '-0.02em',
  displayStretch: '100%',
  featureSettings: 'normal',
  kerning: 'auto',
  textRendering: 'optimizeLegibility',
  borderStyle: 'solid',
  rotate: 0,
  focus: { width: 3, offset: 2 },
  motion: { duration: 120, durationSlow: 220, ease: 'cubic-bezier(0.2, 0.9, 0.3, 1)' },
} as const;

/** Each ink token, the color it sits on and that color's fill (if any). */
const INKS = {
  primaryFg: { base: 'primary', fill: '--nbc-primary-fill' },
  accentFg: { base: 'accent' },
  infoFg: { base: 'info' },
  successFg: { base: 'success' },
  warningFg: { base: 'warning' },
  dangerFg: { base: 'danger', fill: '--nbc-danger-fill' },
} as const satisfies Partial<Record<ColorToken, { base: ColorToken; fill?: string }>>;
type InkKey = keyof typeof INKS;

export interface CompileOptions {
  /** First line of the stylesheet's header comment. */
  readonly banner?: string;
  /** Contents of the theme's signature CSS. */
  readonly signature?: string;
  /** Contents of the theme's motion CSS. */
  readonly motionCss?: string;
  /** Family registry. Defaults to the study's families. */
  readonly families?: Readonly<Record<string, FamilyDefinition>>;
}

export interface CompiledTheme {
  readonly id: string;
  /** Every custom property of the theme block, in output order. */
  readonly tokens: ReadonlyMap<string, string>;
  readonly css: string;
  readonly fontsCss: string;
  readonly fontsHref: string | null;
}

const px = (n: number) => `${n}px`;

function schemeValue(color: SchemeColor): string {
  return typeof color === 'string'
    ? normalizeHex(color)
    : lightDark(normalizeHex(color[0]), normalizeHex(color[1]));
}

/** The registry keys a theme loads, in sans, display, mono order. */
export function fontKeys(fonts: StudyFonts): FontKey[] {
  if (typeof fonts === 'string') return [];
  return [fonts.sans, fonts.display, fonts.mono].filter((k): k is FontKey => k !== undefined);
}

function fontTokens(fonts: StudyFonts): [string, string][] {
  if (typeof fonts === 'string') {
    const stack = SYSTEM_STACKS[fonts];
    return [
      ['--nbc-font-sans', stack.sans],
      ['--nbc-font-display', stack.sans],
      ['--nbc-font-mono', stack.mono],
    ];
  }
  const sans = fontStack(fonts.sans);
  return [
    ['--nbc-font-sans', sans],
    ['--nbc-font-display', fonts.display ? fontStack(fonts.display) : sans],
    ['--nbc-font-mono', fonts.mono ? fontStack(fonts.mono) : SYSTEM_STACKS['system-sans'].mono],
  ];
}

/** Per scheme, the theme text ink (fg light / fg dark) with the most contrast on every stop it sits on. */
function pickInk(tokens: Map<string, string>, theme: StudyThemeInput, key: InkKey): string {
  const spec: { base: ColorToken; fill?: string } = INKS[key];
  const fg = theme.colors.fg;
  const inks = [...new Set(typeof fg === 'string' ? [normalizeHex(fg)] : fg.map(normalizeHex))];
  const [light, dark] = (['light', 'dark'] as const).map((scheme) => {
    const page = resolveColor(tokens, '--nbc-bg', scheme);
    const grounds = [
      ...resolveStops(tokens, COLOR_VARS[spec.base], scheme),
      ...(spec.fill ? resolveStops(tokens, spec.fill, scheme) : []),
    ];
    let best = { ink: inks[0], ratio: -1 };
    for (const ink of inks) {
      const ratio = Math.min(...grounds.map((ground) => contrastRatio(ink, ground, page)));
      if (ratio > best.ratio) best = { ink, ratio };
    }
    if (best.ratio < 4.5) {
      throw new Error(
        `${theme.id}: ${COLOR_VARS[key]} auto (${scheme}): best ink ${best.ink} reaches ${best.ratio.toFixed(2)}:1 on ${COLOR_VARS[spec.base]}, needs 4.5`,
      );
    }
    return best.ink;
  });
  return lightDark(light, dark);
}

/** Every token of the theme block, in contract order. Texture is 'none' here; families set it (Task 3). */
export function compileTokens(theme: StudyThemeInput): Map<string, string> {
  const { colors, type, shape, elevation } = theme;
  const focus = theme.focus ?? ENGINE_DEFAULTS.focus;
  const motion = theme.motion ?? ENGINE_DEFAULTS.motion;
  const tokens = new Map<string, string>();

  tokens.set('--nbc-scheme', theme.nativeScheme);
  for (const [name, value] of fontTokens(theme.fonts)) tokens.set(name, value);
  tokens.set('--nbc-weight-body', String(type.weightBody));
  tokens.set('--nbc-weight-label', String(type.weightLabel));
  tokens.set('--nbc-weight-display', String(type.weightDisplay));
  tokens.set('--nbc-label-transform', type.labelTransform ?? ENGINE_DEFAULTS.labelTransform);
  tokens.set('--nbc-label-spacing', type.labelSpacing ?? ENGINE_DEFAULTS.labelSpacing);
  tokens.set('--nbc-display-transform', type.displayTransform ?? ENGINE_DEFAULTS.displayTransform);
  tokens.set('--nbc-display-spacing', type.displaySpacing ?? ENGINE_DEFAULTS.displaySpacing);

  // Placeholders keep auto inks in contract order until their grounds are known.
  for (const key of Object.keys(COLOR_VARS) as ColorToken[]) {
    const value = colors[key];
    tokens.set(COLOR_VARS[key], value === 'auto' ? '' : schemeValue(value));
  }
  tokens.set('--nbc-primary-fill', theme.fills?.primary ?? 'var(--nbc-primary)');
  tokens.set('--nbc-danger-fill', theme.fills?.danger ?? 'var(--nbc-danger)');
  tokens.set('--nbc-surface-fill', theme.fills?.surface ?? 'var(--nbc-surface)');
  tokens.set('--nbc-texture', 'none');
  for (const key of Object.keys(INKS) as InkKey[]) {
    if (colors[key] === 'auto') tokens.set(COLOR_VARS[key], pickInk(tokens, theme, key));
  }

  tokens.set('--nbc-border-width', px(shape.borderWidth));
  tokens.set('--nbc-border-style', shape.borderStyle ?? ENGINE_DEFAULTS.borderStyle);
  tokens.set('--nbc-radius', px(shape.radius));
  tokens.set('--nbc-radius-control', px(shape.radiusControl));
  tokens.set('--nbc-radius-button', px(shape.radiusButton));
  tokens.set('--nbc-radius-small', px(shape.radiusSmall));

  tokens.set('--nbc-shadow', elevation.shadow);
  tokens.set('--nbc-shadow-lg', elevation.shadowLg);
  tokens.set('--nbc-shadow-press', elevation.shadowPress);
  tokens.set('--nbc-press', px(elevation.press));
  tokens.set('--nbc-press-active', px(elevation.pressActive));
  tokens.set('--nbc-rotate', `${elevation.rotate ?? ENGINE_DEFAULTS.rotate}deg`);
  tokens.set('--nbc-focus-width', px(focus.width));
  tokens.set('--nbc-focus-offset', px(focus.offset));

  tokens.set('--nbc-duration', `${motion.duration}ms`);
  tokens.set('--nbc-duration-slow', `${motion.durationSlow}ms`);
  tokens.set('--nbc-ease', motion.ease);
  tokens.set('--nbc-display-stretch', type.displayStretch ?? ENGINE_DEFAULTS.displayStretch);
  tokens.set('--nbc-font-features', type.featureSettings ?? ENGINE_DEFAULTS.featureSettings);
  tokens.set('--nbc-font-kerning', type.kerning ?? ENGINE_DEFAULTS.kerning);
  tokens.set('--nbc-text-rendering', type.textRendering ?? ENGINE_DEFAULTS.textRendering);
  return tokens;
}

export function renderTokenBlock(id: string, tokens: ReadonlyMap<string, string>): string {
  const lines = [...tokens].map(([name, value]) => `  ${name}: ${value};`);
  return `@layer nbc.theme {\n[data-theme="${id}"] {\n${lines.join('\n')}\n}\n}`;
}

function fontsOutput(theme: StudyThemeInput): Pick<CompiledTheme, 'fontsCss' | 'fontsHref'> {
  const keys = fontKeys(theme.fonts);
  if (!keys.length) {
    return { fontsHref: null, fontsCss: `/* The ${theme.id} theme uses system fonts only: nothing to load. */\n` };
  }
  const fontsHref = googleFontsUrl(keys);
  return { fontsHref, fontsCss: `/* Optional: loads the families the ${theme.id} theme expects. */\n@import url('${fontsHref}');\n` };
}

export const scopePrelude = (id: string) =>
  `@scope ([data-theme="${id}"]) to ([data-theme]:not([data-theme="${id}"]))`;

interface FlourishPart {
  readonly label: string;
  readonly rules: readonly string[];
  readonly keyframes: readonly string[];
}

const KEYFRAMES = /^@keyframes\s+(["']?)([\w-]+)\1$/;

/**
 * Splits a flourish file into rules (scoped) and keyframes (top level). Keyframes
 * are renamed nbc-<id>-<prefix>-<name>; references are rewritten only inside
 * `animation` / `animation-name` values, so a property or function that shares
 * a keyframe's name (rotate, scale) is never touched.
 */
function flourishPart(css: string, id: string, prefix: string, label: string): FlourishPart {
  const blocks = topLevelBlocks(stripComments(css));
  const names = blocks.map((b) => b.prelude.match(KEYFRAMES)?.[2]).filter((n): n is string => n !== undefined);
  const namespaced = (name: string) => `nbc-${id}-${prefix}-${name}`;
  const renameReferences = (text: string) =>
    text.replace(/(?<![\w-])(animation(?:-name)?\s*:\s*)([^;{}]*)/g, (_match, head: string, value: string) =>
      head + names.reduce((v, n) => v.replace(new RegExp(`(?<![\\w-])${n}(?![\\w-])`, 'g'), namespaced(n)), value),
    );
  const rules: string[] = [];
  const keyframes: string[] = [];
  for (const block of blocks) {
    const match = block.prelude.match(KEYFRAMES);
    if (match) keyframes.push(`@keyframes ${namespaced(match[2])} {${block.body}}`);
    else rules.push(renameReferences(`${block.prelude} {${block.body}}`));
  }
  return { label, rules, keyframes };
}

const indent = (text: string) =>
  text
    .split('\n')
    .map((line) => (line.trim() ? `  ${line}` : line))
    .join('\n');

function renderFlourishBlock(id: string, parts: readonly FlourishPart[]): string {
  const rules = parts.filter((p) => p.rules.length).map((p) => `  /* ${p.label} */\n${indent(p.rules.join('\n'))}`);
  const keyframes = parts.flatMap((p) => p.keyframes);
  if (!rules.length && !keyframes.length) return '';
  const scoped = rules.length ? `${scopePrelude(id)} {\n${rules.join('\n\n')}\n}` : '';
  return `@layer nbc.flourish {\n${[scoped, ...keyframes].filter(Boolean).join('\n\n')}\n}`;
}

export function compileTheme(theme: StudyThemeInput, options: CompileOptions = {}): CompiledTheme {
  const registry = options.families ?? FAMILIES;
  const listed = new Set<string>();
  const uses = (theme.families ?? []).map((use) => {
    const def = Object.hasOwn(registry, use.family) ? registry[use.family] : undefined;
    if (!def) throw new Error(`${theme.id}: unknown family "${use.family}"`);
    if (listed.has(use.family)) throw new Error(`${theme.id}: family "${use.family}" is listed twice`);
    listed.add(use.family);
    return { def, values: resolveParams(def, use.params, `${theme.id}/${use.family}`) };
  });

  const signature = options.signature?.trim() ? options.signature : undefined;
  const motionCss = options.motionCss?.trim() ? options.motionCss : undefined;
  const problems = [
    ...uses.flatMap(({ def }) => lintFlourishCss(def.css, `family ${def.name}`)),
    ...(signature ? lintSignature(signature, `${theme.id} signature`) : []),
    ...(motionCss ? lintMotion(motionCss, `${theme.id} motion`) : []),
  ];
  if (problems.length) throw new Error(`${theme.id}: flourish CSS problems:\n- ${problems.join('\n- ')}`);

  const tokens = compileTokens(theme);
  const ctx: FillContext = { color: (token, scheme) => resolveColor(tokens, COLOR_VARS[token], scheme) };
  const layers = uses.flatMap(({ def, values }) => def.texture?.(values, ctx) ?? []);
  if (layers.length) tokens.set('--nbc-texture', layers.join(', '));
  for (const { def, values } of uses) {
    for (const [name, value] of paramDeclarations(def, values)) tokens.set(name, value);
  }

  const parts = [
    ...uses.map(({ def }) => flourishPart(def.css, theme.id, def.name, `family: ${def.name}`)),
    ...(signature ? [flourishPart(signature, theme.id, 'signature', 'signature')] : []),
    ...(motionCss ? [flourishPart(motionCss, theme.id, 'motion', 'motion')] : []),
  ];
  const flourish = renderFlourishBlock(theme.id, parts);
  const header = `/* ${options.banner ?? `study theme: ${theme.id}`} — generated from src/study, do not edit */\n${LAYER_STATEMENT}\n`;
  const css = `${header}\n${renderTokenBlock(theme.id, tokens)}\n${flourish ? `\n${flourish}\n` : ''}`;
  return { id: theme.id, tokens, css, ...fontsOutput(theme) };
}
