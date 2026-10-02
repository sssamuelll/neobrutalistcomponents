import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import type { AxeMatchers } from 'vitest-axe/matchers';

// vitest-axe@0.1.0 ships an empty extend-expect.js; register matchers manually.
expect.extend(axeMatchers);

// Vitest 5 exposes `Matchers<R, T>` as the augmentation point for custom
// matchers (Assertion itself now has two type parameters).
/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars */
declare module 'vitest' {
  interface Matchers<R, T> extends AxeMatchers {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars */

// --- jsdom gaps --------------------------------------------------------------
// <dialog>.showModal()/close() and the Popover API are not implemented in
// jsdom 29. These polyfills model only the state transitions our components
// rely on; real browser behaviour is covered by the Playwright suite.

if (typeof HTMLDialogElement !== 'undefined') {
  const proto = HTMLDialogElement.prototype as HTMLDialogElement & {
    showModal: () => void;
    close: (returnValue?: string) => void;
  };
  if (!proto.showModal) {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
  }
  if (!proto.show) {
    proto.show = function show(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
  }
  if (!proto.close) {
    proto.close = function close(this: HTMLDialogElement, returnValue?: string) {
      if (!this.hasAttribute('open')) return;
      if (returnValue !== undefined) this.returnValue = returnValue;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
}

const elementProto = HTMLElement.prototype as HTMLElement & {
  showPopover?: () => void;
  hidePopover?: () => void;
  togglePopover?: (force?: boolean) => boolean;
};
if (!elementProto.showPopover) {
  elementProto.showPopover = function showPopover(this: HTMLElement) {
    this.setAttribute('data-popover-open', '');
  };
  elementProto.hidePopover = function hidePopover(this: HTMLElement) {
    this.removeAttribute('data-popover-open');
  };
}
