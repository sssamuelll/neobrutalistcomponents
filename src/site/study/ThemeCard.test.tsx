import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SitePrefsContext } from '../prefsContext';
import { ENTRIES } from './data';
import { Island } from './ThemeCard';

const fontLinks = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[data-nbc-fonts]')].map((link) => link.href);
const ctx = { prefs: { theme: 'classic', mode: 'native' as const }, update: () => undefined };
const show = (id: string, withFonts?: boolean) =>
  render(
    <SitePrefsContext value={ctx}>
      <Island entry={ENTRIES.get(id)!} className="x" withFonts={withFonts}>
        <span>chip</span>
      </Island>
    </SitePrefsContext>,
  );

afterEach(() => {
  for (const link of document.head.querySelectorAll('link')) link.remove();
});

describe('Island', () => {
  it('paints with the catalog tokens and leaves the fonts alone when told to', () => {
    const { container } = show('dragon-quest', false);
    expect(container.firstElementChild).toHaveAttribute('data-theme', 'dragon-quest');
    expect(fontLinks()).toEqual([]);
  });

  it('loads the theme’s full fonts by default', () => {
    show('win95');
    expect(fontLinks()).toEqual([ENTRIES.get('win95')!.fontsHref]);
  });
});
