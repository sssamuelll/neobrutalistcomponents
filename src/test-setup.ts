import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import type { AxeMatchers } from 'vitest-axe/matchers';

// vitest-axe@0.1.0 ships an empty extend-expect.js; register matchers manually.
expect.extend(axeMatchers);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module 'vitest' {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
