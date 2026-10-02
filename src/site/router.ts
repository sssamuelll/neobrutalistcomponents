import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'components' }
  | { name: 'component'; slug: string }
  | { name: 'themes' }
  | { name: 'blocks' }
  | { name: 'start' }
  | { name: 'agents' }
  | { name: 'not-found'; path: string };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/\/+$/, '') || '/';
  if (path === '/') return { name: 'home' };
  if (path === '/components') return { name: 'components' };
  const component = path.match(/^\/components\/([a-z0-9-]+)$/);
  if (component) return { name: 'component', slug: component[1] };
  if (path === '/themes') return { name: 'themes' };
  if (path === '/blocks') return { name: 'blocks' };
  if (path === '/start') return { name: 'start' };
  if (path === '/agents') return { name: 'agents' };
  return { name: 'not-found', path };
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

/** Current hash route. Links are plain `<a href="#/…">`. */
export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '');
  return parseHash(hash);
}

export const href = (path: string) => `#${path}`;
