/** Small formatting helpers shared by the study pages. */
import type { ImageLicense, Lang, Reference, Scene } from '../../study/types';
import { toHash } from '../router';

export const LICENSE_URLS: Record<ImageLicense, string> = {
  'CC0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
  PD: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
  'CC-BY-1.0': 'https://creativecommons.org/licenses/by/1.0/',
  'CC-BY-2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'CC-BY-2.5': 'https://creativecommons.org/licenses/by/2.5/',
  'CC-BY-3.0': 'https://creativecommons.org/licenses/by/3.0/',
  'CC-BY-4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC-BY-SA-1.0': 'https://creativecommons.org/licenses/by-sa/1.0/',
  'CC-BY-SA-2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
  'CC-BY-SA-2.5': 'https://creativecommons.org/licenses/by-sa/2.5/',
  'CC-BY-SA-3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC-BY-SA-4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
};

/** 'CC-BY-SA-4.0' → 'CC BY-SA 4.0'; 'PD' → 'public domain' / 'dominio público'. */
export function licenseName(license: ImageLicense, lang: Lang): string {
  if (license === 'PD') return lang === 'es' ? 'dominio público' : 'public domain';
  if (license === 'CC0-1.0') return 'CC0';
  return license.replace(/^CC-/, 'CC ').replace(/-(\d)/, ' $1');
}

/** Where a reference's original title goes: in a parenthesis after the title, or inside the one the title already ends with. */
export function aroundOriginal(title: string): { before: string; after: string } {
  return title.endsWith(')') ? { before: `${title.slice(0, -1)}; `, after: ')' } : { before: `${title} (`, after: ')' };
}

export const years = (date: Reference['date']): string => (typeof date === 'number' ? String(date) : `${date[0]}–${date[1]}`);

export const startYear = (date: Reference['date']): number => (typeof date === 'number' ? date : date[0]);

/** First–last of a room's start years: '1963–2014', one year alone, '—' for a room with no works yet. */
export function yearSpan(starts: readonly number[]): string {
  if (!starts.length) return '—';
  const first = Math.min(...starts);
  const last = Math.max(...starts);
  return first === last ? String(first) : `${first}–${last}`;
}

/** The page of a scene; Origins has its own. */
export const sceneHref = (lang: Lang, scene: Scene): string => toHash(lang, scene === 'origins' ? '/origins' : `/scene/${scene}`);

/** 'https://commons.wikimedia.org/wiki/File:SESC_Pompeia_-_S%C3%A3o_Paulo.jpg' → 'SESC Pompeia - São Paulo.jpg'. */
export function commonsTitle(sourceUrl: string): string {
  const name = sourceUrl.slice(sourceUrl.lastIndexOf('/') + 1).replace(/^File:/, '');
  let decoded = name;
  try {
    decoded = decodeURIComponent(name);
  } catch {
    // A malformed escape: show the title as written.
  }
  return decoded.replace(/_/g, ' ');
}
