import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectLang, rememberLang } from './lang';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('detectLang', () => {
  it('uses the remembered language first', () => {
    rememberLang('es');
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    expect(detectLang()).toBe('es');
  });

  it('falls back to the browser language: es* → es, anything else → en', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('es-MX');
    expect(detectLang()).toBe('es');
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-DE');
    expect(detectLang()).toBe('en');
  });

  it('ignores a corrupted stored value', () => {
    localStorage.setItem('nbc-site-lang', 'klingon');
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-GB');
    expect(detectLang()).toBe('en');
  });
});
