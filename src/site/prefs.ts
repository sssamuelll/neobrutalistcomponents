import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { NEO_MODES, NEO_THEMES } from 'neobrutalistcomponents';
import type { NeoBuiltinTheme, NeoMode } from 'neobrutalistcomponents';

/** `native` = leave NeoProvider's mode unset (the theme's own scheme). */
export type ModePref = NeoMode | 'native';

export interface SitePrefs {
  theme: NeoBuiltinTheme;
  mode: ModePref;
}

const STORAGE_KEY = 'nbc-site-prefs';

const isTheme = (v: unknown): v is NeoBuiltinTheme => NEO_THEMES.includes(v as NeoBuiltinTheme);
const isMode = (v: unknown): v is ModePref => v === 'native' || NEO_MODES.includes(v as NeoMode);

function readStored(): Partial<SitePrefs> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<SitePrefs>;
  } catch {
    return {};
  }
}

/** URL (?theme=&mode=) wins, then localStorage, then classic in its native scheme. */
function readInitial(): SitePrefs {
  const params = new URLSearchParams(window.location.search);
  const stored = readStored();
  return {
    theme: [params.get('theme'), stored.theme].find(isTheme) ?? 'classic',
    mode: [params.get('mode'), stored.mode].find(isMode) ?? 'native',
  };
}

function syncUrl({ theme, mode }: SitePrefs) {
  const url = new URL(window.location.href);
  url.searchParams.set('theme', theme);
  if (mode === 'native') url.searchParams.delete('mode');
  else url.searchParams.set('mode', mode);
  window.history.replaceState(window.history.state, '', url);
}

/**
 * Theme + mode for the whole site. Changes run inside a View Transition
 * (skipped under reduced motion), persist to localStorage and are mirrored in
 * the URL so every view can be deep-linked.
 */
export function useSitePrefs() {
  const [prefs, setPrefs] = useState<SitePrefs>(readInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // storage can be unavailable (private mode); the URL still carries the choice
    }
    syncUrl(prefs);
    const root = document.documentElement;
    root.dataset.theme = prefs.theme;
    if (prefs.mode === 'native') delete root.dataset.mode;
    else root.dataset.mode = prefs.mode;
  }, [prefs]);

  const update = useCallback((next: Partial<SitePrefs>) => {
    const apply = () => flushSync(() => setPrefs((current) => ({ ...current, ...next })));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition === 'function' && !reduced) document.startViewTransition(apply);
    else apply();
  }, []);

  return [prefs, update] as const;
}
