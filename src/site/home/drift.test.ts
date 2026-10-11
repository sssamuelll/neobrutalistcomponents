import { describe, expect, it } from 'vitest';
import { isHeld, nextScroll } from './drift';

const free = { hover: false, focus: false, touchUntil: 0, hidden: false, reduced: false };

describe('nextScroll', () => {
  it('advances 40 px per second', () => {
    expect(nextScroll(100, 500, 2000)).toBe(120);
  });

  it('wraps once a whole copy of the list has passed, so the loop has no seam', () => {
    expect(nextScroll(1990, 500, 2000)).toBe(10);
  });

  it('stays put before the list is measured', () => {
    expect(nextScroll(15, 500, 0)).toBe(15);
  });
});

describe('isHeld', () => {
  it('drifts only when nothing holds it', () => {
    expect(isHeld(free, 1000)).toBe(false);
  });

  it('holds under the pointer, with focus inside, on a hidden page and under reduced motion', () => {
    expect(isHeld({ ...free, hover: true }, 1000)).toBe(true);
    expect(isHeld({ ...free, focus: true }, 1000)).toBe(true);
    expect(isHeld({ ...free, hidden: true }, 1000)).toBe(true);
    expect(isHeld({ ...free, reduced: true }, 1000)).toBe(true);
  });

  it('holds while a finger is down and until 3 s after it lifts', () => {
    expect(isHeld({ ...free, touchUntil: Infinity }, 1000)).toBe(true);
    expect(isHeld({ ...free, touchUntil: 4000 }, 3999)).toBe(true);
    expect(isHeld({ ...free, touchUntil: 4000 }, 4000)).toBe(false);
  });
});
