import { useSyncExternalStore } from 'react';
import { LANGS, THEME_SCENES } from '../study/types';
import type { Lang, ThemeScene } from '../study/types';

export type Route =
  | { name: 'study' }
  | { name: 'scenes' }
  | { name: 'scene'; scene: ThemeScene }
  | { name: 'atlas' }
  | { name: 'theme'; id: string }
  | { name: 'origins' }
  | { name: 'method' }
  | { name: 'credits' }
  | { name: 'library' }
  | { name: 'components' }
  | { name: 'component'; slug: string }
  | { name: 'blocks' }
  | { name: 'start' }
  | { name: 'agents' }
  | { name: 'not-found'; path: string };

/** A parsed hash: a page in a language, or a legacy address to redirect. */
export type Location =
  | {
      readonly kind: 'page';
      readonly lang: Lang;
      readonly route: Route;
      /** The path without the language prefix, e.g. '/atlas'. */
      readonly path: string;
      /** The hash's own query, e.g. #/es/atlas?scene=japan. */
      readonly query: URLSearchParams;
    }
  | { readonly kind: 'redirect'; readonly to: string };

const SIMPLE: Readonly<Record<string, Route>> = {
  '/': { name: 'study' },
  '/scenes': { name: 'scenes' },
  '/atlas': { name: 'atlas' },
  '/origins': { name: 'origins' },
  '/method': { name: 'method' },
  '/credits': { name: 'credits' },
  '/library': { name: 'library' },
  '/components': { name: 'components' },
  '/blocks': { name: 'blocks' },
  '/start': { name: 'start' },
  '/agents': { name: 'agents' },
};

const isLang = (value: string): value is Lang => (LANGS as readonly string[]).includes(value);
const isThemeScene = (value: string): value is ThemeScene => (THEME_SCENES as readonly string[]).includes(value);

export function routeOf(path: string): Route {
  if (Object.hasOwn(SIMPLE, path)) return SIMPLE[path];
  const scene = path.match(/^\/scene\/([a-z]+)$/);
  if (scene && isThemeScene(scene[1])) return { name: 'scene', scene: scene[1] };
  const theme = path.match(/^\/theme\/([a-z][a-z0-9-]{1,31})$/);
  if (theme) return { name: 'theme', id: theme[1] };
  const component = path.match(/^\/components\/([a-z0-9-]+)$/);
  if (component) return { name: 'component', slug: component[1] };
  return { name: 'not-found', path };
}

/** '#/es/atlas?scene=japan' for ('es', '/atlas', scene=japan). */
export function toHash(lang: Lang, path: string, query?: URLSearchParams): string {
  const search = query && query.size > 0 ? `?${query}` : '';
  return `#/${lang}${path === '/' ? '/' : path}${search}`;
}

export function parseHash(hash: string, fallback: Lang): Location {
  const raw = hash.replace(/^#/, '');
  const cut = raw.indexOf('?');
  const pathPart = cut === -1 ? raw : raw.slice(0, cut);
  const query = new URLSearchParams(cut === -1 ? '' : raw.slice(cut + 1));
  const path = pathPart.replace(/\/+$/, '') || '/';
  const first = path.split('/')[1] ?? '';
  if (isLang(first)) {
    const rest = path.slice(first.length + 1) || '/';
    return { kind: 'page', lang: first, route: routeOf(rest), path: rest, query };
  }
  // A legacy address without a language: keep it, add one. The old Themes page is now the atlas.
  return { kind: 'redirect', to: toHash(fallback, path === '/themes' ? '/atlas' : path, query) };
}

/**
 * Replaces the hash without adding a history entry, and tells useHash() at
 * once — so a controlled field bound to the URL (the atlas search) never
 * loses a keystroke waiting for an asynchronous hashchange.
 */
export function replaceHash(hash: string): void {
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hash}`);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

/** The current hash, kept in sync with the address bar. Links are plain `<a href="#/…">`. */
export function useHash(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash, () => '');
}
