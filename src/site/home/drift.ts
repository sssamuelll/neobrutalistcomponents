/** The ribbon's drift as pure steps: the hook in ThemeRibbon feeds it time and events. */

/** Pixels per second. */
export const DRIFT_SPEED = 40;
/** How long the ribbon waits after a finger lifts before it drifts again. */
export const TOUCH_RESUME_MS = 3000;

/** The next scroll offset: advance by speed × elapsed time, and wrap once a whole copy of the list has passed. */
export function nextScroll(left: number, elapsedMs: number, loopWidth: number, speed = DRIFT_SPEED): number {
  if (loopWidth <= 0) return left;
  const next = left + (speed * elapsedMs) / 1000;
  return next >= loopWidth ? next - loopWidth : next;
}

export interface DriftHold {
  hover: boolean;
  focus: boolean;
  /** performance.now() until which a touch holds the ribbon; Infinity while a finger is down. */
  touchUntil: number;
  hidden: boolean;
  reduced: boolean;
}

export const isHeld = (hold: DriftHold, now: number): boolean => hold.reduced || hold.hidden || hold.hover || hold.focus || now < hold.touchUntil;
