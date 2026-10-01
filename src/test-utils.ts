import { configureAxe } from 'vitest-axe';

/**
 * Shared axe instance for component tests.
 *
 * jsdom has no layout or paint, so axe's color-contrast rule can only produce
 * noise ("HTMLCanvasElement.getContext not implemented"). Contrast is gated
 * instead by the token contract test (src/lib/themes/contract.test.ts) and by
 * the Playwright + axe pass against the real site.
 */
export const axe = configureAxe({
  rules: { 'color-contrast': { enabled: false } },
});
