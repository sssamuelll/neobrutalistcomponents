import { useEffect, useState } from 'react';

export type Lazy<T> = { readonly status: 'loading' } | { readonly status: 'ready'; readonly value: T } | { readonly status: 'error' };

/**
 * Loads once per key, for the study's lazy chunks (a theme's data, an essay).
 * A failed load reports 'error' instead of loading forever, and a load that
 * finishes after the key changed is ignored.
 */
export function useLazy<T>(key: string, load: () => Promise<T>): Lazy<T> {
  const [state, setState] = useState<{ key: string; lazy: Lazy<T> } | null>(null);
  useEffect(() => {
    let live = true;
    load().then(
      (value) => live && setState({ key, lazy: { status: 'ready', value } }),
      () => live && setState({ key, lazy: { status: 'error' } }),
    );
    return () => {
      live = false;
    };
    // The key names what is loaded; `load` is a fresh closure on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state?.key === key ? state.lazy : { status: 'loading' };
}
