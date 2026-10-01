import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
  it('uncontrolled: starts at default, updates, and notifies', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState<string>(undefined, 'a', onChange));
    expect(result.current[0]).toBe('a');
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('controlled: reflects the prop and only notifies', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(({ value }) => useControllableState<string>(value, 'a', onChange), {
      initialProps: { value: 'x' as string | undefined },
    });
    expect(result.current[0]).toBe('x');
    act(() => result.current[1]('y'));
    expect(result.current[0]).toBe('x');
    expect(onChange).toHaveBeenCalledWith('y');
    rerender({ value: 'y' });
    expect(result.current[0]).toBe('y');
  });

  it('does not notify when setting the current value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState<string>(undefined, 'a', onChange));
    act(() => result.current[1]('a'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
