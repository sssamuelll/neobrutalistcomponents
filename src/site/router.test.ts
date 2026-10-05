import { describe, expect, it } from 'vitest';
import { parseHash, replaceHash, routeOf, toHash } from './router';

describe('parseHash', () => {
  it('reads the language prefix and the route', () => {
    expect(parseHash('#/es/atlas', 'en')).toMatchObject({ kind: 'page', lang: 'es', route: { name: 'atlas' }, path: '/atlas' });
    expect(parseHash('#/en/', 'es')).toMatchObject({ kind: 'page', lang: 'en', route: { name: 'study' }, path: '/' });
    expect(parseHash('#/es', 'en')).toMatchObject({ kind: 'page', lang: 'es', route: { name: 'study' } });
  });

  it('keeps the query inside the hash', () => {
    const location = parseHash('#/en/atlas?scene=japan&q=%E4%B8%AD%E9%8A%80', 'en');
    expect(location.kind === 'page' && location.query.get('q')).toBe('中銀');
    expect(location.kind === 'page' && location.query.get('scene')).toBe('japan');
  });

  it('redirects legacy addresses, keeping their path, into the fallback language', () => {
    expect(parseHash('', 'es')).toEqual({ kind: 'redirect', to: '#/es/' });
    expect(parseHash('#/', 'en')).toEqual({ kind: 'redirect', to: '#/en/' });
    expect(parseHash('#/components/button', 'en')).toEqual({ kind: 'redirect', to: '#/en/components/button' });
    expect(parseHash('#/start', 'es')).toEqual({ kind: 'redirect', to: '#/es/start' });
  });

  it('sends the old Themes page to the atlas', () => {
    expect(parseHash('#/themes', 'es')).toEqual({ kind: 'redirect', to: '#/es/atlas' });
  });
});

describe('routeOf', () => {
  it.each([
    ['/scenes', { name: 'scenes' }],
    ['/scene/japan', { name: 'scene', scene: 'japan' }],
    ['/theme/sesc-pompeia', { name: 'theme', id: 'sesc-pompeia' }],
    ['/origins', { name: 'origins' }],
    ['/method', { name: 'method' }],
    ['/credits', { name: 'credits' }],
    ['/library', { name: 'library' }],
    ['/components/button', { name: 'component', slug: 'button' }],
  ])('%s', (path, route) => {
    expect(routeOf(path)).toEqual(route);
  });

  it('origins is its own page, not a scene; unknown paths are not found', () => {
    expect(routeOf('/scene/origins')).toEqual({ name: 'not-found', path: '/scene/origins' });
    expect(routeOf('/theme/Bad_Id')).toEqual({ name: 'not-found', path: '/theme/Bad_Id' });
    expect(routeOf('/constructor')).toEqual({ name: 'not-found', path: '/constructor' });
  });
});

describe('toHash', () => {
  it('prefixes the language and appends a non-empty query', () => {
    expect(toHash('es', '/')).toBe('#/es/');
    expect(toHash('en', '/atlas', new URLSearchParams({ scene: 'latam' }))).toBe('#/en/atlas?scene=latam');
    expect(toHash('en', '/atlas', new URLSearchParams())).toBe('#/en/atlas');
  });
});

describe('replaceHash', () => {
  it('changes the hash without a history entry and notifies listeners synchronously', () => {
    const before = window.history.length;
    let heard = '';
    const listener = () => {
      heard = window.location.hash;
    };
    window.addEventListener('hashchange', listener);
    replaceHash('#/es/atlas?scene=latam');
    window.removeEventListener('hashchange', listener);
    expect(heard).toBe('#/es/atlas?scene=latam');
    expect(window.history.length).toBe(before);
  });
});
