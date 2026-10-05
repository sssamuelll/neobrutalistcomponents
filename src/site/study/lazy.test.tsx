import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useLazy } from './lazy';

describe('useLazy', () => {
  it('reports loading, then the value', async () => {
    const { result } = renderHook(() => useLazy('a', () => Promise.resolve(42)));
    expect(result.current).toEqual({ status: 'loading' });
    await waitFor(() => expect(result.current).toEqual({ status: 'ready', value: 42 }));
  });

  it('reports an error instead of loading forever', async () => {
    const { result } = renderHook(() => useLazy('b', () => Promise.reject(new Error('offline'))));
    await waitFor(() => expect(result.current).toEqual({ status: 'error' }));
  });

  it('ignores a load that finishes after the key changed', async () => {
    let finishSlow: (value: string) => void = () => undefined;
    const loads: Record<string, () => Promise<string>> = {
      slow: () => new Promise((resolve) => (finishSlow = resolve)),
      fast: () => Promise.resolve('fast'),
    };
    const { result, rerender } = renderHook(({ id }) => useLazy(id, loads[id]), { initialProps: { id: 'slow' } });
    rerender({ id: 'fast' });
    await waitFor(() => expect(result.current).toEqual({ status: 'ready', value: 'fast' }));
    await act(async () => finishSlow('slow'));
    expect(result.current).toEqual({ status: 'ready', value: 'fast' });
  });
});
