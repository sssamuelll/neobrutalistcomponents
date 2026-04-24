import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import type { AxeMatchers } from 'vitest-axe/matchers';

// vitest-axe@0.1.0 ships an empty extend-expect.js; register matchers manually.
expect.extend(axeMatchers);

// Module augmentation: attach the axe matchers to Vitest's Assertion interface
// so tsc recognises e.g. expect(result).toHaveNoViolations(). The empty-interface
// and any usages below are the canonical TS pattern for this kind of augmentation
// and unavoidable — we must match vitest's own signatures.
/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
declare module 'vitest' {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
