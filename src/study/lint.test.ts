import { describe, expect, it } from 'vitest';
import { lintFlourishCss, lintSignature } from './lint';

describe('lintFlourishCss', () => {
  it('accepts token colors, color-mix of tokens and pseudo-element geometry', () => {
    const css = `/* fine */
.nbc-card__footer::before {
  content: '';
  inline-size: 40px;
  block-size: 24px;
  border: 3px solid var(--nbc-primary);
  background: color-mix(in srgb, var(--nbc-accent) 30%, transparent);
}
:scope {
  background: var(--nbc-texture), var(--nbc-bg);
}
@media (prefers-reduced-motion: no-preference) {
  .nbc-button { transition-duration: var(--nbc-duration-slow); }
}
@keyframes fx-pulse { to { opacity: 0.5; } }`;
    expect(lintFlourishCss(css, 'fine')).toEqual([]);
  });

  it.each([
    ['.nbc-card { color: #ff0000; }', /literal color/],
    ['.nbc-card { background: rgb(0 0 0 / 50%); }', /literal color/],
    ['.nbc-card { border-color: rebeccapurple; }', /literal color/],
    ['.nbc-card { --fx-x: oklch(70% 0.1 200); }', /literal color/],
    ['.nbc-button { padding-inline: 4px; }', /control geometry/],
    ['.nbc-input__control { min-height: 50px; }', /control geometry/],
    ['.nbc-card__title { font: 700 20px serif; }', /control geometry/],
    ['.nbc-card::before, .nbc-card { block-size: 4px; }', /control geometry/],
    ['.nbc-card { &:hover { color: var(--nbc-fg); } }', /nesting/],
    ['[data-theme="x"] .nbc-card { color: var(--nbc-fg); }', /data-theme/],
    ['@layer nbc.flourish { .nbc-card { color: var(--nbc-fg); } }', /@layer/],
    ['.nbc-card { background: url("data:image/svg+xml,<svg/>"); }', /data: URIs/],
    ['@import "x.css";', /@import/],
  ])('rejects %s', (css, message) => {
    expect(lintFlourishCss(css, 'bad').join('\n')).toMatch(message);
  });
});

describe('lintFlourishCss closes the bypasses found in review', () => {
  it.each([
    ['.nbc-card { color: var(--nbc-nope, #f00); }', /literal color/],
    ['@keyframes fx-x { to { background: #f00; } }', /literal color/],
    ['@keyframes fx-x { to { height: 300px; } }', /control geometry/],
    ['.nbc-card { --nbc-texture: linear-gradient(var(--nbc-fg), var(--nbc-fg)); }', /only --fx-\* custom properties/],
    ['.nbc-card { --nbc-fg: var(--nbc-surface); }', /only --fx-\* custom properties/],
    ['.nbc-button { --_h: 80px; }', /only --fx-\* custom properties/],
    ['.nbc-button { --nbc-control-h-md: 80px; }', /only --fx-\* custom properties/],
    ['.nbc-button { zoom: 1.5; }', /control geometry/],
    ['.nbc-button { box-sizing: content-box; }', /control geometry/],
    ['.nbc-button { all: unset; }', /control geometry/],
    ['.nbc-card { background: url(https://example.org/x.png); }', /no images/],
    ['.nbc-card { background: image-set("x.png" 1x); }', /no images/],
  ])('rejects %s', (css, message) => {
    expect(lintFlourishCss(css, 'bypass').join('\n')).toMatch(message);
  });

  it('allows --fx-* custom properties and does not read strings as colors', () => {
    const css = `.nbc-card { --fx-ink: var(--nbc-fg); }
.nbc-card::before { content: "Black"; }
.nbc-card::after { content: '#fab'; }`;
    expect(lintFlourishCss(css, 'fine')).toEqual([]);
  });
});

describe('lintSignature', () => {
  it('limits signatures to 60 non-blank, non-comment lines', () => {
    const line = '.nbc-card { color: var(--nbc-fg); }';
    expect(lintSignature(`${Array(60).fill(line).join('\n')}\n/* a comment */\n\n`, 'sig')).toEqual([]);
    expect(lintSignature(Array(61).fill(line).join('\n'), 'sig').join('\n')).toMatch(/61 lines, the limit is 60/);
  });
});
