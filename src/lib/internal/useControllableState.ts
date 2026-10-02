import { useCallback, useState } from 'react';

/**
 * State that is controlled when `value` is defined and uncontrolled
 * otherwise. The setter always calls `onChange` (only when the value actually
 * changes) and only stores the value itself in the uncontrolled case.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = useCallback(
    (next: T) => {
      if (Object.is(next, current)) return;
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, current, onChange],
  );
  return [current, set];
}
