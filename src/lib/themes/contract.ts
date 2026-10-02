/**
 * The token contract — the closed set of custom properties a theme defines.
 *
 * Every built-in theme declares every token below explicitly (no hidden
 * defaults), and the contract test (`contract.test.ts`) enforces it together
 * with the WCAG contrast pairs. BYO themes may omit tokens: `tokens.css`
 * provides neutral defaults for all of them.
 */

/** The cascade-layer order every entry stylesheet declares first. */
export const LAYER_STATEMENT =
  '@layer nbc.tokens, nbc.theme, nbc.base, nbc.components, nbc.flourish;';

/** Solid colors. Must be `#hex` or `light-dark(#hex, #hex)` in built-in themes. */
export const COLOR_TOKENS = [
  '--nbc-bg',
  '--nbc-fg',
  '--nbc-fg-muted',
  '--nbc-surface',
  '--nbc-surface-alt',
  '--nbc-border-color',
  '--nbc-primary',
  '--nbc-primary-fg',
  '--nbc-accent',
  '--nbc-accent-fg',
  '--nbc-info',
  '--nbc-info-fg',
  '--nbc-success',
  '--nbc-success-fg',
  '--nbc-warning',
  '--nbc-warning-fg',
  '--nbc-danger',
  '--nbc-danger-fg',
  '--nbc-focus',
] as const;

/** Background fills. May be gradients; every color stop is contrast-checked. */
export const FILL_TOKENS = [
  '--nbc-primary-fill',
  '--nbc-danger-fill',
  '--nbc-surface-fill',
  '--nbc-texture',
] as const;

export const TYPOGRAPHY_TOKENS = [
  '--nbc-font-sans',
  '--nbc-font-display',
  '--nbc-font-mono',
  '--nbc-weight-body',
  '--nbc-weight-label',
  '--nbc-weight-display',
  '--nbc-label-transform',
  '--nbc-label-spacing',
  '--nbc-display-transform',
  '--nbc-display-spacing',
] as const;

export const SHAPE_TOKENS = [
  '--nbc-border-width',
  '--nbc-border-style',
  '--nbc-radius',
  '--nbc-radius-control',
  '--nbc-radius-button',
  '--nbc-radius-small',
] as const;

export const ELEVATION_TOKENS = [
  '--nbc-shadow',
  '--nbc-shadow-lg',
  '--nbc-shadow-press',
  '--nbc-press',
  '--nbc-press-active',
  '--nbc-rotate',
  '--nbc-focus-width',
  '--nbc-focus-offset',
] as const;

export const MOTION_TOKENS = ['--nbc-duration', '--nbc-duration-slow', '--nbc-ease'] as const;

/** Every token a built-in theme must declare. */
export const REQUIRED_TOKENS = [
  '--nbc-scheme',
  ...TYPOGRAPHY_TOKENS,
  ...COLOR_TOKENS,
  ...FILL_TOKENS,
  ...SHAPE_TOKENS,
  ...ELEVATION_TOKENS,
  ...MOTION_TOKENS,
] as const;

/** Invariant across themes. Defined once in tokens.css; themes must not override. */
export const INVARIANT_TOKENS = [
  '--nbc-space-xs',
  '--nbc-space-sm',
  '--nbc-space-md',
  '--nbc-space-lg',
  '--nbc-space-xl',
  '--nbc-space-2xl',
  '--nbc-space-3xl',
  '--nbc-fs-xs',
  '--nbc-fs-sm',
  '--nbc-fs-md',
  '--nbc-fs-lg',
  '--nbc-fs-xl',
  '--nbc-fs-2xl',
  '--nbc-fs-3xl',
  '--nbc-fs-4xl',
  '--nbc-control-h-sm',
  '--nbc-control-h-md',
  '--nbc-control-h-lg',
] as const;

export interface ContrastPair {
  fg: string;
  bg: string;
  /** WCAG 2.2 minimum: 4.5 for text, 3 for non-text UI (SC 1.4.11). */
  min: 3 | 4.5;
  why: string;
}

export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  { fg: '--nbc-fg', bg: '--nbc-bg', min: 4.5, why: 'body text on page' },
  { fg: '--nbc-fg', bg: '--nbc-surface', min: 4.5, why: 'text on cards and fields' },
  { fg: '--nbc-fg', bg: '--nbc-surface-alt', min: 4.5, why: 'text on hover rows, stripes' },
  { fg: '--nbc-fg', bg: '--nbc-surface-fill', min: 4.5, why: 'text on filled surfaces' },
  { fg: '--nbc-fg-muted', bg: '--nbc-surface', min: 4.5, why: 'descriptions and placeholders' },
  { fg: '--nbc-fg-muted', bg: '--nbc-bg', min: 4.5, why: 'secondary page text' },
  { fg: '--nbc-primary-fg', bg: '--nbc-primary', min: 4.5, why: 'primary button label' },
  { fg: '--nbc-primary-fg', bg: '--nbc-primary-fill', min: 4.5, why: 'primary button label on fill' },
  { fg: '--nbc-accent-fg', bg: '--nbc-accent', min: 4.5, why: 'accent badge label' },
  { fg: '--nbc-info-fg', bg: '--nbc-info', min: 4.5, why: 'info badge label' },
  { fg: '--nbc-success-fg', bg: '--nbc-success', min: 4.5, why: 'success badge label' },
  { fg: '--nbc-warning-fg', bg: '--nbc-warning', min: 4.5, why: 'warning badge label' },
  { fg: '--nbc-danger-fg', bg: '--nbc-danger', min: 4.5, why: 'danger badge label' },
  { fg: '--nbc-danger-fg', bg: '--nbc-danger-fill', min: 4.5, why: 'danger button label' },
  { fg: '--nbc-danger', bg: '--nbc-surface', min: 4.5, why: 'error messages' },
  { fg: '--nbc-border-color', bg: '--nbc-bg', min: 3, why: 'control boundaries' },
  { fg: '--nbc-focus', bg: '--nbc-bg', min: 3, why: 'focus indicator' },
];
