import type { CSSProperties, Ref, RefCallback } from 'react';
import { cx } from './cx';

type AnyProps = Record<string, unknown>;

/**
 * Combines refs into one callback ref. Returns a React 19 cleanup so each
 * ref is reset (or its own cleanup runs) when the node detaches.
 */
export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node: T | null) => {
    const cleanups: Array<() => void> = [];
    for (const ref of refs) {
      if (typeof ref === 'function') {
        const cleanup = ref(node);
        cleanups.push(typeof cleanup === 'function' ? cleanup : () => ref(null));
      } else if (ref) {
        ref.current = node;
        cleanups.push(() => {
          ref.current = null;
        });
      }
    }
    return () => cleanups.forEach((cleanup) => cleanup());
  };
}

const isHandler = (key: string) => /^on[A-Z]/.test(key);

/**
 * Merges the props a component wants to put on an element (`slot`) with the
 * props the consumer already put on it (`child`):
 * - `className` is joined (slot first),
 * - `style` is merged with the child winning per property,
 * - event handlers are chained, child first; the slot handler is skipped if
 *   the child called `preventDefault()`,
 * - refs are composed,
 * - for everything else the child's explicit value wins.
 */
export function mergeProps(slot: AnyProps, child: AnyProps): AnyProps {
  const merged: AnyProps = { ...slot };
  for (const key of Object.keys(child)) {
    const slotValue = slot[key];
    const childValue = child[key];
    if (key === 'className') {
      merged.className = cx(slotValue as string, childValue as string);
    } else if (key === 'style') {
      merged.style = { ...(slotValue as CSSProperties), ...(childValue as CSSProperties) };
    } else if (key === 'ref') {
      merged.ref = slotValue ? composeRefs(slotValue as Ref<unknown>, childValue as Ref<unknown>) : childValue;
    } else if (isHandler(key) && typeof slotValue === 'function' && typeof childValue === 'function') {
      merged[key] = (...args: unknown[]) => {
        childValue(...args);
        const event = args[0] as { defaultPrevented?: boolean } | undefined;
        if (!event?.defaultPrevented) slotValue(...args);
      };
    } else if (childValue !== undefined) {
      merged[key] = childValue;
    }
  }
  return merged;
}
