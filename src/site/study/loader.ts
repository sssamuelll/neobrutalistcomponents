/**
 * Study themes load on demand: the main bundle holds only their stylesheet
 * URLs, and a theme's CSS is fetched the first time a page shows it or the
 * site switches to it. Core themes are always loaded (src/main.tsx).
 */
import { useEffect, useState } from 'react';
import { NEO_THEMES } from 'neobrutalistcomponents';
import { ENTRIES } from './data';

const STYLESHEETS: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>(['../../study/.generated/themes/*.css', '!../../study/.generated/themes/*.fonts.css'], {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  ).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -'.css'.length), url]),
);

const CORE: ReadonlySet<string> = new Set(NEO_THEMES);

/** A core theme or a theme of the study. */
export const isKnownTheme = (id: string): boolean => CORE.has(id) || (ENTRIES.has(id) && Object.hasOwn(STYLESHEETS, id));

const pending = new Map<string, Promise<void>>();
const loaded = new Set<string>();

/** Loads a study theme's stylesheet once; resolves at once for core themes. */
export function loadThemeStylesheet(id: string): Promise<void> {
  if (CORE.has(id)) return Promise.resolve();
  if (!isKnownTheme(id)) return Promise.reject(new Error(`unknown theme "${id}"`));
  const existing = pending.get(id);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STYLESHEETS[id];
    link.dataset.nbcTheme = id;
    link.addEventListener('load', () => {
      loaded.add(id);
      resolve();
    });
    link.addEventListener('error', () => {
      pending.delete(id);
      link.remove();
      reject(new Error(`could not load the stylesheet of "${id}"`));
    });
    document.head.append(link);
  });
  pending.set(id, promise);
  return promise;
}

const fontLinks = new Set<string>();

/** Adds a Google Fonts stylesheet once. Core themes' fonts come from index.html. */
export function loadFonts(href: string | null | undefined): void {
  if (!href || fontLinks.has(href)) return;
  fontLinks.add(href);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.nbcFonts = '';
  document.head.append(link);
}

export type ThemeStatus = 'ready' | 'loading' | 'error';

const statusNow = (id: string): ThemeStatus => (CORE.has(id) || loaded.has(id) ? 'ready' : 'loading');

/** Loads a theme's stylesheet and fonts; 'ready' once its tokens are in the page. */
export function useThemeStylesheet(id: string): ThemeStatus {
  const [state, setState] = useState(() => ({ id, status: statusNow(id) }));
  useEffect(() => {
    let live = true;
    loadFonts(ENTRIES.get(id)?.predatesStudy === false ? ENTRIES.get(id)?.fontsHref : null);
    loadThemeStylesheet(id).then(
      () => live && setState({ id, status: 'ready' }),
      () => live && setState({ id, status: 'error' }),
    );
    return () => {
      live = false;
    };
  }, [id]);
  return state.id === id ? state.status : statusNow(id);
}
