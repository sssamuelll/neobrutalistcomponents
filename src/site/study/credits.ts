/** Credits generated from the catalog: every font family, its licence and the themes that use it. */
import type { CatalogEntry } from '../../study/catalog';
import { fontLicense } from '../../study/fonts';
import type { FontEntry } from '../../study/fonts';

export interface FontCredit {
  readonly family: string;
  readonly license: FontEntry['license'];
  readonly usedBy: readonly CatalogEntry[];
}

export const FONT_LICENSE_URLS: Record<FontEntry['license'], string> = {
  'OFL-1.1': 'https://openfontlicense.org/',
  'Apache-2.0': 'https://www.apache.org/licenses/LICENSE-2.0',
};

export const specimenUrl = (family: string): string => `https://fonts.google.com/specimen/${family.replace(/ /g, '+')}`;

export function fontCredits(entries: readonly CatalogEntry[]): FontCredit[] {
  const byFamily = new Map<string, CatalogEntry[]>();
  for (const entry of entries) {
    for (const family of entry.fonts) byFamily.set(family, [...(byFamily.get(family) ?? []), entry]);
  }
  return [...byFamily]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([family, usedBy]) => {
      const license = fontLicense(family);
      if (!license) throw new Error(`no licence recorded for the font "${family}"`);
      return { family, license, usedBy };
    });
}
