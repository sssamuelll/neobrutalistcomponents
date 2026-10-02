import { createContext, use } from 'react';
import type { SitePrefs } from './prefs';

export interface SitePrefsContextValue {
  prefs: SitePrefs;
  update: (next: Partial<SitePrefs>) => void;
}

export const SitePrefsContext = createContext<SitePrefsContextValue | null>(null);

export function useSitePrefsContext(): SitePrefsContextValue {
  const ctx = use(SitePrefsContext);
  if (!ctx) throw new Error('useSitePrefsContext must be used inside the site App');
  return ctx;
}
