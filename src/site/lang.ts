import { LANGS } from '../study/types';
import type { Lang } from '../study/types';

const KEY = 'nbc-site-lang';

/** The language for an address that carries none: the last one used, else the browser's. */
export function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored && (LANGS as readonly string[]).includes(stored)) return stored as Lang;
  } catch {
    // storage can be unavailable (private mode)
  }
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function rememberLang(lang: Lang): void {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // the URL still carries the language
  }
}
